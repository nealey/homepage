#! /bin/sh

weather () {
    curl -s 'http://rss.wunderground.com/auto/rss_full/NM/Los_Alamos.xml?units=metric' | \
        awk -F ' [-:] ' '
(/Current Conditions/) { 
  print "<p class=\"weather\"><a href=\"http://m.wund.com/cgi-bin/findweather/getForecast?brand=mobile&query=87544\">" $2 "</a></p>"; 
} 

(c == 2) {
  print "<p class=\"weather\">" $0 "</p>"; 
  exit; 
} 

(/CDATA/) {
  c++;
}'

}

section () {
    echo "<h2>$1</h2>"
    echo "<ul>"
    curl -s "$3" | \
        awk -F '>' -v RS='<' -v m=${4:-5} '
(/^item[> ]/) {
  a++;
}

(/^title/) {
  title=$2;
}

(a && a<m+1 && /^link/) {
  l=$2;
  sub(/.*url=/, "", l);
  print "<li><a href=\"http://news.google.com/gwt/x?u=" l "\">" title "</a></li>";
}'

    echo "</ul>"
    echo "<p class=\"more\"><a href=\"$2\">more...</a></p>"
}

cat <<EOF
Content-type: text/html

<!DOCTYPE html>
<html>
  <head>
    <title>Houyhnhnm</title>
    <style type="text/css">
h1 { 
  font-size: large; 
  font-weight: bold;
  text-align: center;
}
h2 {
  font-size: large;
  font-weight: normal;
  font-style: italic;
}
.calendar {
  height: 300px;
  float: right;
}
    <link rel="icon" type="image/png" href="portal.png" />
    <meta http-equiv="refresh" content="500">
    </style>
  </head>
  <body>
EOF

if [ -z "$HTTP_X_WAP_PROFILE" ]; then
    echo '<iframe class="calendar" src="https://www.google.com/calendar/embed?showTitle=0&showDate=0&showPrint=0&showCalendars=0&showTz=0&mode=AGENDA&height=350&wkst=1&bgcolor=%23FFFFFF&src=2cdrf19kah6jkonhom8evck38c%40group.calendar.google.com&color=%23333333&src=s531giqfiotabht4qrn59tjf9g%40group.calendar.google.com&color=%231B887A&src=umtjjc250gp0m5gm8h3dn13hcc%40group.calendar.google.com&color=%236E6E41&src=dartcatcher%40gmail.com&color=%23125A12&src=ameigh%40gmail.com&color=%2329527A&src=laderbydames%40gmail.com&color=%2323164E&src=en.usa%23holiday%40group.v.calendar.google.com&color=%238D6F47&ctz=America%2FDenver"></iframe>'
fi

cat <<EOF
    <form action="http://m.google.com/"><input name="q" size="12"><input type="submit" value="G"></form>
EOF
weather
section "Top Stories" \
    'http://news.google.com/m?pz=1&cf=all&ned=us&hl=en' \
    'http://news.google.com/news?pz=1&cf=all&ned=us&hl=en&gwt=on&output=rss'
section "World News" \
    'http://news.google.com/m?pz=1&cf=all&ned=us&hl=en&topic=w' \
    'http://news.google.com/news?pz=1&cf=all&ned=us&hl=en&topic=w&output=rss'
section "CSM" \
    'http://www.csmonitor.com/textedition' \
    'http://rss.csmonitor.com/feeds/csm'
section NPR \
    'http://thin.npr.org/t.php?tid=1001' \
    'http://www.npr.org/rss/rss.php?id=1001'
section "Ars Technica" \
    'http://m.arstechnica.com/' \
    'http://feeds.arstechnica.com/arstechnica/index?format=xml'
cat <<EOF
  </body>
</html>
EOF
