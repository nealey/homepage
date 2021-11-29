#! /bin/sh

docker run --rm --net=host -v $(pwd):/srv/jekyll -u $(id -u):$(id -g) jekyll/jekyll:minimal /usr/gem/bin/jekyll s --host 0 "$@"
