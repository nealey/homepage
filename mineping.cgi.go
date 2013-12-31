package main

import (
	"net"
	"fmt"
	"time"
)

const MAGIC = "\x00\xff\xff\x00\xfe\xfe\xfe\xfe\xfd\xfd\xfd\xfd\x12\x34\x56\x78"

func isAlive() bool {
	conn, err := net.Dial("udp", "h.woozle.org:30919")
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

func main() {
	fmt.Println("Content-type: text/html")
	fmt.Println("")
	fmt.Println("<!DOCTYPE html>")
	fmt.Println("<html>")
	fmt.Println("<head>")
	fmt.Println("<meta name=\"viewport\" content=\"width=device-width\">")
	fmt.Println("<style type=\"text/css\">#a{font-size: 500%; text-align: center; background: silver;}</style>")
	fmt.Println("<title>Is Ginnie playing Minecraft PE?</title></head>")
	fmt.Println("<body>")
	fmt.Println("<h1>Is Ginnie playing Minecraft PE?</h1>")
	fmt.Println("<p id=\"a\">")
	if isAlive() {
		fmt.Println("yes")
	} else {
		fmt.Println("no")
	}
	fmt.Println("</p>")
	fmt.Println("<p>Use the external server <code>h.woozle.org</code> port <code>30919</code> to connect</p>")
	fmt.Println("</body></html>")
}
