TARTAN_TEMPLATE = tartans/tartan.m4
TARTAN_LIST = $(wildcard tartans/*.tartan)
TARTAN_PNG = $(patsubst %.tartan, %.png, $(TARTAN_LIST))
TARTAN_TOMDWN = tartans/tartantomdwn

COPY += tartans/design.cgi tartans/loom.py $(TARTAN_TOMDWN) $(TARTAN_TEMPLATE)
HTML += tartans/index.html
HTML += $(patsubst %.tartan, %.html, $(TARTAN_LIST))
TARGETS += $(addprefix $(DESTDIR)/, $(TARTAN_PNG))

$(DESTDIR)/tartans/%.html: tartans/%.tartan $(TARTAN_TEMPLATE)
	@mkdir -p $(@D)
	$(TARTAN_TOMDWN) $*.png $(TARTAN_TEMPLATE) < $< | $(MDWNTOHTML) > $@

$(DESTDIR)/tartans/%.png: tartans/%.tartan
	@mkdir -p $(@D)
	tartans/loom.py < $< > $@

$(DESTDIR)/tartans/index.html: tartans/index.head.mdwn $(wildcard tartans/*.tartan)
	@mkdir -p $(@D)
	cp $(wordlist 2, $(words $^), $^) $(@D)
	tartans/lstartans $+ | $(MDWNTOHTML) > $@
