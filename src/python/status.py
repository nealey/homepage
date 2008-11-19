#! /usr/bin/python

"""Status dealiemajigger for dzen2 (or others, probably).

This outputs:

  * Debian packages in need of upgrade (if you have the apt module)
  * master volume (if you have alsa)
  * battery life (if you have a battery)
  * load average if it goes over 0.25
  * current date and time

It prints it again whenever any of these change.  It also watches for Mute,
Volume Up, and Volume Down key events on multimedia keyboards, and adjusts
the mixer appropriately.

Lastly, it registers itself with D-Bus so you can send yourself notices
like so:

    $ dbus-send --dest=org.woozle.Status \
                /org/woozle/Status \
                org.woozle.Status.notice \
                string:'this is where your message goes'

They will show up green in dzen2.

This only polls the ALSA mixer settings, and those only every minute.
Master mixer changes will take from 0 to 60 seconds to register if you
don't use the multimedia keys on your keyboard.

You need to be running HAL for this to do much other than tell you
the time.  Don't worry, HAL is pretty small.

"""

import signal
import dbus
import dbus.service
import sys
import os
import gobject
import time
from sets import Set
try:
    import apt
    import socket
except ImportError:
    apt = None

try:
    import alsaaudio
except ImportError:
    alsaaudio = None

# Set to true if you want dzen2 colors
dzen2 = False

def color(name, text):
    if dzen2:
        return '^fg(%s)%s^fg()' % (name, text)
    else:
        return '-=[ %s ]=-' % text

