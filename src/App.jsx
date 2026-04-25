TODAY TAB VIRGO + VIBE CHECK UPGRADE PATCH

What this patch does
1) Replaces the Virgo card with a true daily Virgo-inspired card that changes every day.
2) Fixes the cut-off issue by redesigning the vibe check into stacked sections.
3) Makes the section feel more premium, cleaner, and easier for a 10-year-old to use.

Paste helper data/functions near your other helpers, above the Today component.

const VIRGO_DAILY_GLOW = [
  {
    title:"Clean Slate Energy",
    vibe:"Virgo magic loves a fresh start.",
    message:"Small disciplined steps build the big glow-up. One good choice today can shift the whole day.",
    power:"Power move",
    powerText:"Finish one thing all the way before jumping to the next.",
    lucky:"Lucky vibe",
    luckyText:"Clean fit, clean room, clean focus"
  },
  {
    title:"Soft but Strong",
    vibe:"Virgo strength is quiet confidence.",
    message:"You do not need to be loud to be powerful. Let your effort speak for you today.",
    power:"Power move",
    powerText:"Be extra focused in practice or school for 15 minutes with no distractions.",
    lucky:"Lucky vibe",
    luckyText:"Gold accents and a calm playlist"
  },
  {
    title:"Main Character Discipline",
    vibe:"Virgo wins through consistency.",
    message:"You are building trust with yourself every time you follow through, even on the tiny things.",
    power:"Power move",
    powerText:"Complete your hardest task first so the rest of the day feels lighter.",
    lucky:"Lucky vibe",
    luckyText:"Neat hair and a checked-off list"
  },
  {
    title:"Glow from the Inside Out",
    vibe:"Virgo energy shines through healthy habits.",
    message:"The prettiest glow is the one built by good sleep, water, effort, and keeping promises to yourself.",
    power:"Power move",
    powerText:"Stack one school win, one hoop win, and one self-care win today.",
    lucky:"Lucky vibe",
    luckyText:"Hydrated, organized, and unbothered"
  },
  {
    title:"Precision Era",
    vibe:"Virgo sees details other people miss.",
    message:"Use your eye for detail to sharpen something today. Tiny improvements become elite results.",
    power:"Power move",
    powerText:"Choose one skill and do 10 cleaner reps than yesterday.",
    lucky:"Lucky vibe",
    luckyText:"Focused eyes and fresh sneakers"
  },
  {
    title:"Protected Peace",
    vibe:"Virgo grows best in calm energy.",
    message:"Protect your mood from drama today. Your peace is part of your power.",
    power:"Power move",
    powerText:"Take one deep breath before reacting and choose the calmer answer.",
    lucky:"Lucky vibe",
    luckyText:"Low-stress energy and a tidy bag"
  },
  {
    title:"Level-Up Day",
    vibe:"Virgo is built for improvement.",
    message:"You do not have to be perfect. You just need to be a little better than yesterday.",
    power:"Power move",
    powerText:"Pick one mini goal and finish it before bedtime.",
    lucky:"Lucky vibe",
    luckyText:"Checklist mode and positive self-talk"
  },
  {
    title:"Confident and Collected",
    vibe:"Virgo glow is polished and prepared.",
    message:"Preparation creates confidence. When you feel ready, you move differently.",
    power:"Power move",
    powerText:"Lay out what you need before the next part of your day starts.",
    lucky:"Lucky vibe",
    luckyText:"Matching fit and clear game plan"
  },
  {
    title:"Smart Girl Momentum",
    vibe:"Virgo thrives when brain and heart work together.",
    message:"You are allowed to be thoughtful, talented, stylish, and strong all at once.",
    power:"Power move",
    powerText:"Do one thing that makes future-you proud.",
    lucky:"Lucky vibe",
    luckyText:"Sharp focus and a kind attitude"
  },
  {
    title:"Quiet Star Power",
    vibe:"Virgo does not chase attention — it earns respect.",
    message:"Today is about showing your quality, not proving yourself to everyone.",
    power:"Power move",
    powerText:"Let your work be the loudest thing about you today.",
    lucky:"Lucky vibe",
    luckyText:"Simple, clean, and confident"
  },
  {
    title:"Locked-In Energy",
    vibe:"Virgo can turn focus into magic.",
    message:"A locked-in hour can change your whole day. Lock in on what matters most.",
    power:"Power move",
    powerText:"Choose one block of time and go all in with no distractions.",
    lucky:"Lucky vibe",
    luckyText:"Do-not-disturb mode and steady effort"
  },
  {
    title:"Graceful Grind",
    vibe:"Virgo knows growth can be pretty and powerful.",
    message:"There is beauty in discipline. Every routine you keep is part of your glow-up story.",
    power:"Power move",
    powerText:"Finish your nighttime routine all the way tonight.",
    lucky:"Lucky vibe",
    luckyText:"Soft glow and strong habits"
  }
];

