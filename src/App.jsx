import React, { useState, useEffect, useRef } from "react";

// ── PREMIUM EDITORIAL PALETTE — matches screenshot exactly ────────────────
const C={
  bg:"#0E0B08",card:"#1B1612",card2:"#221D18",card3:"#2A231D",
  cream:"#F0E8DC",cream2:"#E8DDD0",cream3:"#DDD0C0",
  rose:"#C47B8A",roseDark:"#A86373",roseLight:"#D4959E",
  gold:"#C9973A",goldLight:"#DDB75A",
  text:"#EDE5DA",textDim:"#C8BEB0",
  muted:"#8A7D70",mutedLight:"#A89880",
  border:"rgba(220,185,150,.07)",borderMed:"rgba(220,185,150,.13)",borderStrong:"rgba(220,185,150,.22)",
  green:"#7A9B7F",sage:"#8FAA8A",
  teal:"#7AABA3",blue:"#7A9AB5",
  white:"#FFFFFF",black:"#000000",
  overlay:"rgba(14,11,8,.92)",
  // Light card text
  textOnLight:"#2A1F18",mutedOnLight:"#6B5C50",
};

const TABS=[
  {id:"today",label:"Today"},
  {id:"goals",label:"Goals"},
  {id:"hoops",label:"Sports"},
  {id:"rewards",label:"Rewards"},
  {id:"progress",label:"Progress"},
];

// ── SVG ICONS matching screenshot style ───────────────────────────────────
const Ico={
  home:(col,sz=22)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3l9 9" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  goals:(col,sz=22)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={col} strokeWidth="1.8"/><circle cx="12" cy="12" r="5" stroke={col} strokeWidth="1.8"/><circle cx="12" cy="12" r="1.5" fill={col}/></svg>,
  sports:(col,sz=22)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={col} strokeWidth="1.8"/><path d="M12 3c0 0 2 4 2 9s-2 9-2 9" stroke={col} strokeWidth="1.8"/><path d="M3 12h18" stroke={col} strokeWidth="1.8"/><path d="M5 7c2 1 4.5 1.5 7 1.5S16 8 19 7" stroke={col} strokeWidth="1.3"/><path d="M5 17c2-1 4.5-1.5 7-1.5s4.5.5 7 1.5" stroke={col} strokeWidth="1.3"/></svg>,
  rewards:(col,sz=22)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><rect x="3" y="10" width="18" height="11" rx="2" stroke={col} strokeWidth="1.8"/><path d="M3 10V8a5 5 0 0110 0v2" stroke={col} strokeWidth="1.8"/><path d="M21 10V8a5 5 0 00-10 0v2" stroke={col} strokeWidth="1.8"/><line x1="12" y1="10" x2="12" y2="21" stroke={col} strokeWidth="1.8"/></svg>,
  progress:(col,sz=22)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><rect x="3" y="15" width="4" height="6" rx="1" fill={col} opacity=".6"/><rect x="10" y="10" width="4" height="11" rx="1" fill={col} opacity=".8"/><rect x="17" y="5" width="4" height="16" rx="1" fill={col}/></svg>,
  check:(col,sz=18)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={col} opacity=".15"/><path d="M7 12l3.5 3.5L17 9" stroke={col} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clock:(col,sz=18)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={col} strokeWidth="1.6"/><path d="M12 7v5l3 3" stroke={col} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  star:(col,sz=16)=><svg width={sz} height={sz} viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18l-6.2 3 1.2-6.8L2 9.3l6.9-1z" fill={col}/></svg>,
  flame:(col,sz=20)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><path d="M12 2c0 0 6 6.5 6 11a6 6 0 01-12 0c0-1.5.5-3 1.5-4.5 0 2 1 3.5 2.5 4 0-3 2-5.5 2-10.5z" stroke={col} strokeWidth="1.6" fill={col} fillOpacity=".15" strokeLinejoin="round"/></svg>,
  alert:(col,sz=20)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><path d="M12 2a7 7 0 017 7v3l2 3H3l2-3V9a7 7 0 017-7z" stroke={col} strokeWidth="1.6"/><path d="M10 19a2 2 0 004 0" stroke={col} strokeWidth="1.6"/></svg>,
  plus:(col,sz=20)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={col} strokeWidth="1.6"/><path d="M12 8v8M8 12h8" stroke={col} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  edit:(col,sz=16)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={col} strokeWidth="1.6" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trash:(col,sz=16)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke={col} strokeWidth="1.6" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" stroke={col} strokeWidth="1.6" strokeLinecap="round"/><path d="M9 6V4h6v2" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  crown:(col,sz=16)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><path d="M2 19h20M3 19L5 8l4.5 5L12 4l2.5 9L19 8l2 11" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrow:(col,sz=16)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  basketball:(col,sz=20)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={col} strokeWidth="1.6"/><path d="M12 3c0 0 2 4.5 2 9s-2 9-2 9M3 12h18M6.3 6.3C7.8 8 9.5 9 12 9s4.2-1 5.7-2.7M6.3 17.7C7.8 16 9.5 15 12 15s4.2 1 5.7 2.7" stroke={col} strokeWidth="1.3"/></svg>,
  school:(col,sz=20)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><path d="M4 19V9L12 4l8 5v10" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><rect x="9" y="13" width="6" height="6" rx="1" stroke={col} strokeWidth="1.5"/><path d="M12 4v3" stroke={col} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  heart:(col,sz=20)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={col} strokeWidth="1.6" fill={col} fillOpacity=".12"/></svg>,
  person:(col,sz=20)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={col} strokeWidth="1.6"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={col} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  virgo:(col,sz=22)=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"><path d="M4 5v10a3 3 0 003 3h0a3 3 0 003-3v-4a3 3 0 013-3h0a3 3 0 013 3v7" stroke={col} strokeWidth="1.8" strokeLinecap="round"/></svg>,
};

const DEF_SKILLS={"Ball Handling":35,"Shooting Form":30,"Layups":35,"Free Throws":30,"Passing":35,"Court Vision":30,"Defense":30,"Rebounding":30,"Footwork":30,"Speed & Agility":35,"Conditioning":35,"Basketball IQ":30,"Confidence":45,"Leadership":40};
const DEF_SUBJECTS={Math:3,Reading:4,Science:3,"Social Studies":3,Writing:3};
const DEF_PROFILE={name:"Scarlett",grade:"5th",teamName:"",emoji:"⭐",primaryGoal:"All-around player",birthDate:"2015-08-28",zodiac:"Virgo"};
const PRACTICE_TYPES=["Team Practice","Home Workout","Shooting","Ball Handling","Defense","Full Workout"];
const LEVEL_TITLES=["Rookie","Rising Star","Athlete","Contender","Competitor","Elite","All-Star","Champion","Legend","Icon"];
const ROUTINE_ITEMS=[{id:"face",e:"🫧",label:"Wash face"},{id:"moisturizer",e:"💧",label:"Moisturizer"},{id:"teeth",e:"🪥",label:"Brush teeth"},{id:"hair",e:"🎀",label:"Hair care"},{id:"outfit",e:"👚",label:"Pick tomorrow's outfit"},{id:"backpack",e:"🎒",label:"Pack backpack"},{id:"water_b",e:"💦",label:"Water bottle ready"},{id:"read",e:"📖",label:"Read or calm down time"}];
const DEF_HABITS=[];
const SHOE_PRIORITY=["Dream 🌟","Next Up 🔜","Maybe 🤔","Have It ✅"];
const GRADE_COL={"4":C.green,"3":C.teal,"2":C.gold,"1":"#E87A5A"};
const SKILL_LEVEL=v=>v>=75?"Elite":v>=55?"Strong":v>=35?"Building":"Beginner";
const SKILL_COL=v=>v>=75?C.green:v>=55?C.teal:v>=35?C.gold:C.rose;

const uid=()=>`${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
const pad2=n=>String(n).padStart(2,"0");
const dateToLocalISO=d=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const todayISO=()=>dateToLocalISO(new Date());
// Local calendar day count — rotates at 12:00 AM on device
const localDayNum=()=>{const n=new Date();const t=new Date(n.getFullYear(),n.getMonth(),n.getDate());const e=new Date(2026,0,1);return Math.max(0,Math.floor((t-e)/86400000));};
const toShort=iso=>new Date(`${iso||todayISO()}T12:00:00`).toLocaleDateString("en-US",{month:"short",day:"numeric"});
const shiftISO=(iso,d)=>{const dt=new Date(`${iso}T12:00:00`);dt.setDate(dt.getDate()+d);return dateToLocalISO(dt);};
const clone=o=>JSON.parse(JSON.stringify(o));
const safeArray=v=>Array.isArray(v)?v:[];
const safeObjects=v=>safeArray(v).filter(x=>x&&typeof x==="object");
const avgArr=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;
const normGrade=g=>String(g||3);
const gradeValue=g=>({4:4,3:3,2:2,1:1}[normGrade(g)]||0);
const gpaCalc=subs=>{const v=Object.values(subs).map(g=>gradeValue(g)||0);return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1):"—";};
const addDays=(n=7)=>{const d=new Date();d.setDate(d.getDate()+n);return dateToLocalISO(d);};
const nextGoalNumber=goals=>Math.max(0,...(goals||[]).map(g=>parseInt(g.goalNo||0)||0))+1;
const goalCodeFor=(goals,goal)=>`G-${String(goal?.goalNo||((safeObjects(goals).findIndex(g=>g.id===goal?.id)+1)||1)).padStart(3,"0")}`;
const glamGrad=`linear-gradient(135deg,${C.rose} 0%,${C.roseDark} 100%)`;
const goldGrad=`linear-gradient(135deg,${C.gold} 0%,${C.goldLight} 100%)`;

// ── HOROSCOPE ─────────────────────────────────────────────────────────────
const DAILY_HOROSCOPE=[
  {vibe:"Virgo focus queen",message:"Your superpower today is noticing the little details others miss. Pick one tiny promise and finish it all the way.",power:"Finish one thing fully",lucky:"Gold stars"},
  {vibe:"Clean routine energy",message:"A Virgo glow-up starts with order. Clear one small mess, prep one thing early, and your whole day feels lighter.",power:"Prep before pressure",lucky:"Clean outfit"},
  {vibe:"Court discipline",message:"Reps do not need to be perfect to count. Keep your form clean, your feet active, and your mind locked in.",power:"15 focused reps",lucky:"Basketball shoes"},
  {vibe:"School boss mode",message:"Your brain is sharp today. Start with the hardest school task first so the rest of the day feels easier.",power:"Hard thing first",lucky:"Purple pen"},
  {vibe:"Main character calm",message:"You do not have to rush to prove anything. Move with confidence, stay kind, and let your follow-through speak.",power:"Calm confidence",lucky:"Soft glam"},
  {vibe:"Trendsetter Virgo",message:"You do not have to copy every trend. Choose what fits your style, your confidence, and the person you are becoming.",power:"Be original",lucky:"Something shiny"},
  {vibe:"Reward mindset",message:"The wishlist is not just stuff. It is proof that discipline, goals, and follow-through turn into real rewards.",power:"Earn it first",lucky:"Dream item"},
  {vibe:"Practice promise",message:"A little practice done today beats a perfect plan saved for later. Start small and let momentum build.",power:"Start for 5 minutes",lucky:"Pink notebook"},
  {vibe:"Virgo reset",message:"If the day feels messy, reset one thing: your room, your backpack, your attitude, or your next choice.",power:"Reset and restart",lucky:"Fresh start"},
  {vibe:"Glow-up details",message:"Tiny habits make the glow-up real. Face care, outfit prep, and sleep are quiet wins that stack up.",power:"Do the routine",lucky:"Glowy skin"},
  {vibe:"Leader energy",message:"Lead by example today. Be the teammate who listens, hustles, and keeps the mood strong.",power:"Encourage someone",lucky:"Team colors"},
  {vibe:"Confidence builder",message:"Confidence grows when you keep promises to yourself. Do one thing you said you would do.",power:"Keep the promise",lucky:"Crown emoji"},
  {vibe:"Free throw mindset",message:"Slow down, breathe, and repeat. Virgo energy loves a routine — use it to build consistency.",power:"Same routine every time",lucky:"Free throws"},
  {vibe:"No drama discipline",message:"Protect your peace today. Put your energy into school, practice, style, and goals — not distractions.",power:"Stay unbothered",lucky:"Teal accent"},
  {vibe:"Smart girl era",message:"Asking for help is not weakness. It is strategy. Smart players and smart students use their resources.",power:"Ask one question",lucky:"Study notes"},
  {vibe:"Hustle with heart",message:"Give effort even when nobody is clapping. The work still counts, and you are building trust with yourself.",power:"Quiet hustle",lucky:"Sneaker laces"},
  {vibe:"Better than yesterday",message:"You do not need to beat everyone today. Just beat yesterday's version of you by one small choice.",power:"One percent better",lucky:"Practice fit"},
  {vibe:"Soft but strong",message:"You can be sweet and still be serious about your goals. Kindness and discipline can both be yours.",power:"Kind and locked in",lucky:"Pink + black"},
  {vibe:"Game-day brain",message:"See the floor, make the pass, take the open shot, and trust the work you have done.",power:"Trust your training",lucky:"Jersey number"},
  {vibe:"Routine queen",message:"A routine is not boring when it gets you closer to the girl you want to become.",power:"Keep the streak alive",lucky:"Night routine"},
  {vibe:"Dream pair energy",message:"That wishlist item becomes more meaningful when it is connected to effort, goals, and follow-through.",power:"Earn the unlock",lucky:"Dream shoes"},
  {vibe:"Clear goals only",message:"Make the goal simple enough to do today. Clear beats complicated every time.",power:"Make it tiny",lucky:"One goal"},
  {vibe:"Virgo victory",message:"Today is a good day to prove to yourself that you can start, finish, and feel proud.",power:"Finish strong",lucky:"Victory star"},
];
function getDailyHoroscope(profile){
  const day=localDayNum();
  return{sign:profile?.zodiac||"Virgo",...DAILY_HOROSCOPE[day%DAILY_HOROSCOPE.length]};
}
const WNBA_DAILY_COACH=[
  {player:"A'ja Wilson",initials:"AW",tag:"MVP mindset",team:"Las Vegas Aces",photo:"https://commons.wikimedia.org/wiki/Special:FilePath/A%27ja%20Wilson%20%2853756794398%29%20%28cropped%29.jpg",quote:"That's the beauty of losses, you learn from them.",takeaway:"One hard moment can still help you grow."},
  {player:"Breanna Stewart",initials:"BS",tag:"stay present",team:"New York Liberty",photo:"https://commons.wikimedia.org/wiki/Special:FilePath/Breanna%20Stewart%20WNBA%20Finals%202024%20%28cropped%29.jpg",quote:"I've been trying to make sure I stay in the moment.",takeaway:"Focus on the next right thing."},
  {player:"Jewell Loyd",initials:"JL",tag:"prepared and ready",team:"Las Vegas Aces",photo:"https://commons.wikimedia.org/wiki/Special:FilePath/Jewell%20Loyd%202024%20%28cropped%29.jpg",quote:"I've prepared for all different kinds of coverages and I'm just trying to see where the space is.",takeaway:"Preparation keeps you calm."},
  {player:"Caitlin Clark",initials:"CC",tag:"dream big",team:"Indiana Fever",photo:"https://commons.wikimedia.org/wiki/Special:FilePath/Caitlin%20Clark%20Fever%202%20%28cropped%29.jpg",quote:"Never stop dreaming, because you can achieve more than you ever thought.",takeaway:"Big goals are allowed."},
  {player:"Kelsey Plum",initials:"KP",tag:"patient confidence",team:"Los Angeles Sparks",photo:"https://commons.wikimedia.org/wiki/Special:FilePath/Kelsey%20Plum%202023%20%28cropped%29.jpg",quote:"I was just trying to be patient and trust that it's going to come.",takeaway:"Trust your work and stay ready."},
];
function getDailyWnbaCoach(){return WNBA_DAILY_COACH[localDayNum()%WNBA_DAILY_COACH.length];}

// ── STORAGE ───────────────────────────────────────────────────────────────
let _FC=null;
function getFamilyCode(){try{return _FC||localStorage.getItem("sc_fc")||null;}catch{return null;}}
function setFCGlobal(c){_FC=c;try{if(c)localStorage.setItem("sc_fc",c);else localStorage.removeItem("sc_fc");}catch{}}
function fKey(k){const fc=getFamilyCode();return fc?`glow_${fc}_${k}`:null;}
async function sg(k){try{const sk=fKey(k);if(sk&&window.storage){try{const r=await window.storage.get(sk,true);if(r?.value)return JSON.parse(r.value);}catch{}}const raw=localStorage.getItem(k);return raw?JSON.parse(raw):null;}catch{return null;}}
async function ss(k,v){try{const p=JSON.stringify(v);const sk=fKey(k);if(sk&&window.storage){try{await window.storage.set(sk,p,true);}catch{}}try{localStorage.setItem(k,p);}catch{}return true;}catch{return false;}}
const genCode=()=>{const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";return Array.from({length:6},()=>c[Math.floor(Math.random()*c.length)]).join("");};

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────
const cs={borderRadius:18,border:`1px solid ${C.border}`,background:C.card,padding:16,marginBottom:12,overflow:"hidden"};
const csLight={borderRadius:18,border:`1px solid ${C.borderMed}`,background:C.cream,padding:16,marginBottom:12,overflow:"hidden"};
const INP={width:"100%",background:"rgba(255,255,255,.06)",border:`1px solid ${C.borderMed}`,borderRadius:12,padding:"12px 14px",color:C.text,fontSize:16,outline:"none",fontFamily:"system-ui",boxSizing:"border-box"};
const TXT={...INP,minHeight:70,resize:"vertical"};

function StableRenderer({render}){return render();}
class TabErrorBoundary extends React.Component{
  constructor(p){super(p);this.state={err:false,msg:""};}
  static getDerivedStateFromError(e){return{err:true,msg:e?.message||"Tab error"};}
  componentDidCatch(e){console.error(e);}
  render(){if(this.state.err)return<div style={{padding:20,color:C.muted,textAlign:"center"}}><div style={{fontSize:28,marginBottom:8}}>🛠</div><div style={{fontSize:13}}>{this.state.msg}</div></div>;return this.props.children;}
}

// ── UI ATOMS ──────────────────────────────────────────────────────────────
function Pill({label,col,bg,style={}}){return<span style={{display:"inline-block",fontSize:9,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",padding:"4px 10px",borderRadius:999,background:bg||`${col}18`,color:col,...style}}>{label}</span>;}
function SBox({value,label,color,icon}){return<div style={{background:`${color}0D`,border:`1px solid ${color}22`,borderRadius:14,padding:"12px 10px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color,lineHeight:1}}>{value}</div><div style={{fontSize:9,fontWeight:600,color:C.muted,marginTop:4,letterSpacing:".5px"}}>{label}</div></div>;}
function Chip({label,active,col,onClick}){return<button onClick={onClick} style={{flexShrink:0,padding:"8px 14px",borderRadius:999,border:`1px solid ${active?col:C.border}`,background:active?`${col}18`:"transparent",color:active?col:C.muted,fontWeight:600,cursor:"pointer",fontSize:12,whiteSpace:"nowrap",fontFamily:"system-ui",transition:"all .15s"}}>{label}</button>;}
function EmojiPick({val,emojis,onSet,col}){return<div style={{display:"flex",gap:7}}>{emojis.map((e,i)=><button key={i} onClick={()=>onSet(i+1===val?0:i+1)} style={{flex:1,height:46,borderRadius:12,fontSize:20,border:`1.5px solid ${val===i+1?col:C.borderMed}`,background:val===i+1?`${col}18`:"rgba(255,255,255,.04)",cursor:"pointer",boxShadow:val===i+1?`0 0 14px ${col}33`:"none",transition:"all .15s"}}>{e}</button>)}</div>;}
function RD({val,max=5,col,onSet}){return<div style={{display:"flex",gap:7}}>{Array.from({length:max},(_,i)=><div key={i} onClick={()=>onSet(i+1===val?0:i+1)} style={{flex:1,height:38,borderRadius:10,background:i<val?col:`${C.borderMed}22`,border:`1px solid ${i<val?col:C.borderMed}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:i<val?C.white:C.muted,transition:"all .15s"}}>{i+1}</div>)}</div>;}

