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
    baseURL=http://$(hostname):1313/
    ;;
esac

src=$(realpath $(dirname $0))

podman run \
  --rm -i \
  -v $src/content:/src/content:ro \
  -v $src/layouts:/src/layouts:ro \
  -v $src/config:/src/config:ro \
  -v $src/static:/src/static:ro \
  -v $src/.git:/src/.git:ro \
  -u $(id -u):$(id -g) \
  -p 1313:1313 \
  klakegg/hugo:ext server \
    --buildFuture \
    --buildDrafts \
    --baseURL "$baseURL" \
    "$@"

