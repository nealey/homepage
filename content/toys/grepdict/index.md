---
title: Grep Dict
description: runs grep on a list of English words; perfect for cheating on crossword puzzles
scripts:
- grepdict.js
---

Ever wanted to run `grep` on `/usr/share/dict/words`,
but you only have a phone?
Me too.

<!-- <label for="regexp">Match Regex</label>: -->
<input id="regexp" type="search" disabled="true" value="loading...">
<button id="anchor">^$</button>

<ul id="matches"></ul>
