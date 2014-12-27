package main

import (
	"net"
	"fmt"
	"time"
	"sync"
)

const MAGIC = "\x00\xff\xff\x00\xfe\xfe\xfe\xfe\xfd\xfd\xfd\xfd\x12\x34\x56\x78"

func isAlive(host string) bool {
	conn, err := net.Dial("udp", host)
	if err != nil {
		return false
	}

	conn.SetReadDeadline(time.Now().Add(5 * time.Second))

	pkt := "\x01" + "\x00\x00\x00\x00MERF" + MAGIC
	conn.Write([]byte(pkt))

	resp := make([]byte, 40)
	rlen, err := conn.Read(resp)
	if (err != nil) || (rlen == 0) {
		return false
	}

	return true
}

var wg sync.WaitGroup

func waitClose(c chan<- string) {
	wg.Wait()
	close(c)
}

type HostEntry struct {
	host string
	owner string
}

var hosts = []HostEntry{
	{"h.woozle.org:30919", "Ginnie"},
	{"h.woozle.org:44321", "Neale"},
	{"h.woozle.org:58000", "Amy"},
}

func ping(results chan<- string, e HostEntry) {
	defer wg.Done()
	if isAlive(e.host) {
		results <- fmt.Sprintf("%s is playing at %s", e.owner, e.host)
	}
}

func main() {
	results := make(chan string, 5)

	for _, host := range hosts {
		wg.Add(1)
		go ping(results, host)
	}
	go waitClose(results)

	fmt.Println("Content-type: text/html")
	fmt.Println("")
	fmt.Println("<!DOCTYPE html>")
	fmt.Println("<html>")
	fmt.Println("<head>")
	fmt.Println("<meta name=\"viewport\" content=\"width=device-width\">")
	fmt.Println("<style type=\"text/css\">#a{font-size: 120%; background: silver;}</style>")
	fmt.Println("<title>Minecraft PE ping</title></head>")
	fmt.Println("<body>")
	fmt.Println("<h1>Are The Picketts playing Minecraft PE?</h1>")
	fmt.Println("<ul id=\"a\">")
	for msg := range results {
		fmt.Printf("<li>%s</li>\n", msg)
	}
	fmt.Println("</ul>")
	fmt.Println("</body></html>")
}
