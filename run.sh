#! /bin/sh

case "$(hostname)" in
  sweetums)
    baseURL=http://sweetums.lan:1313/
    ;;
  *)
    baseURL=http://$(hostname --fqdn):1313/
    ;;
esac

docker run \
  --rm -i \
  -v $(realpath $(dirname $0)):/src \
  -u $(id -u):$(id -g) \
  klakegg/hugo:ext server \
    --baseURL "$baseURL"
