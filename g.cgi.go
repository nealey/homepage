package main

import (
	"crypto/md5"
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
)

const GitProjectRoot = "/home/neale/projects"
const CgitConfig = "/home/neale/public_html/cgitrc"
const Cgit = "/usr/lib/cgit/cgit.cgi"

// printf "USER:PASS" | base64 | while read a; do printf "%s" "$a" | md5sum; done
var allowed = []string{
	"2c64993e88c06e297d4f01cf3b5aebdf", // neale
}

func execv(name string, arg ...string) {
	c := exec.Command(name, arg...)
	c.Stdin = os.Stdin
	c.Stdout = os.Stdout
	c.Stderr = os.Stderr
	if err := c.Run(); err != nil {
		log.Print(err)
	}
}

func Authenticated() bool {
	auth := os.Getenv("HTTP_AUTHORIZATION")
	if auth == "" {
		return false
	}

	parts := strings.Split(auth, " ")
	switch {
	case len(parts) != 2:
		return false
	case parts[0] != "Basic":
		return false
	}

	hash := md5.Sum([]byte(parts[1]))
	hashhex := fmt.Sprintf("%x", hash)

	for _, a := range allowed {
		if a == hashhex {
			os.Setenv("AUTH_TYPE", parts[0])
			os.Setenv("REMOTE_USER", "XXX-neale")
			return true
		}
	}

	return false
}

func main() {
	log.SetFlags(0)
	//log.SetOutput(os.Stdout)
	//log.SetPrefix("Status: 500 CGI Go Boom\nContent-type: text/plain\n\nERROR: ")

	os.Setenv("GIT_PROJECT_ROOT", GitProjectRoot)
	os.Setenv("CGIT_CONFIG", CgitConfig)

	uri := os.Getenv("REQUEST_URI")
	switch {
	case strings.HasSuffix(uri, "git-receive-pack"):
		if Authenticated() {
			execv("git", "http-backend")
		} else {
			fmt.Println("Status: 401 Not Authorized")
			fmt.Println("Content-type: text/plain")
			fmt.Println("WWW-Authenticate: Basic realm=\"git\"")
			fmt.Println()
			fmt.Println("Nope", os.Getenv("HTTP_AUTHORIZATION"))
		}
	case strings.HasSuffix(uri, "git-upload-pack"):
		execv("git", "http-backend")
	default:
		execv(Cgit)
	}
}
