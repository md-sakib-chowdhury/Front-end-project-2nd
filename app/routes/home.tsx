import { useState, useEffect, useRef } from "react";

import heroBackground from "../components/Assets/Hero.png";
/* ── HOOK: scroll fade-in ─────────────────────────────────── */
function useFade() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("fi");
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("on");
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref as React.RefObject<any>;
}

/* ── HOOK: live countdown ─────────────────────────────────── */
function useCountdown() {
  const target = useRef(
    (() => {
      const d = new Date();
      d.setDate(d.getDate() + 8);
      d.setHours(7, 0, 0, 0);
      return d;
    })()
  );
  const [t, setT] = useState({ d: "08", h: "03", m: "27", s: "14" });
  useEffect(() => {
    const id = setInterval(() => {
      const diff = target.current.getTime() - Date.now();
      if (diff <= 0) return clearInterval(id);
      const p = (n: number) => String(n).padStart(2, "0");
      setT({
        d: p(Math.floor(diff / 86400000)),
        h: p(Math.floor((diff % 86400000) / 3600000)),
        m: p(Math.floor((diff % 3600000) / 60000)),
        s: p(Math.floor((diff % 60000) / 1000)),
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ══════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  const time = useCountdown();
  const [faqOpen, setFaqOpen] = useState<number>(0);
  const [heroImg, setHeroImg] = useState(heroBackground);
  // const [heroImg, setHeroImg] = useState(
    // "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1800&q=80"
  // );
  const [imgInput, setImgInput] = useState("");
  const [showPanel, setShowPanel] = useState(true);

  /* ── INJECT FONTS + GLOBAL CSS (SSR-safe) ── */
  useEffect(() => {
    if (!document.getElementById("rg-fonts")) {
      const link = document.createElement("link");
      link.id = "rg-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap";
      document.head.appendChild(link);
    }
    if (!document.getElementById("rg-global")) {
      const s = document.createElement("style");
      s.id = "rg-global";
      s.textContent = [
        "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
        "html { scroll-behavior: smooth; }",
        "body { font-family: 'DM Sans', sans-serif; background: #f8f8f4; color: #0f0f0f; overflow-x: hidden; }",
        "@keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }",
        "@keyframes ticker  { from { transform:translateX(0); } to { transform:translateX(-50%); } }",
        ".fi  { opacity:0; transform:translateY(24px); transition:opacity .7s ease,transform .7s ease; }",
        ".fi.on { opacity:1; transform:translateY(0); }",
        ".ha1 { opacity:0; animation:fadeUp .8s .2s  forwards; }",
        ".ha2 { opacity:0; animation:fadeUp .9s .4s  forwards; }",
        ".ha3 { opacity:0; animation:fadeUp .9s .6s  forwards; }",
        ".ha4 { opacity:0; animation:fadeUp .9s .8s  forwards; }",
        ".ha5 { opacity:0; animation:fadeUp .9s 1s   forwards; }",
      ].join(" ");
      document.head.appendChild(s);
    }
  }, []);

  /* ── DATA ── */
  const faqs = [
    { q: "When does the next group ride take place?", a: "Group rides are posted weekly by community organisers. Check the Upcoming section — new rides are added every Monday morning." },
    { q: "How do I become a ride organiser?", a: "Any member can become an organiser. Create a ride listing from your dashboard. Rides with 3+ RSVPs get featured on the homepage." },
    { q: "Can I track my rides and progress?", a: "Yes! RideGrounds integrates with Strava, Garmin Connect and Wahoo. Your stats sync automatically." },
    { q: "Is the platform free to use?", a: "The core platform is completely free. Premium unlocks advanced route planning, early RSVP access, and exclusive equipment discounts." },
  ];

  const events = [
    { tag: "Group", date: "SAT 15 FEB", title: "Coastal Morning Loop", loc: "Brighton Coast", img: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80" },
    { tag: "Challenge", date: "SUN 16 FEB", title: "Mountain Evening Climb", loc: "Peak District", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
    { tag: "Social", date: "WED 19 FEB", title: "City Night Ride", loc: "Central London", img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80" },
  ];

  const equipment = [
    { brand: "Trek", name: "Domane SL 5 Road Bike", price: "£2,499", badge: "Community Pick", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80" },
    { brand: "Giro", name: "Syntax MIPS Helmet", price: "£199", badge: "Best Value", img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80" },
    { brand: "Camelbak", name: "Podium Chill Bottle", price: "£24", badge: "Most Loved", img: "https://images.unsplash.com/photo-1622140726493-88bf2fd25aba?w=400&q=80" },
    { brand: "Rapha", name: "Pro Team Training Jersey", price: "£110", badge: "Staff Pick", img: "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=400&q=80" },
  ];

  const routeCards = [
    { num: "01", icon: "🗺️", title: "Community Recommended", desc: "Browse hundreds of routes vetted by local riders who know the roads inside out." },
    { num: "02", icon: "📊", title: "Detailed Stats", desc: "Elevation gain, surface type, difficulty rating and estimated completion time." },
    { num: "03", icon: "📍", title: "Near Your Area", desc: "Filter routes within any radius. Find hidden gems right outside your door." },
  ];

  const blogs = [
    { tag: "Training", title: "Training for the best group rides: A beginner's guide", date: "Mar 12", read: "5 min", img: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80" },
    { tag: "Tips", title: "5 tips a first-time group cycling ride needs to know", date: "Mar 8", read: "4 min", img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80" },
    { tag: "Community", title: "How a group ride changed my perspective on cycling", date: "Mar 2", read: "6 min", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  ];

  const photos = [
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80",
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80",
    "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=600&q=80",
    "https://images.unsplash.com/photo-1622140726493-88bf2fd25aba?w=600&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80",
  ];

  /* ── SHARED STYLES ── */
  const SL: React.CSSProperties = { fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#b5f23d", marginBottom: 12 };
  const ST: React.CSSProperties = { fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(44px,5vw,72px)", lineHeight: 0.95, marginBottom: 48 };
  const BP: React.CSSProperties = { background: "#b5f23d", color: "#0f0f0f", padding: "14px 32px", fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", border: "none", cursor: "pointer", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))", display: "inline-block", transition: "transform .2s,box-shadow .2s" };

  const applyHeroImg = () => {
    if (!imgInput.trim()) return;
    const img = new Image();
    img.onload = () => setHeroImg(imgInput.trim());
    img.src = imgInput.trim();
  };

  /* ── FADE REFS ── */
  const r1 = useFade(), r2 = useFade(), r3 = useFade(), r4 = useFade(),
    r5 = useFade(), r6 = useFade(), r7 = useFade(), r8 = useFade(),
    r9 = useFade(), r10 = useFade(), r11 = useFade(), r12 = useFade();

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>

      {/* ───────────────── HERO ───────────────── */}
      <section id="home" style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0f0f0f 0%,#1a2410 60%,#0f1a08 100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 48px 80px", position: "relative", overflow: "hidden" }}>
        {/* <div style={{ position: "absolute", inset: 0, background: `url('${heroImg}') center/cover no-repeat`, opacity: 0.25, transition: "background .4s" }} /> */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.4, transition: "opacity .4s" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 780 }}>
          <p className="ha1" style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#b5f23d", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>// cycling community platform</p>
          <h1 className="ha2" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(72px,10vw,140px)", lineHeight: 0.9, color: "#f8f8f4", marginBottom: 28 }}>
            Ride Together,<br /><span style={{ color: "#b5f23d" }}>Explore</span> More,<br />Support Cycling
          </h1>
          <p className="ha3" style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(248,248,244,0.7)", maxWidth: 480, marginBottom: 40 }}>
            Connect with local riders, discover new routes, and be part of the fastest-growing cycling community around you.
          </p>
          <div className="ha4" style={{ display: "flex", gap: 16 }}>
            <button style={BP}
              onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-3px)"; (e.target as HTMLElement).style.boxShadow = "0 12px 32px rgba(181,242,61,0.5)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.transform = "none"; (e.target as HTMLElement).style.boxShadow = "none"; }}
            >Find a Ride</button>
            <button style={{ background: "transparent", color: "#f8f8f4", padding: "14px 32px", fontWeight: 500, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", border: "1px solid rgba(248,248,244,0.3)", cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#b5f23d"; (e.target as HTMLElement).style.color = "#b5f23d"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "rgba(248,248,244,0.3)"; (e.target as HTMLElement).style.color = "#f8f8f4"; }}
            >Explore Routes</button>
          </div>
        </div>

        <div className="ha5" style={{ position: "relative", zIndex: 2, marginTop: 80 }}>
          <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#6b6b5e", marginBottom: 16 }}>Trusted by cycling groups and riders everywhere</p>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {["STRAVA", "GARMIN", "WAHOO", "RAPHA", "KOMOOT", "ZWIFT"].map(b => (
              <span key={b} style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "rgba(248,248,244,0.4)", letterSpacing: 1, padding: "6px 14px", border: "1px solid rgba(248,248,244,0.1)", transition: "all .2s", cursor: "default" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = "#b5f23d"; (e.target as HTMLElement).style.borderColor = "rgba(181,242,61,0.3)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(248,248,244,0.4)"; (e.target as HTMLElement).style.borderColor = "rgba(248,248,244,0.1)"; }}
              >{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── TICKER ───────────────── */}
      <div style={{ background: "#b5f23d", padding: "14px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-flex", gap: 80, animation: "ticker 18s linear infinite" }}>
          {[...Array(2)].flatMap(() => ["Next Group Ride: Sat 15 Feb — Mountain Loop", "27 riders joining this weekend", "New routes added in your area", "Equipment deals for members"])
            .map((t, i) => (
              <span key={i} style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 3, color: "#0f0f0f", display: "flex", alignItems: "center", gap: 20 }}>
                {t} <span style={{ fontSize: 10 }}>◆</span>
              </span>
            ))}
        </div>
      </div>

      {/* ───────────────── COUNTDOWN ───────────── */}
      <div ref={r1} id="rides" style={{ background: "#0f0f0f", color: "#f8f8f4", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 60, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 13, letterSpacing: 2, color: "#b5f23d", marginBottom: 12 }}>SAT 15 FEB — 7:00 AM</p>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(36px,4vw,56px)", lineHeight: 1 }}>Coastal Morning Loop<br />Group Ride</h2>
            <p style={{ color: "#6b6b5e", fontSize: 15, marginTop: 10 }}>📍 Cliffside Car Park, Starting Point</p>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {(["d", "h", "m", "s"] as const).map((k, i) => (
              <div key={k} style={{ background: "rgba(181,242,61,0.08)", border: "1px solid rgba(181,242,61,0.2)", padding: "20px 24px", textAlign: "center", minWidth: 86 }}>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, color: "#b5f23d", lineHeight: 1, display: "block" }}>{time[k]}</span>
                <span style={{ fontSize: 10, letterSpacing: 2, color: "#6b6b5e", textTransform: "uppercase" }}>{["Days", "Hrs", "Min", "Sec"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───────────────── UPCOMING EVENTS ──────── */}
      <div ref={r2} style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px" }}>
        <p style={SL}>// upcoming</p>
        <h2 style={ST}>Upcoming Rides</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
          {events.map((ev, i) => (
            <div key={i} style={{ position: "relative", overflow: "hidden", cursor: "pointer", aspectRatio: "4/3" }}
              onMouseEnter={e => (e.currentTarget.querySelector("img") as HTMLElement).style.transform = "scale(1.08)"}
              onMouseLeave={e => (e.currentTarget.querySelector("img") as HTMLElement).style.transform = "scale(1)"}
            >
              <img src={ev.img} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s cubic-bezier(.25,.46,.45,.94)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,15,15,0.95) 0%,transparent 60%)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <span style={{ position: "absolute", top: 16, left: 16, background: "#b5f23d", color: "#0f0f0f", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "4px 10px" }}>{ev.tag}</span>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#b5f23d", marginBottom: 6 }}>{ev.date}</p>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: "#f8f8f4", lineHeight: 1.1 }}>{ev.title}</h3>
                <p style={{ fontSize: 12, color: "rgba(248,248,244,0.6)", marginTop: 4 }}>📍 {ev.loc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────── EQUIPMENT ────────────── */}
      <section ref={r3} id="equipment" style={{ background: "#e8e8e0", padding: "100px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={SL}>// gear up</p>
          <h2 style={ST}>Equipment Picks</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {equipment.map((eq, i) => (
              <div key={i} style={{ background: "#f8f8f4", padding: 24, cursor: "pointer", transition: "transform .2s,box-shadow .2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: "100%", aspectRatio: "1", background: "#e8e8e0", marginBottom: 16, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={eq.img} alt={eq.name} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                </div>
                <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#6b6b5e" }}>{eq.brand}</p>
                <p style={{ fontWeight: 700, fontSize: 15, margin: "4px 0" }}>{eq.name}</p>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, color: "#b5f23d", fontWeight: 700 }}>{eq.price}</p>
                <span style={{ display: "inline-block", marginTop: 8, background: "rgba(181,242,61,0.15)", color: "#4a7a00", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px" }}>{eq.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── ROUTES ───────────────── */}
      <section ref={r4} id="routes" style={{ background: "#0f0f0f", color: "#f8f8f4", padding: "100px 48px", textAlign: "center" }}>
        <p style={{ ...SL, display: "flex", justifyContent: "center" }}>// explore</p>
        <h2 style={{ ...ST, color: "#f8f8f4" }}>Discover New Routes<br />With Fellow Riders</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 1200, margin: "0 auto", textAlign: "left" }}>
          {routeCards.map((r, i) => (
            <div key={i} style={{ border: "1px solid rgba(255,255,255,0.08)", padding: 32, position: "relative", overflow: "hidden", transition: "border-color .2s,background .2s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(181,242,61,0.4)"; e.currentTarget.style.background = "rgba(181,242,61,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 80, color: "rgba(181,242,61,0.12)", position: "absolute", top: -10, right: 20, lineHeight: 1, pointerEvents: "none" }}>{r.num}</span>
              <div style={{ fontSize: 28, marginBottom: 16 }}>{r.icon}</div>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, marginBottom: 10 }}>{r.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(248,248,244,0.6)", lineHeight: 1.6 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── GETTING STARTED ──────── */}
      <section ref={r5} style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ ...SL, textAlign: "center" }}>// how it works</p>
          <h2 style={{ ...ST, textAlign: "center" }}>Getting Started<br />Is Simple</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>
            {[
              { n: "01", title: "Create your profile", desc: "Sign up in under 2 minutes. Tell us your riding style, ability, and what you're looking for." },
              { n: "02", title: "Find a group ride", desc: "Browse local rides filtered by pace, distance and date. RSVP with one click." },
              { n: "03", title: "Ride and connect", desc: "Meet your riding community, share routes, and track your progress together." },
            ].map((s, i) => (
              <div key={i} style={{ position: "relative", paddingLeft: 72 }}>
                <span style={{ position: "absolute", left: 0, top: -6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, color: "#b5f23d", lineHeight: 1, opacity: 0.6 }}>{s.n}</span>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#6b6b5e", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── TESTIMONIALS ─────────── */}
      <section ref={r6} style={{ background: "#b5f23d", padding: "100px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ ...SL, color: "#0f0f0f" }}>// real stories</p>
          <h2 style={{ ...ST, color: "#0f0f0f" }}>What Riders Say</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { quote: "I've found the most incredible riding mates. I would never have ridden those coastal routes solo. RideGrounds changed how I approach cycling.", name: "Sarah K.", role: "Road Cyclist, Brighton", avatar: "https://i.pravatar.cc/80?img=12" },
              { quote: "The equipment recommendations alone saved me hundreds. Plus I found a weekly group ride 5 minutes from my house. Absolute game changer.", name: "Tom A.", role: "Mountain Biker, Peak District", avatar: "https://i.pravatar.cc/80?img=33" },
            ].map((t, i) => (
              <div key={i} style={{ background: "#f8f8f4", padding: 32, clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))" }}>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: "#0f0f0f", fontStyle: "italic", marginBottom: 20 }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: "#6b6b5e" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── READY CTA ────────────── */}
      <section ref={r7} style={{ background: "#0f0f0f", color: "#f8f8f4", padding: "100px 48px", textAlign: "center" }}>
        <p style={{ ...SL, display: "flex", justifyContent: "center" }}>// join us</p>
        <h2 style={{ ...ST, color: "#f8f8f4", marginBottom: 20 }}>Ready to Ride<br />Together?</h2>
        <p style={{ color: "#6b6b5e", fontSize: 16, maxWidth: 480, margin: "0 auto 40px" }}>Join thousands of cyclists finding group rides, great routes, and real community near them.</p>
        <button style={{ ...BP, margin: "0 auto" }}
          onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-3px)"; (e.target as HTMLElement).style.boxShadow = "0 12px 32px rgba(181,242,61,0.5)"; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.transform = "none"; (e.target as HTMLElement).style.boxShadow = "none"; }}
        >Get Started Free</button>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 60 }}>
          {["STRAVA", "GARMIN", "WAHOO", "RAPHA", "KOMOOT"].map(b => (
            <span key={b} style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "rgba(248,248,244,0.3)", letterSpacing: 1 }}>{b}</span>
          ))}
        </div>
      </section>

      {/* ───────────────── FAQ ──────────────────── */}
      <section ref={r8} style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ ...SL, textAlign: "center" }}>// faq</p>
          <h2 style={{ ...ST, textAlign: "center" }}>Frequently Asked<br />Questions</h2>
          <div style={{ marginTop: 48 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: "1px solid #e8e8e0", padding: "24px 0", cursor: "pointer" }} onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>
                <div style={{ fontWeight: 600, fontSize: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {faq.q}
                  <span style={{ fontSize: 20, color: "#b5f23d", transition: "transform .2s", transform: faqOpen === i ? "rotate(45deg)" : "none" }}>+</span>
                </div>
                <div style={{ fontSize: 14, color: "#6b6b5e", lineHeight: 1.7, maxHeight: faqOpen === i ? 200 : 0, overflow: "hidden", transition: "max-height .3s ease,padding-top .3s ease", paddingTop: faqOpen === i ? 14 : 0 }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ color: "#6b6b5e", marginBottom: 16 }}>Still have questions?</p>
            <button style={{ background: "transparent", color: "#0f0f0f", padding: "12px 28px", fontWeight: 500, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", border: "1px solid rgba(0,0,0,0.25)", cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#b5f23d"; (e.target as HTMLElement).style.color = "#b5f23d"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "rgba(0,0,0,0.25)"; (e.target as HTMLElement).style.color = "#0f0f0f"; }}
            >Get in Touch</button>
          </div>
        </div>
      </section>

      {/* ───────────────── BLOG ─────────────────── */}
      <section ref={r9} id="blog" style={{ background: "#e8e8e0", padding: "100px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={SL}>// learn from the road</p>
          <h2 style={ST}>Latest Articles</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {blogs.map((b, i) => (
              <div key={i} style={{ background: "#f8f8f4", overflow: "hidden", cursor: "pointer", transition: "transform .2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; (e.currentTarget.querySelector("img") as HTMLElement).style.transform = "scale(1.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; (e.currentTarget.querySelector("img") as HTMLElement).style.transform = "scale(1)"; }}
              >
                <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                  <img src={b.img} alt={b.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }} />
                </div>
                <div style={{ padding: 24 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#b5f23d", marginBottom: 8 }}>{b.tag}</p>
                  <h3 style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.4, marginBottom: 12 }}>{b.title}</h3>
                  <div style={{ fontSize: 12, color: "#6b6b5e", display: "flex", gap: 16 }}>
                    <span>{b.date}</span><span>·</span><span>{b.read} read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CONTACT ──────────────── */}
      <section ref={r10} style={{ background: "#0f0f0f", color: "#f8f8f4", padding: "100px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={SL}>// get in touch</p>
          <h2 style={{ ...ST, color: "#f8f8f4" }}>Get in Touch</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40, marginTop: 60 }}>
            {[
              { icon: "📧", label: "Email", val: "hello@ridegrounds.com" },
              { icon: "📞", label: "Phone", val: "+44 20 7946 0321" },
              { icon: "📍", label: "Office", val: "42 Cycling Lane, London EC1" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                <div style={{ width: 48, height: 48, background: "rgba(181,242,61,0.12)", border: "1px solid rgba(181,242,61,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#6b6b5e", marginBottom: 6 }}>{c.label}</p>
                  <p style={{ fontSize: 15, color: "#f8f8f4" }}>{c.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── PHOTO GRID ───────────── */}
      <div ref={r11} style={{ background: "#0f0f0f", paddingBottom: 80 }}>
        <p style={{ textAlign: "center", fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#b5f23d", padding: "48px 0 24px" }}>// moments on the road</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
          {photos.map((src, i) => (
            <div key={i} style={{ overflow: "hidden", aspectRatio: "1" }}
              onMouseEnter={e => { (e.currentTarget.querySelector("img") as HTMLElement).style.transform = "scale(1.05)"; (e.currentTarget.querySelector("img") as HTMLElement).style.filter = "grayscale(0%) brightness(1.1)"; }}
              onMouseLeave={e => { (e.currentTarget.querySelector("img") as HTMLElement).style.transform = "scale(1)"; (e.currentTarget.querySelector("img") as HTMLElement).style.filter = "grayscale(20%)"; }}
            >
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s,filter .3s", filter: "grayscale(20%)" }} />
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer ref={r12} style={{ background: "#070707", color: "#f8f8f4", padding: "60px 48px 32px", borderTop: "1px solid rgba(181,242,61,0.1)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 60 }}>
          <div>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: 2, color: "#b5f23d", display: "block", marginBottom: 16 }}>RideGrounds</span>
            <p style={{ fontSize: 14, color: "rgba(248,248,244,0.5)", lineHeight: 1.65, maxWidth: 260 }}>The platform for cycling groups and riders who want to connect, explore, and grow together.</p>
          </div>
          {[
            { title: "Platform", links: ["Find Rides", "Create a Ride", "Routes", "Equipment"] },
            { title: "Community", links: ["Groups", "Leaderboard", "Ambassadors", "Blog"] },
            { title: "Company", links: ["About", "Careers", "Privacy", "Terms"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#b5f23d", marginBottom: 20 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" style={{ textDecoration: "none", fontSize: 14, color: "rgba(248,248,244,0.5)", transition: "color .2s" }}
                      onMouseEnter={e => (e.target as HTMLElement).style.color = "#f8f8f4"}
                      onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(248,248,244,0.5)"}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28 }}>
          <p style={{ fontSize: 12, color: "rgba(248,248,244,0.3)" }}>© 2025 RideGrounds Ltd. All rights reserved.</p>
          <div style={{ display: "flex", gap: 16 }}>
            {["𝕏", "in", "ig", "yt"].map(s => (
              <a key={s} href="#" style={{ width: 36, height: 36, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "rgba(248,248,244,0.5)", textDecoration: "none", transition: "all .2s" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#b5f23d"; (e.target as HTMLElement).style.color = "#b5f23d"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.target as HTMLElement).style.color = "rgba(248,248,244,0.5)"; }}
              >{s}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ───────────────── HERO IMAGE PANEL ─────── */}
      {showPanel ? (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, background: "rgba(15,15,15,0.96)", border: "1px solid rgba(181,242,61,0.3)", backdropFilter: "blur(16px)", padding: "18px 20px", width: 300, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#b5f23d", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>🖼 Hero Image</span>
            <span style={{ cursor: "pointer", opacity: 0.5 }} onClick={() => setShowPanel(false)}>✕</span>
          </div>
          <input value={imgInput} onChange={e => setImgInput(e.target.value)} onKeyDown={e => e.key === "Enter" && applyHeroImg()} placeholder="Paste image URL here..."
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#f8f8f4", padding: "10px 12px", fontSize: 13, outline: "none", marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={applyHeroImg} style={{ flex: 1, background: "#b5f23d", color: "#0f0f0f", border: "none", padding: 9, fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Apply</button>
            <button onClick={() => { setHeroImg("https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1800&q=80"); setImgInput(""); }}
              style={{ background: "transparent", color: "rgba(248,248,244,0.5)", border: "1px solid rgba(255,255,255,0.15)", padding: "9px 14px", fontSize: 12, cursor: "pointer" }}>Reset</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowPanel(true)} style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, background: "#b5f23d", color: "#0f0f0f", border: "none", width: 48, height: 48, fontSize: 20, cursor: "pointer", boxShadow: "0 8px 24px rgba(181,242,61,0.4)" }}>🖼</button>
      )}

    </div>
  );
}