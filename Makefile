DESTDIR = $(HOME)/public_html

TEMPLATE = template.m4
MDWNTOHTML = ./mdwntohtml $(TEMPLATE)

# HTML to be generated
HTML = index.html

# Things to copy
COPY += mdwntohtml $(TEMPLATE)
COPY += face.png chumby-photo.cgi
COPY += format.css default.css print.css
#COPY += gitweb.cgi git-logo.png gitweb.css gitweb.conf
COPY += portal.png portal.cgi
COPY += g.cgi cgitrc cgit-header.html cgit.css

# Directories in which %.mdwn generates %.html
PLAIN = . papers poems misc

# Other targets for "make all"
TARGETS = html copy 
TARGETS += $(DESTDIR)/tmp $(DESTDIR)/footer.html $(DESTDIR)/projects
TARGETS += $(DESTDIR)/geneweb.cgi
TARGETS += $(DESTDIR)/mp.cgi

all: default

include */*.mk

$(DESTDIR)/%.html: %.mdwn $(TEMPLATE)
	@mkdir -p $(dir $@)
	$(MDWNTOHTML) < $< > $@

$(DESTDIR)/%: %
	@mkdir -p $(dir $@)
	cp $< $@

$(DESTDIR)/tmp:
	mkdir -p $@

$(DESTDIR)/footer.html: $(TEMPLATE)
	awk '(/FOOT/) { a += 1; next; } (a == 1) { print; }' $< > $@

$(DESTDIR)/projects:
	ln -s $(HOME)/projects $@

$(DESTDIR)/geneweb.cgi: geneweb.c
	$(CC) -o $@ $<
	chmod +s $@

$(DESTDIR)/g.cgi: g.cgi.c
	$(CC) -o $@ $<

$(DESTDIR)/mp.cgi: minepig.cgi.go
	go build -o $@ $<

$(DESTDIR)/%-sm.jpg: %.jpg
	jpegtopnm $< | pnmscale -xysize 600 600 | pnmtojpeg > $@

default: $(TARGETS)

MDWN = $(wildcard $(addsuffix /*.mdwn, $(PLAIN)))
HTML += $(patsubst %.mdwn, %.html, $(MDWN))

html: $(addprefix $(DESTDIR)/, $(HTML))
copy: $(addprefix $(DESTDIR)/, $(COPY))

clean:
	rm -rf $(wildcard $(DESTDIR)/*)
