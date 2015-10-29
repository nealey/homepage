#! /bin/sh

tryexec () {
	command -v $1 >/dev/null && exec "$@"
}

tryexec pandoc -f markdown -t html
tryexec markdown

echo "<i>no markdown thingies found</i></p>"
echo "<pre>"
cat
echo "</pre>"
