import React, { useState, useEffect, useRef, useCallback } from "react";

const C={
  bg:"#080B0C",
  nav:"#0D1112",
  navy:"#101516",
  navy2:"#151A1B",
  card:"#141819",
  card2:"#1A2021",
  cream:"#F4EFE6",
  cream2:"#EDE4D8",
  mauve:"#F2A7C8",
  blush:"#F7B7D2",
  rose:"#EE8DBB",
  dusty:"#F4CBDD",
  gold:"#D8A85E",
  green:"#8ECFA2",
  teal:"#35CFC9",
  blue:"#8BB8D8",
  purple:"#CBA6F7",
  pink:"#FF8CC6",
  orange:"#D8A85E",
  coral:"#F08AA8",
  red:"#D98484",
  white:"#FFFFFF",
  text:"#F7F4EC",
  darkText:"#111414",
  muted:"#AEB6B4",
  light:"#E6EEEC",
  border:"rgba(255,255,255,.12)"
};
const svgImg=s=>`data:image/svg+xml;utf8,${encodeURIComponent(s)}`;
const REWARD_THUMBS={
  basketball:svgImg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="b" x1="0" x2="1"><stop stop-color="#d98235"/><stop offset="1" stop-color="#b75d24"/></linearGradient></defs><rect width="200" height="200" rx="42" fill="#F7F4EC"/><circle cx="100" cy="100" r="58" fill="url(#b)" stroke="#3b2316" stroke-width="5"/><path d="M43 100h114M100 42c24 28 24 88 0 116M55 62c40 25 72 58 90 99M145 62c-40 25-72 58-90 99" fill="none" stroke="#3b2316" stroke-width="5" stroke-linecap="round"/></svg>`),
  jersey:svgImg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="42" fill="#F7F4EC"/><path d="M66 30h30c4 12 4 22 4 22s0-10 4-22h30l24 28-20 28-8-8v88H70V78l-8 8-20-28 24-28z" fill="#101516" stroke="#D8A85E" stroke-width="5" stroke-linejoin="round"/><path d="M78 36c8 18 36 18 44 0" fill="none" stroke="#D8A85E" stroke-width="4"/><text x="100" y="94" text-anchor="middle" font-family="Arial Black,Arial" font-size="23" fill="#F7F4EC">ACES</text><text x="100" y="132" text-anchor="middle" font-family="Arial Black,Arial" font-size="43" fill="#F7F4EC">10</text><path d="M72 160h56" stroke="#FF8CC6" stroke-width="5" stroke-linecap="round"/></svg>`),
  backpack:svgImg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="42" fill="#F7F4EC"/><path d="M68 72c0-26 15-42 32-42s32 16 32 42" fill="none" stroke="#111414" stroke-width="10" stroke-linecap="round"/><rect x="54" y="55" width="92" height="116" rx="26" fill="#151A1B" stroke="#303738" stroke-width="5"/><rect x="70" y="108" width="60" height="43" rx="12" fill="#242B2C" stroke="#3B4546" stroke-width="4"/><path d="M76 78h48M82 130h36" stroke="#FF8CC6" stroke-width="5" stroke-linecap="round"/><path d="M145 72c10 16 12 48 4 72M55 72c-10 16-12 48-4 72" fill="none" stroke="#111414" stroke-width="7" stroke-linecap="round"/></svg>`),
  sneaker:svgImg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="42" fill="#F7F4EC"/><path d="M45 121c22 4 44-2 59-24l14-22c18 24 30 34 55 40 8 2 12 9 9 17-3 10-13 15-25 15H58c-13 0-23-7-25-16-1-6 4-11 12-10z" fill="#151A1B" stroke="#2C3435" stroke-width="5" stroke-linejoin="round"/><path d="M75 119c31 6 55 2 86-4M99 93l30 23M88 103l24 16M118 76l-13 30" fill="none" stroke="#FF8CC6" stroke-width="5" stroke-linecap="round"/><path d="M48 139h121" stroke="#D8A85E" stroke-width="6" stroke-linecap="round"/></svg>`)
};


// 5 tabs instead of 12
const TABS=[
  {id:"today",e:"🏠",label:"Today"},
  {id:"hoops",e:"🏀",label:"Sports"},
  {id:"glow",e:"✨",label:"My Glow"},
  {id:"wishlist",e:"🛍️",label:"Wishlist"},
  {id:"goals",e:"🎯",label:"Goals"},
  {id:"progress",e:"🎁",label:"Rewards"},
];

const DEF_VITALS={energy:0,mood:0};
// No preset daily quests. Scarlett creates these herself.
const DEF_HABITS=[];
const DEF_SKILLS={"Ball Handling":35,"Shooting Form":30,"Layups":35,"Free Throws":30,"Passing":35,"Court Vision":30,"Defense":30,"Rebounding":30,"Footwork":30,"Speed & Agility":35,"Conditioning":35,"Basketball IQ":30,"Confidence":45,"Leadership":40};

const SPORT_TEMPLATES={
  basketball:{
    id:"basketball",label:"Basketball",short:"Hoops",icon:"🏀",accent:C.mauve,hero:"Hoop section",tagline:"Shots, assists, rebounds, defense, and confidence.",
    statFields:[{key:"pts",label:"Points",group:"Scoring"},{key:"fgm",label:"Shots Made",group:"Shooting"},{key:"fga",label:"Shots Attempted",group:"Shooting"},{key:"ftm",label:"Free Throws Made",group:"Shooting"},{key:"fta",label:"Free Throws Attempted",group:"Shooting"},{key:"ast",label:"Assists",group:"Impact"},{key:"reb",label:"Rebounds",group:"Impact"},{key:"stl",label:"Steals",group:"Defense"},{key:"blk",label:"Blocks",group:"Defense"},{key:"tov",label:"Turnovers",group:"Mistakes"},{key:"fouls",label:"Fouls",group:"Mistakes"}],
    skills:["Ball Handling","Shooting Form","Layups","Free Throws","Passing","Court Vision","Defense","Rebounding","Footwork","Speed & Agility","Conditioning","Basketball IQ","Confidence","Leadership"],
    practiceTypes:["Team Practice","Home Workout","Shooting","Ball Handling","Defense","Full Workout"],
    insights:["Track shot attempts with makes so progress is honest.","Free throws are the easiest place to earn points.","Rebounds, steals, and assists show impact beyond scoring."]
  },
  soccer:{
    id:"soccer",label:"Soccer",short:"Goals",icon:"⚽",accent:C.teal,hero:"Goal stats",tagline:"Goals, assists, shots, passes, tackles, saves, and minutes.",
    statFields:[{key:"goals",label:"Goals",group:"Attack"},{key:"assists",label:"Assists",group:"Attack"},{key:"shots",label:"Shots",group:"Attack"},{key:"shotsOnGoal",label:"Shots On Goal",group:"Attack"},{key:"passesCompleted",label:"Passes Completed",group:"Team Play"},{key:"tackles",label:"Tackles",group:"Defense"},{key:"saves",label:"Saves",group:"Goalie"},{key:"fouls",label:"Fouls",group:"Discipline"},{key:"minutes",label:"Minutes",group:"Effort"}],
    skills:["Dribbling","Passing","Shooting","First Touch","Defense","Field Vision","Conditioning","Confidence"],
    practiceTypes:["Team Practice","Shooting","Dribbling","Passing","Defense","Conditioning"],
    insights:["Shots on goal matter more than total shots.","Passing and tackles show team impact even without scoring.","Minutes plus effort helps parents see real participation."]
  },
  tennis:{
    id:"tennis",label:"Tennis",short:"Court",icon:"🎾",accent:C.gold,hero:"Court tracking",tagline:"Serves, rallies, winners, errors, games, and match confidence.",
    statFields:[{key:"aces",label:"Aces",group:"Serve"},{key:"doubleFaults",label:"Double Faults",group:"Serve"},{key:"firstServesIn",label:"1st Serves In",group:"Serve"},{key:"serveAttempts",label:"Serve Attempts",group:"Serve"},{key:"winners",label:"Winners",group:"Match"},{key:"unforcedErrors",label:"Unforced Errors",group:"Match"},{key:"ralliesWon",label:"Rallies Won",group:"Rallies"},{key:"gamesWon",label:"Games Won",group:"Score"},{key:"setsWon",label:"Sets Won",group:"Score"}],
    skills:["Serve","Return","Footwork","Forehand","Backhand","Consistency","Focus","Confidence"],
    practiceTypes:["Serve Practice","Rally Work","Footwork","Match Play","Conditioning"],
    insights:["Serve consistency is the first pressure point to track.","Winners and errors together show decision quality.","Court confidence grows when improvement is visible."]
  },
  volleyball:{
    id:"volleyball",label:"Volleyball",short:"Volley",icon:"🏐",accent:C.purple,hero:"Court impact",tagline:"Serves, aces, kills, digs, assists, blocks, and errors.",
    statFields:[{key:"servesMade",label:"Serves Made",group:"Serve"},{key:"servesAttempted",label:"Serves Attempted",group:"Serve"},{key:"aces",label:"Aces",group:"Serve"},{key:"kills",label:"Kills",group:"Attack"},{key:"attackAttempts",label:"Attack Attempts",group:"Attack"},{key:"digs",label:"Digs",group:"Defense"},{key:"assists",label:"Assists",group:"Team Play"},{key:"blocks",label:"Blocks",group:"Defense"},{key:"errors",label:"Errors",group:"Discipline"}],
    skills:["Serving","Passing","Setting","Hitting","Blocking","Communication","Court Awareness","Confidence"],
    practiceTypes:["Team Practice","Serving","Passing","Setting","Hitting","Defense"],
    insights:["Serving accuracy is a great first stat to track.","Digs and communication show team value beyond scoring.","Errors are not failure; they show where practice should focus."]
  },
  softball:{
    id:"softball",label:"Softball / Baseball",short:"Diamond",icon:"🥎",accent:C.orange,hero:"Diamond stats",tagline:"At-bats, hits, runs, RBIs, walks, strikeouts, steals, and fielding.",
    statFields:[{key:"atBats",label:"At Bats",group:"Hitting"},{key:"hits",label:"Hits",group:"Hitting"},{key:"runs",label:"Runs",group:"Offense"},{key:"rbi",label:"RBIs",group:"Offense"},{key:"walks",label:"Walks",group:"Plate Discipline"},{key:"strikeouts",label:"Strikeouts",group:"Plate Discipline"},{key:"stolenBases",label:"Stolen Bases",group:"Base Running"},{key:"fieldingPlays",label:"Fielding Plays",group:"Defense"},{key:"errors",label:"Errors",group:"Defense"}],
    skills:["Hitting","Fielding","Throwing","Catching","Base Running","Situational Awareness","Confidence"],
    practiceTypes:["Batting Practice","Fielding","Throwing","Base Running","Team Practice"],
    insights:["Hits and walks together show plate progress.","Fielding plays help track defensive confidence.","Base running is a skill, not just speed."]
  },
  football:{
    id:"football",label:"Football",short:"Football",icon:"🏈",accent:C.green,hero:"Position stats",tagline:"Flexible tracking for offense, defense, effort, and position-specific progress.",
    statFields:[{key:"snaps",label:"Snaps Played",group:"Playing Time"},{key:"touchdowns",label:"Touchdowns",group:"Scoring"},{key:"yards",label:"Total Yards",group:"Offense"},{key:"receptions",label:"Receptions",group:"Offense"},{key:"tackles",label:"Tackles",group:"Defense"},{key:"sacks",label:"Sacks",group:"Defense"},{key:"interceptions",label:"Interceptions",group:"Defense"},{key:"forcedFumbles",label:"Forced Fumbles",group:"Defense"},{key:"flags",label:"Flags",group:"Discipline"}],
    skills:["Speed","Agility","Catching","Blocking","Tackling","Field Awareness","Conditioning","Confidence"],
    practiceTypes:["Team Practice","Conditioning","Routes","Defense","Footwork","Film Study"],
    insights:["Football stats should match the child’s position.","Snaps and effort show growth even before big plays.","Discipline stats help build a smarter player."]
  },
  track:{
    id:"track",label:"Track & Field",short:"Track",icon:"👟",accent:C.blue,hero:"PR tracking",tagline:"Times, distances, attempts, personal records, and event progress.",
    statFields:[{key:"eventCount",label:"Events Logged",group:"Events"},{key:"bestTime",label:"Best Time",group:"Track"},{key:"practiceMinutes",label:"Practice Minutes",group:"Training"},{key:"sprints",label:"Sprints",group:"Speed"},{key:"distance",label:"Distance",group:"Endurance"},{key:"jumps",label:"Jump Attempts",group:"Field"},{key:"throws",label:"Throw Attempts",group:"Field"},{key:"personalRecords",label:"PRs",group:"Growth"}],
    skills:["Speed","Start Technique","Endurance","Form","Explosiveness","Focus","Confidence"],
    practiceTypes:["Sprint Work","Distance Work","Starts","Jumps","Throws","Conditioning"],
    insights:["PRs are the clearest way to see progress.","Technique matters as much as speed.","Small time drops are big wins."]
  },
  cheer:{
    id:"cheer",label:"Cheerleading",short:"Cheer",icon:"📣",accent:C.pink,hero:"Routine energy",tagline:"Jumps, stunts, tumbling, timing, teamwork, and confidence.",
    statFields:[{key:"routineRuns",label:"Routine Runs",group:"Routine"},{key:"jumps",label:"Jumps Completed",group:"Skills"},{key:"stuntAttempts",label:"Stunt Attempts",group:"Stunts"},{key:"stuntHits",label:"Stunt Hits",group:"Stunts"},{key:"tumblingAttempts",label:"Tumbling Attempts",group:"Tumbling"},{key:"tumblingLanded",label:"Tumbling Landed",group:"Tumbling"},{key:"energy",label:"Energy Rating",group:"Performance"},{key:"teamwork",label:"Teamwork Rating",group:"Team"}],
    skills:["Jumps","Tumbling","Stunts","Dance","Timing","Flexibility","Confidence","Teamwork"],
    practiceTypes:["Routine Practice","Jumps","Tumbling","Stunts","Dance","Conditioning"],
    insights:["Cheer progress is skill plus confidence.","Stunt hits and attempts both matter.","Teamwork is a real performance stat."]
  },
  gymnastics:{
    id:"gymnastics",label:"Gymnastics",short:"Gym",icon:"🤸",accent:C.teal,hero:"Skill landing",tagline:"Events, attempts, landings, form, confidence, strength, and flexibility.",
    statFields:[{key:"skillsAttempted",label:"Skills Attempted",group:"Training"},{key:"skillsLanded",label:"Skills Landed",group:"Training"},{key:"floor",label:"Floor Work",group:"Events"},{key:"beam",label:"Beam Work",group:"Events"},{key:"bars",label:"Bars Work",group:"Events"},{key:"vault",label:"Vault Work",group:"Events"},{key:"form",label:"Form Rating",group:"Technique"},{key:"confidence",label:"Confidence",group:"Mindset"}],
    skills:["Balance","Power","Flexibility","Form","Strength","Consistency","Confidence"],
    practiceTypes:["Floor","Beam","Bars","Vault","Strength","Flexibility"],
    insights:["Attempts build courage even before a skill is landed.","Form and consistency matter more than rushing levels.","Confidence is a skill to track."]
  },
  karate:{
    id:"karate",label:"Karate / Martial Arts",short:"Karate",icon:"🥋",accent:C.red,hero:"Discipline tracking",tagline:"Classes, forms, techniques, sparring, focus, respect, and belt progress.",
    statFields:[{key:"classes",label:"Classes Attended",group:"Training"},{key:"forms",label:"Forms Practiced",group:"Technique"},{key:"techniques",label:"Techniques Practiced",group:"Technique"},{key:"sparringRounds",label:"Sparring Rounds",group:"Sparring"},{key:"focus",label:"Focus Rating",group:"Mindset"},{key:"discipline",label:"Discipline Rating",group:"Mindset"},{key:"beltProgress",label:"Belt Progress",group:"Growth"}],
    skills:["Stance","Balance","Discipline","Technique","Flexibility","Respect","Confidence"],
    practiceTypes:["Class","Forms","Technique","Sparring","Conditioning","Flexibility"],
    insights:["Martial arts progress is discipline plus technique.","Focus and respect are trackable growth areas.","Belt progress should be earned step by step."]
  },
  dance:{
    id:"dance",label:"Dance",short:"Dance",icon:"💃",accent:C.blush,hero:"Performance flow",tagline:"Routines, timing, flexibility, expression, confidence, and practice minutes.",
    statFields:[{key:"routineRuns",label:"Routine Runs",group:"Routine"},{key:"practiceMinutes",label:"Practice Minutes",group:"Training"},{key:"timing",label:"Timing Rating",group:"Technique"},{key:"flexibility",label:"Flexibility Rating",group:"Body"},{key:"expression",label:"Expression Rating",group:"Performance"},{key:"confidence",label:"Confidence",group:"Mindset"}],
    skills:["Timing","Flexibility","Expression","Memory","Strength","Confidence","Stage Presence"],
    practiceTypes:["Routine Practice","Technique","Flexibility","Conditioning","Performance Practice"],
    insights:["Dance growth is confidence, repetition, and expression.","Timing and memory improve with short daily practice.","Performance confidence deserves to be celebrated."]
  },
  custom:{
    id:"custom",label:"Custom Sport",short:"Custom",icon:"➕",accent:C.gold,hero:"Create later",tagline:"A parent can eventually create any activity with custom stats, skills, and goals.",
    statFields:[{key:"sessions",label:"Sessions",group:"Activity"},{key:"minutes",label:"Minutes",group:"Training"},{key:"effort",label:"Effort Rating",group:"Mindset"},{key:"confidence",label:"Confidence",group:"Mindset"}],
    skills:["Effort","Consistency","Confidence","Focus"],
    practiceTypes:["Practice","Training","Lesson","At Home"],
    insights:["A custom sport lets the family decide what progress means.","Stats should match the activity, not the other way around.","This keeps the platform flexible."]
  }
};
const DEFAULT_SPORT_ID="basketball";
const ACTIVE_SPORT_IDS=["basketball"];
const FUTURE_SPORT_IDS=["volleyball","softball","football","track","cheer","gymnastics","karate","dance","soccer","tennis","custom"];

const DEF_SUBJECTS={Math:3,Reading:4,Science:3,"Social Studies":3,Writing:3};
const DEF_PROFILE={name:"Scarlett",grade:"5th",teamName:"",emoji:"⭐",primaryGoal:"All-around player",birthDate:"2015-08-28",zodiac:"Virgo"};
const ROUTINE_ITEMS=[
  {id:"face",e:"🫧",label:"Wash face"},
  {id:"moisturizer",e:"💧",label:"Moisturizer"},
  {id:"teeth",e:"🪥",label:"Brush teeth"},
  {id:"hair",e:"🎀",label:"Hair care"},
  {id:"outfit",e:"👚",label:"Pick tomorrow's outfit"},
  {id:"backpack",e:"🎒",label:"Pack backpack"},
  {id:"water_b",e:"💦",label:"Water bottle ready"},
  {id:"read",e:"📖",label:"Read or calm down time"},
];
const PRACTICE_TYPES=SPORT_TEMPLATES.basketball.practiceTypes;
const STYLE_TYPES=["Game Day","Practice","School","Weekend"];
const HAIR_IDEAS=["Braids","Ponytail","Bun","Down","Half-up","Curly out"];
const SHOE_PRIORITY=["Dream 🌟","Next Up 🔜","Maybe 🤔","Have It ✅"];
const TRENDING_SNEAKERS=[
  {
    name:"Sabrina 3 SE What The???",
    tag:"Big Kids · colorful · hoop style",
    why:"Sabrina shoes are a strong mix of real basketball performance and girl-athlete style.",
    img:"https://images.stockx.com/images/Nike-Sabrina-3-SE-What-The-GS.jpg?fit=fill&bg=FFFFFF&w=520&h=360&q=70&dpr=1",
    search:"Nike Sabrina 3 SE What The Big Kids"
  },
  {
    name:"Kobe V Big Kids",
    tag:"popular hooper shoe",
    why:"Kobes are still one of the biggest basketball sneaker goals for young hoopers.",
    img:"https://images.stockx.com/images/Nike-Kobe-5-Protro-GS.jpg?fit=fill&bg=FFFFFF&w=520&h=360&q=70&dpr=1",
    search:"Nike Kobe V Big Kids basketball shoes"
  },
  {
    name:"A'One / A'Two by A'ja Wilson",
    tag:"WNBA signature · girl power",
    why:"A'ja Wilson's line is one of the most exciting newer signature lines in women's basketball.",
    img:"https://images.stockx.com/images/Nike-AOne-Blue-Ice-GS.jpg?fit=fill&bg=FFFFFF&w=520&h=360&q=70&dpr=1",
    search:"Nike A'ja Wilson A'One A'Two Big Kids"
  },
  {
    name:"Ja 3 SE Zero Gravity",
    tag:"flashy guard style",
    why:"A bold, sporty option for quick guards who like loud on-court style.",
    img:"https://images.stockx.com/images/Nike-Ja-3-SE-Zero-Gravity-GS.jpg?fit=fill&bg=FFFFFF&w=520&h=360&q=70&dpr=1",
    search:"Nike Ja 3 SE Zero Gravity Big Kids"
  }
];

const WISH_CATEGORIES=[
  {id:"auto",label:"Auto",icon:"✨",col:"pink"},
  {id:"sneakers",label:"Sneakers",icon:"👟",col:"gold"},
  {id:"clothing",label:"Clothes",icon:"👚",col:"pink"},
  {id:"beauty",label:"Beauty",icon:"💄",col:"purple"},
  {id:"toys",label:"Toys",icon:"🧸",col:"teal"},
  {id:"school",label:"School",icon:"🎒",col:"blue"},
  {id:"future",label:"Future",icon:"🚀",col:"green"},
  {id:"other",label:"Other",icon:"🌟",col:"gold"}
];
const WISH_STORES={
  sneakers:["nike","stockx","goat"],
  clothing:["nike","stockx","goat","target"],
  beauty:["sephora","ulta","target"],
  toys:["amazon","target","walmart"],
  school:["target","amazon","walmart"],
  future:["google","amazon","target"],
  other:["google","amazon","target"]
};
const REWARD_COLORS=[
  "Pink","Purple","White","Black","Gold","Blue","Red","Mint","Lavender","Cream","Silver","Rose","Sky Blue","Lilac","Peach","Aqua","Navy","Gray","Coral","Butter Yellow","Hot Pink","Mocha","Icy Blue","Pearl"
];

const REWARD_VIBES=[
  "game day","practice day","school fit","weekend vibe","clean girl","sporty glam","streetwear","cozy mode","preppy","basketball-core","trendy","classic","minimal","bold","fresh start","confidence era","routine queen","locker-room ready","travel day","picture day","study day","future goal","room refresh","birthday-list","tournament day","after-school","self-care","family day","sneakerhead","main character"
];

