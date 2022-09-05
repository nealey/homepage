#! /bin/sh

rm -rf $(dirname $0)/public
docker run \
  --rm -i \
  -v $(realpath $(dirname $0)):/src \
  -u $(id -u):$(id -g) \
  klakegg/hugo:ext build

rsync --delete -vax $(dirname $0)/public/ melville.woozle.org:/srv/www/woozle.org/
