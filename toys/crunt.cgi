#! /bin/sh

cd $(dirname $0)

randint () {
    seq $1 $2 | shuf -n 1
}

crunt () {
    shuf -n 1 <<EOF
crunt
CRUNT
EOF
}

echo 'Content-type: text/html'
echo
(
    echo '<p>'
    crunts=$(randint 200 500)
    babies=$(expr \( $crunts \* 3 \) / 4)

    while [ $crunts -gt 0 ]; do
        crunt
        crunts=$(expr $crunts - 1)
    done
    while [ $babies -gt 0 ]; do
        echo crunt
        babies=$(expr $babies - 1)
    done
    echo '<strong>CRUNT<a href="http://www.subgenius.com/bigfist/bulldada/X0033_RAELIAN.TXT.html">!</a></strong>'
    echo '</p>'
) | m4 -DTITLE=crunt ../template.m4 -
