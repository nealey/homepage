(** A stupid adventure game

    Nick wanted an adventure game framework.  Here ya go, Nick.

    Compile this with
      ocamlc -o foo foo.ml

    @author Neale Pickett <neale@woozle.org>
    
*)

(** Directions *)
type direction = North | South | East | West | Up | Down | Emad

(** An item *)
type item = {
  names: string list;
  i_full_name: string;
  i_description: string;
  actions: (string * (item -> unit)) list;
}

(** A room.  Contents are mutable so that the player can pick stuff
    up.  Exits are mutable so that I can link them back and forth *)
type room = {
  r_full_name: string;
  r_description: string;
  mutable contents: item list;
  mutable exits: (direction * room) list;
}

(** The player *)
type player = {
  mutable carrying: item list;
  mutable location: room;
}

let player = {
  carrying = [];
  location = {
    r_full_name = "Nowhere";
    r_description = "Non-descript";
    contents = [];
    exits = []
  }
}

(*
 *
 * General functions
 *
 *)

(** Relocate something

    Note that this does no checks to make sure the item is actually in
    src!

    @param i item to relocate
    @param src where it comes from
    @param dst where it goes
    @return (new src, new dst)
*)
let move i src dst =
  (List.filter ((!=) i) src,
   i :: dst)


(** Is the player carrying an item? *)
let carrying p i =
  List.exists ((==) i) p.carrying

(** Drop something *)
let drop i =
  if carrying player i then
    let carrying, contents = move i player.carrying player.location.contents in
      player.carrying <- carrying;
      player.location.contents <- contents;
  else
    raise (Failure ("You're not carrying " ^ i.i_full_name ^ "!"))
	

(** Pick something up *)
let get i =
  if carrying player i then
    raise (Failure ("You already have " ^ i.i_full_name ^ "!"))
  else if List.exists ((==) i) player.location.contents then
    let contents, carrying = move i player.location.contents player.carrying in
      player.carrying <- carrying;
      player.location.contents <- contents;
  else
    raise (Failure ("You don't see " ^ i.i_full_name ^ " here!"))

    
(** Describe an item *)
let describe i =	
  print_endline i.i_description

(*
 *
 * Rooms
 *
 * There's really no need to clutter up the global namespace here,
 * since all I really need is "start_location" to set the starting
 * location.
 *
 *)
let start_location =
  let bigroom = {			(* Big room *)
    r_full_name = "The big room";
    r_description = "This is that big room just outside the computer lab " ^
      "with the blue ceiling.  It smells fresh, yet dirty at the same time.  " ^
      "Off to the north is a grassy knoll.";
    contents = [
      {					(* lantern *)
	names = ["brass lantern"; "brass"; "lantern"; "lamp"; "light"];
	i_full_name = "a brass lantern";
	i_description = "This rusty lantern looks like it's been used in " ^
	  "one too many adventure games.";
	actions = [
	  ("rub",
	   fun self ->
	     print_endline "Nothing happens.";
	  );
	  ("kick",
	   fun self ->
	     print_endline "There'll be a hot time in the old town tonight!";
	  )
	]
      };
      {					(* stone *)
	names = ["smooth"; "stone"; "rock"];
	i_full_name = "a smooth stone";
	i_description = "This stone is smooth.  Yes it is.";
	actions = [
	  ("rub",
	   fun self ->
	     print_endline "Your worries seem to vanish.";
	  );
	  ("throw",
	   fun self ->
	     print_endline "You throw the stone.";
	     let carrying, contents = (move self player.carrying
					 player.location.contents) in
	       drop self;
	       print_endline "It lands a stone's throw away.";
	  )
	]
      }
    ];
    exits = []
  }
  in
  let knoll = {				(* Grassy knoll *)
    r_full_name = "Grassy knoll";
    r_description = "You find yourself standing on the top of a " ^
      "small mound.  The green carpeting of grass beneath your feet " ^
      "beckons kite-flying or frisbee-throwing.  Near the bottom of the " ^
      "mound is a funny-looking man intensely examining a teacup.  He " ^
      "is wearing a nametag reading \"Emad\".";
    contents = [];
    exits = []
  }
  in
  let emad = {
    r_full_name = "Emad";		(* Emad *)
    r_description = "You are in Emad.  How unpleasant.";
    contents = [
      {					(* ham sandwich *)
	names = ["ham and bacon sandwich"; "bacon sandwich"; "ham sandwich";
		 "sandwich"; "ham"; "bacon"];
	i_full_name = "a delicious ham and bacon sandwich";
	i_description = "Named after John Montagu, fourth Earl of Sandwich, " ^
	  "this savory instance is comprised of ham and bacon, \"sandwiched\" " ^
	  "as it were between two slices of whole-wheat bread.";
	actions = [
	  ("eat",
	   fun self ->
	     print_endline "A little acidic, but not bad."
	  )
	]
      }
    ];
    exits = []
  }
  in
    begin
      bigroom.exits <- [(North, knoll)];
      knoll.exits <- [(South, bigroom);
		      (Emad, emad)];
      emad.exits <- [(Up, knoll)];
      bigroom
    end