class Status(dbus.service.Object):
    debug = False

    def __init__(self, *args, **kwargs):
        dbus.service.Object.__init__(self, *args, **kwargs)

        self.system_bus = dbus.SystemBus()

        self.hal_manager = self.system_bus.get_object('org.freedesktop.Hal',
                                                      '/org/freedesktop/Hal/Manager')
        self.hal_computer = self.system_bus.get_object('org.freedesktop.Hal',
                                                       '/org/freedesktop/Hal/devices/computer')

        # Listen for HAL events
        self.system_bus.add_signal_receiver(self.handle_hal_event,
                                            dbus_interface='org.freedesktop.Hal.Device',
                                            path_keyword='path',
                                            member_keyword='member')

        # For now I only care about battery 0.
        batteries = self.hal_manager.FindDeviceByCapability('battery',
                                                            dbus_interface='org.freedesktop.Hal.Manager')
        if batteries:
            bat = self.system_bus.get_object('org.freedesktop.Hal',
                                             batteries[0])
            self.battery = dbus.Interface(bat,
                                          dbus_interface='org.freedesktop.Hal.Device')
        else:
            self.battery = None

        # Audio mixer, if we have the ALSA module installed.
        if alsaaudio:
            try:
                self.mixer = alsaaudio.Mixer()
            except alsaaudio.ALSAAudioError:
                # Some weird mixers have no Master control (eg. Mac Mini)
                self.mixer = alsaaudio.Mixer('PCM')
            except ImportError:
                self.mixer = None
        else:
            self.mixer = None

        # How many debian packages can be upgraded?
        self.upgradable = []

        # All my children
        self.pids = Set()

    def run(self, file, *args):
        pid = os.spawnlp(os.P_NOWAIT, file, file, *args)
        self.pids.add(pid)

    def battery_level(self):
        if self.battery:
            return self.battery.GetProperty('battery.charge_level.percentage')

    def battery_capacity_state(self):
        if self.battery:
            try:
                return self.battery.GetProperty('battery.charge_level.capacity_state')
            except dbus.exceptions.DBusException:
                bat = self.battery_level()
                if bat > 20:
                    return 'ok'
                else:
                    return 'battery low'

    def suspend(self, num_secs_to_wakeup=0):
        def ignore(*d):
            pass

        self.run('screenlock')
        self.hal_computer.Suspend(num_secs_to_wakeup,
                                  dbus_interface='org.freedesktop.Hal.Device.SystemPowerManagement',
                                  reply_handler=ignore,
                                  error_handler=ignore)

    def muted(self):
        if self.mixer:
            try:
                return self.mixer.getmute()[0]
            except alsaaudio.ALSAAudioError:
                pass
        raise ValueError('No mute control')

    def toggle_mute(self):
        try:
            mute = self.muted()
            self.mixer.setmute(not mute)
            self.update()
        except ValueError:
            pass

    @dbus.service.method('org.woozle.Status',
                         in_signature='d')
    def adjust_volume(self, adj):
        if self.mixer:
            vol = self.mixer.getvolume()[0]
            vol += adj
            vol = min(vol, 100)
            vol = max(vol, 0)
            self.mixer.setvolume(vol)
            self.update()

    def volume(self):
        if self.mixer:
            try:
                mute = self.muted()
            except ValueError:
                mute = False
            if mute:
                return '--'
            else:
                return str(self.mixer.getvolume()[0])

    def handle_button_pressed(self, button, path):
        if button == 'lid':
            lid = self.system_bus.get_object('org.freedesktop.Hal',
                                             path)
            if (lid.GetProperty('button.state.value',
                                dbus_interface='org.freedesktop.Hal.Device') and
                not os.path.exists(os.path.expanduser('~/nosusp'))):
                self.suspend()
        elif button == 'mute':
            self.toggle_mute()
        elif button == 'volume-down':
            self.adjust_volume(-5)
        elif button == 'volume-up':
            self.adjust_volume(+5)
        elif button == 'sleep':
            self.suspend()
        elif self.debug:
            self.update('button pressed: %s' % button)

    def handle_property_modified(self, name, added, removed):
        if name == 'battery.charge_level.percentage':
            self.update()
        elif name.startswith('battery.'):
            pass
        else:
            self.update('property modified: %s' % name)

    def handle_hal_event(self, *d, **k):
        member = k.get('member')
        if member == 'Condition':
            if d[0] == 'ButtonPressed':
                self.handle_button_pressed(d[1], k.get('path'))
        elif member == 'PropertyModified':
            assert int(d[0]) == len(d[1])
            for p in d[1]:
                self.handle_property_modified(*p)
        else:
            self.update('%s: %s' % (d, kwargs))

    def update(self, msg=None):
        out = []
        if msg:
            out.append(color('green', msg))

        if self.upgradable:
            out.append(color('cyan', '%d upgradable packages' % self.upgradable))

        la = file('/proc/loadavg').read()
        load = la.split()[0]
        if float(load) > 0.2:
            out.append('L %s' % load)

        vol = self.volume()
        if vol:
            out.append('V %s' % vol)

        bat = self.battery_level()
        if bat:
            out.append('B %s%%' % bat)

            cap_state = self.battery_capacity_state()
            if cap_state != 'ok':
                out.append(color('green', cap))

        out.append(time.strftime('%b %e %l:%M%P'))

        print '   '.join(out)
        sys.stdout.flush()

        try:
            pid, status = os.waitpid(0, os.WNOHANG)
            self.pids.remove(pid)
        except (OSError, KeyError):
            pass

        return True

    @dbus.service.method('org.woozle.Status',
                         in_signature='s')
    def notice(self, msg):
        self.update(msg)

    @dbus.service.method('org.woozle.Status',
                         in_signature='')
    def restart(self):
        re_exec()

    @dbus.service.method('org.woozle.Status',
                         in_signature='b')
    def set_debug(self, debug):
        self.debug = debug

    def debcheck(self):
        # I used to do this in a thread.  Unfortunately, this expensive
        # operation kept the entire apt cache around in RAM forever,
        # making the status program the biggest memory user on my entire
        # machine.  That offends my sense of aesthetics, so now we fork
        # and read from a pipe.
        def cb(source, cb_condition):
            s = source.recv(8192)
            self.upgradable = int(s)
            return False

        a,b = socket.socketpair()
        if os.fork():
            gobject.io_add_watch(a, gobject.IO_IN, cb)
        else:
            l = [p for p in apt.Cache() if p.isUpgradable]
            b.send(str(len(l)))
            sys.exit(0)
        return True

    def start(self):
        self.update()
        gobject.timeout_add(12 * 1000, self.update)
        if apt:
            self.debcheck()
            gobject.timeout_add(900 * 1000, self.debcheck)


def re_exec(*ign):
    os.execv(sys.argv[0], sys.argv)


def main():
    import signal
    import gobject
    import dbus.mainloop.glib

    # Set up main loop
    dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)

    # kill -HUP makes this re-exec itself
    signal.signal(signal.SIGHUP, re_exec)

    # Register ourselves as a service
    session_bus = dbus.SessionBus()
    dbus_name = dbus.service.BusName('org.woozle.Status',
                                     session_bus)

    # Our founder
    s = Status(session_bus, '/org/woozle/Status')

    # Go!
    loop = gobject.MainLoop()
    s.start()
    loop.run()


if __name__ == '__main__':
    main()
