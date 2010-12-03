PLAIN += src/ubk
TARGETS += $(DESTDIR)/src/ubk/mine-sm.jpg $(DESTDIR)/src/ubk/mine.jpg

UBK_GIT_DIR = $(HOME)/projects/ubk

UBK_PS = $(shell git --git-dir=$(UBK_GIT_DIR) ls-tree HEAD | awk '/ps$$/{print $$4;}')
UBK_PDF = $(patsubst %.ps,$(DESTDIR)/src/ubk/%.pdf,$(UBK_PS))
TARGETS += $(UBK_PDF)

$(DESTDIR)/src/ubk/%.pdf:
	git --git-dir=$(UBK_GIT_DIR) show HEAD:$*.ps | ps2pdf - $@
