#include <stdlib.h>
#include <unistd.h>

int
main(int argc, char *argv[])
{
    setenv("CGIT_CONFIG", "/home/neale/public_html/cgitrc", 1);
    execl("/usr/local/src/cgit/cgit-stable/cgit", "cgit", NULL);

    return 0;
}
