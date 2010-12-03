PS = $(wildcard *.ps)
PDF = $(patsubst %.ps, %.pdf, $(PS))

kit.tar.gz: $(wildcard *.txt) $(PS) $(PDF)
	tar czf $@ $^

%.pdf: %.ps
	ps2pdf $<
