#! /bin/sh

case "$(hostname)" in
	WE47763)
		baseURL=http://localhost:1313/
		;;
  sweetums)
    baseURL=http://sweetums.lan:1313/
    ;;
  penguin)
    baseURL=http://penguin.linux.test:1313/
    ;;
  *)
    baseURL=http://$(hostname --fqdn):1313/
    ;;
esac

docker run \
  --rm -i \
  -v $(realpath $(dirname $0)):/src \
  -u $(id -u):$(id -g) \
  -p 1313:1313 \
  klakegg/hugo:ext server \
    --buildFuture \
    --buildDrafts \
    --baseURL "$baseURL" \
    "$@"

