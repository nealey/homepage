TARGETS += $(DESTDIR)/src/dwm/config.h $(DESTDIR)/src/dwm/status.sh
TARGETS += $(DESTDIR)/src/dwm/dwm-button.sh

$(DESTDIR)/src/dwm/config.h: $(HOME)/src/ports/dwm/config.h
	@mkdir -p $(@D)
	cp $< $@

$(DESTDIR)/src/dwm/%.sh: $(HOME)/bin/%
	@mkdir -p $(@D)
	cp $< $@
