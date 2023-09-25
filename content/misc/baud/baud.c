/*
 * Pretend to be a modem by throttling output.
 *
 * 2023-09-12 
 * Neale Pickett <neale@woozle.org>
 *
 * To the extent possible under law, 
 * I waive all copyright and related or neighboring rights to this software.
 */

#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>
#include <sysexits.h>
#include <unistd.h>

const int MICROSECOND = 1;
const int MILLISECOND = 1000 * MICROSECOND;
const int SECOND = 1000 * MILLISECOND;

const int NOISINESS_DENOMINATOR = 36000;
const int NOISELEN_DEFAULT = 16;

int
usage(char *me, char *error) {
    if (error) {
        fprintf(stderr, "ERROR: %s\n", error);
    }
    fprintf(stderr, "Usage: %s BAUD [NOISINESS] [NOISELEN]\n", me);
    fprintf(stderr, "\n");
    fprintf(stderr, "Reads stdin, and writes it back to stdout at BAUD bits per second.\n");
    fprintf(stderr, "\n");
    fprintf(stderr, "NOISINESS\tEvery bit can begin line noise, with probability NOISINESS/%d\n", NOISINESS_DENOMINATOR);
    fprintf(stderr, "NOISELEN\tUp to this many bits of noise happens per burst (default: %d)\n", NOISELEN_DEFAULT);
    return EX_USAGE;
}

int
main(int argc, char *argv[]) {
    if (argc < 2) {
        return usage(argv[0], NULL);
    }

    int baud = atoi(argv[1]);
    if (baud < 1) {
        return usage(argv[0], "Invalid baud rate");
    }

    int noisiness = 0;
    if (argc > 2) {
        noisiness = atoi(argv[2]);
    }
    int noiselen = NOISELEN_DEFAULT;
    if (argc > 3) {
        noiselen = atoi(argv[3]);
    }

    int cps = baud / 10; // 8N1 has 10 bits per octet: 8 data, 1 start, 1 parity
    int delay = SECOND / cps;
    int noisybits = 0;
    int c;
    while ((c = getchar()) != EOF) {
        usleep(delay);
        for (int bit = 0; bit < 8; bit++) {
            int r = rand() % NOISINESS_DENOMINATOR;
            if (r < noisiness) {
                noisybits = rand() % noiselen;
            }

            if (noisybits) {
                c ^= (rand() & 1) << bit;
                noisybits -= 1;
            }
        }
        putchar(c);
        fflush(stdout);
    }
    
    return EX_OK;
}