let describe_room r =
  let rec display_items = function
    | [] ->
	" nothing"
    | [i] ->				(* just one *)
	(" " ^ i.i_full_name)
    | [i; j] ->				(* two *)
	(" " ^ i.i_full_name ^
	   ", and " ^ j.i_full_name)
    | i :: j :: tl ->			(* multiple *)
	(" " ^ i.i_full_name ^ "," ^
	   display_items (j :: tl))
  in
  print_endline "";
  print_endline r.r_full_name;
  print_endline "";
  print_endline r.r_description;
  if (r.contents = []) then
    print_endline ""
  else
    print_endline ("You see" ^ (display_items r.contents) ^ " here.")


(*
 *
 * Player functions
 *
 *)


let rec find_item name l =
  match (name, l) with
    | _, [] ->
	raise Not_found
    | name, i :: tl ->
	if List.exists ((=) name) i.names then
	  i
	else
	  find_item name tl

let rec find_action action l =
  match (action, l) with
    | _, [] ->
	raise Not_found
    | action, (name, func) :: tl ->
	if (action = name) then
	  func
	else
	  find_action action tl
    
(** Apply action to name

    @param action What to do
    @param name What to do it to
*)
let apply_action action name =
  match action with
    | "describe" | "look" | "l" ->
	let i = try
	  find_item name player.carrying
	with Not_found ->
	  try
	    find_item name player.location.contents
	  with Not_found ->
	    raise (Failure "You're not carrying that.")
	in
	  describe i
    | "take" | "get" ->
	let i = try
	  find_item name player.location.contents
	with Not_found ->
	  raise (Failure "You don't see that here.")
	in
	  get i;
	  print_endline "Taken."
    | "drop" ->
	let i = try
	  find_item name player.carrying
	with Not_found ->
	  raise (Failure "You're not carrying that.")
	in
	  drop i;
	  print_endline "Dropped."
    | _ ->
	let i = try
	  find_item name player.carrying
	with Not_found ->
	  raise (Failure "You don't have that.")
	in
	let a = try
	  find_action action i.actions
	with Not_found ->
	  raise (Failure ("You can't do that to " ^ i.i_full_name ^ "."))
	in
	  a i
  
(** Move the player

    @param dir direction
*)
let go dir =
  let moveout (d, room) =
    if d = dir then
      begin
	player.location <- room;
	describe_room player.location;
      end
  in
  let here = player.location in
    List.iter moveout player.location.exits;
    if here == player.location then
      raise (Failure "You can't get there from here.")
      
(** Display inventory
*)
let inventory () =
  let print_item i =
    print_endline ("* " ^ i.i_full_name)
  in
    if (player.carrying = []) then
      print_endline "You are empty-handed."
    else
      begin
	print_endline "You are carrying: ";
	List.iter print_item player.carrying
      end


(** Do something

    @param action What to do
*)
let do_action action =
  match action with
    | "inventory" | "inv" | "i" ->
	inventory ()
    | "look" | "l" ->
	describe_room player.location
    | "north" | "n" ->
	go North
    | "south" | "s" ->
	go South
    | "east" | "e" ->
	go East
    | "west" | "w" ->
	go West
    | "up" | "u" ->
	go Up
    | "down" | "d" ->
	go Down
    | "emad" ->
	go Emad
    | _ ->
	print_endline "I'm sorry, Dave, I'm afraid I can't do that."
    
(** Parse a line

    @param str the line to parse
*)
let parse str =
  try
    let action, name =
      let pos = String.index str ' ' in
	(String.sub str 0 pos,
	 String.sub str (pos + 1) ((String.length str) - pos - 1))
    in
      apply_action action name
  with Not_found ->
    do_action str
    
(** Read-Eval-Print loop
*)
let rec repl () =
  let line = read_line () in
    print_endline "";
    begin
      try
	parse (String.lowercase line)
      with Failure str ->
	print_endline str
    end;
    repl ()

let main () =
  player.location <- start_location;
  describe_room player.location;
  repl ()

let _ =
  try
    main ()
  with End_of_file ->
    ()

  
