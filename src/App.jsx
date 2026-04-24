import { useState, useEffect, useRef, useCallback } from "react";

const C={bg:"#06040F",nav:"#0C0A1A",navy:"#0E0B1B",navy2:"#150F28",card:"#180D2C",card2:"#1E1238",border:"rgba(255,255,255,.12)",coral:"#FF3D7F",teal:"#00E5CC",purple:"#8B5CF6",gold:"#FFD700",green:"#22D97A",blue:"#4DA6FF",pink:"#FF1A8C",orange:"#FF7A2F",red:"#FF3D5A",white:"#FFFFFF",text:"#FFF0FF",muted:"#A89BC0",light:"#E8D5FF"};
const TABS=[{id:"today",e:"🏠",label:"Today"},{id:"games",e:"🏀",label:"Games"},{id:"practice",e:"💪",label:"Practice"},{id:"style",e:"👟",label:"Style"},{id:"routine",e:"✨",label:"Routine"},{id:"sleep",e:"🌙",label:"Sleep"},{id:"skills",e:"📊",label:"Skills"},{id:"school",e:"📚",label:"School"},{id:"coach",e:"🤖",label:"Coach"},{id:"goals",e:"🎯",label:"Goals"},{id:"progress",e:"📈",label:"Glow Up"},{id:"settings",e:"⚙️",label:"Setup"}];
const DEF_VITALS={energy:0,mood:0};
const DEF_HABITS=[{id:"h1",time:"Morning",label:"Drink water first thing",group:"MORNING"},{id:"h2",time:"Morning",label:"Make my bed",group:"MORNING"},{id:"h3",time:"After School",label:"Homework before screens",group:"SCHOOL"},{id:"h4",time:"Evening",label:"Basketball practice or drills",group:"BASKETBALL"},{id:"h5",time:"Night",label:"Read for 20 minutes",group:"WIND DOWN"},{id:"h6",time:"Night",label:"In bed by 9:00 PM",group:"WIND DOWN"}];
const DEF_SKILLS={"Ball Handling":35,"Shooting Form":30,"Layups":35,"Free Throws":30,"Passing":35,"Court Vision":30,"Defense":30,"Rebounding":30,"Footwork":30,"Speed & Agility":35,"Conditioning":35,"Basketball IQ":30,"Confidence":45,"Leadership":40};
const DEF_SUBJECTS={Math:"B",Reading:"A",Science:"B","Social Studies":"B",Writing:"B"};
const DEF_TRAINING=[{id:"td1",day:"MON",focus:"Ball Handling",detail:"Stationary handles, cone weave, off-hand"},{id:"td2",day:"WED",focus:"Shooting",detail:"Form shooting, spot shooting, free throws"},{id:"td3",day:"THU",focus:"Defense & Footwork",detail:"Slides, close-outs, jump rope, agility"},{id:"td4",day:"SAT",focus:"Full Workout",detail:"Handles + shooting + defense + conditioning"}];
const DEF_PROFILE={name:"Scarlett",grade:"5th",teamName:"",emoji:"⭐",primaryGoal:"All-around player",focus:"Improve every skill and get better at everything",notes:"Work hard every day. Be the best teammate you can be."};
const PRACTICE_TYPES=["Team Practice","Home Workout","Shooting","Ball Handling","Defense","Conditioning","Full Workout","Film Study"];
const STYLE_TYPES=["Game Day Fit","Practice Fit","School Fit","Weekend Fit","Wishlist Look"];
const SHOE_PRIORITY=["Dream","Next Up","Maybe","Already Have"];
const ROUTINE_ITEMS=[
  {id:"face",e:"🫧",label:"Wash face",group:"FACE CARE"},
  {id:"moisturizer",e:"💧",label:"Moisturizer",group:"FACE CARE"},
  {id:"teeth",e:"🪥",label:"Brush teeth",group:"NIGHT ROUTINE"},
  {id:"hair",e:"🎀",label:"Hair care",group:"NIGHT ROUTINE"},
  {id:"outfit",e:"👚",label:"Pick tomorrow's outfit",group:"STYLE PREP"},
  {id:"backpack",e:"🎒",label:"Pack backpack",group:"SCHOOL PREP"},
  {id:"water",e:"💦",label:"Water bottle ready",group:"SCHOOL PREP"},
  {id:"read",e:"📖",label:"Read or calm down time",group:"WIND DOWN"}
];
const ROUTINE_GROUPS=["MORNING","FACE CARE","SCHOOL PREP","STYLE PREP","GAME DAY","NIGHT ROUTINE","WIND DOWN","CUSTOM"];
const GRADE_MAP={A:4,B:3,C:2,D:1,F:0};
const GRADE_COL={A:C.green,B:C.teal,C:C.gold,D:C.orange,F:C.red};
const SKILL_LEVEL=v=>v>=75?"Elite":v>=55?"Strong":v>=35?"Building":"Beginner";
const SKILL_COL=v=>v>=75?C.green:v>=55?C.teal:v>=35?C.gold:C.coral;
const BADGE_DEFS=[
  {id:"game_tracker",icon:"🏀",name:"Game Tracker",desc:"Log 3 games",check:d=>d.games.length>=3},
  {id:"practice_beast",icon:"💪",name:"Practice Beast",desc:"Log 5 practices",check:d=>d.practices.length>=5},
  {id:"scorer",icon:"🔥",name:"Scorer",desc:"Score 10+ pts in a game",check:d=>d.games.some(g=>(g.pts||0)>=10)},
  {id:"win_streak",icon:"🏆",name:"Win Streak",desc:"3 wins in a row",check:d=>d.games.length>=3&&d.games.slice(0,3).every(g=>g.result==="Win")},
  {id:"sharp_shooter",icon:"🎯",name:"Sharp Shooter",desc:"FT% above 70% (10+ attempts)",check:d=>{const fta=d.games.reduce((a,g)=>a+(g.fta||0),0),ftm=d.games.reduce((a,g)=>a+(g.ftm||0),0);return fta>=10&&ftm/fta>=0.7;}},
  {id:"assist_queen",icon:"🤝",name:"Assist Queen",desc:"Average 4+ assists (5 games)",check:d=>d.games.length>=5&&avgArr(d.games.map(g=>g.ast||0))>=4},
  {id:"scholar",icon:"📚",name:"Scholar",desc:"GPA 3.5 or higher",check:d=>parseFloat(gpaCalc(d.subjects))>=3.5},
  {id:"goal_crusher",icon:"🎯",name:"Goal Crusher",desc:"Complete 3 goals",check:d=>d.goals.filter(g=>g.done).length>=3},
  {id:"consistent",icon:"⭐",name:"Consistent",desc:"Track habits 7+ days",check:d=>Object.keys(d.dailyHist).length>=7},
  {id:"well_rested",icon:"🌙",name:"Well Rested",desc:"Log 7 nights of sleep",check:d=>d.sleepEntries.length>=7},
  {id:"level_up",icon:"⬆️",name:"Level Up!",desc:"Bring any skill to 70%+",check:d=>Object.values(d.skills).some(v=>v>=70)},
  {id:"hydrated",icon:"💧",name:"Hydrated",desc:"Hit water goal 5 days",check:d=>Object.values(d.dailyHist).filter(e=>(e.w||0)>=8).length>=5},
  {id:"iron_will",icon:"🔩",name:"Iron Will",desc:"Log 10 practices",check:d=>d.practices.length>=10},
  {id:"comeback",icon:"🌅",name:"Comeback",desc:"Win after a loss",check:d=>{const r=d.games.map(g=>g.result);for(let i=0;i<r.length-1;i++)if(r[i]==="Win"&&r[i+1]==="Loss")return true;return false;}},
  {id:"sneaker_star",icon:"👟",name:"Sneaker Star",desc:"Add 3 shoes to wishlist",check:d=>(d.shoeWish||[]).length>=3},
  {id:"style_confidence",icon:"💅",name:"Confidence Era",desc:"Log 5 fits",check:d=>(d.styleLog||[]).length>=5},
  {id:"routine_queen",icon:"✨",name:"Routine Queen",desc:"Finish routine 5 days",check:d=>Object.values(d.routineHist||{}).filter(e=>{const c=e.c||{};const total=(d.routineItems||[]).length||1;return Object.values(c).filter(Boolean).length>=total;}).length>=5},
];

const uid=()=>`${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
const todayISO=()=>new Date().toISOString().slice(0,10);
const toDisp=iso=>new Date(`${iso}T12:00:00`).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const toShort=iso=>new Date(`${(iso||todayISO())}T12:00:00`).toLocaleDateString("en-US",{month:"short",day:"numeric"});
const dayName=iso=>new Date(`${iso||todayISO()}T12:00:00`).toLocaleDateString("en-US",{weekday:"long"});
const shiftISO=(iso,d)=>{const dt=new Date(`${iso}T12:00:00`);dt.setDate(dt.getDate()+d);return dt.toISOString().slice(0,10);};
const clone=o=>JSON.parse(JSON.stringify(o));
const avgArr=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;
const trendArr=arr=>{if(arr.length<2)return 0;const xs=arr.map((_,i)=>i),mX=avgArr(xs),mY=avgArr(arr),num=xs.reduce((s,x,i)=>s+(x-mX)*(arr[i]-mY),0),den=xs.reduce((s,x)=>s+(x-mX)**2,0);return den===0?0:num/den;};
const daysAgo=d=>{try{return Math.round((Date.now()-new Date(d+"T12:00:00"))/86400000);}catch{return 999;}};
const gpaCalc=subs=>{const v=Object.values(subs).map(g=>GRADE_MAP[g]||0);return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1):"—";};
const pct=(n,d)=>d?Math.round(n/d*100):0;

async function sg(k){
  try{
    const raw=localStorage.getItem(k);
    return raw?JSON.parse(raw):null;
  }catch{
    return null;
  }
}
async function ss(k,v){
  try{
    localStorage.setItem(k,JSON.stringify(v));
  }catch(err){
    console.warn("Scarlett Tracker save failed:",k,err);
  }
}
const emptyDaily=()=>({c:{},w:0,n:"",vitals:clone(DEF_VITALS)});

// ── COACH ENGINE ──────────────────────────────────────────────────────────
function goalStyle(pg){const g=(pg||"").toLowerCase();const V={scorer:["score","points","shoot","scoring","scorer","offense","bucket"],playmaker:["assist","pass","playmaker","point guard","pg","vision","leadership"],defender:["defend","defense","defensive","steal","block","lockdown","stopper"],all_around:["all around","all-around","complete","well-rounded","everything","overall"]};const s={scorer:0,playmaker:0,defender:0,all_around:0};for(const[st,kws]of Object.entries(V))for(const kw of kws)if(g.includes(kw))s[st]+=kw.split(" ").length;const r=Object.entries(s).sort((a,b)=>b[1]-a[1]);return r[0][1]>0?r[0][0]:"all_around";}
const STYLE={scorer:{col:C.coral,label:"Scorer"},playmaker:{col:C.purple,label:"Playmaker"},defender:{col:C.teal,label:"Defender"},all_around:{col:C.gold,label:"All-Around"}};

function computeReadiness(vitals,sleepEntries){
  let score=70;const reasons=[];let used=0;
  const rs=sleepEntries.slice(0,3);
  if(rs.length>=1){used+=1;const avgH=avgArr(rs.map(e=>e.hours)),avgQ=avgArr(rs.map(e=>e.quality||5));if(avgH>=9.5){score+=12;reasons.push({txt:`${avgH.toFixed(1)}h sleep — amazing recovery!`,col:C.green,icon:"🌙"});}else if(avgH>=8){score+=6;reasons.push({txt:`${avgH.toFixed(1)}h — nice job. Keep aiming for 9–10h.`,col:C.teal,icon:"🌙"});}else if(avgH<7){score-=15;reasons.push({txt:`Only ${avgH.toFixed(1)}h — your body needs extra rest tonight.`,col:C.red,icon:"🌙"});}if(avgQ<=4){score-=8;reasons.push({txt:"Sleep felt rough — a calm bedtime routine can help.",col:C.orange,icon:"😴"});}}
  if(vitals.energy>0){used+=0.75;if(vitals.energy>=4){score+=12;reasons.push({txt:"High energy — this could be a big day!",col:C.green,icon:"⚡"});}else if(vitals.energy>=3)score+=4;else if(vitals.energy<=2){score-=12;reasons.push({txt:"Low energy — keep today lighter and focus on form.",col:C.orange,icon:"⚡"});}}
  if(vitals.mood>0){used+=0.25;if(vitals.mood>=4)score+=5;else if(vitals.mood<=2){score-=6;reasons.push({txt:"A tough mood is okay — a few good reps can still be a win.",col:C.purple,icon:"💜"});}}
  score=Math.max(0,Math.min(100,score));const conf=Math.min(1,used/2);
  if(conf<0.3)return{score:null,displayValue:"✨",confidence:conf,starter:true,level:{label:"START HERE",col:C.gold},reasons:[{txt:"Start with the quick check-in below to unlock your daily vibe!",col:C.gold,icon:"✨"}]};
  const level=score>=80?{label:"LOCKED IN",col:C.green}:score>=65?{label:"READY",col:C.teal}:score>=50?{label:"EASY MODE",col:C.gold}:{label:"RECHARGE",col:C.orange};
  return{score,displayValue:String(score),level,reasons,confidence:conf,starter:false};
}
function intensityMod(r){if(r.starter)return{label:"Start here",note:"Do your quick check-in below so your dashboard can cheer you on."};if(r.score>=80)return{label:"Locked in",note:"You’re feeling good — go have a strong, confident day."};if(r.score>=65)return{label:"Ready",note:"You’re ready to roll. Train as planned and have fun."};if(r.score>=50)return{label:"Easy mode",note:"Good day for quality reps, clean form, and steady effort."};return{label:"Recharge",note:"A lighter day is okay. Rest, water, and sleep still count as winning."};}

function generateInsights(profile,games,practices,skills,subjects,sleepEntries,vitals,goals){
  const ins=[];
  // Game scoring trend
  if(games.length>=2){const ptD=(games[0].pts||0)-(games[1].pts||0);if(ptD>=5)ins.push({icon:"📈",text:`Scored ${ptD} more pts than previous game — scoring is trending up!`,col:C.green});else if(ptD<=-5)ins.push({icon:"📉",text:`Scored ${Math.abs(ptD)} fewer pts — focus on shot selection and positioning in practice`,col:C.orange});}
  // Win streak
  if(games.length>=3){const wins=games.filter(g=>g.result==="Win").length,wr=Math.round(wins/games.length*100),l3w=games.slice(0,3).filter(g=>g.result==="Win").length;if(l3w===3)ins.push({icon:"🏆",text:"3-game win streak! Ride this momentum.",col:C.gold});if(wr>=70)ins.push({icon:"🔥",text:`${wr}% win rate over ${games.length} games — elite performance`,col:C.gold});else if(wr<35)ins.push({icon:"💪",text:`Win rate at ${wr}% — focus on personal growth. Stats improve first, then wins follow.`,col:C.orange});}
  // Turnover alert
  if(games.length>=3){const avgTov=avgArr(games.slice(0,5).map(g=>g.tov||0));if(avgTov>=4)ins.push({icon:"⚠️",text:`Averaging ${avgTov.toFixed(1)} turnovers — work on keeping your composure and protecting the ball`,col:C.orange});}
  // FT% insight
  if(games.length>=3){const fta=games.reduce((a,g)=>a+(g.fta||0),0),ftm=games.reduce((a,g)=>a+(g.ftm||0),0);if(fta>=10){const ftpct=Math.round(ftm/fta*100);if(ftpct<60)ins.push({icon:"🎯",text:`Free throw ${ftpct}% — add 20 free throws to the end of every practice session`,col:C.orange});else if(ftpct>=80)ins.push({icon:"🎯",text:`${ftpct}% from the free throw line — clutch! Keep the routine the same every time.`,col:C.green});}}
  // Practice distribution
  if(practices.length>=3){const counts={};for(const p of practices)counts[p.type]=(counts[p.type]||0)+1;const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]);const most=sorted[0],least=sorted[sorted.length-1];if(most&&least&&most[0]!==least[0]&&most[1]>=3)ins.push({icon:"📊",text:`You practice ${most[0]} most (${most[1]}x) and ${least[0]} least (${least[1]}x). Try balancing it out this week.`,col:C.purple});}
  // Sleep-performance correlation
  if(games.length>=3&&sleepEntries.length>=3){const gamesWithSleep=games.slice(0,5).map(g=>{const matchSleep=sleepEntries.find(s=>daysAgo(g.dateISO||todayISO())<=daysAgo(s.dateISO||todayISO())+1);return{pts:g.pts||0,sleep:(matchSleep?matchSleep.hours:0)||0};}).filter(x=>x.sleep>0);if(gamesWithSleep.length>=2){const highSleepGames=gamesWithSleep.filter(x=>x.sleep>=8),lowSleepGames=gamesWithSleep.filter(x=>x.sleep<7);if(highSleepGames.length>0&&lowSleepGames.length>0){const hAvg=Math.round(avgArr(highSleepGames.map(x=>x.pts))),lAvg=Math.round(avgArr(lowSleepGames.map(x=>x.pts)));if(hAvg>lAvg+2)ins.push({icon:"🌙",text:`You score ${hAvg-lAvg} more pts on nights with 8h+ sleep vs under 7h. Sleep is a performance tool.`,col:C.purple});}}}
  // Skills
  const se=Object.entries(skills).sort((a,b)=>a[1]-b[1]);if(se.length){const[ws,wv]=se[0],[ss2,sv]=se[se.length-1];if(wv<40)ins.push({icon:"🎯",text:`${ws} (${wv}%) is your biggest growth opportunity — 15 min of focused daily reps compounds fast.`,col:C.coral});if(sv>=70)ins.push({icon:"⭐",text:`${ss2} is your strongest weapon at ${sv}% — lean on it in games.`,col:C.gold});}
  // Grades
  const ge=Object.entries(subjects).sort((a,b)=>(GRADE_MAP[a[1]]||0)-(GRADE_MAP[b[1]]||0));if(ge.length){const[ws2,wg]=ge[0],[bs,bg]=ge[ge.length-1];if((GRADE_MAP[wg]||0)<3)ins.push({icon:"📚",text:`${ws2} is at ${wg} — 15 min of nightly review will move this grade. Consistency beats cramming.`,col:C.teal});if((GRADE_MAP[bg]||0)>=4)ins.push({icon:"🌟",text:`${bg} in ${bs} — that discipline carries straight to the court.`,col:C.green});}
  // Sleep
  if(sleepEntries.length>=3){const avgH=avgArr(sleepEntries.slice(0,5).map(e=>e.hours));if(avgH<8)ins.push({icon:"🌙",text:`Averaging ${avgH.toFixed(1)}h sleep — athletes need 9–10h for growth, skill retention, and peak energy.`,col:C.red});else if(avgH>=9.5)ins.push({icon:"🌙",text:`${avgH.toFixed(1)}h avg sleep — elite recovery habits!`,col:C.green});}
  // Goals
  const active=goals.filter(g=>!g.done);if(active.length>0)ins.push({icon:"🎯",text:`Active goal: "${active[0].text.slice(0,45)}${active[0].text.length>45?"...":""}"`,col:C.purple});
  return ins;
}

// ── UI ────────────────────────────────────────────────────────────────────
const cs={background:"linear-gradient(145deg,rgba(32,14,62,.97),rgba(10,5,22,.99))",borderRadius:20,border:"1px solid rgba(255,255,255,.11)",padding:16,marginBottom:14,boxShadow:"0 22px 55px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.09),inset 0 -1px 0 rgba(0,0,0,.3)",position:"relative",overflow:"hidden",backdropFilter:"blur(18px)"};
const tt={fontWeight:900,fontSize:10,letterSpacing:"2px",color:"rgba(255,255,255,.65)",textTransform:"uppercase",marginBottom:2};
const ts={fontSize:11,color:C.muted};
const hd={display:"flex",alignItems:"center",gap:10,marginBottom:12};
const INP={width:"100%",background:"rgba(4,2,12,.72)",border:"1px solid rgba(255,255,255,.12)",borderRadius:14,padding:"11px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:"system-ui",boxSizing:"border-box",boxShadow:"inset 0 2px 8px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.04)"};
const TXT={...INP,minHeight:74,resize:"vertical"};
const glamGrad=`linear-gradient(135deg,${C.pink} 0%,${C.purple} 55%,${C.teal} 100%)`;
const hotGrad=`linear-gradient(135deg,${C.orange},${C.pink} 55%,${C.purple})`;
const glass={background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",boxShadow:"inset 0 1px 0 rgba(255,255,255,.11),0 18px 42px rgba(0,0,0,.4)"};
function CH({e,title,sub}){return<div style={hd}><div style={{fontSize:18,filter:"drop-shadow(0 0 14px rgba(255,26,140,.55))"}}>{e}</div><div><div style={tt}>{title}</div>{sub&&<div style={ts}>{sub}</div>}</div></div>;}
function RD({val,max=5,col,onSet}){return<div style={{display:"flex",gap:7}}>{Array.from({length:max},(_,i)=><div key={i} onClick={()=>onSet(i+1===val?0:i+1)} style={{width:32,height:32,borderRadius:10,background:i<val?`linear-gradient(145deg,${col},${C.pink})`:"rgba(255,255,255,.05)",border:`1.5px solid ${i<val?col:"rgba(255,255,255,.12)"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:i<val?`0 0 22px ${col}66,inset 0 1px 0 rgba(255,255,255,.3)`:"inset 0 1px 0 rgba(255,255,255,.06)",transition:"all .18s ease"}}><span style={{fontSize:10,fontWeight:900,color:i<val?C.white:"rgba(255,255,255,.3)"}}>{i+1}</span></div>)}</div>;}
function SBox({value,label,color,sub}){return<div style={{...glass,borderRadius:18,padding:13,textAlign:"center",borderTop:`2px solid ${color}`,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:"-20%",right:"-10%",width:70,height:70,borderRadius:"50%",background:`${color}33`,filter:"blur(14px)"}}/><div style={{fontWeight:900,fontSize:22,color,lineHeight:1,textShadow:`0 0 28px ${color}88`,position:"relative",letterSpacing:"-0.5px"}}>{value}</div><div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.65)",marginTop:5,position:"relative",letterSpacing:"0.5px"}}>{label}</div>{sub&&<div style={{fontSize:9,color:C.muted,marginTop:1,position:"relative"}}>{sub}</div>}</div>;}
function SkBar({skill,val}){const col=SKILL_COL(val),level=SKILL_LEVEL(val);return<div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.9)"}}>{skill}</span><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{background:`${col}25`,color:col,fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:6,border:`1px solid ${col}44`}}>{level}</span><span style={{fontSize:13,fontWeight:900,color:col}}>{val}%</span></div></div><div style={{height:9,background:"rgba(0,0,0,.4)",borderRadius:100,overflow:"hidden",boxShadow:"inset 0 2px 4px rgba(0,0,0,.4)"}}><div style={{height:"100%",background:`linear-gradient(90deg,${col}cc,${col})`,borderRadius:100,width:`${val}%`,transition:"width .4s ease",boxShadow:`0 0 18px ${col}66`}}/></div></div>;}

