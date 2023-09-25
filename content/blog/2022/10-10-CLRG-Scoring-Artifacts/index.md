---
title: CLRG Award Points Artifacts
date: 2022-10-10T08:00:00-06:00
tags:
    - clrg
stylesheets:
    - toys.css
scripts:
    - speculator.mjs
---

One quirk of awards points is that for any given overall
score, there are only a handful of possible judge rankings that could have led
to it. That means you can make some guesses about how each judge ranked an
individual dancer, based on only their total award points.

Here's a handy calculator!
It (currently) doesn't consider the possibility of a tie.

<div class="scrolly">
    <fieldset class="speculator">
        <legend>CLRG Award Points Speculator</legend>
        <div>
            Points: <input name="points" type="number" min=41 max=10000 value=188>
            <input name="adjudicators" type="hidden">
        </div>
        <table class="results">
            <caption>Possible Rankings</caption>
            <thead>
                <tr class="warning"><th>Computing: this could take a while!</th></tr>
            </thead>
            <tbody></tbody>
        </table>
    </fieldset>
</div>
