FILES = alice.ps banner.ps emergency-card.ps graph-paper.ps logo.ps
FILES += page_dimensions.ps resume.ps ruled-paper.ps skel.ps

TARGETS += index.html

include ../../Makefile

.INTERMEDIATE: index.txt
index.txt: index.dirlist $(FILES)
	$(DIRLIST) $(FILES) > $@

%.png: %.ps
	pstopnm -portrait -xmax 600 -stdout $< | pnmscale -x 300  | pnmtopng > $@
