<html>
<head>
<title>crunt</title>
</head>
<body>
<?php
$crunts = rand() % 500;
$baby = $crunts * 0.75;
for ($i = 1; $i < $crunts; $i += 1) {
  if (($i < $baby)
      && (rand() % 10 > 7)) {
    print "<strong>CRUNT</strong> ";
  } else {
    print "crunt ";
  }
}
print "<strong>CRUNT!</strong>";
?>
</body>
</html>