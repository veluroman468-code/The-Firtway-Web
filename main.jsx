import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownRight, ArrowRight, Check, ChevronDown, Dumbbell, Flame,
  HeartPulse, Menu, MoveUpRight, ShieldCheck, Sparkles, Timer, Trophy,
  Users, X, Zap
} from "lucide-react";
import "./styles.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const phone = import.meta.env.VITE_FITWAY_PHONE || "";
const address = import.meta.env.VITE_FITWAY_ADDRESS || "";
const instagram = import.meta.env.VITE_FITWAY_INSTAGRAM || "";

const services = [
  { n: "01", icon: Dumbbell, title: "Strength training", copy: "Build real-world strength with smart programming, proper form and progress you can measure.", tag: "BUILD POWER" },
  { n: "02", icon: HeartPulse, title: "Personal training", copy: "One-to-one coaching that adapts to your experience, schedule and individual goals.", tag: "YOUR OWN COACH" },
  { n: "03", icon: Flame, title: "Fat-loss & conditioning", copy: "A sustainable mix of movement, conditioning and accountability to help you feel fitter.", tag: "MOVE BETTER" },
  { n: "04", icon: Users, title: "Group workouts", copy: "Bring the energy. Train with people who keep you showing up and pushing forward.", tag: "BETTER TOGETHER" }
];

const plans = [
  { name: "FITWAY START", desc: "A confident first step", features: ["Gym floor access", "Equipment orientation", "Goal-setting session"], featured: false },
  { name: "FITWAY PLUS", desc: "Structure and momentum", features: ["Everything in Start", "Trainer-led progress review", "Personalised workout guidance"], featured: true },
  { name: "FITWAY 1:1", desc: "Coaching built around you", features: ["Personal training sessions", "Individual progress tracking", "Flexible goal review"], featured: false }
];

function Logo({ light = false }) {
  return <a className={`brand ${light ? "brand-light" : ""}`} href="#home" aria-label="Fitway home">
    <img src="/fitway-wordmark.jpg" alt="Fitway" width="142" height="38" />
  </a>;
}

function LeadModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", goal: "Build strength", experience: "Getting started", time: "This week" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  useEffect(() => { if (open) { setStep(0); setStatus("idle"); setError(""); } }, [open]);
  if (!open) return null;
  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const submit = async () => {
    setError("");
    if (!form.name.trim() || form.phone.trim().length < 7) { setError("Please enter your name and a valid phone number."); return; }
    setStatus("sending");
    const payload = { name: form.name.trim(), phone: form.phone.trim(), goal: form.goal, experience: form.experience, joining_time: form.time, source: "Fitway website", created_at: new Date().toISOString() };
    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/fitway_enquiries`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Prefer: "return=minimal" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Could not save enquiry");
        setStatus("success");
      } catch {
        setError("We couldn't send this just now. Please try again or contact the gym directly.");
        setStatus("idle");
      }
    } else {
      // Safe preview mode: don't claim the enquiry was sent or stored.
      setStatus("preview");
    }
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="modal-close" onClick={onClose} aria-label="Close form"><X size={20}/></button>
      <div className="modal-kicker"><Sparkles size={15}/> YOUR FITWAY START</div>
      {status === "success" ? <div className="success-state"><div className="success-icon"><Check size={28}/></div><h2 id="modal-title">You're on your way.</h2><p>Your enquiry has been sent to Fitway. The team can follow up with you soon.</p><button className="btn btn-primary full" onClick={onClose}>Done <ArrowRight size={17}/></button></div>
      : status === "preview" ? <div className="success-state"><div className="success-icon"><Check size={28}/></div><h2 id="modal-title">Your form is ready.</h2><p>This preview isn't connected to a live enquiry inbox yet. Add the Supabase settings in <code>.env</code> and create the table using the setup guide before launch.</p><button className="btn btn-primary full" onClick={onClose}>Got it <ArrowRight size={17}/></button></div>
      : <><div className="modal-progress"><span style={{width: `${(step + 1) * 33.333}%`}} /></div>
        <p className="eyebrow">STEP {step + 1} / 3</p>
        <h2 id="modal-title">{step === 0 ? "Let's meet you." : step === 1 ? "What are you working towards?" : "Let's get you started."}</h2>
        <p className="modal-sub">{step === 0 ? "Leave your details and we'll help you find the right starting point." : step === 1 ? "A little context helps us make the first conversation useful." : "When would you like to begin?"}</p>
        {step === 0 ? <div className="form-fields">
          <label>Your name<input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Full name" autoFocus /></label>
          <label>Phone number<input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 ..." inputMode="tel" /></label>
        </div> : step === 1 ? <div className="choice-list">
          <p className="field-title">Your main goal</p>{["Build strength", "Improve fitness", "Fat loss", "Build muscle", "Feel healthier"].map(v => <button key={v} className={`choice ${form.goal === v ? "selected" : ""}`} onClick={() => update("goal", v)}>{v}{form.goal === v && <Check size={16}/>}</button>)}
          <p className="field-title spaced">Training experience</p>{["Getting started", "Some experience", "Experienced"].map(v => <button key={v} className={`choice ${form.experience === v ? "selected" : ""}`} onClick={() => update("experience", v)}>{v}{form.experience === v && <Check size={16}/>}</button>)}
        </div> : <div className="choice-list">{["As soon as possible", "This week", "Just exploring"].map(v => <button key={v} className={`choice ${form.time === v ? "selected" : ""}`} onClick={() => update("time", v)}>{v}{form.time === v && <Check size={16}/>}</button>)}<p className="privacy-note"><ShieldCheck size={15}/> Your details are used to respond to this enquiry.</p></div>}
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">{step > 0 && <button className="btn btn-quiet" onClick={() => setStep(s => s - 1)}>Back</button>}{step < 2 ? <button className="btn btn-primary" onClick={() => { if (step === 0 && (!form.name.trim() || form.phone.trim().length < 7)) setError("Please enter your name and a valid phone number."); else { setError(""); setStep(s => s + 1); } }}>Continue <ArrowRight size={17}/></button> : <button className="btn btn-primary" disabled={status === "sending"} onClick={submit}>{status === "sending" ? "Sending..." : "Send enquiry"} <ArrowRight size={17}/></button>}</div>
      </>}
    </section>
  </div>;
}

function App() {
  const [modal, setModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 24); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  const nav = [{ label: "Our approach", href: "#approach" }, { label: "Training", href: "#training" }, { label: "Membership", href: "#membership" }, { label: "FAQs", href: "#faq" }];
  const faqs = [
    ["I'm new to the gym. Can I still join?", "Absolutely. You can start at your own pace. Tell us you're new when you enquire and the team can help you understand the equipment and choose a sensible first step."],
    ["Do you offer personal training?", "Personal training is included as an enquiry option. Share your goal and the Fitway team can explain current coaching availability and packages."],
    ["What should I bring for my first session?", "Comfortable training clothes, supportive footwear, a water bottle and a willingness to learn are a good start. Ask the team if you need any location-specific guidance."],
    ["How much does membership cost?", "Membership rates can vary by plan and duration. Send an enquiry and ask the Fitway team for current pricing before you decide."]
  ];
  return <>
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-wrap"><Logo/>
        <nav className={mobileOpen ? "nav-links mobile-visible" : "nav-links"}>{nav.map(n => <a key={n.href} href={n.href} onClick={() => setMobileOpen(false)}>{n.label}</a>)}</nav>
        <button className="btn btn-small btn-outline header-cta" onClick={() => setModal(true)}>Start your journey <ArrowRight size={16}/></button>
        <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileOpen(v => !v)}>{mobileOpen ? <X/> : <Menu/>}</button>
      </div>
    </header>

    <main id="home">
      <section className="hero section-shell">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="live-dot"/> YOUR NEXT CHAPTER STARTS HERE</div>
          <h1>Stronger<br/>starts <span>here.</span></h1>
          <p className="hero-intro">More than a workout. A place to build strength, find your rhythm, and become a little better every day.</p>
          <div className="hero-actions"><button className="btn btn-primary btn-large" onClick={() => setModal(true)}>Find your fit <ArrowRight size={18}/></button><a className="text-link" href="#approach">Explore Fitway <ArrowDownRight size={17}/></a></div>
          <div className="hero-proof"><div className="proof-avatars"><span>F</span><span>+</span><span>W</span></div><div><strong>Your goals. Your pace.</strong><small>Coaching that meets you where you are.</small></div></div>
        </div>
        <div className="hero-visual" onMouseMove={e => {const r=e.currentTarget.getBoundingClientRect(); setTilt({x:((e.clientY-r.top)/r.height-.5)*-7,y:((e.clientX-r.left)/r.width-.5)*8});}} onMouseLeave={() => setTilt({x:0,y:0})}>
          <div className="hero-image" style={{transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`}} role="img" aria-label="Athlete training in a modern gym">
            <div className="image-overlay"></div><div className="hero-image-top"><span className="glass-label"><span className="live-dot"/> TRAIN WITH PURPOSE</span><span className="hero-index">FW / 01</span></div>
            <div className="hero-image-bottom"><p>CONSISTENCY<br/><em>changes everything.</em></p><span className="round-arrow"><MoveUpRight size={21}/></span></div>
          </div>
          <div className="floating-note note-top"><span className="note-icon"><Trophy size={17}/></span><span><strong>Progress over perfection</strong><small>Every rep counts</small></span></div>
          <div className="floating-note note-bottom"><div className="pulse-ring"><HeartPulse size={18}/></div><span><strong>Move with purpose</strong><small>Make it your routine</small></span></div>
          <div className="visual-orbit"></div>
        </div>
        <div className="hero-foot"><span>01 — TRAIN WITH INTENTION</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <section className="ticker" aria-label="Fitway values"><div className="ticker-track">{Array.from({length:2}).map((_,i)=><div className="ticker-set" key={i}>{["SHOW UP","BUILD STRENGTH","FIND YOUR FLOW","KEEP GOING"].map(t=><span key={t}>{t}<i>✳</i></span>)}</div>)}</div></section>

      <section className="intro section-shell" id="approach">
        <div className="section-label"><span>01</span> THE FITWAY APPROACH</div>
        <div className="intro-grid"><h2>Fitness that fits<br/>the <span>real you.</span></h2><div className="intro-copy"><p>There's no one-size-fits-all way to get stronger. Your starting point is yours. Your goals are yours. We're here to help you make a plan that works in real life—and keep showing up for it.</p><button className="inline-link" onClick={() => setModal(true)}>Let's find your starting point <ArrowRight size={17}/></button></div></div>
        <div className="values-grid">
          <article className="value-card"><span className="value-number">01 /</span><div className="value-icon"><ShieldCheck/></div><h3>Built around you</h3><p>Training should fit your goals, experience and everyday life—not the other way around.</p></article>
          <article className="value-card"><span className="value-number">02 /</span><div className="value-icon"><Zap/></div><h3>Progress with purpose</h3><p>Simple structure and steady effort help turn good intentions into lasting habits.</p></article>
          <article className="value-card"><span className="value-number">03 /</span><div className="value-icon"><Users/></div><h3>Better together</h3><p>Get guidance, encouragement and a place where every step forward matters.</p></article>
        </div>
      </section>

      <section className="training-section" id="training"><div className="section-shell">
        <div className="section-label light-label"><span>02</span> FIND YOUR WAY</div><div className="section-heading-row"><h2>One goal.<br/><span>Many ways forward.</span></h2><p>Choose the kind of support that suits you. Not sure yet? We'll help you figure it out.</p></div>
        <div className="service-grid">{services.map(s=><article className="service-card" key={s.n}><div className="service-top"><span>{s.n} / 04</span><s.icon size={22}/></div><div className="service-content"><span className="service-tag">{s.tag}</span><h3>{s.title}</h3><p>{s.copy}</p><button className="service-arrow" aria-label={`Enquire about ${s.title}`} onClick={() => setModal(true)}><ArrowRight size={18}/></button></div></article>)}</div>
      </div></section>

      <section className="quote-section section-shell"><div className="quote-mark">“</div><blockquote>You don't need to be ready.<br/>You just need to <span>begin.</span></blockquote><div className="quote-bottom"><span>THE FITWAY MINDSET</span><button className="btn btn-dark" onClick={() => setModal(true)}>Take the first step <ArrowRight size={17}/></button></div></section>

      <section className="membership section-shell" id="membership"><div className="section-label"><span>03</span> YOUR MEMBERSHIP</div><div className="section-heading-row membership-heading"><h2>Find your <span>fit.</span></h2><p>Start with what you need today. Build from there. Ask our team for current rates and availability.</p></div><div className="plan-grid">{plans.map(p=><article className={`plan-card ${p.featured ? "plan-featured" : ""}`} key={p.name}>{p.featured && <span className="popular-label">A GREAT PLACE TO START</span>}<span className="plan-name">{p.name}</span><h3>{p.desc}</h3><div className="plan-price">Let's talk<span> / enquire for rates</span></div><div className="plan-divider"></div><ul>{p.features.map(f=><li key={f}><Check size={16}/>{f}</li>)}</ul><button className={`btn ${p.featured ? "btn-primary" : "btn-outline"}`} onClick={() => setModal(true)}>Ask about this plan <ArrowRight size={16}/></button></article>)}</div><p className="plan-disclaimer">Membership prices, access hours and inclusions should be confirmed directly with Fitway.</p></section>

      <section className="faq-section" id="faq"><div className="section-shell faq-grid"><div><div className="section-label"><span>04</span> GOOD TO KNOW</div><h2>A few things<br/>you might <span>wonder.</span></h2><p className="faq-lead">Still have a question? Send us an enquiry and we'll help you find the answer.</p><button className="btn btn-primary" onClick={() => setModal(true)}>Talk to Fitway <ArrowRight size={17}/></button></div><div className="faq-list">{faqs.map(([q,a],i)=><article className={`faq-item ${faqOpen===i?"faq-active":""}`} key={q}><button onClick={() => setFaqOpen(faqOpen===i?-1:i)} aria-expanded={faqOpen===i}><span>{q}</span><ChevronDown size={19}/></button>{faqOpen===i&&<p>{a}</p>}</article>)}</div></div></section>

      <section className="final-cta section-shell"><div className="cta-glow"></div><div className="section-label light-label"><span>05</span> YOUR MOVE</div><h2>Make today<br/>your <span>starting line.</span></h2><p>One conversation can turn “someday” into a plan.</p><button className="btn btn-primary btn-large" onClick={() => setModal(true)}>Start your Fitway journey <ArrowRight size={18}/></button><div className="cta-stamp"><span>FITWAY</span><small>MOVE FORWARD</small></div></section>
    </main>

    <footer className="site-footer"><div className="footer-main"><div><Logo light/><p className="footer-manifesto">Show up for yourself.<br/>We'll help you find your way.</p></div><div className="footer-links"><div><span className="footer-title">EXPLORE</span>{nav.map(n=><a key={n.href} href={n.href}>{n.label}</a>)}</div><div><span className="footer-title">CONNECT</span>{phone ? <a href={`tel:${phone}`}>Call Fitway</a> : <span className="footer-pending">Phone number to be added</span>}{instagram ? <a href={instagram} target="_blank" rel="noreferrer">Instagram ↗</a> : <span className="footer-pending">Social link to be added</span>}{address && <span>{address}</span>}</div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Fitway. All rights reserved.</span><span>BUILT TO HELP YOU MOVE FORWARD.</span><a href="#home">BACK TO TOP ↑</a></div></footer>
    <LeadModal open={modal} onClose={() => setModal(false)}/>
  </>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
