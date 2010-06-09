#include <unistd.h>

int
main(int argc, char *argv[])
{
  chdir("/home/neale/lib/geneweb");
  execl("/usr/bin/gwd", "gwd", "-cgi", NULL);
  return 0;
}