const getDayOfYear=(input)=>{
  const d=input?new Date(input):new Date();
  const start=new Date(d.getFullYear(),0,0);
  const diff=d-start;
  const oneDay=1000*60*60*24;
  return Math.floor(diff/oneDay);
};

const getVirgoGlow=(input)=>{
  const index=getDayOfYear(input)%VIRGO_DAILY_GLOW.length;
  return VIRGO_DAILY_GLOW[index];
};

const vibeModes=[
  {id:"court-beast", emoji:"🏀", label:"Court Beast", color:C.coral},
  {id:"main-character", emoji:"💅", label:"Main Character", color:C.pink},
  {id:"school-boss", emoji:"📚", label:"School Boss", color:C.teal},
  {id:"reset-mode", emoji:"🌙", label:"Reset Mode", color:C.purple}
];

const energyOptions=[
  {value:1, emoji:"🪫", label:"Low"},
  {value:2, emoji:"🙂", label:"Okay"},
  {value:3, emoji:"⚡", label:"Up"},
  {value:4, emoji:"🔥", label:"High"},
  {value:5, emoji:"🚀", label:"Max"}
];

const moodOptions=[
  {value:1, emoji:"😴", label:"Sleepy"},
  {value:2, emoji:"😕", label:"Off"},
  {value:3, emoji:"🙂", label:"Good"},
  {value:4, emoji:"😎", label:"Confident"},
  {value:5, emoji:"✨", label:"Shining"}
];

Then inside your Today component, add these lines near the top of the component:

const virgoGlow=getVirgoGlow();
const selectedMode=vitals.mode || "";
const selectedEnergy=vitals.energy || 0;
const selectedMood=vitals.mood || 0;

const setMode=(mode)=>setVitals(p=>({...p,mode}));
const setEnergy=(value)=>setVitals(p=>({...p,energy:value}));
const setMood=(value)=>setVitals(p=>({...p,mood:value}));

Now replace your current Virgo card + current Vibe Check card with this upgraded version:

