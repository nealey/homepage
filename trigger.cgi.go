package main

import (
	"fmt"
	"github.com/coduno/netrc"
	"github.com/jsgoecke/tesla"
	"log"
	"net/http"
	"net/http/cgi"
	"net/smtp"
	"os"
)

const authtok = "~!Jf5!uYFxhK"
const clientId = "81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384"
const clientSec = "c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3"

func Kersplode(section string, error string, w http.ResponseWriter) {
	errtxt := fmt.Sprintf("%s: %s", section, error)

	http.Error(w, errtxt, 500)

	// Send an email
	c, _ := smtp.Dial("localhost:25")
	defer c.Close()
	c.Mail("neale@woozle.org")
	c.Rcpt("dartcatcher@gmail.com")
	wc, _ := c.Data()
	defer wc.Close()
	fmt.Fprintln(wc, "From: IFTTT Trigger <neale@woozle.org>")
	fmt.Fprintln(wc, "To: Neale Pickett <dartcatcher@gmail.com>")
	fmt.Fprintln(wc, "Subject: IFTTT trigger error")
	fmt.Fprintln(wc, "")
	fmt.Fprintln(wc, "Hi, this is the IFTTT trigger at woozle.org.")
	fmt.Fprintln(wc, "I'm sorry to say that something went wrong with a recent request.")
	fmt.Fprintln(wc, "Here is the text of the error:")
	fmt.Fprintln(wc, "")
	fmt.Fprintln(wc, errtxt)
}

type Handler struct {
	cgi.Handler
}

func (h Handler) TriggerHvac(w http.ResponseWriter, r *http.Request) {
	os.Setenv("HOME", "/home/neale")
	n, _ := netrc.Parse()
	secrets := n["gitosis.com"] // Requiring a password here is such bullshit.

	auth := tesla.Auth{
		ClientID:     clientId,
		ClientSecret: clientSec,
		Email:        secrets.Login,
		Password:     secrets.Password,
	}
	cli, err := tesla.NewClient(&auth)
	if err != nil {
		Kersplode("tesla.NewClient", err.Error(), w);
		return
	}

	vehicles, err := cli.Vehicles()
	if err != nil {
		Kersplode("cli.Vehicles", err.Error(), w);
		return
	}

	vehicle := vehicles[0]
	if _, err := vehicle.Wakeup(); err != nil {
		Kersplode("vehicle.Wakeup", err.Error(), w);
		return
	}
	for i := 0; i < 5; i += 1 {
		err := vehicle.StartAirConditioning()
		if err == nil {
			break
		} else if (i == 5) {
			Kersplode("vehicle.StartAirConditioning", err.Error(), w);
			return
		}
	}
	http.Error(w, "OK", 200)
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.FormValue("auth") != authtok {
		http.Error(w, "Invalid authtok", 401)
		return
	}

	switch trigger := r.FormValue("trigger"); trigger {
	case "hvac":
		h.TriggerHvac(w, r)
	default:
		http.Error(w, "Undefined trigger", 422)
		return
	}
}

func main() {
	log.SetOutput(os.Stdout)
	log.SetFlags(0)
	log.SetPrefix("Status: 500 CGI Go Boom\nContent-type: text/plain\n\nERROR: ")
	h := Handler{}
	if err := cgi.Serve(h); err != nil {
		log.Fatal(err)
	}
}
