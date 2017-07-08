Title: Social Letter Generator

<button onclick="init();" style="float: right;">Regenerate</button>

<p>
  <span id="intro"></span>
</p>

<p>
  <span id="first"></span>
  <span id="shits"></span>
</p>

<p>
  <span id="closer"></span>
</p>


<script>
intro = [
  "How's it going?",
  "How's the weather?",
  "Hi!",
  "I hate your guts!",
  "How's the gonnorhea?",
  "Greetings from Hotel Hell!"
];

first = [
  "I hope things are going well for you and dear wossname.",
  "I apologize for taking so long to write you: it's just that I hate your guts.",
  "Found any tasty roadkill lately?",
  "It's finally cooling off here.",
  "It's been hot as hell here!",
  "The mice are after my lucky charms.",
  "Everything's going great in the new place.",
  "I hope everyone is your family is still mostly free of bullet holes.",
  "How are the kids?",
  "Things here are crazy as usual.",
  "My feet look like tomatoes!",
  "I really appreciated that forward you sent me.",
  "Sometimes I wish I were a shark, and could eat my boss.",
  "Do you ever see the resemblance between scrambled eggs and WWII-era British gunboats?",
  "Boy, does our dog fart a lot!"
];

shit = [
  "We're only now recovering from our guests.",
  "Sometimes I wonder if my body parts are made of toast.",
  "Did you catch the latest episode of popular reality show?",
  "I should probably go pee.",
  "The dog has been eating a lot of poo lately.",
  "Ha ha ha!",
  "But like I always say, \"if you can't stand the heat, bomb the utilites department!\"",
  "Beets are an under-utilized fruit when it comes to industrial construction techniques, don't you think?",
  "We've been doing a lot of work on the toilet in the last few weeks.",
  "Mom never told me it would be like this when I grew up!",
  "Know what I mean?",
  "Sometimes I like to dress up and play nurse with the neighbors.",
  "Our plants are doing well.",
  "Doug is finally out on parole.",
  "Yesterday, little Jimmy blew up another Dairy Queen.",
  "The weather here has been really weathery in recent days.",
  "The doctor says I have a good chance of recovery if I can quit eating glass.",
  "Last month we investigated different uses for a bloody, severed arm.",
  "Congolese mercenaries have taken our food processor hostage and are demanding a ransom.",
  "Hey, will snake venom stain silk?",
  "I keep digging and digging but I don't think I'm ever going to get those pesky shinbones out of my legs.",
  "My bowel movements have never been better!",
  "I got screened for colon cancer last week.",
  "Who knew?",
  "Turns out those lumps in my legs were something called \"kneecaps\".",
  "The lawn is a constant source of stress.",
  "Yesterday I fell down the stairs.",
  "No, really!",
  "We keep hearing about these killer bees, but I think they're just a myth.",
  "This summer we're going to try ice fishing for the first time!",
  "Yesterday I won the statewide tiddlywinks championship!",
  "Sometimes I just want to give up.",
  "Junior finally made first chair in marching band, not that you'd care.",
  "Aunt Marge is finally talking about getting out of prostitution.",
  "Thank goodness!",
  "Ever notice how if you sit around long enough, you start to get dusty?",
  "Do you know how to get blood out of carpet?  I mean, a lot of it.",
  "I've also noticed a sharp increase in the number of leprechauns dancing in the sink."
];

closing = [
  "Well, I'd better be going.",
  "Oops, the dog just puked on the baby!",
  "Whoa Nellie, the TV just exploded!",
  "Uh oh, I think that burning smell is coming from the kitchen!",
  "I'd love to keep writing, but actually I wouldn't.",
  "Hey, nice writing you, but please don't respond or I'll have to do it again.",
  "Keep in touch!",
  "I hate your guts!",
  "Wow, was that a meteor that just hit the shed?",
  "I'd love to keep writing but I have to stare at my fingernails now.",
  "Oh hey look at the time.",
  "We're all eagerly anticipating your next insane diatribe.",
  "Please keep the letters coming!  We're running out of kindling for the stove!",
  "Talk to you later."
];

function choice(a) {
  var max = Math.floor(a.length * Math.random());
  return a[max];
}

function init() {
  document.getElementById("intro").textContent = choice(intro);
  document.getElementById("first").textContent = choice(first);
  document.getElementById("closer").textContent = choice(closing);
  
  var nshits = Math.floor(Math.random() * 5) + 5;
  var shits = [];
  for (var i = 0; i < nshits; i += 1) {
    shits.push(choice(shit));
  }
  document.getElementById("shits").textContent = shits.join(" ");
}

window.addEventListener("load", init);
</script>