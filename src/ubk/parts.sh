#! /bin/sh

GIT_DIR=$HOME/projects/ubk; export GIT_DIR

git ls-tree HEAD | while read mode type sum fn; do 
    case $fn in
	*.ps)
	    base=${fn%.ps}
	    desc=$(git cat-file blob $sum | sed -n 's/^%.*Description: //p')
	    test -n "$desc" || desc=$base
	    echo "* [${desc:$base}](${base}.pdf)"
	    ;; 
    esac
done