function ProgressBar({val=0,max=100,col=C.rose,height=6,radius=99,style={}}){
  const pct=Math.min(100,Math.max(0,val/max*100));
  return<div style={{height,background:`${C.borderMed}55`,borderRadius:radius,overflow:"hidden",...style}}>
    <div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:radius,transition:"width .4s ease"}}/>
  </div>;
}

function RingChart({val=0,max=100,col=C.rose,size=56,label="",sub=""}){
  const r=size/2-5,circ=2*Math.PI*r,dash=circ-(val/max)*circ;
  const cx=size/2,cy=size/2;
  return<svg width={size} height={size}>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${col}20`} strokeWidth="5"/>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth="5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash} transform={`rotate(-90 ${cx} ${cy})`} style={{transition:"stroke-dashoffset .5s ease"}}/>
    <text x={cx} y={cy-4} textAnchor="middle" fill={C.text} fontSize="13" fontWeight="800" fontFamily="system-ui">{label}</text>
    {sub&&<text x={cx} y={cy+10} textAnchor="middle" fill={C.muted} fontSize="8" fontFamily="system-ui">{sub}</text>}
  </svg>;
}

// Section header matching screenshot style
function SH({icon,title,right=null}){
  return<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
    <div style={{display:"flex",alignItems:"center",gap:7}}>
      {icon&&<div style={{opacity:.8}}>{icon}</div>}
      <span style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:C.mutedLight}}>{title}</span>
    </div>
    {right}
  </div>;
}


const BADGE_DEFS=[
  {id:"game_tracker",icon:"🏀",name:"Game Tracker",desc:"Log 3 games",check:d=>d.games.length>=3},
  {id:"practice_beast",icon:"💪",name:"Practice Beast",desc:"Log 5 practices",check:d=>d.practices.length>=5},
  {id:"scorer",icon:"🔥",name:"Scorer",desc:"Score 10+ pts",check:d=>d.games.some(g=>(g.pts||0)>=10)},
  {id:"win_streak",icon:"🏆",name:"Win Streak",desc:"3 wins in a row",check:d=>d.games.length>=3&&d.games.slice(0,3).every(g=>g.result==="Win")},
  {id:"scholar",icon:"📚",name:"Scholar",desc:"GPA 3.5+",check:d=>parseFloat(gpaCalc(d.subjects))>=3.5},
  {id:"goal_crusher",icon:"🎯",name:"Goal Crusher",desc:"Complete 3 goals",check:d=>d.goals.filter(g=>g.done).length>=3},
  {id:"consistent",icon:"⭐",name:"Consistent",desc:"Track 7+ days",check:d=>Object.keys(d.dailyHist).length>=7},
  {id:"well_rested",icon:"🌙",name:"Well Rested",desc:"Log 7 nights sleep",check:d=>d.sleepEntries.length>=7},
  {id:"level_up",icon:"⬆️",name:"Level Up!",desc:"Any skill to 70%+",check:d=>Object.values(d.skills).some(v=>v>=70)},
  {id:"iron_will",icon:"🔩",name:"Iron Will",desc:"Log 10 practices",check:d=>d.practices.length>=10},
  {id:"future_planner",icon:"🚀",name:"Future Planner",desc:"Set a future goal",check:d=>d.goals.some(g=>g.category==="future")},
  {id:"star_100",icon:"💎",name:"Diamond",desc:"Earn 100 stars",check:d=>d.stars>=100},
];

export default function ScarlettTracker(){
  const[loaded,setLoaded]=useState(false);
  const[tab,setTab]=useState(()=>{try{return localStorage.getItem("sc_last_tab")||"today";}catch{return"today";}});
  const[familyCode,setFamilyCode]=useState(()=>{try{return localStorage.getItem("sc_fc")||"";}catch{return"";}});
  const[codeInput,setCodeInput]=useState("");
  const[showSettings,setShowSettings]=useState(false);
  const[editing,setEditing]=useState(false);

  const[profile,setProfile]=useState(clone(DEF_PROFILE));
  const[stars,setStars]=useState(0);
  const[dailyHist,setDailyHist]=useState({});
  const[checks,setChecks]=useState({});
  const[starAwards,setStarAwards]=useState({});
  const[water,setWater]=useState(0);
  const[vitals,setVitals]=useState({energy:0,mood:0});
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

  const saveTmr=useRef(null);const editBlurT=useRef(null);const supRef=useRef(false);

  const xpPerLevel=50;const xp=stars*5;const level=Math.max(1,Math.floor(xp/xpPerLevel)+1);
  const xpInLevel=xp%xpPerLevel;const levelTitle=LEVEL_TITLES[Math.min(level-1,LEVEL_TITLES.length-1)]||"Icon";
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
    setGoals(safeArray(gd.entries));setStars(Number(gd.stars)||0);setRewardClaims(safeArray(rd.claims));
    setProfile({...clone(DEF_PROFILE),...pd});setHabits(hd.entries||[]);
    const e=(daily.entries||{})?.[todayISO()]||{};
    setChecks(e.c||{});setStarAwards(e.r||{});setWater(e.w||0);setVitals(e.vitals||{energy:0,mood:0});
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
  const saveStyle=async(fits=styleLog,shoes=shoeWish)=>{setStyleLog(safeArray(fits));setShoeWish(safeArray(shoes));await ss("sc_style",{fits:safeArray(fits),shoes:safeArray(shoes)});};
  const saveRoutine=async(entries=routineHist,items=routineItems)=>{setRoutineHist(entries);setRoutineItems(items);await ss("sc_routine",{entries,items});};
  const saveSleep=async e=>{setSleepEntries(e);await ss("sc_sleep",{entries:e});};
  const saveSchool=async sub=>{setSubjects(sub);await ss("sc_school",{subjects:sub});};

  const activateCode=async code=>{
    const c=(code||"").trim().toUpperCase();if(c.length<4)return;
    setFCGlobal(c);setFamilyCode(c);
    const[daily,bball,prax,styleD,routineD,slp,school,gd,rd,pd,hd]=await Promise.all([sg("sc_daily"),sg("sc_bball"),sg("sc_practices"),sg("sc_style"),sg("sc_routine"),sg("sc_sleep"),sg("sc_school"),sg("sc_goals"),sg("sc_rewards"),sg("sc_profile"),sg("sc_habits")]);
    if(daily?.entries)setDailyHist(daily.entries);
    if(bball?.games)setGames(bball.games);if(bball?.skills)setSkills(bball.skills);
    if(prax?.entries)setPractices(safeArray(prax.entries));
    if(styleD?.fits)setStyleLog(safeArray(styleD.fits));if(styleD?.shoes)setShoeWish(safeArray(styleD.shoes));
    if(routineD?.entries)setRoutineHist(routineD.entries);if(routineD?.items)setRoutineItems(routineD.items);
    if(slp?.entries)setSleepEntries(safeArray(slp.entries));
    if(school?.subjects)setSubjects(school.subjects);
    if(gd?.entries)setGoals(safeArray(gd.entries));if(gd?.stars)setStars(gd.stars);
    if(rd?.claims)setRewardClaims(safeArray(rd.claims));if(hd?.entries)setHabits(hd.entries);
    if(pd)setProfile({...clone(DEF_PROFILE),...pd});
  };

  const onEditFocus=e=>{if(["INPUT","TEXTAREA","SELECT"].includes(e.target?.tagName)){clearTimeout(editBlurT.current);setEditing(true);}};
  const onEditBlur=e=>{if(["INPUT","TEXTAREA","SELECT"].includes(e.target?.tagName)){clearTimeout(editBlurT.current);editBlurT.current=setTimeout(()=>setEditing(false),180);}};

  const approvedGoalCount=goals.filter(g=>g.parentApproved).length;
  const spentTokens=safeArray(rewardClaims).filter(r=>["requested","approved"].includes(r.status)).reduce((a,r)=>a+(r.cost||1),0);
  const rewardTokens=Math.max(0,approvedGoalCount-spentTokens);
  const claimFor=item=>safeArray(rewardClaims).find(r=>r.itemId===item.id&&r.status!=="rejected");
  const rewardCost=item=>{if(item?.cost)return item.cost;const p=String(item?.priority||"").toLowerCase();return p.includes("dream")?3:p.includes("next")?2:1;};

  const approveGoal=async id=>{
    const ng=goals.map(g=>g.id!==id?g:{...g,done:true,submitted:true,parentApproved:true,approvedDate:toShort(todayISO())});
    await saveGoals(ng,stars);
  };
  const updateRewardClaim=async(id,status)=>{
    const nr=rewardClaims.map(r=>r.id===id?{...r,status,approvedDate:status==="approved"?toShort(todayISO()):r.approvedDate}:r);
    await saveRewards(nr);
  };
  const requestReward=async item=>{
    const existing=claimFor(item);if(existing||rewardTokens<rewardCost(item))return;
    const claim={id:uid(),itemId:item.id,itemName:item.name,cost:rewardCost(item),status:"requested",date:toShort(todayISO())};
    await saveRewards([claim,...rewardClaims]);
  };

  if(!loaded)return<div style={{background:C.bg,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,fontFamily:"system-ui"}}><div style={{width:52,height:52,borderRadius:999,background:glamGrad,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ico.crown(C.white,24)}</div><div style={{fontSize:15,fontWeight:600,color:C.textDim,letterSpacing:".5px"}}>Loading {profile.name}'s app…</div></div>;

  const badgeData={games,practices,sleepEntries,subjects,goals,skills,dailyHist,shoeWish,styleLog,stars};


  // ═══════════════════════════════════════════════════════════════════════
  // TODAY TAB — matches screenshot: profile header, affirmation, WNBA+vibe,
  //             goal command center, progress overview, rewards strip
  // ═══════════════════════════════════════════════════════════════════════
  const Today=()=>{
    const[newQuest,setNewQuest]=useState("");
    const horoscope=getDailyHoroscope(profile);
    const coach=getDailyWnbaCoach();
    const done=habits.filter(h=>checks[h.id]).length;
    const allDone=habits.length>0&&done===habits.length;
    const routineDone=Object.values(routineHist[todayISO()]?.c||{}).filter(Boolean).length;
    const activeGoals=goals.filter(g=>!g.done);
    const wins=games.filter(g=>g.result==="Win").length;
    const winPct=games.length?Math.round(wins/games.length*100):0;
    const weeklyGoals=goals.filter(g=>!g.done).length;
    const weeklyDone=goals.filter(g=>g.done).length;
    const weeklyPct=goals.length?Math.round(weeklyDone/goals.length*100):0;
    const avgSk=Math.round(avgArr(Object.values(skills)));
    const gpa=parseFloat(gpaCalc(subjects))||0;
    const overallGlow=Math.round(avgArr([avgSk,Math.round(gpa/4*100),games.length?winPct:0].filter(v=>v>0)))||0;

    const addQuest=async()=>{const label=newQuest.trim();if(!label)return;await saveHabits([...habits,{id:uid(),e:"⭐",label}]);setNewQuest("");};
    const removeQuest=async id=>{await saveHabits(habits.filter(h=>h.id!==id));const nc={...checks};delete nc[id];setChecks(nc);};
    const toggleCheck=async id=>{const next={...checks,[id]:!checks[id]};setChecks(next);if(!checks[id]&&!starAwards[id]){setStarAwards(p=>({...p,[id]:true}));await addStars(1);}};

    const goalIcons={basketball:Ico.basketball,school:Ico.school,health:Ico.heart,character:col=>Ico.star(col,18),future:col=><div style={{fontSize:16}}>🚀</div>};
    const goalColors={basketball:C.rose,school:C.teal,health:C.green,character:C.gold,future:C.blue,personal:C.gold};

    const today=new Date();
    const hour=today.getHours();
    const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
    const dayStr=today.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});

    return<div style={{paddingBottom:4}}>

      {/* ── PROFILE HEADER ── */}
      <div style={{padding:"6px 0 14px"}}>
        <div style={{fontSize:10,color:C.muted,fontWeight:600,letterSpacing:".5px",marginBottom:4}}>{dayStr}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
          <div style={{flex:1}}>
            <div style={{fontSize:12,color:C.gold,fontWeight:600,letterSpacing:".3px",marginBottom:2}}>{greeting},</div>
            <div style={{fontSize:32,fontWeight:900,color:C.text,lineHeight:1,marginBottom:6,letterSpacing:"-.5px"}}>{profile.name} <span style={{color:C.gold,fontSize:22}}>✦</span></div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <div style={{background:`${C.rose}18`,border:`1px solid ${C.rose}30`,borderRadius:999,padding:"3px 8px",display:"flex",alignItems:"center",gap:4}}>
                {Ico.crown(C.gold,12)}
                <span style={{fontSize:10,color:C.gold,fontWeight:700}}>Level {level} · {levelTitle}</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1,maxWidth:130}}>
                <ProgressBar val={xpInLevel} max={xpPerLevel} col={C.rose} height={5}/>
              </div>
              <span style={{fontSize:9,color:C.muted,fontWeight:600}}>{xpInLevel} / {xpPerLevel} XP to Level {level+1}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{background:C.card2,border:`1px solid ${C.borderMed}`,borderRadius:14,padding:"10px 12px",textAlign:"center",minWidth:56}}>
              {Ico.star(C.gold,14)}
              <div style={{fontSize:16,fontWeight:800,color:C.text,lineHeight:1,marginTop:3}}>{stars}</div>
              <div style={{fontSize:8,color:C.muted,fontWeight:600,marginTop:2}}>Stars</div>
            </div>
            {rewardTokens>0&&<div style={{background:C.card2,border:`1px solid ${C.borderMed}`,borderRadius:14,padding:"10px 12px",textAlign:"center",minWidth:56}}>
              <span style={{fontSize:14}}>🎟️</span>
              <div style={{fontSize:16,fontWeight:800,color:C.green,lineHeight:1,marginTop:3}}>{rewardTokens}</div>
              <div style={{fontSize:8,color:C.muted,fontWeight:600,marginTop:2}}>Tokens</div>
            </div>}
          </div>
        </div>
      </div>

      {/* ── AFFIRMATION CARD — light cream, serif feel ── */}
      <div style={{...csLight,background:"linear-gradient(135deg,#F5EDE4,#EDE0D2)",border:`1px solid ${C.cream3}`,marginBottom:12,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:16,top:10,opacity:.15}}>
          <svg width="80" height="80" viewBox="0 0 100 100"><text y="70" fontSize="80" fill={C.roseDark}>♛</text></svg>
        </div>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",color:C.roseDark,textTransform:"uppercase",marginBottom:6}}>I am…</div>
          <div style={{fontSize:vitals.mantra&&vitals.mantra.length>30?20:24,fontWeight:900,color:C.textOnLight,lineHeight:1.2,marginBottom:14,maxWidth:"80%",fontFamily:"Georgia,serif"}}>
            {vitals.mantra||"Smart. Strong.\nFocused. Unstoppable."}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{}} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:999,border:"none",background:glamGrad,color:C.white,fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"system-ui"}}>
              {Ico.star(C.white,12)} Affirm It
            </button>
            <div style={{padding:"9px 14px",borderRadius:999,border:`1px solid ${C.cream3}`,background:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:12,fontWeight:600,color:C.textOnLight}}>
              My Affirmations
            </div>
          </div>
        </div>
        <div style={{marginTop:10}}>
          <input value={vitals.mantra||""} onChange={e=>setVitals(p=>({...p,mantra:e.target.value}))} placeholder='Type "I am…" to set your daily affirmation' style={{width:"100%",background:"rgba(255,255,255,.5)",border:`1px solid ${C.cream3}`,borderRadius:12,padding:"10px 12px",color:C.textOnLight,fontSize:13,outline:"none",fontFamily:"system-ui",boxSizing:"border-box",fontStyle:"italic"}}/>
        </div>
      </div>

      {/* ── WNBA COACH + VIRGO VIBE — 2-column like screenshot ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>

        {/* WNBA Coach */}
        <div style={{...cs,background:`linear-gradient(145deg,${C.card2},${C.card})`,padding:12,position:"relative",overflow:"hidden"}}>
          <div style={{fontSize:8,fontWeight:700,letterSpacing:"1.5px",color:C.rose,textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
            {Ico.flame(C.rose,12)} WNBA Daily Coach
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
            <div style={{width:42,height:52,borderRadius:10,overflow:"hidden",background:`${C.rose}18`,border:`1px solid ${C.rose}30`,flexShrink:0,position:"relative"}}>
              <img src={coach.photo} alt={coach.player} loading="lazy" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display="none";const fb=e.currentTarget.parentElement?.querySelector("[data-fb]");if(fb)fb.style.display="flex";}} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
              <div data-fb style={{display:"none",position:"absolute",inset:0,alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:C.white,background:`${C.rose}44`}}>{coach.initials}</div>
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:12,fontWeight:800,color:C.text,lineHeight:1.2}}>{coach.player}</div>
              <div style={{fontSize:9,color:C.muted,marginTop:2}}>{coach.team}</div>
              <div style={{fontSize:9,color:C.rose,fontWeight:600,marginTop:1}}>{coach.tag}</div>
            </div>
          </div>
          <div style={{fontSize:11,color:C.textDim,lineHeight:1.45,marginBottom:8,fontStyle:"italic"}}>"{coach.quote}"</div>
          <button onClick={()=>setTab("coach")} style={{width:"100%",display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderRadius:10,background:`${C.rose}10`,border:`1px solid ${C.rose}22`,cursor:"pointer",fontFamily:"system-ui",textAlign:"left"}}>
            {Ico.arrow(C.rose,12)}
            <div style={{fontSize:10,color:C.roseLight,lineHeight:1.35,fontWeight:700,flex:1}}>Watch Tip · {coach.takeaway}</div>
          </button>
        </div>

        {/* Virgo Daily Vibe */}
        <div style={{...cs,background:`linear-gradient(145deg,${C.card2},${C.card})`,padding:12,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:8,bottom:8,opacity:.1}}>{Ico.virgo(C.gold,52)}</div>
          <div style={{fontSize:8,fontWeight:700,letterSpacing:"1.5px",color:C.gold,textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:4,position:"relative"}}>
            {Ico.virgo(C.gold,12)} Virgo Daily Vibe
          </div>
          <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:8,lineHeight:1.2,position:"relative"}}>{horoscope.vibe}</div>
          <div style={{fontSize:11,color:C.textDim,lineHeight:1.5,marginBottom:8,position:"relative"}}>{horoscope.message}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,position:"relative"}}>
            <div style={{padding:"6px 8px",borderRadius:9,background:`${C.gold}10`,border:`1px solid ${C.gold}22`}}>
              <div style={{fontSize:7,color:C.muted,fontWeight:700,letterSpacing:"1px",marginBottom:2}}>POWER MOVE</div>
              <div style={{fontSize:10,fontWeight:700,color:C.gold}}>{horoscope.power}</div>
            </div>
            <div style={{padding:"6px 8px",borderRadius:9,background:`${C.gold}10`,border:`1px solid ${C.gold}22`}}>
              <div style={{fontSize:7,color:C.muted,fontWeight:700,letterSpacing:"1px",marginBottom:2}}>LUCKY VIBE</div>
              <div style={{fontSize:10,fontWeight:700,color:C.gold}}>{horoscope.lucky}</div>
            </div>
          </div>
          <button onClick={()=>setTab("virgo")} style={{marginTop:8,width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"7px 10px",borderRadius:10,background:`${C.gold}10`,border:`1px solid ${C.gold}22`,cursor:"pointer",fontFamily:"system-ui",color:C.gold,fontWeight:800,fontSize:10}}>
            See More {Ico.arrow(C.gold,12)}
          </button>
        </div>
      </div>

      {/* ── GOAL COMMAND CENTER — matches screenshot ── */}
      <div style={{...cs,border:`1px solid ${C.borderMed}`}}>
        <SH icon={Ico.goals(C.rose,14)} title="Goal Command Center" right={
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:10,color:C.muted,fontWeight:600}}>{goals.filter(g=>g.done).length} of {goals.length} goals</span>
            <button onClick={()=>setTab("goals")} style={{padding:"5px 10px",borderRadius:999,border:`1px solid ${C.borderMed}`,background:"transparent",color:C.mutedLight,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"system-ui"}}>See all</button>
          </div>
        }/>
        {goals.length===0&&<div style={{textAlign:"center",padding:"18px 0",color:C.muted}}>
          <div style={{fontSize:24,marginBottom:6}}>🎯</div>
          <div style={{fontSize:12,marginBottom:10}}>No goals yet. Set your first quest!</div>
          <button onClick={()=>setTab("goals")} style={{padding:"8px 16px",borderRadius:999,border:"none",background:glamGrad,color:C.white,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"system-ui"}}>+ Add a Goal</button>
        </div>}
        {goals.slice(0,3).map(g=>{
          const col=goalColors[g.category]||C.rose;
          const pct=g.done?100:g.progress||0;
          const catIconFn=goalIcons[g.category];
          const catIcon=typeof catIconFn==="function"?catIconFn(col,16):<span style={{fontSize:14}}>🎯</span>;
          return<div key={g.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:34,height:34,borderRadius:999,background:`${col}18`,border:`1px solid ${col}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{catIcon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,color:C.text,lineHeight:1.3,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.text}</div>
              <ProgressBar val={pct} max={100} col={col} height={4} radius={99}/>
              {g.targetDate&&<div style={{fontSize:9,color:C.muted,marginTop:3}}>Target {g.targetDate}</div>}
            </div>
            <div style={{flexShrink:0}}>
              {g.done?Ico.check(C.green,20):
                g.parentApproved?<div style={{width:28,height:28,borderRadius:999,background:`${C.green}12`,border:`1px solid ${C.green}40`,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ico.check(C.green,14)}</div>:
                g.done&&!g.parentApproved?<div style={{padding:"4px 8px",borderRadius:999,background:`${C.gold}12`,border:`1px solid ${C.gold}40`,fontSize:9,color:C.gold,fontWeight:700}}>⏳</div>:
                <div style={{width:28,height:28,borderRadius:999,border:`1.5px solid ${C.borderMed}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontSize:8,color:C.muted,fontWeight:700,textAlign:"center",lineHeight:1}}></div>
                </div>
              }
            </div>
          </div>;
        })}
        {goals.length>3&&<div style={{textAlign:"center",paddingTop:10}}>
          <button onClick={()=>setTab("goals")} style={{fontSize:11,color:C.rose,fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:"system-ui"}}>View all {goals.length} goals →</button>
        </div>}
        <button onClick={()=>setTab("goals")} style={{width:"100%",marginTop:10,padding:"10px",borderRadius:12,border:`1px solid ${C.borderMed}`,background:"transparent",color:C.mutedLight,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"system-ui",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          {Ico.plus(C.mutedLight,16)} Add a Goal
        </button>
      </div>

      {/* ── PROGRESS OVERVIEW — matches screenshot layout ── */}
      <div style={{...cs,border:`1px solid ${C.borderMed}`}}>
        <SH icon={null} title="Progress Overview" right={<span style={{fontSize:10,color:C.gold,fontWeight:700,display:"flex",alignItems:"center",gap:3}}>{Ico.star(C.gold,11)} Keep going, superstar!</span>}/>
        <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr",gap:12,alignItems:"center"}}>
          <RingChart val={overallGlow} max={100} col={C.rose} size={72} label={`${overallGlow}`} sub="of 100"/>
          <div style={{textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>{Ico.flame(C.gold,22)}</div>
            <div style={{fontSize:20,fontWeight:800,color:C.text,lineHeight:1}}>{habitStreak}</div>
            <div style={{fontSize:9,color:C.muted,marginTop:3,lineHeight:1.2}}>Day Streak</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>{Ico.goals(C.rose,20)}</div>
            <div style={{fontSize:20,fontWeight:800,color:C.text,lineHeight:1}}>{weeklyPct}%</div>
            <div style={{fontSize:9,color:C.muted,marginTop:3,lineHeight:1.2}}>Weekly Goals</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>{Ico.sports(C.teal,20)}</div>
            <div style={{fontSize:20,fontWeight:800,color:C.text,lineHeight:1}}>{Object.values(skills).filter(v=>v>=40).length}</div>
            <div style={{fontSize:9,color:C.muted,marginTop:3,lineHeight:1.2}}>Skills Tracked</div>
          </div>
        </div>
      </div>

      {/* ── DAILY QUESTS ── */}
      <div style={{...cs,border:`1px solid ${C.borderMed}`}}>
        <SH icon={null} title={`Daily Quests (${done}/${habits.length})`} right={<span style={{fontSize:10,color:C.gold,fontWeight:600}}>+1⭐ each</span>}/>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <input value={newQuest} onChange={e=>setNewQuest(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addQuest();}} placeholder="Add a quest for today…" style={{...INP,flex:1,padding:"10px 12px",fontSize:13}}/>
          <button onClick={addQuest} style={{padding:"10px 16px",borderRadius:12,border:"none",background:glamGrad,color:C.white,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"system-ui",whiteSpace:"nowrap"}}>Add</button>
        </div>
        {habits.length===0&&<div style={{padding:"12px 0",textAlign:"center",color:C.muted,fontSize:12}}>Your daily quests will appear here.</div>}
        {habits.map(h=>{const ok=!!checks[h.id];return<div key={h.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <button onClick={()=>toggleCheck(h.id)} style={{width:28,height:28,borderRadius:999,border:`1.5px solid ${ok?C.green:C.borderMed}`,background:ok?`${C.green}15`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .15s"}}>
            {ok&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </button>
          <div style={{flex:1,fontSize:13,fontWeight:500,color:ok?C.muted:C.text,textDecoration:ok?"line-through":"none"}}>{h.label}</div>
          {ok&&<span style={{fontSize:10,color:C.green,fontWeight:700}}>+1⭐</span>}
          <button onClick={e=>{e.stopPropagation();removeQuest(h.id);}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16,padding:"2px 4px",lineHeight:1}}>×</button>
        </div>;})}
        {allDone&&habits.length>0&&<div style={{marginTop:10,padding:"10px 14px",borderRadius:12,background:`${C.green}10`,border:`1px solid ${C.green}25`,display:"flex",alignItems:"center",gap:8}}>
          {Ico.check(C.green,18)}
          <span style={{fontSize:12,fontWeight:700,color:C.green}}>All quests done! You're unstoppable.</span>
        </div>}
      </div>

      {/* ── REWARDS & WISHLIST strip ── */}
      {shoeWish.length>0&&<div style={{...cs,border:`1px solid ${C.borderMed}`}}>
        <SH icon={null} title="Rewards & Wishlist" right={<button onClick={()=>setTab("rewards")} style={{fontSize:10,color:C.rose,fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:"system-ui"}}>View all</button>}/>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
          {shoeWish.slice(0,4).map(item=>{
            const cost=rewardCost(item);
            return<div key={item.id} style={{flexShrink:0,width:130,borderRadius:14,background:C.cream,border:`1px solid ${C.cream3}`,overflow:"hidden"}}>
              <div style={{height:90,background:C.cream2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>
                {item.img?<img src={item.img} alt={item.name} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.currentTarget.style.display="none"}/>:<span>👟</span>}
              </div>
              <div style={{padding:"8px 10px"}}>
                <div style={{fontSize:11,fontWeight:700,color:C.textOnLight,lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                <div style={{fontSize:10,color:C.mutedOnLight,marginTop:2}}>{cost} token{cost===1?"":"s"}</div>
              </div>
            </div>;
          })}
          <div style={{flexShrink:0,width:90,borderRadius:14,background:`${C.rose}10`,border:`1px dashed ${C.rose}44`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,cursor:"pointer"}} onClick={()=>setTab("rewards")}>
            {Ico.plus(C.rose,22)}
            <span style={{fontSize:10,color:C.rose,fontWeight:600,textAlign:"center"}}>Add to Wishlist</span>
          </div>
        </div>
      </div>}

      {/* ── GLOW ROUTINE SHORTCUT ── */}
      <button onClick={()=>setTab("progress")} style={{width:"100%",...cs,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,border:`1px solid ${C.borderMed}`}}>
        <div style={{width:38,height:38,borderRadius:12,background:`${C.rose}15`,border:`1px solid ${C.rose}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>✨</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:12,color:C.text}}>Glow Routine</div>
          <div style={{fontSize:11,color:C.muted,marginTop:2}}>{routineDone>0?`${routineDone} steps done today`:"Tap to start tonight's routine"}</div>
        </div>
        {Ico.arrow(C.muted,16)}
      </button>
    </div>;
  };




  // ═══════════════════════════════════════════════════════════════════════
  // WNBA DAILY COACH DETAIL — hidden route, reached from Today card
  // ═══════════════════════════════════════════════════════════════════════
  const CoachDetail=()=>{
    const coach=getDailyWnbaCoach();
    const lesson=`${coach.player.split(" ")[0]}'s mindset is powerful because she treats pressure, mistakes, and losses as feedback. For ${profile.name}, that means every practice and every game can teach one specific thing: what to repeat, what to adjust, and what to try again tomorrow.`;
    return <div>
      <button onClick={()=>setTab("today")} style={{marginBottom:12,border:"none",background:C.card2,color:C.textDim,borderRadius:999,padding:"9px 16px",fontWeight:700,fontFamily:"system-ui",cursor:"pointer"}}>← Back to Today</button>

      <div style={{...csLight,background:"linear-gradient(135deg,#F5EDE4,#EDE0D2)",border:`1px solid ${C.cream3}`,padding:20,marginBottom:12}}>
        <SH icon={Ico.flame(C.rose,16)} title="WNBA Daily Coach" right={null}/>
        <div style={{display:"grid",gridTemplateColumns:"92px 1fr",gap:14,alignItems:"center",marginBottom:14}}>
          <div style={{width:92,height:110,borderRadius:24,overflow:"hidden",background:`${C.rose}18`,border:`2px solid ${C.rose}55`,position:"relative"}}>
            <img src={coach.photo} alt={coach.player} loading="lazy" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display="none";const fb=e.currentTarget.parentElement?.querySelector("[data-fb]");if(fb)fb.style.display="flex";}} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
            <div data-fb style={{display:"none",position:"absolute",inset:0,alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,color:C.white,background:`${C.roseDark}`}}>{coach.initials}</div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:"2px",color:C.roseDark,textTransform:"uppercase",marginBottom:6}}>Tip from</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:30,lineHeight:1.02,fontWeight:900,color:C.textOnLight}}>{coach.player}</div>
            <div style={{fontSize:12,color:C.mutedOnLight,fontWeight:700,marginTop:8}}>{coach.team} · {coach.tag}</div>
          </div>
        </div>

        <div style={{background:"rgba(255,255,255,.58)",border:`1px solid ${C.cream3}`,borderRadius:18,padding:16,marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:"2px",color:C.roseDark,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Real Quote</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:22,lineHeight:1.28,color:C.textOnLight,textAlign:"center"}}>“{coach.quote}”</div>
        </div>

        <div style={{fontSize:10,fontWeight:800,letterSpacing:"2px",color:C.roseDark,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Today’s Lesson</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:24,lineHeight:1.12,fontWeight:900,color:C.textOnLight,textAlign:"center",marginBottom:10}}>{coach.takeaway}</div>
        <div style={{fontSize:15,lineHeight:1.68,color:C.mutedOnLight,textAlign:"center",marginBottom:14}}>{lesson}</div>

        <div style={{background:`${C.green}16`,border:`1px solid ${C.green}40`,borderRadius:18,padding:16,marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:"2px",color:C.teal,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Try this today</div>
          <div style={{fontSize:16,lineHeight:1.45,fontWeight:800,color:C.textOnLight,textAlign:"center"}}>After your next practice, write down one thing that worked, one thing that was hard, and one thing you will try again.</div>
        </div>

        <div style={{background:`${C.gold}14`,border:`1px solid ${C.gold}36`,borderRadius:18,padding:14}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:"2px",color:C.gold,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Focus</div>
          <div style={{fontSize:15,fontWeight:850,color:C.textOnLight,textAlign:"center"}}>Growth mindset · leadership · confidence</div>
        </div>
      </div>

      <div style={{...cs,border:`1px solid ${C.borderMed}`}}>
        <SH icon={<span style={{fontSize:18}}>✨</span>} title="Use the Tip" right={null}/>
        {[
          {label:"Log hoops work",go:"hoops",icon:"🏀"},
          {label:"Set a goal from this",go:"goals",icon:"🎯"},
          {label:"Open rewards",go:"rewards",icon:"🎁"},
        ].map(a=><button key={a.label} onClick={()=>setTab(a.go)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:16,border:`1px solid ${C.borderMed}`,background:"rgba(255,255,255,.04)",color:C.text,cursor:"pointer",fontFamily:"system-ui",textAlign:"left",marginBottom:10}}>
          <span style={{fontSize:20}}>{a.icon}</span>
          <span style={{flex:1,fontWeight:800,fontSize:13,color:C.text}}>{a.label}</span>
          {Ico.arrow(C.rose,16)}
        </button>)}
      </div>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VIRGO DAILY VIBE DETAIL — hidden route, reached from Today card
  // ═══════════════════════════════════════════════════════════════════════
  const VirgoDetail=()=>{
    const horoscope=getDailyHoroscope(profile);
    return <div>
      <button onClick={()=>setTab("today")} style={{marginBottom:12,border:"none",background:C.card2,color:C.textDim,borderRadius:999,padding:"9px 16px",fontWeight:700,fontFamily:"system-ui",cursor:"pointer"}}>← Back to Today</button>

      <div style={{...csLight,background:"linear-gradient(135deg,#F5EDE4,#EDE0D2)",border:`1px solid ${C.cream3}`,padding:20,marginBottom:12,position:"relative"}}>
        <div style={{position:"absolute",right:16,top:12,opacity:.14}}>{Ico.virgo(C.roseDark,90)}</div>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:"3px",color:C.roseDark,textTransform:"uppercase",textAlign:"center",marginBottom:10}}>Virgo Daily Vibe</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:32,lineHeight:1.02,fontWeight:900,color:C.textOnLight,textAlign:"center",marginBottom:10}}>A calm focus prompt for today.</div>
          <div style={{fontSize:15,lineHeight:1.55,color:C.mutedOnLight,textAlign:"center",marginBottom:16}}>Use today’s Virgo-inspired focus to feel calmer, more confident, and ready to follow through.</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            <SBox value="♍" label="Virgo" color={C.roseDark}/>
            <SBox value="1" label="Power Move" color={C.gold}/>
            <button onClick={()=>setTab("goals")} style={{border:`1px solid ${C.cream3}`,borderRadius:14,background:"rgba(255,255,255,.55)",padding:"12px 10px",cursor:"pointer",fontFamily:"system-ui"}}>
              <div style={{fontSize:20,fontWeight:900,color:C.teal,lineHeight:1}}>Goal</div>
              <div style={{fontSize:9,fontWeight:700,color:C.mutedOnLight,marginTop:4,letterSpacing:".5px"}}>Next</div>
            </button>
          </div>
        </div>
      </div>

      <div style={{...csLight,background:"linear-gradient(135deg,#F5EDE4,#EDE0D2)",border:`1px solid ${C.cream3}`,padding:20,marginBottom:12}}>
        <div style={{display:"grid",gridTemplateColumns:"84px 1fr",gap:14,alignItems:"center",marginBottom:16}}>
          <div style={{width:84,height:84,borderRadius:24,border:`2px solid ${C.rose}80`,display:"flex",alignItems:"center",justifyContent:"center",background:`${C.rose}12`}}>
            {Ico.virgo(C.roseDark,44)}
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:"2px",color:C.roseDark,textTransform:"uppercase",marginBottom:5}}>Virgo Energy</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:30,lineHeight:1.05,fontWeight:900,color:C.textOnLight}}>{horoscope.vibe}</div>
            <div style={{fontSize:12,color:C.mutedOnLight,fontWeight:700,marginTop:8}}>Earth sign · focus · follow-through</div>
          </div>
        </div>

        <div style={{background:"rgba(255,255,255,.58)",border:`1px solid ${C.cream3}`,borderRadius:18,padding:16,marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:"2px",color:C.roseDark,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Today’s Horoscope</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:22,lineHeight:1.28,color:C.textOnLight,textAlign:"center"}}>“{horoscope.message}”</div>
        </div>

        <div style={{fontSize:10,fontWeight:800,letterSpacing:"2px",color:C.roseDark,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Virgo Read</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:24,lineHeight:1.12,fontWeight:900,color:C.textOnLight,textAlign:"center",marginBottom:10}}>{horoscope.vibe}</div>
        <div style={{fontSize:15,lineHeight:1.68,color:C.mutedOnLight,textAlign:"center",marginBottom:14}}>Today’s Virgo vibe turns into action when the goal is clear, the step is small, and the reward feels earned. The win is not just wanting something — it is proving you can follow through.</div>

        <div style={{background:`${C.green}16`,border:`1px solid ${C.green}40`,borderRadius:18,padding:16,marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:"2px",color:C.teal,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Power Move</div>
          <div style={{fontSize:16,lineHeight:1.45,fontWeight:800,color:C.textOnLight,textAlign:"center"}}>{horoscope.power}</div>
        </div>

        <div style={{background:`${C.gold}14`,border:`1px solid ${C.gold}36`,borderRadius:18,padding:14,marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:"2px",color:C.gold,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>I Am Affirmation</div>
          <div style={{fontSize:15,fontWeight:850,color:C.textOnLight,textAlign:"center"}}>I earn good things by keeping promises to myself.</div>
        </div>

        <div style={{background:`${C.teal}14`,border:`1px solid ${C.teal}36`,borderRadius:18,padding:14}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:"2px",color:C.teal,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Journal Prompt</div>
          <div style={{fontSize:15,fontWeight:850,color:C.textOnLight,textAlign:"center"}}>What reward would feel better if I truly earned it?</div>
        </div>
      </div>

      <div style={{...cs,border:`1px solid ${C.borderMed}`}}>
        <SH icon={<span style={{fontSize:18}}>✨</span>} title="Use the Virgo Vibe" right={null}/>
        {[
          {label:"Turn vibe into a goal",go:"goals",icon:"🎯"},
          {label:"Open rewards",go:"rewards",icon:"🎁"},
          {label:"Check progress",go:"progress",icon:"📊"},
        ].map(a=><button key={a.label} onClick={()=>setTab(a.go)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:16,border:`1px solid ${C.borderMed}`,background:"rgba(255,255,255,.04)",color:C.text,cursor:"pointer",fontFamily:"system-ui",textAlign:"left",marginBottom:10}}>
          <span style={{fontSize:20}}>{a.icon}</span>
          <span style={{flex:1,fontWeight:800,fontSize:13,color:C.text}}>{a.label}</span>
          {Ico.arrow(C.gold,16)}
        </button>)}
      </div>
    </div>;
  };


  // ═══════════════════════════════════════════════════════════════════════
  // GOALS TAB — editorial command center with GoalCard
  // ═══════════════════════════════════════════════════════════════════════
  const Goals=()=>{
    const CAT={basketball:{col:C.rose,icon:"🏀",label:"Basketball"},school:{col:C.teal,icon:"📚",label:"School"},health:{col:C.green,icon:"💚",label:"Health"},character:{col:C.gold,icon:"⭐",label:"Character"},future:{col:C.blue,icon:"🚀",label:"Future"},personal:{col:C.gold,icon:"🌟",label:"Personal"}};
    const emptyGoal=()=>({text:"",category:"basketball",targetDate:addDays(7),why:"",steps:""});
    const[gf,setGf]=useState(emptyGoal());
    const[burst,setBurst]=useState(null);
    const[editingId,setEditingId]=useState(null);
    const[showForm,setShowForm]=useState(false);
    const active=goals.filter(g=>!g.done);
    const waiting=goals.filter(g=>g.done&&!g.parentApproved);
    const approved=goals.filter(g=>g.parentApproved);
    const totalDone=goals.filter(g=>g.done).length;
    const pctDone=goals.length?Math.round(totalDone/goals.length*100):0;
    const weakestSkill=Object.entries(skills).sort((a,b)=>a[1]-b[1])[0]||null;
    const templates=[
      {text:"Make 20 free throws after practice 3 times this week",category:"basketball",why:"Builds easy points and confidence."},
      {text:"Finish homework before screens for 5 school days",category:"school",why:"Keeps school calm and avoids rushing."},
      {text:"Complete my glow routine 5 nights this week",category:"health",why:"Builds discipline and confidence."},
      {text:"Be in bed by 9:00 PM for 5 nights",category:"health",why:"Sleep helps athletes grow and recover."},
      {text:"Say one positive thing to myself before every practice",category:"character",why:"Confidence is a skill too."},
      {text:"Earn one reward token toward something on my wishlist",category:"personal",why:"Connects goals to real rewards."},
    ];
    if(weakestSkill)templates.unshift({text:`Improve ${weakestSkill[0]} with 15 focused minutes a day this week`,category:"basketball",why:"Targets the skill that needs the most growth."});

    const saveGoal=async()=>{
      if(!gf.text.trim())return;
      if(editingId){const ng=goals.map(g=>g.id===editingId?{...g,text:gf.text.trim(),category:gf.category,targetDate:gf.targetDate,why:gf.why||"",steps:gf.steps||""}:g);await saveGoals(ng);setEditingId(null);setGf(emptyGoal());setShowForm(false);return;}
      const entry={id:uid(),goalNo:nextGoalNumber(goals),text:gf.text.trim(),category:gf.category,targetDate:gf.targetDate,why:gf.why||"",steps:gf.steps||"",done:false,submitted:false,parentApproved:false,date:toShort(todayISO())};
      await saveGoals([...goals,entry]);setGf(emptyGoal());setShowForm(false);
    };
    const startEdit=g=>{setEditingId(g.id);setGf({text:g.text||"",category:g.category||"basketball",targetDate:g.targetDate||addDays(7),why:g.why||"",steps:g.steps||""});setShowForm(true);};
    const cancelEdit=()=>{setEditingId(null);setGf(emptyGoal());setShowForm(false);};
    const toggleGoal=async id=>{const ng=goals.map(g=>{if(g.id!==id)return g;const completing=!g.done;if(completing){setBurst(id);setTimeout(()=>setBurst(null),2200);return{...g,done:true,submitted:true,parentApproved:false,completedDate:toShort(todayISO())};}return{...g,done:false,submitted:false,parentApproved:false};});await saveGoals(ng);};
    const removeGoal=async id=>saveGoals(goals.filter(g=>g.id!==id));
    const selectedCat=CAT[gf.category]||CAT.basketball;

    const GoalCard=({g})=>{
      const cat=CAT[g.category]||CAT.basketball;
      return<div style={{borderRadius:16,border:`1px solid ${cat.col}25`,background:`linear-gradient(145deg,${cat.col}08,rgba(255,255,255,.02))`,padding:14,marginBottom:10}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <button onClick={()=>toggleGoal(g.id)} style={{width:38,height:38,borderRadius:999,border:`1.5px solid ${g.done?C.green:cat.col}40`,background:g.done?`${C.green}12`:`${cat.col}10`,color:g.done?C.green:cat.col,cursor:"pointer",fontSize:g.done?16:18,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
            {g.done?"✓":cat.icon}
          </button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:4}}>
              <span style={{fontSize:9,fontWeight:700,color:cat.col,letterSpacing:"1px"}}>{goalCodeFor(goals,g)}</span>
              <span style={{fontSize:9,fontWeight:600,color:cat.col,background:`${cat.col}12`,border:`1px solid ${cat.col}25`,borderRadius:999,padding:"2px 7px"}}>{cat.label}</span>
              {g.parentApproved&&<span style={{fontSize:9,fontWeight:700,color:C.green,background:`${C.green}12`,border:`1px solid ${C.green}30`,borderRadius:999,padding:"2px 7px"}}>✓ Approved</span>}
              {g.done&&!g.parentApproved&&<span style={{fontSize:9,fontWeight:600,color:C.gold,background:`${C.gold}12`,border:`1px solid ${C.gold}30`,borderRadius:999,padding:"2px 7px"}}>⏳ Waiting</span>}
            </div>
            <div style={{fontSize:13,fontWeight:700,color:g.done?C.muted:C.text,lineHeight:1.4,textDecoration:g.done?"line-through":"none"}}>{g.text}</div>
            {g.why&&<div style={{fontSize:11,color:C.muted,marginTop:4,lineHeight:1.4}}>Why: {g.why}</div>}
            {g.targetDate&&<div style={{fontSize:10,color:C.muted,marginTop:4}}>Target: {g.targetDate}</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:7,marginTop:12}}>
          {!g.done&&<button onClick={()=>toggleGoal(g.id)} style={{flex:2,padding:"9px 0",borderRadius:10,border:"none",background:glamGrad,color:C.white,fontWeight:700,cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>I did it ✓</button>}
          {g.done&&!g.parentApproved&&<button onClick={()=>approveGoal(g.id)} style={{flex:2,padding:"9px 0",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.green},${C.sage})`,color:C.white,fontWeight:700,cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Parent OK ✓</button>}
          {g.parentApproved&&<div style={{flex:2,padding:"9px 0",borderRadius:10,border:`1px solid ${C.green}30`,background:`${C.green}10`,textAlign:"center",fontSize:11,color:C.green,fontWeight:700}}>🎟️ Token earned</div>}
          <button onClick={()=>startEdit(g)} style={{flex:1,padding:"9px 0",borderRadius:10,border:`1px solid ${C.borderMed}`,background:"transparent",color:C.muted,fontWeight:600,cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Edit</button>
          <button onClick={()=>removeGoal(g.id)} style={{width:38,height:36,borderRadius:10,border:`1px solid rgba(200,100,100,.2)`,background:`rgba(200,100,100,.06)`,color:"#C47A7A",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {Ico.trash("#C47A7A",14)}
          </button>
        </div>
      </div>;
    };

    return<div>
      {burst&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,pointerEvents:"none",flexDirection:"column",gap:8}}>
        <div style={{fontSize:60,filter:`drop-shadow(0 0 24px ${C.gold})`}}>🎉</div>
        <div style={{fontSize:20,fontWeight:900,color:C.gold}}>+8 Stars!</div>
      </div>}

      {/* Command Center Hero */}
      <div style={{...cs,background:`linear-gradient(145deg,${C.card2},${C.card})`,border:`1px solid ${C.borderMed}`,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:9,color:C.rose,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:4}}>Goal Command Center</div>
            <div style={{fontSize:26,fontWeight:900,color:C.text,lineHeight:1.1,fontFamily:"Georgia,serif"}}>Set it. Do it.<br/>Earn it.</div>
            <div style={{fontSize:11,color:C.muted,marginTop:6,lineHeight:1.5}}>Goals → approval → reward tokens</div>
          </div>
          <div style={{textAlign:"center",padding:"12px 14px",borderRadius:16,background:`${C.gold}12`,border:`1px solid ${C.gold}25`}}>
            <div style={{fontSize:26,fontWeight:900,color:C.gold,lineHeight:1}}>{rewardTokens}</div>
            <div style={{fontSize:8,color:C.muted,fontWeight:700,letterSpacing:"1px",marginTop:4}}>TOKENS</div>
          </div>
        </div>
        <ProgressBar val={pctDone} max={100} col={C.rose} height={6} style={{marginBottom:10}}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
          <SBox value={active.length} label="Active" color={C.rose}/>
          <SBox value={waiting.length} label="Needs OK" color={C.gold}/>
          <SBox value={approved.length} label="Approved" color={C.green}/>
          <SBox value={`${pctDone}%`} label="Progress" color={C.teal}/>
        </div>
      </div>

      {/* Add Goal Button / Form */}
      {!showForm&&<button onClick={()=>setShowForm(true)} style={{width:"100%",padding:"13px",borderRadius:14,border:`1.5px dashed ${C.rose}44`,background:`${C.rose}06`,color:C.rose,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"system-ui",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        {Ico.plus(C.rose,18)} Set a New Goal
      </button>}

      {showForm&&<div style={{...cs,border:`1px solid ${selectedCat.col}30`,marginBottom:12}}>
        <SH icon={null} title={editingId?"Edit Goal":"Create a Goal"} right={<button onClick={cancelEdit} style={{fontSize:11,color:C.muted,background:"none",border:"none",cursor:"pointer",fontFamily:"system-ui"}}>Cancel</button>}/>
        {/* Quick templates */}
        <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:6,marginBottom:10}}>
          {templates.filter(t=>t.category===gf.category).map((t,i)=><button key={i} onClick={()=>setGf(p=>({...p,text:t.text,why:t.why||""}))} style={{flexShrink:0,padding:"7px 12px",borderRadius:10,border:`1px solid ${CAT[t.category].col}30`,background:`${CAT[t.category].col}08`,color:C.textDim,cursor:"pointer",fontSize:10,fontWeight:600,fontFamily:"system-ui",maxWidth:180,textAlign:"left",lineHeight:1.3}}>{t.text.slice(0,40)}…</button>)}
        </div>
        {/* Category picker */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:12}}>
          {Object.entries(CAT).map(([k,v])=><button key={k} onClick={()=>setGf(p=>({...p,category:k}))} style={{padding:"10px 6px",borderRadius:12,border:`1px solid ${gf.category===k?v.col:C.border}`,background:gf.category===k?`${v.col}14`:"transparent",cursor:"pointer",fontFamily:"system-ui",textAlign:"center"}}>
            <div style={{fontSize:18}}>{v.icon}</div>
            <div style={{fontSize:10,fontWeight:700,color:gf.category===k?v.col:C.muted,marginTop:3}}>{v.label}</div>
          </button>)}
        </div>
        <textarea value={gf.text} onChange={e=>setGf(p=>({...p,text:e.target.value}))} placeholder="What do you want to achieve? Be specific…" style={{...TXT,minHeight:80,marginBottom:9,border:`1px solid ${selectedCat.col}30`}}/>
        <input value={gf.why} onChange={e=>setGf(p=>({...p,why:e.target.value}))} placeholder="Why does this goal matter?" style={{...INP,marginBottom:9}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          <div><div style={{fontSize:9,color:C.muted,fontWeight:700,letterSpacing:"1px",marginBottom:5}}>TARGET DATE</div><input type="date" value={gf.targetDate} onChange={e=>setGf(p=>({...p,targetDate:e.target.value}))} style={INP}/></div>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end"}}><button onClick={saveGoal} disabled={!gf.text.trim()} style={{padding:"12px",borderRadius:12,border:"none",background:gf.text.trim()?`linear-gradient(135deg,${selectedCat.col},${C.gold})`:"rgba(255,255,255,.07)",color:C.white,fontWeight:700,cursor:gf.text.trim()?"pointer":"not-allowed",fontSize:13,fontFamily:"system-ui"}}>Lock In 🎯</button></div>
        </div>
      </div>}

      {/* Starter Goals */}
      {!showForm&&goals.length===0&&<div style={{...cs,border:`1px solid ${C.borderMed}`,marginBottom:12}}>
        <SH icon={null} title="⚡ Starter Goals" right={null}/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {templates.slice(0,5).map((t,i)=>{const cat=CAT[t.category]||CAT.basketball;return<button key={i} onClick={()=>{setGf(p=>({...p,text:t.text,category:t.category,why:t.why||""}));setShowForm(true);}} style={{display:"flex",gap:10,alignItems:"center",padding:"11px",borderRadius:13,border:`1px solid ${cat.col}25`,background:`${cat.col}06`,cursor:"pointer",textAlign:"left",fontFamily:"system-ui"}}>
            <div style={{width:36,height:36,borderRadius:10,background:`${cat.col}15`,border:`1px solid ${cat.col}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{cat.icon}</div>
            <div><div style={{fontSize:12,fontWeight:700,color:C.text,lineHeight:1.3}}>{t.text}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{t.why}</div></div>
          </button>;})}
        </div>
      </div>}

      {/* Active Goals */}
      {active.length>0&&<div style={{marginBottom:12}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",color:C.muted,textTransform:"uppercase",marginBottom:8}}>Active Goals · {active.length}</div>
        {active.map(g=><GoalCard key={g.id} g={g}/>)}
      </div>}

      {/* Waiting for parent */}
      {waiting.length>0&&<div style={{...cs,border:`1px solid ${C.gold}25`,background:`${C.gold}05`,marginBottom:12}}>
        <SH icon={null} title={`⏳ Waiting for Parent OK · ${waiting.length}`} right={null}/>
        {waiting.map(g=>{const cat=CAT[g.category]||CAT.basketball;return<div key={g.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{width:34,height:34,borderRadius:999,background:`${cat.col}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{cat.icon}</div>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.text}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>Completed · waiting for approval</div></div>
          <button onClick={()=>approveGoal(g.id)} style={{padding:"8px 10px",borderRadius:10,border:`1px solid ${C.green}30`,background:`${C.green}10`,color:C.green,fontWeight:700,cursor:"pointer",fontSize:10,fontFamily:"system-ui",whiteSpace:"nowrap"}}>Parent OK ✓</button>
        </div>;})}
      </div>}

      {/* Approved Goals */}
      {approved.length>0&&<div style={{marginBottom:12}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",color:C.muted,textTransform:"uppercase",marginBottom:8}}>🎟️ Approved · {approved.length}</div>
        {approved.slice(0,5).map(g=><GoalCard key={g.id} g={g}/>)}
      </div>}
    </div>;
  };


  // ═══════════════════════════════════════════════════════════════════════
  // SPORTS TAB — hoops stats, practice, skills
  // ═══════════════════════════════════════════════════════════════════════
  const Sports=()=>{
    const[section,setSection]=useState("game");
    const emptyGf={pts:"",ast:"",reb:"",stl:"",blk:"",tov:"",fouls:"",fgm:"",fga:"",ftm:"",fta:"",result:"Win",opp:"",effort:0,confidence:0};
    const[gf,setGf]=useState(emptyGf);
    const[editId,setEditId]=useState(null);
    const[pf,setPf]=useState({type:"Team Practice",duration:"",effort:0,note:""});
    const ni=k=>parseInt(gf[k])||0;
    const ftPct=ni("fta")?Math.round(ni("ftm")/ni("fta")*100):null;
    const fgPct=ni("fga")?Math.round(ni("fgm")/ni("fga")*100):null;
    const resetGf=()=>{setGf(emptyGf);setEditId(null);};
    const startEdit=g=>{setSection("game");setEditId(g.id);setGf({pts:String(g.pts??""),ast:String(g.ast??""),reb:String(g.reb??""),stl:String(g.stl??""),blk:String(g.blk??""),tov:String(g.tov??""),fouls:String(g.fouls??""),fgm:String(g.fgm??""),fga:String(g.fga??""),ftm:String(g.ftm??""),fta:String(g.fta??""),result:g.result||"Win",opp:g.opponent||"",effort:g.effort||0,confidence:g.confidence||0});};
    const logGame=async()=>{
      const pts=ni("pts");if(!gf.result)return;
      const base={date:toShort(todayISO()),dateISO:todayISO(),pts,ast:ni("ast"),reb:ni("reb"),stl:ni("stl"),blk:ni("blk"),tov:ni("tov"),fouls:ni("fouls"),fgm:ni("fgm"),fga:ni("fga"),ftm:ni("ftm"),fta:ni("fta"),result:gf.result,opponent:gf.opp,effort:gf.effort,confidence:gf.confidence};
      if(editId){await saveBball(games.map(g=>g.id===editId?{...g,...base,id:g.id}:g),skills);resetGf();return;}
      const ng=[{id:uid(),...base},...games].slice(0,100);await saveBball(ng,skills);
      await addStars((gf.result==="Win"?5:2)+(pts>=15?4:pts>=10?2:pts>=5?1:0)+(gf.effort>=4?1:0));resetGf();
    };
    const logPractice=async()=>{
      const entry={id:uid(),date:toShort(todayISO()),dateISO:todayISO(),type:pf.type,duration:pf.duration,effort:pf.effort,note:pf.note};
      await savePrax([entry,...practices].slice(0,100));await addStars(pf.effort>=4?4:3);
      setPf({type:"Team Practice",duration:"",effort:0,note:""});
    };
    const adjSkill=async(skill,delta)=>{const nv=Math.min(100,Math.max(0,(skills[skill]||0)+delta));await saveBball(games,{...skills,[skill]:nv});if(delta>0)await addStars(1);};
    const wins=games.filter(g=>g.result==="Win").length;
    const s=k=>games.reduce((a,g)=>a+(g[k]||0),0);
    const a=k=>games.length?(s(k)/games.length).toFixed(1):"—";
    const SKILL_GROUPS={"Handles & Scoring":{col:C.rose,items:["Ball Handling","Shooting Form","Layups","Free Throws"]},"Passing & Vision":{col:C.teal,items:["Passing","Court Vision"]},"Defense & Hustle":{col:C.green,items:["Defense","Rebounding","Footwork","Speed & Agility","Conditioning"]},"Mindset":{col:C.gold,items:["Basketball IQ","Confidence","Leadership"]}};
    const numInput=(label,key,big=false)=><div key={key}>
      <div style={{fontSize:9,color:C.muted,fontWeight:600,marginBottom:4,textAlign:"center"}}>{label}</div>
      <input type="number" inputMode="numeric" min="0" placeholder="0" value={gf[key]} onChange={ev=>setGf(p=>({...p,[key]:ev.target.value}))} style={{...INP,textAlign:"center",fontWeight:800,fontSize:big?20:16,padding:big?"10px 4px":"8px 4px"}}/>
    </div>;

    return<div>
      {/* Section tabs */}
      <div style={{display:"flex",gap:6,marginBottom:14,background:`${C.card2}`,borderRadius:14,padding:5}}>
        {[["game","🏀 Game"],["practice","💪 Practice"],["skills","📊 Skills"]].map(([id,label])=><button key={id} onClick={()=>setSection(id)} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",background:section===id?glamGrad:"transparent",color:section===id?C.white:C.muted,fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"system-ui"}}>{label}</button>)}
      </div>

      {section==="game"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:10}}>
          {[{v:games.length,l:"Games",col:C.rose},{v:wins,l:"Wins",col:C.green},{v:a("pts"),l:"Avg Pts",col:C.gold},{v:games.length?Math.round(wins/games.length*100)+"%":"—",l:"Win %",col:C.teal}].map(({v,l,col})=><SBox key={l} value={v} label={l} color={col}/>)}
        </div>
        {(s("fta")>0||s("fga")>0)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
          {s("fga")>0&&<SBox value={Math.round(s("fgm")/s("fga")*100)+"%"} label={`Shots (${s("fgm")}/${s("fga")})`} color={s("fgm")/s("fga")>=.45?C.green:C.teal}/>}
          {s("fta")>0&&<SBox value={Math.round(s("ftm")/s("fta")*100)+"%"} label={`Free Throws (${s("ftm")}/${s("fta")})`} color={s("ftm")/s("fta")>=.7?C.green:C.gold}/>}
        </div>}
        <div style={cs}>
          <SH icon={null} title={editId?"✏️ Edit Game":"➕ Log a Game"} right={editId?<button onClick={resetGf} style={{fontSize:10,color:C.muted,background:"none",border:"none",cursor:"pointer",fontFamily:"system-ui"}}>Cancel</button>:null}/>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {["Win","Loss"].map(r=><button key={r} onClick={()=>setGf(p=>({...p,result:r}))} style={{flex:1,padding:12,borderRadius:12,border:`1.5px solid ${gf.result===r?(r==="Win"?C.green:"#C47A7A"):C.borderMed}`,background:gf.result===r?(r==="Win"?`${C.green}12`:`rgba(196,122,122,.12)`):"transparent",color:gf.result===r?(r==="Win"?C.green:"#C47A7A"):C.muted,fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"system-ui"}}>{r==="Win"?"🏆 Win":"💪 Loss"}</button>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>{[["Points","pts"],["Assists","ast"],["Rebounds","reb"]].map(([l,k])=>numInput(l,k,true))}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>{[["Shots Made","fgm"],["Shots Attempted","fga"],["Free Throws Made","ftm"],["Free Throws Attempted","fta"]].map(([l,k])=>numInput(l,k,false))}</div>
          {(ftPct!==null||fgPct!==null)&&<div style={{display:"flex",gap:8,marginBottom:10}}>
            {fgPct!==null&&<div style={{flex:1,padding:"8px 10px",borderRadius:10,background:`${fgPct>=45?C.green:C.gold}10`,border:`1px solid ${fgPct>=45?C.green:C.gold}25`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:800,color:fgPct>=45?C.green:C.gold}}>{fgPct}%</div><div style={{fontSize:9,color:C.muted}}>Shot %</div></div>}
            {ftPct!==null&&<div style={{flex:1,padding:"8px 10px",borderRadius:10,background:`${ftPct>=70?C.green:C.gold}10`,border:`1px solid ${ftPct>=70?C.green:C.gold}25`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:800,color:ftPct>=70?C.green:C.gold}}>{ftPct}%</div><div style={{fontSize:9,color:C.muted}}>FT %</div></div>}
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:7,marginBottom:12}}>{[["Steals","stl"],["Blocks","blk"],["Turnovers","tov"],["Fouls","fouls"]].map(([l,k])=>numInput(l,k,false))}</div>
          <input value={gf.opp} onChange={e=>setGf(p=>({...p,opp:e.target.value}))} placeholder="Opponent (optional)" style={{...INP,marginBottom:10}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div><div style={{fontSize:9,color:C.muted,fontWeight:600,letterSpacing:"1px",marginBottom:6}}>EFFORT</div><RD val={gf.effort} max={5} col={C.gold} onSet={v=>setGf(p=>({...p,effort:v}))}/></div>
            <div><div style={{fontSize:9,color:C.muted,fontWeight:600,letterSpacing:"1px",marginBottom:6}}>CONFIDENCE</div><RD val={gf.confidence} max={5} col={C.rose} onSet={v=>setGf(p=>({...p,confidence:v}))}/></div>
          </div>
          <button onClick={logGame} style={{width:"100%",padding:13,borderRadius:12,border:"none",background:glamGrad,color:C.white,fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"system-ui"}}>{editId?"Save Changes":"Save Game ⭐"}</button>
        </div>
        {games.length>0&&<div style={cs}>
          <SH icon={null} title="Game History" right={null}/>
          {games.slice(0,10).map(g=><div key={g.id} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`,alignItems:"flex-start"}}>
            <div style={{width:34,height:34,borderRadius:999,background:g.result==="Win"?`${C.green}12`:`rgba(196,122,122,.12)`,border:`1px solid ${g.result==="Win"?C.green+"30":"rgba(196,122,122,.3)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{g.result==="Win"?"🏆":"💪"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:4}}>{g.result}{g.opponent?` vs ${g.opponent}`:""}</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {[["Pts",g.pts,C.gold],["Ast",g.ast,C.teal],["Reb",g.reb,C.green],["Stl",g.stl,C.blue]].filter(([,v])=>(v||0)>0).map(([l,v,col])=><span key={l} style={{fontSize:9,color:col,background:`${col}12`,padding:"2px 7px",borderRadius:999,fontWeight:700}}>{l} {v}</span>)}
              </div>
              <div style={{fontSize:9,color:C.muted,marginTop:4}}>{g.date}</div>
            </div>
            <div style={{display:"flex",gap:5,flexShrink:0}}>
              <button onClick={()=>startEdit(g)} style={{padding:"5px 8px",borderRadius:8,border:`1px solid ${C.borderMed}`,background:"transparent",color:C.muted,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"system-ui"}}>Edit</button>
              <button onClick={()=>saveBball(games.filter(x=>x.id!==g.id),skills)} style={{padding:"5px 8px",borderRadius:8,border:`1px solid rgba(196,122,122,.25)`,background:`rgba(196,122,122,.06)`,color:"#C47A7A",fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"system-ui"}}>Del</button>
            </div>
          </div>)}
        </div>}
      </>}

      {section==="practice"&&<>
        <div style={cs}>
          <SH icon={null} title="Log a Practice" right={null}/>
          <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:12}}>
            {PRACTICE_TYPES.map(t=><Chip key={t} label={t} active={pf.type===t} col={C.rose} onClick={()=>setPf(p=>({...p,type:t}))}/>)}
          </div>
          <div style={{fontSize:9,color:C.muted,fontWeight:600,letterSpacing:"1px",marginBottom:6}}>MINUTES</div>
          <input type="number" inputMode="numeric" placeholder="e.g. 60" value={pf.duration} onChange={e=>setPf(p=>({...p,duration:e.target.value}))} style={{...INP,textAlign:"center",fontSize:20,fontWeight:800,marginBottom:12}}/>
          <div style={{fontSize:9,color:C.muted,fontWeight:600,letterSpacing:"1px",marginBottom:6}}>EFFORT</div>
          <EmojiPick val={pf.effort} emojis={["😴","🙂","😊","💪","🔥"]} onSet={v=>setPf(p=>({...p,effort:v}))} col={C.rose}/>
          <textarea value={pf.note} onChange={e=>setPf(p=>({...p,note:e.target.value}))} placeholder="What did you work on?" style={{...TXT,minHeight:60,marginTop:12,marginBottom:12}}/>
          <button onClick={logPractice} style={{width:"100%",padding:13,borderRadius:12,border:"none",background:glamGrad,color:C.white,fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"system-ui"}}>Save Practice ⭐</button>
        </div>
        {practices.length>0&&<div style={cs}>
          <SH icon={null} title={`Practice History · ${practices.length}`} right={null}/>
          {practices.slice(0,8).map(p=><div key={p.id} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:32,height:32,borderRadius:999,background:`${C.rose}12`,border:`1px solid ${C.rose}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>💪</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:C.text}}>{p.type}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:2}}>{p.date}{p.duration?` · ${p.duration} min`:""}{" ⭐".repeat(p.effort||0)}</div>
              {p.note&&<div style={{fontSize:10,color:C.textDim,marginTop:2,lineHeight:1.4}}>{p.note}</div>}
            </div>
            <button onClick={()=>savePrax(practices.filter(x=>x.id!==p.id))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>×</button>
          </div>)}
        </div>}
      </>}

      {section==="skills"&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          <SBox value={Math.round(avgArr(Object.values(skills)))+"%"} label="Overall Rating" color={SKILL_COL(Math.round(avgArr(Object.values(skills))))}/>
          <SBox value={Object.entries(skills).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—"} label="Top Skill" color={C.gold}/>
        </div>
        {Object.entries(SKILL_GROUPS).map(([grp,g])=><div key={grp} style={{...cs,border:`1px solid ${g.col}18`,marginBottom:10}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",color:g.col,textTransform:"uppercase",marginBottom:12}}>{grp}</div>
          {g.items.map(sk=>{const v=skills[sk]||0;return<div key={sk} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <span style={{fontSize:12,fontWeight:600,color:C.text}}>{sk}</span>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:9,fontWeight:700,color:SKILL_COL(v),background:`${SKILL_COL(v)}12`,padding:"2px 7px",borderRadius:999}}>{SKILL_LEVEL(v)}</span>
                <span style={{fontSize:13,fontWeight:800,color:SKILL_COL(v),minWidth:34,textAlign:"right"}}>{v}%</span>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={()=>adjSkill(sk,-5)} style={{width:28,height:28,borderRadius:8,border:`1px solid rgba(196,122,122,.25)`,background:`rgba(196,122,122,.06)`,color:"#C47A7A",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"system-ui"}}>−</button>
                  <button onClick={()=>adjSkill(sk,5)} style={{width:28,height:28,borderRadius:8,border:`1px solid ${C.gold}30`,background:`${C.gold}08`,color:C.gold,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"system-ui"}}>+</button>
                </div>
              </div>
            </div>
            <ProgressBar val={v} max={100} col={SKILL_COL(v)} height={5}/>
          </div>;})}
        </div>)}
      </>}
    </div>;
  };


  // ═══════════════════════════════════════════════════════════════════════
  // REWARDS TAB — wishlist, reward shop, daily ideas
  // ═══════════════════════════════════════════════════════════════════════
  const Rewards=()=>{
    const[wf,setWf]=useState({name:"",why:"",priority:"Dream 🌟",goalId:""});
    const[filter,setFilter]=useState("all");
    const cleanGoals=safeObjects(goals);
    const cleanClaims=safeObjects(rewardClaims);
    const cleanWish=safeObjects(shoeWish);
    const shown=filter==="all"?cleanWish:cleanWish.filter(x=>(x.category||"other")===filter);
    const cats=[...new Set(cleanWish.map(x=>x.category||"other"))];
    const WISH_STORES={sneakers:["nike","stockx","goat"],clothing:["target","amazon"],beauty:["sephora","ulta","target"],toys:["amazon","target"],other:["google","amazon","target"]};
    const shopUrl=(shop,query)=>{const q=encodeURIComponent(query||"");if(shop==="nike")return`https://www.nike.com/w?q=${q}`;if(shop==="stockx")return`https://stockx.com/search?s=${q}`;if(shop==="goat")return`https://www.goat.com/search?query=${q}`;if(shop==="sephora")return`https://www.sephora.com/search?keyword=${q}`;if(shop==="ulta")return`https://www.ulta.com/search?search=${q}`;if(shop==="target")return`https://www.target.com/s?searchTerm=${q}`;if(shop==="amazon")return`https://www.amazon.com/s?k=${q}`;return`https://www.google.com/search?q=${q}`;};
    const openShop=(shop,q)=>{try{window.open(shopUrl(shop,q),"_blank","noopener,noreferrer");}catch{}};
    const detectCat=name=>{const s=(name||"").toLowerCase();if(/shoe|sneaker|jordan|kobe|nike|adidas|dunks|air force/.test(s))return"sneakers";if(/hoodie|shirt|tee|pants|cargo|shorts|jacket|sweats|dress/.test(s))return"clothing";if(/lip|balm|skincare|face|moisturizer|gloss|makeup|blush/.test(s))return"beauty";if(/toy|lego|plush|game|squish|charm|sticker/.test(s))return"toys";return"other";};
    const addWish=async()=>{
      const name=wf.name.trim();if(!name)return;
      const category=detectCat(name);
      const stores=WISH_STORES[category]||WISH_STORES.other;
      const item={id:uid(),name,category,why:wf.why.trim(),priority:wf.priority,search:name,goalId:wf.goalId||"",cost:wf.priority.includes("Dream")?3:wf.priority.includes("Next")?2:1,storeList:stores};
      stores.forEach(shop=>{item[`${shop}Url`]=shopUrl(shop,name);});
      await saveStyle(styleLog,[item,...cleanWish].slice(0,60));await addStars(1);
      setWf({name:"",why:"",priority:"Dream 🌟",goalId:""});
    };
    const removeItem=async item=>saveStyle(styleLog,cleanWish.filter(x=>x.id!==item.id));

    const catEmoji={sneakers:"👟",clothing:"👚",beauty:"💄",toys:"🧸",school:"🎒",other:"🌟"};
    const priCol={3:C.rose,2:C.gold,1:C.teal};

    return<div>
      {/* Reward Shop Header */}
      <div style={{...cs,background:`linear-gradient(145deg,${C.card2},${C.card})`,border:`1px solid ${C.borderMed}`,marginBottom:12}}>
        <SH icon={Ico.rewards(C.gold,14)} title="Rewards & Wishlist" right={null}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:12}}>
          <SBox value={approvedGoalCount} label="Approved" color={C.green}/>
          <SBox value={spentTokens} label="Used" color={C.rose}/>
          <SBox value={rewardTokens} label="Available" color={C.gold}/>
        </div>
        <div style={{fontSize:11,color:C.muted,lineHeight:1.55}}>Earn reward tokens by completing goals and getting parent approval. Each approved goal = 1 token.</div>
      </div>

      {/* Add Reward Form */}
      <div style={{...cs,border:`1px solid ${C.borderMed}`,marginBottom:12}}>
        <SH icon={null} title="Add a Reward" right={null}/>
        <input value={wf.name} onChange={e=>setWf(p=>({...p,name:e.target.value}))} placeholder="Nike Sabrina 3, Cozy Hoodie, lip balm set…" style={{...INP,marginBottom:9}}/>
        <input value={wf.why} onChange={e=>setWf(p=>({...p,why:e.target.value}))} placeholder="Why do I want this?" style={{...INP,marginBottom:9}}/>
        <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:10}}>
          {["Dream 🌟","Next Up 🔜","Maybe 🤔","Have It ✅"].map(p=><Chip key={p} label={p} active={wf.priority===p} col={C.gold} onClick={()=>setWf(x=>({...x,priority:p}))}/>)}
        </div>
        {cleanGoals.length>0&&<select value={wf.goalId} onChange={e=>setWf(p=>({...p,goalId:e.target.value}))} style={{...INP,marginBottom:10,appearance:"none"}}>
          <option value="">Link to a goal (optional)</option>
          {cleanGoals.map(g=><option key={g.id} value={g.id}>{goalCodeFor(cleanGoals,g)} — {String(g.text||"").slice(0,50)}</option>)}
        </select>}
        <button onClick={addWish} style={{width:"100%",padding:"12px",borderRadius:12,border:"none",background:goldGrad,color:C.white,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"system-ui"}}>Add to Wishlist ⭐</button>
      </div>

      {/* Saved Wishlist */}
      {cleanWish.length>0&&<div style={{...cs,border:`1px solid ${C.borderMed}`}}>
        <SH icon={null} title={`My Wishlist · ${cleanWish.length}`} right={null}/>
        {cats.length>1&&<div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:10}}>
          <Chip label="All" active={filter==="all"} col={C.rose} onClick={()=>setFilter("all")}/>
          {cats.map(c=><Chip key={c} label={`${catEmoji[c]||"🌟"} ${c}`} active={filter===c} col={C.rose} onClick={()=>setFilter(c)}/>)}
        </div>}
        {shown.map(item=>{
          const claim=cleanClaims.find(r=>r.itemId===item.id&&r.status!=="rejected");
          const cost=rewardCost(item);const enough=rewardTokens>=cost;
          const stores=(Array.isArray(item.storeList)&&item.storeList.length)?item.storeList:(WISH_STORES[item.category||"other"]||WISH_STORES.other);
          return<div key={item.id} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
            {/* Product image — light cream bg like screenshot */}
            <div style={{width:70,height:70,borderRadius:12,background:C.cream2,border:`1px solid ${C.cream3}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,overflow:"hidden"}}>
              {item.img?<img src={item.img} alt={item.name} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.currentTarget.style.display="none"}/>:<span>{catEmoji[item.category||"other"]||"🌟"}</span>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,color:C.text,lineHeight:1.3,marginBottom:3}}>{item.name}</div>
              <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap",marginBottom:5}}>
                <span style={{fontSize:9,fontWeight:700,color:priCol[cost]||C.muted,background:`${priCol[cost]||C.muted}12`,padding:"2px 7px",borderRadius:999}}>{item.priority||"Wishlist"}</span>
                <span style={{fontSize:9,color:C.muted,fontWeight:600}}>{cost} token{cost===1?"":"s"}</span>
              </div>
              {item.why&&<div style={{fontSize:10,color:C.muted,lineHeight:1.35,marginBottom:5}}>{item.why}</div>}
              {claim&&<div style={{fontSize:10,color:claim.status==="approved"?C.green:C.gold,fontWeight:700,marginBottom:5}}>{claim.status==="approved"?"✅ Parent approved!":"⏳ Requested — waiting"}</div>}
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {stores.slice(0,3).map(shop=><button key={shop} onClick={()=>openShop(shop,item.search||item.name)} style={{padding:"5px 9px",borderRadius:8,border:`1px solid ${C.borderMed}`,background:"transparent",color:C.mutedLight,fontWeight:600,cursor:"pointer",fontSize:9,fontFamily:"system-ui"}}>{shop.toUpperCase()}</button>)}
                {!claim&&<button disabled={!enough} onClick={()=>requestReward(item)} style={{padding:"5px 9px",borderRadius:8,border:`1px solid ${enough?C.gold:C.borderMed}`,background:enough?`${C.gold}12`:"transparent",color:enough?C.gold:C.muted,fontWeight:700,cursor:enough?"pointer":"not-allowed",fontSize:9,fontFamily:"system-ui"}}>{enough?"Request 🎟️":"Locked"}</button>}
                {claim?.status==="requested"&&<button onClick={()=>updateRewardClaim(claim.id,"approved")} style={{padding:"5px 9px",borderRadius:8,border:`1px solid ${C.green}30`,background:`${C.green}10`,color:C.green,fontWeight:700,cursor:"pointer",fontSize:9,fontFamily:"system-ui"}}>Parent OK ✓</button>}
              </div>
            </div>
            <button onClick={()=>removeItem(item)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18,flexShrink:0}}>×</button>
          </div>;
        })}
      </div>}
      {cleanWish.length===0&&<div style={{textAlign:"center",padding:"32px 20px",color:C.muted}}>
        <div style={{fontSize:42,marginBottom:8}}>🛍️</div>
        <div style={{fontSize:13,marginBottom:4}}>Your wishlist is empty.</div>
        <div style={{fontSize:11}}>Add sneakers, clothes, beauty, or anything you want to earn.</div>
      </div>}
    </div>;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // PROGRESS TAB — stats overview, school grades, sleep, routine, badges
  // ═══════════════════════════════════════════════════════════════════════
  const Progress=()=>{
    const avgSk=Math.round(avgArr(Object.values(skills)))||0;
    const gpa=parseFloat(gpaCalc(subjects))||0;
    const wins=games.filter(g=>g.result==="Win").length;
    const winPct=games.length?Math.round(wins/games.length*100):0;
    const avgSleepH=sleepEntries.length?avgArr(sleepEntries.slice(0,7).map(e=>e.hours)).toFixed(1):"—";
    const overallGlow=Math.round(avgArr([avgSk,Math.round(gpa/4*100),games.length?winPct:0].filter(v=>v>0)))||0;
    const updateGrade=async(s,g)=>saveSchool({...subjects,[s]:g});
    const earnedBadges=BADGE_DEFS.filter(b=>b.check(badgeData));
    const lockedBadges=BADGE_DEFS.filter(b=>!b.check(badgeData));

    // Sleep
    const[sf,setSf]=useState({bed:"21:00",wake:"06:30",quality:0});
    const calcH=(b,w)=>{try{const[bh,bm]=b.split(":").map(Number),[wh,wm]=w.split(":").map(Number);let m=(wh*60+wm)-(bh*60+bm);if(m<0)m+=1440;return Math.round(m/60*10)/10;}catch{return 0;}};
    const hoursNow=calcH(sf.bed,sf.wake);
    const addSleep=async()=>{if(!sf.quality)return;const entry={id:uid(),date:toShort(todayISO()),dateISO:todayISO(),bedtime:sf.bed,waketime:sf.wake,hours:hoursNow,quality:sf.quality};await saveSleep([entry,...sleepEntries].slice(0,90));await addStars(hoursNow>=9?3:2);setSf({bed:"21:00",wake:"06:30",quality:0});};

    // Routine
    const todayR=routineHist[todayISO()]||{c:{}};const rChecked=todayR.c||{};
    const rDone=routineItems.filter(i=>rChecked[i.id]).length;
    const toggleR=async id=>{const nc={...rChecked,[id]:!rChecked[id]};const ne={...routineHist,[todayISO()]:{...todayR,c:nc}};await saveRoutine(ne,routineItems);if(!rChecked[id])await addStars(1);};

    return<div>
      {/* Level + Overall */}
      <div style={{...cs,background:`linear-gradient(145deg,${C.card2},${C.card})`,border:`1px solid ${C.borderMed}`,textAlign:"center",marginBottom:12}}>
        <div style={{display:"flex",justify:"center",alignItems:"center",justifyContent:"center",marginBottom:8}}>{Ico.crown(C.gold,20)}</div>
        <div style={{fontSize:28,fontWeight:900,color:C.text,letterSpacing:"-.5px",fontFamily:"Georgia,serif"}}>{profile.name}</div>
        <div style={{display:"inline-block",marginTop:6,padding:"5px 14px",borderRadius:999,background:`${C.rose}14`,border:`1px solid ${C.rose}30`,fontSize:12,fontWeight:700,color:C.rose}}>Level {level} · {levelTitle}</div>
        <div style={{marginTop:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:9,color:C.muted}}>LV {level}</span><span style={{fontSize:9,color:C.rose,fontWeight:700}}>{xpInLevel}/{xpPerLevel} XP</span></div>
          <ProgressBar val={xpInLevel} max={xpPerLevel} col={C.rose} height={6}/>
        </div>
        <div style={{fontSize:22,fontWeight:900,color:C.gold,marginTop:10}}>{stars} ⭐ total</div>
        <div style={{fontSize:11,color:C.muted,marginTop:3}}>Glow Score: <span style={{color:SKILL_COL(overallGlow),fontWeight:700}}>{overallGlow}%</span></div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <SBox value={games.length} label="Games 🏀" color={C.rose}/>
        <SBox value={`${winPct}%`} label="Win Rate" color={C.green}/>
        <SBox value={practices.length} label="Practices" color={C.teal}/>
        <SBox value={avgSk+"%"} label="Skill Rating" color={SKILL_COL(avgSk)}/>
        <SBox value={gpa||"—"} label="GPA" color={gpa>=3.5?C.green:gpa>=3?C.teal:C.gold}/>
        <SBox value={avgSleepH} label="Avg Sleep" color={parseFloat(avgSleepH)>=8?C.green:C.gold}/>
      </div>

      {/* School Grades */}
      <div style={{...cs,border:`1px solid ${C.borderMed}`,marginBottom:12}}>
        <SH icon={Ico.school(C.teal,14)} title="School Grades" right={<span style={{fontSize:10,color:C.muted}}>4 = highest</span>}/>
        {Object.entries(subjects).map(([s,grade])=><div key={s} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{flex:1,fontSize:13,fontWeight:600,color:C.text}}>{s}</div>
          <div style={{display:"flex",gap:4}}>
            {["4","3","2","1"].map(g=>{const active=String(grade||3)===g;const col=GRADE_COL[g]||C.muted;return<button key={g} onClick={()=>updateGrade(s,g)} style={{width:32,height:32,borderRadius:9,border:`1.5px solid ${active?col:C.border}`,background:active?`${col}14`:"transparent",color:active?col:C.muted,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"system-ui",transition:"all .15s"}}>{g}</button>;})}
          </div>
        </div>)}
        <div style={{marginTop:10,padding:"10px 12px",borderRadius:12,background:`${C.teal}08`,border:`1px solid ${C.teal}20`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,fontWeight:600,color:C.text}}>GPA</span>
          <span style={{fontSize:20,fontWeight:900,color:gpa>=3.5?C.green:gpa>=3?C.teal:C.gold}}>{gpaCalc(subjects)}</span>
        </div>
      </div>

      {/* Sleep */}
      <div style={{...cs,border:`1px solid ${C.borderMed}`,marginBottom:12}}>
        <SH icon={null} title="🌙 Sleep Log" right={<span style={{fontSize:10,color:C.muted}}>{sleepEntries.length} nights</span>}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div><div style={{fontSize:9,color:C.muted,fontWeight:600,marginBottom:4}}>BEDTIME</div><input type="time" value={sf.bed} onChange={e=>setSf(p=>({...p,bed:e.target.value}))} style={INP}/></div>
          <div><div style={{fontSize:9,color:C.muted,fontWeight:600,marginBottom:4}}>WAKE TIME</div><input type="time" value={sf.wake} onChange={e=>setSf(p=>({...p,wake:e.target.value}))} style={INP}/></div>
        </div>
        <div style={{textAlign:"center",padding:"10px",borderRadius:12,background:`${C.rose}08`,border:`1px solid ${C.rose}20`,marginBottom:10}}>
          <div style={{fontSize:22,fontWeight:900,color:hoursNow>=9?C.green:hoursNow>=8?C.teal:C.gold}}>{hoursNow}h</div>
          <div style={{fontSize:9,color:C.muted}}>planned sleep</div>
        </div>
        <div style={{fontSize:9,color:C.muted,fontWeight:600,marginBottom:8}}>SLEEP QUALITY</div>
        <EmojiPick val={sf.quality} emojis={["😴","🙂","😊","😎","👑"]} onSet={v=>setSf(p=>({...p,quality:v}))} col={C.rose}/>
        <button onClick={addSleep} style={{width:"100%",marginTop:12,padding:"12px",borderRadius:12,border:"none",background:glamGrad,color:C.white,fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"system-ui"}}>Save Sleep 🌙</button>
        {sleepEntries.length>0&&<div style={{display:"flex",alignItems:"flex-end",gap:4,height:50,marginTop:12}}>
          {[...sleepEntries.slice(0,7)].reverse().map((e,i)=>{const h=Math.max(5,Math.round((e.hours/10)*44));const col=e.hours>=9?C.green:e.hours>=8?C.teal:C.gold;return<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><div style={{fontSize:7,color:col,fontWeight:700}}>{e.hours}h</div><div style={{width:"100%",height:h,background:col,borderRadius:"4px 4px 2px 2px",opacity:.7}}/></div>;})}
        </div>}
      </div>

      {/* Glow Routine */}
      <div style={{...cs,border:`1px solid ${C.borderMed}`,marginBottom:12}}>
        <SH icon={null} title={`✨ Glow Routine (${rDone}/${routineItems.length})`} right={<span style={{fontSize:11,fontWeight:700,color:rDone===routineItems.length?C.green:C.muted}}>{Math.round(rDone/Math.max(routineItems.length,1)*100)}%</span>}/>
        <ProgressBar val={rDone} max={Math.max(routineItems.length,1)} col={rDone===routineItems.length?C.green:C.rose} height={5} style={{marginBottom:12}}/>
        {routineItems.map(item=>{const ok=!!rChecked[item.id];return<div key={item.id} style={{display:"flex",gap:10,alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
          <button onClick={()=>toggleR(item.id)} style={{width:28,height:28,borderRadius:999,border:`1.5px solid ${ok?C.green:C.borderMed}`,background:ok?`${C.green}12`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .15s"}}>
            {ok&&<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </button>
          <div style={{fontSize:14,marginRight:4}}>{item.e}</div>
          <div style={{flex:1,fontSize:12,fontWeight:500,color:ok?C.muted:C.text,textDecoration:ok?"line-through":"none"}}>{item.label}</div>
          {ok&&<span style={{fontSize:10,color:C.green,fontWeight:700}}>+1⭐</span>}
        </div>;})}
      </div>

      {/* Badges */}
      {earnedBadges.length>0&&<div style={{...cs,border:`1px solid ${C.borderMed}`,marginBottom:12}}>
        <SH icon={null} title={`🏅 Badges (${earnedBadges.length}/${BADGE_DEFS.length})`} right={null}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {earnedBadges.map(b=><div key={b.id} style={{padding:"12px 8px",borderRadius:14,background:`${C.gold}08`,border:`1px solid ${C.gold}20`,textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:4}}>{b.icon}</div>
            <div style={{fontSize:10,fontWeight:700,color:C.gold,lineHeight:1.2}}>{b.name}</div>
          </div>)}
          {lockedBadges.slice(0,6-earnedBadges.length).map(b=><div key={b.id} style={{padding:"12px 8px",borderRadius:14,background:"rgba(255,255,255,.02)",border:`1px solid ${C.border}`,textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:4,filter:"grayscale(1) opacity(.3)"}}>{b.icon}</div>
            <div style={{fontSize:10,fontWeight:600,color:C.muted,lineHeight:1.2}}>{b.desc}</div>
          </div>)}
        </div>
      </div>}
    </div>;
  };


  const CONTENT={today:Today,goals:Goals,hoops:Sports,rewards:Rewards,progress:Progress,coach:CoachDetail,virgo:VirgoDetail};

  return<div style={{background:C.bg,minHeight:"100vh",fontFamily:"system-ui,-apple-system,'SF Pro Display',sans-serif",color:C.text}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap');
      *{box-sizing:border-box}
      button,[role="button"]{-webkit-tap-highlight-color:transparent;touch-action:manipulation;user-select:none;appearance:none}
      input,textarea,select{font-size:16px!important}
      ::-webkit-scrollbar{display:none}
      body{margin:0;overflow-x:hidden}
      input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(.6)}
      input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(.6)}
    `}</style>
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",position:"relative"}}>

      {/* ── STICKY HEADER — minimal, warm dark ── */}
      <div style={{position:"sticky",top:0,zIndex:50,padding:"12px 16px 10px",background:`${C.bg}F0`,backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:900,fontSize:20,letterSpacing:"-.3px",lineHeight:1,color:C.text}}>{profile.name}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
              <div style={{width:60,height:3,borderRadius:99,background:`${C.borderMed}55`,overflow:"hidden"}}><div style={{height:"100%",width:`${(xpInLevel/xpPerLevel)*100}%`,background:glamGrad,borderRadius:99,transition:"width .4s"}}/></div>
              <span style={{fontSize:8,color:C.rose,fontWeight:700}}>LV {level} {levelTitle}</span>
              {habitStreak>1&&<span style={{fontSize:8,color:C.gold,fontWeight:700}}>{Ico.flame(C.gold,10)} {habitStreak}</span>}
              {familyCode&&<span style={{fontSize:8,color:C.teal,fontWeight:600}}>☁ {familyCode}</span>}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",borderRadius:999,background:C.card2,border:`1px solid ${C.borderMed}`}}>
              {Ico.star(C.gold,13)}
              <span style={{fontSize:14,fontWeight:800,color:C.text}}>{stars}</span>
            </div>
            <button onClick={()=>setShowSettings(!showSettings)} style={{width:36,height:36,borderRadius:12,background:C.card2,border:`1px solid ${C.borderMed}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={C.muted} strokeWidth="1.8"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={C.muted} strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── SETTINGS SHEET ── */}
      {showSettings&&<div style={{position:"fixed",inset:0,background:C.overlay,zIndex:100,display:"flex",alignItems:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)setShowSettings(false);}}>
        <div style={{width:"100%",maxWidth:430,margin:"0 auto",background:C.card,borderRadius:"24px 24px 0 0",padding:24,paddingBottom:48,border:`1px solid ${C.borderMed}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontSize:17,fontWeight:800,color:C.text}}>Settings</div>
            <button onClick={()=>setShowSettings(false)} style={{width:32,height:32,borderRadius:10,background:`rgba(255,255,255,.08)`,border:"none",color:C.text,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
          {[["YOUR NAME","name","text","e.g. Scarlett"],["GRADE","grade","text","e.g. 5th"],["TEAM (optional)","teamName","text","e.g. Lady Eagles"]].map(([label,key,type,ph])=><div key={key} style={{marginBottom:14}}>
            <div style={{fontSize:9,color:C.muted,fontWeight:700,letterSpacing:"1.5px",marginBottom:5}}>{label}</div>
            <input value={profile[key]||""} onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))} placeholder={ph} style={INP}/>
          </div>)}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:C.muted,fontWeight:700,letterSpacing:"1.5px",marginBottom:5}}>BIRTHDAY</div>
            <input type="date" value={profile.birthDate||"2015-08-28"} onChange={e=>setProfile(p=>({...p,birthDate:e.target.value}))} style={INP}/>
            <div style={{fontSize:9,color:C.gold,fontWeight:600,marginTop:5}}>♍ Virgo daily vibe</div>
          </div>
          <div style={{height:1,background:C.border,margin:"16px 0"}}/>
          <div style={{fontSize:9,color:C.teal,fontWeight:700,letterSpacing:"1.5px",marginBottom:8}}>☁ FAMILY SYNC</div>
          <div style={{fontSize:11,color:C.muted,marginBottom:10,lineHeight:1.6}}>Enter the same code on every device to sync data between phones.</div>
          {familyCode?<>
            <div style={{background:`${C.green}10`,border:`1px solid ${C.green}25`,borderRadius:14,padding:14,textAlign:"center",marginBottom:10}}>
              <div style={{fontSize:9,color:C.green,fontWeight:700,letterSpacing:"2px",marginBottom:5}}>ACTIVE CODE</div>
              <div style={{fontSize:28,fontWeight:900,letterSpacing:"8px",color:C.text}}>{familyCode}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{try{navigator.clipboard.writeText(familyCode);}catch{}}} style={{flex:1,padding:11,borderRadius:11,border:`1px solid ${C.teal}30`,background:`${C.teal}08`,color:C.teal,fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"system-ui"}}>Copy 📋</button>
              <button onClick={()=>{setFCGlobal(null);setFamilyCode("");}} style={{flex:1,padding:11,borderRadius:11,border:`1px solid rgba(196,122,122,.3)`,background:`rgba(196,122,122,.06)`,color:"#C47A7A",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"system-ui"}}>Disconnect</button>
            </div>
          </>:<>
            <input value={codeInput} onChange={e=>setCodeInput(e.target.value.toUpperCase())} placeholder="Enter code (e.g. SC7X2K)" maxLength={6} style={{...INP,letterSpacing:"6px",fontWeight:800,fontSize:18,textAlign:"center",marginBottom:8}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>activateCode(codeInput)} style={{flex:1,padding:11,borderRadius:11,border:"none",background:glamGrad,color:C.white,fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"system-ui"}}>Connect ☁</button>
              <button onClick={()=>activateCode(genCode())} style={{flex:1,padding:11,borderRadius:11,border:`1px solid ${C.borderMed}`,background:C.card2,color:C.mutedLight,fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"system-ui"}}>Create New</button>
            </div>
          </>}
        </div>
      </div>}

      {/* ── SCROLLABLE CONTENT ── */}
      <div onFocusCapture={onEditFocus} onBlurCapture={onEditBlur} style={{padding:"14px 16px calc(90px + env(safe-area-inset-bottom,0px))"}}>
        <TabErrorBoundary key={`err_${tab}`}><StableRenderer key={tab} render={CONTENT[tab]||Today}/></TabErrorBoundary>
      </div>

      {/* ── BOTTOM NAV — matches screenshot exactly ── */}
      <div style={{
        position:"fixed",left:0,right:0,
        bottom:0,
        transform:editing?"translateY(calc(100% + 8px))":"translateY(0)",
        opacity:editing?0:1,
        pointerEvents:editing?"none":"auto",
        transition:"transform .2s ease,opacity .15s ease",
        background:`${C.card}F5`,
        backdropFilter:"blur(24px)",
        borderTop:`1px solid ${C.borderMed}`,
        zIndex:60,
        paddingBottom:"env(safe-area-inset-bottom,0px)",
      }}>
        <div style={{maxWidth:430,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(5,1fr)",padding:"8px 8px"}}>
          {TABS.map(t=>{
            const active=tab===t.id;
            const iconFn={today:Ico.home,goals:Ico.goals,hoops:Ico.sports,rewards:Ico.rewards,progress:Ico.progress}[t.id]||Ico.home;
            const col=active?C.rose:C.muted;
            return<button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",padding:"8px 0",cursor:"pointer",fontFamily:"system-ui",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"opacity .15s",opacity:active?1:.7}}>
              <div style={{width:active?38:32,height:active?38:32,borderRadius:active?14:12,background:active?glamGrad:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",boxShadow:active?`0 4px 16px ${C.rose}44`:"none"}}>
                {iconFn(active?C.white:C.muted,active?18:16)}
              </div>
              <span style={{fontSize:9,fontWeight:active?700:500,color:col,letterSpacing:".3px"}}>{t.label}</span>
            </button>;
          })}
        </div>
      </div>

    </div>
  </div>;
}
