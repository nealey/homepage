package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/cgi"
	"os"
	"github.com/jsgoecke/tesla"
	"github.com/coduno/netrc"
)

const authtok = "~!Jf5!uYFxhK"
const clientId = "81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384"
const clientSec = "c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3"

type Handler struct {
	cgi.Handler
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.FormValue("auth") != authtok {
		w.Header().Set("Content-Type", "text/plain")
		fmt.Fprintln(w, "NO: Invalid authtok")
		return
	}

	os.Setenv("HOME", "/home/neale")
	n, _ := netrc.Parse()
	secrets := n["gitlab.com"] // Requiring a password is such bullshit.

	auth := tesla.Auth{
		ClientID: clientId,
		ClientSecret: clientSec,
		Email: secrets.Login,
		Password: secrets.Password,
	}
	cli, err := tesla.NewClient(&auth)
	if err != nil {
		w.Header().Set("Content-Type", "text/plain")
		fmt.Fprintln(w, err)
		return
	}
		
	vehicles, err := cli.Vehicles()
	if err != nil {
		w.Header().Set("Content-Type", "text/plain")
		fmt.Fprintln(w, err)
		return
	}

	vehicle := vehicles[0]
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprintln(w, "OK")
	fmt.Fprintln(w, vehicle.StartAirConditioning())
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
