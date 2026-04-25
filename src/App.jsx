import { useState, useEffect, useRef, useCallback } from "react";

const C={bg:"#06040F",nav:"#0C0A1A",navy:"#0E0B1B",navy2:"#150F28",card:"#180D2C",card2:"#1E1238",border:"rgba(255,255,255,.12)",coral:"#FF3D7F",teal:"#00E5CC",purple:"#8B5CF6",gold:"#FFD700",green:"#22D97A",blue:"#4DA6FF",pink:"#FF1A8C",orange:"#FF7A2F",red:"#FF3D5A",white:"#FFFFFF",text:"#FFF0FF",muted:"#A89BC0",light:"#E8D5FF"};

// 5 tabs instead of 12
const TABS=[
  {id:"today",e:"🏠",label:"Today"},
  {id:"hoops",e:"🏀",label:"Hoops"},
  {id:"glow",e:"✨",label:"My Glow"},
  {id:"goals",e:"🎯",label:"Goals"},
  {id:"progress",e:"🎁",label:"Rewards"},
];

const DEF_VITALS={energy:0,mood:0};
// No preset daily quests. Scarlett creates these herself.
const DEF_HABITS=[];
const DEF_SKILLS={"Ball Handling":35,"Shooting Form":30,"Layups":35,"Free Throws":30,"Passing":35,"Court Vision":30,"Defense":30,"Rebounding":30,"Footwork":30,"Speed & Agility":35,"Conditioning":35,"Basketball IQ":30,"Confidence":45,"Leadership":40};
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
const PRACTICE_TYPES=["Team Practice","Home Workout","Shooting","Ball Handling","Defense","Full Workout"];
const STYLE_TYPES=["Game Day","Practice","School","Weekend"];
const HAIR_IDEAS=["Braids","Ponytail","Bun","Down","Half-up","Curly out"];
const SHOE_PRIORITY=["Dream 🌟","Next Up 🔜","Maybe 🤔","Have It ✅"];
const LEVEL_TITLES=["Rookie","Rising Star","Athlete","Contender","Competitor","Elite","All-Star","Champion","Legend","Icon"];
const GRADE_COL={4:C.green,3:C.teal,2:C.gold,1:C.orange};
const SKILL_LEVEL=v=>v>=75?"Elite":v>=55?"Strong":v>=35?"Building":"Beginner";
const SKILL_COL=v=>v>=75?C.green:v>=55?C.teal:v>=35?C.gold:C.coral;

