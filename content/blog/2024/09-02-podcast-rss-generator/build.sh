#! /bin/sh

set -e

cd $(dirname $0)
. config.sh

out="rss.xml"
exec 1>$out
echo "Writing to $out" 1>&2

cat <<EOF
<?xml version="1.0" encoding="utf-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
  <channel>
    <title>$title</title>
    <link>$url</link>
    <language>en</language>
    <description>$description</description>
    <atom:link href="$url/$out" rel="self" type="application/rss+xml" />
EOF

if [ -f cover.jpg ]; then
  cat <<EOF
    <image>
      <url>$url/cover.jpg</url>
      <title>$title</title>
      <link>$url</link>
    </image>
EOF
fi

for fn in *.mp3; do
  echo "- $fn" 1>&2

  ffprobe -loglevel quiet -show_entries format -output_format json "$fn" > format.json
  title=$(cat format.json | jq -r '.format.tags.title')
  duration=$(cat format.json | jq -r '.format.duration | tonumber | ceil')
  #bps=$(cat format.json | jq -r '.format.bit_rate')
  #kbps=$(($bps / 1000))
  rm format.json
  guid=$(sha1sum "$fn" | awk '{print $1}')
  size=$(stat -c %s "$fn")
  mtime=$(date -R -d @$(stat -c %Y "$fn"))
  ufn=$(echo $fn | tr ' ' '+')

  cat <<EOF
    <item>
      <title>$title</title>
      <pubDate>$mtime</pubDate>
      <itunes:duration>$duration</itunes:duration>
      <enclosure url="$url/$ufn" type="audio/mpeg" length="$size" />
      <guid isPermaLink="false">$guid</guid>
    </item>
EOF
done

cat <<EOF
  </channel>
</rss>
EOF
