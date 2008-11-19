#! /usr/bin/env python

# Description: SNPP client class for Python

'''SNPP client class.

Author: Neale Pickett <neale@woozle.org>

This was modified from the Python 1.5 library SMTP lib.
Which was modified from the Python 1.5 library HTTP lib.

Basically, I took smtplib, did an s/SMTP/SNPP/, and changed about ten
other things.  If only all projects were this easy :-)

Example:

  >>> import snpplib
  >>> s = snpplib.SNPP("localhost")
  >>> print s.help()[1]

  Level 1 commands accepted:

  PAGEr <pager ID>
  MESSage <alpha or numeric message>
  RESEt
  SEND
  QUIT
  HELP

  Level 2 commands accepted:

  DATA
  LOGIn <loginid> [password]
  LEVEl <ServiceLevel>
  COVErage <AlternateArea>
  HOLDuntil <YYMMDDHHMMSS> [+/-GMTdifference]
  CALLerid <CallerID>

  Level 3 commands accepted:

  none

  OK
  >>> s.putcmd("rese")
  >>> s.getreply()
  (250, 'Reset ok')
  >>> s.quit()
'''

import socket
import re
import rfc822
import types

SNPP_PORT = 444
CRLF="\r\n"

# Exception classes used by this module.
class SNPPException(Exception):
    """Base class for all exceptions raised by this module."""

class SNPPServerDisconnected(SNPPException):
    """Not connected to any SNPP server.

    This exception is raised when the server unexpectedly disconnects,
    or when an attempt is made to use the SNPP instance before
    connecting it to a server.
    """

class SNPPResponseException(SNPPException):
    """Base class for all exceptions that include an SNPP error code.

    These exceptions are generated in some instances when the SNPP
    server returns an error code.  The error code is stored in the
    `snpp_code' attribute of the error, and the `snpp_error' attribute
    is set to the error message.
    """

    def __init__(self, code, msg):
        self.snpp_code = code
        self.snpp_error = msg
        self.args = (code, msg)

class SNPPSenderRefused(SNPPResponseException):
    """Caller ID refused.

    In addition to the attributes set by on all SNPPResponseException
    exceptions, this sets `sender' to the string that the SNPP refused
    """

    def __init__(self, code, msg, sender):
        self.snpp_code = code
        self.snpp_error = msg
        self.sender = sender
        self.args = (code, msg, sender)

class SMTPRecipientsRefused(SNPPResponseException):
    """All recipient  addresses refused.

    The errors for each recipient are accessable thru the attribute
    'recipients', which is a dictionary of exactly the same sort as
    SNPP.sendpage() returns.
    """

    def __init__(self, recipients):
        self.recipients = recipients
        self.args = ( recipients,)


class SNPPDataError(SNPPResponseException):
    """The SNPP server didn't accept the data."""

class SNPPConnectError(SNPPResponseException):
    """Error during connection establishment"""

def quotedata(data):
    """Quote data for email.

    Double leading '.', and change Unix newline '\n', or Mac '\r' into
    Internet CRLF end-of-line.
    """
    return re.sub(r'(?m)^\.', '..',
        re.sub(r'(?:\r\n|\n|\r(?!\n))', CRLF, data))

