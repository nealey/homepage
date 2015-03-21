#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <unistd.h> // only for chdir
#include <stdio.h>

#include "cgi.h"

char const *botdir = "/home/neale/bot";

void
jputchar(unsigned char c)
{
	if (c == '\n') {
		printf("\\n");
	} else if (c < 0x20) {
		printf("\\u%04x", c);
	} else if ((c == '\\') || (c == '"')) {
		putchar('\\');
		putchar(c);
	} else {
		putchar(c);
	}
}

int
main(int argc, char *argv[])
{
	char key[80];
	char val[2000];
	
	bool its_me = false;
	
	cgi_init(argv);
	
	for (;;) {
		size_t len;
		
		len = cgi_item(key, sizeof(key));
		len = cgi_item(val, sizeof(val));
		
		if (0 == len) {
			break;
		}
		
		if (0 == strcmp(key, "user_id")) {
			if (0 == strcmp(val, "USLACKBOT")) {
				its_me = true;
			}
		} else if (0 == strcmp(key, "channel_name")) {
			char chan[40];
			
			snprintf(chan, sizeof(chan), "#%s", val);
			setenv("forum", chan, true);
		} else if (0 == strcmp(key, "user_name")) {
			setenv("sender", val, true);
		} else if (0 == strcmp(key, "text")) {
			setenv("text", val, true);
		} else if (0 == strcmp(key, "token")) {
			setenv("token", val, true);
		}
	}
	
	cgi_header("text/json");
	
	if (its_me) {
		printf("{}");
		return 0;
	}
	
	setenv("command", "PRIVMSG", true);
	
	chdir(botdir);
	{
		FILE *p = popen("./handler", "r");
		int newlines = 0;
		
		printf("{\"text\":\"");
		for (;;) {
			int c = fgetc(p);
			
			if (EOF == c) {
				break;
			} else if ('\n' == c) {
				newlines += 1;
			} else {
				for (; newlines > 0; newlines -= 1) {
					jputchar('\n');
				}
				jputchar(c);
			}
		}
		printf("\",\"parse\":\"full\"}\n");
		
		pclose(p);
	}

	return 0;
}
