/*
 * Description: Neale's DWM config
 * Author: Neale Pickett <neale@woozle.org>
 * Time-stamp: <2008-03-31 11:52:28 neale>
 */

#define TERM "rxvt"

/* appearance */
#define BORDERPX		2
#define FONT			"-adobe-helvetica-medium-r-*-*-10-*-*-*-*-*-*-*"
#define NORMBORDERCOLOR		"#cfdde6"
#define SELBORDERCOLOR		"#80d0ff"
#define NORMBGCOLOR		"#69668b"
#define NORMFGCOLOR		"#d3d1e6"
#define SELBGCOLOR		"#ccb48f"
#define SELFGCOLOR		"#000000"

/* tagging */
const char tags[][MAXTAGLEN] = { "1", "2", "3", "4", "5", "6", "7", "8", "9" };

Rule rules[] = {
  /* class:instance:title substr	tags ref	isfloating */
  { "Gimp",			tags[5],	True },
  { "KNetworkManager",		tags[8],	False },
};

/* layout(s) */
#define RESIZEHINTS		True	/* False - respect size hints in tiled resizals */
#define SNAP			32	/* snap pixel */

Layout layouts[] = {
  /* symbol		function	isfloating */
  { "[]=",		tilev,		False }, /* first entry is default */
  { "><>",		floating,	True },
  { "[M]",		monocle,	False },
};

const char *layoutcycle[] = {"[]=", "[M]"};

void
nextlayout(const char *arg)
{
  static int which = 0;

  which = (which + 1) % LENGTH(layoutcycle);
  setlayout(layoutcycle[which]);
}

void
restart(const char *arg)
{
  if (arg) {
    execlp(arg, arg, NULL);
  } else {
    execlp("dwm", "dwm", NULL);
  }
}

/* key definitions */
#define MODKEY Mod4Mask
Key keys[] = {
  /* modifier			key		function	argument */
  { MODKEY,			XK_a,		spawn,
    "exec dmenu_run -fn '"FONT"' -nb '"NORMBGCOLOR"' -nf '"NORMFGCOLOR"' -sb '"SELBGCOLOR"' -sf '"SELFGCOLOR"'" },
  { MODKEY|ShiftMask,		XK_Return,	spawn,		"exec " TERM },
  { MODKEY,			XK_l,		spawn,		"exec screenlock" },
  { MODKEY,			XK_m,		spawn,		"exec " TERM " -e ncmpc" },
  { MODKEY,			XK_w,		spawn,		"exec mpc prev" },
  { MODKEY,			XK_v,		spawn,		"exec mpc toggle" },
  { MODKEY,			XK_z,		spawn,		"exec mpc next" },

  { MODKEY,			XK_n,		focusnext,	NULL },
  { MODKEY,			XK_t,		focusprev,	NULL },
  { MODKEY,			XK_Return,	zoom,		NULL },
  { MODKEY,			XK_equal,	nextlayout,	NULL },
  { MODKEY|ShiftMask,		XK_equal,	setlayout,	"><>" },
  { MODKEY|ShiftMask,		XK_space,	togglefloating,	NULL },
  { MODKEY,			XK_grave,	killclient,	NULL },
  { MODKEY,			XK_0,		view,		NULL },
  { MODKEY,			XK_1,		view,		tags[0] },
  { MODKEY,			XK_2,		view,		tags[1] },
  { MODKEY,			XK_3,		view,		tags[2] },
  { MODKEY,			XK_4,		view,		tags[3] },
  { MODKEY,			XK_5,		view,		tags[4] },
  { MODKEY,			XK_6,		view,		tags[5] },
  { MODKEY,			XK_7,		view,		tags[6] },
  { MODKEY,			XK_8,		view,		tags[7] },
  { MODKEY,			XK_9,		view,		tags[8] },
  { MODKEY|ShiftMask,		XK_0,		tag,		NULL },
  { MODKEY|ShiftMask,		XK_1,		tag,		tags[0] },
  { MODKEY|ShiftMask,		XK_2,		tag,		tags[1] },
  { MODKEY|ShiftMask,		XK_3,		tag,		tags[2] },
  { MODKEY|ShiftMask,		XK_4,		tag,		tags[3] },
  { MODKEY|ShiftMask,		XK_5,		tag,		tags[4] },
  { MODKEY|ShiftMask,		XK_6,		tag,		tags[5] },
  { MODKEY|ShiftMask,		XK_7,		tag,		tags[6] },
  { MODKEY|ShiftMask,		XK_8,		tag,		tags[7] },
  { MODKEY|ShiftMask,		XK_9,		tag,		tags[8] },
  { MODKEY,			XK_q,		restart,	NULL },
  { MODKEY|ShiftMask,		XK_q,		quit,		NULL },
};
