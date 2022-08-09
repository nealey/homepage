#! /bin/sh

cd $(dirname $0)
docker run --rm -it -v $(pwd):/srv/jekyll -e JEKYLL_UID=1000 -e JEKYLL_GID=1000 jekyll/jekyll jekyll build --watch
