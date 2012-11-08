#include <string.h>
#include <stdlib.h>
#include <unistd.h>

#define GIT_PROJECT_ROOT "/home/neale/projects"
#define CGIT_CONFIG "/home/neale/public_html/cgitrc"

int
main(int argc, char *argv[])
{
    char *uri = getenv("REQUEST_URI");

    if (uri && strstr(uri, "git-upload-pack")) {
        /* Use git-http-backend for great speed! */
        setenv("GIT_PROJECT_ROOT", GIT_PROJECT_ROOT, 1);
        execlp("git", "git", "http-backend", NULL);
    } else {
        setenv("CGIT_CONFIG", CGIT_CONFIG, 1);
        execl("/usr/local/bin/cgit", "cgit", NULL);
    }

    return 0;
}
