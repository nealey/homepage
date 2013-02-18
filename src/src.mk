HTML += $(patsubst %.mdwn, %.html, $(wildcard src/*.mdwn src/*/*.mdwn))

HTML += $(patsubst %/index.head.mdwn, %/index.html, $(wildcard src/*/index.head.mdwn))

COPY += $(wildcard src/ipqueue/*.tar.*) src/eguile/eguile.scm

include src/*/*.mk

$(DESTDIR)/src/%/index.html: src/%/index.head.mdwn
	@mkdir -p $(@D)
	cp $(wordlist 2, $(words $^), $^) $(@D)
	./dirlist $+ | $(MDWNTOHTML) > $@


$(DESTDIR)/src/misc/index.html: src/misc/*
$(DESTDIR)/src/postscript/index.html: src/postscript/*.ps
$(DESTDIR)/src/python/index.html: src/python/*.py