function Sparkles(){return<>
  <div style={{position:"absolute",top:10,right:18,color:C.gold,fontSize:14,opacity:.9}}>✦</div>
  <div style={{position:"absolute",top:36,right:68,color:C.pink,fontSize:10,opacity:.75}}>✧</div>
  <div style={{position:"absolute",bottom:18,left:18,color:C.teal,fontSize:10,opacity:.7}}>✦</div>
</>;}
function ScarlettAvatar(){return <div aria-label="Scarlett athlete portrait card" style={{position:"relative",width:176,height:190,flexShrink:0}}>
  <div style={{
    position:"absolute",
    inset:0,
    borderRadius:28,
    background:"linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.035))",
    border:"1px solid rgba(255,255,255,.18)",
    boxShadow:"0 22px 55px rgba(0,0,0,.42),0 0 34px rgba(248,95,200,.16)",
    overflow:"hidden"
  }}>
    <div style={{
      position:"absolute",
      inset:0,
      background:"radial-gradient(circle at 30% 5%,rgba(248,95,200,.22),transparent 36%),radial-gradient(circle at 80% 12%,rgba(255,209,102,.18),transparent 25%),linear-gradient(160deg,#2A164B,#110820)"
    }}/>
    <div style={{
      position:"absolute",
      left:8,
      right:8,
      top:8,
      height:122,
      borderRadius:22,
      overflow:"hidden",
      background:"linear-gradient(145deg,#29154A,#110820)",
      border:"1px solid rgba(255,255,255,.15)"
    }}>
      <img
        src={`${import.meta.env.BASE_URL}scarlett-avatar.png`}
        alt="Scarlett athlete avatar"
        onError={(e)=>{e.currentTarget.style.display="none";}}
        style={{
          position:"absolute",
          inset:0,
          width:"100%",
          height:"100%",
          objectFit:"cover",
          objectPosition:"center top",
          filter:"saturate(1.08) contrast(1.04)"
        }}
      />
      <div style={{
        position:"absolute",
        inset:0,
        background:"linear-gradient(180deg,rgba(5,0,14,.02),rgba(5,0,14,.12) 52%,rgba(5,0,14,.62))"
      }}/>
      <div style={{
        position:"absolute",
        top:7,
        right:8,
        color:C.gold,
        fontSize:20,
        textShadow:"0 0 14px rgba(255,209,102,.8)"
      }}>✦</div>
    </div>

    <div style={{position:"absolute",left:10,right:10,bottom:13,textAlign:"center"}}>
      <div style={{
        fontSize:23,
        fontWeight:950,
        color:C.white,
        lineHeight:1,
        letterSpacing:"-.6px",
        textShadow:"0 2px 16px rgba(0,0,0,.55)"
      }}>Scarlett <span style={{color:C.gold}}>♛</span></div>
      <div style={{
        marginTop:6,
        fontSize:10,
        fontWeight:950,
        letterSpacing:"2.5px",
        color:C.pink,
        textTransform:"uppercase"
      }}>Athlete</div>
    </div>
  </div>
</div>;}