class SNPP:
    """This class manages a connection to an SNPP server.
    SNPP Objects:

        For method docs, see each method's docstrings. In general, there is
            a method of the same name to perform each SNPP command, and there
            is a method called 'sendpage' that will do an entire page
            transaction.
    """
    debuglevel = 0
    file = None

    def __init__(self, host = '', port = 0):
        """Initialize a new instance.

        If specified, `host' is the name of the remote host to which to
        connect.  If specified, `port' specifies the port to which to connect.
        By default, snpplib.SNPP_PORT is used.  An SNPPConnectError is
        raised if the specified `host' doesn't respond correctly.

        """
        self.esnpp_features = {}
        if host:
            (code, msg) = self.connect(host, port)
            if code != 220:
                raise SNPPConnectError(code, msg)

    def set_debuglevel(self, debuglevel):
        """Set the debug output level.

        A non-false value results in debug messages for connection and for all
        messages sent to and received from the server.

        """
        self.debuglevel = debuglevel

    def connect(self, host='localhost', port = 0):
        """Connect to a host on a given port.

        If the hostname ends with a colon (`:') followed by a number, and
        there is no port specified, that suffix will be stripped off and the
        number interpreted as the port number to use.

        Note: This method is automatically invoked by __init__, if a host is
        specified during instantiation.

        """
        if not port:
            i = host.find(':')
            if i >= 0:
                host, port = host[:i], host[i+1:]
                try:
                    port = int(port)
                except ValueError:
                    raise socket.error, "nonnumeric port"
        if not port: port = SNPP_PORT
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        if self.debuglevel > 0: print 'connect:', (host, port)
        self.sock.connect((host, port))
        (code,msg)=self.getreply()
        if self.debuglevel >0 : print "connect:", msg
        return (code,msg)

    def sendstr(self, str):
        """Send `str' to the server."""
        if self.debuglevel > 0: print 'send:', `str`
        if self.sock:
            try:
                self.sock.send(str)
            except socket.error:
                raise SNPPServerDisconnected('Server not connected')
        else:
            raise SNPPServerDisconnected('please run connect() first')

    def putcmd(self, cmd, args=""):
        """Send a command to the server."""
        str = '%s %s%s' % (cmd, args, CRLF)
        self.sendstr(str)

    def getreply(self):
        """Get a reply from the server.

        Returns a tuple consisting of:

          - server response code (e.g. '250', or such, if all goes well)
            Note: returns -1 if it can't read response code.

          - server response string corresponding to response code (multiline
            responses are converted to a single, multiline string).

        Raises SNPPServerDisconnected if end-of-file is reached.
        """
        resp=[]
        if self.file is None:
            self.file = self.sock.makefile('rb')
        while 1:
            line = self.file.readline()
            if line == '':
                self.close()
                raise SNPPServerDisconnected("Connection unexpectedly closed")
            if self.debuglevel > 0: print 'reply:', `line`
            resp.append(line[4:].strip())
            code=line[:3]
            # Check that the error code is syntactically correct.
            # Don't attempt to read a continuation line if it is broken.
            try:
                errcode = int(code)
            except ValueError:
                errcode = -1
                break
            # Check if multiline response.
            if errcode != 214:
                break

        errmsg = '\n'.join(resp)
        if self.debuglevel > 0:
            print 'reply: retcode (%s); Msg: %s' % (errcode,errmsg)
        return errcode, errmsg

    def docmd(self, cmd, args=""):
        """Send a command, and return its response code."""
        self.putcmd(cmd,args)
        return self.getreply()

    def help(self, args=''):
        """SNPP 'help' command.
        Returns help text from server."""
        return self.docmd("help", args)

    def rese(self):
        """SNPP 'rese' command -- resets session."""
        return self.docmd("rese")

    def page(self, pagerid, password=""):
        """SNPP 'page' command -- specifies a pager ID.



        """

        if password:
            args = "%s %s" % (pagerid, password)
        else:
            args = pagerid
        return self.docmd("page", args)

    def mess(self, msg):
        """SNPP 'mess' command -- sends a single-line message."""
        return self.docmd("mess", msg)

    def send(self):
        """SNPP 'send' command -- sends a message."""
        return self.docmd("send")

    def data(self, msg):
        """SNPP 'DATA' command -- sends message data to server.

        Automatically quotes lines beginning with a period per rfc821.
        Raises SNPPDataError if there is an unexpected reply to the
        DATA command; the return value from this method is the final
        response code received when the all data is sent.
        """
        self.putcmd("data")
        (code,repl)=self.getreply()
        if self.debuglevel >0 : print "data:", (code,repl)
        if code <> 354:
            raise SNPPDataError(code,repl)
        else:
            self.sendstr(quotedata(msg))
            self.sendstr("%s.%s" % (CRLF, CRLF))
            (code,msg)=self.getreply()
            if self.debuglevel >0 : print "data:", (code,msg)
            return (code,msg)

    # Level 2 - Optional Extensions

    def logi(self, loginid, password=""):
        """SNPP 'logi' command -- logs in to the server.

        This command allows for a session login ID to be specified.  It
        is used to validate the person attempting to access the paging
        terminal.  If no LOGIn command is issued, "anonymous" user
        status is assumed.

        """

        if password:
            args = "%s %s" % (loginid, password)
        else:
            args = loginid
        return self.docmd("logi", args)

    def leve(self, servicelevel):
        """SNPP 'leve' command -- sets server level for next PAGE.

        The LEVEl function is used to specify an optional alternate
        level of service for the next PAGEr command.  Ideally,
        "ServiceLevel" should be an integer between 0 and 11 inclusive.
        The TME protocol specifies ServiceLevel as follows:

            0 - Priority
            1 - Normal (default)
            2 - Five minutes
            3 - Fifteen minutes
            4 - One hour
            5 - Four hours
            6 - Twelve hours
            7 - Twenty Four hours
            8 - Carrier specific '1'
            9 - Carrier specific '2'
            10 - Carrier specific '3'
            11 - Carrier specific '4'

        """

        return self.docmd("leve", servicelevel)

    def aler(self, alertoverride):
        """SNPP 'aler' command -- override alert setting.

         The optional ALERt command may be used to override the default
         setting and specify whether or not to alert the subscriber upon
         receipt of a message.  This option, like the previous command,
         alters the parameters submitted to the paging terminal using
         the PAGEr command.  The TME protocol specifies AlertOverride as
         either 0-DoNotAlert, or 1-Alert.

         """

        return self.docmd("aler", alertoverride)

    def cove(self, alternatearea):
        """SNPP 'cove' command -- override coverage area.

         The optional COVErage command is used to override the
         subscriber's default coverage area, and allow for the selection
         of an alternate region.  This option, like the previous
         command, alters the parameters submitted to the paging terminal
         using the PAGEr command.  AlternateArea is a designator for one
         of the following:

             - A subscriber-specific alternate coverage area
             - A carrier-defined region available to subscribers

         """

        return self.docmd("cove", alternatearea)

    def hold(self, timespec, gmtdiff=""):
	"""SNPP 'hold' command -- hold until specified time.

        The HOLDuntil command allows for the delayed delivery of a
        message, to a particular subscriber, until after the time
        specified.  The time may be specified in local time (e.g. local
        to the paging terminal), or with an added parameter specifying
        offset from GMT (in other words, "-0600" specifies Eastern
        Standard Time).  This option, like the previous command, alters
        the parameters submitted to the paging terminal using the PAGEr
        command.

        """

        if gmtdiff:
            args = "%s %s" % (timespec, gmtdiff)
        else:
            args = timespec

        return self.docmd("hold", args)

    def call(self, callerid):
        """SNPP 'call' command -- specify caller ID.

        The CALLerid function is a message-oriented function (as opposed
        to the subscriber-oriented functions just described).  This
        allows for the specification of the CallerIdentifier function as
        described in TME.  This parameter is optional, and is at the
        discretion of the carrier as to how it should be implemented or
        used.

        """

        return self.docmd("call", callerid)

    def subj(self, messagesubject):
        """SNPP 'subj' command -- specify a message subject.

        The SUBJect function allows is a message-oriented function that
        allows the sender to specify a subject for the next message to
        be sent.  This parameter is optional and is at the discretion of
        the carrier as to how it should be implemented or used.

        """

        return self.docmd("subj", messagesubject)


    # Level 3 -- Two-Way Extensions

    # I didn't implement these because I got tired of typing this stuff
    # in, and I doubt anyone's going to use this anyhow, seeing as how
    # qpage doesn't do any of these extensions.  Although this may
    # change.

    # some useful methods
    def sendpage(self, from_id, to_ids, msg):
        """This command performs an entire mail transaction.

        The arguments are:
            - from_id      : The CallerID sending this mail, or None to
                             not send any CallerID.
            - to_ids :       A list of pager IDs to send this page to.  A
                             bare string will be treated as a list with 1
                             address.
            - msg :          The message to send.

        This method will return normally if the page is accepted for at
        least one recipient. It returns a dictionary, with one entry for
        each recipient that was refused.  Each entry contains a tuple of
        the SNPP error code and the accompanying error message sent by
        the server.

        This method may raise the following exceptions:

         SNPPRecipientsRefused  The server rejected for ALL recipients
                                (no mail was sent).
         SNPPSenderRefused      The server didn't accept the from_id.
         SNPPDataError          The server replied with an unexpected
                                error code

        Note: the connection will be open even after an exception is raised.

        Example:

         >>> import snpplib
         >>> s=snpplib.SNPP("localhost")
         >>> tolist=["parsingh","rhiannon","saffola","bob"]
         >>> msg = 'Hey guys, what say we have pizza for dinner?'
         >>> s.sendpage("neale",tolist,msg)
         { "bob" : ( 550 ,"User unknown" ) }
         >>> s.quit()

        In the above example, the message was accepted for delivery to three
        of the four addresses, and one was rejected, with the error code
        550. If all addresses are accepted, then the method will return an
        empty dictionary.

        """
        (code,resp) = self.call(from_id)
        if code <> 250:
	    # CallerID command not implemented, too bad.
	    pass
        senderrs={}
        if type(to_ids) == types.StringType:
            to_ids = [to_ids]
        for each in to_ids:
            (code,resp)=self.page(each)
            if (code <> 250) and (code <> 251):
                senderrs[each]=(code,resp)
        if len(senderrs)==len(to_ids):
            # the server refused all our recipients
            self.rese()
            raise SNPPRecipientsRefused(senderrs)
        (code,resp)=self.data(msg)
        if code <> 250:
            self.rese()
            raise SNPPDataError(code, resp)
        (code,resp)=self.send()
        if code <> 250:
            self.rese()
            raise SNPPDataError(code, resp)
        #if we got here then somebody got our page
        return senderrs


    def close(self):
        """Close the connection to the SNPP server."""
        if self.file:
            self.file.close()
        self.file = None
        if self.sock:
            self.sock.close()
        self.sock = None


    def quit(self):
        """Terminate the SNPP session."""
        self.docmd("quit")
        self.close()


# Test the sendmail method, which tests most of the others.
# Note: This always sends to localhost.
if __name__ == '__main__':
    import sys, rfc822

    def prompt(prompt):
        sys.stdout.write(prompt + ": ")
        return sys.stdin.readline().strip()

    fromaddr = prompt("From")
    toaddrs  = prompt("To").split(',')
    print "Enter message, end with ^D:"
    msg = ''
    while 1:
        line = sys.stdin.readline()
        if not line:
            break
        msg = msg + line
    print "Message length is " + `len(msg)`

    server = SNPP('localhost')
    server.set_debuglevel(1)
    server.sendpage(fromaddr, toaddrs, msg)
    server.quit()