<div style={{...cs, padding:0, overflow:"hidden", marginBottom:12, background:"linear-gradient(145deg, rgba(32,10,58,.96), rgba(10,12,38,.96))"}}>
  <div style={{padding:18, borderBottom:`1px solid ${C.border}`}}>
    <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:10}}>
      <div>
        <div style={{fontSize:11, color:C.gold, fontWeight:950, letterSpacing:"2px", textTransform:"uppercase", marginBottom:6}}>♍ Virgo Daily Vibe</div>
        <div style={{fontSize:28, fontWeight:950, color:C.gold, lineHeight:1.05, marginBottom:8}}>{virgoGlow.title}</div>
        <div style={{fontSize:12, color:"rgba(255,255,255,.75)", lineHeight:1.5}}>{virgoGlow.vibe}</div>
      </div>
      <div style={{padding:"10px 12px", borderRadius:16, background:"linear-gradient(135deg, rgba(255,215,0,.16), rgba(255,95,200,.10))", border:`1px solid ${C.gold}44`, color:C.gold, fontSize:11, fontWeight:900, whiteSpace:"nowrap"}}>
        new every day
      </div>
    </div>

    <div style={{background:"linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.03))", border:`1px solid ${C.border}`, borderRadius:18, padding:16, marginBottom:12}}>
      <div style={{fontSize:13, color:C.white, lineHeight:1.65, textAlign:"center"}}>{virgoGlow.message}</div>
    </div>

    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
      <div style={{padding:14, borderRadius:18, background:"linear-gradient(145deg, rgba(139,92,246,.14), rgba(255,255,255,.03))", border:`1px solid ${C.purple}44`}}>
        <div style={{fontSize:10, color:C.purple, fontWeight:900, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8}}>{virgoGlow.power}</div>
        <div style={{fontSize:13, color:C.white, fontWeight:800, lineHeight:1.5}}>{virgoGlow.powerText}</div>
      </div>
      <div style={{padding:14, borderRadius:18, background:"linear-gradient(145deg, rgba(255,215,0,.12), rgba(255,255,255,.03))", border:`1px solid ${C.gold}44`}}>
        <div style={{fontSize:10, color:C.gold, fontWeight:900, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8}}>{virgoGlow.lucky}</div>
        <div style={{fontSize:13, color:C.white, fontWeight:800, lineHeight:1.5}}>{virgoGlow.luckyText}</div>
      </div>
    </div>
  </div>

  <div style={{padding:18, background:"linear-gradient(180deg, rgba(255,26,140,.08), rgba(20,26,64,.02))"}}>
    <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginBottom:12}}>
      <div>
        <div style={{fontSize:11, color:C.pink, fontWeight:950, letterSpacing:"2px", textTransform:"uppercase", marginBottom:5}}>Scarlett's Vibe Check</div>
        <div style={{fontSize:12, color:"rgba(255,255,255,.72)"}}>Easy, fun, and actually useful</div>
      </div>
      <div style={{padding:"9px 12px", borderRadius:16, border:`1px solid ${C.gold}44`, color:C.gold, fontSize:11, fontWeight:900}}>not a worksheet</div>
    </div>

    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14}}>
      {vibeModes.map(mode=>{
        const active=selectedMode===mode.id;
        return (
          <button
            key={mode.id}
            onClick={()=>setMode(mode.id)}
            style={{
              padding:14,
              borderRadius:18,
              border:`1px solid ${active ? mode.color : C.border}`,
              background:active ? `linear-gradient(145deg, ${mode.color}35, rgba(255,255,255,.04))` : "linear-gradient(145deg, rgba(255,255,255,.05), rgba(255,255,255,.02))",
              color:C.white,
              cursor:"pointer",
              textAlign:"left",
              fontFamily:"system-ui",
              boxShadow:active ? `0 0 24px ${mode.color}33` : "none"
            }}
          >
            <div style={{fontSize:24, marginBottom:8}}>{mode.emoji}</div>
            <div style={{fontSize:12, fontWeight:900, lineHeight:1.2}}>{mode.label}</div>
          </button>
        );
      })}
    </div>

    <div style={{display:"grid", gap:14}}>
      <div style={{padding:14, borderRadius:18, background:"linear-gradient(145deg, rgba(255,255,255,.05), rgba(255,255,255,.02))", border:`1px solid ${C.border}`}}>
        <div style={{fontSize:11, color:C.gold, fontWeight:950, letterSpacing:"2px", textTransform:"uppercase", marginBottom:10}}>Energy Level</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4, minmax(0, 1fr))", gap:10}}>
          {energyOptions.map(item=>{
            const active=selectedEnergy===item.value;
            return (
              <button
                key={item.value}
                onClick={()=>setEnergy(item.value)}
                style={{
                  minHeight:72,
                  padding:"10px 6px",
                  borderRadius:16,
                  border:`1px solid ${active ? C.gold : C.border}`,
                  background:active ? "linear-gradient(145deg, rgba(255,215,0,.25), rgba(255,255,255,.04))" : "linear-gradient(145deg, rgba(255,255,255,.04), rgba(255,255,255,.02))",
                  color:C.white,
                  cursor:"pointer",
                  fontFamily:"system-ui"
                }}
              >
                <div style={{fontSize:22, marginBottom:6}}>{item.emoji}</div>
                <div style={{fontSize:10, fontWeight:800, lineHeight:1.2}}>{item.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{padding:14, borderRadius:18, background:"linear-gradient(145deg, rgba(255,255,255,.05), rgba(255,255,255,.02))", border:`1px solid ${C.border}`}}>
        <div style={{fontSize:11, color:C.pink, fontWeight:950, letterSpacing:"2px", textTransform:"uppercase", marginBottom:10}}>Mood</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4, minmax(0, 1fr))", gap:10}}>
          {moodOptions.map(item=>{
            const active=selectedMood===item.value;
            return (
              <button
                key={item.value}
                onClick={()=>setMood(item.value)}
                style={{
                  minHeight:72,
                  padding:"10px 6px",
                  borderRadius:16,
                  border:`1px solid ${active ? C.pink : C.border}`,
                  background:active ? "linear-gradient(145deg, rgba(255,95,200,.25), rgba(255,255,255,.04))" : "linear-gradient(145deg, rgba(255,255,255,.04), rgba(255,255,255,.02))",
                  color:C.white,
                  cursor:"pointer",
                  fontFamily:"system-ui"
                }}
              >
                <div style={{fontSize:22, marginBottom:6}}>{item.emoji}</div>
                <div style={{fontSize:10, fontWeight:800, lineHeight:1.2}}>{item.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>

    <div style={{marginTop:14, padding:14, borderRadius:18, background:"linear-gradient(145deg, rgba(0,194,224,.10), rgba(255,255,255,.02))", border:`1px solid ${C.teal}44`}}>
      <div style={{fontSize:11, color:C.teal, fontWeight:950, letterSpacing:"2px", textTransform:"uppercase", marginBottom:10}}>Water Power-Up 💧</div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(8, minmax(0, 1fr))", gap:8}}>
        {Array.from({length:8},(_,i)=>{
          const active=i<water;
          return (
            <button
              key={i}
              onClick={()=>setWater(i<water?i:i+1)}
              style={{
                height:42,
                borderRadius:12,
                border:`1px solid ${active ? C.teal : C.border}`,
                background:active ? "linear-gradient(180deg, rgba(0,194,224,.38), rgba(0,194,224,.18))" : "rgba(255,255,255,.03)",
                cursor:"pointer"
              }}
            />
          );
        })}
      </div>
      <div style={{fontSize:11, color:water>=8?C.green:"rgba(255,255,255,.68)", marginTop:10}}>
        {water>=8 ? "Hydration goal crushed 💧" : `${8-water} more to hit today’s water goal`}
      </div>
    </div>

    <div style={{marginTop:14}}>
      <div style={{fontSize:11, color:C.white, fontWeight:900, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8}}>Today's motto</div>
      <input
        value={notes || ""}
        onChange={e=>setNotes(e.target.value)}
        placeholder="I will..."
        style={{
          width:"100%",
          padding:"16px 14px",
          borderRadius:16,
          border:`1px solid ${C.border}`,
          background:"rgba(0,0,0,.34)",
          color:C.white,
          fontSize:15,
          outline:"none"
        }}
      />
    </div>
  </div>
</div>

Optional small improvement
If your current notes field is used for something else, create a dedicated state value instead:

const [todayMotto, setTodayMotto] = useState("");

Then replace notes / setNotes in the input with todayMotto / setTodayMotto.

Main reason this fixes your problem
- The old energy/mood area was trying to sit too much content on one row.
- This version stacks the sections and uses responsive grids, so nothing gets chopped off on iPhone.
- The Virgo section now feels like a real daily feature instead of a one-off card.
