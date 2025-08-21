---
title: Git Hooks for my Homepage
date: 2025-08-21
tags:
  - computers
  - static-site
---

It wasn't too difficult switching my homepage over from a forgejo
CI/CD job to git hooks.

My hooks will now build my site with hugo,
and rsync it into production on success.
Then, it will update the local pgit pages
with the new repsitory.

I found it refreshing to go back to git hooks,
mainly because I could just run them to test them out.
I won't miss the hours spent on
git commit / git push / wait / read job output / repeat.

---

hooks/post-update:
```sh
#! /bin/sh

for hook in $GIT_DIR/hooks/post-update.d/*; do
  echo "=== $hook"
  $hook
done
```

hooks/post-update.d/20-publish:
```sh
#! /bin/sh

set -e

# Die if there's no SSH agent
ssh-add -L >/dev/null

cd $(dirname $0)/../..

WORK=$(mktemp -d)
trap "rm -rf $WORK" EXIT

git clone $(pwd) $WORK

hugo -s $WORK

rsync -vaz $WORK/public neale@melville.woozle.org:/srv/www/woozle.org/
```

hooks/post-update.d/80-pgit
```sh
#! /bin/sh

cd $(dirname $0)/../..
repo=$(basename $(pwd) .git)
clone_url="https://git.woozle.org/neale/$repo.git"
desc=$(cat description || echo "No description provided")

pgit \
  -out /srv/sys/www/git.woozle.org/neale/$repo \
  -root-relative /neale/$repo/ \
  -clone-url "$clone_url" \
  -label "$repo" \
  -desc "$desc" \
  -max-commits 5 \
  -repo .
```