const uid=()=>`${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
const todayISO=()=>new Date().toISOString().slice(0,10);
const toShort=iso=>new Date(`${iso||todayISO()}T12:00:00`).toLocaleDateString("en-US",{month:"short",day:"numeric"});
const shiftISO=(iso,d)=>{const dt=new Date(`${iso}T12:00:00`);dt.setDate(dt.getDate()+d);return dt.toISOString().slice(0,10);};
const clone=o=>JSON.parse(JSON.stringify(o));
const avgArr=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;
const normGrade=g=>String(g||3);
const gradeValue=g=>({4:4,3:3,2:2,1:1}[normGrade(g)]||0);
const gpaCalc=subs=>{const v=Object.values(subs).map(g=>gradeValue(g)||0);return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1):"—";};
const addDays=(n=7)=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10);};
const daysAgo=d=>{try{return Math.round((Date.now()-new Date(d+"T12:00:00"))/86400000);}catch{return 999;}};
const glamGrad=`linear-gradient(135deg,${C.pink} 0%,${C.purple} 55%,${C.teal} 100%)`;
const DAILY_HOROSCOPE=[
  {vibe:"Virgo focus queen",message:"Your superpower today is noticing the little details others miss. Pick one tiny promise and finish it all the way.",power:"Finish one thing fully",lucky:"Gold stars"},
  {vibe:"Clean routine energy",message:"A Virgo glow-up starts with order. Clear one small mess, prep one thing early, and your whole day feels lighter.",power:"Prep before pressure",lucky:"Clean outfit"},
  {vibe:"Court discipline",message:"Reps do not need to be perfect to count. Keep your form clean, your feet active, and your mind locked in.",power:"15 focused reps",lucky:"Basketball shoes"},
  {vibe:"School boss mode",message:"Your brain is sharp today. Start with the hardest school task first so the rest of the day feels easier.",power:"Hard thing first",lucky:"Purple pen"},
  {vibe:"Main character calm",message:"You do not have to rush to prove anything. Move with confidence, stay kind, and let your follow-through speak.",power:"Calm confidence",lucky:"Soft glam"},
  {vibe:"Trendsetter Virgo",message:"You do not have to copy every trend. Choose what fits your style, your confidence, and the person you are becoming.",power:"Be original",lucky:"Something shiny"},
  {vibe:"Reward mindset",message:"The wishlist is not just stuff. It is proof that discipline, goals, and follow-through turn into real rewards.",power:"Earn it first",lucky:"Dream item"},
  {vibe:"Practice promise",message:"A little practice done today beats a perfect plan saved for later. Start small and let momentum build.",power:"Start for 5 minutes",lucky:"Pink water bottle"},
  {vibe:"Virgo reset",message:"If the day feels messy, reset one thing: your room, your backpack, your attitude, or your next choice.",power:"Reset and restart",lucky:"Fresh start"},
  {vibe:"Glow-up details",message:"Tiny habits make the glow-up real. Face care, outfit prep, and sleep are quiet wins that stack up.",power:"Do the routine",lucky:"Glowy skin"},
  {vibe:"Leader energy",message:"Lead by example today. Be the teammate who listens, hustles, and keeps the mood strong.",power:"Encourage someone",lucky:"Team colors"},
  {vibe:"Confidence builder",message:"Confidence grows when you keep promises to yourself. Do one thing you said you would do.",power:"Keep the promise",lucky:"Crown emoji"},
  {vibe:"Focused and fitted",message:"Looking good can help you feel ready, but your real power is showing up prepared.",power:"Pack early",lucky:"Favorite hoodie"},
  {vibe:"Free throw mindset",message:"Slow down, breathe, and repeat. Virgo energy loves a routine — use it to build consistency.",power:"Same routine every time",lucky:"Free throws"},
  {vibe:"No drama discipline",message:"Protect your peace today. Put your energy into school, practice, style, and goals — not distractions.",power:"Stay unbothered",lucky:"Teal accent"},
  {vibe:"Smart girl era",message:"Asking for help is not weakness. It is strategy. Smart players and smart students use their resources.",power:"Ask one question",lucky:"Study notes"},
  {vibe:"Clean bag, clear mind",message:"A packed backpack and ready outfit make tomorrow easier. Future you will be thankful.",power:"Prep tonight",lucky:"Backpack check"},
  {vibe:"Hustle with heart",message:"Give effort even when nobody is clapping. The work still counts, and you are building trust with yourself.",power:"Quiet hustle",lucky:"Sneaker laces"},
  {vibe:"Virgo glow check",message:"Notice what is working. Celebrate one win before you think about what needs fixing.",power:"Name one win",lucky:"Gold sparkle"},
  {vibe:"Better than yesterday",message:"You do not need to beat everyone today. Just beat yesterday's version of you by one small choice.",power:"One percent better",lucky:"Practice fit"},
  {vibe:"Organized athlete",message:"Write it down, track it, and make it real. Goals are easier when you can see the next move.",power:"Track the next move",lucky:"Checklist"},
  {vibe:"Soft but strong",message:"You can be sweet and still be serious about your goals. Kindness and discipline can both be yours.",power:"Kind and locked in",lucky:"Pink + black"},
  {vibe:"Game-day brain",message:"See the floor, make the pass, take the open shot, and trust the work you have done.",power:"Trust your training",lucky:"Jersey number"},
  {vibe:"Routine queen",message:"A routine is not boring when it gets you closer to the girl you want to become.",power:"Keep the streak alive",lucky:"Night routine"},
  {vibe:"Homework then highlights",message:"Screens feel better when the work is done first. Handle the assignment, then enjoy the fun.",power:"Work before scroll",lucky:"YouTube break"},
  {vibe:"Dream pair energy",message:"That wishlist item becomes more meaningful when it is connected to effort, goals, and follow-through.",power:"Earn the unlock",lucky:"Dream shoes"},
  {vibe:"Clear goals only",message:"Make the goal simple enough to do today. Clear beats complicated every time.",power:"Make it tiny",lucky:"One goal"},
  {vibe:"Brave beginner",message:"It is okay to be building. Every strong player started as someone learning the basics.",power:"Practice the basics",lucky:"Layups"},
  {vibe:"Level-up day",message:"Pick one area to improve and give it your best attention. Focus is the shortcut.",power:"One focus area",lucky:"XP boost"},
  {vibe:"Friendship and focus",message:"Be fun, be kind, and still stay on track. The right friends will respect your goals.",power:"Good energy only",lucky:"Group chat joy"},
  {vibe:"Virgo victory",message:"Today is a good day to prove to yourself that you can start, finish, and feel proud.",power:"Finish strong",lucky:"Victory star"},
];
function getDailyHoroscope(profile){
  const day=Math.floor(new Date(todayISO()+"T12:00:00").getTime()/86400000);
  const h=DAILY_HOROSCOPE[day%DAILY_HOROSCOPE.length];
  const sign=profile?.zodiac||"Virgo";
  return {sign,...h};
}

// ── STORAGE ──────────────────────────────────────────────────────────────
let _FC=null;
function getFamilyCode(){try{return _FC||localStorage.getItem("sc_fc")||null;}catch{return null;}}
function setFCGlobal(c){_FC=c;try{if(c)localStorage.setItem("sc_fc",c);else localStorage.removeItem("sc_fc");}catch{}}
function fKey(k){const fc=getFamilyCode();return fc?`glow_${fc}_${k}`:null;}
async function sg(k){try{const sk=fKey(k);if(sk&&window.storage){try{const r=await window.storage.get(sk,true);if(r?.value)return JSON.parse(r.value);}catch{}}const raw=localStorage.getItem(k);return raw?JSON.parse(raw):null;}catch{return null;}}
async function ss(k,v){try{const p=JSON.stringify(v);const sk=fKey(k);if(sk&&window.storage){try{await window.storage.set(sk,p,true);}catch{}}try{localStorage.setItem(k,p);}catch{}return true;}catch{return false;}}
const genCode=()=>{const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";return Array.from({length:6},()=>c[Math.floor(Math.random()*c.length)]).join("");};

// ── UI ATOMS ──────────────────────────────────────────────────────────────
const cs={background:"linear-gradient(145deg,rgba(32,14,62,.97),rgba(10,5,22,.99))",borderRadius:20,border:`1px solid rgba(255,255,255,.11)`,padding:16,marginBottom:14,boxShadow:"0 22px 55px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.09)",position:"relative",overflow:"hidden"};
const INP={width:"100%",background:"rgba(4,2,12,.72)",border:"1px solid rgba(255,255,255,.12)",borderRadius:14,padding:"12px 14px",color:C.text,fontSize:16,outline:"none",fontFamily:"system-ui",boxSizing:"border-box"};
const TXT={...INP,minHeight:70,resize:"vertical"};
const glass={background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",boxShadow:"inset 0 1px 0 rgba(255,255,255,.11)"};

function CH({e,title,sub}){return<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{fontSize:18,filter:"drop-shadow(0 0 14px rgba(255,26,140,.55))"}}>{e}</div><div><div style={{fontWeight:900,fontSize:10,letterSpacing:"2px",color:"rgba(255,255,255,.65)",textTransform:"uppercase",marginBottom:2}}>{title}</div>{sub&&<div style={{fontSize:11,color:C.muted}}>{sub}</div>}</div></div>;}
function SBox({value,label,color}){return<div style={{...glass,borderRadius:18,padding:12,textAlign:"center",borderTop:`2px solid ${color}`}}><div style={{fontWeight:900,fontSize:22,color,lineHeight:1,textShadow:`0 0 24px ${color}88`}}>{value}</div><div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.65)",marginTop:5}}>{label}</div></div>;}
function SkBar({skill,val}){const col=SKILL_COL(val),level=SKILL_LEVEL(val);return<div style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:700,color:C.text}}>{skill}</span><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{background:`${col}25`,color:col,fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:6}}>{level}</span><span style={{fontSize:14,fontWeight:900,color:col}}>{val}%</span></div></div><div style={{height:10,background:"rgba(0,0,0,.4)",borderRadius:100,overflow:"hidden"}}><div style={{height:"100%",background:`linear-gradient(90deg,${col}cc,${col})`,borderRadius:100,width:`${val}%`,transition:"width .4s ease",boxShadow:`0 0 18px ${col}66`}}/></div></div>;}
function RD({val,max=5,col,onSet}){return<div style={{display:"flex",gap:7}}>{Array.from({length:max},(_,i)=><div key={i} onClick={()=>onSet(i+1===val?0:i+1)} style={{width:34,height:34,borderRadius:10,background:i<val?`linear-gradient(145deg,${col},${C.pink})`:"rgba(255,255,255,.05)",border:`1.5px solid ${i<val?col:"rgba(255,255,255,.12)"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:i<val?`0 0 20px ${col}55`:"none",transition:"all .15s"}}><span style={{fontSize:10,fontWeight:900,color:i<val?C.white:"rgba(255,255,255,.3)"}}>{i+1}</span></div>)}</div>;}
function EmojiPick({val,emojis,onSet,col}){return<div style={{display:"grid",gridTemplateColumns:`repeat(${emojis.length},minmax(0,1fr))`,gap:7,width:"100%"}}>{emojis.map((e,i)=><button key={i} onClick={()=>onSet(i+1===val?0:i+1)} style={{height:48,minWidth:0,borderRadius:15,fontSize:22,border:`2px solid ${val===i+1?col:C.border}`,background:val===i+1?`${col}22`:"rgba(255,255,255,.05)",cursor:"pointer",boxShadow:val===i+1?`0 0 18px ${col}44`:"none",transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>{e}</button>)}</div>;}
function Chip({label,active,col,onClick}){return<button onClick={onClick} style={{flexShrink:0,padding:"9px 14px",borderRadius:999,border:`1px solid ${active?col:C.border}`,background:active?`${col}22`:"rgba(255,255,255,.05)",color:active?C.light:C.muted,fontWeight:900,cursor:"pointer",fontSize:12,whiteSpace:"nowrap",fontFamily:"system-ui"}}>{label}</button>;}
function RingChart({val,col,label,size=54}){const r=size/2-6,circ=2*Math.PI*r,d=circ-(val/100)*circ,cx=size/2,cy=size/2;return<svg width={size} height={size} style={{filter:`drop-shadow(0 0 10px ${col}88)`}}><circle cx={cx} cy={cy} r={r} fill="rgba(0,0,0,.3)" stroke="rgba(255,255,255,.1)" strokeWidth={6}/><circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={d} transform={`rotate(-90 ${cx} ${cy})`} style={{transition:"all .5s ease"}}/><text x={cx} y={cy+4} textAnchor="middle" fill="white" fontSize={label.length>3?9:13} fontWeight={900} fontFamily="system-ui">{label}</text></svg>;}

// ── FIX: StableRenderer so tabs with their own useState hooks work correctly ──
function StableRenderer({render}){return render();}

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
  {id:"star_100",icon:"💎",name:"Diamond",desc:"Earn 100 stars",check:d=>d.stars>=100},
];

export default function ScarlettTracker(){
  const[loaded,setLoaded]=useState(false);
  const[tab,setTab]=useState(()=>{try{return localStorage.getItem("sc_last_tab")||"today";}catch{return "today";}});
  const[familyCode,setFamilyCode]=useState(()=>{try{return localStorage.getItem("sc_fc")||"";}catch{return "";}});
  const[codeInput,setCodeInput]=useState("");
  const[showSettings,setShowSettings]=useState(false);
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
  const[styleLog,setStyleLog]=useState([]);
  const[shoeWish,setShoeWish]=useState([]);
  const[goals,setGoals]=useState([]);
  const[rewardClaims,setRewardClaims]=useState([]);
  const[habits,setHabits]=useState(clone(DEF_HABITS));

  const saveTmr=useRef(null),savedTm=useRef(null),editBlurT=useRef(null),supRef=useRef(false);

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
    setPractices(prax.entries||[]);setStyleLog(styleD.fits||[]);setShoeWish(styleD.shoes||[]);
    setRoutineHist(routineD.entries||{});setSleepEntries(slp.entries||[]);
    setSubjects(school.subjects||clone(DEF_SUBJECTS));
    const dailyEntries=daily.entries||{};
    const goalEntries=gd.entries||[];
    const realActivity=(bball.games||[]).length>0||(prax.entries||[]).length>0||(styleD.fits||[]).length>0||(styleD.shoes||[]).length>0||(routineD.entries&&Object.values(routineD.entries).some(x=>Object.values(x?.c||{}).some(Boolean)))||(slp.entries||[]).length>0||goalEntries.length>0||Object.values(dailyEntries).some(x=>Object.values(x?.c||{}).some(Boolean)||(x?.w||0)>0||Object.keys(x?.r||{}).length>0);
    const startStars=realActivity?(Number(gd.stars)||0):0;
    setGoals(goalEntries);setStars(startStars);setRewardClaims(rd.claims||[]);setProfile({...clone(DEF_PROFILE),...pd});setHabits(hd.entries||[]);
    if(!realActivity&&(Number(gd.stars)||0)>0)await ss("sc_goals",{entries:goalEntries,stars:0});
    const e=dailyEntries?.[todayISO()]||{};
    setChecks(e.c||{});setStarAwards(e.r||{});setWater(e.w||0);setVitals(e.vitals||clone(DEF_VITALS));
    supRef.current=true;setLoaded(true);
  })();},[]);

  useEffect(()=>{if(!loaded)return;if(supRef.current){supRef.current=false;return;}clearTimeout(saveTmr.current);saveTmr.current=setTimeout(()=>{const entry={c:checks,r:starAwards,w:water,vitals};setDailyHist(prev=>{const next={...prev,[todayISO()]:entry};ss("sc_daily",{entries:next});return next;});},450);},[checks,starAwards,water,vitals,loaded]);
  useEffect(()=>{if(loaded)ss("sc_profile",profile);},[profile,loaded]);
  useEffect(()=>{try{localStorage.setItem("sc_last_tab",tab);}catch{}},[tab]);

  const addStars=async n=>{const ns=stars+n;setStars(ns);await ss("sc_goals",{entries:goals,stars:ns});};
  const saveBball=async(g,sk)=>{setGames(g);setSkills(sk);await ss("sc_bball",{games:g,skills:sk});};
  const savePrax=async p=>{setPractices(p);await ss("sc_practices",{entries:p});};
  const saveGoals=async(g,s=stars)=>{setGoals(g);setStars(s);await ss("sc_goals",{entries:g,stars:s});};
  const saveRewards=async claims=>{setRewardClaims(claims);await ss("sc_rewards",{claims});};
  const saveHabits=async entries=>{setHabits(entries);await ss("sc_habits",{entries});};
  const saveStyle=async(fits=styleLog,shoes=shoeWish)=>{setStyleLog(fits);setShoeWish(shoes);await ss("sc_style",{fits,shoes});};
  const saveRoutine=async entries=>{setRoutineHist(entries);await ss("sc_routine",{entries});};
  const saveSleep=async e=>{setSleepEntries(e);await ss("sc_sleep",{entries:e});};
  const saveSchool=async sub=>{setSubjects(sub);await ss("sc_school",{subjects:sub});};

  const activateCode=async code=>{
    const c=(code||"").trim().toUpperCase();if(c.length<4)return;
    setFCGlobal(c);setFamilyCode(c);
    const [daily,bball,prax,styleD,routineD,slp,school,gd,rd,pd,hd]=await Promise.all([sg("sc_daily"),sg("sc_bball"),sg("sc_practices"),sg("sc_style"),sg("sc_routine"),sg("sc_sleep"),sg("sc_school"),sg("sc_goals"),sg("sc_rewards"),sg("sc_profile"),sg("sc_habits")]);
    if(daily?.entries)setDailyHist(daily.entries);
    if(bball?.games)setGames(bball.games);if(bball?.skills)setSkills(bball.skills);
    if(prax?.entries)setPractices(prax.entries);
    if(styleD?.fits)setStyleLog(styleD.fits);if(styleD?.shoes)setShoeWish(styleD.shoes);
    if(routineD?.entries)setRoutineHist(routineD.entries);
    if(slp?.entries)setSleepEntries(slp.entries);
    if(school?.subjects)setSubjects(school.subjects);
    if(gd?.entries)setGoals(gd.entries);if(gd?.stars)setStars(gd.stars);
    if(rd?.claims)setRewardClaims(rd.claims);
    if(hd?.entries)setHabits(hd.entries);
    if(pd)setProfile({...clone(DEF_PROFILE),...pd});
  };

  const onEditFocus=e=>{if(["INPUT","TEXTAREA","SELECT"].includes(e.target?.tagName)){clearTimeout(editBlurT.current);setEditing(true);}};
  const onEditBlur=e=>{if(["INPUT","TEXTAREA","SELECT"].includes(e.target?.tagName)){clearTimeout(editBlurT.current);editBlurT.current=setTimeout(()=>setEditing(false),160);}};

  if(!loaded)return<div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14,fontFamily:"system-ui"}}><div style={{fontSize:52,filter:`drop-shadow(0 0 22px ${C.gold})`}}>⭐</div><div style={{fontWeight:900,fontSize:18,color:C.white}}>Loading {profile.name}'s Glow Up...</div></div>;

  const badgeData={games,practices,sleepEntries,subjects,goals,skills,dailyHist,shoeWish,styleLog,stars};
  const rewardCost=item=>{if(item?.cost)return item.cost;const p=String(item?.priority||"").toLowerCase();if(p.includes("dream"))return 3;if(p.includes("next"))return 2;return 1;};
  const approvedGoalCount=goals.filter(g=>g.parentApproved).length;
  const spentRewardTokens=rewardClaims.filter(r=>["requested","approved"].includes(r.status)).reduce((a,r)=>a+(r.cost||1),0);
  const rewardTokens=Math.max(0,approvedGoalCount-spentRewardTokens);
  const claimFor=item=>rewardClaims.find(r=>r.itemId===item.id&&r.status!=="rejected");
  const approveGoal=async id=>{
    let shouldReward=false;
    const ng=goals.map(g=>{if(g.id!==id)return g;shouldReward=!g.parentApproved;return {...g,done:true,submitted:true,parentApproved:true,approvedDate:toShort(todayISO())};});
    await saveGoals(ng,stars);
  };
  const requestReward=async item=>{
    const existing=claimFor(item);if(existing||rewardTokens<rewardCost(item))return;
    const claim={id:uid(),itemId:item.id,itemName:item.name,cost:rewardCost(item),status:"requested",date:toShort(todayISO())};
    await saveRewards([claim,...rewardClaims]);
  };
  const updateRewardClaim=async(id,status)=>{
    const nr=rewardClaims.map(r=>r.id===id?{...r,status,approvedDate:status==="approved"?toShort(todayISO()):r.approvedDate}:r);
    await saveRewards(nr);
  };

  // ── TODAY ──────────────────────────────────────────────────────────────
  const Today=()=>{
    const [newQuest,setNewQuest]=useState("");
    const done=habits.filter(h=>checks[h.id]).length;
    const total=Math.max(habits.length,1);
    const allDone=habits.length>0&&done===habits.length;
    const routineDone=Object.values(routineHist[todayISO()]?.c||{}).filter(Boolean).length;
    const horoscope=getDailyHoroscope(profile);
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
    return<div>
      <div style={{...cs,background:"radial-gradient(ellipse at 80% 10%,rgba(255,26,140,.24),transparent 50%),linear-gradient(145deg,rgba(40,15,75,.98),rgba(10,5,22,.99))",padding:18,marginBottom:14}}>
        <div style={{fontSize:11,color:C.gold,fontWeight:900,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
        <div style={{fontSize:28,fontWeight:950,lineHeight:1.1,marginBottom:6}}>Hey <span style={{background:glamGrad,WebkitBackgroundClip:"text",color:"transparent"}}>{profile.name}</span> 👑</div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{background:`${C.purple}25`,border:`1px solid ${C.purple}55`,borderRadius:999,padding:"5px 10px",fontSize:11,fontWeight:900,color:C.purple}}>⭐ {stars} stars</div>
          <div style={{background:`${C.gold}18`,border:`1px solid ${C.gold}44`,borderRadius:999,padding:"5px 10px",fontSize:11,fontWeight:900,color:C.gold}}>LV {level} {levelTitle}</div>
          {habitStreak>0&&<div style={{background:`${C.orange}18`,border:`1px solid ${C.orange}44`,borderRadius:999,padding:"5px 10px",fontSize:11,fontWeight:900,color:C.orange}}>🔥 {habitStreak} day streak</div>}
          {rewardTokens>0&&<div style={{background:`${C.green}18`,border:`1px solid ${C.green}44`,borderRadius:999,padding:"5px 10px",fontSize:11,fontWeight:900,color:C.green}}>🎟️ {rewardTokens} reward token{rewardTokens===1?"":"s"}</div>}
        </div>
        <div style={{marginTop:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:9,color:C.muted}}>LV {level}</span><span style={{fontSize:9,color:C.purple,fontWeight:800}}>{xpInLevel}/{xpPerLevel} XP to LV {level+1}</span></div>
          <div style={{height:8,background:"rgba(0,0,0,.4)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${(xpInLevel/xpPerLevel)*100}%`,background:glamGrad,borderRadius:99,transition:"width .4s"}}/></div>
        </div>
      </div>

      <div style={{...cs,borderTop:`3px solid ${C.gold}`,background:"radial-gradient(ellipse at 15% 0%,rgba(255,215,0,.18),transparent 46%),linear-gradient(145deg,rgba(32,14,62,.97),rgba(10,5,22,.99))"}}>
        <CH e="♍" title={`${horoscope.sign} Daily Vibe`} sub="For fun: a focus prompt for today"/>
        <div style={{fontSize:18,fontWeight:950,color:C.gold,marginBottom:7}}>{horoscope.vibe}</div>
        <div style={{fontSize:13,lineHeight:1.55,color:C.light,marginBottom:10}}>{horoscope.message}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div style={{padding:10,borderRadius:14,background:`${C.purple}16`,border:`1px solid ${C.purple}33`}}><div style={{fontSize:9,color:C.muted,fontWeight:900,letterSpacing:"1px"}}>POWER MOVE</div><div style={{fontSize:12,fontWeight:900,color:C.purple,marginTop:2}}>{horoscope.power}</div></div>
          <div style={{padding:10,borderRadius:14,background:`${C.gold}14`,border:`1px solid ${C.gold}33`}}><div style={{fontSize:9,color:C.muted,fontWeight:900,letterSpacing:"1px"}}>LUCKY VIBE</div><div style={{fontSize:12,fontWeight:900,color:C.gold,marginTop:2}}>{horoscope.lucky}</div></div>
        </div>
      </div>

      <div style={{...cs,borderTop:`3px solid ${C.pink}`,background:"radial-gradient(ellipse at 18% 0%,rgba(255,26,140,.22),transparent 46%),radial-gradient(ellipse at 90% 10%,rgba(0,229,204,.16),transparent 42%),linear-gradient(145deg,rgba(35,13,68,.98),rgba(8,4,18,.99))"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:12}}>
          <CH e="💫" title="Scarlett's Vibe Check" sub="Pick your mode for today"/>
          <div style={{padding:"6px 10px",borderRadius:999,background:`${C.gold}18`,border:`1px solid ${C.gold}44`,fontSize:10,fontWeight:950,color:C.gold,whiteSpace:"nowrap"}}>focus mode</div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <button onClick={()=>setVitals(p=>({...p,mode:"hoops"}))} style={{padding:12,borderRadius:18,border:`2px solid ${vitals.mode==="hoops"?C.coral:C.border}`,background:vitals.mode==="hoops"?`${C.coral}20`:"rgba(255,255,255,.045)",color:vitals.mode==="hoops"?C.white:C.muted,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",textAlign:"left"}}><div style={{fontSize:24}}>🏀</div><div style={{fontSize:12}}>Court Beast</div></button>
          <button onClick={()=>setVitals(p=>({...p,mode:"style"}))} style={{padding:12,borderRadius:18,border:`2px solid ${vitals.mode==="style"?C.pink:C.border}`,background:vitals.mode==="style"?`${C.pink}20`:"rgba(255,255,255,.045)",color:vitals.mode==="style"?C.white:C.muted,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",textAlign:"left"}}><div style={{fontSize:24}}>💅</div><div style={{fontSize:12}}>Main Character</div></button>
          <button onClick={()=>setVitals(p=>({...p,mode:"school"}))} style={{padding:12,borderRadius:18,border:`2px solid ${vitals.mode==="school"?C.teal:C.border}`,background:vitals.mode==="school"?`${C.teal}18`:"rgba(255,255,255,.045)",color:vitals.mode==="school"?C.white:C.muted,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",textAlign:"left"}}><div style={{fontSize:24}}>📚</div><div style={{fontSize:12}}>School Boss</div></button>
          <button onClick={()=>setVitals(p=>({...p,mode:"chill"}))} style={{padding:12,borderRadius:18,border:`2px solid ${vitals.mode==="chill"?C.purple:C.border}`,background:vitals.mode==="chill"?`${C.purple}20`:"rgba(255,255,255,.045)",color:vitals.mode==="chill"?C.white:C.muted,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",textAlign:"left"}}><div style={{fontSize:24}}>🌙</div><div style={{fontSize:12}}>Reset Mode</div></button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12,marginBottom:14}}>
          <div style={{padding:12,borderRadius:16,background:"rgba(0,0,0,.20)",border:`1px solid ${C.gold}30`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:11,color:C.gold,fontWeight:950,letterSpacing:"1px"}}>ENERGY LEVEL</div>
              <div style={{fontSize:10,color:C.muted,fontWeight:800}}>tap one</div>
            </div>
            <EmojiPick val={vitals.energy} emojis={["🪫","😐","🙂","🔥","⚡"]} onSet={v=>setVitals(p=>({...p,energy:v}))} col={C.gold}/>
          </div>
          <div style={{padding:12,borderRadius:16,background:"rgba(0,0,0,.20)",border:`1px solid ${C.pink}30`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:11,color:C.pink,fontWeight:950,letterSpacing:"1px"}}>MOOD / CONFIDENCE</div>
              <div style={{fontSize:10,color:C.muted,fontWeight:800}}>how are you feeling?</div>
            </div>
            <EmojiPick val={vitals.mood||vitals.confidence||0} emojis={["🙈","🙂","😎","💅","👑"]} onSet={v=>setVitals(p=>({...p,confidence:v,mood:v}))} col={C.pink}/>
          </div>
        </div>

        <div style={{padding:12,borderRadius:16,background:"rgba(0,0,0,.24)",border:`1px solid ${C.border}`,marginBottom:12}}>
          <div style={{fontSize:11,color:C.teal,fontWeight:950,letterSpacing:"1px",marginBottom:8}}>WATER POWER-UP 💧 {water>=8?"✅ maxed out":""}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:4}}>
            {Array.from({length:8},(_,i)=><button key={i} onClick={()=>setWater(i<water?i:i+1)} style={{height:36,borderRadius:"8px 8px 14px 14px",border:`2px solid ${i<water?C.teal:"rgba(255,255,255,.1)"}`,background:i<water?"#00100D":C.card2,cursor:"pointer",padding:0,position:"relative",overflow:"hidden",boxShadow:i<water?`0 0 12px ${C.teal}44`:"none"}}>
              {i<water&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"72%",background:`linear-gradient(to top,${C.teal},#70FFE0)`}}/>}
            </button>)}
          </div>
        </div>

        <input value={vitals.mantra||""} onChange={e=>setVitals(p=>({...p,mantra:e.target.value}))} placeholder="Today's motto: I will..." style={{...INP,fontWeight:800}}/>
      </div>
      <div style={cs}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <CH e="✅" title={`My Daily Quests (${done}/${habits.length})`} sub="Scarlett chooses these herself"/>
          <div style={{fontSize:11,color:C.gold,fontWeight:900}}>+1⭐ once/day</div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <input value={newQuest} onChange={e=>setNewQuest(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addQuest();}} placeholder="Type a quest I choose..." style={{...INP,flex:1}}/>
          <button onClick={addQuest} style={{width:76,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.bg,fontWeight:950,cursor:"pointer",fontFamily:"system-ui"}}>Add</button>
        </div>
        {habits.length===0&&<div style={{padding:14,borderRadius:16,background:`${C.purple}14`,border:`1px dashed ${C.purple}66`,marginBottom:12}}>
          <div style={{fontSize:14,fontWeight:950,color:C.light,marginBottom:4}}>No preset quests anymore.</div>
          <div style={{fontSize:12,color:C.muted,lineHeight:1.45}}>She types the promises she wants to follow through on — basketball, school, style, friendship, skincare, chores, or anything that earns trust.</div>
        </div>}
        <div style={{height:8,background:"rgba(0,0,0,.4)",borderRadius:99,overflow:"hidden",marginBottom:12}}>
          <div style={{height:"100%",width:`${(done/total)*100}%`,background:allDone?C.green:`linear-gradient(90deg,${C.gold},${C.orange})`,borderRadius:99,transition:"width .3s"}}/>
        </div>
                {habits.map(h=>{const ok=!!checks[h.id];return<button key={h.id} onClick={()=>toggleCheck(h.id)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 10px",borderRadius:14,cursor:"pointer",background:ok?`${C.green}14`:"rgba(255,255,255,.04)",border:`1px solid ${ok?C.green+"44":C.border}`,marginBottom:7,fontFamily:"system-ui",textAlign:"left"}}>
          <div style={{width:38,height:38,borderRadius:13,background:ok?`linear-gradient(135deg,${C.green},${C.teal})`:"rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:ok?14:20,color:C.white,boxShadow:ok?`0 0 16px ${C.green}44`:"none",flexShrink:0}}>{ok?"✓":h.e}</div>
          <div style={{flex:1,fontSize:13,fontWeight:800,color:ok?C.green:C.text,textDecoration:ok?"line-through":"none"}}>{h.label}</div>
          {ok&&<div style={{fontSize:11,color:C.green,fontWeight:900}}>+1⭐</div>}
          <span onClick={e=>{e.stopPropagation();removeQuest(h.id);}} style={{fontSize:18,color:C.muted,padding:"4px 6px",lineHeight:1}}>×</span>
        </button>;})}
        {allDone&&<div style={{padding:14,borderRadius:16,background:`linear-gradient(135deg,${C.green}22,${C.teal}14)`,border:`1px solid ${C.green}55`,textAlign:"center",marginTop:6}}><div style={{fontSize:26}}>👑</div><div style={{fontSize:14,fontWeight:950,color:C.green}}>All quests done! You're unstoppable.</div></div>}
      </div>
      <button onClick={()=>setTab("glow")} style={{width:"100%",...cs,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontSize:26}}>✨</div>
        <div style={{flex:1}}><div style={{fontWeight:900,fontSize:13,color:C.pink}}>Glow Routine</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{routineDone>0?`${routineDone} steps done today`:"Tap to start tonight's routine"}</div></div>
        <div style={{color:C.muted,fontSize:18}}>›</div>
      </button>
    </div>;
  };

  // ── HOOPS ──────────────────────────────────────────────────────────────
  const Hoops=()=>{
    const[section,setSection]=useState("game");
    const[gf,setGf]=useState({pts:"",ast:"",reb:"",stl:"",blk:"",tov:"",fgm:"",fga:"",ftm:"",fta:"",result:"Win",opp:"",effort:0,confidence:0});
    const[pf,setPf]=useState({type:"Team Practice",duration:"",effort:0,note:""});

    const ni=k=>parseInt(gf[k])||0;
    const ftPctNow=ni("fta")?Math.round(ni("ftm")/ni("fta")*100):null;
    const fgPctNow=ni("fga")?Math.round(ni("fgm")/ni("fga")*100):null;

    const logGame=async()=>{
      const pts=ni("pts");if(!gf.result)return;
      const entry={id:uid(),date:toShort(todayISO()),dateISO:todayISO(),pts,ast:ni("ast"),reb:ni("reb"),stl:ni("stl"),blk:ni("blk"),tov:ni("tov"),fgm:ni("fgm"),fga:ni("fga"),ftm:ni("ftm"),fta:ni("fta"),result:gf.result,opponent:gf.opp,effort:gf.effort,confidence:gf.confidence};
      const ng=[entry,...games].slice(0,100);await saveBball(ng,skills);
      const earn=(gf.result==="Win"?5:2)+(pts>=15?4:pts>=10?2:pts>=5?1:0)+(gf.effort>=4?1:0)+(ni("stl")>=3?1:0);
      await addStars(earn);
      setGf({pts:"",ast:"",reb:"",stl:"",blk:"",tov:"",fgm:"",fga:"",ftm:"",fta:"",result:"Win",opp:"",effort:0,confidence:0});
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

    return<div>
      <div style={{display:"flex",gap:6,marginBottom:14,background:"rgba(255,255,255,.06)",borderRadius:16,padding:5}}>
        {[["game","🏀 Game"],["practice","💪 Practice"],["skills","📊 Skills"]].map(([id,label])=>(
          <button key={id} onClick={()=>setSection(id)} style={{flex:1,padding:"10px 0",borderRadius:12,border:"none",background:section===id?`linear-gradient(135deg,${C.coral},${C.pink})`:"transparent",color:C.white,fontWeight:900,cursor:"pointer",fontSize:13,fontFamily:"system-ui"}}>{label}</button>
        ))}
      </div>

      {section==="game"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:7}}>
          {[{v:games.length,l:"Games",col:C.coral},{v:wins,l:"Wins 🏆",col:C.green},{v:a("pts"),l:"Avg Pts",col:C.gold},{v:games.length?Math.round(wins/games.length*100)+"%":"—",l:"Win %",col:C.teal}].map(({v,l,col})=><SBox key={l} value={v} label={l} color={col}/>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:7}}>
          {[{v:a("ast"),l:"Avg Ast",col:C.purple},{v:a("reb"),l:"Avg Reb",col:C.teal},{v:a("stl"),l:"Avg Stl",col:C.blue},{v:a("blk"),l:"Avg Blk",col:C.orange}].map(({v,l,col})=><SBox key={l} value={v} label={l} color={col}/>)}
        </div>
        {(ftA>0||fgA>0)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12}}>
          {ftA>0&&<SBox value={Math.round(ftM/ftA*100)+"%"} label={`FT% (${ftM}/${ftA})`} color={ftM/ftA>=.7?C.green:C.gold}/>}
          {fgA>0&&<SBox value={Math.round(fgM/fgA*100)+"%"} label={`FG% (${fgM}/${fgA})`} color={fgM/fgA>=.45?C.green:C.teal}/>}
        </div>}
        <div style={cs}>
          <CH e="➕" title="Log a Game"/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>RESULT</div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {["Win","Loss"].map(r=><button key={r} onClick={()=>setGf(p=>({...p,result:r}))} style={{flex:1,padding:14,borderRadius:16,border:`2px solid ${gf.result===r?(r==="Win"?C.green:C.red):C.border}`,background:gf.result===r?(r==="Win"?`${C.green}20`:`${C.red}18`):"rgba(255,255,255,.04)",color:gf.result===r?(r==="Win"?C.green:C.red):C.muted,fontWeight:950,cursor:"pointer",fontSize:16,fontFamily:"system-ui"}}>{r==="Win"?"🏆 Win":"💪 Loss"}</button>)}
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>MAIN STATS</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
            {[["🔥 Points","pts"],["🤝 Assists","ast"],["💪 Rebounds","reb"]].map(([l,k])=><div key={k}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:5,textAlign:"center"}}>{l}</div><input type="number" inputMode="numeric" min="0" placeholder="0" value={gf[k]} onChange={ev=>setGf(p=>({...p,[k]:ev.target.value}))} style={{...INP,textAlign:"center",fontWeight:900,fontSize:22,padding:"10px 4px"}}/></div>)}
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>DEFENSE</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
            {[["🛡️ Steals","stl"],["✋ Blocks","blk"],["⚠️ Turnovers","tov"]].map(([l,k])=><div key={k}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:5,textAlign:"center"}}>{l}</div><input type="number" inputMode="numeric" min="0" placeholder="0" value={gf[k]} onChange={ev=>setGf(p=>({...p,[k]:ev.target.value}))} style={{...INP,textAlign:"center",fontWeight:900,fontSize:22,padding:"10px 4px"}}/></div>)}
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>SHOOTING 🎯</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:7,marginBottom:6}}>
            {[["FG Made","fgm"],["FG Tried","fga"],["FT Made","ftm"],["FT Tried","fta"]].map(([l,k])=><div key={k}><div style={{fontSize:9,color:C.muted,fontWeight:700,marginBottom:5,textAlign:"center"}}>{l}</div><input type="number" inputMode="numeric" min="0" placeholder="0" value={gf[k]} onChange={ev=>setGf(p=>({...p,[k]:ev.target.value}))} style={{...INP,textAlign:"center",fontWeight:900,fontSize:18,padding:"9px 4px"}}/></div>)}
          </div>
          {(ftPctNow!==null||fgPctNow!==null)&&<div style={{display:"flex",gap:8,marginBottom:12}}>
            {fgPctNow!==null&&<div style={{flex:1,padding:"8px 10px",borderRadius:12,background:`${fgPctNow>=45?C.green:C.gold}14`,border:`1px solid ${fgPctNow>=45?C.green:C.gold}44`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:950,color:fgPctNow>=45?C.green:C.gold}}>{fgPctNow}%</div><div style={{fontSize:9,color:C.muted}}>FG%</div></div>}
            {ftPctNow!==null&&<div style={{flex:1,padding:"8px 10px",borderRadius:12,background:`${ftPctNow>=70?C.green:C.orange}14`,border:`1px solid ${ftPctNow>=70?C.green:C.orange}44`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:950,color:ftPctNow>=70?C.green:C.orange}}>{ftPctNow}%</div><div style={{fontSize:9,color:C.muted}}>FT%</div></div>}
          </div>}
          <input value={gf.opp} onChange={e=>setGf(p=>({...p,opp:e.target.value}))} placeholder="Opponent (optional)" style={{...INP,marginBottom:12}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><div style={{fontSize:10,color:C.muted,fontWeight:800,marginBottom:8}}>EFFORT ⚡</div><RD val={gf.effort} max={5} col={C.orange} onSet={v=>setGf(p=>({...p,effort:v}))}/></div>
            <div><div style={{fontSize:10,color:C.muted,fontWeight:800,marginBottom:8}}>CONFIDENCE 💜</div><RD val={gf.confidence} max={5} col={C.purple} onSet={v=>setGf(p=>({...p,confidence:v}))}/></div>
          </div>
          <button onClick={logGame} style={{width:"100%",padding:16,borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.coral},${C.pink})`,color:C.white,fontWeight:950,cursor:"pointer",fontSize:16,fontFamily:"system-ui",boxShadow:`0 12px 28px ${C.coral}33`}}>Save Game ⭐</button>
        </div>
        {games.length>0&&<div style={cs}>
          <CH e="📋" title="Game History"/>
          {games.slice(0,8).map(g=><div key={g.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:38,height:38,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,background:g.result==="Win"?`${C.green}20`:`${C.red}14`,border:`1px solid ${g.result==="Win"?C.green+"44":C.red+"33"}`,flexShrink:0}}>{g.result==="Win"?"🏆":"💪"}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:900,color:C.text,marginBottom:3}}>{g.pts} pts · {g.ast} ast · {g.reb} reb</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:3}}>
                {g.stl>0&&<span style={{fontSize:10,color:C.blue,background:`${C.blue}18`,padding:"1px 7px",borderRadius:5,fontWeight:800}}>{g.stl} stl</span>}
                {g.blk>0&&<span style={{fontSize:10,color:C.orange,background:`${C.orange}18`,padding:"1px 7px",borderRadius:5,fontWeight:800}}>{g.blk} blk</span>}
                {g.tov>0&&<span style={{fontSize:10,color:C.red,background:`${C.red}14`,padding:"1px 7px",borderRadius:5,fontWeight:800}}>{g.tov} tov</span>}
                {g.fta>0&&<span style={{fontSize:10,color:C.teal,background:`${C.teal}18`,padding:"1px 7px",borderRadius:5,fontWeight:800}}>{Math.round(g.ftm/g.fta*100)}% FT</span>}
                {g.fga>0&&<span style={{fontSize:10,color:C.gold,background:`${C.gold}18`,padding:"1px 7px",borderRadius:5,fontWeight:800}}>{Math.round(g.fgm/g.fga*100)}% FG</span>}
              </div>
              <div style={{fontSize:10,color:C.muted}}>{g.date}{g.opponent?` · vs ${g.opponent}`:""}</div>
            </div>
            <button onClick={()=>saveBball(games.filter(x=>x.id!==g.id),skills)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>×</button>
          </div>)}
        </div>}
      </>}

      {section==="practice"&&<>
        <div style={cs}>
          <CH e="➕" title="Log a Practice"/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>TYPE</div>
          <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:14}}>
            {PRACTICE_TYPES.map(t=><Chip key={t} label={t} active={pf.type===t} col={C.purple} onClick={()=>setPf(p=>({...p,type:t}))}/>)}
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>MINUTES</div>
          <input type="number" inputMode="numeric" placeholder="e.g. 60" value={pf.duration} onChange={e=>setPf(p=>({...p,duration:e.target.value}))} style={{...INP,textAlign:"center",fontSize:22,fontWeight:900,marginBottom:14}}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>EFFORT 🔥</div>
          <EmojiPick val={pf.effort} emojis={["😴","🙂","😊","💪","🔥"]} onSet={v=>setPf(p=>({...p,effort:v}))} col={C.purple}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:6,marginTop:14}}>WHAT DID YOU WORK ON? (optional)</div>
          <textarea value={pf.note} onChange={e=>setPf(p=>({...p,note:e.target.value}))} placeholder="Free throws, left-hand layups, defensive slides..." style={{...TXT,minHeight:60,marginBottom:12}}/>
          <button onClick={logPractice} style={{width:"100%",padding:16,borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.purple},${C.pink})`,color:C.white,fontWeight:950,cursor:"pointer",fontSize:16,fontFamily:"system-ui",boxShadow:`0 12px 28px ${C.purple}33`}}>Save Practice ⭐</button>
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

      {section==="skills"&&<>
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
    </div>;
  };

  // ── MY GLOW ────────────────────────────────────────────────────────────
  const MyGlow=()=>{
    const[section,setSection]=useState("routine");
    const todayRoutine=routineHist[todayISO()]||{c:{}};
    const checked=todayRoutine.c||{};
    const rDone=ROUTINE_ITEMS.filter(i=>checked[i.id]).length;
    const rPct=Math.round(rDone/ROUTINE_ITEMS.length*100);
    const toggleR=async id=>{const nc={...checked,[id]:!checked[id]};const ne={...routineHist,[todayISO()]:{c:nc}};await saveRoutine(ne);if(!checked[id])await addStars(1);};
    const[sf,setSf]=useState({bed:"21:00",wake:"06:30",quality:0});
    const calcH=(b,w)=>{try{const[bh,bm]=b.split(":").map(Number),[wh,wm]=w.split(":").map(Number);let m=(wh*60+wm)-(bh*60+bm);if(m<0)m+=1440;return Math.round(m/60*10)/10;}catch{return 0;}};
    const hoursNow=calcH(sf.bed,sf.wake);
    const addSleep=async()=>{if(!sf.quality)return;const entry={id:uid(),date:toShort(todayISO()),dateISO:todayISO(),bedtime:sf.bed,waketime:sf.wake,hours:hoursNow,quality:sf.quality};await saveSleep([entry,...sleepEntries].slice(0,90));await addStars(hoursNow>=9?3:2);setSf({bed:"21:00",wake:"06:30",quality:0});};
    const[stf,setStf]=useState({type:"Game Day",outfit:"",hair:"",shoes:"",vibe:0});
    const logFit=async()=>{if(!stf.outfit&&!stf.hair)return;const entry={id:uid(),date:toShort(todayISO()),dateISO:todayISO(),...stf};await saveStyle([entry,...styleLog].slice(0,30),shoeWish);await addStars(3);setStf({type:"Game Day",outfit:"",hair:"",shoes:"",vibe:0});};
    const[shf,setShf]=useState({name:"",why:"",priority:"Dream 🌟"});
    const addShoe=async()=>{if(!shf.name)return;const entry={id:uid(),...shf,cost:shf.priority.includes("Dream")?3:shf.priority.includes("Next")?2:1};await saveStyle(styleLog,[entry,...shoeWish].slice(0,20));setShf({name:"",why:"",priority:"Dream 🌟"});};
    const avgSleep=sleepEntries.length?avgArr(sleepEntries.slice(0,7).map(e=>e.hours)).toFixed(1):"—";

    return<div>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto"}}>
        {[["routine","✨ Routine"],["sleep","🌙 Sleep"],["style","💅 Style"],["shoes","👟 Shoes"]].map(([id,label])=>(
          <button key={id} onClick={()=>setSection(id)} style={{flexShrink:0,padding:"10px 14px",borderRadius:12,border:`1px solid ${section===id?C.pink:C.border}`,background:section===id?`${C.pink}22`:"rgba(255,255,255,.05)",color:section===id?C.light:C.muted,fontWeight:900,cursor:"pointer",fontSize:13,fontFamily:"system-ui"}}>{label}</button>
        ))}
      </div>

      {section==="routine"&&<div style={{...cs,background:"radial-gradient(ellipse at 80% 10%,rgba(255,26,140,.18),transparent 50%),linear-gradient(145deg,rgba(40,15,75,.97),rgba(10,5,22,.99))"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <CH e="✨" title={`Glow Quest (${rDone}/${ROUTINE_ITEMS.length})`}/>
          <div style={{fontSize:14,fontWeight:950,color:rPct>=100?C.green:C.gold}}>{rPct}%</div>
        </div>
        <div style={{height:10,background:"rgba(0,0,0,.35)",borderRadius:99,overflow:"hidden",marginBottom:14}}><div style={{height:"100%",width:`${rPct}%`,background:rPct>=100?C.green:glamGrad,borderRadius:99,transition:"width .3s",boxShadow:`0 0 16px ${rPct>=100?C.green:C.pink}55`}}/></div>
        {ROUTINE_ITEMS.map(item=>{const ok=!!checked[item.id];return<button key={item.id} onClick={()=>toggleR(item.id)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 10px",borderRadius:14,cursor:"pointer",background:ok?`${C.green}14`:"rgba(255,255,255,.04)",border:`1px solid ${ok?C.green+"44":C.border}`,marginBottom:7,fontFamily:"system-ui",textAlign:"left"}}>
          <div style={{width:38,height:38,borderRadius:13,background:ok?`linear-gradient(135deg,${C.green},${C.teal})`:"rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:ok?14:20,color:C.white,boxShadow:ok?`0 0 14px ${C.green}44`:"none",flexShrink:0}}>{ok?"✓":item.e}</div>
          <div style={{flex:1,fontSize:13,fontWeight:800,color:ok?C.green:C.text,textDecoration:ok?"line-through":"none"}}>{item.label}</div>
          {ok&&<div style={{fontSize:11,color:C.green,fontWeight:900}}>+1⭐</div>}
        </button>;})}
        {rPct>=100&&<div style={{padding:14,borderRadius:16,background:`${C.green}18`,border:`1px solid ${C.green}44`,textAlign:"center",marginTop:6}}><div style={{fontSize:24}}>👑</div><div style={{fontSize:14,fontWeight:950,color:C.green}}>Glow Quest complete!</div></div>}
      </div>}

      {section==="sleep"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
          <SBox value={sleepEntries.length} label="Nights" color={C.purple}/>
          <SBox value={avgSleep} label="Avg Hours" color={sleepEntries.length&&parseFloat(avgSleep)>=8?C.green:C.orange}/>
          <SBox value={sleepEntries[0]?.quality||"—"} label="Last Quality" color={C.teal}/>
        </div>
        <div style={cs}>
          <CH e="🌙" title="Log Sleep"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div><div style={{fontSize:10,color:C.muted,fontWeight:800,marginBottom:4}}>BEDTIME</div><input type="time" value={sf.bed} onChange={e=>setSf(p=>({...p,bed:e.target.value}))} style={{...INP,textAlign:"center",fontWeight:850}}/></div>
            <div><div style={{fontSize:10,color:C.muted,fontWeight:800,marginBottom:4}}>WAKE TIME</div><input type="time" value={sf.wake} onChange={e=>setSf(p=>({...p,wake:e.target.value}))} style={{...INP,textAlign:"center",fontWeight:850}}/></div>
          </div>
          <div style={{textAlign:"center",padding:10,borderRadius:14,background:"rgba(0,0,0,.22)",border:`1px solid ${C.teal}33`,marginBottom:12}}>
            <div style={{fontSize:24,fontWeight:950,color:hoursNow>=9?C.green:hoursNow>=8?C.teal:C.orange}}>{hoursNow}h</div>
            <div style={{fontSize:10,color:C.muted}}>sleep tonight</div>
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>SLEEP QUALITY</div>
          <EmojiPick val={sf.quality} emojis={["😩","😴","😐","😊","😍"]} onSet={v=>setSf(p=>({...p,quality:v}))} col={C.purple}/>
          <button onClick={addSleep} style={{width:"100%",marginTop:14,padding:14,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.purple},${C.blue})`,color:C.white,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:14}}>Save Sleep 🌙</button>
        </div>
        {sleepEntries.length>0&&<div style={cs}>
          <CH e="📊" title="Sleep History"/>
          <div style={{display:"flex",alignItems:"flex-end",gap:5,height:60,marginBottom:10}}>
            {[...sleepEntries.slice(0,7)].reverse().map((e,i)=>{const h=Math.max(6,Math.round((e.hours/10)*52));const col=e.hours>=9?C.green:e.hours>=8?C.teal:e.hours>=7?C.gold:C.orange;return<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><div style={{fontSize:8,color:col,fontWeight:800}}>{e.hours}h</div><div style={{width:"100%",height:h,background:col,borderRadius:"5px 5px 2px 2px",opacity:.85}}/><div style={{fontSize:7,color:C.muted}}>{(e.date||"").replace(/,.*/,"")}</div></div>;})}
          </div>
        </div>}
      </>}

      {section==="style"&&<>
        <div style={cs}>
          <CH e="💅" title="Log a Fit"/>
          <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:14}}>
            {STYLE_TYPES.map(t=><Chip key={t} label={t} active={stf.type===t} col={C.pink} onClick={()=>setStf(p=>({...p,type:t}))}/>)}
          </div>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:6}}>OUTFIT 👚</div>
          <input value={stf.outfit} onChange={e=>setStf(p=>({...p,outfit:e.target.value}))} placeholder="What are you wearing?" style={{...INP,marginBottom:12}}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:6}}>HAIR 💇‍♀️</div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:6}}>
            {HAIR_IDEAS.map(h=><Chip key={h} label={h} active={stf.hair===h} col={C.purple} onClick={()=>setStf(p=>({...p,hair:p.hair===h?"":h}))}/>)}
          </div>
          <input value={stf.hair} onChange={e=>setStf(p=>({...p,hair:e.target.value}))} placeholder="Or type hair style..." style={{...INP,marginBottom:12}}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:6}}>SHOES 👟</div>
          <input value={stf.shoes} onChange={e=>setStf(p=>({...p,shoes:e.target.value}))} placeholder="What shoes?" style={{...INP,marginBottom:12}}/>
          <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:8}}>VIBE ✨</div>
          <EmojiPick val={stf.vibe} emojis={["😐","🙂","😊","😍","💅"]} onSet={v=>setStf(p=>({...p,vibe:v}))} col={C.pink}/>
          <button onClick={logFit} style={{width:"100%",marginTop:14,padding:14,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.pink},${C.purple})`,color:C.white,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:14}}>Save Fit 💅</button>
        </div>
        {styleLog.length>0&&<div style={cs}>
          <CH e="📸" title="Fit History"/>
          {styleLog.slice(0,6).map(f=><div key={f.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div><div style={{fontSize:12,fontWeight:950,color:C.pink,marginBottom:4}}>{f.type} · {f.date}</div>
              {f.outfit&&<div style={{fontSize:12,color:C.text,marginBottom:2}}>👚 {f.outfit}</div>}
              {f.hair&&<div style={{fontSize:11,color:C.muted}}>💇‍♀️ {f.hair}</div>}
              {f.shoes&&<div style={{fontSize:11,color:C.gold,marginTop:2}}>👟 {f.shoes}</div>}</div>
              <button onClick={()=>saveStyle(styleLog.filter(x=>x.id!==f.id),shoeWish)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18,padding:4}}>×</button>
            </div>
          </div>)}
        </div>}
      </>}

      {section==="shoes"&&<>
        <div style={cs}>
          <CH e="👟" title="Shoe Wishlist"/>
          <input value={shf.name} onChange={e=>setShf(p=>({...p,name:e.target.value}))} placeholder="Shoe name (e.g. Nike Air Zoom)" style={{...INP,marginBottom:10}}/>
          <input value={shf.why} onChange={e=>setShf(p=>({...p,why:e.target.value}))} placeholder="Why I want them..." style={{...INP,marginBottom:10}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
            {SHOE_PRIORITY.map(p=><Chip key={p} label={p} active={shf.priority===p} col={C.gold} onClick={()=>setShf(x=>({...x,priority:p}))}/>)}
          </div>
          <button onClick={addShoe} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.bg,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:14}}>Add to Wishlist ✨</button>
        </div>
        {shoeWish.length>0&&<div style={cs}>
          <CH e="🌟" title="My Wishlist"/>
          {shoeWish.map(s=><div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontSize:26}}>👟</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:950,color:C.white}}>{s.name}</div><div style={{fontSize:11,color:C.gold}}>{s.priority}</div>{s.why&&<div style={{fontSize:10,color:C.muted,marginTop:1}}>{s.why}</div>}</div>
            <button onClick={()=>saveStyle(styleLog,shoeWish.filter(x=>x.id!==s.id))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>×</button>
          </div>)}
        </div>}
        {shoeWish.length===0&&<div style={{textAlign:"center",padding:"30px 20px",color:C.muted}}><div style={{fontSize:40,marginBottom:10}}>👟</div><div style={{fontSize:13}}>Add shoes you want to your wishlist!</div></div>}
      </>}
    </div>;
  };

  // ── GOALS ──────────────────────────────────────────────────────────────
  const Goals=()=>{
    const[gf,setGf]=useState({text:"",category:"basketball",targetDate:addDays(7)});
    const[burst,setBurst]=useState(null);
    const CAT={basketball:{col:C.coral,icon:"🏀"},school:{col:C.teal,icon:"📚"},health:{col:C.green,icon:"💚"},character:{col:C.purple,icon:"⭐"}};
    const active=goals.filter(g=>!g.done);
    const done=goals.filter(g=>g.done).length;
    const addGoal=async()=>{if(!gf.text.trim())return;const entry={id:uid(),text:gf.text.trim(),category:gf.category,targetDate:gf.targetDate,done:false,date:toShort(todayISO())};await saveGoals([...goals,entry]);setGf({text:"",category:"basketball",targetDate:addDays(7)});};
    const toggleGoal=async id=>{const ng=goals.map(g=>{if(g.id!==id)return g;const completing=!g.done;if(completing){setBurst(id);setTimeout(()=>setBurst(null),2200);return{...g,done:true,submitted:true,parentApproved:false,completedDate:toShort(todayISO())};}return{...g,done:false,submitted:false,parentApproved:false,completedDate:"",approvedDate:""};});await saveGoals(ng);};
    const weakestSkill=Object.entries(skills).sort((a,b)=>a[1]-b[1])[0]||null;
    const templates=[
      {text:"Practice shooting for 15 minutes, 4 times this week",category:"basketball"},
      {text:"Turn in all homework on time this week",category:"school"},
      {text:"Be in bed by 9:00 PM for 5 nights this week",category:"health"},
      {text:"Use positive self-talk at every practice",category:"character"},
    ];
    if(weakestSkill)templates.unshift({text:`Improve ${weakestSkill[0]} with 15 focused minutes a day this week`,category:"basketball"});
    const insights=generateInsights(profile,games,practices,skills,subjects,sleepEntries,vitals,goals);
    const readiness=computeReadiness(vitals,sleepEntries);
    const r=readiness.score!=null?readiness.score:0;
    const C2=2*Math.PI*30,dash=C2-(r/100)*C2;

    return<div>
      {burst&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,pointerEvents:"none",fontSize:56,filter:`drop-shadow(0 0 24px ${C.gold})`}}>🎉 ⭐ 🎯</div>}

      <div style={{...cs,background:"radial-gradient(ellipse at 75% 0%,rgba(255,215,0,.18),transparent 45%),linear-gradient(145deg,rgba(40,15,75,.98),rgba(10,5,22,.99))",borderTop:`3px solid ${C.gold}`}}>
        <CH e="🤝" title="Goal Deal" sub="Set it. Do it. Parent approves it. Unlock rewards."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
          <SBox value={active.length} label="Active" color={C.coral}/>
          <SBox value={goals.filter(g=>g.done&&!g.parentApproved).length} label="Needs OK" color={C.gold}/>
          <SBox value={rewardTokens} label="Reward Tokens" color={C.green}/>
        </div>
        <div style={{fontSize:12,color:C.muted,lineHeight:1.55}}>A completed goal doesn't unlock a reward until a parent verifies the follow-through. Each approved goal gives <span style={{color:C.gold,fontWeight:900}}>1 Reward Token</span> toward shoes, clothes, or wishlist items.</div>
      </div>

      <div style={{...cs,background:"linear-gradient(135deg,rgba(54,24,102,.98),rgba(16,7,35,.98))"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
          <svg width={72} height={72} style={{filter:`drop-shadow(0 0 14px ${readiness.level.col}55)`,flexShrink:0}}>
            <circle cx={36} cy={36} r={30} fill="rgba(0,0,0,.42)" stroke="rgba(255,255,255,.1)" strokeWidth={6}/>
            <circle cx={36} cy={36} r={30} fill="none" stroke={readiness.level.col} strokeWidth={6} strokeLinecap="round" strokeDasharray={C2} strokeDashoffset={dash} transform="rotate(-90 36 36)" style={{transition:"all .6s"}}/>
            <text x={36} y={40} textAnchor="middle" fill={C.text} fontSize={14} fontWeight={900} fontFamily="system-ui">{readiness.displayValue}</text>
          </svg>
          <div>
            <div style={{fontSize:10,color:C.light,fontWeight:900,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>AI Coach 🤖</div>
            <div style={{fontSize:16,fontWeight:950,color:readiness.level.col,marginBottom:4}}>{readiness.level.label}</div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{readiness.starter?"Do your Today check-in so Coach can see your energy!":readiness.score>=80?"You're feeling great — go have a strong day.":readiness.score>=65?"You're ready to roll. Train as planned.":readiness.score>=50?"Good day for quality reps and clean form.":"A lighter day is okay. Rest still counts."}</div>
          </div>
        </div>
        {insights.slice(0,3).map((ins,i)=><div key={i} style={{display:"flex",gap:9,padding:"8px 0",borderTop:`1px solid ${C.border}`,alignItems:"flex-start"}}>
          <div style={{fontSize:14,flexShrink:0}}>{ins.icon}</div>
          <div style={{flex:1,fontSize:12,color:C.text,lineHeight:1.5}}>{ins.text}</div>
          <div style={{width:3,borderRadius:99,background:ins.col,alignSelf:"stretch",minHeight:20,flexShrink:0,boxShadow:`0 0 10px ${ins.col}77`}}/>
        </div>)}
        {insights.length===0&&<div style={{fontSize:11,color:C.muted,lineHeight:1.6,marginTop:4}}>Log games, practices, and sleep — Coach gets smarter with every entry.</div>}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
        <SBox value={active.length} label="Active" color={C.purple}/>
        <SBox value={done} label="Done ✅" color={C.green}/>
        <SBox value={stars} label="⭐ Stars" color={C.gold}/>
      </div>

      <div style={{...cs,marginBottom:12}}>
        <CH e="✨" title="Add a Goal"/>
        <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:12}}>
          {templates.map((t,i)=><button key={i} onClick={()=>setGf(p=>({...p,text:t.text,category:t.category}))} style={{flexShrink:0,padding:"8px 12px",borderRadius:12,border:`1px solid ${CAT[t.category].col}44`,background:`${CAT[t.category].col}14`,color:C.text,cursor:"pointer",fontSize:11,fontWeight:800,fontFamily:"system-ui",maxWidth:180,textAlign:"left"}}>{CAT[t.category].icon} {t.text.slice(0,30)}…</button>)}
        </div>
        <textarea value={gf.text} onChange={e=>setGf(p=>({...p,text:e.target.value}))} placeholder="What do you want to achieve? Be specific!" style={{...TXT,marginBottom:10}}/>
        <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
          {Object.entries(CAT).map(([k,v])=><Chip key={k} label={`${v.icon} ${k}`} active={gf.category===k} col={v.col} onClick={()=>setGf(p=>({...p,category:k}))}/>)}
        </div>
        <div style={{fontSize:11,color:C.muted,fontWeight:800,marginBottom:6}}>TARGET DATE</div>
        <input type="date" value={gf.targetDate} onChange={e=>setGf(p=>({...p,targetDate:e.target.value}))} style={{...INP,marginBottom:12}}/>
        <button onClick={addGoal} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.bg,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:15}}>Add Goal 🎯</button>
      </div>

      {active.length>0&&<div style={cs}>
        <CH e="🎯" title="Active Goals"/>
        {active.map(g=>{const cat=CAT[g.category]||CAT.basketball;return<div key={g.id} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <button onClick={()=>toggleGoal(g.id)} style={{width:32,height:32,borderRadius:10,border:`2px solid ${cat.col}44`,background:`${cat.col}14`,color:cat.col,cursor:"pointer",fontSize:16,flexShrink:0,fontFamily:"system-ui"}}>{cat.icon}</button>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:850,color:C.text,lineHeight:1.4}}>{g.text}</div><div style={{fontSize:10,color:C.muted,marginTop:4}}>Target: {g.targetDate||"No date"}</div></div>
            <button onClick={()=>saveGoals(goals.filter(x=>x.id!==g.id))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>×</button>
          </div>
        </div>;})}
      </div>}

      {done>0&&<div style={cs}>
        <CH e="✅" title={`Completed (${done})`} sub="Parent approval turns follow-through into reward tokens."/>
        {goals.filter(g=>g.done).slice(0,8).map(g=><div key={g.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{fontSize:18}}>{g.parentApproved?"🎟️":"⏳"}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:g.parentApproved?C.green:C.gold,textDecoration:g.parentApproved?"line-through":"none",fontWeight:800,lineHeight:1.35}}>{g.text}</div>
              <div style={{fontSize:9,color:C.muted,marginTop:3}}>{g.parentApproved?`Approved ${g.approvedDate||""} · 1 Reward Token earned`:"Waiting for parent approval"}</div>
            </div>
            {!g.parentApproved&&<button onClick={()=>approveGoal(g.id)} style={{padding:"8px 10px",borderRadius:10,border:`1px solid ${C.green}44`,background:`${C.green}16`,color:C.green,fontWeight:900,cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Parent OK ✓</button>}
            <button onClick={()=>toggleGoal(g.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:11}}>undo</button>
          </div>
        </div>)}
      </div>}
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
      <div style={{...cs,background:"radial-gradient(ellipse at 80% 0%,rgba(255,215,0,.22),transparent 45%),linear-gradient(145deg,rgba(40,15,75,.98),rgba(10,5,22,.99))",borderTop:`3px solid ${C.gold}`}}>
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
              <div style={{fontSize:26}}>🎁</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:950,color:C.white}}>{item.name}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:2}}>{item.priority||"Wishlist"} · Costs {cost} token{cost===1?"":"s"}</div>
                {item.why&&<div style={{fontSize:10,color:C.gold,marginTop:2}}>{item.why}</div>}
                {claim&&<div style={{fontSize:10,color:claim.status==="approved"?C.green:C.gold,marginTop:3,fontWeight:900}}>Status: {claim.status==="approved"?"✅ Parent approved!":"⏳ Requested — waiting for parent"}</div>}
              </div>
              {!claim&&<button disabled={!enough} onClick={()=>requestReward(item)} style={{padding:"9px 10px",borderRadius:11,border:`1px solid ${enough?C.gold:C.border}`,background:enough?`${C.gold}18`:"rgba(255,255,255,.04)",color:enough?C.gold:C.muted,fontWeight:900,cursor:enough?"pointer":"not-allowed",fontSize:11,fontFamily:"system-ui",whiteSpace:"nowrap"}}>{enough?"Request 🎟️":"Need tokens"}</button>}
              {claim?.status==="requested"&&<button onClick={()=>updateRewardClaim(claim.id,"approved")} style={{padding:"9px 10px",borderRadius:11,border:`1px solid ${C.green}44`,background:`${C.green}16`,color:C.green,fontWeight:900,cursor:"pointer",fontSize:11,fontFamily:"system-ui",whiteSpace:"nowrap"}}>Parent OK ✓</button>}
            </div>;
          })
        }
      </div>

      <div style={{...cs,background:"radial-gradient(ellipse at 80% 10%,rgba(255,26,140,.24),transparent 50%),linear-gradient(145deg,rgba(40,15,75,.98),rgba(10,5,22,.99))",textAlign:"center",padding:20}}>
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

  const CONTENT={today:Today,hoops:Hoops,glow:MyGlow,goals:Goals,progress:Progress};

  return<div style={{background:"radial-gradient(circle at 12% -8%,rgba(248,95,200,.18),transparent 28%),radial-gradient(circle at 92% 4%,rgba(44,230,209,.10),transparent 26%),linear-gradient(180deg,#0F0B1C,#080612 58%,#05040B)",minHeight:"100vh",fontFamily:"system-ui,-apple-system,sans-serif",color:C.text}}>
    <style>{`*{box-sizing:border-box} button,[role="button"]{-webkit-tap-highlight-color:transparent;touch-action:manipulation;user-select:none;appearance:none} input,textarea,select{font-size:16px!important} ::-webkit-scrollbar{display:none} body{margin:0;overflow-x:hidden}`}</style>
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",position:"relative",boxShadow:"0 0 100px rgba(255,26,140,.12)"}}>

      <div style={{position:"sticky",top:0,zIndex:50,padding:"10px 14px 9px",background:"linear-gradient(180deg,rgba(15,0,28,.96),rgba(15,0,28,.80))",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:900,fontSize:22,letterSpacing:"-.5px",lineHeight:1}}><span style={{color:C.gold}}>✦</span> <span style={{background:glamGrad,WebkitBackgroundClip:"text",color:"transparent"}}>{profile.name}</span></div>
            <div style={{display:"flex",alignItems:"center",gap:7,marginTop:4}}>
              <div style={{width:72,height:5,background:"rgba(255,255,255,.10)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${(xpInLevel/xpPerLevel)*100}%`,background:glamGrad,borderRadius:99,transition:"width .4s"}}/></div>
              <span style={{fontSize:9,color:C.purple,fontWeight:900}}>LV {level} {levelTitle}</span>
              {habitStreak>1&&<span style={{fontSize:9,color:C.orange,fontWeight:900}}>🔥{habitStreak}</span>}
              {familyCode&&<span style={{fontSize:9,color:C.teal,fontWeight:900}}>☁ {familyCode}</span>}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:19,fontWeight:950,color:C.gold,textShadow:`0 0 16px ${C.gold}88`,lineHeight:1}}>⭐ {stars}</div><div style={{fontSize:8,color:C.muted,fontWeight:800}}>STARS</div></div>
            <button onClick={()=>setShowSettings(!showSettings)} style={{width:34,height:34,borderRadius:11,background:"rgba(255,255,255,.07)",border:`1px solid ${C.border}`,color:C.muted,fontSize:16,cursor:"pointer"}}>⚙️</button>
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
            <button onClick={()=>activateCode(codeInput)} style={{width:"100%",padding:13,borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.purple},${C.pink})`,color:C.white,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:14,marginBottom:8}}>Connect ☁</button>
            <button onClick={()=>activateCode(genCode())} style={{width:"100%",padding:13,borderRadius:12,border:`1px solid ${C.teal}44`,background:`${C.teal}12`,color:C.teal,fontWeight:950,cursor:"pointer",fontFamily:"system-ui",fontSize:14}}>Create New Family Code ✨</button>
          </>}
        </div>
      </div>}

      {/* ── FIX: use StableRenderer with key={tab} so each tab's useState hooks work ── */}
      <div onFocusCapture={onEditFocus} onBlurCapture={onEditBlur} style={{padding:"14px 14px calc(90px + env(safe-area-inset-bottom,0px))"}}>
        <StableRenderer key={tab} render={CONTENT[tab]||Today}/>
      </div>

      <div style={{position:"fixed",left:"50%",bottom:"max(8px,env(safe-area-inset-bottom,0px))",transform:editing?"translate(-50%,calc(125% + 20px))":"translateX(-50%)",opacity:editing?0:1,pointerEvents:editing?"none":"auto",transition:"transform .22s ease,opacity .18s ease",width:"min(400px,calc(100% - 20px))",display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:3,background:"rgba(12,0,25,.92)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.13)",borderRadius:22,padding:"7px 6px calc(7px + env(safe-area-inset-bottom,0px))",boxShadow:"0 18px 50px rgba(0,0,0,.45)",zIndex:60}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?`${C.pink}22`:"transparent",border:"none",borderRadius:16,color:tab===t.id?C.pink:C.muted,padding:"6px 2px",fontFamily:"system-ui",fontWeight:900,cursor:"pointer"}}><div style={{fontSize:tab===t.id?20:18,lineHeight:1}}>{t.e}</div><div style={{fontSize:7,marginTop:2,letterSpacing:".3px"}}>{t.label}</div></button>)}
      </div>
    </div>
  </div>;
}
