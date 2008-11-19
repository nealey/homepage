all: dwm-config.h spamfairy.py mail-expire.sh gourmet.sh deliver.sh

COPY = cp $< $@

dwm-config.h: $(HOME)/opt/src/dwm/config.h
	$(COPY)

spamfairy.py: /usr/local/bin/spamfairy
	$(COPY)

mail-expire.sh: /usr/local/bin/mail-expire
	$(COPY)

gourmet.sh: /usr/local/bin/gourmet
	$(COPY)

deliver.sh: /usr/local/bin/deliver
	$(COPY)