function GlamHero({children,style={}}){return<div style={{...cs,padding:18,background:"radial-gradient(ellipse at 88% 8%,rgba(255,26,140,.24),transparent 42%),radial-gradient(ellipse at 5% 92%,rgba(0,229,204,.13),transparent 38%),radial-gradient(ellipse at 50% 50%,rgba(139,92,246,.08),transparent 65%),linear-gradient(160deg,rgba(40,18,78,.98),rgba(8,5,20,.99))",border:"1px solid rgba(255,255,255,.14)",boxShadow:"0 28px 70px rgba(0,0,0,.65),0 0 60px rgba(255,26,140,.07),inset 0 1px 0 rgba(255,255,255,.11)",...style}}><Sparkles/>{children}</div>;}
function GlamButton({e,l,c,onClick}){return<button onClick={onClick} style={{background:`linear-gradient(155deg,${c}F2 0%,${c}AA 50%,${C.purple}CC 100%)`,border:"1px solid rgba(255,255,255,.20)",borderRadius:20,padding:"14px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,fontFamily:"system-ui",boxShadow:`0 14px 36px ${c}44,inset 0 1px 0 rgba(255,255,255,.28)`,color:C.white,position:"relative",overflow:"hidden"}}><span style={{position:"absolute",inset:"0 0 55% 0",background:"linear-gradient(180deg,rgba(255,255,255,.25),transparent)"}}/><div style={{fontSize:22,position:"relative",filter:`drop-shadow(0 0 10px ${c}88)`}}>{e}</div><div style={{fontSize:9,fontWeight:900,textAlign:"center",position:"relative",letterSpacing:"0.3px"}}>{l}</div></button>;}
function MiniChart({color=C.pink}){return<div style={{height:24,display:"flex",alignItems:"end",gap:3}}>{[35,48,44,62,76].map((h,i)=><div key={i} style={{width:7,height:h/2,background:i===4?color:`${color}55`,borderRadius:5,boxShadow:i===4?`0 0 16px ${color}99`:"none",transition:"height .4s ease"}}/> )}</div>;}

// ══════════════════════════════════════════════════════════════════════════
function RingChart({val,col,label,size=54}){const r=size/2-6,c=2*Math.PI*r,d=c-(val/100)*c;const cx=size/2,cy=size/2;return<svg width={size} height={size} style={{filter:`drop-shadow(0 0 10px ${col}88)`}}><circle cx={cx} cy={cy} r={r} fill="rgba(0,0,0,.3)" stroke="rgba(255,255,255,.1)" strokeWidth={6}/><circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={d} transform={`rotate(-90 ${cx} ${cy})`} style={{transition:"all .5s ease"}}/><text x={cx} y={cy+4} textAnchor="middle" fill="white" fontSize={label.length>3?9:13} fontWeight={900} fontFamily="system-ui">{label}</text></svg>;}

function StableRenderer({render}){return render();}

export default function ScarlettTracker(){
  const[loaded,setLoaded]=useState(false);
  const[tab,setTab]=useState("today");
  const[selDay,setSelDay]=useState(todayISO());
  const[dailyHist,setDailyHist]=useState({});
  const[checks,setChecks]=useState({});
  const[water,setWater]=useState(0);
  const[notes,setNotes]=useState("");
  const[vitals,setVitals]=useState(clone(DEF_VITALS));
  const[showSaved,setShowSaved]=useState(false);
  const[sleepEntries,setSleepEntries]=useState([]);
  const[sleepForm,setSleepForm]=useState({bedtime:"21:00",waketime:"06:30",quality:0,notes:""});
  const[games,setGames]=useState([]);
  const[gameForm,setGameForm]=useState({pts:"",ast:"",reb:"",stl:"",blk:"",tov:"",fgm:"",fga:"",ftm:"",fta:"",minutes:"",effort:0,confidence:0,result:"Win",opponent:"",notes:"",coachNote:""});
  const[practices,setPractices]=useState([]);
  const[practiceForm,setPracticeForm]=useState({type:"Team Practice",duration:"",effort:0,focus:0,whatWorked:"",whatWasHard:"",drillsDone:"",coachNote:""});
  const[styleLog,setStyleLog]=useState([]);
  const[styleForm,setStyleForm]=useState({type:"Game Day Fit",shoes:"",outfit:"",hair:"",trend:"",confidence:0,notes:""});
  const[shoeWish,setShoeWish]=useState([]);
  const[shoeForm,setShoeForm]=useState({name:"",why:"",priority:"Dream"});
  const[trendBoard,setTrendBoard]=useState([]);
  const[trendForm,setTrendForm]=useState("");
  const[routineHist,setRoutineHist]=useState({});
  const[routineItems,setRoutineItems]=useState(clone(ROUTINE_ITEMS));
  const[skills,setSkills]=useState(clone(DEF_SKILLS));
  const[subjects,setSubjects]=useState(clone(DEF_SUBJECTS));
  const[quizLog,setQuizLog]=useState([]);
  const[quizForm,setQuizForm]=useState({subject:"Math",score:"",total:"100",notes:""});
  const[goals,setGoals]=useState([]);
  const[stars,setStars]=useState(0);
  const[goalForm,setGoalForm]=useState({text:"",category:"basketball",targetDate:"",reward:""});
  const[habits,setHabits]=useState(clone(DEF_HABITS));
  const[profile,setProfile]=useState(clone(DEF_PROFILE));
  const[trainingDays,setTrainingDays]=useState(clone(DEF_TRAINING));
  const supRef=useRef(false),saveTmr=useRef(null),savedTm=useRef(null);
  const allH=habits,habitPct=allH.length?Math.round(allH.filter(h=>checks[h.id]).length/allH.length*100):0;

  const applyDay=useCallback(entry=>{const d={...emptyDaily(),...(entry||{})};setChecks(d.c||{});setWater(d.w||0);setNotes(d.n||"");setVitals(d.vitals||clone(DEF_VITALS));},[]);

  useEffect(()=>{(async()=>{
    const daily=await sg("sc_daily")||{entries:{}};
    const bball=await sg("sc_bball")||{games:[],skills:clone(DEF_SKILLS)};
    const prax=await sg("sc_practices")||{entries:[]};
    const styleD=await sg("sc_style")||{fits:[],shoes:[],trends:[]};
    const routineD=await sg("sc_routine")||{entries:{},items:clone(ROUTINE_ITEMS)};
    const slp=await sg("sc_sleep")||{entries:[]};
    const school=await sg("sc_school")||{subjects:clone(DEF_SUBJECTS),quizLog:[]};
    const gd=await sg("sc_goals")||{entries:[],stars:0};
    const hd2=await sg("sc_habits")||{entries:clone(DEF_HABITS)};
    const pd=await sg("sc_profile")||clone(DEF_PROFILE);
    const td=await sg("sc_training")||{days:clone(DEF_TRAINING)};
    setDailyHist(daily.entries||{});setGames(bball.games||[]);setSkills(bball.skills||clone(DEF_SKILLS));
    setPractices(prax.entries||[]);setStyleLog(styleD.fits||[]);setShoeWish(styleD.shoes||[]);setTrendBoard(styleD.trends||[]);setRoutineHist(routineD.entries||{});setRoutineItems(routineD.items||clone(ROUTINE_ITEMS));setSleepEntries(slp.entries||[]);
    setSubjects(school.subjects||clone(DEF_SUBJECTS));setQuizLog(school.quizLog||[]);
    setGoals(gd.entries||[]);setStars(gd.stars||0);setHabits(hd2.entries||clone(DEF_HABITS));
    setProfile(pd);setTrainingDays(td.days||clone(DEF_TRAINING));
    supRef.current=true;applyDay((daily.entries||{})[todayISO()]);setLoaded(true);
  })();},[]);

  useEffect(()=>{if(!loaded)return;if(supRef.current){supRef.current=false;return;}clearTimeout(saveTmr.current);saveTmr.current=setTimeout(()=>{const entry={c:checks,w:water,n:notes,vitals};setDailyHist(prev=>{const next={...prev,[selDay]:entry};ss("sc_daily",{entries:next});return next;});setShowSaved(true);clearTimeout(savedTm.current);savedTm.current=setTimeout(()=>setShowSaved(false),1000);},450);},[checks,water,notes,vitals,selDay,loaded]);
  useEffect(()=>{if(!loaded)return;supRef.current=true;applyDay(dailyHist[selDay]);},[selDay,loaded]);
  useEffect(()=>{if(loaded)ss("sc_habits",{entries:habits});},[habits,loaded]);
  useEffect(()=>{if(loaded)ss("sc_profile",profile);},[profile,loaded]);
  useEffect(()=>{if(loaded)ss("sc_training",{days:trainingDays});},[trainingDays,loaded]);

  const saveSleep=async e=>{setSleepEntries(e);await ss("sc_sleep",{entries:e});};
  const saveBball=async(g,sk)=>{setGames(g);setSkills(sk);await ss("sc_bball",{games:g,skills:sk});};
  const savePrax=async p=>{setPractices(p);await ss("sc_practices",{entries:p});};
  const saveGoals=async(g,s=stars)=>{setGoals(g);setStars(s);await ss("sc_goals",{entries:g,stars:s});};
  const saveStyle=async(fits=styleLog,shoes=shoeWish,trends=trendBoard)=>{setStyleLog(fits);setShoeWish(shoes);setTrendBoard(trends);await ss("sc_style",{fits,shoes,trends});};
  const saveRoutine=async(entries=routineHist,items=routineItems)=>{setRoutineHist(entries);setRoutineItems(items);await ss("sc_routine",{entries,items});};
  const saveSchool=async(sub,ql)=>{setSubjects(sub);setQuizLog(ql);await ss("sc_school",{subjects:sub,quizLog:ql});};
  const getGlowReport=()=>{
    const report=[];
    const add=(area,e,col,doing,needs,next,stat)=>report.push({area,e,col,doing,needs,next,stat});
    const tg=games.length;
    const avg=(key,arr=games)=>arr.length?Math.round(avgArr(arr.map(x=>parseInt(x[key])||0))*10)/10:0;
    if(tg){
      const wins=games.filter(g=>g.result==="Win").length,wr=Math.round(wins/tg*100);
      const fta=games.reduce((a,g)=>a+(g.fta||0),0),ftm=games.reduce((a,g)=>a+(g.ftm||0),0),ft=Math.round((ftm/(fta||1))*100);
      const tov=avg("tov",games.slice(0,5));
      add("Hoops","🏀",C.coral,`You have ${tg} game${tg===1?"":"s"} logged and a ${wr}% win rate.`,fta>=10&&ft<65?`Free throws are at ${ft}% — that is the easiest place to gain points.`:tov>=4?`Turnovers are averaging ${tov}. Protecting the ball is the next level-up.`:"Keep building a bigger game sample so Coach can see stronger trends.",fta>=10&&ft<65?"Next move: make 20 free throws after every practice.":tov>=4?"Next move: add 5 minutes of strong-hand and weak-hand control drills.":"Next move: log every game, even small stats.",tg>=2?`Last game: ${games[0].pts||0} pts`:`${tg} game logged`);
    }else add("Hoops","🏀",C.coral,"No game data yet — that is totally okay.","Coach needs game logs to find scoring, passing, rebound, and turnover trends.","Next move: log the next game right after it ends.","0 games");
    if(practices.length){
      const week=practices.filter(p=>daysAgo(p.dateISO||todayISO())<=7),mins=week.reduce((a,p)=>a+(parseInt(p.duration)||0),0);
      const counts=practices.reduce((a,p)=>{a[p.type]=(a[p.type]||0)+1;return a;},{});
      const sorted=Object.entries(counts).sort((a,b)=>a[1]-b[1]);
      const least=(sorted[0]||["a focus area"])[0];
      add("Practice","💪",C.purple,`You logged ${practices.length} practice session${practices.length===1?"":"s"}.`,mins<90?"Practice minutes this week are still low.":`You have ${mins} practice minutes this week — strong work.`,mins<90?"Next move: aim for 90+ total practice minutes this week.":`Next move: add one ${least} session so training stays balanced.`,`${mins} min this week`);
    }else add("Practice","💪",C.purple,"No practice sessions logged yet.","Coach cannot tell what she is working on without practice logs.","Next move: log one practice with effort, focus, and what was hard.","0 practices");
    const sk=Object.entries(skills).sort((a,b)=>a[1]-b[1]),weak=sk[0],strong=sk[sk.length-1];
    if(weak&&strong)add("Skills","📊",SKILL_COL(strong[1]),`${strong[0]} is her strongest skill at ${strong[1]}%.`,`${weak[0]} is the next level-up skill at ${weak[1]}%.`,`Next move: 15 minutes of ${weak[0]} reps today.`,`${Math.round(avgArr(Object.values(skills)))}% overall`);
    const grades=Object.entries(subjects).sort((a,b)=>(GRADE_MAP[a[1]]||0)-(GRADE_MAP[b[1]]||0)),low=grades[0],high=grades[grades.length-1];
    if(low&&high)add("School","📚",(GRADE_MAP[low[1]]||0)<3?C.orange:C.teal,`${high[0]} is looking strong with a ${high[1]}.`,(GRADE_MAP[low[1]]||0)<3?`${low[0]} needs attention at ${low[1]}.`:"Grades look solid right now.",(GRADE_MAP[low[1]]||0)<3?`Next move: 15 minutes of ${low[0]} review tonight.`:"Next move: keep homework-before-screens going.",`GPA ${gpaCalc(subjects)}`);
    const active=goals.filter(g=>!g.done),done=goals.filter(g=>g.done);
    add("Goals","🎯",C.gold,done.length?`${done.length} goal${done.length===1?"":"s"} finished — that is momentum.`:"Goals are ready when she is.",active.length?`${active.length} active goal${active.length===1?"":"s"} still need action.`:"No active goal right now.",active.length?`Next move: choose one tiny action for “${active[0].text.slice(0,32)}${active[0].text.length>32?"...":""}”.`:"Next move: set one basketball, school, or style goal.",`${done.length}/${goals.length||0} done`);
    if(sleepEntries.length){const ah=Math.round(avgArr(sleepEntries.slice(0,7).map(e=>e.hours))*10)/10;add("Sleep","🌙",ah>=8?C.green:C.orange,ah>=8?`${ah}h average sleep — nice recovery habit.`:"Sleep is logged, which is already a win.",ah<8?"Average sleep is under the 8–10h target.":"Keep the bedtime routine steady.",ah<8?"Next move: move bedtime 20–30 minutes earlier tonight.":"Next move: keep the same bedtime routine three nights in a row.",`${ah}h avg`);}else add("Sleep","🌙",C.purple,"No sleep data yet.","Coach needs sleep logs to connect rest with energy and games.","Next move: log bedtime, wake time, and sleep quality tomorrow.","0 nights");
    const rDays=Object.entries(routineHist).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,7);
    const rAvg=rDays.length?Math.round(avgArr(rDays.map(([_,e])=>pct(Object.values(e.c||{}).filter(Boolean).length,routineItems.length||1)))):0;
    const itemScores={}; routineItems.forEach(i=>itemScores[i.id]={label:i.label,done:0,total:0});
    rDays.forEach(([_,e])=>routineItems.forEach(i=>{itemScores[i.id].total++; if((e.c||{})[i.id])itemScores[i.id].done++;}));
    const miss=Object.values(itemScores).filter(x=>x.total>0).sort((a,b)=>(a.done/a.total)-(b.done/b.total))[0];
    add("Routine","✨",rAvg>=80?C.green:C.pink,rDays.length?`Routine average is ${rAvg}% over the last ${rDays.length} day${rDays.length===1?"":"s"}.`:"Routine is ready to track face care, outfit prep, and night habits.",miss&&rAvg<100?`${miss.label} is the easiest routine item to improve.`:"Build a streak by checking off the routine daily.",miss?`Next move: do “${miss.label}” tonight.`:"Next move: complete one routine today.",rDays.length?`${rAvg}% avg`:"0 days");
    const avgConf=styleLog.length?Math.round(avgArr(styleLog.filter(f=>f.confidence>0).map(f=>f.confidence||0))*10)/10:0;
    add("Style","👟",C.pink,styleLog.length?`${styleLog.length} fit${styleLog.length===1?"":"s"} logged. ${shoeWish.length} shoe${shoeWish.length===1?"":"s"} on the wishlist.`:"Style board is ready for shoes, fits, hair, and trend ideas.",styleLog.length&&avgConf<4?"Confidence ratings are still building.":"Keep using style as a confidence boost, not pressure.",styleLog.length?"Next move: log a game-day or school fit with confidence rating.":"Next move: add one shoe to the wishlist or one outfit idea.",styleLog.length?`${avgConf||"—"}/5 vibe`:`${shoeWish.length} shoes`);
    return report;
  };

  // ── TODAY ──────────────────────────────────────────────────────────────
  const Today=()=>{
    const readiness=computeReadiness(vitals,sleepEntries);
    const mod=intensityMod(readiness);
    const insights=generateInsights(profile,games,practices,skills,subjects,sleepEntries,vitals,goals);
    const topIn=insights.find(i=>i.col===C.red)||insights[0];
    const r=(readiness.score!=null?readiness.score:0),displayVal=(readiness.displayValue!=null?readiness.displayValue:String(r)),circ=2*Math.PI*24,dash=circ-(((readiness.score!=null?readiness.score:0))/100)*circ;
    const weakestSkill=Object.entries(skills).sort((a,b)=>a[1]-b[1])[0]||["Dribbling",30];
    const gradeEntries=Object.entries(subjects).sort((a,b)=>(GRADE_MAP[a[1]]||0)-(GRADE_MAP[b[1]]||0));
    const worstSubj=gradeEntries.find(([_,g])=>(GRADE_MAP[g]||0)<3);
    const activeGoal=goals.find(g=>!g.done);
    const recentDays=Object.keys(dailyHist).sort((a,b)=>b.localeCompare(a)).slice(0,7);
    const groups=allH.reduce((acc,h)=>{if(!acc[h.group])acc[h.group]=[];acc[h.group].push(h);return acc;},{});
    const routineDays=Object.keys(routineHist).length;
    const homeQuickActions=[{e:"💪",l:"Practice",t:"practice",c:C.purple},{e:"🏀",l:"Game",t:"games",c:C.coral},{e:"👟",l:"Style",t:"style",c:C.pink},{e:"✨",l:"Routine",t:"routine",c:C.gold},{e:"📚",l:"School",t:"school",c:C.teal}];
    return<div>
      <GlamHero style={{padding:14,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,color:C.gold,fontWeight:900,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>Plan · Practice · Glow</div>
            <div style={{fontWeight:900,fontSize:20,lineHeight:1.05,color:C.white}}>Good {new Date().getHours()<12?"Morning":"Afternoon"}, <span style={{background:glamGrad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{profile.name}</span> ✨</div>
            <div style={{fontSize:10,color:C.light,lineHeight:1.45,marginTop:6}}>Big goals. One strong day at a time.</div>
          </div>
          <div style={{transform:"scale(.82)",transformOrigin:"right center",marginRight:-14}}><ScarlettAvatar/></div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div style={{...glass,borderRadius:18,padding:12,background:"linear-gradient(145deg,rgba(255,26,140,.20),rgba(139,92,246,.15))",boxShadow:"inset 0 1px 0 rgba(255,255,255,.12)"}}>
            <div style={{fontSize:8,color:C.pink,fontWeight:900,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>Today’s Vibe</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <svg width={58} height={58} style={{flexShrink:0,filter:`drop-shadow(0 0 14px ${readiness.level.col}77)`}}>
                <circle cx={29} cy={29} r={24} fill="rgba(0,0,0,.35)" stroke="rgba(255,255,255,.09)" strokeWidth={6}/>
                <circle cx={29} cy={29} r={24} fill="none" stroke={readiness.level.col} strokeWidth={6} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash} transform="rotate(-90 29 29)" style={{transition:"all .6s cubic-bezier(.4,0,.2,1)"}}/>
                <text x={29} y={27} textAnchor="middle" fill="white" fontSize={displayVal.length>2?11:14} fontWeight={900} fontFamily="system-ui">{displayVal}</text>
                <text x={29} y={38} textAnchor="middle" fill={readiness.level.col} fontSize={5.5} fontWeight={900} fontFamily="system-ui">{readiness.level.label}</text>
              </svg>
              <div style={{minWidth:0}}>
                <div style={{fontSize:13,fontWeight:900,color:readiness.level.col,textShadow:`0 0 24px ${readiness.level.col}88`,lineHeight:1.05,marginBottom:4}}>{readiness.level.label}</div>
                <div style={{fontSize:9,color:C.light,lineHeight:1.35}}>{mod.note}</div>
              </div>
            </div>
          </div>
          <div style={{...glass,borderRadius:18,padding:12,background:"linear-gradient(145deg,rgba(255,215,0,.22),rgba(255,26,140,.14))",boxShadow:"inset 0 1px 0 rgba(255,255,255,.12)"}}>
            <div style={{fontSize:8,color:C.gold,fontWeight:900,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:5}}>Stars Earned</div>
            <div style={{display:"flex",alignItems:"baseline",gap:6}}><div style={{fontSize:38,fontWeight:900,color:C.gold,lineHeight:1,textShadow:"0 0 30px rgba(255,215,0,.9)",letterSpacing:"-1px"}}>⭐ {stars}</div></div>
            <div style={{fontSize:9,color:"rgba(255,255,255,.55)",marginTop:5}}>Games · Goals · Practice</div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div style={{...glass,borderRadius:18,padding:12,background:"linear-gradient(145deg,rgba(255,61,127,.24),rgba(90,0,110,.46))"}}>
            <div style={{fontSize:8,color:C.coral,fontWeight:900,letterSpacing:"1.6px",textTransform:"uppercase",marginBottom:7}}>Hoops Mission</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}><RingChart val={weakestSkill[1]} col={C.coral} label={weakestSkill[1]+"%"} size={48}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:900,color:"white",lineHeight:1.15}}>{weakestSkill[0]}</div><div style={{fontSize:9,color:"rgba(255,255,255,.55)",marginTop:3}}>Today’s focus</div></div></div>
          </div>
          <div style={{...glass,borderRadius:18,padding:12,background:"linear-gradient(145deg,rgba(0,229,204,.22),rgba(16,60,100,.50))"}}>
            <div style={{fontSize:8,color:C.teal,fontWeight:900,letterSpacing:"1.6px",textTransform:"uppercase",marginBottom:7}}>School Focus</div>
            {worstSubj?<div style={{display:"flex",alignItems:"center",gap:10}}><RingChart val={(GRADE_MAP[worstSubj[1]]||0)/4*100} col={C.teal} label={worstSubj[1]} size={48}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:900,color:"white",lineHeight:1.15}}>{worstSubj[0]}</div><div style={{fontSize:9,color:"rgba(255,255,255,.55)",marginTop:3}}>15 min tonight</div></div></div>:<div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}><div style={{fontSize:25}}>🌟</div><div><div style={{fontSize:12,fontWeight:900,color:C.green}}>All A's & B's!</div><div style={{fontSize:9,color:"rgba(255,255,255,.5)"}}>Keep it up!</div></div></div>}
          </div>
          <button onClick={()=>setTab("style")} style={{...glass,textAlign:"left",borderRadius:18,padding:12,cursor:"pointer",background:"linear-gradient(145deg,rgba(255,26,140,.26),rgba(255,122,47,.18))",fontFamily:"system-ui",boxShadow:"inset 0 1px 0 rgba(255,255,255,.13)"}}>
            <div style={{fontSize:8,color:C.pink,fontWeight:900,letterSpacing:"1.6px",textTransform:"uppercase",marginBottom:6}}>Fit Check</div>
            <div style={{fontSize:12,fontWeight:900,color:"white",marginBottom:8}}>Game-Day Drip</div>
            <div style={{display:"flex",gap:5}}>{["10","👟","🎒","✨"].map((x,i)=><div key={i} style={{width:26,height:26,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.18)",fontSize:11,fontWeight:900,color:C.white}}>{x}</div>)}</div>
          </button>
          <button onClick={()=>setTab("routine")} style={{...glass,textAlign:"left",borderRadius:18,padding:12,cursor:"pointer",background:"linear-gradient(145deg,rgba(255,215,0,.22),rgba(255,26,140,.16))",fontFamily:"system-ui",boxShadow:"inset 0 1px 0 rgba(255,255,255,.13)"}}>
            <div style={{fontSize:8,color:C.gold,fontWeight:900,letterSpacing:"1.6px",textTransform:"uppercase",marginBottom:4}}>Routine Streak</div>
            <div style={{display:"flex",alignItems:"baseline",gap:4}}><div style={{fontSize:34,fontWeight:900,color:C.white,lineHeight:1,textShadow:"0 0 24px rgba(255,215,0,.8)",letterSpacing:"-1px"}}>{routineDays}</div><div style={{fontSize:10,color:"rgba(255,255,255,.55)"}}>days</div></div>
            <div style={{display:"flex",gap:3,marginTop:8}}>{["M","T","W","T","F","S","S"].map((d,i)=>{const act=i<Math.min((routineDays%7)||7,7);return<div key={i} style={{width:16,height:16,borderRadius:"50%",background:act?`linear-gradient(135deg,${C.gold},${C.orange})`:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,fontWeight:900,color:act?"rgba(0,0,0,.8)":"rgba(255,255,255,.3)"}}>{d}</div>;})}</div>
          </button>
        </div>
      </GlamHero>

      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:7,marginBottom:12}}>
        {homeQuickActions.map(b=><GlamButton key={b.t} e={b.e} l={b.l} c={b.c} onClick={()=>setTab(b.t)}/>) }
      </div>

      {topIn&&<div style={{...cs,padding:14,marginBottom:12}}>
        <CH e={topIn.icon||"🧠"} title="Coach Tip" sub="Smart next step for today"/>
        <div style={{fontSize:12,fontWeight:800,color:topIn.col||C.text,marginBottom:4}}>{topIn.title}</div>
        <div style={{fontSize:11,color:C.text,lineHeight:1.5}}>{topIn.txt}</div>
        {activeGoal&&<div style={{marginTop:10,padding:10,borderRadius:12,background:"rgba(255,255,255,.05)",border:`1px solid ${C.border}`}}><div style={{fontSize:8,color:C.gold,fontWeight:900,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>Current Goal</div><div style={{fontSize:12,fontWeight:800,color:C.white}}>{activeGoal.text}</div>{activeGoal.targetDate&&<div style={{fontSize:10,color:C.muted,marginTop:3}}>Target: {activeGoal.targetDate}</div>}</div>}
      </div>}

      <div style={{...cs,background:C.card2,padding:14}}>
        <CH e="🗓️" title="Daily Log" sub={selDay===todayISO()?"Today — live tracking":"Viewing saved day"}/>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <button onClick={()=>setSelDay(shiftISO(selDay,-1))} style={{width:34,height:34,borderRadius:10,border:`1px solid ${C.border}`,background:C.navy2,color:C.text,cursor:"pointer",fontFamily:"system-ui"}}>−</button>
          <div style={{flex:1,textAlign:"center"}}><div style={{fontWeight:900,fontSize:17,color:C.text}}>{toDisp(selDay)}</div><div style={{fontSize:10,color:C.muted}}>{dayName(selDay)}</div></div>
          <button disabled={selDay===todayISO()} onClick={()=>setSelDay(shiftISO(selDay,1))} style={{width:34,height:34,borderRadius:10,border:`1px solid ${C.border}`,background:C.navy2,color:selDay===todayISO()?`${C.muted}88`:C.text,cursor:selDay===todayISO()?"not-allowed":"pointer",fontFamily:"system-ui"}}>+</button>
        </div>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
          {recentDays.map(day=><button key={day} onClick={()=>setSelDay(day)} style={{minWidth:72,padding:"7px 8px",borderRadius:10,border:`1px solid ${day===selDay?C.purple:C.border}`,background:day===selDay?`${C.purple}18`:C.navy,color:day===selDay?C.purple:C.text,cursor:"pointer",textAlign:"left",flexShrink:0,fontFamily:"system-ui"}}>
            <div style={{fontSize:10,fontWeight:800}}>{toDisp(day).replace(/,\s*\d{4}$/,"")}</div>
            <div style={{fontSize:9,color:C.muted}}>{allH.filter(h=>(dailyHist[day]&&dailyHist[day].c||{})[h.id]).length}/{allH.length}</div>
          </button>)}
        </div>
      </div>

      <div style={cs}>
        <CH e="✨" title="How Are You Feeling?" sub="Quick check-in · saves automatically"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:6}}>ENERGY ⚡</div><RD val={vitals.energy} max={5} col={C.gold} onSet={v=>setVitals(p=>({...p,energy:v}))}/></div>
          <div><div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:6}}>MOOD 😊</div><RD val={vitals.mood} max={5} col={C.pink} onSet={v=>setVitals(p=>({...p,mood:v}))}/></div>
        </div>
      </div>

      <div style={{...cs,padding:14}}>
        <CH e="💧" title="Water" sub="8 glasses target"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginBottom:6}}>
          {Array.from({length:8},(_,i)=><div key={i} onClick={()=>setWater(i<water?i:i+1)} style={{width:28,height:36,borderRadius:"3px 3px 6px 6px",border:`2px solid ${i<water?C.teal:"rgba(255,255,255,.1)"}`,boxShadow:i<water?`0 0 14px ${C.teal}55`:"none",cursor:"pointer",position:"relative",overflow:"hidden",background:i<water?"#00100D":C.card2}}>
            {i<water&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"70%",background:`linear-gradient(to top,${C.teal},#70FFE0)`}}/>}
          </div>)}
        </div>
        <div style={{fontSize:10,textAlign:"center",color:water>=8?C.green:C.muted}}>{water>=8?"🎉 Goal hit!":`${8-water} more to go`}</div>
      </div>

      {Object.entries(groups).map(([grp,items])=><div key={grp} style={cs}>
        <div style={{fontSize:9,fontWeight:800,letterSpacing:"2px",color:C.muted,textTransform:"uppercase",paddingBottom:8,marginBottom:8,borderBottom:`1px solid ${C.border}`}}>{grp}</div>
        {items.map(h=>{const ok=checks[h.id];return<div key={h.id} onClick={()=>setChecks(p=>({...p,[h.id]:!p[h.id]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 6px",borderRadius:8,cursor:"pointer",opacity:ok?0.45:1,background:ok?"#050712":"transparent",marginBottom:2}}>
          <div style={{width:22,height:22,borderRadius:6,border:ok?"none":`2px solid ${C.border}`,background:ok?`linear-gradient(135deg,${C.green},${C.teal})`:"rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:11,boxShadow:ok?`0 0 16px ${C.green}66`:"none"}}>{ok&&"✓"}</div>
          <div style={{flex:1,fontSize:12,color:ok?C.muted:C.text,textDecoration:ok?"line-through":"none"}}>{h.label}</div>
          <div style={{fontSize:10,color:C.purple,fontWeight:700}}>{h.time}</div>
        </div>;})}
      </div>)}
      <div style={cs}><CH e="📝" title="Daily Notes"/><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Wins, how practice went, anything worth remembering..." style={TXT}/></div>
    </div>;
  };

  // ── GAMES ──────────────────────────────────────────────────────────────
  const Games=()=>{
    const tg=games.length,wins=games.filter(g=>g.result==="Win").length;
    const s=(stat)=>games.reduce((a,g)=>a+(g[stat]||0),0);
    const a=(stat)=>tg?(s(stat)/tg).toFixed(1):0;
    const ftPct=s("fta")?Math.round(s("ftm")/s("fta")*100):0;
    const fgPct=s("fga")?Math.round(s("fgm")/s("fga")*100):0;
    const logGame=async()=>{
      const pts=parseInt(gameForm.pts)||0;if(!gameForm.result)return;
      const entry={id:uid(),date:toShort(todayISO()),dateISO:todayISO(),...Object.fromEntries(Object.entries(gameForm).map(([k,v])=>["pts","ast","reb","stl","blk","tov","fgm","fga","ftm","fta","minutes","effort","confidence"].includes(k)?[k,parseInt(v)||0]:[k,v]))};
      const ng=[entry,...games].slice(0,100);
      const ns=stars+(pts>=15?5:pts>=10?3:pts>=5?2:1)+(gameForm.result==="Win"?2:0)+(parseInt(gameForm.effort)||0>=4?1:0);
      await saveBball(ng,skills);await saveGoals(goals,ns);
      setGameForm({pts:"",ast:"",reb:"",stl:"",blk:"",tov:"",fgm:"",fga:"",ftm:"",fta:"",minutes:"",effort:0,confidence:0,result:"Win",opponent:"",notes:"",coachNote:""});
    };
    const delGame=async id=>{await saveBball(games.filter(g=>g.id!==id),skills);};
    const last5=games.slice(0,5);
    return<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:8}}>
        <SBox value={tg} label="Games" color={C.coral}/><SBox value={tg?Math.round(wins/tg*100)+"%":"—"} label="Win Rate" color={C.green}/>
        <SBox value={a("pts")} label="Avg Pts" color={C.gold}/><SBox value={a("ast")} label="Avg Ast" color={C.purple}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
        <SBox value={a("reb")} label="Avg Reb" color={C.teal}/><SBox value={a("stl")} label="Avg Stl" color={C.blue}/>
        <SBox value={ftPct?ftPct+"%":"—"} label="FT%" color={ftPct>=75?C.green:ftPct>=60?C.gold:C.coral} sub={s("fta")>0?`${s("ftm")}/${s("fta")}`:""}/>
        <SBox value={fgPct?fgPct+"%":"—"} label="FG%" color={fgPct>=45?C.green:fgPct>=35?C.gold:C.coral} sub={s("fga")>0?`${s("fgm")}/${s("fga")}`:""}/>
      </div>
      {last5.length>=2&&<div style={cs}>
        <CH e="📊" title="Last 5 Games" sub="Points trend"/>
        <div style={{display:"flex",alignItems:"flex-end",gap:4,height:60}}>
          {[...last5].reverse().map((g,i)=>{const max=Math.max(...last5.map(x=>x.pts||1),1),h=Math.max(4,Math.round((g.pts||0)/max*54));return<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <div style={{fontSize:8,color:C.coral,fontWeight:800}}>{g.pts}</div>
            <div style={{width:"100%",height:h,background:g.result==="Win"?C.coral:`${C.coral}44`,borderRadius:"3px 3px 0 0",minHeight:4}}/>
            <div style={{fontSize:7,color:C.muted}}>{g.opponent?g.opponent.slice(0,5):""||(g.date?g.date.slice(0,5):"")}</div>
          </div>;})}
        </div>
      </div>}
      <div style={cs}>
        <CH e="➕" title="Log a Game"/>
        <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:4}}>MAIN STATS</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
            {[["PTS","pts"],["AST","ast"],["REB","reb"],["STL","stl"],["BLK","blk"],["TOV","tov"]].map(([l,k])=><div key={k}><div style={{fontSize:9,color:C.muted,fontWeight:700,marginBottom:2}}>{l}</div><input type="number" min="0" value={gameForm[k]} onChange={e=>setGameForm(p=>({...p,[k]:e.target.value}))} style={{...INP,padding:"6px 8px"}}/></div>)}
          </div>
        </div>
        <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:4}}>SHOOTING</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
            {[["FGM","fgm"],["FGA","fga"],["FTM","ftm"],["FTA","fta"]].map(([l,k])=><div key={k}><div style={{fontSize:9,color:C.muted,fontWeight:700,marginBottom:2}}>{l}</div><input type="number" min="0" value={gameForm[k]} onChange={e=>setGameForm(p=>({...p,[k]:e.target.value}))} style={{...INP,padding:"6px 8px"}}/></div>)}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>RESULT</div><select value={gameForm.result} onChange={e=>setGameForm(p=>({...p,result:e.target.value}))} style={{...INP,appearance:"none"}}><option value="Win">🏆 Win</option><option value="Loss">💪 Loss</option></select></div>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>OPPONENT</div><input value={gameForm.opponent} onChange={e=>setGameForm(p=>({...p,opponent:e.target.value}))} placeholder="Team name" style={INP}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:6}}>EFFORT (1–5)</div><RD val={gameForm.effort} max={5} col={C.orange} onSet={v=>setGameForm(p=>({...p,effort:v}))}/></div>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:6}}>CONFIDENCE (1–5)</div><RD val={gameForm.confidence} max={5} col={C.purple} onSet={v=>setGameForm(p=>({...p,confidence:v}))}/></div>
        </div>
        <textarea value={gameForm.notes} onChange={e=>setGameForm(p=>({...p,notes:e.target.value}))} placeholder="How did the game go?" style={{...TXT,marginBottom:8}}/>
        <textarea value={gameForm.coachNote} onChange={e=>setGameForm(p=>({...p,coachNote:e.target.value}))} placeholder="Parent/coach note (optional)..." style={{...TXT,minHeight:50,marginBottom:10}}/>
        <button onClick={logGame} style={{width:"100%",padding:12,background:C.coral,color:C.white,border:"none",borderRadius:8,fontWeight:900,cursor:"pointer",fontSize:14,fontFamily:"system-ui"}}>Log Game ⭐</button>
      </div>
      {games.length>0&&<div style={cs}><CH e="📋" title="Game History" sub={`${games.length} games`}/>
        {games.slice(0,15).map(g=><div key={g.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
              <span style={{fontSize:10,color:C.muted}}>{g.date}</span>
              <span style={{background:g.result==="Win"?`${C.green}22`:`${C.orange}22`,color:g.result==="Win"?C.green:C.orange,fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:4}}>{g.result==="Win"?"🏆 WIN":"💪 LOSS"}</span>
              {g.opponent&&<span style={{fontSize:10,color:C.muted}}>vs {g.opponent}</span>}
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {[{v:g.pts,l:"pts",c:C.coral},{v:g.ast,l:"ast",c:C.purple},{v:g.reb,l:"reb",c:C.teal},{v:g.stl,l:"stl",c:C.blue},{v:g.tov,l:"tov",c:C.orange}].filter(x=>(x.v||0)>0||x.l==="pts").map(x=><span key={x.l} style={{background:`${x.c}22`,color:x.c,padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:800}}>{x.v||0} {x.l}</span>)}
              {g.fta>0&&<span style={{background:`${C.gold}22`,color:C.gold,padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:800}}>{g.ftm}/{g.fta} FT</span>}
            </div>
            {(g.effort>0||g.confidence>0)&&<div style={{fontSize:10,color:C.muted,marginTop:3}}>Effort: {"⭐".repeat(g.effort||0)} · Confidence: {"⭐".repeat(g.confidence||0)}</div>}
            {g.coachNote&&<div style={{fontSize:10,color:C.blue,marginTop:2,fontStyle:"italic"}}>💬 {g.coachNote.slice(0,60)}</div>}
          </div>
          <button onClick={()=>delGame(g.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>×</button>
        </div>)}
      </div>}
    </div>;
  };

  // ── PRACTICE LOG ───────────────────────────────────────────────────────
  const Practice=()=>{
    const thisWeek=practices.filter(p=>daysAgo(p.dateISO||todayISO())<=7);
    const weekMins=thisWeek.reduce((a,p)=>a+(parseInt(p.duration)||0),0);
    const avgEffort=practices.length?Math.round(avgArr(practices.slice(0,10).map(p=>p.effort||0))*10)/10:0;
    const typeCounts=practices.reduce((acc,p)=>{acc[p.type]=(acc[p.type]||0)+1;return acc;},{});
    const maxCount=Math.max(...Object.values(typeCounts),1);
    const logPractice=async()=>{
      const entry={id:uid(),date:toShort(todayISO()),dateISO:todayISO(),...practiceForm};
      const np=[entry,...practices].slice(0,100);await savePrax(np);
      const ns=stars+(parseInt(practiceForm.effort)||0>=4?2:1);await saveGoals(goals,ns);
      setPracticeForm({type:"Team Practice",duration:"",effort:0,focus:0,whatWorked:"",whatWasHard:"",drillsDone:"",coachNote:""});
    };
    return<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
        <SBox value={practices.length} label="Total Sessions" color={C.purple}/>
        <SBox value={weekMins||"0"} label="Mins This Week" color={C.coral} sub="minutes"/>
        <SBox value={thisWeek.length} label="Sessions/Week" color={C.teal}/>
      </div>
      {Object.keys(typeCounts).length>0&&<div style={cs}>
        <CH e="📊" title="Practice Distribution" sub="What you've been working on"/>
        {Object.entries(typeCounts).sort((a,b)=>b[1]-a[1]).map(([type,count])=><div key={type} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:700,color:C.text}}>{type}</span><span style={{fontSize:12,fontWeight:900,color:C.purple}}>{count}x</span></div>
          <div style={{height:7,background:C.navy,borderRadius:100,overflow:"hidden"}}><div style={{height:"100%",background:C.purple,borderRadius:100,width:`${count/maxCount*100}%`,transition:"width .4s"}}/></div>
        </div>)}
      </div>}
      <div style={cs}>
        <CH e="➕" title="Log a Practice Session"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>PRACTICE TYPE</div><select value={practiceForm.type} onChange={e=>setPracticeForm(p=>({...p,type:e.target.value}))} style={{...INP,appearance:"none"}}>{PRACTICE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>DURATION (min)</div><input type="number" min="0" value={practiceForm.duration} onChange={e=>setPracticeForm(p=>({...p,duration:e.target.value}))} placeholder="e.g. 60" style={INP}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:6}}>EFFORT (1–5)</div><RD val={practiceForm.effort} max={5} col={C.orange} onSet={v=>setPracticeForm(p=>({...p,effort:v}))}/></div>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:6}}>FOCUS (1–5)</div><RD val={practiceForm.focus} max={5} col={C.blue} onSet={v=>setPracticeForm(p=>({...p,focus:v}))}/></div>
        </div>
        <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>WHAT WORKED ✅</div><textarea value={practiceForm.whatWorked} onChange={e=>setPracticeForm(p=>({...p,whatWorked:e.target.value}))} placeholder="What felt easy or clicked today?" style={{...TXT,minHeight:50}}/></div>
        <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>WHAT WAS HARD 💪</div><textarea value={practiceForm.whatWasHard} onChange={e=>setPracticeForm(p=>({...p,whatWasHard:e.target.value}))} placeholder="What needs more work?" style={{...TXT,minHeight:50}}/></div>
        <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>DRILLS COMPLETED</div><input value={practiceForm.drillsDone} onChange={e=>setPracticeForm(p=>({...p,drillsDone:e.target.value}))} placeholder="e.g. Cone weave, form shooting, slides" style={INP}/></div>
        <textarea value={practiceForm.coachNote} onChange={e=>setPracticeForm(p=>({...p,coachNote:e.target.value}))} placeholder="Parent/coach note (optional)..." style={{...TXT,minHeight:50,marginBottom:10}}/>
        <button onClick={logPractice} style={{width:"100%",padding:12,background:C.purple,color:C.white,border:"none",borderRadius:8,fontWeight:900,cursor:"pointer",fontSize:14,fontFamily:"system-ui"}}>Log Practice ⭐</button>
      </div>
      {practices.length>0&&<div style={cs}><CH e="📋" title="Practice History" sub={`${practices.length} sessions`}/>
        {practices.slice(0,15).map(p=><div key={p.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
                <span style={{fontWeight:800,fontSize:12,color:C.purple}}>{p.type}</span>
                {p.duration&&<span style={{background:`${C.teal}22`,color:C.teal,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:4}}>{p.duration} min</span>}
                {p.effort>0&&<span style={{background:`${C.orange}22`,color:C.orange,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:4}}>Effort {"⭐".repeat(p.effort)}</span>}
                <span style={{fontSize:10,color:C.muted}}>{p.date}</span>
              </div>
              {p.whatWorked&&<div style={{fontSize:10,color:C.green,marginTop:2}}>✅ {p.whatWorked.slice(0,55)}</div>}
              {p.whatWasHard&&<div style={{fontSize:10,color:C.orange,marginTop:2}}>💪 {p.whatWasHard.slice(0,55)}</div>}
              {p.coachNote&&<div style={{fontSize:10,color:C.blue,marginTop:2,fontStyle:"italic"}}>💬 {p.coachNote.slice(0,55)}</div>}
            </div>
            <button onClick={async()=>{await savePrax(practices.filter(x=>x.id!==p.id));}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16,flexShrink:0}}>×</button>
          </div>
        </div>)}
      </div>}
    </div>;
  };


  // ── STYLE LOCKER ───────────────────────────────────────────────────────
  const Style=()=>{
    const avgConf=styleLog.length?Math.round(avgArr(styleLog.map(f=>f.confidence||0))*10)/10:0;
    const logFit=async()=>{
      if(!styleForm.shoes&&!styleForm.outfit&&!styleForm.hair&&!styleForm.trend&&!styleForm.notes)return;
      const entry={id:uid(),date:toShort(todayISO()),dateISO:todayISO(),...styleForm};
      const nf=[entry,...styleLog].slice(0,80);
      const ns=stars+(styleForm.confidence>=4?2:1);
      await saveStyle(nf,shoeWish,trendBoard);await saveGoals(goals,ns);
      setStyleForm({type:"Game Day Fit",shoes:"",outfit:"",hair:"",trend:"",confidence:0,notes:""});
    };
    const addShoe=async()=>{
      if(!shoeForm.name.trim())return;
      const item={id:uid(),date:toShort(todayISO()),...shoeForm,name:shoeForm.name.trim()};
      await saveStyle(styleLog,[item,...shoeWish].slice(0,40),trendBoard);
      setShoeForm({name:"",why:"",priority:"Dream"});
    };
    const addTrend=async()=>{
      if(!trendForm.trim())return;
      const item={id:uid(),date:toShort(todayISO()),text:trendForm.trim()};
      await saveStyle(styleLog,shoeWish,[item,...trendBoard].slice(0,40));
      setTrendForm("");
    };
    return<div>
      <GlamHero>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:14}}>
          <div>
            <div style={{fontSize:30,fontWeight:900,lineHeight:1,background:glamGrad,WebkitBackgroundClip:"text",color:"transparent"}}>Style Locker</div>
            <div style={{fontSize:11,color:C.light,letterSpacing:"1px",fontWeight:850,marginTop:5}}>LOOK GOOD · FEEL GOOD · PLAY GREAT</div>
          </div>
          <div style={{width:50,height:50,borderRadius:16,background:"linear-gradient(145deg,rgba(255,255,255,.16),rgba(255,255,255,.04))",border:"1px solid rgba(255,255,255,.16)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:25,boxShadow:`0 0 22px ${C.pink}33`}}>🛍️</div>
        </div>
        <div style={{...glass,borderRadius:18,padding:12,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontWeight:900,fontSize:12,color:C.pink,letterSpacing:"1px"}}>SNEAKER WISHLIST 👟✨</div>
            <div style={{fontSize:10,color:C.gold,fontWeight:900}}>{shoeWish.length} saved</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {(shoeWish.length?shoeWish.slice(0,3):[{name:"Sabrina 2",priority:"Dream"},{name:"Kobe",priority:"Next Up"},{name:"Ja 2",priority:"Maybe"}]).map((s,i)=><div key={s.id||i} style={{background:"linear-gradient(145deg,#FBE7FF,#FFF5F9)",borderRadius:14,padding:8,minHeight:72,color:"#2A0C35",boxShadow:"0 12px 22px rgba(0,0,0,.18)"}}>
              <div style={{height:32,borderRadius:12,background:i===0?"linear-gradient(135deg,#DAB8FF,#8F55FF)":i===1?"linear-gradient(135deg,#0D0D13,#C78A2B)":"linear-gradient(135deg,#68B7FF,#1550A8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:6}}>👟</div>
              <div style={{fontSize:10,fontWeight:900,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</div>
              <div style={{fontSize:8,fontWeight:900,color:i===0?"#9333EA":i===1?"#D97706":"#0891B2"}}>{s.priority||"Dream"} ♥</div>
            </div>)}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          <SBox value={styleLog.length} label="Fits Logged" color={C.pink}/>
          <SBox value={shoeWish.length} label="Shoe List" color={C.gold}/>
          <SBox value={avgConf||"—"} label="Vibe Avg" color={C.purple} sub="out of 5"/>
        </div>
      </GlamHero>

      <div style={cs}>
        <CH e="🔥" title="Log a Fit" sub="Game day, practice, school, or weekend"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>FIT TYPE</div><select value={styleForm.type} onChange={e=>setStyleForm(p=>({...p,type:e.target.value}))} style={{...INP,appearance:"none"}}>{STYLE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>SHOES</div><input value={styleForm.shoes} onChange={e=>setStyleForm(p=>({...p,shoes:e.target.value}))} placeholder="e.g. Jordans, Kobes, Sabrinas" style={INP}/></div>
        </div>
        <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>OUTFIT IDEA</div><input value={styleForm.outfit} onChange={e=>setStyleForm(p=>({...p,outfit:e.target.value}))} placeholder="Jersey, hoodie, cargos, sweats, colors..." style={INP}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>HAIR / ACCESSORIES</div><input value={styleForm.hair} onChange={e=>setStyleForm(p=>({...p,hair:e.target.value}))} placeholder="Braids, ponytail, headband..." style={INP}/></div>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>TREND INSPO</div><input value={styleForm.trend} onChange={e=>setStyleForm(p=>({...p,trend:e.target.value}))} placeholder="Clean girl, streetwear, sporty..." style={INP}/></div>
        </div>
        <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:6}}>CONFIDENCE VIBE (1–5)</div><RD val={styleForm.confidence} max={5} col={C.pink} onSet={v=>setStyleForm(p=>({...p,confidence:v}))}/></div>
        <textarea value={styleForm.notes} onChange={e=>setStyleForm(p=>({...p,notes:e.target.value}))} placeholder="What made this fit feel good? Any ideas for next time?" style={{...TXT,minHeight:54,marginBottom:10}}/>
        <button onClick={logFit} style={{width:"100%",padding:12,background:`linear-gradient(135deg,${C.pink},${C.purple})`,color:C.white,border:"none",borderRadius:8,fontWeight:900,cursor:"pointer",fontFamily:"system-ui"}}>Save Fit ⭐</button>
      </div>

      <div style={cs}>
        <CH e="👟" title="Basketball Shoe Wishlist" sub="Track shoes she likes and why"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 100px",gap:8,marginBottom:8}}>
          <input value={shoeForm.name} onChange={e=>setShoeForm(p=>({...p,name:e.target.value}))} placeholder="Shoe name" style={INP}/>
          <select value={shoeForm.priority} onChange={e=>setShoeForm(p=>({...p,priority:e.target.value}))} style={{...INP,appearance:"none"}}>{SHOE_PRIORITY.map(x=><option key={x} value={x}>{x}</option>)}</select>
        </div>
        <input value={shoeForm.why} onChange={e=>setShoeForm(p=>({...p,why:e.target.value}))} placeholder="Why she likes them: color, player, style, comfort..." style={{...INP,marginBottom:8}}/>
        <button onClick={addShoe} style={{width:"100%",padding:10,background:C.gold,color:C.bg,border:"none",borderRadius:8,fontWeight:900,cursor:"pointer",fontFamily:"system-ui"}}>Add Shoe</button>
        {shoeWish.length>0&&<div style={{marginTop:12}}>
          {shoeWish.slice(0,10).map(s=><div key={s.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"9px 0",borderTop:`1px solid ${C.border}`}}>
            <div style={{fontSize:20}}>👟</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:900,color:C.text}}>{s.name}</div><div style={{fontSize:10,color:C.gold,fontWeight:800}}>{s.priority}</div>{s.why&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{s.why}</div>}</div>
            <button onClick={()=>saveStyle(styleLog,shoeWish.filter(x=>x.id!==s.id),trendBoard)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>×</button>
          </div>)}
        </div>}
      </div>

      <div style={cs}>
        <CH e="💄" title="Trend Board" sub="Age-appropriate makeup, face care, streetwear, hair, inspo"/>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <input value={trendForm} onChange={e=>setTrendForm(e.target.value)} placeholder="Add a trend or idea she likes..." style={INP}/>
          <button onClick={addTrend} style={{padding:"0 14px",borderRadius:8,border:"none",background:C.pink,color:C.white,fontWeight:900,cursor:"pointer",fontFamily:"system-ui"}}>+</button>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {trendBoard.length?trendBoard.slice(0,16).map(t=><div key={t.id} onClick={()=>saveStyle(styleLog,shoeWish,trendBoard.filter(x=>x.id!==t.id))} style={{background:`${C.pink}18`,border:`1px solid ${C.pink}44`,borderRadius:20,padding:"6px 10px",fontSize:11,fontWeight:800,color:C.pink,cursor:"pointer"}}>✨ {t.text}</div>):<div style={{fontSize:11,color:C.muted}}>Add trends like “glowy skin,” “clean ponytail,” “pink shoes,” or “game-day braids.”</div>}
        </div>
      </div>

      {styleLog.length>0&&<div style={cs}>
        <CH e="📸" title="Fit History" sub="What made her feel confident"/>
        {styleLog.slice(0,12).map(f=><div key={f.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:900,color:C.pink}}>{f.type} · {f.date}</div>
              {f.shoes&&<div style={{fontSize:10,color:C.gold,marginTop:2}}>👟 {f.shoes}</div>}
              {f.outfit&&<div style={{fontSize:10,color:C.text,marginTop:2}}>👚 {f.outfit}</div>}
              {f.hair&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>🎀 {f.hair}</div>}
              {f.trend&&<div style={{fontSize:10,color:C.purple,marginTop:2}}>✨ {f.trend}</div>}
              {f.confidence>0&&<div style={{fontSize:10,color:C.pink,marginTop:2}}>Confidence: {"⭐".repeat(f.confidence)}</div>}
              {f.notes&&<div style={{fontSize:10,color:C.muted,marginTop:2,fontStyle:"italic"}}>{f.notes.slice(0,80)}</div>}
            </div>
            <button onClick={()=>saveStyle(styleLog.filter(x=>x.id!==f.id),shoeWish,trendBoard)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>×</button>
          </div>
        </div>)}
      </div>}
    </div>;
  };

  // ── GLOW ROUTINE ───────────────────────────────────────────────────────
  const Routine=()=>{
    const dayEntry=routineHist[selDay]||{c:{},note:""};
    const checked=dayEntry.c||{};
    const done=routineItems.filter(i=>checked[i.id]).length;
    const rpct=routineItems.length?Math.round(done/routineItems.length*100):0;
    const groups=routineItems.reduce((acc,i)=>{if(!acc[i.group])acc[i.group]=[];acc[i.group].push(i);return acc;},{});
    const updateRoutine=async(next)=>{
      const entries={...routineHist,[selDay]:{...dayEntry,...next}};
      await saveRoutine(entries);
    };
    const toggle=id=>updateRoutine({c:{...checked,[id]:!checked[id]}});
    return<div>
      <GlamHero style={{textAlign:"center"}}>
        <div style={{fontSize:44,filter:`drop-shadow(0 0 18px ${C.gold})`}}>✨</div>
        <div style={{fontWeight:900,fontSize:26,lineHeight:1,background:glamGrad,WebkitBackgroundClip:"text",color:"transparent"}}>Glow Routine</div>
        <div style={{fontSize:11,color:C.light,marginTop:6}}>Face care · outfit prep · school prep · wind down</div>
        <div style={{height:14,background:"rgba(0,0,0,.28)",borderRadius:100,overflow:"hidden",marginTop:16,border:"1px solid rgba(255,255,255,.10)"}}>
          <div style={{height:"100%",width:`${rpct}%`,background:rpct>=100?`linear-gradient(90deg,${C.green},${C.teal})`:rpct>=60?`linear-gradient(90deg,${C.pink},${C.gold})`:glamGrad,borderRadius:100,transition:"width .4s",boxShadow:`0 0 18px ${rpct>=100?C.green:C.pink}`}}/>
        </div>
        <div style={{display:"inline-flex",gap:8,alignItems:"center",background:"rgba(255,255,255,.09)",border:"1px solid rgba(255,255,255,.14)",borderRadius:999,padding:"7px 12px",marginTop:12}}>
          <span style={{fontSize:13,fontWeight:900,color:rpct>=100?C.green:C.pink}}>{done}/{routineItems.length} done</span>
          <span style={{fontSize:11,color:C.muted}}>·</span>
          <span style={{fontSize:13,fontWeight:900,color:C.gold}}>{rpct}% glow</span>
        </div>
      </GlamHero>
      {Object.entries(groups).map(([g,items])=><div key={g} style={cs}>
        <div style={{fontSize:9,fontWeight:900,letterSpacing:"2px",color:C.muted,textTransform:"uppercase",paddingBottom:8,marginBottom:8,borderBottom:`1px solid ${C.border}`}}>{g}</div>
        {items.map(item=>{const ok=checked[item.id];return<div key={item.id} onClick={()=>toggle(item.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 6px",borderRadius:8,cursor:"pointer",background:ok?`${C.green}12`:"transparent",marginBottom:2}}>
          <div style={{width:26,height:26,borderRadius:8,border:ok?"none":`2px solid ${C.border}`,background:ok?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{ok?"✓":item.e}</div>
          <div style={{flex:1,fontSize:13,fontWeight:700,color:ok?C.green:C.text,textDecoration:ok?"line-through":"none"}}>{item.label}</div>
        </div>;})}
      </div>)}
      <div style={cs}>
        <CH e="📝" title="Routine Notes" sub="Favorite products, outfit ideas, or what felt good"/>
        <textarea value={dayEntry.note||""} onChange={e=>updateRoutine({note:e.target.value})} placeholder="Example: liked my hairstyle, skin felt good, packed my bag early..." style={TXT}/>
      </div>
      {rpct>=100&&<div style={{background:`${C.green}18`,border:`1px solid ${C.green}44`,borderRadius:12,padding:14,marginBottom:12,textAlign:"center"}}>
        <div style={{fontSize:24}}>🌟</div>
        <div style={{fontSize:14,fontWeight:900,color:C.green}}>Routine Queen!</div>
        <div style={{fontSize:11,color:C.muted,marginTop:3}}>Everything is done for today. That is real discipline.</div>
      </div>}
    </div>;
  };


  // ── SLEEP ──────────────────────────────────────────────────────────────
  const Sleep=()=>{
    const calcH=(bed,wake)=>{try{const[bh,bm]=bed.split(":").map(Number),[wh,wm]=wake.split(":").map(Number);let m=(wh*60+wm)-(bh*60+bm);if(m<0)m+=1440;return Math.round(m/60*10)/10;}catch{return 0;}};
    const addSleep=async()=>{if(!sleepForm.quality)return;const entry={date:toShort(todayISO()),dateISO:todayISO(),bedtime:sleepForm.bedtime,waketime:sleepForm.waketime,hours:calcH(sleepForm.bedtime,sleepForm.waketime),quality:sleepForm.quality,notes:sleepForm.notes};await saveSleep([entry,...sleepEntries].slice(0,90));setSleepForm({bedtime:"21:00",waketime:"06:30",quality:0,notes:""});};
    const avgH=sleepEntries.length?Math.round(avgArr(sleepEntries.slice(0,7).map(e=>e.hours))*10)/10:0;
    return<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}><SBox value={avgH||"—"} label="Avg Hours" color={C.purple} sub="7-night avg"/><SBox value={(sleepEntries[0]?sleepEntries[0].quality:0)||"—"} label="Last Quality" color={C.gold} sub="out of 5"/><SBox value={sleepEntries.length} label="Nights Logged" color={C.teal}/></div>
      {avgH>0&&<div style={{background:avgH>=9?`${C.green}15`:`${C.orange}15`,border:`1px solid ${avgH>=9?C.green:C.orange}44`,borderRadius:10,padding:12,marginBottom:12,fontSize:12,color:C.text,lineHeight:1.7}}>{avgH>=9.5?"🌟 Elite sleep! Your skills and memory are consolidating every night.":avgH>=8?"✅ Good sleep. Aim for 9–10h for peak athletic performance.":avgH>=7?"⚠️ Slightly short. Try moving bedtime 30 minutes earlier.": `🔴 ${avgH.toFixed(1)}h is below what young athletes need. Sleep is when you grow.`}</div>}
      <div style={cs}>
        <CH e="➕" title="Log Sleep"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}><div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>BEDTIME</div><input type="time" value={sleepForm.bedtime} onChange={e=>setSleepForm(p=>({...p,bedtime:e.target.value}))} style={INP}/></div><div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>WAKE TIME</div><input type="time" value={sleepForm.waketime} onChange={e=>setSleepForm(p=>({...p,waketime:e.target.value}))} style={INP}/></div></div>
        {sleepForm.bedtime&&sleepForm.waketime&&<div style={{fontSize:12,color:C.teal,fontWeight:700,marginBottom:8}}>= {calcH(sleepForm.bedtime,sleepForm.waketime)} hours of sleep</div>}
        <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:6}}>SLEEP QUALITY</div><RD val={sleepForm.quality} max={5} col={C.purple} onSet={v=>setSleepForm(p=>({...p,quality:v}))}/></div>
        <textarea value={sleepForm.notes} onChange={e=>setSleepForm(p=>({...p,notes:e.target.value}))} placeholder="How did you sleep? Restless? Dreams?" style={{...TXT,marginTop:6,marginBottom:10}}/>
        <button onClick={addSleep} style={{width:"100%",padding:12,background:`linear-gradient(135deg,${C.purple},${C.blue})`,color:C.white,border:"none",borderRadius:8,fontWeight:800,cursor:"pointer",fontFamily:"system-ui"}}>Save Sleep Entry</button>
      </div>
      {sleepEntries.length>0&&<div style={cs}><CH e="📅" title="Sleep History"/>
        {sleepEntries.slice(0,14).map((e,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{minWidth:52,fontSize:10,color:C.muted}}>{e.date}</div>
          <div style={{minWidth:40,fontWeight:800,color:e.hours>=9?C.green:e.hours>=7?C.teal:C.orange}}>{e.hours}h</div>
          <div style={{flex:1,fontSize:10,color:C.muted}}>{"⭐".repeat(e.quality||0)} {e.notes||""}</div>
          <button onClick={()=>saveSleep(sleepEntries.filter((_,idx)=>idx!==i))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer"}}>×</button>
        </div>)}
      </div>}
    </div>;
  };

  // ── SKILLS ─────────────────────────────────────────────────────────────
  const Skills=()=>{
    const avgSk=Object.values(skills).length?Math.round(avgArr(Object.values(skills))):0;
    const adjSkill=async(skill,delta)=>{const nsk={...skills,[skill]:Math.min(100,Math.max(0,(skills[skill]||0)+delta))};await saveBball(games,nsk);if(delta>0){const ns=stars+1;await saveGoals(goals,ns);}};
    const weakest=Object.entries(skills).sort((a,b)=>a[1]-b[1]).slice(0,3);
    const GROUPS={offense:["Ball Handling","Shooting Form","Layups","Free Throws","Passing","Court Vision"],defense:["Defense","Rebounding","Footwork","Speed & Agility","Conditioning"],mental:["Basketball IQ","Confidence","Leadership"]};
    return<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
        <SBox value={`${avgSk}%`} label="Overall" color={SKILL_COL(avgSk)} sub={SKILL_LEVEL(avgSk)}/>
        <SBox value={Object.values(skills).filter(v=>v>=70).length} label="Elite Skills" color={C.green}/>
        <SBox value={Object.values(skills).filter(v=>v>=50).length} label="Strong Skills" color={C.teal}/>
      </div>
      {weakest.length>0&&<div style={{background:`${C.coral}12`,border:`1px solid ${C.coral}33`,borderRadius:10,padding:12,marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:800,color:C.coral,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>🎯 NEXT LEVEL-UP SKILLS</div>
        {weakest.map(([sk,val])=><div key={sk} style={{fontSize:12,color:C.text,marginBottom:3}}>→ <strong style={{color:C.coral}}>{sk}</strong> is at {val}% — {SKILL_LEVEL(val)} level. Daily practice moves this up fast.</div>)}
      </div>}
      {Object.entries(GROUPS).map(([group,skillNames])=>{const relevant=skillNames.filter(s=>skills[s]!==undefined);if(!relevant.length)return null;return<div key={group} style={cs}>
        <CH e={group==="offense"?"⚡":group==="defense"?"🛡️":"🧠"} title={group==="offense"?"Offense & Ball Skills":group==="defense"?"Defense & Athleticism":"Mental Game"} sub="Tap +/− to update · +1⭐ per +10%"/>
        {relevant.map(sk=>{const val=skills[sk]||0;return<div key={sk} style={{marginBottom:14}}>
          <SkBar skill={sk} val={val}/>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <button onClick={()=>adjSkill(sk,-10)} style={{width:28,height:28,borderRadius:7,border:"none",background:"#2A0A0A",color:C.red,cursor:"pointer",fontWeight:900,fontSize:14,fontFamily:"system-ui"}}>−</button>
            <button onClick={()=>adjSkill(sk,+10)} style={{width:28,height:28,borderRadius:7,border:"none",background:val>=70?"#0A2A15":"#1A1500",color:val>=70?C.green:C.gold,cursor:"pointer",fontWeight:900,fontSize:14,fontFamily:"system-ui"}}>+</button>
          </div>
        </div>;})}
      </div>;})}
    </div>;
  };

  // ── SCHOOL ─────────────────────────────────────────────────────────────
  const School=()=>{
    const[addForm,setAddForm]=useState({name:"",grade:"B"});
    const grades=["A","B","C","D","F"];
    const updateGrade=async(s,g)=>{const ns={...subjects,[s]:g};await saveSchool(ns,quizLog);};
    const removeSubj=async s=>{const{[s]:_,...rest}=subjects;await saveSchool(rest,quizLog);};
    const addSubj=async()=>{if(!addForm.name.trim())return;const ns={...subjects,[addForm.name.trim()]:addForm.grade};await saveSchool(ns,quizLog);setAddForm({name:"",grade:"B"});};
    const logQuiz=async()=>{if(!quizForm.score)return;const p2=Math.round(parseInt(quizForm.score)/parseInt(quizForm.total)*100);const grade=p2>=90?"A":p2>=80?"B":p2>=70?"C":p2>=60?"D":"F";const entry={id:uid(),date:toShort(todayISO()),subject:quizForm.subject,score:parseInt(quizForm.score),total:parseInt(quizForm.total),pct:p2,grade,notes:quizForm.notes};const nl=[entry,...quizLog].slice(0,60);await saveSchool(subjects,nl);setQuizForm({subject:Object.keys(subjects)[0]||"Math",score:"",total:"100",notes:""});if(grade==="A"){const ns=stars+3;await saveGoals(goals,ns);}else if(grade==="B"){const ns=stars+1;await saveGoals(goals,ns);}};
    return<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}><SBox value={gpaCalc(subjects)} label="GPA" color={C.teal}/><SBox value={Object.values(subjects).filter(g=>g==="A").length} label="A's" color={C.green}/><SBox value={Object.values(subjects).filter(g=>g==="B").length} label="B's" color={C.blue}/><SBox value={quizLog.length} label="Tests" color={C.purple} sub="logged"/></div>
      <div style={cs}>
        <CH e="📝" title="Current Grades" sub="Tap a letter to update"/>
        {Object.entries(subjects).map(([s,grade])=><div key={s} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{flex:1,fontWeight:700,fontSize:13,color:C.text}}>{s}</div>
          <div style={{display:"flex",gap:3}}>{grades.map(g=><button key={g} onClick={()=>updateGrade(s,g)} style={{width:28,height:28,borderRadius:6,border:`2px solid ${grade===g?GRADE_COL[g]:C.border}`,background:grade===g?`${GRADE_COL[g]}22`:"transparent",color:grade===g?GRADE_COL[g]:C.muted,cursor:"pointer",fontWeight:800,fontSize:11,fontFamily:"system-ui"}}>{g}</button>)}</div>
          <div style={{background:`${GRADE_COL[grade]}22`,color:GRADE_COL[grade],padding:"4px 10px",borderRadius:6,fontWeight:900,fontSize:13,minWidth:30,textAlign:"center"}}>{grade}</div>
          <button onClick={()=>removeSubj(s)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14}}>×</button>
        </div>)}
        <div style={{display:"flex",gap:8,marginTop:12}}><input value={addForm.name} onChange={e=>setAddForm(p=>({...p,name:e.target.value}))} placeholder="Add a subject..." style={{...INP,flex:1}} onKeyDown={e=>e.key==="Enter"&&addSubj()}/><select value={addForm.grade} onChange={e=>setAddForm(p=>({...p,grade:e.target.value}))} style={{...INP,width:56,appearance:"none"}}>{grades.map(g=><option key={g} value={g}>{g}</option>)}</select><button onClick={addSubj} style={{padding:"8px 14px",background:C.teal,color:C.navy,border:"none",borderRadius:7,fontWeight:800,cursor:"pointer",fontFamily:"system-ui",whiteSpace:"nowrap"}}>+ Add</button></div>
      </div>
      <div style={cs}>
        <CH e="📊" title="Log a Test or Quiz"/>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8,marginBottom:8}}><div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>SUBJECT</div><select value={quizForm.subject} onChange={e=>setQuizForm(p=>({...p,subject:e.target.value}))} style={{...INP,appearance:"none"}}>{Object.keys(subjects).map(s=><option key={s} value={s}>{s}</option>)}</select></div><div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>SCORE</div><input type="number" value={quizForm.score} onChange={e=>setQuizForm(p=>({...p,score:e.target.value}))} style={INP}/></div><div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>OUT OF</div><input type="number" value={quizForm.total} onChange={e=>setQuizForm(p=>({...p,total:e.target.value}))} style={INP}/></div></div>
        <textarea value={quizForm.notes} onChange={e=>setQuizForm(p=>({...p,notes:e.target.value}))} placeholder="Notes about this test..." style={{...TXT,marginBottom:10}}/>
        <button onClick={logQuiz} style={{width:"100%",padding:12,background:C.teal,color:C.navy,border:"none",borderRadius:8,fontWeight:900,cursor:"pointer",fontSize:14,fontFamily:"system-ui"}}>Log Test ⭐</button>
      </div>
      {quizLog.length>0&&<div style={cs}><CH e="📚" title="Test History"/>{quizLog.slice(0,12).map(q=><div key={q.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div style={{background:`${GRADE_COL[q.grade]}22`,color:GRADE_COL[q.grade],fontWeight:900,fontSize:16,width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{q.grade}</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:C.text}}>{q.subject}</div><div style={{fontSize:11,color:C.muted}}>{q.date} · {q.score}/{q.total} ({q.pct}%)</div></div><button onClick={async()=>{const nl=quizLog.filter(x=>x.id!==q.id);await saveSchool(subjects,nl);}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer"}}>×</button></div>)}</div>}
    </div>;
  };

  // ── COACH ──────────────────────────────────────────────────────────────
  const Coach=()=>{
    const style2=goalStyle(profile.primaryGoal||"");
    const params=STYLE[style2];
    const readiness=computeReadiness(vitals,sleepEntries);
    const mod=intensityMod(readiness);
    const insights=generateInsights(profile,games,practices,skills,subjects,sleepEntries,vitals,goals);
    const dataPoints=games.length+practices.length+sleepEntries.length+styleLog.length+Object.keys(routineHist).length;
    const glowReport=getGlowReport();
    const r=(readiness.score!=null?readiness.score:0),displayVal=(readiness.displayValue!=null?readiness.displayValue:String(r)),C2=2*Math.PI*36,dash=C2-(((readiness.score!=null?readiness.score:0))/100)*C2;
    const weakSkills=Object.entries(skills).sort((a,b)=>a[1]-b[1]).slice(0,3);
    const weakSubjs=Object.entries(subjects).filter(([_,g])=>(GRADE_MAP[g]||0)<3).sort((a,b)=>(GRADE_MAP[a[1]]||0)-(GRADE_MAP[b[1]]||0));
    const typeCounts=practices.reduce((acc,p)=>{acc[p.type]=(acc[p.type]||0)+1;return acc;},{});
    const practiceInsight=practices.length>=3?Object.entries(typeCounts).sort((a,b)=>a[1]-b[1])[0]:null;
    return<div>
      {dataPoints<6&&<div style={{background:`${C.purple}18`,border:`1px solid ${C.purple}44`,borderRadius:10,padding:12,marginBottom:12,fontSize:11,color:C.light,lineHeight:1.7}}>
        <strong style={{color:C.purple}}>🧠 Coach is learning.</strong> Log games, practices, sleep, and grades. The more data, the smarter and more personalized your coaching becomes.
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>{[["🏀 Games",games.length],["💪 Practices",practices.length],["🌙 Sleep",sleepEntries.length]].map(([l,v])=><div key={l} style={{background:v>0?`${C.green}22`:C.navy,border:`1px solid ${v>0?C.green:C.border}`,borderRadius:6,padding:"3px 8px",fontSize:10,fontWeight:700,color:v>0?C.green:C.muted}}>{l}: {v}</div>)}</div>
      </div>}
      <div style={{...cs,background:C.card2}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
          <svg width={96} height={96} style={{filter:`drop-shadow(0 0 18px ${readiness.level.col}55)`}}><circle cx={48} cy={48} r={38} fill="rgba(0,0,0,.4)" stroke="rgba(255,255,255,.1)" strokeWidth={7}/><circle cx={48} cy={48} r={38} fill="none" stroke={readiness.level.col} strokeWidth={7} strokeLinecap="round" strokeDasharray={C2} strokeDashoffset={dash} transform="rotate(-90 48 48)" style={{transition:"all .6s cubic-bezier(.4,0,.2,1)"}}/><text x={45} y={42} textAnchor="middle" fill={C.text} fontSize={displayVal.length>2?16:18} fontWeight={800} fontFamily="system-ui">{displayVal}</text><text x={45} y={57} textAnchor="middle" fill={readiness.level.col} fontSize={readiness.level.label.length>9?7:8} fontWeight={800} fontFamily="system-ui">{readiness.level.label}</text></svg>
          <div style={{flex:1}}><div style={{fontWeight:900,fontSize:20,color:readiness.level.col,marginBottom:3}}>{readiness.level.label}</div><div style={{fontSize:11,color:C.muted,lineHeight:1.5,marginBottom:8}}>{mod.note}</div><div style={{background:`${params.col}22`,border:`1px solid ${params.col}55`,borderRadius:6,padding:"3px 8px",fontSize:9,fontWeight:800,color:params.col,display:"inline-block"}}>{params.label}</div></div>
        </div>
        {readiness.reasons.slice(0,2).map((rs,i)=><div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderTop:`1px solid ${C.border}`,alignItems:"flex-start"}}><span style={{fontSize:12}}>{rs.icon}</span><div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{rs.txt}</div></div>)}
      </div>
      <div style={cs}>
        <CH e="✨" title="My Glow-Up Report" sub="What is strong, what needs work, and the next move"/>
        {glowReport.map((x,i)=><div key={x.area} style={{background:`${x.col}10`,border:`1px solid ${x.col}33`,borderRadius:10,padding:10,marginBottom:i<glowReport.length-1?8:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
            <span style={{fontSize:16}}>{x.e}</span><div style={{fontWeight:900,fontSize:12,color:x.col,letterSpacing:"1px",textTransform:"uppercase",flex:1}}>{x.area}</div><div style={{fontSize:9,color:C.muted,fontWeight:800}}>{x.stat}</div>
          </div>
          <div style={{fontSize:11,color:C.text,lineHeight:1.5}}>✅ {x.doing}</div>
          <div style={{fontSize:11,color:C.muted,lineHeight:1.5,marginTop:2}}>🔎 {x.needs}</div>
          <div style={{fontSize:11,color:x.col,fontWeight:800,lineHeight:1.5,marginTop:3}}>➡️ {x.next}</div>
        </div>)}
      </div>
      {insights.length>0&&<div style={cs}>
        <div style={{fontWeight:800,fontSize:10,letterSpacing:"1.5px",color:C.text,textTransform:"uppercase",marginBottom:10}}>📊 Trend Analysis · {dataPoints} data points</div>
        {insights.map((ins,i)=><div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<insights.length-1?`1px solid ${C.border}`:"none",alignItems:"flex-start"}}>
          <div style={{fontSize:14,flexShrink:0}}>{ins.icon}</div>
          <div style={{flex:1,fontSize:12,color:C.text,lineHeight:1.5}}>{ins.text}</div>
          <div style={{width:3,borderRadius:99,background:`linear-gradient(180deg,${ins.col},${ins.col}66)`,alignSelf:"stretch",flexShrink:0,minHeight:24,boxShadow:`0 0 12px ${ins.col}77`}}/>
        </div>)}
      </div>}
      <div style={cs}>
        <div style={{fontWeight:800,fontSize:10,letterSpacing:"1.5px",color:C.text,textTransform:"uppercase",marginBottom:10}}>🎯 TOP 3 FOCUS AREAS</div>
        {weakSkills.map((([sk,val],i)=><div key={sk} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
          <div style={{width:24,height:24,borderRadius:"50%",background:`${SKILL_COL(val)}22`,border:`2px solid ${SKILL_COL(val)}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:SKILL_COL(val),flexShrink:0}}>{i+1}</div>
          <div style={{flex:1}}><div style={{fontWeight:800,fontSize:13,color:C.text}}>{sk}</div><div style={{fontSize:10,color:C.muted,marginTop:1}}>{SKILL_LEVEL(val)} · {val}% · Practice daily for 15 min</div></div>
          <div style={{fontWeight:900,fontSize:13,color:SKILL_COL(val)}}>{val}%</div>
        </div>))}
      </div>
      {practiceInsight&&<div style={{...cs,background:`${C.purple}12`,border:`1px solid ${C.purple}33`}}>
        <div style={{fontSize:11,color:C.purple,lineHeight:1.7}}>💡 <strong>Practice balance tip:</strong> {practiceInsight[0]} has been your least-practiced area ({practiceInsight[1]}x). Try adding a dedicated {practiceInsight[0].toLowerCase()} session this week.</div>
      </div>}
      {weakSubjs.length>0&&<div style={cs}>
        <div style={{fontWeight:800,fontSize:10,letterSpacing:"1.5px",color:C.text,textTransform:"uppercase",marginBottom:10}}>📚 STUDY PRIORITIES</div>
        {weakSubjs.map(([s,grade],i)=><div key={s} style={{padding:"10px 0",borderBottom:i<weakSubjs.length-1?`1px solid ${C.border}`:"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><div style={{background:`${GRADE_COL[grade]}22`,color:GRADE_COL[grade],fontWeight:900,fontSize:13,width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>{grade}</div><div style={{fontWeight:800,fontSize:13,color:C.text}}>{s}</div></div>
          <div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>15 min of focused {s} review each night. {(GRADE_MAP[grade]||0)<=1?"Ask your teacher for extra help — great students do this.":"Consistent review will move this grade."}</div>
        </div>)}
      </div>}
      <div style={{background:C.card2,borderRadius:12,border:`1px solid ${C.border}`,padding:14}}>
        <div style={{fontWeight:800,fontSize:10,letterSpacing:"1.5px",color:C.text,textTransform:"uppercase",marginBottom:10}}>📈 IMPROVEMENT RULES</div>
        {["Work your weakest skill for 15 min every day. Small daily reps build elite skill over time.","Practice feels easy? Add speed, add pressure, or shorten rest. Always be at your growing edge.","Log every game and practice — Coach reads the data and tracks your trends automatically.","9–10h of sleep = more skill retention, better reaction time, and faster growth. Use it.","Missed a session? Start fresh tomorrow. Consistency over intensity. Always."].map((t,i)=><div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:i<4?`1px solid ${C.border}`:"none",alignItems:"flex-start"}}><div style={{fontWeight:900,fontSize:11,color:params.col,minWidth:16}}>{i+1}</div><div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{t}</div></div>)}
      </div>
    </div>;
  };

  // ── GOALS ──────────────────────────────────────────────────────────────
  const Goals2=()=>{
    const done=goals.filter(g=>g.done).length;
    const[burst,setBurst]=useState(null);
    const CAT={basketball:{col:C.coral,icon:"🏀"},school:{col:C.teal,icon:"📚"},health:{col:C.green,icon:"💚"},character:{col:C.purple,icon:"⭐"},personal:{col:C.gold,icon:"🌟"}};
    const addGoal=async()=>{if(!goalForm.text.trim())return;const entry={id:uid(),text:goalForm.text.trim(),category:goalForm.category,targetDate:goalForm.targetDate,reward:goalForm.reward,done:false,date:toShort(todayISO())};const ng=[...goals,entry];await saveGoals(ng,stars);setGoalForm({text:"",category:"basketball",targetDate:"",reward:""});};
    const toggleGoal=async id=>{const goal=goals.find(g=>g.id===id);const ng=goals.map(g=>g.id===id?{...g,done:!g.done}:g);let ns=stars;if(!goal.done){ns+=5;setBurst(id);setTimeout(()=>setBurst(null),2500);}await saveGoals(ng,ns);};
    const delGoal=async id=>{await saveGoals(goals.filter(g=>g.id!==id),stars);};
    return<div>
      {burst&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,pointerEvents:"none",fontSize:60}}>🎉⭐🏆⭐🎉</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}><SBox value={goals.length} label="Set" color={C.purple}/><SBox value={done} label="Done" color={C.green}/><SBox value={goals.length?Math.round(done/goals.length*100)+"%":"—"} label="Complete" color={C.gold}/><SBox value={stars} label="⭐ Stars" color={C.gold}/></div>
      {goals.length>0&&<div style={{height:8,background:C.navy,borderRadius:100,overflow:"hidden",marginBottom:12}}><div style={{height:"100%",background:`linear-gradient(to right,${C.purple},${C.gold})`,width:`${Math.round((done/goals.length||0)*100)}%`,borderRadius:100,transition:"width .4s"}}/></div>}
      <div style={cs}>
        <CH e="✨" title="Set a New Goal" sub="Be specific — the more detail, the better"/>
        <textarea value={goalForm.text} onChange={e=>setGoalForm(p=>({...p,text:e.target.value}))} placeholder="What do you want to achieve? Be specific and bold!" style={{...TXT,marginBottom:8}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>CATEGORY</div><select value={goalForm.category} onChange={e=>setGoalForm(p=>({...p,category:e.target.value}))} style={{...INP,appearance:"none"}}>{Object.entries(CAT).map(([k,v])=><option key={k} value={k}>{v.icon} {k.charAt(0).toUpperCase()+k.slice(1)}</option>)}</select></div>
          <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>TARGET DATE</div><input type="date" value={goalForm.targetDate} onChange={e=>setGoalForm(p=>({...p,targetDate:e.target.value}))} style={INP}/></div>
        </div>
        <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>REWARD (optional)</div><input value={goalForm.reward} onChange={e=>setGoalForm(p=>({...p,reward:e.target.value}))} placeholder="e.g. Get ice cream, pick the movie, extra screen time" style={INP}/></div>
        <button onClick={addGoal} style={{width:"100%",padding:12,background:C.purple,color:C.white,border:"none",borderRadius:8,fontWeight:900,cursor:"pointer",fontSize:14,fontFamily:"system-ui"}}>Add Goal 🎯</button>
      </div>
      {Object.entries(CAT).map(([cat,{col,icon}])=>{const cg=goals.filter(g=>g.category===cat);if(!cg.length)return null;return<div key={cat} style={cs}>
        <CH e={icon} title={cat.charAt(0).toUpperCase()+cat.slice(1)} sub={`${cg.filter(g=>g.done).length}/${cg.length} complete`}/>
        {cg.map(g=><div key={g.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 8px",borderRadius:10,marginBottom:6,background:g.done?"#060C06":`${col}08`,border:`1px solid ${g.done?C.green+"33":col+"33"}`}}>
          <div onClick={()=>toggleGoal(g.id)} style={{width:28,height:28,borderRadius:"50%",border:g.done?"none":`2.5px solid ${col}`,background:g.done?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.white,fontSize:14,flexShrink:0,marginTop:2}}>{g.done&&"✓"}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:g.done?C.muted:C.text,textDecoration:g.done?"line-through":"none"}}>{g.text}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:2}}>{g.targetDate?`Target: ${g.targetDate} · `:""}{g.date}</div>
            {g.reward&&!g.done&&<div style={{fontSize:10,color:C.gold,marginTop:2}}>🎁 Reward: {g.reward}</div>}
            {g.done&&g.reward&&<div style={{fontSize:10,color:C.gold,marginTop:2}}>🎉 You earned: {g.reward}</div>}
          </div>
          {g.done&&<div style={{fontSize:18,flexShrink:0}}>⭐</div>}
          <button onClick={()=>delGoal(g.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16,flexShrink:0}}>×</button>
        </div>)}
      </div>;})}
    </div>;
  };

  // ── PROGRESS ───────────────────────────────────────────────────────────
  const Progress=()=>{
    const badgeData={games,practices,skills,subjects,goals,dailyHist,sleepEntries,styleLog,shoeWish,routineHist,routineItems};
    const earned=BADGE_DEFS.filter(b=>{try{return b.check(badgeData);}catch{return false;}});
    const locked=BADGE_DEFS.filter(b=>{try{return !b.check(badgeData);}catch{return true;}});
    const tg=games.length,wins=games.filter(g=>g.result==="Win").length,winPct=tg?Math.round(wins/tg*100):0;
    const last8=[...games].slice(0,8).reverse();const maxPts=Math.max(...last8.map(g=>g.pts||1),1);
    const habitDays=Object.keys(dailyHist).sort((a,b)=>b.localeCompare(a)).slice(0,14);
    const hScores=habitDays.map(day=>({pct:allH.length?Math.round(allH.filter(h=>(dailyHist[day]&&dailyHist[day].c||{})[h.id]).length/allH.length*100):0})).reverse();
    const weekMins=practices.filter(p=>daysAgo(p.dateISO||todayISO())<=7).reduce((a,p)=>a+(parseInt(p.duration)||0),0);
    const glowReport=getGlowReport();
    return<div>
      <GlamHero style={{textAlign:"center"}}>
        <div style={{fontSize:12,color:C.gold,fontWeight:900,letterSpacing:"1.5px",textTransform:"uppercase"}}>My Glow-Up Report ✨</div>
        <div style={{fontWeight:900,fontSize:64,color:C.gold,lineHeight:1,textShadow:`0 0 26px ${C.gold}77`}}>{stars}</div>
        <div style={{fontSize:15,fontWeight:900,color:C.text,marginTop:4}}>⭐ Stars Earned</div>
        <div style={{fontSize:11,color:C.light,marginTop:5}}>Your progress. Your power. Your next move.</div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:14}}>
          {earned.slice(0,3).map(b=><div key={b.id} style={{...glass,borderRadius:16,padding:"9px 10px",minWidth:82}}>
            <div style={{fontSize:24}}>{b.icon}</div><div style={{fontSize:8,fontWeight:900,color:C.light,marginTop:3}}>{b.name}</div>
          </div>)}
          {earned.length===0&&["Routine Queen","Sneaker Star","Goal Getter"].map((b,i)=><div key={b} style={{...glass,borderRadius:16,padding:"9px 10px",minWidth:82,opacity:.85}}>
            <div style={{fontSize:24}}>{["👑","👟","🎯"][i]}</div><div style={{fontSize:8,fontWeight:900,color:C.light,marginTop:3}}>{b}</div>
          </div>)}
        </div>
      </GlamHero>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
        <SBox value={tg} label="Games" color={C.coral}/><SBox value={`${winPct}%`} label="Win Rate" color={C.green}/>
        <SBox value={practices.length} label="Practices" color={C.purple}/><SBox value={weekMins||"0"} label="Mins/Week" color={C.teal} sub="this week"/>
      </div>
      <div style={cs}>
        <CH e="✨" title="Glow-Up Report" sub="All areas organized into next moves"/>
        {glowReport.map((x,i)=><div key={x.area} style={{display:"flex",gap:9,padding:"9px 0",borderBottom:i<glowReport.length-1?`1px solid ${C.border}`:"none",alignItems:"flex-start"}}>
          <div style={{fontSize:18,width:24,textAlign:"center",flexShrink:0}}>{x.e}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:2}}><div style={{fontWeight:900,fontSize:12,color:x.col}}>{x.area}</div><div style={{fontSize:9,color:C.muted,fontWeight:800}}>{x.stat}</div></div>
            <div style={{fontSize:11,color:C.text,lineHeight:1.45}}>✅ {x.doing}</div>
            <div style={{fontSize:11,color:C.muted,lineHeight:1.45}}>🔎 {x.needs}</div>
            <div style={{fontSize:11,color:x.col,fontWeight:800,lineHeight:1.45}}>➡️ {x.next}</div>
          </div>
        </div>)}
      </div>
      <div style={cs}>
        <CH e="🏅" title={`Badges — ${earned.length}/${BADGE_DEFS.length} Earned`}/>
        {earned.length>0&&<><div style={{fontSize:9,color:C.green,fontWeight:900,marginBottom:10,textTransform:"uppercase",letterSpacing:"2px",display:"flex",alignItems:"center",gap:6}}><span style={{display:"inline-block",width:20,height:1.5,background:C.green}}/>EARNED ✓<span style={{display:"inline-block",width:20,height:1.5,background:C.green}}/></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
            {earned.map(b=><div key={b.id} style={{background:"linear-gradient(145deg,rgba(34,217,122,.22),rgba(34,217,122,.08))",border:"1px solid rgba(34,217,122,.45)",borderRadius:14,padding:"9px 13px",display:"flex",alignItems:"center",gap:9,boxShadow:"0 8px 24px rgba(34,217,122,.15),inset 0 1px 0 rgba(255,255,255,.15)"}}>
              <div style={{fontSize:22,filter:`drop-shadow(0 0 8px ${C.green}88)`}}>{b.icon}</div><div><div style={{fontWeight:900,fontSize:11,color:C.green,textShadow:`0 0 14px ${C.green}88`}}>{b.name}</div><div style={{fontSize:9,color:C.muted}}>{b.desc}</div></div>
            </div>)}
          </div></>}
        {locked.length>0&&<><div style={{fontSize:9,color:C.muted,fontWeight:900,marginBottom:10,textTransform:"uppercase",letterSpacing:"2px",display:"flex",alignItems:"center",gap:6}}><span style={{display:"inline-block",width:20,height:1.5,background:C.muted}}/>LOCKED</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {locked.map(b=><div key={b.id} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:14,padding:"8px 12px",display:"flex",alignItems:"center",gap:8,opacity:.5}}>
              <div style={{fontSize:16,filter:"grayscale(1)"}}>{b.icon}</div><div><div style={{fontWeight:700,fontSize:10,color:C.muted}}>{b.name}</div><div style={{fontSize:8,color:C.muted}}>{b.desc}</div></div>
            </div>)}
          </div></>}
      </div>
      {last8.length>1&&<div style={cs}><CH e="📊" title={`Points — Last ${last8.length} Games`}/>
        <div style={{display:"flex",alignItems:"flex-end",gap:4,height:68}}>
          {last8.map((g,i)=>{const h=Math.max(4,Math.round((g.pts||0)/maxPts*60));return<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <div style={{fontSize:8,color:C.coral,fontWeight:800}}>{g.pts}</div>
            <div style={{width:"100%",height:h,background:g.result==="Win"?C.coral:`${C.coral}44`,borderRadius:"3px 3px 0 0",minHeight:4}}/>
            <div style={{fontSize:7,color:C.muted}}>{g.opponent?g.opponent.slice(0,4):""||(g.date?g.date.slice(0,5):"")}</div>
          </div>;})}
        </div>
      </div>}
      <div style={cs}><CH e="💪" title="Skill Levels" sub="Sorted by current level"/>
        {Object.entries(skills).sort((a,b)=>b[1]-a[1]).map(([sk,val])=><SkBar key={sk} skill={sk} val={val}/>)}
      </div>
      <div style={cs}><CH e="📚" title="Grades" sub={`GPA: ${gpaCalc(subjects)}`}/>
        {Object.entries(subjects).map(([s,grade])=><div key={s} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{background:`${GRADE_COL[grade]}22`,color:GRADE_COL[grade],fontWeight:900,fontSize:13,width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{grade}</div>
          <div style={{flex:1,fontSize:12,fontWeight:700,color:C.text}}>{s}</div>
          <div style={{fontSize:10,color:C.muted}}>{grade==="A"?"Excellent! 🌟":grade==="B"?"Good work":grade==="C"?"Room to grow":grade==="D"?"Needs focus":"See teacher"}</div>
        </div>)}
      </div>
      {hScores.length>1&&<div style={cs}><CH e="📋" title="Habit Consistency" sub="Last 14 days"/>
        <div style={{display:"flex",gap:3,alignItems:"flex-end",height:50,marginBottom:4}}>
          {hScores.map((hs,i)=><div key={i} style={{flex:1,height:Math.max(4,Math.round(hs.pct/100*46)),background:hs.pct>=80?C.purple:hs.pct>=50?`${C.purple}77`:`${C.purple}33`,borderRadius:"3px 3px 0 0",minHeight:4}}/>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.muted}}><span>14 days ago</span><span>Today</span></div>
      </div>}
    </div>;
  };

  // ── SETTINGS ───────────────────────────────────────────────────────────
  const Settings=()=>{
    const[sec,setSec]=useState("profile");
    const[editId,setEditId]=useState(null);
    const[adding,setAdding]=useState(false);
    const[form,setForm]=useState({});
    const stopEdit=()=>{setEditId(null);setAdding(false);setForm({});};
    const ProfileEd=()=><div style={cs}>
      <CH e="👤" title="My Profile"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        {[["NAME","name",""],["GRADE","grade","5th"],["TEAM","teamName",""],["EMOJI","emoji","⭐"]].map(([l,k,ph])=><div key={k}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>{l}</div><input value={profile[k]} onChange={e=>setProfile(p=>({...p,[k]:e.target.value}))} placeholder={ph} style={INP}/></div>)}
      </div>
      <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>PRIMARY GOAL</div><input value={profile.primaryGoal} onChange={e=>setProfile(p=>({...p,primaryGoal:e.target.value}))} placeholder="e.g. All-around player, Scorer, Defender..." style={INP}/></div>
      <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>FOCUS</div><input value={profile.focus} onChange={e=>setProfile(p=>({...p,focus:e.target.value}))} style={INP}/></div>
      <div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>MOTTO</div><textarea value={profile.notes} onChange={e=>setProfile(p=>({...p,notes:e.target.value}))} style={TXT}/></div>
    </div>;
    const HabitEd=()=>{
      const saveItem=()=>{if(!form.label)return;const item={id:editId||uid(),time:form.time||"Any",group:(form.group||"GENERAL").toUpperCase(),label:form.label};setHabits(editId?habits.map(h=>h.id===editId?item:h):[...habits,item]);stopEdit();};
      return<div style={cs}><CH e="✅" title="Daily Habits"/>
        {habits.map(h=><div key={h.id} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",gap:8}}><div><div style={{fontSize:12,color:C.text,fontWeight:700}}>{h.label}</div><div style={{fontSize:10,color:C.muted}}>{h.time} · {h.group}</div></div><div style={{display:"flex",gap:6}}><button onClick={()=>{setEditId(h.id);setAdding(false);setForm({...h});}} style={{background:"none",border:`1px solid ${C.border}`,color:C.text,borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Edit</button><button onClick={()=>setHabits(habits.filter(x=>x.id!==h.id))} style={{background:"none",border:`1px solid ${C.border}`,color:C.red,borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Del</button></div></div></div>)}
        {!adding&&!editId&&<button onClick={()=>{setAdding(true);setForm({time:"",group:"MORNING",label:""}); }} style={{width:"100%",marginTop:12,padding:10,borderRadius:8,border:`1px dashed ${C.purple}`,background:"transparent",color:C.purple,cursor:"pointer",fontWeight:800,fontFamily:"system-ui"}}>+ Add Habit</button>}
        {(adding||editId)&&<div style={{background:C.navy2,borderRadius:8,padding:12,marginTop:12,border:`1px solid ${C.purple}33`}}><div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>HABIT</div><input value={form.label||""} onChange={e=>setForm(p=>({...p,label:e.target.value}))} placeholder="What's the habit?" style={INP}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}><input value={form.time||""} onChange={e=>setForm(p=>({...p,time:e.target.value}))} placeholder="Time (e.g. Morning)" style={INP}/><input value={form.group||""} onChange={e=>setForm(p=>({...p,group:e.target.value}))} placeholder="Group (e.g. MORNING)" style={INP}/></div><div style={{display:"flex",gap:8}}><button onClick={saveItem} style={{flex:1,padding:9,background:C.purple,color:C.white,border:"none",borderRadius:7,fontWeight:800,cursor:"pointer",fontFamily:"system-ui"}}>Save</button><button onClick={stopEdit} style={{padding:"9px 16px",background:"none",color:C.muted,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",fontFamily:"system-ui"}}>Cancel</button></div></div>}
      </div>;
    };
    const TrainingEd=()=>{
      const DAYS=["MON","TUE","WED","THU","FRI","SAT","SUN"];
      const saveItem=()=>{if(!form.focus)return;const item={id:editId||uid(),day:form.day||"MON",focus:form.focus||"",detail:form.detail||""};setTrainingDays(editId?trainingDays.map(d=>d.id===editId?item:d):[...trainingDays,item]);stopEdit();};
      return<div style={cs}><CH e="💪" title="Weekly Training Days" sub="What you practice each day"/>
        {trainingDays.map(d=><div key={d.id} style={{padding:"9px 0",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",gap:8}}><div style={{flex:1}}><div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{fontWeight:900,fontSize:12,color:C.purple,minWidth:36}}>{d.day}</div><div style={{fontSize:13,color:C.text,fontWeight:700}}>{d.focus}</div></div>{d.detail&&<div style={{fontSize:11,color:C.muted,marginTop:2,marginLeft:44}}>{d.detail}</div>}</div><div style={{display:"flex",gap:6,flexShrink:0}}><button onClick={()=>{setEditId(d.id);setAdding(false);setForm({...d});}} style={{background:"none",border:`1px solid ${C.border}`,color:C.text,borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Edit</button><button onClick={()=>setTrainingDays(trainingDays.filter(x=>x.id!==d.id))} style={{background:"none",border:`1px solid ${C.border}`,color:C.red,borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Del</button></div></div></div>)}
        {!adding&&!editId&&<button onClick={()=>{setAdding(true);setForm({day:"MON",focus:"",detail:""}); }} style={{width:"100%",marginTop:12,padding:10,borderRadius:8,border:`1px dashed ${C.purple}`,background:"transparent",color:C.purple,cursor:"pointer",fontWeight:800,fontFamily:"system-ui"}}>+ Add Training Day</button>}
        {(adding||editId)&&<div style={{background:C.navy2,borderRadius:8,padding:12,marginTop:12,border:`1px solid ${C.purple}33`}}><div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>DAY</div><select value={form.day||"MON"} onChange={e=>setForm(p=>({...p,day:e.target.value}))} style={{...INP,appearance:"none"}}>{DAYS.map(d=><option key={d} value={d}>{d}</option>)}</select></div><div style={{marginBottom:8}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>FOCUS</div><input value={form.focus||""} onChange={e=>setForm(p=>({...p,focus:e.target.value}))} placeholder="e.g. Shooting, Defense, Full Workout" style={INP}/></div><div style={{marginBottom:10}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>DETAIL</div><input value={form.detail||""} onChange={e=>setForm(p=>({...p,detail:e.target.value}))} style={INP}/></div><div style={{display:"flex",gap:8}}><button onClick={saveItem} style={{flex:1,padding:9,background:C.purple,color:C.white,border:"none",borderRadius:7,fontWeight:800,cursor:"pointer",fontFamily:"system-ui"}}>Save</button><button onClick={stopEdit} style={{padding:"9px 16px",background:"none",color:C.muted,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",fontFamily:"system-ui"}}>Cancel</button></div></div>}
      </div>;
    };
    const RoutineEd=()=>{
      const cleanEntriesAfterDelete=(id)=>Object.fromEntries(Object.entries(routineHist).map(([day,entry])=>{
        const c={...(entry.c||{})};delete c[id];return[day,{...entry,c}];
      }));
      const saveItem=async()=>{if(!form.label)return;const item={id:editId||uid(),e:form.e||"✨",label:form.label,group:(form.group||"NIGHT ROUTINE").toUpperCase()};const items=editId?routineItems.map(i=>i.id===editId?item:i):[...routineItems,item];await saveRoutine(routineHist,items);stopEdit();};
      const delItem=async id=>{const items=routineItems.filter(i=>i.id!==id);const entries=cleanEntriesAfterDelete(id);await saveRoutine(entries,items);};
      return<div style={cs}><CH e="✨" title="Routine Builder" sub="Customize face care, outfit prep, school prep, game day, and night routine"/>
        {routineItems.map(item=><div key={item.id} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}><div style={{display:"flex",gap:9,alignItems:"center"}}><div style={{width:28,height:28,borderRadius:8,background:`${C.pink}18`,border:`1px solid ${C.pink}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{item.e}</div><div><div style={{fontSize:12,color:C.text,fontWeight:800}}>{item.label}</div><div style={{fontSize:10,color:C.muted}}>{item.group}</div></div></div><div style={{display:"flex",gap:6}}><button onClick={()=>{setEditId(item.id);setAdding(false);setForm({...item});}} style={{background:"none",border:`1px solid ${C.border}`,color:C.text,borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Edit</button><button onClick={()=>delItem(item.id)} style={{background:"none",border:`1px solid ${C.border}`,color:C.red,borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>Del</button></div></div></div>)}
        {!adding&&!editId&&<button onClick={()=>{setAdding(true);setForm({e:"✨",label:"",group:"NIGHT ROUTINE"});}} style={{width:"100%",marginTop:12,padding:10,borderRadius:8,border:`1px dashed ${C.pink}`,background:"transparent",color:C.pink,cursor:"pointer",fontWeight:800,fontFamily:"system-ui"}}>+ Add Routine Item</button>}
        {(adding||editId)&&<div style={{background:C.navy2,borderRadius:8,padding:12,marginTop:12,border:`1px solid ${C.pink}33`}}><div style={{display:"grid",gridTemplateColumns:"64px 1fr",gap:8,marginBottom:8}}><div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>ICON</div><input value={form.e||""} onChange={e=>setForm(p=>({...p,e:e.target.value}))} placeholder="✨" style={INP}/></div><div><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>ITEM</div><input value={form.label||""} onChange={e=>setForm(p=>({...p,label:e.target.value}))} placeholder="e.g. Clean basketball shoes" style={INP}/></div></div><div style={{marginBottom:10}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>GROUP</div><select value={form.group||"NIGHT ROUTINE"} onChange={e=>setForm(p=>({...p,group:e.target.value}))} style={{...INP,appearance:"none"}}>{ROUTINE_GROUPS.map(g=><option key={g} value={g}>{g}</option>)}</select></div><div style={{display:"flex",gap:8}}><button onClick={saveItem} style={{flex:1,padding:9,background:C.pink,color:C.white,border:"none",borderRadius:7,fontWeight:800,cursor:"pointer",fontFamily:"system-ui"}}>Save Routine Item</button><button onClick={stopEdit} style={{padding:"9px 16px",background:"none",color:C.muted,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",fontFamily:"system-ui"}}>Cancel</button></div></div>}
        <button onClick={()=>saveRoutine(routineHist,clone(ROUTINE_ITEMS))} style={{width:"100%",marginTop:10,padding:9,background:"transparent",border:`1px solid ${C.orange}55`,color:C.orange,borderRadius:8,cursor:"pointer",fontWeight:700,fontFamily:"system-ui"}}>Reset Routine Items to Default</button>
      </div>;
    };
    const DataEd=()=><div style={cs}><CH e="🗑️" title="Data Management"/><div style={{fontSize:12,color:C.muted,marginBottom:12,lineHeight:1.6}}>All data saves automatically. Use buttons below to reset specific sections.</div><div style={{display:"flex",flexDirection:"column",gap:8}}>
      <button onClick={async()=>{setGames([]);await saveBball([],skills);}} style={{padding:10,background:"transparent",border:`1px solid ${C.red}55`,color:C.red,borderRadius:8,cursor:"pointer",fontWeight:700,fontFamily:"system-ui"}}>Reset Games Log</button>
      <button onClick={async()=>{setPractices([]);await savePrax([]);}} style={{padding:10,background:"transparent",border:`1px solid ${C.red}55`,color:C.red,borderRadius:8,cursor:"pointer",fontWeight:700,fontFamily:"system-ui"}}>Reset Practice Log</button>
      <button onClick={async()=>{setGoals([]);setStars(0);await saveGoals([],0);}} style={{padding:10,background:"transparent",border:`1px solid ${C.red}55`,color:C.red,borderRadius:8,cursor:"pointer",fontWeight:700,fontFamily:"system-ui"}}>Reset Goals & Stars</button>
      <button onClick={async()=>{setQuizLog([]);await saveSchool(subjects,[]);}} style={{padding:10,background:"transparent",border:`1px solid ${C.orange}55`,color:C.orange,borderRadius:8,cursor:"pointer",fontWeight:700,fontFamily:"system-ui"}}>Reset Test Log</button>
      <button onClick={async()=>{setSleepEntries([]);await saveSleep([]);}} style={{padding:10,background:"transparent",border:`1px solid ${C.orange}55`,color:C.orange,borderRadius:8,cursor:"pointer",fontWeight:700,fontFamily:"system-ui"}}>Reset Sleep Log</button>
      <button onClick={async()=>{await saveStyle([],[],[]);}} style={{padding:10,background:"transparent",border:`1px solid ${C.orange}55`,color:C.orange,borderRadius:8,cursor:"pointer",fontWeight:700,fontFamily:"system-ui"}}>Reset Style Logs</button>
      <button onClick={async()=>{await saveRoutine({},routineItems);}} style={{padding:10,background:"transparent",border:`1px solid ${C.orange}55`,color:C.orange,borderRadius:8,cursor:"pointer",fontWeight:700,fontFamily:"system-ui"}}>Reset Routine Checkmarks</button>
      <button onClick={async()=>{setSkills(clone(DEF_SKILLS));await saveBball(games,clone(DEF_SKILLS));}} style={{padding:10,background:"transparent",border:`1px solid ${C.orange}55`,color:C.orange,borderRadius:8,cursor:"pointer",fontWeight:700,fontFamily:"system-ui"}}>Reset Skills to Default</button>
    </div></div>;
    return<div>
      <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:12,paddingBottom:2}}>
        {[["profile","Profile"],["habits","Habits"],["routine","Routine"],["training","Training"],["data","Data"]].map(([id,lbl])=><button key={id} onClick={()=>{setSec(id);stopEdit();}} style={{padding:"9px 12px",borderRadius:8,border:`1px solid ${sec===id?C.purple:C.border}`,background:sec===id?`${C.purple}18`:C.card,color:sec===id?C.purple:C.text,cursor:"pointer",whiteSpace:"nowrap",fontWeight:700,fontSize:13,fontFamily:"system-ui"}}>{lbl}</button>)}
      </div>
      {sec==="profile"&&<ProfileEd/>}{sec==="habits"&&<HabitEd/>}{sec==="routine"&&<RoutineEd/>}{sec==="training"&&<TrainingEd/>}{sec==="data"&&<DataEd/>}
    </div>;
  };

  const CONTENT={today:Today,games:Games,practice:Practice,style:Style,routine:Routine,sleep:Sleep,skills:Skills,school:School,coach:Coach,goals:Goals2,progress:Progress,settings:Settings};
  if(!loaded)return<div style={{background:"radial-gradient(circle at 20% 0%,#5E1D8A,transparent 35%),radial-gradient(circle at 80% 20%,#FF5FD255,transparent 35%),#090015",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:C.text,fontFamily:"system-ui",flexDirection:"column",gap:12}}><div style={{fontSize:46,filter:`drop-shadow(0 0 18px ${C.gold})`}}>⭐</div><div style={{fontWeight:900}}>Loading {profile.name||"Scarlett"}'s tracker...</div></div>;
  return<div style={{background:"radial-gradient(circle at 12% -8%,rgba(248,95,200,.18),transparent 28%),radial-gradient(circle at 92% 4%,rgba(44,230,209,.10),transparent 26%),linear-gradient(180deg,#0F0B1C,#080612 58%,#05040B)",minHeight:"100vh",fontFamily:"system-ui,-apple-system,sans-serif",color:C.text}}>
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",position:"relative",boxShadow:"0 0 100px rgba(255,26,140,.12),0 0 200px rgba(139,92,246,.06)"}}>
      <div style={{position:"sticky",top:0,zIndex:50,padding:"10px 12px 8px",background:"linear-gradient(180deg,rgba(15,0,28,.95),rgba(15,0,28,.78))",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:10}}>
          <div>
            <div style={{fontWeight:900,fontSize:22,letterSpacing:"-.5px",color:C.white,lineHeight:1}}><span style={{color:C.gold}}>✦</span> <span style={{background:glamGrad,WebkitBackgroundClip:"text",color:"transparent"}}>{profile.name}</span></div>
            <div style={{fontSize:10,color:C.light,letterSpacing:"1px",fontWeight:800}}>{profile.grade} Grade{profile.teamName?` · ${profile.teamName}`:""} · {profile.primaryGoal}</div>
          </div>
          <div style={{background:"linear-gradient(135deg,rgba(255,215,0,.30),rgba(255,26,140,.18))",border:`1px solid ${C.gold}77`,borderRadius:16,padding:"7px 12px",textAlign:"center",boxShadow:`0 0 28px ${C.gold}33,inset 0 1px 0 rgba(255,255,255,.2)`}}><div style={{fontWeight:900,fontSize:18,color:C.gold,textShadow:"0 0 20px rgba(255,215,0,.8)"}}>⭐ {stars}</div><div style={{fontSize:8,color:"rgba(255,255,255,.7)",fontWeight:800,letterSpacing:"1px"}}>STARS</div></div>
        </div>
        <div style={{display:"flex",overflowX:"auto",gap:7,paddingBottom:2}}>
          {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{fontWeight:900,fontSize:9,letterSpacing:"0.7px",color:tab===t.id?C.white:C.muted,padding:"8px 9px",border:`1px solid ${tab===t.id?"rgba(255,255,255,.20)":"rgba(255,255,255,.06)"}`,background:tab===t.id?glamGrad:"rgba(255,255,255,.045)",borderRadius:999,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,textTransform:"uppercase",fontFamily:"system-ui",boxShadow:tab===t.id?`0 0 18px ${C.pink}55`:"none"}}>{t.e} {t.label}</button>)}
        </div>
      </div>
      <div style={{padding:"12px 12px calc(132px + env(safe-area-inset-bottom, 0px))"}}><StableRenderer key={tab} render={CONTENT[tab]||Today}/></div>
      <div style={{position:"fixed",left:"50%",bottom:"max(10px, env(safe-area-inset-bottom, 0px))",transform:"translateX(-50%)",width:"min(406px,calc(100% - 24px))",display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,background:"rgba(12,0,25,.88)",backdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,.13)",borderRadius:24,padding:"8px 8px calc(8px + env(safe-area-inset-bottom, 0px))",boxShadow:"0 18px 50px rgba(0,0,0,.45)",zIndex:60}}>
        {[["today","🏠","Home"],["goals","🎯","Goals"],["practice","＋","Log"],["progress","📈","Glow"],["style","👟","Style"]].map(([id,e,l])=><button key={id} onClick={()=>setTab(id)} style={{background:tab===id?`${C.pink}22`:"transparent",border:"none",borderRadius:16,color:tab===id?C.pink:C.muted,padding:"7px 2px",fontFamily:"system-ui",fontWeight:900,cursor:"pointer"}}><div style={{fontSize:id==="practice"?24:18,lineHeight:1}}>{e}</div><div style={{fontSize:8,marginTop:3}}>{l}</div></button>)}
      </div>
    </div>
  </div>;
}
