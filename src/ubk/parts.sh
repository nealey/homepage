#! /bin/sh

GIT_DIR=$HOME/projects/ubk; export GIT_DIR

echo "<ul>"
git ls-tree HEAD | while read mode type sum fn; do 
    case $fn in
	*.ps)
	    base=${fn%.ps}
	    desc=$(git cat-file blob $sum | sed -n 's/^%.*Description: //p')
	    [ -z "$desc" ] && desc="$base"
	    echo "<li><a href="$base.pdf">${desc:-$base}</a></li>"
	    ;; 
    esac
done
echo "</ul>"