const REWARD_BASE_ITEMS=[
  // SNEAKERS — sporty, trendy, preteen-friendly search targets.
  {category:"sneakers",base:"Nike basketball sneaker",search:"Nike youth basketball sneakers",why:"A basketball reward that connects directly to practice and game goals.",img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=640&q=80"},
  {category:"sneakers",base:"White low-top sneaker",search:"white youth low top sneakers",why:"A clean everyday sneaker reward for school and weekends.",img:"https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=640&q=80"},
  {category:"sneakers",base:"High-top basketball shoe",search:"girls high top basketball shoes",why:"A hoop-style reward for finishing a training goal.",img:"https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=640&q=80"},
  {category:"sneakers",base:"Black street sneaker",search:"black youth streetwear sneakers",why:"A cool sneaker reward that works with sporty outfits.",img:"https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=640&q=80"},
  {category:"sneakers",base:"Color-pop running sneaker",search:"colorful girls running sneakers",why:"A bright sneaker reward for active days.",img:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=640&q=80"},
  {category:"sneakers",base:"Classic court sneaker",search:"classic youth court sneaker",why:"A simple sneaker reward she can style with almost anything.",img:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=640&q=80"},
  {category:"sneakers",base:"Retro sneaker",search:"retro youth sneakers",why:"A trendy shoe reward for completing a bigger goal.",img:"https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=640&q=80"},
  {category:"sneakers",base:"Pink sneaker",search:"pink youth sneakers",why:"A fun sneaker reward with a sporty-glam feel.",img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=640&q=80"},

  // BEAUTY / SELF-CARE — age-appropriate wording.
  {category:"beauty",base:"Gentle skincare set",search:"kids gentle skincare set",why:"A self-care reward for completing routine goals.",img:"https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=640&q=80"},
  {category:"beauty",base:"Lip balm set",search:"lip balm set kids",why:"A small trendy reward for follow-through.",img:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=640&q=80"},
  {category:"beauty",base:"Face wash and moisturizer",search:"gentle face wash moisturizer kids",why:"A routine reward that supports clean habits.",img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=640&q=80"},
  {category:"beauty",base:"Skincare headband",search:"skincare headband girls",why:"A fun face-care reward that makes routine feel special.",img:"https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=640&q=80"},
  {category:"beauty",base:"Hair accessories set",search:"girls hair accessories bows headbands",why:"A style reward for outfit prep and confidence.",img:"https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=640&q=80"},
  {category:"beauty",base:"Mini self-care pouch",search:"girls self care pouch",why:"A neat way to organize routine items.",img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=640&q=80"},
  {category:"beauty",base:"Glossy lip balm",search:"glossy lip balm kids",why:"A fun, simple beauty reward without making the app too grown-up.",img:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=640&q=80"},
  {category:"beauty",base:"Face-care mini kit",search:"preteen face care kit",why:"A reward tied directly to building a consistent glow routine.",img:"https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=640&q=80"},

  // TRENDY TEEN / PRETEEN CLOTHING — clean, parent-friendly, modern.
  {category:"clothing",base:"Oversized hoodie",search:"girls oversized hoodie trendy",why:"A cozy style reward after a completed goal.",img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=640&q=80"},
  {category:"clothing",base:"Graphic tee",search:"girls graphic tee streetwear",why:"A simple reward that lets her express her style.",img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=640&q=80"},
  {category:"clothing",base:"Cargo pants",search:"girls cargo pants streetwear",why:"A cool outfit reward for school or weekends.",img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=640&q=80"},
  {category:"clothing",base:"Matching lounge set",search:"girls matching lounge set trendy",why:"A stylish comfort reward for routine follow-through.",img:"https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=640&q=80"},
  {category:"clothing",base:"Basketball shorts",search:"girls basketball shorts trendy",why:"A practical reward for practice days.",img:"https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=640&q=80"},
  {category:"clothing",base:"Denim jacket",search:"girls denim jacket trendy",why:"A style reward that can make a school outfit feel complete.",img:"https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=640&q=80"},
  {category:"clothing",base:"Cropped athletic hoodie",search:"girls athletic hoodie trendy",why:"A sporty-glam clothing reward for confidence.",img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=640&q=80"},
  {category:"clothing",base:"Wide-leg sweatpants",search:"girls wide leg sweatpants trendy",why:"A modern comfort reward that still feels stylish.",img:"https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=640&q=80"},

  // TRENDY / VIRAL TOYS — kept broad so search links stay useful.
  {category:"toys",base:"Mini collectible toy",search:"viral mini collectible toy",why:"A fun reward after a goal is completed.",img:"https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=640&q=80"},
  {category:"toys",base:"Cute plush",search:"viral cute plush toy",why:"A comfort reward for steady progress.",img:"https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=640&q=80"},
  {category:"toys",base:"Craft kit",search:"viral craft kit for girls",why:"A creative reward for finishing school or habit goals.",img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=640&q=80"},
  {category:"toys",base:"Room decor light",search:"viral room decor light girls",why:"A fun room reward for a bigger goal.",img:"https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=640&q=80"},
  {category:"toys",base:"Sticker pack",search:"viral cute sticker pack",why:"A small creative reward for quick wins.",img:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&q=80"},
  {category:"toys",base:"Art marker set",search:"viral art marker set for kids",why:"A creative reward that keeps her off autopilot screens.",img:"https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=640&q=80"},
  {category:"toys",base:"Fidget toy set",search:"viral fidget toy set",why:"A fun small reward for completing daily quests.",img:"https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=640&q=80"},
  {category:"toys",base:"Charm bracelet kit",search:"viral charm bracelet kit girls",why:"A creative style reward she can build herself.",img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=640&q=80"}
];

let REWARD_CATALOG_CACHE=null;
const buildRewardCatalog=()=>{
  if(REWARD_CATALOG_CACHE)return REWARD_CATALOG_CACHE;
  const items=[];
  let n=0;
  // Important: variation loops are OUTSIDE the base item loop so each day pulls different items/categories,
  // instead of six versions of the same sneaker.
  for(const vibe of REWARD_VIBES){
    for(const color of REWARD_COLORS){
      for(const base of REWARD_BASE_ITEMS){
        const name=`${color} ${base.base} · ${vibe}`;
        const storeList=WISH_STORES[base.category]||WISH_STORES.other;
        items.push({
          id:`reward_${String(n).padStart(5,"0")}`,
          category:base.category,
          name,
          search:`${color} ${base.search} ${vibe}`.trim(),
          why:base.why,
          img:base.img,
          trendTag:vibe,
          colorLabel:color,
          baseName:base.base,
          storeList
        });
        n++;
      }
    }
  }
  REWARD_CATALOG_CACHE=items;
  return items;
};

const DAILY_REWARD_COUNT=6;
const REWARD_ROTATION_START="2026-01-01";
const REWARD_ROTATION_OFFSET=11; // Forces a visibly new reward idea set today while still rotating at local 12:00 AM.
const DAILY_REWARD_CATEGORY_ORDER=["sneakers","beauty","clothing","toys","sneakers","clothing"];

const getRewardRotationInfo=(count=DAILY_REWARD_COUNT)=>{
  const catalog=buildRewardCatalog();
  // Uses local calendar days, so reward ideas officially rotate at 12:00 AM on her device.
  const start=new Date(`${REWARD_ROTATION_START}T00:00:00`);
  const now=new Date(`${todayISO()}T00:00:00`);
  const rawDay=Math.max(0,Math.floor((now-start)/86400000))+REWARD_ROTATION_OFFSET;
  const byCategory=DAILY_REWARD_CATEGORY_ORDER.reduce((acc,c)=>({...acc,[c]:catalog.filter(x=>x.category===c)}),{});
  const minCatDays=Math.min(...DAILY_REWARD_CATEGORY_ORDER.map(c=>Math.max(1,byCategory[c].length)));
  return {catalog,byCategory,day:rawDay,daysAvailable:minCatDays,count};
};

const getDailyRewardIdeas=(count=DAILY_REWARD_COUNT)=>{
  const {byCategory,day}=getRewardRotationInfo(count);
  const picked=[];
  const usedNames=new Set();
  const usedImgs=new Set();

  for(let i=0;i<count;i++){
    const cat=DAILY_REWARD_CATEGORY_ORDER[(day+i)%DAILY_REWARD_CATEGORY_ORDER.length];
    const pool=byCategory[cat]||[];
    if(!pool.length)continue;

    let item=null;
    for(let tries=0;tries<pool.length;tries++){
      // Different stride per card so today's six are different and future days move through the catalog.
      const idx=(day*17+i*131+tries*19)%pool.length;
      const cand=pool[idx];
      const nameKey=(cand.baseName||cand.name||"").toLowerCase();
      const imgKey=cand.img||"";
      if(!usedNames.has(nameKey)&&!usedImgs.has(imgKey)){
        item=cand; break;
      }
    }
    if(!item)item=pool[(day*17+i*131)%pool.length];
    usedNames.add((item.baseName||item.name||"").toLowerCase());
    usedImgs.add(item.img||"");
    picked.push(item);
  }

  return picked;
};

const WISH_STARTERS=buildRewardCatalog();

const shopUrl=(shop,query)=>{
  const q=encodeURIComponent(query||"");
  if(shop==="nike")return `https://www.nike.com/w?q=${q}`;
  if(shop==="stockx")return `https://stockx.com/search?s=${q}`;
  if(shop==="goat")return `https://www.goat.com/search?query=${q}`;
  if(shop==="sephora")return `https://www.sephora.com/search?keyword=${q}`;
  if(shop==="ulta")return `https://www.ulta.com/search?search=${q}`;
  if(shop==="target")return `https://www.target.com/s?searchTerm=${q}`;
  if(shop==="amazon")return `https://www.amazon.com/s?k=${q}`;
  if(shop==="walmart")return `https://www.walmart.com/search?q=${q}`;
  return `https://www.google.com/search?q=${q}`;
};
const openShop=(shop,query)=>{try{window.open(shopUrl(shop,query),"_blank","noopener,noreferrer");}catch{}};
const rewardShopUrl=(shop,item)=>{
  if(!item)return shopUrl(shop,"");
  const key=`${shop}Url`;
  return item[key]||shopUrl(shop,item.search||item.name||"");
};
const openRewardShop=(shop,item)=>{try{window.open(rewardShopUrl(shop,item),"_blank","noopener,noreferrer");}catch{}};
const normalizeSneakerText=t=>(t||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const findTrendingSneaker=q=>{
  const s=normalizeSneakerText(q);
  if(!s)return null;
  return TRENDING_SNEAKERS.find(item=>{
    const name=normalizeSneakerText(item.name);
    const search=normalizeSneakerText(item.search);
    return name.includes(s)||s.includes(name.split(" ")[0])||search.includes(s)||s.split(" ").some(w=>w.length>=4&&(name.includes(w)||search.includes(w)));
  })||null;
};
const buildRewardFromName=(form)=>{
  const q=form.search||form.name;
  const match=findTrendingSneaker(q);
  return {
    id:uid(),
    ...form,
    search:q,
    img:form.img||match?.img||"",
    why:form.why||match?.why||"",
    nikeUrl:form.nikeUrl||match?.nikeUrl||shopUrl("nike",q),
    stockxUrl:form.stockxUrl||match?.stockxUrl||shopUrl("stockx",q),
    goatUrl:form.goatUrl||match?.goatUrl||shopUrl("goat",q),
    cost:form.priority.includes("Dream")?3:form.priority.includes("Next")?2:1
  };
};
const detectWishCategory=(name,chosen="auto")=>{
  if(chosen&&chosen!=="auto")return chosen;
  const s=normalizeSneakerText(name);
  if(/shoe|sneaker|jordan|kobe|sabrina|ja|lebron|kd|luka|nike|adidas|puma|new balance|ae 1|a one/.test(s))return "sneakers";
  if(/hoodie|shirt|tee|pants|cargo|leggings|shorts|jacket|sweats|outfit|dress|skirt|clothes|clothing|streetwear/.test(s))return "clothing";
  if(/makeup|lip|gloss|balm|skin|skincare|face|moisturizer|cleanser|mascara|blush|sephora|ulta|routine/.test(s))return "beauty";
  if(/toy|lego|squish|slime|doll|mini brands|plush|game|roblox|stanley|tumbler/.test(s))return "toys";
  if(/backpack|notebook|pen|pencil|binder|school|planner/.test(s))return "school";
  if(/camp|college|training|save|trip|future|lesson|class/.test(s))return "future";
  return "other";
};
const findWishlistStarter=q=>{
  const s=normalizeSneakerText(q);
  if(!s)return null;
  const all=[...TRENDING_SNEAKERS.map(x=>({...x,category:"sneakers"})),...WISH_STARTERS];
  return all.find(item=>{
    const name=normalizeSneakerText(item.name);
    const search=normalizeSneakerText(item.search||item.name);
    return name.includes(s)||s.includes(name)||search.includes(s)||s.split(" ").some(w=>w.length>=4&&(name.includes(w)||search.includes(w)));
  })||null;
};
const buildWishlistItem=(form)=>{
  const q=form.search||form.name;
  const match=findWishlistStarter(q);
  const category=detectWishCategory(q,form.category||"auto");
  const stores=WISH_STORES[category]||WISH_STORES.other;
  const item={id:uid(),...form,category,search:match?.search||q,img:form.img||match?.img||"",why:form.why||match?.why||"",cost:form.priority?.includes("Dream")?3:form.priority?.includes("Next")?2:1};
  stores.forEach(shop=>{item[`${shop}Url`]=form[`${shop}Url`]||match?.[`${shop}Url`]||shopUrl(shop,item.search||item.name);});
  item.storeList=stores;
  return item;
};
const wishCategoryMeta=id=>WISH_CATEGORIES.find(c=>c.id===id)||WISH_CATEGORIES[0];
const rewardStores=item=>Array.isArray(item?.storeList)&&item.storeList.length?item.storeList:(WISH_STORES[item?.category]||WISH_STORES.other||["google","amazon","target"]);
const nextGoalNumber=goals=>Math.max(0,...(goals||[]).map(g=>parseInt(g.goalNo||0)||0))+1;
const goalNumberFor=(goals,goal)=>goal?.goalNo||((safeObjects(goals).findIndex(g=>g.id===goal?.id)+1)||1);
const goalCodeFor=(goals,goal)=>`G-${String(goalNumberFor(goals,goal)).padStart(3,"0")}`;
const goalById=(goals,id)=>(goals||[]).find(g=>g.id===id);

const SneakerPhoto=({src,name,size=74})=>{
  const [bad,setBad]=useState(false);
  return <div style={{width:size,height:size,borderRadius:18,background:"linear-gradient(135deg,rgba(255,255,255,.92),rgba(255,255,255,.72))",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",boxShadow:"0 12px 24px rgba(0,0,0,.18)",flexShrink:0}}>{src&&!bad?<img src={src} alt={name||"Sneaker"} onError={()=>setBad(true)} style={{width:"100%",height:"100%",objectFit:"contain",padding:6,boxSizing:"border-box"}}/>:<span style={{fontSize:32}}>👟</span>}</div>;
};
const LEVEL_TITLES=["Rookie","Rising Star","Athlete","Contender","Competitor","Elite","All-Star","Champion","Legend","Icon"];
const GRADE_COL={4:C.green,3:C.teal,2:C.gold,1:C.orange};
const SKILL_LEVEL=v=>v>=75?"Elite":v>=55?"Strong":v>=35?"Building":"Beginner";
const SKILL_COL=v=>v>=75?C.green:v>=55?C.teal:v>=35?C.gold:C.coral;

const uid=()=>`${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
const pad2=n=>String(n).padStart(2,"0");
const dateToLocalISO=d=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const todayISO=()=>dateToLocalISO(new Date());
// Shared daily key for all "new day" content. Uses the device's local date at 12:00 AM.
const localDayKey=()=>Math.floor(new Date(`${todayISO()}T00:00:00`).getTime()/86400000);
const toShort=iso=>new Date(`${iso||todayISO()}T12:00:00`).toLocaleDateString("en-US",{month:"short",day:"numeric"});
const shiftISO=(iso,d)=>{const dt=new Date(`${iso}T12:00:00`);dt.setDate(dt.getDate()+d);return dateToLocalISO(dt);};
const clone=o=>JSON.parse(JSON.stringify(o));
const safeArray=v=>Array.isArray(v)?v:[];
const safeObjects=v=>safeArray(v).filter(x=>x&&typeof x==="object");
const normalizeWishItem=(item,i=0)=>({
  id:item.id||`wish_${i}_${Date.now()}`,
  name:String(item.name||item.title||"Wishlist item"),
  category:item.category||detectWishCategory(item.name||item.title||item.search||""),
  why:String(item.why||""),
  priority:item.priority||"Dream 🌟",
  search:item.search||item.name||item.title||"Wishlist item",
  img:item.img||"",
  goalId:item.goalId||"",
  storeList:Array.isArray(item.storeList)?item.storeList:undefined,
  ...item
});
const avgArr=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;
const normGrade=g=>String(g||3);
const gradeValue=g=>({4:4,3:3,2:2,1:1}[normGrade(g)]||0);
const gpaCalc=subs=>{const v=Object.values(subs).map(g=>gradeValue(g)||0);return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1):"—";};
const addDays=(n=7)=>{const d=new Date();d.setDate(d.getDate()+n);return dateToLocalISO(d);};
const daysAgo=d=>{try{return Math.round((Date.now()-new Date(d+"T12:00:00"))/86400000);}catch{return 999;}};
const glamGrad=`linear-gradient(135deg,${C.blush},${C.mauve},${C.gold})`;
const DAILY_HOROSCOPE=[
  {vibe:"Virgo focus queen",message:"Your superpower today is noticing the little details others miss. Pick one tiny promise and finish it all the way.",power:"Finish one thing fully",lucky:"Gold stars",theme:"Details become confidence",element:"Earth",energy:"Focused and steady",longVibe:"Virgo energy is strongest when the day has a clear plan. Scarlett does not need to do everything at once; she needs one clean promise, one next step, and one finished action. Today is about proving to herself that small follow-through builds real confidence.",tryThis:"Choose one goal and write the exact next step. Then finish only that step before starting something else.",affirmation:"I am focused, prepared, and proud of my follow-through.",journal:"What is one small thing I can finish today that will make me feel proud?",glowTip:"Clean up one small area before starting homework or practice."},
  {vibe:"Clean routine energy",message:"A Virgo glow-up starts with order. Clear one small mess, prep one thing early, and your whole day feels lighter.",power:"Prep before pressure",lucky:"Clean outfit",theme:"Organized glow",element:"Earth",energy:"Calm and prepared",longVibe:"Today’s Virgo vibe is about making life feel easier before it gets busy. A prepared backpack, outfit, water bottle, or practice bag can turn stress into calm. When Scarlett creates order around her, she gives herself more room to shine.",tryThis:"Pick one thing to prepare early: outfit, backpack, shoes, water bottle, or homework space.",affirmation:"I am organized, calm, and ready for what is next.",journal:"What can I prepare now that future me will be thankful for?",glowTip:"Lay out tomorrow’s outfit or practice gear before bedtime."},
  {vibe:"Court discipline",message:"Reps do not need to be perfect to count. Keep your form clean, your feet active, and your mind locked in.",power:"15 focused reps",lucky:"Basketball shoes",theme:"Practice with purpose",element:"Earth",energy:"Locked in",longVibe:"Virgo discipline is not about being perfect. It is about paying attention. On the court, that means clean form, active feet, and repeating the basics even when nobody is watching. The goal is not a flashy practice. The goal is a focused one.",tryThis:"Do 15 focused reps of one basketball skill and rate your effort honestly.",affirmation:"I am disciplined, coachable, and getting better every day.",journal:"What basketball skill needs my cleanest focus right now?",glowTip:"Pick one skill before practice so the work has a purpose."},
  {vibe:"School boss mode",message:"Your brain is sharp today. Start with the hardest school task first so the rest of the day feels easier.",power:"Hard thing first",lucky:"Purple pen",theme:"Smart strategy",element:"Earth",energy:"Sharp and capable",longVibe:"Virgo energy likes a smart plan. Today, Scarlett can make school feel less overwhelming by starting with the hardest task first. Once that is done, everything else feels lighter. This is how confidence grows in the classroom.",tryThis:"Start with the school task you least want to do and give it 20 focused minutes.",affirmation:"I am smart, capable, and brave enough to start.",journal:"What school task would feel amazing to get out of the way?",glowTip:"Use a timer and make the first 20 minutes distraction-free."},
  {vibe:"Main character calm",message:"You do not have to rush to prove anything. Move with confidence, stay kind, and let your follow-through speak.",power:"Calm confidence",lucky:"Soft glam",theme:"Quiet confidence",element:"Earth",energy:"Grounded and confident",longVibe:"Today’s Virgo magic is calm confidence. Scarlett does not have to be the loudest person in the room to be powerful. She can be kind, prepared, steady, and strong. The real main character energy is following through even when things are not perfect.",tryThis:"Before reacting to anything stressful, take one breath and choose the calmest next move.",affirmation:"I am calm, confident, and in control of my choices.",journal:"Where can I show confidence today without needing attention?",glowTip:"Choose one simple detail that makes you feel put together."},
  {vibe:"Trendsetter Virgo",message:"You do not have to copy every trend. Choose what fits your style, your confidence, and the person you are becoming.",power:"Be original",lucky:"Something shiny",theme:"Personal style",element:"Earth",energy:"Creative and selective",longVibe:"Virgo style is thoughtful. It is not about following every trend; it is about choosing what actually feels like you. Scarlett can love sneakers, beauty, outfits, and viral ideas while still building her own taste and confidence.",tryThis:"Add one wishlist item only if you can name the goal that would earn it.",affirmation:"I am original, stylish, and true to myself.",journal:"What style choice feels most like me right now?",glowTip:"Pick one accessory, hairstyle, or outfit detail that feels confident, not forced."},
  {vibe:"Goal getter",message:"Do not just wish for the reward. Build the path to it. One goal, one action, one checkmark at a time.",power:"Earned reward",lucky:"Wishlist win",theme:"Earned success",element:"Earth",energy:"Motivated and practical",longVibe:"Today’s Virgo vibe connects perfectly with the app: set the goal, do the action, earn the reward. Scarlett’s wishlist is not just about wanting things. It is a reminder that effort creates options and follow-through creates pride.",tryThis:"Pick one wishlist item and connect it to one clear goal with one clear action.",affirmation:"I earn good things by keeping promises to myself.",journal:"What reward would feel better if I truly earned it?",glowTip:"Make the goal smaller if it feels too big to start."},
  {vibe:"Kind but focused",message:"You can be sweet and still stay on task. Protect your time, your peace, and your goals.",power:"Stay on track",lucky:"Quiet win",theme:"Boundaries and focus",element:"Earth",energy:"Kind and steady",longVibe:"Virgo energy can be caring without getting pulled off track. Today is about being kind while still protecting focus. Scarlett can be a good friend, daughter, teammate, and student without forgetting her own goals.",tryThis:"Say yes to one helpful thing and no to one distraction.",affirmation:"I am kind, focused, and allowed to protect my goals.",journal:"What distraction do I need to say no to today?",glowTip:"Put your phone or tablet away during one focused block."},
  {vibe:"Reset and rise",message:"If yesterday was messy, today can still be clean. A Virgo reset starts with one honest next step.",power:"Fresh start",lucky:"New checklist",theme:"Fresh start",element:"Earth",energy:"Renewed and hopeful",longVibe:"A bad day does not ruin the whole week. Virgo energy knows how to reset. Scarlett can look at what did not work, choose one better step, and move forward without being hard on herself.",tryThis:"Write one thing that did not go well and one thing you can do differently today.",affirmation:"I can reset, rise, and try again.",journal:"What does a better next step look like today?",glowTip:"Make a tiny checklist with only three things."},
  {vibe:"Finish strong",message:"Today is a good day to prove to yourself that you can start, finish, and feel proud.",power:"Finish strong",lucky:"Victory star",theme:"Completion energy",element:"Earth",energy:"Determined and proud",longVibe:"Virgo energy loves completion. Not because everything has to be perfect, but because finishing creates trust with yourself. Today, Scarlett’s power move is to finish something she started and let that win count.",tryThis:"Choose one unfinished task and complete it before adding anything new.",affirmation:"I finish what I start and I am proud of my effort.",journal:"What would feel really good to finish today?",glowTip:"Celebrate the finish with one star, checkmark, or parent high-five."}
];
const HOROSCOPE_ROTATION_OFFSET=7; // Forces a clearly new Virgo Daily Vibe today while still rotating at local 12:00 AM.
function getDailyHoroscope(profile){
  const day=localDayKey()+HOROSCOPE_ROTATION_OFFSET;
  const h=DAILY_HOROSCOPE[day%DAILY_HOROSCOPE.length];
  const sign=profile?.zodiac||"Virgo";
  return {sign,...h};
}

// Real daily coaching quotes from WNBA players, paired with public player photos.
// The card intentionally has NO article/source button and NO navigation button.
// It is meant to be simple: player photo + real quote + tiny daily takeaway.
const WNBA_DAILY_COACH=[
  {
    player:"A'ja Wilson",
    initials:"AW",
    tag:"MVP mindset",
    team:"Las Vegas Aces",
    photo:"https://commons.wikimedia.org/wiki/Special:FilePath/A%27ja%20Wilson%20%2853756794398%29%20%28cropped%29.jpg",
    quote:"That's the beauty of losses, you learn from them.",
    takeaway:"Lesson: one hard moment can still help you grow.",
    headline:"Turn a hard moment into information.",
    longTip:"A'ja's mindset is powerful because she does not treat a bad game, a missed shot, or a loss like proof that she failed. She treats it like feedback. For Scarlett, that means every practice and every game can teach her something specific: what to repeat, what to adjust, and what to try again tomorrow.",
    tryThis:"After your next practice, write down one thing that worked, one thing that was hard, and one thing you will try again.",
    focus:"Growth mindset · leadership · confidence"
  },
  {
    player:"Breanna Stewart",
    initials:"BS",
    tag:"stay present",
    team:"New York Liberty",
    photo:"https://commons.wikimedia.org/wiki/Special:FilePath/Breanna%20Stewart%20WNBA%20Finals%202024%20%28cropped%29.jpg",
    quote:"I've been trying to make sure I stay in the moment.",
    takeaway:"Lesson: focus on the next right thing.",
    headline:"Win the next small moment.",
    longTip:"Breanna Stewart's advice is perfect for a goal app because big goals can feel huge until you break them into the next small action. Scarlett does not have to fix everything at once. She just needs to choose the next right rep, the next homework block, the next routine step, or the next brave question.",
    tryThis:"Pick one goal today and ask: what is the next 10-minute action I can actually finish?",
    focus:"Focus · patience · consistency"
  },
  {
    player:"Jewell Loyd",
    initials:"JL",
    tag:"prepared and ready",
    team:"Las Vegas Aces",
    photo:"https://commons.wikimedia.org/wiki/Special:FilePath/Jewell%20Loyd%202024%20%28cropped%29.jpg",
    quote:"I've prepared for all different kinds of coverages and I'm just trying to see where the space is and go to that.",
    takeaway:"Lesson: preparation helps you stay calm.",
    headline:"Preparation makes confidence easier.",
    longTip:"Jewell Loyd's message is about being ready before the moment gets loud. The more Scarlett prepares, the less she has to panic. Studying, practicing, packing her bag, sleeping well, and logging her goals are all quiet preparation that shows up later when it matters.",
    tryThis:"Choose one thing to prepare before tomorrow: shoes, backpack, water, homework, or 15 focused minutes of skill work.",
    focus:"Preparation · calm under pressure · awareness"
  },
  {
    player:"Caitlin Clark",
    initials:"CC",
    tag:"dream big",
    team:"Indiana Fever",
    photo:"https://commons.wikimedia.org/wiki/Special:FilePath/Caitlin%20Clark%20Fever%202%20%28cropped%29.jpg",
    quote:"Never stop dreaming, because you can achieve more than you ever thought.",
    takeaway:"Lesson: big goals are allowed.",
    headline:"Big dreams still need daily reps.",
    longTip:"Caitlin Clark's message fits Scarlett's app perfectly: it is good to want something big, but the dream becomes real through daily choices. A dream sneaker, a better grade, a stronger shot, or more confidence all start with one goal that gets finished.",
    tryThis:"Write one future goal, then add one small action you can do this week to move toward it.",
    focus:"Dreams · courage · daily work"
  },
  {
    player:"Kelsey Plum",
    initials:"KP",
    tag:"patient confidence",
    team:"Los Angeles Sparks",
    photo:"https://commons.wikimedia.org/wiki/Special:FilePath/Kelsey%20Plum%202023%20%28cropped%29.jpg",
    quote:"I was just trying to be patient and trust that it's going to come.",
    takeaway:"Lesson: trust your work and stay ready.",
    headline:"Trust the work before the result shows up.",
    longTip:"Kelsey Plum's message is about patience with a purpose. Results do not always show up the same day you practice, study, or make a good choice. But the work still counts. Scarlett's job is to keep showing up, track the effort, and trust that steady work builds confidence.",
    tryThis:"Pick one skill and give it 15 focused minutes today, even if nobody is watching.",
    focus:"Patience · work ethic · confidence"
  }
];
const WNBA_COACH_ROTATION_OFFSET=1; // Moves today's coach forward while still rotating at local 12:00 AM.
function getDailyWnbaCoach(){
  const day=localDayKey()+WNBA_COACH_ROTATION_OFFSET;
  return WNBA_DAILY_COACH[day%WNBA_DAILY_COACH.length];
}

// ── STORAGE ──────────────────────────────────────────────────────────────
// Refresh-safe: the app writes to localStorage and keeps a duplicate snapshot.
// Clear-history-safe: browser history/site-data clearing can erase localStorage, so the app also supports:
// 1) Family Code cloud sync when window.storage is available, and
// 2) manual JSON backup / restore from Setup.
const SC_STORAGE_KEYS=["sc_daily","sc_bball","sc_practices","sc_style","sc_routine","sc_sleep","sc_school","sc_goals","sc_rewards","sc_profile","sc_habits","sc_last_tab","sc_selected_sport"];
let _FC=null;
function getFamilyCode(){try{return _FC||localStorage.getItem("sc_fc")||null;}catch{return null;}}
function setFCGlobal(c){_FC=c;try{if(c)localStorage.setItem("sc_fc",c);else localStorage.removeItem("sc_fc");}catch{}}
function fKey(k){const fc=getFamilyCode();return fc?`glow_${fc}_${k}`:null;}
function safeJSONParse(raw){try{return raw?JSON.parse(raw):null;}catch{return null;}}
function makeLocalSnapshot(extra={}){
  try{
    const data={};
    SC_STORAGE_KEYS.forEach(k=>{const raw=localStorage.getItem(k);if(raw!=null)data[k]=safeJSONParse(raw);});
    const pack={app:"ScarlettTracker",version:3,savedAt:new Date().toISOString(),familyCode:getFamilyCode()||"",data,...extra};
    localStorage.setItem("sc_full_backup_latest",JSON.stringify(pack));
    localStorage.setItem("sc_full_backup_mirror",JSON.stringify(pack));
    return pack;
  }catch{return null;}
}
async function sg(k){
  try{
    const sk=fKey(k);
    if(sk&&window.storage){
      try{const r=await window.storage.get(sk,true);if(r?.value)return JSON.parse(r.value);}catch{}
    }
    const raw=localStorage.getItem(k);
    if(raw!=null)return JSON.parse(raw);
    const mirror=safeJSONParse(localStorage.getItem("sc_full_backup_latest"))||safeJSONParse(localStorage.getItem("sc_full_backup_mirror"));
    if(mirror?.data?.[k]!==undefined)return mirror.data[k];
    return null;
  }catch{return null;}
}
async function ss(k,v){
  try{
    const p=JSON.stringify(v);
    const sk=fKey(k);
    if(sk&&window.storage){try{await window.storage.set(sk,p,true);}catch{}}
    try{localStorage.setItem(k,p);}catch{}
    try{makeLocalSnapshot({lastSavedKey:k});}catch{}
    return true;
  }catch{return false;}
}
const genCode=()=>{const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";return Array.from({length:6},()=>c[Math.floor(Math.random()*c.length)]).join("");};

// ── UI ATOMS ──────────────────────────────────────────────────────────────
const cs={
  background:"linear-gradient(145deg,rgba(24,28,29,.94),rgba(12,15,16,.98))",
  borderRadius:22,
  border:"1px solid rgba(255,255,255,.12)",
  padding:16,
  marginBottom:14,
  boxShadow:"0 22px 54px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.06)",
  position:"relative",
  overflow:"hidden"
};
const INP={
  width:"100%",
  background:"rgba(255,255,255,.045)",
  border:"1px solid rgba(255,255,255,.13)",
  borderRadius:16,
  padding:"12px 14px",
  color:C.text,
  fontSize:16,
  outline:"none",
  fontFamily:"system-ui",
  boxSizing:"border-box"
};
const TXT={...INP,minHeight:70,resize:"vertical"};
const glass={
  background:"linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.025))",
  border:"1px solid rgba(255,255,255,.12)",
  boxShadow:"inset 0 1px 0 rgba(255,255,255,.06)"
};

function GlamHero({children,style={}}){
  return <div style={{
    ...cs,
    padding:18,
    background:"radial-gradient(circle at 85% 4%,rgba(216,168,94,.14),transparent 32%),radial-gradient(circle at 14% 0%,rgba(255,140,198,.14),transparent 34%),linear-gradient(145deg,rgba(20,25,26,.97),rgba(9,12,13,.99))",
    border:"1px solid rgba(255,255,255,.14)",
    boxShadow:"0 22px 54px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.08)",
    ...style
  }}>
    <div style={{position:"absolute",top:12,right:18,color:C.gold,fontSize:13,opacity:.72}}>✦</div>
    <div style={{position:"absolute",bottom:14,left:18,color:C.teal,fontSize:10,opacity:.64}}>✦</div>
    <div style={{position:"relative",zIndex:1}}>{children}</div>
  </div>;
}

function CH({e,title,sub}){return<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{fontSize:18,filter:"drop-shadow(0 0 10px rgba(255,140,198,.26))"}}>{e}</div><div><div style={{fontWeight:950,fontSize:10,letterSpacing:"2.4px",color:C.teal,textTransform:"uppercase",marginBottom:2}}>{title}</div>{sub&&<div style={{fontSize:11,color:C.muted,lineHeight:1.35}}>{sub}</div>}</div></div>;}
function SBox({value,label,color=C.teal,sub}){return<div style={{...glass,borderRadius:18,padding:12,textAlign:"center",borderTop:`2px solid ${color}`,background:"linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.025))"}}><div style={{fontWeight:950,fontSize:22,color,lineHeight:1,textShadow:`0 0 18px ${color}55`}}>{value}</div><div style={{fontSize:10,fontWeight:800,color:"rgba(247,244,236,.72)",marginTop:5}}>{label}</div>{sub&&<div style={{fontSize:9,color:C.muted,marginTop:4}}>{sub}</div>}</div>;}
function SkBar({skill,val}){const col=SKILL_COL(val),level=SKILL_LEVEL(val);return<div style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:800,color:C.text}}>{skill}</span><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{background:`${col}22`,color:col,fontSize:9,fontWeight:900,padding:"2px 8px",borderRadius:6}}>{level}</span><span style={{fontSize:14,fontWeight:950,color:col}}>{val}%</span></div></div><div style={{height:9,background:"rgba(255,255,255,.08)",borderRadius:100,overflow:"hidden"}}><div style={{height:"100%",background:`linear-gradient(90deg,${col}cc,${C.blush})`,borderRadius:100,width:`${val}%`,transition:"width .4s ease"}}/></div></div>;}
function RD({val,max=5,col=C.blush,onSet}){return<div style={{display:"flex",gap:7}}>{Array.from({length:max},(_,i)=><div key={i} onClick={()=>onSet(i+1===val?0:i+1)} style={{width:34,height:34,borderRadius:10,background:i<val?`linear-gradient(145deg,${col},${C.blush})`:"rgba(255,255,255,.045)",border:`1.5px solid ${i<val?col:"rgba(255,255,255,.12)"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:i<val?`0 0 16px ${col}35`:"none",transition:"all .15s"}}><span style={{fontSize:10,fontWeight:900,color:i<val?C.white:"rgba(255,255,255,.32)"}}>{i+1}</span></div>)}</div>;}
function EmojiPick({val,emojis,onSet,col=C.blush}){return<div style={{display:"grid",gridTemplateColumns:`repeat(${emojis.length},minmax(0,1fr))`,gap:7,width:"100%"}}>{emojis.map((e,i)=><button key={i} onClick={()=>onSet(i+1===val?0:i+1)} style={{height:48,minWidth:0,borderRadius:15,fontSize:22,border:`2px solid ${val===i+1?col:C.border}`,background:val===i+1?`${col}22`:"rgba(255,255,255,.045)",cursor:"pointer",boxShadow:val===i+1?`0 0 16px ${col}35`:"none",transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>{e}</button>)}</div>;}
function Chip({label,active,col=C.teal,onClick}){return<button onClick={onClick} style={{flexShrink:0,padding:"9px 14px",borderRadius:999,border:`1px solid ${active?col:C.border}`,background:active?`${col}22`:"rgba(255,255,255,.045)",color:active?C.cream:C.muted,fontWeight:900,cursor:"pointer",fontSize:12,whiteSpace:"nowrap",fontFamily:"system-ui"}}>{label}</button>;}
function RingChart({val,col,label,size=54}){const r=size/2-6,circ=2*Math.PI*r,d=circ-(val/100)*circ,cx=size/2,cy=size/2;return<svg width={size} height={size} style={{filter:`drop-shadow(0 0 10px ${col}55)`}}><circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.12)" strokeWidth={6}/><circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={d} transform={`rotate(-90 ${cx} ${cy})`} style={{transition:"all .5s ease"}}/><text x={cx} y={cy+4} textAnchor="middle" fill="white" fontSize={label.length>3?9:13} fontWeight={900} fontFamily="system-ui">{label}</text></svg>;}

function TabHero({eyebrow,title,sub,icon="✦",stats=[]}){
  return <div style={{...cs,background:"radial-gradient(circle at 88% 8%,rgba(255,140,198,.16),transparent 34%),linear-gradient(145deg,rgba(20,25,26,.97),rgba(9,12,13,.99))",color:C.text,border:"1px solid rgba(255,255,255,.16)",padding:22,boxShadow:"0 24px 64px rgba(0,0,0,.52),inset 0 1px 0 rgba(255,255,255,.08)",marginBottom:14}}>
    <div style={{position:"absolute",right:16,top:12,fontSize:88,opacity:.20,color:C.teal,lineHeight:1,filter:"drop-shadow(0 0 18px rgba(53,207,201,.25))"}}>{icon}</div>
    <div style={{position:"relative",zIndex:1}}>
      <div style={{fontSize:11,letterSpacing:"3px",fontWeight:950,color:C.teal,textTransform:"uppercase",marginBottom:10}}>{eyebrow}</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:32,lineHeight:1.04,fontWeight:850,letterSpacing:"-.7px",maxWidth:310,color:C.cream}}>{title}</div>
      {sub&&<div style={{fontSize:13,lineHeight:1.55,color:"rgba(247,244,236,.70)",marginTop:8,maxWidth:335}}>{sub}</div>}
      {stats.length>0&&<div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(stats.length,3)},1fr)`,gap:8,marginTop:16}}>
        {stats.slice(0,3).map((s,i)=><button key={`${s.label}_${i}`} onClick={s.onClick} style={{border:"1px solid rgba(255,255,255,.10)",background:"rgba(255,255,255,.045)",borderRadius:18,padding:"11px 8px",color:C.text,cursor:s.onClick?"pointer":"default",fontFamily:"system-ui",textAlign:"center",boxShadow:"inset 0 1px 0 rgba(255,255,255,.06)"}}>
          <div style={{fontSize:18,fontWeight:950,color:s.color||C.teal,lineHeight:1,textShadow:`0 0 16px ${(s.color||C.teal)}55`}}>{s.value}</div>
          <div style={{fontSize:9,fontWeight:900,color:"rgba(247,244,236,.58)",letterSpacing:"1px",marginTop:6,textTransform:"uppercase"}}>{s.label}</div>
        </button>)}
      </div>}
    </div>
  </div>;
}

// ── FIX: StableRenderer so tabs with their own useState hooks work correctly ──
function StableRenderer({render}){return render();}
class TabErrorBoundary extends React.Component{
  constructor(props){super(props);this.state={hasError:false,msg:""};}
  static getDerivedStateFromError(error){return{hasError:true,msg:error?.message||"Tab failed to load"};}
  componentDidCatch(error){console.error("Tab error:",error);}
  render(){if(this.state.hasError)return <div style={{padding:18,borderRadius:18,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.14)",color:"#F7F2FB"}}><div style={{fontSize:22,marginBottom:8}}>🛠️</div><div style={{fontWeight:900,marginBottom:6}}>This tab hit old saved data.</div><div style={{fontSize:12,opacity:.75,lineHeight:1.5}}>Error: {this.state.msg}</div></div>;return this.props.children;}
}

// ── COACH ENGINE ──────────────────────────────────────────────────────────
function goalStyle(pg){const g=(pg||"").toLowerCase();const V={scorer:["score","points","shoot","scoring","scorer","offense","bucket"],playmaker:["assist","pass","playmaker","point guard","pg","vision","leadership"],defender:["defend","defense","defensive","steal","block","lockdown","stopper"],all_around:["all around","all-around","complete","well-rounded","everything","overall"]};const s={scorer:0,playmaker:0,defender:0,all_around:0};for(const[st,kws]of Object.entries(V))for(const kw of kws)if(g.includes(kw))s[st]+=kw.split(" ").length;const r=Object.entries(s).sort((a,b)=>b[1]-a[1]);return r[0][1]>0?r[0][0]:"all_around";}
const STYLE_P={scorer:{col:C.coral,label:"Scorer"},playmaker:{col:C.purple,label:"Playmaker"},defender:{col:C.teal,label:"Defender"},all_around:{col:C.gold,label:"All-Around"}};
function computeReadiness(vitals,sleepEntries){let score=70;const reasons=[];let used=0;const rs=sleepEntries.slice(0,3);if(rs.length>=1){used+=1;const avgH=avgArr(rs.map(e=>e.hours)),avgQ=avgArr(rs.map(e=>e.quality||5));if(avgH>=9.5){score+=12;reasons.push({txt:`${avgH.toFixed(1)}h sleep — amazing recovery!`,col:C.green,icon:"🌙"});}else if(avgH>=8){score+=6;reasons.push({txt:`${avgH.toFixed(1)}h — nice job. Keep aiming for 9–10h.`,col:C.teal,icon:"🌙"});}else if(avgH<7){score-=15;reasons.push({txt:`Only ${avgH.toFixed(1)}h — your body needs extra rest tonight.`,col:C.red,icon:"🌙"});}if(avgQ<=4){score-=8;reasons.push({txt:"Sleep felt rough — a calm bedtime routine can help.",col:C.orange,icon:"😴"});}}if(vitals.energy>0){used+=0.75;if(vitals.energy>=4){score+=12;reasons.push({txt:"High energy — this could be a big day!",col:C.green,icon:"⚡"});}else if(vitals.energy>=3)score+=4;else if(vitals.energy<=2){score-=12;reasons.push({txt:"Low energy — keep today lighter and focus on form.",col:C.orange,icon:"⚡"});}}if(vitals.mood>0){used+=0.25;if(vitals.mood>=4)score+=5;else if(vitals.mood<=2){score-=6;reasons.push({txt:"A tough mood is okay — a few good reps can still be a win.",col:C.purple,icon:"💜"});}}score=Math.max(0,Math.min(100,score));const conf=Math.min(1,used/2);if(conf<0.3)return{score:null,displayValue:"✨",confidence:conf,starter:true,level:{label:"START HERE",col:C.gold},reasons:[{txt:"Do your check-in so Coach can see your energy today!",col:C.gold,icon:"✨"}]};const level=score>=80?{label:"LOCKED IN",col:C.green}:score>=65?{label:"READY",col:C.teal}:score>=50?{label:"EASY MODE",col:C.gold}:{label:"RECHARGE",col:C.orange};return{score,displayValue:String(score),level,reasons,confidence:conf,starter:false};}
function generateInsights(profile,games,practices,skills,subjects,sleepEntries,vitals,goals){const ins=[];if(games.length>=2){const ptD=(games[0].pts||0)-(games[1].pts||0);if(ptD>=5)ins.push({icon:"📈",text:`Scored ${ptD} more pts than last game — scoring is trending up!`,col:C.green});else if(ptD<=-5)ins.push({icon:"📉",text:`Scored ${Math.abs(ptD)} fewer pts — focus on shot selection at practice.`,col:C.orange});}if(games.length>=3){const wins=games.filter(g=>g.result==="Win").length,wr=Math.round(wins/games.length*100),l3w=games.slice(0,3).filter(g=>g.result==="Win").length;if(l3w===3)ins.push({icon:"🏆",text:"3-game win streak! Ride this momentum.",col:C.gold});if(wr>=70)ins.push({icon:"🔥",text:`${wr}% win rate over ${games.length} games — elite!`,col:C.gold});else if(wr<35)ins.push({icon:"💪",text:`Win rate at ${wr}% — personal stats improve first, then wins follow.`,col:C.orange});}const se=Object.entries(skills).sort((a,b)=>a[1]-b[1]);if(se.length){const[ws,wv]=se[0],[ss2,sv]=se[se.length-1];if(wv<40)ins.push({icon:"🎯",text:`${ws} (${wv}%) is the biggest growth area — 15 min daily moves it fast.`,col:C.coral});if(sv>=70)ins.push({icon:"⭐",text:`${ss2} is the strongest skill at ${sv}% — use it with confidence.`,col:C.gold});}const ge=Object.entries(subjects).sort((a,b)=>(gradeValue(a[1])||0)-(gradeValue(b[1])||0));if(ge.length){const[ws2,wg]=ge[0],[bs,bg]=ge[ge.length-1];if((gradeValue(wg)||0)<3)ins.push({icon:"📚",text:`${ws2} is at ${wg} — 15 min of nightly review will move this grade.`,col:C.teal});if((gradeValue(bg)||0)>=4)ins.push({icon:"🌟",text:`${bg} in ${bs} — that discipline carries straight to the court.`,col:C.green});}if(sleepEntries.length>=3){const avgH=avgArr(sleepEntries.slice(0,5).map(e=>e.hours));if(avgH<8)ins.push({icon:"🌙",text:`Averaging ${avgH.toFixed(1)}h sleep — athletes need 9–10h for growth and peak energy.`,col:C.red});else if(avgH>=9.5)ins.push({icon:"🌙",text:`${avgH.toFixed(1)}h avg sleep — elite recovery!`,col:C.green});}const active=goals.filter(g=>!g.done);if(active.length>0)ins.push({icon:"🎯",text:`Active goal: "${active[0].text.slice(0,45)}${active[0].text.length>45?"...":""}"`,col:C.purple});return ins;}

const BADGE_DEFS=[
  {id:"game_tracker",icon:"🏀",name:"Game Tracker",desc:"Log 3 games",check:d=>d.games.length>=3},
  {id:"practice_beast",icon:"💪",name:"Practice Beast",desc:"Log 5 practices",check:d=>d.practices.length>=5},
  {id:"scorer",icon:"🔥",name:"Scorer",desc:"Score 10+ pts",check:d=>d.games.some(g=>(g.pts||0)>=10)},
  {id:"win_streak",icon:"🏆",name:"Win Streak",desc:"3 wins in a row",check:d=>d.games.length>=3&&d.games.slice(0,3).every(g=>g.result==="Win")},
  {id:"scholar",icon:"📚",name:"Scholar",desc:"GPA 3.5 or higher",check:d=>parseFloat(gpaCalc(d.subjects))>=3.5},
  {id:"goal_crusher",icon:"🎯",name:"Goal Crusher",desc:"Complete 3 goals",check:d=>d.goals.filter(g=>g.done).length>=3},
  {id:"consistent",icon:"⭐",name:"Consistent",desc:"Log habits 7+ days",check:d=>Object.keys(d.dailyHist).length>=7},
  {id:"well_rested",icon:"🌙",name:"Well Rested",desc:"Log 7 nights of sleep",check:d=>d.sleepEntries.length>=7},
  {id:"level_up",icon:"⬆️",name:"Level Up!",desc:"Bring any skill to 70%+",check:d=>Object.values(d.skills).some(v=>v>=70)},
  {id:"iron_will",icon:"🔩",name:"Iron Will",desc:"Log 10 practices",check:d=>d.practices.length>=10},
  {id:"sneaker_star",icon:"👟",name:"Sneaker Star",desc:"Add 3 shoes to wishlist",check:d=>(d.shoeWish||[]).length>=3},
  {id:"style_confidence",icon:"💅",name:"Confidence Era",desc:"Log 5 fits",check:d=>(d.styleLog||[]).length>=5},
  {id:"future_planner",icon:"🚀",name:"Future Planner",desc:"Set a future goal",check:d=>d.goals.some(g=>g.category==="future")},
  {id:"star_100",icon:"💎",name:"Diamond",desc:"Earn 100 stars",check:d=>d.stars>=100},
];

export default function ScarlettTracker(){
  const[loaded,setLoaded]=useState(false);
  const[tab,setTab]=useState(()=>{try{return localStorage.getItem("sc_last_tab")||"today";}catch{return "today";}});
  const[selectedSportId,setSelectedSportId]=useState(()=>{try{return localStorage.getItem("sc_selected_sport")||DEFAULT_SPORT_ID;}catch{return DEFAULT_SPORT_ID;}});
  const[familyCode,setFamilyCode]=useState(()=>{try{return localStorage.getItem("sc_fc")||"";}catch{return "";}});
  const[codeInput,setCodeInput]=useState("");
  const[showSettings,setShowSettings]=useState(false);
  const[backupMsg,setBackupMsg]=useState("");
  const[editing,setEditing]=useState(false);

  const[profile,setProfile]=useState(clone(DEF_PROFILE));
  const[stars,setStars]=useState(0);
  const[dailyHist,setDailyHist]=useState({});
  const[checks,setChecks]=useState({});
  const[starAwards,setStarAwards]=useState({});
  const[water,setWater]=useState(0);
  const[vitals,setVitals]=useState(clone(DEF_VITALS));
  const[games,setGames]=useState([]);
  const[practices,setPractices]=useState([]);
  const[skills,setSkills]=useState(clone(DEF_SKILLS));
  const[subjects,setSubjects]=useState(clone(DEF_SUBJECTS));
  const[sleepEntries,setSleepEntries]=useState([]);
  const[routineHist,setRoutineHist]=useState({});
  const[routineItems,setRoutineItems]=useState(clone(ROUTINE_ITEMS));
  const[styleLog,setStyleLog]=useState([]);
  const[shoeWish,setShoeWish]=useState([]);
  const[goals,setGoals]=useState([]);
  const[rewardClaims,setRewardClaims]=useState([]);
  const[habits,setHabits]=useState(clone(DEF_HABITS));

  const saveTmr=useRef(null),savedTm=useRef(null),editBlurT=useRef(null),supRef=useRef(false),backupFileRef=useRef(null);

  const xpPerLevel=50;
  const xp=stars*5;
  const level=Math.max(1,Math.floor(xp/xpPerLevel)+1);
  const xpInLevel=xp%xpPerLevel;
  const levelTitle=LEVEL_TITLES[Math.min(level-1,LEVEL_TITLES.length-1)]||"Icon";
  const hasHabitOn=iso=>{const e=dailyHist[iso];if(!e)return false;return Object.values(e.c||{}).some(Boolean)||(e.w||0)>0;};
  const habitStreak=(()=>{let n=0;for(let i=0;i<30;i++){const d=shiftISO(todayISO(),-i);if(hasHabitOn(d))n++;else break;}return n;})();

  useEffect(()=>{(async()=>{
    const daily=await sg("sc_daily")||{entries:{}};
    const bball=await sg("sc_bball")||{games:[],skills:clone(DEF_SKILLS)};
    const prax=await sg("sc_practices")||{entries:[]};
    const styleD=await sg("sc_style")||{fits:[],shoes:[]};
    const routineD=await sg("sc_routine")||{entries:{}};
    const slp=await sg("sc_sleep")||{entries:[]};
    const school=await sg("sc_school")||{subjects:clone(DEF_SUBJECTS)};
    const gd=await sg("sc_goals")||{entries:[],stars:0};
    const rd=await sg("sc_rewards")||{claims:[]};
    const pd=await sg("sc_profile")||clone(DEF_PROFILE);
    const hd=await sg("sc_habits")||{entries:clone(DEF_HABITS)};
    setDailyHist(daily.entries||{});setGames(bball.games||[]);setSkills(bball.skills||clone(DEF_SKILLS));
    setPractices(safeArray(prax.entries));setStyleLog(safeArray(styleD.fits));setShoeWish(safeArray(styleD.shoes));
    setRoutineHist(routineD.entries||{});setRoutineItems(routineD.items||clone(ROUTINE_ITEMS));setSleepEntries(safeArray(slp.entries));
    setSubjects(school.subjects||clone(DEF_SUBJECTS));
    const dailyEntries=daily.entries||{};
    const goalEntries=safeArray(gd.entries);
    const realActivity=safeArray(bball.games).length>0||safeArray(prax.entries).length>0||safeArray(styleD.fits).length>0||safeArray(styleD.shoes).length>0||(routineD.entries&&Object.values(routineD.entries).some(x=>Object.values(x?.c||{}).some(Boolean)))||(slp.entries||[]).length>0||goalEntries.length>0||Object.values(dailyEntries).some(x=>Object.values(x?.c||{}).some(Boolean)||(x?.w||0)>0||Object.keys(x?.r||{}).length>0);
    const startStars=realActivity?(Number(gd.stars)||0):0;
    setGoals(safeArray(goalEntries));setStars(startStars);setRewardClaims(safeArray(rd.claims));setProfile({...clone(DEF_PROFILE),...pd});setHabits(hd.entries||[]);
    if(!realActivity&&(Number(gd.stars)||0)>0)await ss("sc_goals",{entries:goalEntries,stars:0});
    const e=dailyEntries?.[todayISO()]||{};
    setChecks(e.c||{});setStarAwards(e.r||{});setWater(e.w||0);setVitals(e.vitals||clone(DEF_VITALS));
    supRef.current=true;setLoaded(true);
  })();},[]);

  useEffect(()=>{if(!loaded)return;if(supRef.current){supRef.current=false;return;}clearTimeout(saveTmr.current);saveTmr.current=setTimeout(()=>{const entry={c:checks,r:starAwards,w:water,vitals};setDailyHist(prev=>{const next={...prev,[todayISO()]:entry};ss("sc_daily",{entries:next});return next;});},450);},[checks,starAwards,water,vitals,loaded]);
  useEffect(()=>{if(loaded)ss("sc_profile",profile);},[profile,loaded]);
  useEffect(()=>{try{localStorage.setItem("sc_last_tab",tab);}catch{}},[tab]);
  useEffect(()=>{try{localStorage.setItem("sc_selected_sport",selectedSportId);}catch{}},[selectedSportId]);

  useEffect(()=>{
    if(!loaded)return;
    const flush=()=>{try{
      const payload=buildBackupPayload();
      const d=payload.data;
      localStorage.setItem("sc_daily",JSON.stringify(d.sc_daily));
      localStorage.setItem("sc_bball",JSON.stringify(d.sc_bball));
      localStorage.setItem("sc_practices",JSON.stringify(d.sc_practices));
      localStorage.setItem("sc_style",JSON.stringify(d.sc_style));
      localStorage.setItem("sc_routine",JSON.stringify(d.sc_routine));
      localStorage.setItem("sc_sleep",JSON.stringify(d.sc_sleep));
      localStorage.setItem("sc_school",JSON.stringify(d.sc_school));
      localStorage.setItem("sc_goals",JSON.stringify(d.sc_goals));
      localStorage.setItem("sc_rewards",JSON.stringify(d.sc_rewards));
      localStorage.setItem("sc_profile",JSON.stringify(d.sc_profile));
      localStorage.setItem("sc_habits",JSON.stringify(d.sc_habits));
      localStorage.setItem("sc_full_backup_latest",JSON.stringify(payload));
      localStorage.setItem("sc_full_backup_mirror",JSON.stringify(payload));
    }catch{}};
    const vis=()=>{if(document.visibilityState==="hidden")flush();};
    window.addEventListener("pagehide",flush);
    window.addEventListener("beforeunload",flush);
    document.addEventListener("visibilitychange",vis);
    return()=>{window.removeEventListener("pagehide",flush);window.removeEventListener("beforeunload",flush);document.removeEventListener("visibilitychange",vis);};
  },[loaded,profile,stars,dailyHist,checks,starAwards,water,vitals,games,practices,skills,subjects,sleepEntries,routineHist,routineItems,styleLog,shoeWish,goals,rewardClaims,habits,tab,selectedSportId]);


  const addStars=async n=>{const ns=stars+n;setStars(ns);await ss("sc_goals",{entries:goals,stars:ns});};
  const saveBball=async(g,sk)=>{setGames(g);setSkills(sk);await ss("sc_bball",{games:g,skills:sk});};
  const savePrax=async p=>{setPractices(p);await ss("sc_practices",{entries:p});};
  const saveGoals=async(g,s=stars)=>{setGoals(g);setStars(s);await ss("sc_goals",{entries:g,stars:s});};
  const saveRewards=async claims=>{setRewardClaims(claims);await ss("sc_rewards",{claims});};
  const saveHabits=async entries=>{setHabits(entries);await ss("sc_habits",{entries});};
  const saveStyle=async(fits=styleLog,shoes=shoeWish)=>{const cleanFits=safeArray(fits),cleanShoes=safeArray(shoes);setStyleLog(cleanFits);setShoeWish(cleanShoes);await ss("sc_style",{fits:cleanFits,shoes:cleanShoes});};
  const saveRoutine=async(entries=routineHist,items=routineItems)=>{setRoutineHist(entries);setRoutineItems(items);await ss("sc_routine",{entries,items});};
  const saveSleep=async e=>{setSleepEntries(e);await ss("sc_sleep",{entries:e});};
  const saveSchool=async sub=>{setSubjects(sub);await ss("sc_school",{subjects:sub});};

  const buildBackupPayload=()=>({
    app:"ScarlettTracker",
    version:3,
    savedAt:new Date().toISOString(),
    familyCode:familyCode||getFamilyCode()||"",
    data:{
      sc_daily:{entries:dailyHist},
      sc_bball:{games,skills},
      sc_practices:{entries:practices},
      sc_style:{fits:styleLog,shoes:shoeWish},
      sc_routine:{entries:routineHist,items:routineItems},
      sc_sleep:{entries:sleepEntries},
      sc_school:{subjects},
      sc_goals:{entries:goals,stars},
      sc_rewards:{claims:rewardClaims},
      sc_profile:profile,
      sc_habits:{entries:habits},
      sc_last_tab:tab,
      sc_selected_sport:selectedSportId
    }
  });
  const saveEverythingNow=async()=>{
    const payload=buildBackupPayload();
    const d=payload.data;
    await Promise.all([
      ss("sc_daily",d.sc_daily),ss("sc_bball",d.sc_bball),ss("sc_practices",d.sc_practices),ss("sc_style",d.sc_style),
      ss("sc_routine",d.sc_routine),ss("sc_sleep",d.sc_sleep),ss("sc_school",d.sc_school),ss("sc_goals",d.sc_goals),
      ss("sc_rewards",d.sc_rewards),ss("sc_profile",d.sc_profile),ss("sc_habits",d.sc_habits)
    ]);
    try{
      localStorage.setItem("sc_last_tab",tab);
      localStorage.setItem("sc_selected_sport",selectedSportId);
      localStorage.setItem("sc_full_backup_latest",JSON.stringify(payload));
      localStorage.setItem("sc_full_backup_mirror",JSON.stringify(payload));
      if(getFamilyCode()&&window.storage){try{await window.storage.set(fKey("sc_full_backup_latest"),JSON.stringify(payload),true);}catch{}}
    }catch{}
    setBackupMsg("Saved backup snapshot.");
    setTimeout(()=>setBackupMsg(""),2200);
    return payload;
  };
  const exportBackup=async()=>{
    const payload=await saveEverythingNow();
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`scarlett-backup-${todayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setBackupMsg("Backup file downloaded.");
    setTimeout(()=>setBackupMsg(""),2600);
  };
  const restoreBackupPayload=async(payload)=>{
    const d=payload?.data||payload;
    if(!d||typeof d!=="object")return;
    const daily=d.sc_daily||{entries:{}},bball=d.sc_bball||{games:[],skills:clone(DEF_SKILLS)},prax=d.sc_practices||{entries:[]},styleD=d.sc_style||{fits:[],shoes:[]},routineD=d.sc_routine||{entries:{},items:clone(ROUTINE_ITEMS)},slp=d.sc_sleep||{entries:[]},school=d.sc_school||{subjects:clone(DEF_SUBJECTS)},gd=d.sc_goals||{entries:[],stars:0},rd=d.sc_rewards||{claims:[]},pd=d.sc_profile||clone(DEF_PROFILE),hd=d.sc_habits||{entries:clone(DEF_HABITS)};
    setDailyHist(daily.entries||{});setGames(safeArray(bball.games));setSkills(bball.skills||clone(DEF_SKILLS));setPractices(safeArray(prax.entries));setStyleLog(safeArray(styleD.fits));setShoeWish(safeArray(styleD.shoes));setRoutineHist(routineD.entries||{});setRoutineItems(routineD.items||clone(ROUTINE_ITEMS));setSleepEntries(safeArray(slp.entries));setSubjects(school.subjects||clone(DEF_SUBJECTS));setGoals(safeArray(gd.entries));setStars(Number(gd.stars)||0);setRewardClaims(safeArray(rd.claims));setProfile({...clone(DEF_PROFILE),...pd});setHabits(hd.entries||[]);
    const e=(daily.entries||{})[todayISO()]||{};setChecks(e.c||{});setStarAwards(e.r||{});setWater(e.w||0);setVitals(e.vitals||clone(DEF_VITALS));
    await Promise.all([
      ss("sc_daily",daily),ss("sc_bball",bball),ss("sc_practices",prax),ss("sc_style",styleD),ss("sc_routine",routineD),ss("sc_sleep",slp),ss("sc_school",school),ss("sc_goals",gd),ss("sc_rewards",rd),ss("sc_profile",pd),ss("sc_habits",hd)
    ]);
    setBackupMsg("Backup restored.");
    setTimeout(()=>setBackupMsg(""),2600);
  };
  const importBackupFile=async e=>{
    const file=e.target.files?.[0]; if(!file)return;
    try{const payload=JSON.parse(await file.text());await restoreBackupPayload(payload);}
    catch{setBackupMsg("That backup file could not be read.");setTimeout(()=>setBackupMsg(""),2600);}
    e.target.value="";
  };


  const activateCode=async code=>{
    const c=(code||"").trim().toUpperCase();if(c.length<4)return;
    setFCGlobal(c);setFamilyCode(c);
    const [daily,bball,prax,styleD,routineD,slp,school,gd,rd,pd,hd]=await Promise.all([sg("sc_daily"),sg("sc_bball"),sg("sc_practices"),sg("sc_style"),sg("sc_routine"),sg("sc_sleep"),sg("sc_school"),sg("sc_goals"),sg("sc_rewards"),sg("sc_profile"),sg("sc_habits")]);
    if(daily?.entries)setDailyHist(daily.entries);
    if(bball?.games)setGames(bball.games);if(bball?.skills)setSkills(bball.skills);
    if(prax?.entries)setPractices(safeArray(prax.entries));
    if(styleD?.fits)setStyleLog(safeArray(styleD.fits));if(styleD?.shoes)setShoeWish(safeArray(styleD.shoes));
    if(routineD?.entries)setRoutineHist(routineD.entries);if(routineD?.items)setRoutineItems(routineD.items);
    if(slp?.entries)setSleepEntries(safeArray(slp.entries));
    if(school?.subjects)setSubjects(school.subjects);
    if(gd?.entries)setGoals(safeArray(gd.entries));if(gd?.stars)setStars(gd.stars);
    if(rd?.claims)setRewardClaims(safeArray(rd.claims));
    if(hd?.entries)setHabits(hd.entries);
    if(pd)setProfile({...clone(DEF_PROFILE),...pd});
    setBackupMsg("Family Sync Code connected. Use Save Now to push a fresh snapshot.");
    setTimeout(()=>setBackupMsg(""),3000);
  };

  const onEditFocus=e=>{if(["INPUT","TEXTAREA","SELECT"].includes(e.target?.tagName)){clearTimeout(editBlurT.current);setEditing(true);}};
  const onEditBlur=e=>{if(["INPUT","TEXTAREA","SELECT"].includes(e.target?.tagName)){clearTimeout(editBlurT.current);editBlurT.current=setTimeout(()=>setEditing(false),160);}};

  if(!loaded)return<div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14,fontFamily:"system-ui"}}><div style={{fontSize:52,filter:`drop-shadow(0 0 22px ${C.gold})`}}>⭐</div><div style={{fontWeight:900,fontSize:18,color:C.white}}>Loading {profile.name}'s Glow Up...</div></div>;

  const badgeData={games,practices,sleepEntries,subjects,goals,skills,dailyHist,shoeWish,styleLog,stars};
  const rewardCost=item=>{if(item?.cost)return item.cost;const p=String(item?.priority||"").toLowerCase();if(p.includes("dream"))return 3;if(p.includes("next"))return 2;return 1;};
  const approvedGoalCount=goals.filter(g=>g.parentApproved).length;
  const spentRewardTokens=safeArray(rewardClaims).filter(r=>["requested","approved"].includes(r.status)).reduce((a,r)=>a+(r.cost||1),0);
  const rewardTokens=Math.max(0,approvedGoalCount-spentRewardTokens);
  const claimFor=item=>safeArray(rewardClaims).find(r=>r.itemId===item.id&&r.status!=="rejected");
  const approveGoal=async id=>{
    let shouldReward=false;
    const ng=goals.map(g=>{if(g.id!==id)return g;shouldReward=!g.parentApproved;return {...g,done:true,submitted:true,parentApproved:true,approvedDate:toShort(todayISO())};});
    await saveGoals(ng,stars);
  };
  const requestReward=async item=>{
    const existing=claimFor(item);
    const linked=item?.goalId?goalById(goals,item.goalId):null;
    const linkedUnlocked=linked&&linked.parentApproved;
    if(existing)return;
    if(item?.goalId&&!linkedUnlocked)return;
    if(!item?.goalId&&rewardTokens<rewardCost(item))return;
    const claim={id:uid(),itemId:item.id,itemName:item.name,goalId:item.goalId||"",goalCode:linked?goalCodeFor(safeGoals,linked):"",cost:item.goalId?0:rewardCost(item),status:"requested",date:toShort(todayISO())};
    await saveRewards([claim,...rewardClaims]);
  };
  const updateRewardClaim=async(id,status)=>{
    const nr=rewardClaims.map(r=>r.id===id?{...r,status,approvedDate:status==="approved"?toShort(todayISO()):r.approvedDate}:r);
    await saveRewards(nr);
  };

  // ── TODAY ──────────────────────────────────────────────────────────────
  const Today=()=>{
    const [newQuest,setNewQuest]=useState("");
    const [showVirgo,setShowVirgo]=useState(false);
    const [showAffirm,setShowAffirm]=useState(false);
    const done=habits.filter(h=>checks[h.id]).length;
    const total=Math.max(habits.length,1);
    const allDone=habits.length>0&&done===habits.length;
    const horoscope=getDailyHoroscope(profile);
    const wnbaCoach=getDailyWnbaCoach();
    const todayGoals=safeObjects(goals).filter(g=>!g.archived).slice(0,3);
    const previewRewards=safeObjects(shoeWish).slice(0,3);
    const addQuest=async()=>{
      const label=newQuest.trim();
      if(!label)return;
      const entry={id:uid(),e:"⭐",label};
      await saveHabits([...habits,entry]);
      setNewQuest("");
    };
    const removeQuest=async id=>{
      const next=habits.filter(h=>h.id!==id);
      await saveHabits(next);
      const nc={...checks};delete nc[id];setChecks(nc);
    };
    const toggleCheck=async id=>{const next={...checks,[id]:!checks[id]};setChecks(next);if(!checks[id]&&!starAwards[id]){setStarAwards(p=>({...p,[id]:true}));await addStars(1);}};
    const starterRewards=[
      {name:"New Basketball",cost:"300 pts",img:REWARD_THUMBS.basketball},
      {name:"WNBA Jersey",cost:"500 pts",img:REWARD_THUMBS.jersey},
      {name:"Nike Backpack",cost:"400 pts",img:REWARD_THUMBS.backpack}
    ];
    const rewardTiles=previewRewards.length?previewRewards.map(x=>({name:x.name,cost:x.goalId?"Goal reward":`${rewardCost(x)} token${rewardCost(x)===1?"":"s"}`,img:x.image||x.photo||x.img||""})):starterRewards;
    const goalRows=todayGoals.length?todayGoals.map((g,i)=>({type:"goal",id:g.id,title:g.title||g.goal||"Goal",sub:g.category?`${String(g.category).replace(/^./,m=>m.toUpperCase())} goal`:"Goal",done:!!g.parentApproved,progress:g.done?100:g.submitted?75:35,e:g.category==="school"?"📖":g.category==="health"?"💗":g.category==="future"?"🚀":"👟"})):habits.slice(0,3).map(h=>({type:"habit",id:h.id,title:h.label,sub:"Daily quest",done:!!checks[h.id],progress:checks[h.id]?100:0,e:h.e||"⭐"}));
    return <div>
      <div style={{...cs,padding:0,background:"transparent",border:"none",boxShadow:"none",overflow:"visible",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12,minWidth:0}}>
            <div style={{width:66,height:66,borderRadius:"50%",padding:2,background:`linear-gradient(135deg,${C.blush},${C.rose})`,boxShadow:`0 0 0 4px rgba(217,160,186,.08)`}}>
              <div style={{width:"100%",height:"100%",borderRadius:"50%",background:"radial-gradient(circle at 35% 25%,rgba(255,255,255,.18),transparent 25%),linear-gradient(145deg,#252229,#111)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:950,color:C.cream,fontFamily:"Georgia,serif"}}>{(profile.name||"S").slice(0,1)}</div>
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:34,lineHeight:1,fontWeight:800,color:C.cream,fontFamily:"Georgia,serif",letterSpacing:"-.6px"}}>{profile.name}</div>
              <div style={{fontSize:13,color:C.muted,marginTop:4}}>Level {level} • {levelTitle}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
            <button onClick={()=>setTab("progress")} style={{minWidth:58,padding:"10px 12px",borderRadius:16,border:`1px solid rgba(255,255,255,.13)`,background:"rgba(255,255,255,.07)",color:C.cream,cursor:"pointer",fontFamily:"system-ui",boxShadow:"inset 0 1px 0 rgba(255,255,255,.08)"}}>
              <div style={{fontSize:18,color:C.gold,lineHeight:1}}>★ {stars}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:3}}>Stars</div>
            </button>
            <button onClick={()=>setShowSettings(true)} style={{width:48,height:48,borderRadius:16,border:`1px solid rgba(255,255,255,.13)`,background:"rgba(255,255,255,.07)",color:C.light,cursor:"pointer",fontSize:18}}>🔔</button>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginLeft:78}}>
          <div style={{height:7,flex:1,background:"rgba(255,255,255,.10)",borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(xpInLevel/xpPerLevel)*100}%`,background:`linear-gradient(90deg,${C.pink},${C.teal},${C.gold})`,borderRadius:99,transition:"width .4s"}}/>
          </div>
          <div style={{fontSize:12,color:C.muted,whiteSpace:"nowrap"}}>{xpInLevel} / {xpPerLevel} XP to Level {level+1}</div>
        </div>
      </div>

      <div style={{...cs,background:"radial-gradient(circle at 85% 18%,rgba(255,140,198,.14),transparent 34%),linear-gradient(145deg,rgba(20,25,26,.98),rgba(9,12,13,.99))",color:C.text,border:"1px solid rgba(255,255,255,.16)",padding:22,boxShadow:"0 24px 60px rgba(0,0,0,.48)",minHeight:166}}>
        <div style={{position:"absolute",right:22,top:18,fontSize:86,opacity:.18,color:C.mauve,lineHeight:1}}>♕</div>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:13,letterSpacing:"3px",fontWeight:950,color:C.mauve,marginBottom:12}}>I AM...</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:34,lineHeight:1.08,fontWeight:800,letterSpacing:"-.7px",maxWidth:280}}>Smart. Strong.<br/>Focused. Unstoppable.</div>
          <div style={{width:178,height:10,borderBottom:`4px solid ${C.mauve}`,borderRadius:"50%",margin:"-2px 0 16px 104px",transform:"rotate(-2deg)",opacity:.85}}/>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button onClick={()=>setTab("goals")} style={{border:"none",borderRadius:999,padding:"11px 18px",background:C.teal,color:C.darkText,fontWeight:850,fontSize:15,cursor:"pointer",fontFamily:"system-ui"}}>★ {stars} Stars</button>
            <button onClick={()=>setShowAffirm(!showAffirm)} style={{border:"none",borderRadius:999,padding:"11px 18px",background:"rgba(33,31,33,.09)",color:C.text,fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"system-ui"}}>View Affirmations</button>
          </div>
          {showAffirm&&<div style={{marginTop:14,padding:12,borderRadius:16,background:"rgba(255,255,255,.055)",border:"1px solid rgba(255,255,255,.12)"}}>
            <div style={{fontSize:12,color:C.mauve,fontWeight:950,letterSpacing:"1px",marginBottom:6}}>MY AFFIRMATION</div>
            <input value={vitals.mantra||""} onChange={e=>setVitals(p=>({...p,mantra:e.target.value}))} placeholder="I am..." style={{...INP,background:"rgba(255,255,255,.055)",border:"1px solid rgba(255,255,255,.14)",color:C.text,fontWeight:850}}/>
          </div>}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <button onClick={()=>setTab("virgo")} style={{...cs,marginBottom:0,textAlign:"left",cursor:"pointer",fontFamily:"system-ui",background:"linear-gradient(145deg,rgba(20,25,26,.96),rgba(10,13,14,.99))",border:"1px solid rgba(255,255,255,.13)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:38,height:38,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:C.mauve,color:C.cream,fontSize:21}}>♍</div>
            <div style={{fontSize:10,letterSpacing:"2.5px",fontWeight:950,color:C.blush}}>VIRGO DAILY VIBE</div>
          </div>
          <div style={{fontFamily:"Georgia,serif",fontSize:21,lineHeight:1.08,color:C.cream,marginBottom:8}}>{horoscope.vibe}</div>
          <div style={{fontSize:13,lineHeight:1.45,color:C.light,opacity:.86}}>{String(horoscope.message||"").slice(0,82)+(String(horoscope.message||"").length>82?"...":"")}</div>
          <div style={{marginTop:10,display:"grid",gap:7}}>
            <div style={{fontSize:12,color:C.blush}}><b>Power move:</b> {horoscope.power}</div>
          </div>
          <div style={{fontSize:13,color:C.blush,fontWeight:900,marginTop:12}}>See More →</div>
        </button>

        <button onClick={()=>setTab("coach")} style={{...cs,marginBottom:0,textAlign:"left",cursor:"pointer",fontFamily:"system-ui",background:"linear-gradient(145deg,rgba(20,25,26,.96),rgba(10,13,14,.99))",border:"1px solid rgba(255,255,255,.13)"}}>
          <div style={{fontSize:10,letterSpacing:"2.5px",fontWeight:950,color:C.blush,marginBottom:10,textAlign:"right"}}>WNBA DAILY COACH</div>
          <div style={{display:"grid",gridTemplateColumns:"70px 1fr",gap:10,alignItems:"center",marginBottom:10}}>
            <div style={{width:70,height:86,borderRadius:999,overflow:"hidden",background:`linear-gradient(135deg,${C.mauve}55,rgba(255,255,255,.08))`,border:`2px solid ${C.mauve}`}}>
              <img src={wnbaCoach.photo} alt={wnbaCoach.player} referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display="none";}} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
            </div>
            <div>
              <div style={{fontFamily:"Georgia,serif",fontSize:20,lineHeight:1.06,color:C.cream}}>Coach’s Tip</div>
              <div style={{fontSize:12,color:C.muted,marginTop:4}}>{wnbaCoach.player}</div>
            </div>
          </div>
          <div style={{fontSize:13,lineHeight:1.43,color:C.light,opacity:.88}}>{wnbaCoach.takeaway||wnbaCoach.quote}</div>
          <div style={{fontSize:13,color:C.blush,fontWeight:900,marginTop:12}}>Watch Tip →</div>
        </button>
      </div>

      <div style={{...cs,background:"linear-gradient(145deg,rgba(20,25,26,.96),rgba(10,13,14,.99))",border:"1px solid rgba(255,255,255,.13)",padding:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
          <CH e="◎" title="Today's Goals" sub={goalRows.length?null:"Set one clear goal for today"}/>
          <div style={{fontSize:12,color:C.muted}}>{goalRows.filter(g=>g.done).length} of {Math.max(goalRows.length,habits.length||todayGoals.length||1)} done</div>
        </div>

        {goalRows.length===0&&<div style={{padding:14,borderRadius:18,background:"rgba(255,255,255,.045)",border:`1px dashed ${C.border}`,color:C.muted,fontSize:13,lineHeight:1.45,marginBottom:10}}>
          Start by adding one clear goal or daily quest. Keep it specific, small enough to do today, and connected to a reward she cares about.
        </div>}

        {goalRows.map(row=>{
          const isHabit=row.type==="habit";
          return <button key={`${row.type}_${row.id}`} onClick={()=>isHabit?toggleCheck(row.id):setTab("goals")} style={{width:"100%",display:"grid",gridTemplateColumns:"48px 1fr auto",gap:10,alignItems:"center",padding:"10px 8px",borderRadius:16,border:"1px solid rgba(255,255,255,.10)",background:row.done?"rgba(156,199,165,.12)":"rgba(255,255,255,.035)",color:C.text,cursor:"pointer",fontFamily:"system-ui",textAlign:"left",marginBottom:7}}>
            <div style={{width:40,height:40,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${C.mauve},${C.blush})`,fontSize:20,color:C.white}}>{row.done?"✓":row.e}</div>
            <div style={{minWidth:0}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:18,lineHeight:1.08,color:C.cream,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{row.title}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:2}}>{row.sub}</div>
              {!row.done&&row.progress>0&&<div style={{height:6,borderRadius:99,background:"rgba(255,255,255,.10)",overflow:"hidden",marginTop:7}}>
                <div style={{height:"100%",width:`${row.progress}%`,borderRadius:99,background:C.blush}}/>
              </div>}
            </div>
            <div style={{width:42,height:42,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${row.done?C.blush:"rgba(255,255,255,.26)"}`,background:row.done?C.blush:"transparent",color:row.done?C.darkText:C.muted,fontWeight:950}}>{row.done?"✓":row.progress?`${Math.round(row.progress)}%`:""}</div>
          </button>;
        })}

        <div style={{display:"flex",gap:8,marginTop:10}}>
          <input value={newQuest} onChange={e=>setNewQuest(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addQuest();}} placeholder="Quick daily quest..." style={{...INP,flex:1,background:"rgba(255,255,255,.045)"}}/>
          <button onClick={addQuest} style={{width:70,borderRadius:16,border:"none",background:C.gold,color:C.text,fontWeight:950,cursor:"pointer",fontFamily:"system-ui"}}>Add</button>
        </div>
        <button onClick={()=>setTab("goals")} style={{width:"100%",border:"none",borderRadius:14,padding:13,marginTop:9,background:`linear-gradient(135deg,${C.mauve},${C.rose})`,color:C.white,fontWeight:850,fontSize:15,cursor:"pointer",fontFamily:"system-ui"}}>＋ Add a Goal</button>
      </div>

      <div style={{...cs,background:"linear-gradient(145deg,rgba(20,25,26,.96),rgba(10,13,14,.99))",color:C.text,border:"1px solid rgba(255,255,255,.12)",padding:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:12,letterSpacing:"3px",fontWeight:950,color:C.teal}}>REWARDS & WISHLIST</div>
          <button onClick={()=>setTab("wishlist")} style={{border:"none",background:"transparent",color:C.teal,fontWeight:700,cursor:"pointer",fontFamily:"system-ui"}}>View all →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"82px repeat(3,1fr) 74px",gap:8,alignItems:"stretch"}}>
          <button onClick={()=>setTab("progress")} style={{border:"none",background:"rgba(255,255,255,.045)",borderRadius:18,cursor:"pointer",fontFamily:"system-ui",padding:8,color:C.text,border:"1px solid rgba(255,255,255,.08)"}}>
            <div style={{width:58,height:58,borderRadius:"50%",border:`6px solid rgba(255,140,198,.16)`,borderTopColor:C.teal,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px",fontWeight:900,color:C.teal,fontSize:18}}>{stars}</div>
            <div style={{fontSize:10}}>Points</div>
          </button>
          {rewardTiles.slice(0,3).map((it,i)=><button key={`${it.name}_${i}`} onClick={()=>setTab("wishlist")} style={{border:"1px solid rgba(255,255,255,.10)",background:"rgba(255,255,255,.045)",borderRadius:16,padding:8,cursor:"pointer",fontFamily:"system-ui",color:C.text,minWidth:0}}>
            <div style={{height:58,borderRadius:15,background:"rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6,overflow:"hidden"}}>
              {it.img&&(String(it.img).startsWith("http")||String(it.img).startsWith("data:image"))?<img src={it.img} alt={it.name} style={{width:"100%",height:"100%",objectFit:"contain",padding:4,boxSizing:"border-box"}}/>:<span style={{fontSize:28}}>{it.img||"🎁"}</span>}
            </div>
            <div style={{fontSize:10,fontWeight:850,lineHeight:1.15,minHeight:23,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{it.name}</div>
            <div style={{fontSize:9,color:C.teal,marginTop:2}}>{it.cost}</div>
          </button>)}
          <button onClick={()=>setTab("wishlist")} style={{border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.045)",borderRadius:18,padding:8,cursor:"pointer",fontFamily:"system-ui",color:C.text}}>
            <div style={{width:42,height:42,borderRadius:"50%",border:"2px dashed rgba(53,207,201,.50)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"3px auto 8px"}}>＋</div>
            <div style={{fontSize:10,lineHeight:1.15}}>Add to<br/>Wishlist</div>
          </button>
        </div>
      </div>
    </div>;
  };



  // ── VIRGO DAILY VIBE SPOTLIGHT ─────────────────────────────────────────
  const VirgoVibe=()=>{
    const horoscope=getDailyHoroscope(profile);
    const quickActions=[
      {label:"Turn vibe into a goal",icon:"🎯",go:"goals"},
      {label:"Open My Glow routine",icon:"✨",go:"glow"},
      {label:"Check rewards",icon:"🎁",go:"progress"}
    ];
    return <div>
      <button onClick={()=>setTab("today")} style={{marginBottom:12,border:"none",background:"rgba(255,255,255,.06)",color:C.blush,borderRadius:999,padding:"10px 14px",fontWeight:900,cursor:"pointer",fontFamily:"system-ui"}}>← Back to Today</button>

      <TabHero
        eyebrow="Virgo Daily Vibe"
        title="A calm focus prompt for today."
        sub="Use today’s Virgo-inspired focus to feel calmer, more confident, and ready to follow through."
        icon="♍"
        stats={[
          {value:"♍",label:"virgo",color:C.mauve},
          {value:"1",label:"power move",color:C.gold},
          {value:"Goal",label:"next",color:C.teal,onClick:()=>setTab("goals")}
        ]}
      />

      <div style={{...cs,background:`linear-gradient(135deg,${C.cream},${C.cream2})`,color:C.darkText,border:"1px solid rgba(255,255,255,.24)",padding:20,boxShadow:"0 24px 60px rgba(0,0,0,.42)"}}>
        <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}>
          <div style={{width:92,height:92,borderRadius:32,display:"flex",alignItems:"center",justifyContent:"center",fontSize:54,background:`linear-gradient(135deg,${C.mauve}26,rgba(255,255,255,.56))`,border:`3px solid ${C.mauve}`,boxShadow:"0 14px 35px rgba(0,0,0,.18)"}}>♍</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,letterSpacing:"2.6px",fontWeight:950,color:C.mauve,marginBottom:8}}>{horoscope.sign||"Virgo"} ENERGY</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:28,lineHeight:1.02,fontWeight:850,color:C.darkText}}>{horoscope.vibe}</div>
            <div style={{marginTop:8,fontSize:12,color:"rgba(33,31,33,.62)",fontWeight:800}}>{horoscope.theme||"Daily focus"} · {horoscope.element||"Earth"}</div>
          </div>
        </div>

        <div style={{padding:15,borderRadius:20,background:"rgba(255,255,255,.62)",border:"1px solid rgba(0,0,0,.06)",marginBottom:14}}>
          <div style={{fontSize:11,letterSpacing:"2px",fontWeight:950,color:C.mauve,marginBottom:8}}>TODAY'S HOROSCOPE</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:22,lineHeight:1.25,color:C.darkText}}>“{horoscope.message}”</div>
        </div>

        <div style={{fontSize:12,letterSpacing:"2px",fontWeight:950,color:C.mauve,marginBottom:8}}>VIRGO READ</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:24,lineHeight:1.08,fontWeight:850,marginBottom:10,color:C.darkText}}>{horoscope.theme||horoscope.vibe}</div>
        <div style={{fontSize:15,lineHeight:1.65,color:"rgba(33,31,33,.78)",marginBottom:14}}>{horoscope.longVibe||horoscope.message}</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10}}>
          <div style={{padding:13,borderRadius:18,background:"rgba(255,140,198,.08)",border:"1px solid rgba(167,101,131,.22)"}}>
            <div style={{fontSize:11,letterSpacing:"2px",fontWeight:950,color:C.mauve,marginBottom:5}}>POWER MOVE</div>
            <div style={{fontSize:14,lineHeight:1.5,fontWeight:750}}>{horoscope.tryThis||horoscope.power}</div>
          </div>
          <div style={{padding:13,borderRadius:18,background:"rgba(221,191,134,.13)",border:"1px solid rgba(221,191,134,.25)"}}>
            <div style={{fontSize:11,letterSpacing:"2px",fontWeight:950,color:"#9C7A3C",marginBottom:5}}>I AM AFFIRMATION</div>
            <div style={{fontSize:14,lineHeight:1.5,fontWeight:750}}>{horoscope.affirmation||"I am focused, calm, and ready."}</div>
          </div>
          <div style={{padding:13,borderRadius:18,background:"rgba(141,189,182,.13)",border:"1px solid rgba(141,189,182,.25)"}}>
            <div style={{fontSize:11,letterSpacing:"2px",fontWeight:950,color:"#4F8F87",marginBottom:5}}>JOURNAL PROMPT</div>
            <div style={{fontSize:14,lineHeight:1.5,fontWeight:750}}>{horoscope.journal||"What is one small win I can create today?"}</div>
          </div>
        </div>
      </div>

      <div style={{...cs,background:"linear-gradient(145deg,rgba(34,32,35,.96),rgba(17,16,19,.99))",border:"1px solid rgba(255,255,255,.12)"}}>
        <CH e="✨" title="Use the Virgo vibe" sub="Make the daily vibe useful, not just cute"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:9,marginBottom:12}}>
          <div style={{padding:13,borderRadius:18,background:"rgba(255,255,255,.055)",border:"1px solid rgba(255,255,255,.14)"}}>
            <div style={{fontSize:11,letterSpacing:"2px",fontWeight:950,color:C.blush,marginBottom:5}}>LUCKY VIBE</div>
            <div style={{fontSize:14,lineHeight:1.5,fontWeight:750,color:C.darkText}}>{horoscope.lucky}</div>
          </div>
          <div style={{padding:13,borderRadius:18,background:"rgba(255,255,255,.055)",border:"1px solid rgba(255,255,255,.14)"}}>
            <div style={{fontSize:11,letterSpacing:"2px",fontWeight:950,color:C.gold,marginBottom:5}}>GLOW TIP</div>
            <div style={{fontSize:14,lineHeight:1.5,fontWeight:750,color:C.darkText}}>{horoscope.glowTip||"Keep it simple and finish one thing."}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:9}}>
          {quickActions.map(a=><button key={a.label} onClick={()=>setTab(a.go)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:14,borderRadius:18,border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.045)",color:C.text,cursor:"pointer",fontFamily:"system-ui",textAlign:"left"}}>
            <span style={{display:"flex",alignItems:"center",gap:10,fontWeight:900}}><span style={{fontSize:20}}>{a.icon}</span>{a.label}</span>
            <span style={{color:C.blush,fontWeight:950}}>→</span>
          </button>)}
        </div>
      </div>
    </div>;
  };


  // ── WNBA COACH SPOTLIGHT ───────────────────────────────────────────────
  const Coach=()=>{
    const coach=getDailyWnbaCoach();
    const quickActions=[
      {label:"Log hoops work",icon:"🏀",go:"hoops"},
      {label:"Set a goal from this",icon:"🎯",go:"goals"},
      {label:"Open rewards",icon:"🎁",go:"progress"}
    ];
    return <div>
      <button onClick={()=>setTab("today")} style={{marginBottom:12,border:"none",background:"rgba(255,255,255,.06)",color:C.blush,borderRadius:999,padding:"10px 14px",fontWeight:900,cursor:"pointer",fontFamily:"system-ui"}}>← Back to Today</button>

      <TabHero
        eyebrow="Daily Coach"
        title="One real lesson. One action today."
        sub="The coach card turns inspiration into something Scarlett can actually do."
        icon="🏀"
        stats={[
          {value:"Tip",label:"today",color:C.mauve},
          {value:"1",label:"action",color:C.gold},
          {value:"Goal",label:"next",color:C.teal,onClick:()=>setTab("goals")}
        ]}
      />

      <div style={{...cs,background:`linear-gradient(135deg,${C.cream},${C.cream2})`,color:C.darkText,border:"1px solid rgba(255,255,255,.24)",padding:20,boxShadow:"0 24px 60px rgba(0,0,0,.42)"}}>
        <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}>
          <div style={{width:96,height:120,borderRadius:32,overflow:"hidden",background:`linear-gradient(135deg,${C.mauve}44,rgba(255,255,255,.38))`,border:`3px solid ${C.mauve}`,boxShadow:"0 14px 35px rgba(0,0,0,.25)"}}>
            <img src={coach.photo} alt={coach.player} referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display="none";}} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,letterSpacing:"2.6px",fontWeight:950,color:C.mauve,marginBottom:8}}>WNBA DAILY COACH</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:28,lineHeight:1.02,fontWeight:850,color:C.darkText}}>Tip from<br/>{coach.player}</div>
            <div style={{marginTop:8,fontSize:12,color:"rgba(33,31,33,.62)",fontWeight:800}}>{coach.team} · {coach.tag}</div>
          </div>
        </div>

        <div style={{padding:15,borderRadius:20,background:"rgba(255,255,255,.62)",border:"1px solid rgba(0,0,0,.06)",marginBottom:14}}>
          <div style={{fontSize:11,letterSpacing:"2px",fontWeight:950,color:C.mauve,marginBottom:8}}>REAL QUOTE</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:22,lineHeight:1.25,color:C.darkText}}>“{coach.quote}”</div>
        </div>

        <div style={{fontSize:12,letterSpacing:"2px",fontWeight:950,color:C.mauve,marginBottom:8}}>TODAY'S LESSON</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:24,lineHeight:1.08,fontWeight:850,marginBottom:10,color:C.darkText}}>{coach.headline||coach.takeaway}</div>
        <div style={{fontSize:15,lineHeight:1.65,color:"rgba(33,31,33,.78)",marginBottom:14}}>{coach.longTip||coach.takeaway}</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10}}>
          <div style={{padding:13,borderRadius:18,background:"rgba(255,140,198,.08)",border:"1px solid rgba(167,101,131,.22)"}}>
            <div style={{fontSize:11,letterSpacing:"2px",fontWeight:950,color:C.mauve,marginBottom:5}}>TRY THIS TODAY</div>
            <div style={{fontSize:14,lineHeight:1.5,fontWeight:750}}>{coach.tryThis||"Choose one small action and finish it today."}</div>
          </div>
          <div style={{padding:13,borderRadius:18,background:"rgba(221,191,134,.13)",border:"1px solid rgba(221,191,134,.25)"}}>
            <div style={{fontSize:11,letterSpacing:"2px",fontWeight:950,color:"#9C7A3C",marginBottom:5}}>FOCUS</div>
            <div style={{fontSize:14,lineHeight:1.5,fontWeight:750}}>{coach.focus||"Confidence · effort · consistency"}</div>
          </div>
        </div>
      </div>

      <div style={{...cs,background:"linear-gradient(145deg,rgba(34,32,35,.96),rgba(17,16,19,.99))",border:"1px solid rgba(255,255,255,.12)"}}>
        <CH e="✨" title="Use the tip" sub="Turn the coach message into action"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:9}}>
          {quickActions.map(a=><button key={a.label} onClick={()=>setTab(a.go)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:14,borderRadius:18,border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.045)",color:C.text,cursor:"pointer",fontFamily:"system-ui",textAlign:"left"}}>
            <span style={{display:"flex",alignItems:"center",gap:10,fontWeight:900}}><span style={{fontSize:20}}>{a.icon}</span>{a.label}</span>
            <span style={{color:C.blush,fontWeight:950}}>→</span>
          </button>)}
        </div>
      </div>
    </div>;
  };


  // ── HOOPS ──────────────────────────────────────────────────────────────
  const Hoops=()=>{
    const sportTemplate=SPORT_TEMPLATES[selectedSportId]||SPORT_TEMPLATES.basketball;
    const isBasketball=sportTemplate.id==="basketball";
    const[section,setSection]=useState("game");
    const[templateStats,setTemplateStats]=useState(()=>Object.fromEntries((SPORT_TEMPLATES[selectedSportId]||SPORT_TEMPLATES.basketball).statFields.map(f=>[f.key,0])));
    useEffect(()=>{setTemplateStats(Object.fromEntries(sportTemplate.statFields.map(f=>[f.key,0])));},[sportTemplate.id]);
    const emptyGf={pts:"",ast:"",reb:"",stl:"",blk:"",tov:"",fouls:"",fgm:"",fga:"",ftm:"",fta:"",result:"Win",opp:"",effort:0,confidence:0};
    const[gf,setGf]=useState(emptyGf);
    const[editGameId,setEditGameId]=useState(null);
    const[pf,setPf]=useState({type:"Team Practice",duration:"",effort:0,note:""});

    const ni=k=>parseInt(gf[k])||0;
    const ftPctNow=ni("fta")?Math.round(ni("ftm")/ni("fta")*100):null;
    const fgPctNow=ni("fga")?Math.round(ni("fgm")/ni("fga")*100):null;
    const resetGameForm=()=>{setGf(emptyGf);setEditGameId(null);};

    const startEditGame=g=>{
      setSection("game");
      setEditGameId(g.id);
      setGf({
        pts:String(g.pts??""),
        ast:String(g.ast??""),
        reb:String(g.reb??""),
        stl:String(g.stl??""),
        blk:String(g.blk??""),
        tov:String(g.tov??""),
        fouls:String(g.fouls??""),
        fgm:String(g.fgm??""),
        fga:String(g.fga??""),
        ftm:String(g.ftm??""),
        fta:String(g.fta??""),
        result:g.result||"Win",
        opp:g.opponent||"",
        effort:g.effort||0,
        confidence:g.confidence||0
      });
      setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),50);
    };

    const logGame=async()=>{
      const pts=ni("pts");if(!gf.result)return;
      const base={date:toShort(todayISO()),dateISO:todayISO(),pts,ast:ni("ast"),reb:ni("reb"),stl:ni("stl"),blk:ni("blk"),tov:ni("tov"),fouls:ni("fouls"),fgm:ni("fgm"),fga:ni("fga"),ftm:ni("ftm"),fta:ni("fta"),result:gf.result,opponent:gf.opp,effort:gf.effort,confidence:gf.confidence};
      if(editGameId){
        const ng=games.map(g=>g.id===editGameId?{...g,...base,id:g.id,date:g.date||base.date,dateISO:g.dateISO||base.dateISO}:g);
        await saveBball(ng,skills);
        resetGameForm();
        return;
      }
      const entry={id:uid(),...base};
      const ng=[entry,...games].slice(0,100);await saveBball(ng,skills);
      const earn=(gf.result==="Win"?5:2)+(pts>=15?4:pts>=10?2:pts>=5?1:0)+(gf.effort>=4?1:0)+(ni("stl")>=3?1:0);
      await addStars(earn);
      resetGameForm();
    };
    const logPractice=async()=>{
      const entry={id:uid(),date:toShort(todayISO()),dateISO:todayISO(),type:pf.type,duration:pf.duration,effort:pf.effort,note:pf.note};
      const np=[entry,...practices].slice(0,100);await savePrax(np);
      await addStars(pf.effort>=4?4:3);
      setPf({type:"Team Practice",duration:"",effort:0,note:""});
    };
    const adjSkill=async(skill,delta)=>{const nv=Math.min(100,Math.max(0,(skills[skill]||0)+delta));const nsk={...skills,[skill]:nv};await saveBball(games,nsk);if(delta>0)await addStars(1);};
    const wins=games.filter(g=>g.result==="Win").length;
    const s=k=>games.reduce((a,g)=>a+(g[k]||0),0);
    const a=k=>games.length?(s(k)/games.length).toFixed(1):"—";
    const ftA=s("fta"),ftM=s("ftm"),fgA=s("fga"),fgM=s("fgm");
    const SKILL_GROUPS={"Handles & Scoring":{col:C.coral,items:["Ball Handling","Shooting Form","Layups","Free Throws"]},"Passing & Vision":{col:C.purple,items:["Passing","Court Vision"]},"Defense & Hustle":{col:C.teal,items:["Defense","Rebounding","Footwork","Speed & Agility","Conditioning"]},"Mindset":{col:C.gold,items:["Basketball IQ","Confidence","Leadership"]}};
    const numInput=(label,key,big=false)=><div key={key}><div style={{fontSize:big?10:9,color:C.muted,fontWeight:800,marginBottom:5,textAlign:"center",lineHeight:1.15}}>{label}</div><input type="number" inputMode="numeric" min="0" placeholder="0" value={gf[key]} onChange={ev=>setGf(p=>({...p,[key]:ev.target.value}))} style={{...INP,textAlign:"center",fontWeight:900,fontSize:big?21:18,padding:big?"10px 4px":"9px 4px"}}/></div>;
    const sportMetric=(field)=><div key={field.key} style={{...glass,borderRadius:18,padding:12}}>
      <div style={{fontSize:9,color:C.muted,fontWeight:900,letterSpacing:".7px",textTransform:"uppercase",marginBottom:7}}>{field.group}</div>
      <div style={{fontSize:12,fontWeight:950,color:C.text,lineHeight:1.15,minHeight:30}}>{field.label}</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginTop:10}}>
        <button onClick={()=>setTemplateStats(p=>({...p,[field.key]:Math.max(0,(parseInt(p[field.key])||0)-1)}))} style={{width:34,height:34,borderRadius:12,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.04)",color:C.light,fontSize:18,fontWeight:950,cursor:"pointer"}}>−</button>
        <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:950,color:sportTemplate.accent,minWidth:36,textAlign:"center"}}>{templateStats[field.key]||0}</div>
        <button onClick={()=>setTemplateStats(p=>({...p,[field.key]:(parseInt(p[field.key])||0)+1}))} style={{width:34,height:34,borderRadius:12,border:`1px solid ${sportTemplate.accent}55`,background:`${sportTemplate.accent}18`,color:sportTemplate.accent,fontSize:18,fontWeight:950,cursor:"pointer"}}>+</button>
      </div>
    </div>;
    const universalPct=(made,att)=>att?Math.round((made/att)*100)+"%":"—";
    const ratingScale=(label,emoji,key,val,col)=>(
      <div style={{...glass,borderRadius:18,padding:12,overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontSize:10,color:C.muted,fontWeight:950,letterSpacing:"1.4px",textTransform:"uppercase",marginBottom:10,whiteSpace:"nowrap"}}>
          <span>{label}</span><span style={{fontSize:16,lineHeight:1}}>{emoji}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:7,width:"100%"}}>
          {Array.from({length:5},(_,i)=>{
            const n=i+1;
            const active=val===n;
            return <button key={n} onClick={()=>setGf(p=>({...p,[key]:active?0:n}))} style={{
              minWidth:0,
              height:42,
              borderRadius:13,
              border:`1.5px solid ${active?col:C.border}`,
              background:active?`linear-gradient(145deg,${col},${C.blush})`:"rgba(255,255,255,.045)",
              color:active?C.white:"rgba(247,241,234,.54)",
              fontWeight:950,
              fontSize:14,
              cursor:"pointer",
              boxShadow:active?`0 0 16px ${col}35`:"none",
              fontFamily:"system-ui",
              display:"flex",
              alignItems:"center",
              justifyContent:"center"
            }}>{n}</button>;
          })}
        </div>
      </div>
    );


    return<div>
      <TabHero
        eyebrow="Sports Hub"
        title="Sports: Performance Hub"
        sub="Track Scarlett’s active sport, training, game stats, and skills here, with room to add future sports only when they become relevant."
        icon="🏀"
        stats={[
          {value:games.length,label:"games",color:C.mauve,onClick:()=>setSection("game")},
          {value:practices.length,label:"practices",color:C.gold,onClick:()=>setSection("practice")},
          {value:Math.round(avgArr(Object.values(skills)))+"%",label:"skills",color:C.teal,onClick:()=>setSection("skills")}
        ]}
      />
      <div style={cs}>
        <CH e="🏟️" title="Current Active Sport" sub="Basketball stays at the top because this is Scarlett’s active saved tracker for stats, training, and skills."/>
        <div style={{fontSize:10,color:C.muted,fontWeight:950,letterSpacing:"1.6px",textTransform:"uppercase",marginBottom:8}}>Current Active Sport</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8,marginBottom:0}}>
          {ACTIVE_SPORT_IDS.map(id=>{const sport=SPORT_TEMPLATES[id];return <button key={sport.id} onClick={()=>{setSelectedSportId(sport.id);setSection("game");}} style={{display:"flex",alignItems:"center",gap:12,padding:14,borderRadius:20,border:`1px solid ${selectedSportId===sport.id?sport.accent:C.border}`,background:selectedSportId===sport.id?`${sport.accent}20`:"rgba(255,255,255,.04)",color:C.cream,cursor:"pointer",fontFamily:"system-ui",textAlign:"left"}}>
            <div style={{width:44,height:44,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:25,background:`${sport.accent}18`,border:`1px solid ${sport.accent}44`}}>{sport.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:950,color:C.text}}>{sport.label}</div>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>Active tracker · saved games · practices · skills</div>
            </div>
            <div style={{fontSize:9,fontWeight:950,color:sport.accent,background:`${sport.accent}18`,padding:"5px 8px",borderRadius:999}}>ACTIVE</div>
          </button>;})}
        </div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,background:"rgba(255,255,255,.045)",borderRadius:18,padding:5,border:"1px solid rgba(255,255,255,.10)"}}>
        {[["game","🏀 Stats"],["practice","💪 Training"],["skills","📊 Skills"]].map(([id,label])=>(
          <button key={id} onClick={()=>setSection(id)} style={{flex:1,padding:"10px 0",borderRadius:12,border:"none",background:section===id?`linear-gradient(135deg,${C.mauve},${C.blush})`:"transparent",color:C.white,fontWeight:900,cursor:"pointer",fontSize:13,fontFamily:"system-ui"}}>{label}</button>
        ))}
      </div>

      {section==="game"&&!isBasketball&&<>
        <div style={cs}>
          <CH e={sportTemplate.icon} title={`${sportTemplate.label} Live Stat Template`} sub="Preview only for now. Basketball is the only active saved sport; this shows how this sport would look if Scarlett adds it later."/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {sportTemplate.statFields.map(field=>sportMetric(field))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
            {sportTemplate.id==="soccer"&&<>
              <SBox value={universalPct(templateStats.shotsOnGoal||0,templateStats.shots||0)} label="Shot Accuracy" color={sportTemplate.accent}/>
              <SBox value={(templateStats.goals||0)+(templateStats.assists||0)} label="Goal Impact" color={C.gold}/>
              <SBox value={templateStats.minutes||0} label="Minutes" color={C.teal}/>
            </>}
            {sportTemplate.id==="tennis"&&<>
              <SBox value={universalPct(templateStats.firstServesIn||0,templateStats.serveAttempts||0)} label="Serve In %" color={sportTemplate.accent}/>
              <SBox value={Math.max(0,(templateStats.winners||0)-(templateStats.unforcedErrors||0))} label="Clean Points" color={C.gold}/>
              <SBox value={templateStats.setsWon||0} label="Sets Won" color={C.teal}/>
            </>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setTemplateStats(Object.fromEntries(sportTemplate.statFields.map(f=>[f.key,0])))} style={{flex:1,padding:13,borderRadius:16,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.045)",color:C.light,fontWeight:900,cursor:"pointer",fontFamily:"system-ui"}}>Reset Preview</button>
            <button onClick={()=>setSelectedSportId("basketball")} style={{flex:1,padding:13,borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.pink},${C.blush},${C.teal})`,color:C.darkText,fontWeight:950,cursor:"pointer",fontFamily:"system-ui"}}>Back to Basketball</button>
          </div>
        </div>
        <div style={cs}>
          <CH e="✨" title="Coach Insights" sub={`Generated from the ${sportTemplate.label} template`}/>
          {sportTemplate.insights.map((insight,i)=><div key={insight} style={{padding:"10px 0",borderBottom:i<sportTemplate.insights.length-1?`1px solid ${C.border}`:"none",fontSize:12,color:C.text,lineHeight:1.55}}>
            <span style={{color:sportTemplate.accent,fontWeight:950,marginRight:6}}>{i+1}.</span>{insight}
          </div>)}
        </div>
      </>}
      {section==="game"&&isBasketball&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:7}}>
          {[{v:games.length,l:"Games",col:C.coral},{v:wins,l:"Wins 🏆",col:C.green},{v:a("pts"),l:"Avg Points",col:C.gold},{v:games.length?Math.round(wins/games.length*100)+"%":"—",l:"Win %",col:C.teal}].map(({v,l,col})=><SBox key={l} value={v} label={l} color={col}/>) }
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:7}}>
          {[{v:a("ast"),l:"Avg Assists",col:C.purple},{v:a("reb"),l:"Avg Rebounds",col:C.teal},{v:a("stl"),l:"Avg Steals",col:C.blue},{v:a("fouls"),l:"Avg Fouls",col:C.orange}].map(({v,l,col})=><SBox key={l} value={v} label={l} color={col}/>) }
        </div>
        {(ftA>0||fgA>0)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12}}>
          {fgA>0&&<SBox value={Math.round(fgM/fgA*100)+"%"} label={`Shots (${fgM}/${fgA})`} color={fgM/fgA>=.45?C.green:C.teal}/>}
          {ftA>0&&<SBox value={Math.round(ftM/ftA*100)+"%"} label={`Free Throws (${ftM}/${ftA})`} color={ftM/ftA>=.7?C.green:C.gold}/>}
        </div>}
        <div style={cs}>
          <CH e={editGameId?"✏️":"➕"} title={editGameId?"Edit Saved Game":"Log a Game"} sub={editGameId?"Fix the stats, then save changes":"Use straightforward stat names so it is easy to enter correctly"}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>RESULT</div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {["Win","Loss"].map(r=><button key={r} onClick={()=>setGf(p=>({...p,result:r}))} style={{flex:1,padding:14,borderRadius:16,border:`2px solid ${gf.result===r?(r==="Win"?C.green:C.red):C.border}`,background:gf.result===r?(r==="Win"?`${C.green}20`:`${C.red}18`):"rgba(255,255,255,.04)",color:gf.result===r?(r==="Win"?C.green:C.red):C.muted,fontWeight:950,cursor:"pointer",fontSize:16,fontFamily:"system-ui"}}>{r==="Win"?"🏆 Win":"💪 Loss"}</button>)}
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:900,marginBottom:8}}>PLAYER STATS</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
            {[ ["Points","pts"], ["Assists","ast"], ["Rebounds","reb"] ].map(([l,k])=>numInput(l,k,true))}
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:900,marginBottom:8}}>SHOOTING</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            {[ ["Shots Made","fgm"], ["Shots Attempted","fga"], ["Free Throws Made","ftm"], ["Free Throws Attempted","fta"] ].map(([l,k])=>numInput(l,k,false))}
          </div>
          {(ftPctNow!==null||fgPctNow!==null)&&<div style={{display:"flex",gap:8,marginBottom:12}}>
            {fgPctNow!==null&&<div style={{flex:1,padding:"8px 10px",borderRadius:12,background:`${fgPctNow>=45?C.green:C.gold}14`,border:`1px solid ${fgPctNow>=45?C.green:C.gold}44`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:950,color:fgPctNow>=45?C.green:C.gold}}>{fgPctNow}%</div><div style={{fontSize:9,color:C.muted}}>Shot %</div></div>}
            {ftPctNow!==null&&<div style={{flex:1,padding:"8px 10px",borderRadius:12,background:`${ftPctNow>=70?C.green:C.orange}14`,border:`1px solid ${ftPctNow>=70?C.green:C.orange}44`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:950,color:ftPctNow>=70?C.green:C.orange}}>{ftPctNow}%</div><div style={{fontSize:9,color:C.muted}}>Free Throw %</div></div>}
          </div>}
          <div style={{fontSize:11,color:C.muted,fontWeight:900,marginBottom:8}}>DEFENSE / MISTAKES</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:7,marginBottom:14}}>
            {[ ["Steals","stl"], ["Blocks","blk"], ["Turnovers","tov"], ["Fouls","fouls"] ].map(([l,k])=>numInput(l,k,false))}
          </div>
          <input value={gf.opp} onChange={e=>setGf(p=>({...p,opp:e.target.value}))} placeholder="Opponent (optional)" style={{...INP,marginBottom:12}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10,marginBottom:14}}>
            {ratingScale("Effort","⚡","effort",gf.effort,C.orange)}
            {ratingScale("Confidence","💜","confidence",gf.confidence,C.blush)}
          </div>
          <div style={{display:"flex",gap:8}}>
            {editGameId&&<button onClick={resetGameForm} style={{flex:1,padding:14,borderRadius:16,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.05)",color:C.light,fontWeight:900,cursor:"pointer",fontSize:14,fontFamily:"system-ui"}}>Cancel</button>}
            <button onClick={logGame} style={{flex:editGameId?2:1,width:"100%",padding:16,borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.pink},${C.blush},${C.teal})`,color:C.darkText,fontWeight:950,cursor:"pointer",fontSize:16,fontFamily:"system-ui",boxShadow:`0 12px 28px ${C.mauve}22`}}>{editGameId?"Save Changes ✅":"Save Game ⭐"}</button>
          </div>
        </div>
        {games.length>0&&<div style={cs}>
          <CH e="📋" title="Game History" sub="Tap Edit if a saved stat needs to be corrected"/>
          {games.slice(0,12).map(g=><div key={g.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:38,height:38,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,background:g.result==="Win"?`${C.green}20`:`${C.red}14`,border:`1px solid ${g.result==="Win"?C.green+"44":C.red+"33"}`,flexShrink:0}}>{g.result==="Win"?"🏆":"💪"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:950,color:C.text,marginBottom:4}}>{g.result||"Game"}{g.opponent?` vs ${g.opponent}`:""}</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:5}}>
                <span style={{fontSize:10,color:C.gold,background:`${C.gold}18`,padding:"2px 7px",borderRadius:6,fontWeight:850}}>Points {g.pts||0}</span>
                <span style={{fontSize:10,color:C.purple,background:`${C.purple}18`,padding:"2px 7px",borderRadius:6,fontWeight:850}}>Assists {g.ast||0}</span>
                <span style={{fontSize:10,color:C.teal,background:`${C.teal}18`,padding:"2px 7px",borderRadius:6,fontWeight:850}}>Rebounds {g.reb||0}</span>
                <span style={{fontSize:10,color:C.blue,background:`${C.blue}18`,padding:"2px 7px",borderRadius:6,fontWeight:850}}>Steals {g.stl||0}</span>
                <span style={{fontSize:10,color:C.orange,background:`${C.orange}18`,padding:"2px 7px",borderRadius:6,fontWeight:850}}>Blocks {g.blk||0}</span>
                <span style={{fontSize:10,color:C.red,background:`${C.red}14`,padding:"2px 7px",borderRadius:6,fontWeight:850}}>Turnovers {g.tov||0}</span>
                <span style={{fontSize:10,color:C.orange,background:`${C.orange}12`,padding:"2px 7px",borderRadius:6,fontWeight:850}}>Fouls {g.fouls||0}</span>
                <span style={{fontSize:10,color:C.light,background:"rgba(255,255,255,.07)",padding:"2px 7px",borderRadius:6,fontWeight:850}}>Shots {g.fgm||0}/{g.fga||0}</span>
                <span style={{fontSize:10,color:C.light,background:"rgba(255,255,255,.07)",padding:"2px 7px",borderRadius:6,fontWeight:850}}>Free Throws {g.ftm||0}/{g.fta||0}</span>
              </div>
              <div style={{fontSize:10,color:C.muted}}>{g.date}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
              <button onClick={()=>startEditGame(g)} style={{padding:"6px 9px",borderRadius:10,border:`1px solid ${C.teal}44`,background:`${C.teal}14`,color:C.teal,fontWeight:900,cursor:"pointer",fontSize:10,fontFamily:"system-ui"}}>Edit</button>
              <button onClick={()=>saveBball(games.filter(x=>x.id!==g.id),skills)} style={{padding:"6px 9px",borderRadius:10,border:`1px solid ${C.red}33`,background:`${C.red}10`,color:C.red,fontWeight:900,cursor:"pointer",fontSize:10,fontFamily:"system-ui"}}>Delete</button>
            </div>
          </div>)}
        </div>}
      </>}

      {section==="practice"&&!isBasketball&&<>
        <div style={cs}>
          <CH e="💪" title={`${sportTemplate.label} Training Types`} sub="Practice options come from the selected sport template."/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {sportTemplate.practiceTypes.map(type=><div key={type} style={{padding:13,borderRadius:16,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.045)"}}>
              <div style={{fontSize:14,fontWeight:950,color:C.text}}>{type}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:4}}>Preview / add later</div>
            </div>)}
          </div>
        </div>
      </>}
      {section==="practice"&&isBasketball&&<>
        <div style={cs}>
          <CH e="➕" title="Log a Practice"/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>TYPE</div>
          <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:14}}>
            {PRACTICE_TYPES.map(t=><Chip key={t} label={t} active={pf.type===t} col={C.purple} onClick={()=>setPf(p=>({...p,type:t}))}/>) }
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>MINUTES</div>
          <input type="number" inputMode="numeric" placeholder="e.g. 60" value={pf.duration} onChange={e=>setPf(p=>({...p,duration:e.target.value}))} style={{...INP,textAlign:"center",fontSize:22,fontWeight:900,marginBottom:14}}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>EFFORT 🔥</div>
          <EmojiPick val={pf.effort} emojis={["😴","🙂","😊","💪","🔥"]} onSet={v=>setPf(p=>({...p,effort:v}))} col={C.purple}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:6,marginTop:14}}>WHAT DID YOU WORK ON? (optional)</div>
          <textarea value={pf.note} onChange={e=>setPf(p=>({...p,note:e.target.value}))} placeholder="Free throws, left-hand layups, defensive slides..." style={{...TXT,minHeight:60,marginBottom:12}}/>
          <button onClick={logPractice} style={{width:"100%",padding:16,borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.pink},${C.blush},${C.teal})`,color:C.darkText,fontWeight:950,cursor:"pointer",fontSize:16,fontFamily:"system-ui",boxShadow:`0 12px 28px ${C.purple}33`}}>Save Practice ⭐</button>
        </div>
        {practices.length>0&&<div style={cs}>
          <CH e="📋" title="Practice History" sub={`${practices.length} sessions`}/>
          {practices.slice(0,8).map(p=><div key={p.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:38,height:38,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,background:`${C.purple}18`,border:`1px solid ${C.purple}33`,flexShrink:0}}>💪</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:900,color:C.text}}>{p.type}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:2}}>{p.date}{p.duration?` · ${p.duration} min`:""}{"⭐".repeat(p.effort||0)}</div>
              {p.note&&<div style={{fontSize:10,color:C.light,marginTop:2,lineHeight:1.4}}>{p.note}</div>}
            </div>
            <button onClick={()=>savePrax(practices.filter(x=>x.id!==p.id))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>×</button>
          </div>)}
        </div>}
      </>}

      {section==="skills"&&!isBasketball&&<>
        <div style={cs}>
          <CH e="📊" title={`${sportTemplate.label} Skill Template`} sub="Skill lists are also sport-specific, so each sport can have its own growth dashboard."/>
          {sportTemplate.skills.map((skill,i)=><div key={skill} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<sportTemplate.skills.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{width:30,height:30,borderRadius:10,background:`${sportTemplate.accent}18`,border:`1px solid ${sportTemplate.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:950,color:sportTemplate.accent}}>{i+1}</div>
            <div style={{flex:1,fontSize:13,fontWeight:900,color:C.text}}>{skill}</div>
            <div style={{fontSize:10,color:C.muted,fontWeight:800}}>future skill</div>
          </div>)}
        </div>
      </>}
      {section==="skills"&&isBasketball&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:12}}>
          <SBox value={Math.round(avgArr(Object.values(skills)))+"%"} label="Overall Rating" color={SKILL_COL(Math.round(avgArr(Object.values(skills))))}/>
          <SBox value={Object.entries(skills).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—"} label="Strongest Skill" color={C.gold}/>
        </div>
        {Object.entries(SKILL_GROUPS).map(([grp,g])=><div key={grp} style={{...cs,borderTop:`3px solid ${g.col}`}}>
          <CH e="📊" title={grp}/>
          {g.items.map(sk=><div key={sk} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:13,fontWeight:800,color:C.text}}>{sk}</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <button onClick={()=>adjSkill(sk,-5)} style={{width:32,height:32,borderRadius:10,border:`1px solid ${C.red}33`,background:`${C.red}12`,color:C.red,fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"system-ui"}}>−</button>
                <span style={{fontSize:14,fontWeight:900,color:SKILL_COL(skills[sk]||0),minWidth:36,textAlign:"center"}}>{skills[sk]||0}%</span>
                <button onClick={()=>adjSkill(sk,5)} style={{width:32,height:32,borderRadius:10,border:`1px solid ${C.gold}44`,background:`${C.gold}14`,color:C.gold,fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"system-ui"}}>+</button>
              </div>
            </div>
            <div style={{height:9,background:"rgba(0,0,0,.4)",borderRadius:100,overflow:"hidden"}}><div style={{height:"100%",background:`linear-gradient(90deg,${SKILL_COL(skills[sk]||0)},${g.col})`,borderRadius:100,width:`${skills[sk]||0}%`,transition:"width .4s ease"}}/></div>
          </div>)}
        </div>)}
      </>}

      <div style={cs}>
        <CH e="🔮" title="Future Sport Profiles" sub="Optional sport templates for later. Keep basketball focused now, then add a new sport when it actually becomes part of her routine."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {FUTURE_SPORT_IDS.map(id=>{const sport=SPORT_TEMPLATES[id];const selected=selectedSportId===sport.id;return <button key={sport.id} onClick={()=>{setSelectedSportId(sport.id);setSection("game");}} style={{padding:"12px 7px",borderRadius:18,border:`1px solid ${selected?sport.accent:C.border}`,background:selected?`${sport.accent}20`:"rgba(255,255,255,.04)",color:selected?C.cream:C.muted,cursor:"pointer",fontFamily:"system-ui"}}>
            <div style={{fontSize:24,marginBottom:5}}>{sport.icon}</div>
            <div style={{fontSize:10,fontWeight:950,lineHeight:1.15,minHeight:24,display:"flex",alignItems:"center",justifyContent:"center"}}>{sport.label}</div>
            <div style={{fontSize:8,color:selected?sport.accent:C.muted,fontWeight:850,marginTop:5}}>{sport.id==="custom"?"Create Later":"Preview / Add Later"}</div>
          </button>;})}
        </div>
      </div>
    </div>;
  };

  // ── MY GLOW ────────────────────────────────────────────────────────────
  const MyGlow=()=>{
    const[section,setSection]=useState("routine");
    const[editRoutine,setEditRoutine]=useState(null);
    const[routineForm,setRoutineForm]=useState({e:"✨",label:"",id:""});
    const todayRoutine=routineHist[todayISO()]||{c:{}};
    const checked=todayRoutine.c||{};
    const rDone=routineItems.filter(i=>checked[i.id]).length;
    const rTotal=routineItems.length||1;
    const rPct=Math.round(rDone/rTotal*100);
    const toggleR=async id=>{
      const nc={...checked,[id]:!checked[id]};
      const ne={...routineHist,[todayISO()]:{...todayRoutine,c:nc}};
      await saveRoutine(ne,routineItems);
      if(!checked[id])await addStars(1);
    };
    const saveRoutineItem=async()=>{
      if(!routineForm.label.trim())return;
      const item={id:routineForm.id||uid(),e:routineForm.e||"✨",label:routineForm.label.trim()};
      const items=routineForm.id?routineItems.map(x=>x.id===routineForm.id?item:x):[...routineItems,item];
      await saveRoutine(routineHist,items);
      setRoutineForm({e:"✨",label:"",id:""});
      setEditRoutine(null);
    };
    const editRoutineItem=item=>{setEditRoutine(item.id);setRoutineForm({id:item.id,e:item.e||"✨",label:item.label||""});};
    const deleteRoutineItem=async id=>{
      const items=routineItems.filter(x=>x.id!==id);
      const cleaned=Object.fromEntries(Object.entries(routineHist||{}).map(([day,entry])=>{
        const c={...(entry.c||{})};delete c[id];return[day,{...entry,c}];
      }));
      await saveRoutine(cleaned,items);
    };
    const resetRoutineDefaults=async()=>await saveRoutine(routineHist,clone(ROUTINE_ITEMS));

    const[sf,setSf]=useState({bed:"21:00",wake:"06:30",quality:0});
    const calcH=(b,w)=>{try{const[bh,bm]=b.split(":").map(Number),[wh,wm]=w.split(":").map(Number);let m=(wh*60+wm)-(bh*60+bm);if(m<0)m+=1440;return Math.round(m/60*10)/10;}catch{return 0;}};
    const hoursNow=calcH(sf.bed,sf.wake);
    const addSleep=async()=>{if(!sf.quality)return;const entry={id:uid(),date:toShort(todayISO()),dateISO:todayISO(),bedtime:sf.bed,waketime:sf.wake,hours:hoursNow,quality:sf.quality};await saveSleep([entry,...sleepEntries].slice(0,90));await addStars(hoursNow>=9?3:2);setSf({bed:"21:00",wake:"06:30",quality:0});};

    const STYLE_MOODS=[
      {id:"sporty",e:"🏀",label:"Sporty"},
      {id:"street",e:"👟",label:"Streetwear"},
      {id:"clean",e:"✨",label:"Clean Girl"},
      {id:"cozy",e:"🧸",label:"Cozy"},
      {id:"school",e:"📚",label:"School Fit"},
      {id:"game",e:"🔥",label:"Game Day"}
    ];
    const OUTFIT_IDEAS=["Matching set","Hoodie + leggings","Jersey fit","Cargo pants","Graphic tee","Sweats"];
    const ACCESSORY_IDEAS=["Headband","Bracelets","Backpack charm","Hoop earrings","Hair bow","Tumbler charm"];
    const TREND_IDEAS=["Pink accents","Clean ponytail","Glossy lip balm","Fresh sneakers","Soft glam","Sporty layers"];
    const[stf,setStf]=useState({type:"Game Day",outfit:"",hair:"",shoes:"",accessories:"",trend:"",styleMood:"",vibe:0,notes:""});
    const logFit=async()=>{
      if(!stf.outfit&&!stf.hair&&!stf.shoes&&!stf.accessories&&!stf.trend&&!stf.notes)return;
      const entry={id:uid(),date:toShort(todayISO()),dateISO:todayISO(),...stf};
      await saveStyle([entry,...styleLog].slice(0,40),shoeWish);
      await addStars(3);
      setStf({type:"Game Day",outfit:"",hair:"",shoes:"",accessories:"",trend:"",styleMood:"",vibe:0,notes:""});
    };
    const avgSleep=sleepEntries.length?avgArr(sleepEntries.slice(0,7).map(e=>e.hours)).toFixed(1):"—";

    return<div>
      <TabHero
        eyebrow="My Glow"
        title="Routine, rest, and confidence."
        sub="A calmer place to manage nightly routine, sleep, and style without making it feel like a worksheet."
        icon="✨"
        stats={[
          {value:rPct+"%",label:"routine",color:C.mauve,onClick:()=>setSection("routine")},
          {value:avgSleep,label:"sleep",color:C.gold,onClick:()=>setSection("sleep")},
          {value:styleLog.length,label:"fits",color:C.teal,onClick:()=>setSection("style")}
        ]}
      />
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",padding:5,borderRadius:18,background:"rgba(255,255,255,.045)",border:"1px solid rgba(255,255,255,.10)"}}>
        {[["routine","✨ Routine"],["sleep","🌙 Sleep"],["style","💅 Style"]].map(([id,label])=>(
          <button key={id} onClick={()=>setSection(id)} style={{flexShrink:0,padding:"10px 14px",borderRadius:12,border:`1px solid ${section===id?C.blush:C.border}`,background:section===id?`${C.blush}22`:"rgba(255,255,255,.05)",color:section===id?C.light:C.muted,fontWeight:900,cursor:"pointer",fontSize:13,fontFamily:"system-ui"}}>{label}</button>
        ))}
        <button onClick={()=>setTab("wishlist")} style={{flexShrink:0,padding:"10px 14px",borderRadius:12,border:`1px solid ${C.gold}44`,background:`${C.gold}12`,color:C.gold,fontWeight:900,cursor:"pointer",fontSize:13,fontFamily:"system-ui"}}>🛍️ Wishlist</button>
      </div>

      {section==="routine"&&<>
        <div style={{...cs,background:"radial-gradient(ellipse at 82% 6%,rgba(217,160,186,.10),transparent 42%),linear-gradient(145deg,rgba(34,32,35,.96),rgba(17,16,19,.99))"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <CH e="✨" title={`Glow Routine (${rDone}/${routineItems.length})`} sub="Tap items to complete. Edit the routine any time."/>
            <div style={{fontSize:14,fontWeight:950,color:rPct>=100?C.green:C.gold}}>{rPct}%</div>
          </div>
          <div style={{height:10,background:"rgba(0,0,0,.35)",borderRadius:99,overflow:"hidden",marginBottom:14}}><div style={{height:"100%",width:`${rPct}%`,background:rPct>=100?C.green:glamGrad,borderRadius:99,transition:"width .3s",boxShadow:`0 0 16px ${rPct>=100?C.green:C.blush}55`}}/></div>
          {routineItems.length===0&&<div style={{textAlign:"center",padding:"24px 12px",color:C.muted}}><div style={{fontSize:34,marginBottom:8}}>✨</div><div style={{fontSize:13}}>No routine items yet. Add one below.</div></div>}
          {routineItems.map(item=>{const ok=!!checked[item.id];return<div key={item.id} style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"center",marginBottom:7}}>
            <button onClick={()=>toggleR(item.id)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 10px",borderRadius:14,cursor:"pointer",background:ok?`${C.green}14`:"rgba(255,255,255,.04)",border:`1px solid ${ok?C.green+"44":C.border}`,fontFamily:"system-ui",textAlign:"left"}}>
              <div style={{width:38,height:38,borderRadius:13,background:ok?`linear-gradient(135deg,${C.green},${C.teal})`:"rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:ok?14:20,color:C.white,boxShadow:ok?`0 0 14px ${C.green}44`:"none",flexShrink:0}}>{ok?"✓":item.e}</div>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:900,color:ok?C.green:C.text,textDecoration:ok?"line-through":"none"}}>{item.label}</div><div style={{fontSize:9,color:C.muted,marginTop:2}}>{ok?"Done today":"Tap when complete"}</div></div>
            </button>
            <div style={{display:"flex",gap:5}}>
              <button onClick={()=>editRoutineItem(item)} style={{width:34,height:34,borderRadius:10,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.05)",color:C.light,cursor:"pointer",fontFamily:"system-ui"}}>✎</button>
              <button onClick={()=>deleteRoutineItem(item.id)} style={{width:34,height:34,borderRadius:10,border:`1px solid ${C.red}44`,background:`${C.red}10`,color:C.red,cursor:"pointer",fontFamily:"system-ui"}}>×</button>
            </div>
          </div>;})}
        </div>

        <div style={cs}>
          <CH e="🛠️" title={editRoutine?"Edit Routine Item":"Add Routine Item"} sub="Parents can keep the routine current without rebuilding the app."/>
          <div style={{display:"grid",gridTemplateColumns:"70px 1fr",gap:8,marginBottom:10}}>
            <input value={routineForm.e} onChange={e=>setRoutineForm(p=>({...p,e:e.target.value}))} placeholder="✨" style={{...INP,textAlign:"center"}}/>
            <input value={routineForm.label} onChange={e=>setRoutineForm(p=>({...p,label:e.target.value}))} placeholder="Example: Pack basketball bag" style={INP}/>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={saveRoutineItem} style={{flex:1,minWidth:150,padding:12,borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.pink},${C.teal},${C.gold})`,color:C.white,fontWeight:950,cursor:"pointer",fontFamily:"system-ui"}}>{editRoutine?"Save Changes":"Add Item"}</button>
            {(editRoutine||routineForm.label)&&<button onClick={()=>{setEditRoutine(null);setRoutineForm({e:"✨",label:"",id:""});}} style={{padding:"12px 14px",borderRadius:12,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.04)",color:C.muted,fontWeight:900,cursor:"pointer",fontFamily:"system-ui"}}>Cancel</button>}
          </div>
          <button onClick={resetRoutineDefaults} style={{width:"100%",marginTop:10,padding:10,borderRadius:12,border:`1px solid ${C.gold}44`,background:`${C.gold}10`,color:C.gold,fontWeight:900,cursor:"pointer",fontFamily:"system-ui"}}>Reset to Starter Routine</button>
        </div>
      </>}

      {section==="sleep"&&<>
        <div style={cs}>
          <CH e="🌙" title="Sleep Studio" sub="Recovery helps mood, focus, and basketball."/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            <SBox value={avgSleep} label="Avg Hours" color={C.mauve}/>
            <SBox value={sleepEntries.length} label="Nights" color={C.teal}/>
            <SBox value={sleepEntries[0]?.quality||"—"} label="Last Quality" color={C.gold}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <input type="time" value={sf.bed} onChange={e=>setSf(p=>({...p,bed:e.target.value}))} style={INP}/>
            <input type="time" value={sf.wake} onChange={e=>setSf(p=>({...p,wake:e.target.value}))} style={INP}/>
          </div>
          <div style={{textAlign:"center",padding:12,borderRadius:14,background:`${C.mauve}10`,border:`1px solid ${C.mauve}33`,marginBottom:12}}><div style={{fontSize:22,fontWeight:950,color:C.mauve}}>{hoursNow} hours</div><div style={{fontSize:10,color:C.muted}}>planned sleep</div></div>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>QUALITY</div>
          <EmojiPick val={sf.quality} emojis={["😴","🙂","😊","😎","👑"]} onSet={v=>setSf(p=>({...p,quality:v}))} col={C.mauve}/>
          <button onClick={addSleep} style={{width:"100%",marginTop:14,padding:14,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.pink},${C.blush},${C.teal})`,color:C.darkText,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:14}}>Save Sleep 🌙</button>
        </div>
        {sleepEntries.length>0&&<div style={cs}>
          <CH e="📊" title="Sleep Trend"/>
          <div style={{display:"flex",alignItems:"flex-end",gap:5,height:60,marginBottom:10}}>
            {[...sleepEntries.slice(0,7)].reverse().map((e,i)=>{const h=Math.max(6,Math.round((e.hours/10)*52));const col=e.hours>=9?C.green:e.hours>=8?C.teal:e.hours>=7?C.gold:C.orange;return<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><div style={{fontSize:8,color:col,fontWeight:800}}>{e.hours}h</div><div style={{width:"100%",height:h,background:col,borderRadius:"5px 5px 2px 2px",opacity:.85}}/><div style={{fontSize:7,color:C.muted}}>{(e.date||"").replace(/,.*/,"")}</div></div>;})}
          </div>
        </div>}
      </>}

      {section==="style"&&<>
        <div style={{...cs,background:"linear-gradient(145deg,rgba(34,32,35,.96),rgba(17,16,19,.99))"}}>
          <CH e="💅" title="Style Studio" sub="Modern, simple, confidence-building — not too busy."/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
            <SBox value={styleLog.length} label="Fits" color={C.blush}/>
            <SBox value={styleLog.filter(f=>(f.vibe||0)>=4).length} label="High Vibe" color={C.gold}/>
            <SBox value={shoeWish.length} label="Wishlist" color={C.teal}/>
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:900,marginBottom:7}}>STYLE MODE</div>
          <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:12}}>
            {STYLE_MOODS.map(m=><Chip key={m.id} label={`${m.e} ${m.label}`} active={stf.styleMood===m.id} col={C.blush} onClick={()=>setStf(p=>({...p,styleMood:p.styleMood===m.id?"":m.id}))}/>)}
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:900,marginBottom:7}}>FIT TYPE</div>
          <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:12}}>
            {STYLE_TYPES.map(t=><Chip key={t} label={t} active={stf.type===t} col={C.blush} onClick={()=>setStf(p=>({...p,type:t}))}/>)}
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:900,marginBottom:7}}>OUTFIT IDEAS</div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:8}}>
            {OUTFIT_IDEAS.map(x=><Chip key={x} label={x} active={stf.outfit===x} col={C.gold} onClick={()=>setStf(p=>({...p,outfit:p.outfit===x?"":x}))}/>)}
          </div>
          <input value={stf.outfit} onChange={e=>setStf(p=>({...p,outfit:e.target.value}))} placeholder="Type outfit details..." style={{...INP,marginBottom:12}}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:900,marginBottom:7}}>HAIR</div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:8}}>
            {HAIR_IDEAS.map(h=><Chip key={h} label={h} active={stf.hair===h} col={C.mauve} onClick={()=>setStf(p=>({...p,hair:p.hair===h?"":h}))}/>)}
          </div>
          <input value={stf.hair} onChange={e=>setStf(p=>({...p,hair:e.target.value}))} placeholder="Or type hair style..." style={{...INP,marginBottom:12}}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:900,marginBottom:7}}>ACCESSORIES</div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:8}}>
            {ACCESSORY_IDEAS.map(a=><Chip key={a} label={a} active={stf.accessories===a} col={C.teal} onClick={()=>setStf(p=>({...p,accessories:p.accessories===a?"":a}))}/>)}
          </div>
          <input value={stf.accessories} onChange={e=>setStf(p=>({...p,accessories:e.target.value}))} placeholder="Accessories, bag, jewelry, charms..." style={{...INP,marginBottom:12}}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:900,marginBottom:7}}>TREND INSPO</div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:8}}>
            {TREND_IDEAS.map(t=><Chip key={t} label={t} active={stf.trend===t} col={C.blue} onClick={()=>setStf(p=>({...p,trend:p.trend===t?"":t}))}/>)}
          </div>
          <input value={stf.trend} onChange={e=>setStf(p=>({...p,trend:e.target.value}))} placeholder="Trend, color, or vibe..." style={{...INP,marginBottom:12}}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:900,marginBottom:8}}>CONFIDENCE VIBE</div>
          <EmojiPick val={stf.vibe} emojis={["😐","🙂","😊","😍","💅"]} onSet={v=>setStf(p=>({...p,vibe:v}))} col={C.blush}/>
          <textarea value={stf.notes} onChange={e=>setStf(p=>({...p,notes:e.target.value}))} placeholder="Optional notes: what felt good, what to try next..." style={{...TXT,marginTop:12,marginBottom:12}}/>
          <button onClick={logFit} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.pink},${C.teal},${C.gold})`,color:C.white,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:14}}>Save Style Log 💅</button>
          <button onClick={()=>setTab("wishlist")} style={{width:"100%",marginTop:8,padding:12,borderRadius:14,border:`1px solid ${C.gold}44`,background:`${C.gold}10`,color:C.gold,fontWeight:900,cursor:"pointer",fontFamily:"system-ui",fontSize:13}}>Open Wishlist for shoes, clothes, beauty, and toys 🛍️</button>
        </div>
        {styleLog.length>0&&<div style={cs}>
          <CH e="📸" title="Style History"/>
          {styleLog.slice(0,8).map(f=>{const mode=STYLE_MOODS.find(m=>m.id===f.styleMood);return<div key={f.id} style={{padding:"11px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:10}}>
              <div style={{minWidth:0}}>
                <div style={{fontSize:12,fontWeight:950,color:C.blush,marginBottom:4}}>{mode?`${mode.e} ${mode.label} · `:""}{f.type} · {f.date}</div>
                {f.outfit&&<div style={{fontSize:12,color:C.text,marginBottom:2}}>👚 {f.outfit}</div>}
                {f.hair&&<div style={{fontSize:11,color:C.muted}}>💇‍♀️ {f.hair}</div>}
                {f.accessories&&<div style={{fontSize:11,color:C.teal,marginTop:2}}>✨ {f.accessories}</div>}
                {f.trend&&<div style={{fontSize:11,color:C.blue,marginTop:2}}>🔥 {f.trend}</div>}
                {f.shoes&&<div style={{fontSize:11,color:C.gold,marginTop:2}}>👟 {f.shoes}</div>}
                {f.vibe>0&&<div style={{fontSize:10,color:C.blush,marginTop:3}}>Vibe: {"⭐".repeat(f.vibe)}</div>}
                {f.notes&&<div style={{fontSize:10,color:C.muted,marginTop:3,lineHeight:1.4}}>{f.notes}</div>}
              </div>
              <button onClick={()=>saveStyle(styleLog.filter(x=>x.id!==f.id),shoeWish)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18,padding:4}}>×</button>
            </div>
          </div>;})}
        </div>}
      </>}

    </div>;
  };


  // ── WISHLIST ────────────────────────────────────────────────────────────
  const Wishlist=()=>{
    const [wf,setWf]=useState({name:"",category:"auto",why:"",priority:"Dream 🌟",goalId:""});
    const [filter,setFilter]=useState("all");

    const cleanGoals=safeObjects(goals);
    const cleanClaims=safeObjects(rewardClaims);
    const cleanWish=safeObjects(shoeWish).map((raw,i)=>{
      const name=String(raw.name||raw.title||raw.search||"Wishlist item");
      const category=(typeof raw.category==="string"&&raw.category)?raw.category:detectWishCategory(name);
      return {
        id:raw.id||`wish_${i}_${name.replace(/\s+/g,"_")}`,
        name,
        category,
        why:String(raw.why||""),
        priority:String(raw.priority||"Dream 🌟"),
        search:String(raw.search||name),
        goalId:String(raw.goalId||""),
        img:String(raw.img||""),
        cost:raw.cost||undefined,
        storeList:Array.isArray(raw.storeList)?raw.storeList:undefined,
        ...raw,
        name,
        category
      };
    });

    const rewardRotation=getRewardRotationInfo(DAILY_REWARD_COUNT);
    const dailyRewardIdeas=getDailyRewardIdeas(DAILY_REWARD_COUNT);

    const cleanCat=id=>{
      const cats=safeObjects(WISH_CATEGORIES);
      return cats.find(c=>c.id===id)||cats.find(c=>c.id==="other")||{id:"other",label:"Other",icon:"🌟",col:"gold"};
    };
    const storesFor=item=>{
      const cat=typeof item?.category==="string"?item.category:"other";
      const stores=Array.isArray(item?.storeList)&&item.storeList.length?item.storeList:WISH_STORES[cat]||WISH_STORES.other||["google","amazon","target"];
      return stores.filter(Boolean).slice(0,4);
    };
    const itemCost=item=>{
      if(item?.cost)return item.cost;
      const p=String(item?.priority||"").toLowerCase();
      return p.includes("dream")?3:p.includes("next")?2:1;
    };
    const linkedGoal=item=>cleanGoals.find(g=>g.id===item.goalId);
    const isUnlocked=item=>{
      const g=linkedGoal(item);
      if(item.goalId)return !!(g&&g.parentApproved);
      return rewardTokens>=itemCost(item);
    };
    const currentCategory=wf.category==="auto"?detectWishCategory(wf.name):wf.category;
    const shown=filter==="all"?cleanWish:cleanWish.filter(x=>x.category===filter);

    const addWish=async()=>{
      const name=wf.name.trim();
      if(!name)return;
      const category=wf.category==="auto"?detectWishCategory(name):wf.category;
      const stores=WISH_STORES[category]||WISH_STORES.other||["google","amazon","target"];
      const item={
        id:uid(),
        name,
        category,
        why:wf.why.trim(),
        priority:wf.priority,
        search:name,
        goalId:wf.goalId||"",
        cost:wf.priority.includes("Dream")?3:wf.priority.includes("Next")?2:1,
        storeList:stores
      };
      stores.forEach(shop=>{item[`${shop}Url`]=shopUrl(shop,name);});
      await saveStyle(styleLog,[item,...cleanWish].slice(0,60));
      await addStars(1);
      setWf({name:"",category:"auto",why:"",priority:"Dream 🌟",goalId:""});
    };

    const addStarter=async item=>{
      const category=item.category||detectWishCategory(item.name);
      const stores=WISH_STORES[category]||WISH_STORES.other||["google","amazon","target"];
      const next={id:uid(),priority:"Dream 🌟",goalId:"",cost:3,storeList:stores,...item,category,search:item.search||item.name};
      stores.forEach(shop=>{next[`${shop}Url`]=next[`${shop}Url`]||shopUrl(shop,next.search||next.name);});
      await saveStyle(styleLog,[next,...cleanWish].slice(0,60));
      await addStars(1);
    };

    const requestItem=async item=>{
      const existing=cleanClaims.find(r=>r.itemId===item.id&&r.status!=="rejected");
      if(existing||!isUnlocked(item))return;
      const g=linkedGoal(item);
      const claim={id:uid(),itemId:item.id,itemName:item.name,goalId:item.goalId||"",goalCode:g?goalCodeFor(cleanGoals,g):"",cost:item.goalId?0:itemCost(item),status:"requested",date:toShort(todayISO())};
      await saveRewards([claim,...cleanClaims]);
    };

    const removeItem=async item=>{
      await saveStyle(styleLog,cleanWish.filter(x=>x.id!==item.id));
    };

    const relinkItem=async(item,goalId)=>{
      const updated=cleanWish.map(x=>x.id===item.id?{...x,goalId}:x);
      await saveStyle(styleLog,updated);
    };

    return <div>
      <TabHero
        eyebrow="Reward Wishlist"
        title="Pick the reward. Earn it with a goal."
        sub="Sneakers, clothes, beauty, toys, school items, and future rewards — connected to parent-approved follow-through."
        icon="🛍️"
        stats={[
          {value:cleanWish.length,label:"saved",color:C.mauve},
          {value:rewardTokens,label:"tokens",color:C.gold},
          {value:cleanClaims.filter(x=>x.status==="requested").length,label:"requests",color:C.teal}
        ]}
      />
      <GlamHero style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:11,color:C.gold,fontWeight:950,letterSpacing:"1.8px",textTransform:"uppercase",marginBottom:6}}>Reward Wishlist</div>
            <div style={{fontSize:28,fontWeight:950,lineHeight:1.06,color:C.text}}>Pick the reward. Earn it with a goal.</div>
            <div style={{fontSize:11,color:C.light,lineHeight:1.6,marginTop:6}}>Sneakers, clothes, beauty, toys, school items, and future rewards — connected to parent-approved follow-through.</div>
          </div>
          <div style={{minWidth:88,textAlign:"center",padding:"10px 12px",borderRadius:20,background:`${C.gold}18`,border:`1px solid ${C.gold}44`}}>
            <div style={{fontSize:30,fontWeight:950,color:C.gold,lineHeight:1}}>{cleanWish.length}</div>
            <div style={{fontSize:9,fontWeight:900,color:C.light,letterSpacing:"1px"}}>SAVED</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          <SBox value={rewardTokens} label="Tokens" color={C.gold} sub="approved goals"/>
          <SBox value={cleanWish.filter(x=>x.category==="sneakers").length} label="Sneakers" color={C.teal}/>
          <SBox value={cleanClaims.filter(x=>x.status==="requested").length} label="Requests" color={C.pink}/>
        </div>
      </GlamHero>

      <div style={cs}>
        <CH e="🛍️" title="Add a Reward" sub="Type what she wants. The app creates shopping links."/>
        <input value={wf.name} onChange={e=>setWf(p=>({...p,name:e.target.value}))} placeholder="Example: Sabrina 3 pink shoes, Nike hoodie, lip balm set..." style={{...INP,marginBottom:10}}/>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:10}}>
          {safeObjects(WISH_CATEGORIES).map(c=><Chip key={c.id} label={`${c.icon} ${c.label}`} active={wf.category===c.id} col={C[c.col]||C.pink} onClick={()=>setWf(p=>({...p,category:c.id}))}/>)}
        </div>
        <select value={wf.goalId} onChange={e=>setWf(p=>({...p,goalId:e.target.value}))} style={{...INP,marginBottom:10,appearance:"none"}}>
          <option value="">Link to a goal later</option>
          {cleanGoals.map(g=><option key={g.id} value={g.id}>{goalCodeFor(cleanGoals,g)} — {String(g.text||"").slice(0,58)}</option>)}
        </select>
        <input value={wf.why} onChange={e=>setWf(p=>({...p,why:e.target.value}))} placeholder="Why does this reward motivate the goal?" style={{...INP,marginBottom:10}}/>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:12}}>
          {safeArray(SHOE_PRIORITY).map(p=><Chip key={p} label={p} active={wf.priority===p} col={C.gold} onClick={()=>setWf(x=>({...x,priority:p}))}/>)}
        </div>
        {wf.name&&<div style={{background:`${C.teal}10`,border:`1px solid ${C.teal}33`,borderRadius:14,padding:10,marginBottom:12}}>
          <div style={{fontSize:11,color:C.teal,fontWeight:900,marginBottom:4}}>Auto category: {cleanCat(currentCategory).icon} {cleanCat(currentCategory).label}</div>
          <div style={{fontSize:10,color:C.muted,lineHeight:1.5}}>Store links: {(WISH_STORES[currentCategory]||WISH_STORES.other||[]).map(s=>s.toUpperCase()).join(" · ")}</div>
        </div>}
        <button onClick={addWish} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.bg,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:14}}>Add to Wishlist ⭐</button>
      </div>

      <div style={cs}>
        <CH e="🔥" title="Daily Reward Ideas" sub={`New set today · sneakers · beauty · teen clothing · viral toys`}/>
        <div style={{fontSize:10,color:C.muted,lineHeight:1.5,marginBottom:10}}>
          Today’s ideas rotate through the fun reward categories she actually cares about: sneakers, beauty/self-care, trendy teen clothing, and viral toys.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10}}>
          {safeObjects(dailyRewardIdeas).map(item=>{const cat=cleanCat(item.category);return <div key={item.id} style={{display:"grid",gridTemplateColumns:"86px 1fr",gap:11,padding:11,borderRadius:18,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.045)"}}>
            <div style={{width:86,height:86,borderRadius:18,overflow:"hidden",background:`${C[cat.col]||C.pink}18`,border:`1px solid ${(C[cat.col]||C.pink)}44`,position:"relative"}}>
              {item.img?<img src={item.img} alt={item.name} loading="lazy" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display="none";const fb=e.currentTarget.parentElement?.querySelector("[data-img-fallback]");if(fb)fb.style.display="flex";}} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>:null}
              <div data-img-fallback style={{display:item.img?"none":"flex",position:"absolute",inset:0,alignItems:"center",justifyContent:"center",fontSize:26,color:C.white}}>{cat.icon}</div>
            </div>
            <div style={{minWidth:0}}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
                <span style={{fontSize:15}}>{cat.icon}</span>
                <span style={{fontSize:10,color:C.gold,fontWeight:950}}>{cat.label}</span>
                <span style={{fontSize:9,color:C.muted}}>daily idea</span>
              </div>
              <div style={{fontSize:13,fontWeight:950,color:C.white,lineHeight:1.25}}>{item.name}</div>
              <div style={{fontSize:10,color:C.muted,lineHeight:1.35,marginTop:3}}>{item.why}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                <button onClick={()=>addStarter(item)} style={{padding:"8px 10px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.bg,fontWeight:950,cursor:"pointer",fontSize:10,fontFamily:"system-ui"}}>Add</button>
                {(item.storeList||WISH_STORES[item.category]||WISH_STORES.other||[]).slice(0,2).map(shop=><button key={shop} onClick={()=>openShop(shop,item.search||item.name)} style={{padding:"8px 10px",borderRadius:10,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.05)",color:C.light,fontWeight:900,cursor:"pointer",fontSize:10,fontFamily:"system-ui"}}>{shop.toUpperCase()}</button>)}
              </div>
            </div>
          </div>;})}
        </div>
      </div>

      <div style={cs}>
        <CH e="🌟" title="Saved Wishlist" sub="Link rewards to exact goals and open shopping links."/>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:10}}>
          {[{id:"all",label:"All",icon:"🛍️"},...safeObjects(WISH_CATEGORIES).filter(c=>c.id!=="auto")].map(c=><Chip key={c.id} label={`${c.icon} ${c.label}`} active={filter===c.id} col={C.pink} onClick={()=>setFilter(c.id)}/>)}
        </div>
        {shown.length?shown.map(item=>{const cat=cleanCat(item.category);const g=linkedGoal(item);const claim=cleanClaims.find(r=>r.itemId===item.id&&r.status!=="rejected");const unlocked=isUnlocked(item);return <div key={item.id} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"grid",gridTemplateColumns:"64px 1fr",gap:10}}>
            <div style={{width:64,height:64,borderRadius:16,overflow:"hidden",background:`${C[cat.col]||C.pink}18`,border:`1px solid ${(C[cat.col]||C.pink)}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:23,position:"relative"}}>
              {item.img?<img src={item.img} alt={item.name} loading="lazy" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display="none";const fb=e.currentTarget.parentElement?.querySelector("[data-saved-fallback]");if(fb)fb.style.display="flex";}} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>:null}
              <div data-saved-fallback style={{display:item.img?"none":"flex",position:"absolute",inset:0,alignItems:"center",justifyContent:"center"}}>{cat.icon}</div>
            </div>
            <div style={{minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:950,color:C.white,lineHeight:1.25}}>{item.name}</div>
                  <div style={{fontSize:10,color:C.gold,marginTop:2}}>{cat.label} · {item.priority} · {item.goalId?(g?`Linked to ${goalCodeFor(cleanGoals,g)}`:"Missing goal"):`${itemCost(item)} token${itemCost(item)===1?"":"s"}`}</div>
                </div>
                <button onClick={()=>removeItem(item)} aria-label={`Remove ${item.name}`} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>×</button>
              </div>
              {item.why&&<div style={{fontSize:10,color:C.muted,marginTop:4,lineHeight:1.4}}>{item.why}</div>}
              {item.goalId&&<div style={{fontSize:10,color:unlocked?C.green:C.orange,marginTop:4,lineHeight:1.4}}>{unlocked?"Goal approved — reward can be requested ✅":g?`Waiting for ${goalCodeFor(cleanGoals,g)} to be completed and parent-approved.`:"Linked goal was not found."}</div>}
              <select value={item.goalId||""} onChange={e=>relinkItem(item,e.target.value)} style={{...INP,marginTop:8,appearance:"none"}}>
                <option value="">Link this reward to a goal</option>
                {cleanGoals.map(g=><option key={g.id} value={g.id}>{goalCodeFor(cleanGoals,g)} — {String(g.text||"").slice(0,58)}</option>)}
              </select>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                {storesFor(item).map(shop=><button key={shop} onClick={()=>openRewardShop(shop,item)} style={{padding:"7px 9px",borderRadius:10,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.05)",color:C.light,fontWeight:900,cursor:"pointer",fontSize:10,fontFamily:"system-ui"}}>{shop.toUpperCase()}</button>)}
                <button disabled={!!claim||!unlocked} onClick={()=>requestItem(item)} style={{padding:"7px 9px",borderRadius:10,border:`1px solid ${C.gold}44`,background:claim?`${C.green}12`:unlocked?`${C.gold}18`:"rgba(255,255,255,.04)",color:claim?C.green:unlocked?C.gold:C.muted,fontWeight:900,cursor:claim||!unlocked?"not-allowed":"pointer",fontSize:10,fontFamily:"system-ui"}}>{claim?"Requested":unlocked?"Request Reward":"Locked"}</button>
              </div>
            </div>
          </div>
        </div>}):<div style={{textAlign:"center",padding:"28px 18px",color:C.muted}}><div style={{fontSize:42,marginBottom:8}}>🛍️</div><div style={{fontSize:13}}>No wishlist items in this category yet.</div></div>}
      </div>
    </div>;
  };

  // ── GOALS ──────────────────────────────────────────────────────────────
  const Goals=()=>{
    const CAT={basketball:{col:C.mauve,icon:"🏀",label:"Basketball",help:"skill, practice, games"},school:{col:C.teal,icon:"📚",label:"School",help:"homework, grades, studying"},health:{col:C.green,icon:"💚",label:"Health",help:"sleep, routine, energy"},character:{col:C.blush,icon:"⭐",label:"Character",help:"confidence, attitude, leadership"},future:{col:C.gold,icon:"🚀",label:"Future",help:"saving, camps, big dreams"}};
    const emptyGoal=()=>({text:"",category:"basketball",targetDate:addDays(7),why:"",steps:""});
    const[gf,setGf]=useState(emptyGoal());
    const[burst,setBurst]=useState(null);
    const[editingGoalId,setEditingGoalId]=useState(null);
    const active=goals.filter(g=>!g.done);
    const waiting=goals.filter(g=>g.done&&!g.parentApproved);
    const approved=goals.filter(g=>g.parentApproved);
    const done=goals.filter(g=>g.done).length;
    const progressPct=goals.length?Math.round((done/goals.length)*100):0;
    const nextGoal=active[0]||waiting[0]||null;
    const nextReward=safeObjects(shoeWish).find(w=>w.goalId&&active.some(g=>g.id===w.goalId))||safeObjects(shoeWish).find(w=>!claimFor(w));
    const weakestSkill=Object.entries(skills).sort((a,b)=>a[1]-b[1])[0]||null;
    const templates=[
      {text:"Make 20 free throws after practice 3 times this week",category:"basketball",why:"Builds confidence and easy points."},
      {text:"Log every game this week right after it ends",category:"basketball",why:"Helps Coach and parents see real progress."},
      {text:"Finish homework before screens for 5 school days",category:"school",why:"Keeps school calm and avoids rushing."},
      {text:"Study math for 15 minutes on 4 nights",category:"school",why:"Small review makes grades easier."},
      {text:"Complete my glow routine 5 nights this week",category:"health",why:"Builds discipline and confidence."},
      {text:"Be in bed by 9:00 PM for 5 nights",category:"health",why:"Sleep helps athletes grow and recover."},
      {text:"Say one positive thing to myself before every practice",category:"character",why:"Confidence is a skill too."},
      {text:"Be a great teammate at the next game",category:"character",why:"Leadership shows even without scoring."},
      {text:"Earn one reward token toward something on my wishlist",category:"future",why:"Connects goals to a bigger reward."},
      {text:"Save toward one future experience or basketball camp",category:"future",why:"Future goals make today’s effort matter."},
    ];
    if(weakestSkill)templates.unshift({text:`Improve ${weakestSkill[0]} with 15 focused minutes a day this week`,category:"basketball",why:"Targets the skill that needs the most growth."});
    const categoryGoalCounts=Object.keys(CAT).map(k=>({id:k,total:goals.filter(g=>g.category===k).length,active:active.filter(g=>g.category===k).length,done:goals.filter(g=>g.category===k&&g.done).length}));
    const saveGoal=async()=>{
      if(!gf.text.trim())return;
      if(editingGoalId){
        const ng=goals.map(g=>g.id===editingGoalId?{...g,text:gf.text.trim(),category:gf.category,targetDate:gf.targetDate,why:gf.why||"",steps:gf.steps||""}:g);
        await saveGoals(ng);setEditingGoalId(null);setGf(emptyGoal());return;
      }
      const entry={id:uid(),goalNo:nextGoalNumber(goals),text:gf.text.trim(),category:gf.category,targetDate:gf.targetDate,why:gf.why||"",steps:gf.steps||"",done:false,submitted:false,parentApproved:false,date:toShort(todayISO())};
      await saveGoals([...goals,entry]);setGf(emptyGoal());
    };
    const startEdit=g=>{setEditingGoalId(g.id);setGf({text:g.text||"",category:g.category||"basketball",targetDate:g.targetDate||addDays(7),why:g.why||"",steps:g.steps||""});};
    const cancelEdit=()=>{setEditingGoalId(null);setGf(emptyGoal());};
    const toggleGoal=async id=>{const ng=goals.map(g=>{if(g.id!==id)return g;const completing=!g.done;if(completing){setBurst(id);setTimeout(()=>setBurst(null),2200);return{...g,done:true,submitted:true,parentApproved:false,completedDate:toShort(todayISO())};}return{...g,done:false,submitted:false,parentApproved:false,completedDate:"",approvedDate:""};});await saveGoals(ng);};
    const removeGoal=async id=>{await saveGoals(goals.filter(g=>g.id!==id));};
    const selectedCat=CAT[gf.category]||CAT.basketball;

    const GoalCard=({g,mode="active"})=>{const cat=CAT[g.category]||CAT.basketball;const linked=safeObjects(shoeWish).filter(w=>w.goalId===g.id);return <div style={{padding:13,borderRadius:18,border:`1px solid ${cat.col}35`,background:`linear-gradient(145deg,${cat.col}12,rgba(255,255,255,.035))`,marginBottom:10,boxShadow:"0 12px 28px rgba(0,0,0,.18)"}}>
      <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
        <button onClick={()=>toggleGoal(g.id)} style={{width:42,height:42,borderRadius:14,border:`2px solid ${g.done?C.green:cat.col}55`,background:g.done?`${C.green}22`:`${cat.col}18`,color:g.done?C.green:cat.col,cursor:"pointer",fontSize:20,flexShrink:0,fontFamily:"system-ui"}}>{g.done?"✓":cat.icon}</button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:5}}>
            <span style={{fontSize:10,fontWeight:950,color:cat.col,letterSpacing:"1px"}}>{goalCodeFor(goals,g)}</span>
            <span style={{fontSize:10,fontWeight:900,color:C.light,background:`${cat.col}18`,border:`1px solid ${cat.col}34`,borderRadius:999,padding:"3px 8px"}}>{cat.label}</span>
            {g.targetDate&&<span style={{fontSize:10,color:C.muted}}>Target {g.targetDate}</span>}
          </div>
          <div style={{fontSize:14,fontWeight:950,color:C.white,lineHeight:1.35}}>{g.text}</div>
          {g.why&&<div style={{fontSize:11,color:C.muted,lineHeight:1.45,marginTop:5}}>Why: {g.why}</div>}
          {g.steps&&<div style={{fontSize:11,color:C.light,lineHeight:1.45,marginTop:5}}>Plan: {g.steps}</div>}
          {linked.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>{linked.slice(0,2).map(w=><span key={w.id} style={{fontSize:10,color:C.gold,background:`${C.gold}12`,border:`1px solid ${C.gold}33`,borderRadius:999,padding:"4px 8px"}}>🎁 {w.name}</span>)}</div>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:g.done&&!g.parentApproved?"1fr 1fr 1fr":"1fr 1fr 1fr",gap:7,marginTop:11}}>
        {!g.done&&<button onClick={()=>toggleGoal(g.id)} style={{padding:"10px 8px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${cat.col},${C.mauve})`,color:C.white,fontWeight:950,cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>I did it ✓</button>}
        {g.done&&!g.parentApproved&&<button onClick={()=>approveGoal(g.id)} style={{padding:"10px 8px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.green},${C.teal})`,color:C.bg,fontWeight:950,cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Parent OK</button>}
        {g.parentApproved&&<button disabled style={{padding:"10px 8px",borderRadius:12,border:`1px solid ${C.green}44`,background:`${C.green}14`,color:C.green,fontWeight:950,fontSize:11,fontFamily:"system-ui"}}>Token earned 🎟️</button>}
        <button onClick={()=>startEdit(g)} style={{padding:"10px 8px",borderRadius:12,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.05)",color:C.light,fontWeight:900,cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Edit</button>
        <button onClick={()=>removeGoal(g.id)} style={{padding:"10px 8px",borderRadius:12,border:`1px solid ${C.red}44`,background:`${C.red}10`,color:C.red,fontWeight:900,cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Delete</button>
      </div>
    </div>;};

    return<div>
      <TabHero
        eyebrow="Goal Command Center"
        title="Set it. Do it. Earn it."
        sub="Every goal gets a clear number, a reason, a next step, and a parent-approved reward path."
        icon="🎯"
        stats={[
          {value:goals.length,label:"set",color:C.mauve},
          {value:waiting.length,label:"parent check",color:C.gold},
          {value:approved.length,label:"approved",color:C.green}
        ]}
      />
      {burst&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,pointerEvents:"none",fontSize:56,filter:`drop-shadow(0 0 24px ${C.gold})`}}>🎉 ⭐ 🎯</div>}

      <div style={{...cs,padding:18,background:"radial-gradient(ellipse at 12% 0%,rgba(221,191,134,.10),transparent 42%),radial-gradient(ellipse at 88% 0%,rgba(217,160,186,.08),transparent 42%),linear-gradient(145deg,rgba(34,32,35,.96),rgba(17,16,19,.99))",borderTop:`3px solid ${C.gold}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:10,color:C.gold,fontWeight:950,letterSpacing:"2px",textTransform:"uppercase",marginBottom:5}}>Goal Command Center</div>
            <div style={{fontSize:30,fontWeight:950,lineHeight:1.05,background:glamGrad,WebkitBackgroundClip:"text",color:"transparent"}}>Set it. Do it. Earn it.</div>
            <div style={{fontSize:12,color:C.light,lineHeight:1.45,marginTop:7}}>Clear goals, parent approval, and reward tokens tied to real follow-through.</div>
          </div>
          <div style={{minWidth:82,textAlign:"center",padding:"10px 8px",borderRadius:18,background:`${C.gold}14`,border:`1px solid ${C.gold}44`,boxShadow:`0 0 24px ${C.gold}18`}}>
            <div style={{fontSize:28,fontWeight:950,color:C.gold,lineHeight:1}}>{rewardTokens}</div>
            <div style={{fontSize:8,color:C.light,fontWeight:950,letterSpacing:"1px",marginTop:4}}>TOKENS</div>
          </div>
        </div>
        <div style={{height:10,borderRadius:99,background:"rgba(0,0,0,.32)",overflow:"hidden",border:`1px solid ${C.border}`,marginBottom:10}}><div style={{height:"100%",width:`${progressPct}%`,background:`linear-gradient(90deg,${C.blush},${C.gold},${C.teal})`,borderRadius:99,transition:"width .4s"}}/></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
          <SBox value={active.length} label="Active" color={C.mauve}/>
          <SBox value={waiting.length} label="Needs OK" color={C.gold}/>
          <SBox value={approved.length} label="Approved" color={C.green}/>
          <SBox value={`${progressPct}%`} label="Progress" color={C.teal}/>
        </div>
      </div>

      <div style={{...cs,background:"linear-gradient(145deg,rgba(34,32,35,.96),rgba(17,16,19,.99))"}}>
        <CH e="🧭" title="Today’s Next Step" sub="One clear action so it does not feel confusing."/>
        {nextGoal?<div style={{display:"grid",gridTemplateColumns:"52px 1fr",gap:12,alignItems:"center"}}>
          <div style={{width:52,height:52,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:25,background:`${(CAT[nextGoal.category]||CAT.basketball).col}18`,border:`1px solid ${(CAT[nextGoal.category]||CAT.basketball).col}44`}}>{waiting.includes(nextGoal)?"⏳":(CAT[nextGoal.category]||CAT.basketball).icon}</div>
          <div><div style={{fontSize:11,color:C.gold,fontWeight:950,letterSpacing:"1px"}}>{waiting.includes(nextGoal)?"READY FOR PARENT CHECK":"WORK ON THIS FIRST"}</div><div style={{fontSize:15,fontWeight:950,color:C.white,lineHeight:1.35,marginTop:3}}>{nextGoal.text}</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>{goalCodeFor(goals,nextGoal)} · Target {nextGoal.targetDate||"No date"}</div></div>
        </div>:<div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>No active goal yet. Pick a starter goal below or write one in your own words.</div>}
        {nextReward&&<div style={{marginTop:12,padding:11,borderRadius:16,background:`${C.gold}10`,border:`1px solid ${C.gold}33`,fontSize:12,color:C.light,lineHeight:1.45}}>Reward motivation: <span style={{color:C.gold,fontWeight:950}}>🎁 {nextReward.name}</span></div>}
      </div>

      <div style={{...cs,background:"linear-gradient(145deg,rgba(34,32,35,.96),rgba(17,16,19,.99))"}}>
        <CH e={editingGoalId?"✏️":"✨"} title={editingGoalId?"Edit Goal":"Create a Goal"} sub="Make it clear enough that she knows exactly what to do."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:12}}>
          {Object.entries(CAT).map(([k,v])=><button key={k} onClick={()=>setGf(p=>({...p,category:k}))} style={{padding:11,borderRadius:16,border:`1px solid ${gf.category===k?v.col:C.border}`,background:gf.category===k?`${v.col}22`:"rgba(255,255,255,.04)",color:C.white,cursor:"pointer",fontFamily:"system-ui",textAlign:"left"}}><div style={{fontSize:20}}>{v.icon}</div><div style={{fontSize:12,fontWeight:950,marginTop:4}}>{v.label}</div><div style={{fontSize:9,color:C.muted,marginTop:2}}>{v.help}</div></button>)}
        </div>
        <textarea value={gf.text} onChange={e=>setGf(p=>({...p,text:e.target.value}))} placeholder="Example: Make 20 free throws after practice 3 times this week" style={{...TXT,minHeight:84,marginBottom:9}}/>
        <input value={gf.why} onChange={e=>setGf(p=>({...p,why:e.target.value}))} placeholder="Why this goal matters (optional)" style={{...INP,marginBottom:9}}/>
        <input value={gf.steps} onChange={e=>setGf(p=>({...p,steps:e.target.value}))} placeholder="Simple plan: when / where / how many" style={{...INP,marginBottom:9}}/>
        <div style={{fontSize:11,color:C.muted,fontWeight:900,marginBottom:6}}>TARGET DATE</div>
        <input type="date" value={gf.targetDate} onChange={e=>setGf(p=>({...p,targetDate:e.target.value}))} style={{...INP,marginBottom:12}}/>
        <button onClick={saveGoal} style={{width:"100%",padding:14,borderRadius:15,border:"none",background:`linear-gradient(135deg,${selectedCat.col},${C.gold})`,color:C.bg,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:15}}>{editingGoalId?"Save Goal Changes":"Add Goal"} 🎯</button>
        {editingGoalId&&<button onClick={cancelEdit} style={{width:"100%",padding:11,borderRadius:13,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.04)",color:C.light,fontWeight:900,cursor:"pointer",fontFamily:"system-ui",fontSize:12,marginTop:8}}>Cancel Edit</button>}
      </div>

      <div style={cs}>
        <CH e="⚡" title="Starter Goals" sub="Tap one. Then adjust it if needed."/>
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8}}>
          {templates.slice(0,8).map((t,i)=>{const cat=CAT[t.category]||CAT.basketball;return <button key={i} onClick={()=>setGf(p=>({...p,text:t.text,category:t.category,why:t.why||p.why,steps:""}))} style={{display:"grid",gridTemplateColumns:"42px 1fr",gap:10,alignItems:"center",padding:11,borderRadius:16,border:`1px solid ${cat.col}35`,background:`${cat.col}10`,color:C.white,cursor:"pointer",fontFamily:"system-ui",textAlign:"left"}}><div style={{width:42,height:42,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,background:`${cat.col}18`,border:`1px solid ${cat.col}33`}}>{cat.icon}</div><div><div style={{fontSize:13,fontWeight:950,lineHeight:1.25}}>{t.text}</div><div style={{fontSize:10,color:C.muted,marginTop:3}}>{t.why}</div></div></button>})}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:12}}>
        {categoryGoalCounts.map(x=>{const cat=CAT[x.id];return <div key={x.id} style={{padding:"9px 4px",borderRadius:15,border:`1px solid ${cat.col}30`,background:`${cat.col}0d`,textAlign:"center"}}><div style={{fontSize:18}}>{cat.icon}</div><div style={{fontSize:14,fontWeight:950,color:cat.col}}>{x.active}</div><div style={{fontSize:8,color:C.muted,fontWeight:800}}>{cat.label}</div></div>})}
      </div>

      {active.length>0&&<div style={cs}><CH e="🎯" title="Active Goals" sub="Tap ‘I did it’ when the work is complete."/>{active.map(g=><GoalCard key={g.id} g={g}/>)}</div>}
      {waiting.length>0&&<div style={cs}><CH e="👨‍👩‍👧" title="Parent Check" sub="Approve only when the goal was honestly completed."/>{waiting.map(g=><GoalCard key={g.id} g={g} mode="waiting"/>)}</div>}
      {approved.length>0&&<div style={cs}><CH e="🎟️" title="Approved Goals" sub="These earned reward tokens."/>{approved.slice(0,10).map(g=><GoalCard key={g.id} g={g} mode="approved"/>)}</div>}
    </div>;
  };


  // ── PROGRESS / REWARDS ─────────────────────────────────────────────────
  const Progress=()=>{
    const avgSk=Math.round(avgArr(Object.values(skills)))||0;
    const gpa=parseFloat(gpaCalc(subjects))||0;
    const wins=games.filter(g=>g.result==="Win").length;
    const winPct=games.length?Math.round(wins/games.length*100):0;
    const avgSleepH=sleepEntries.length?avgArr(sleepEntries.slice(0,7).map(e=>e.hours)).toFixed(1):"—";
    const updateGrade=async(s,g)=>{const ns={...subjects,[s]:g};await saveSchool(ns);};
    const earnedBadges=BADGE_DEFS.filter(b=>b.check(badgeData));
    const lockedBadges=BADGE_DEFS.filter(b=>!b.check(badgeData));
    const grades=["4","3","2","1"];
    const overallGlow=Math.round(avgArr([avgSk,Math.round(gpa/4*100),games.length?winPct:0].filter(v=>v>0)))||0;

    return<div>
      <TabHero
        eyebrow="Rewards & Progress"
        title="Celebrate what was earned."
        sub="Approved goals unlock reward tokens. Progress, badges, grades, and growth stay visible for parents and Scarlett."
        icon="🎁"
        stats={[
          {value:approvedGoalCount,label:"approved",color:C.green},
          {value:rewardTokens,label:"available",color:C.gold},
          {value:earnedBadges.length,label:"badges",color:C.mauve}
        ]}
      />
      <div style={{...cs,background:"radial-gradient(ellipse at 80% 0%,rgba(255,215,0,.22),transparent 45%),linear-gradient(145deg,rgba(34,32,35,.96),rgba(12,12,14,.99))",borderTop:`3px solid ${C.gold}`}}>
        <CH e="🎁" title="Reward Shop" sub="Wishlist rewards unlock only after real goals are approved."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
          <SBox value={approvedGoalCount} label="Approved Goals" color={C.green}/>
          <SBox value={spentRewardTokens} label="Tokens Used" color={C.purple}/>
          <SBox value={rewardTokens} label="🎟️ Available" color={C.gold}/>
        </div>
        {shoeWish.length===0
          ?<div style={{padding:14,borderRadius:16,background:"rgba(255,255,255,.05)",border:`1px solid ${C.border}`,fontSize:12,color:C.muted,lineHeight:1.6}}>Add shoes, clothes, or trend items in My Glow → Shoes. Then she can request them when she has enough approved-goal tokens.</div>
          :shoeWish.slice(0,8).map(item=>{
            const claim=claimFor(item);
            const cost=rewardCost(item);
            const enough=rewardTokens>=cost;
            return<div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:`1px solid ${C.border}`}}>
              <SneakerPhoto src={item.img} name={item.name} size={58}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:950,color:C.white}}>{item.name}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:2}}>{item.priority||"Wishlist"} · Costs {cost} token{cost===1?"":"s"}</div>
                {item.why&&<div style={{fontSize:10,color:C.gold,marginTop:2}}>{item.why}</div>}
                {claim&&<div style={{fontSize:10,color:claim.status==="approved"?C.green:C.gold,marginTop:3,fontWeight:900}}>Status: {claim.status==="approved"?"✅ Parent approved!":"⏳ Requested — waiting for parent"}</div>}
              </div>
              {!claim&&<button disabled={!enough} onClick={()=>requestReward(item)} style={{padding:"9px 10px",borderRadius:11,border:`1px solid ${enough?C.gold:C.border}`,background:enough?`${C.gold}18`:"rgba(255,255,255,.04)",color:enough?C.gold:C.muted,fontWeight:900,cursor:enough?"pointer":"not-allowed",fontSize:11,fontFamily:"system-ui",whiteSpace:"nowrap"}}>{enough?"Request 🎟️":"Need tokens"}</button>}
              {claim?.status==="requested"&&<button onClick={()=>updateRewardClaim(claim.id,"approved")} style={{padding:"9px 10px",borderRadius:11,border:`1px solid ${C.green}44`,background:`${C.green}16`,color:C.green,fontWeight:900,cursor:"pointer",fontSize:11,fontFamily:"system-ui",whiteSpace:"nowrap"}}>Parent OK ✓</button>}
              <button onClick={()=>openShop("stockx",item.search||item.name)} style={{padding:"9px 10px",borderRadius:11,border:`1px solid ${C.gold}33`,background:"rgba(255,255,255,.04)",color:C.gold,fontWeight:900,cursor:"pointer",fontSize:11,fontFamily:"system-ui",whiteSpace:"nowrap"}}>Check price</button>
            </div>;
          })
        }
      </div>

      <div style={{...cs,background:"radial-gradient(ellipse at 80% 10%,rgba(255,140,198,.12),transparent 50%),linear-gradient(145deg,rgba(34,32,35,.96),rgba(12,12,14,.99))",textAlign:"center",padding:20}}>
        <div style={{fontSize:44,marginBottom:6}}>⭐</div>
        <div style={{fontSize:28,fontWeight:950,background:glamGrad,WebkitBackgroundClip:"text",color:"transparent"}}>{profile.name}</div>
        <div style={{display:"inline-block",marginTop:8,padding:"6px 16px",borderRadius:999,background:`${C.purple}25`,border:`1px solid ${C.purple}55`,fontSize:13,fontWeight:900,color:C.purple}}>Level {level} · {levelTitle}</div>
        <div style={{margin:"14px 0 4px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:10,color:C.muted}}>LV {level}</span><span style={{fontSize:10,color:C.purple,fontWeight:800}}>{xpInLevel}/{xpPerLevel} XP</span></div>
          <div style={{height:10,background:"rgba(0,0,0,.35)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${(xpInLevel/xpPerLevel)*100}%`,background:glamGrad,borderRadius:99}}/></div>
        </div>
        <div style={{fontSize:24,fontWeight:950,color:C.gold,marginTop:8}}>{stars} ⭐ total</div>
        <div style={{fontSize:13,color:C.muted,marginTop:4}}>Glow Score: <span style={{color:SKILL_COL(overallGlow),fontWeight:900}}>{overallGlow}%</span></div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        <SBox value={games.length} label="Games Logged 🏀" color={C.coral}/>
        <SBox value={`${winPct}%`} label="Win Rate 🏆" color={C.green}/>
        <SBox value={practices.length} label="Practices 💪" color={C.purple}/>
        <SBox value={avgSk+"%"} label="Skill Rating 📊" color={SKILL_COL(avgSk)}/>
        <SBox value={gpa||"—"} label="GPA 📚" color={gpa>=3.5?C.green:gpa>=3?C.teal:C.orange}/>
        <SBox value={avgSleepH} label="Avg Sleep 🌙" color={parseFloat(avgSleepH)>=8?C.green:C.orange}/>
      </div>

      <div style={cs}>
        <CH e="📚" title="School Grades" sub="Tap a number to update · 4 is best"/>
        {Object.entries(subjects).map(([s,grade])=><div key={s} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{flex:1,fontWeight:700,fontSize:14,color:C.text}}>{s}</div>
          <div style={{display:"flex",gap:4}}>
            {grades.map(g=><button key={g} onClick={()=>updateGrade(s,g)} style={{width:34,height:34,borderRadius:10,border:`2px solid ${normGrade(grade)===g?GRADE_COL[g]:C.border}`,background:normGrade(grade)===g?`${GRADE_COL[g]}22`:"transparent",color:normGrade(grade)===g?GRADE_COL[g]:C.muted,cursor:"pointer",fontWeight:900,fontSize:13,fontFamily:"system-ui"}}>{g}</button>)}
          </div>
        </div>)}
        <div style={{marginTop:12,padding:12,borderRadius:14,background:`${C.teal}14`,border:`1px solid ${C.teal}33`,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:13,fontWeight:800,color:C.text}}>GPA</span>
          <span style={{fontSize:18,fontWeight:950,color:gpa>=3.5?C.green:gpa>=3?C.teal:C.orange}}>{gpaCalc(subjects)}</span>
        </div>
      </div>

      {earnedBadges.length>0&&<div style={cs}>
        <CH e="🏅" title={`Badges Earned (${earnedBadges.length}/${BADGE_DEFS.length})`}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:4}}>
          {earnedBadges.map(b=><div key={b.id} style={{padding:"12px 8px",borderRadius:16,background:`${C.gold}18`,border:`1px solid ${C.gold}44`,textAlign:"center"}}>
            <div style={{fontSize:26,marginBottom:4}}>{b.icon}</div>
            <div style={{fontSize:10,fontWeight:950,color:C.gold,lineHeight:1.2}}>{b.name}</div>
          </div>)}
        </div>
      </div>}

      {lockedBadges.length>0&&<div style={cs}>
        <CH e="🔒" title="Locked Badges"/>
        <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:4}}>
          {lockedBadges.slice(0,6).map(b=><div key={b.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:13,background:"rgba(255,255,255,.03)",border:`1px solid rgba(255,255,255,.06)`}}>
            <div style={{fontSize:20,filter:"grayscale(1) opacity(.35)"}}>{b.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,.35)"}}>{b.name}</div><div style={{fontSize:10,color:C.muted,marginTop:1}}>{b.desc}</div></div>
          </div>)}
        </div>
      </div>}
    </div>;
  };

  const CONTENT={today:Today,virgo:VirgoVibe,coach:Coach,hoops:Hoops,glow:MyGlow,wishlist:Wishlist,goals:Goals,progress:Progress};

  return<div style={{background:"radial-gradient(circle at 12% -10%,rgba(255,140,198,.12),transparent 30%),radial-gradient(circle at 92% 0%,rgba(216,168,94,.10),transparent 24%),linear-gradient(180deg,#080B0C,#101516 54%,#070909)",minHeight:"100vh",fontFamily:"system-ui,-apple-system,sans-serif",color:C.text}}>
    <style>{`*{box-sizing:border-box} button,[role="button"]{-webkit-tap-highlight-color:transparent;touch-action:manipulation;user-select:none;appearance:none} input,textarea,select{font-size:16px!important} ::-webkit-scrollbar{display:none} body{margin:0;overflow-x:hidden;background:#080B0C} input::placeholder,textarea::placeholder{color:rgba(247,244,236,.42)} .app-card-img{object-fit:contain!important;background:#F7F4EC}`}</style>
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",position:"relative",boxShadow:"0 0 100px rgba(255,140,198,.08)"}}>

      <div style={{position:"sticky",top:0,zIndex:50,padding:"10px 14px 10px",background:"linear-gradient(180deg,rgba(8,11,12,.96),rgba(8,11,12,.86))",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <button onClick={()=>setTab("today")} style={{display:"flex",alignItems:"center",gap:10,minWidth:0,border:"none",background:"transparent",padding:0,cursor:"pointer",fontFamily:"system-ui",textAlign:"left"}}>
            <div style={{width:42,height:42,borderRadius:"50%",padding:2,background:`linear-gradient(135deg,${C.pink},${C.teal},${C.gold})`,flexShrink:0}}>
              <div style={{width:"100%",height:"100%",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:"#171618",color:C.cream,fontWeight:950,fontFamily:"Georgia,serif",fontSize:19}}>{(profile.name||"S").slice(0,1)}</div>
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontWeight:850,fontSize:23,letterSpacing:"-.5px",lineHeight:1,color:C.cream,fontFamily:"Georgia,serif"}}>{profile.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginTop:5}}>
                <div style={{width:76,height:6,background:"rgba(255,255,255,.10)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${(xpInLevel/xpPerLevel)*100}%`,background:`linear-gradient(90deg,${C.pink},${C.teal},${C.gold})`,borderRadius:99,transition:"width .4s"}}/></div>
                <span style={{fontSize:10,color:C.blush,fontWeight:850,whiteSpace:"nowrap"}}>LV {level} {levelTitle}</span>
              </div>
            </div>
          </button>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setTab("progress")} style={{minWidth:56,textAlign:"center",padding:"8px 10px",borderRadius:15,background:"rgba(255,255,255,.065)",border:`1px solid ${C.border}`,color:C.cream,cursor:"pointer",fontFamily:"system-ui"}}>
              <div style={{fontSize:18,fontWeight:950,color:C.gold,textShadow:`0 0 15px ${C.gold}55`,lineHeight:1}}>★ {stars}</div>
              <div style={{fontSize:8,color:C.muted,fontWeight:850,letterSpacing:"1px",marginTop:3}}>STARS</div>
            </button>
            <button onClick={()=>setShowSettings(!showSettings)} style={{width:38,height:38,borderRadius:14,background:"rgba(255,255,255,.07)",border:`1px solid ${C.border}`,color:C.muted,fontSize:18,cursor:"pointer"}}>⚙️</button>
          </div>
        </div>
      </div>

      {showSettings&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:100,display:"flex",alignItems:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)setShowSettings(false);}}>
        <div style={{width:"100%",maxWidth:430,margin:"0 auto",background:C.card,borderRadius:"24px 24px 0 0",padding:24,paddingBottom:48}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontSize:18,fontWeight:950}}>Setup ⚙️</div>
            <button onClick={()=>setShowSettings(false)} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:10,width:36,height:36,color:C.white,fontSize:18,cursor:"pointer"}}>×</button>
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:6}}>YOUR NAME</div>
          <input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} style={{...INP,marginBottom:14}}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:6}}>GRADE</div>
          <input value={profile.grade} onChange={e=>setProfile(p=>({...p,grade:e.target.value}))} placeholder="e.g. 5th" style={{...INP,marginBottom:14}}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:6}}>BIRTHDAY</div>
          <input type="date" value={profile.birthDate||"2015-08-28"} onChange={e=>setProfile(p=>({...p,birthDate:e.target.value,zodiac:"Virgo"}))} style={{...INP,marginBottom:6}}/>
          <div style={{fontSize:10,color:C.gold,fontWeight:800,marginBottom:14}}>♍ Virgo daily vibe enabled</div>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:6}}>TEAM NAME (optional)</div>
          <input value={profile.teamName} onChange={e=>setProfile(p=>({...p,teamName:e.target.value}))} placeholder="e.g. Lady Eagles" style={{...INP,marginBottom:18}}/>

          <div style={{margin:"8px 0 18px",padding:14,borderRadius:18,background:`linear-gradient(145deg,${C.pink}18,rgba(255,255,255,.04))`,border:`1px solid ${C.pink}44`}}>
            <div style={{fontSize:11,color:C.pink,fontWeight:950,letterSpacing:"1.4px",textTransform:"uppercase",marginBottom:6}}>💗 Protect Progress</div>
            <div style={{fontSize:11,color:C.muted,lineHeight:1.55,marginBottom:10}}>Refreshes are safe. Clearing browser history/site data can erase local storage, so use a Family Sync Code or download a backup file before clearing Safari/Chrome data.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <button onClick={saveEverythingNow} style={{padding:11,borderRadius:12,border:`1px solid ${C.teal}55`,background:`${C.teal}14`,color:C.teal,fontWeight:950,cursor:"pointer",fontSize:12,fontFamily:"system-ui"}}>Save Now</button>
              <button onClick={exportBackup} style={{padding:11,borderRadius:12,border:`1px solid ${C.pink}55`,background:`${C.pink}14`,color:C.pink,fontWeight:950,cursor:"pointer",fontSize:12,fontFamily:"system-ui"}}>Download Backup</button>
            </div>
            <input ref={backupFileRef} type="file" accept="application/json,.json" onChange={importBackupFile} style={{display:"none"}}/>
            <button onClick={()=>backupFileRef.current?.click()} style={{width:"100%",padding:11,borderRadius:12,border:`1px solid ${C.gold}55`,background:`${C.gold}12`,color:C.gold,fontWeight:950,cursor:"pointer",fontSize:12,fontFamily:"system-ui"}}>Restore From Backup File</button>
            {backupMsg&&<div style={{fontSize:10,color:C.green,fontWeight:850,marginTop:8,textAlign:"center"}}>{backupMsg}</div>}
          </div>
          <div style={{fontSize:11,color:C.blue,fontWeight:800,marginBottom:6}}>☁ FAMILY SYNC CODE</div>
          <div style={{fontSize:11,color:C.muted,marginBottom:10,lineHeight:1.6}}>Create a code and enter it on every device — mom's phone, dad's tablet, any screen. Everyone sees the same data.</div>
          {familyCode?<>
            <div style={{background:`${C.green}18`,border:`1px solid ${C.green}44`,borderRadius:16,padding:14,textAlign:"center",marginBottom:10}}>
              <div style={{fontSize:10,color:C.green,fontWeight:900,letterSpacing:"2px",marginBottom:5}}>ACTIVE CODE</div>
              <div style={{fontSize:30,fontWeight:950,letterSpacing:"10px",color:C.white}}>{familyCode}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{try{navigator.clipboard.writeText(familyCode);}catch{}}} style={{flex:1,padding:12,borderRadius:12,border:`1px solid ${C.teal}44`,background:`${C.teal}14`,color:C.teal,fontWeight:900,cursor:"pointer",fontSize:13,fontFamily:"system-ui"}}>Copy 📋</button>
              <button onClick={()=>{setFCGlobal(null);setFamilyCode("");}} style={{flex:1,padding:12,borderRadius:12,border:`1px solid ${C.red}33`,background:`${C.red}10`,color:C.red,fontWeight:900,cursor:"pointer",fontSize:13,fontFamily:"system-ui"}}>Disconnect</button>
            </div>
          </>:<>
            <input value={codeInput} onChange={e=>setCodeInput(e.target.value.toUpperCase())} placeholder="Enter code (e.g. SC7X2K)" maxLength={6} style={{...INP,letterSpacing:"6px",fontWeight:950,fontSize:20,textAlign:"center",marginBottom:8}}/>
            <button onClick={()=>activateCode(codeInput)} style={{width:"100%",padding:13,borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.pink},${C.blush},${C.teal})`,color:C.darkText,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:14,marginBottom:8}}>Connect ☁</button>
            <button onClick={()=>activateCode(genCode())} style={{width:"100%",padding:13,borderRadius:12,border:`1px solid ${C.teal}44`,background:`${C.teal}12`,color:C.teal,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:14}}>Create New Family Code ✨</button>
          </>}
        </div>
      </div>}

      {/* ── FIX: use StableRenderer with key={tab} so each tab's useState hooks work ── */}
      <div onFocusCapture={onEditFocus} onBlurCapture={onEditBlur} style={{padding:"14px 14px calc(90px + env(safe-area-inset-bottom,0px))"}}>
        <TabErrorBoundary key={`err_${tab}`}><StableRenderer key={tab} render={CONTENT[tab]||Today}/></TabErrorBoundary>
      </div>

      <div style={{position:"fixed",left:"50%",bottom:"max(10px,env(safe-area-inset-bottom,0px))",transform:editing?"translate(-50%,calc(125% + 20px))":"translateX(-50%)",opacity:editing?0:1,pointerEvents:editing?"none":"auto",transition:"transform .22s ease,opacity .18s ease",width:"min(410px,calc(100% - 28px))",display:"grid",gridTemplateColumns:`repeat(${TABS.length},1fr)`,gap:1,background:"rgba(9,13,14,.96)",backdropFilter:"blur(26px)",border:"1px solid rgba(255,255,255,.13)",borderRadius:28,padding:"11px 9px calc(10px + env(safe-area-inset-bottom,0px))",boxShadow:"0 20px 60px rgba(0,0,0,.58),inset 0 1px 0 rgba(255,255,255,.07)",zIndex:60}}>
        {TABS.map(t=>{
          const active=tab===t.id;
          return <button key={t.id} onClick={()=>setTab(t.id)} style={{background:active?"rgba(255,140,198,.08)":"transparent",border:"none",borderRadius:20,color:active?C.teal:"rgba(247,244,236,.56)",padding:"7px 2px 6px",fontFamily:"system-ui",fontWeight:900,cursor:"pointer",minWidth:0}}>
            <div style={{fontSize:20,lineHeight:1,filter:active?`drop-shadow(0 0 13px ${C.teal}88)`:"grayscale(.15) brightness(.9)",transform:active?"translateY(-1px)":"none"}}>{t.e}</div>
            <div style={{fontSize:8.5,marginTop:5,letterSpacing:".25px",color:active?C.teal:"rgba(247,244,236,.58)",fontWeight:950,textShadow:active?`0 0 12px ${C.teal}55`:"none"}}>{t.label}</div>
          </button>;
        })}
      </div>
    </div>
  </div>;
}
