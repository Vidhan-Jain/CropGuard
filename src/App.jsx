import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const getUser = () => {
  try { return JSON.parse(localStorage.getItem("cropguard-user") || "null"); } catch { return null; }
};
const saveUser = (user) => localStorage.setItem("cropguard-user", JSON.stringify(user));
const readHistory = () => {
  try { return JSON.parse(localStorage.getItem("cropguard-history") || "[]"); } catch { return []; }
};

function Brand({ compact = false }) {
  return <Link to="/dashboard" className="brand"><span className="brand-mark">✿</span><span>Crop<span className="brand-light">Guard</span>{!compact && <small>SMART CROP CARE</small>}</span></Link>;
}

function App() {
  const [user, setUser] = useState(getUser);
  const [history, setHistory] = useState(readHistory);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { localStorage.setItem("cropguard-history", JSON.stringify(history)); }, [history]);
  const login = (name, email) => {
    const next = { name: name.trim() || "Farmer", email: email.trim() };
    saveUser(next); setUser(next); navigate("/dashboard");
  };
  const logout = () => { localStorage.removeItem("cropguard-user"); setUser(null); navigate("/login"); };
  const addRecord = (record) => setHistory((old) => [record, ...old].slice(0, 20));

  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} />} />
    <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    <Route path="/*" element={user ? <Shell user={user} logout={logout} location={location}><Routes>
      <Route path="dashboard" element={<Dashboard user={user} history={history} />} />
      <Route path="detect" element={<Detect onSave={addRecord} />} />
      <Route path="results" element={<Results history={history} />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes></Shell> : <Navigate to="/login" replace />} />
  </Routes>;
}

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const submit = (e) => { e.preventDefault(); onLogin(name || email.split("@")[0] || "Farmer", email); };
  return <main className="login-page">
    <section className="login-visual">
      <div className="visual-top"><Brand /></div>
      <div className="visual-copy"><span className="eyebrow light">GROW SMARTER. HARVEST BETTER.</span><h1>Healthy crops.<br/><em>Stronger</em> tomorrow.</h1><p>Make confident crop-care decisions with a smarter way to identify plant diseases and explore treatment guidance.</p>
        <div className="visual-points"><span>✓ Early disease awareness</span><span>✓ Practical crop-care guidance</span><span>✓ Your farm insights in one place</span></div>
      </div>
      <div className="visual-bottom"><span>✳ Built for the people who grow our world.</span><span>01 — 04</span></div>
    </section>
    <section className="login-form-side">
      <div className="mobile-brand"><Brand /></div>
      <div className="login-card">
        <div className="form-kicker">WELCOME TO CROPGUARD</div>
        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="muted">{mode === "login" ? "Sign in to continue to your farmer dashboard." : "Start managing your crop health with confidence."}</p>
        <form onSubmit={submit}>
          {mode === "signup" && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" required /></label>}
          <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required /></label>
          <label>Password<div className="password-wrap"><input type={show ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required minLength="4"/><button type="button" className="show-pass" onClick={()=>setShow(!show)}>{show ? "Hide" : "Show"}</button></div></label>
          <button className="btn primary full" type="submit">{mode === "login" ? "Sign in to dashboard" : "Create account"} <span>→</span></button>
        </form>
        <div className="form-switch">{mode === "login" ? "New to CropGuard?" : "Already have an account?"} <button onClick={()=>setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Create account" : "Sign in"}</button></div>
        <div className="demo-note"><span>ⓘ</span> Frontend demo: any valid email and password will let you enter.</div>
      </div>
      <div className="login-footer">© 2026 CropGuard · Smart agriculture for everyone</div>
    </section>
  </main>;
}

function Shell({ user, logout, children }) {
  const location = useLocation();
  const title = location.pathname.includes("detect") ? "Disease detection" : location.pathname.includes("results") ? "My reports" : "Overview";
  return <div className="app-shell">
    <aside className="sidebar"><Brand /><div className="side-label">WORKSPACE</div><nav>
      <NavLink to="/dashboard"><span>▦</span> Dashboard</NavLink>
      <NavLink to="/detect"><span>⌕</span> Detect disease</NavLink>
      <NavLink to="/results"><span>▤</span> My reports</NavLink>
    </nav>
    <div className="sidebar-help"><div className="help-icon">✳</div><b>Need a hand?</b><p>Explore the detection workflow and learn how to care for your crops.</p><NavLink to="/detect">Start detection →</NavLink></div>
    <div className="side-user"><div className="avatar">{(user.name || "F")[0].toUpperCase()}</div><div className="user-info"><b>{user.name}</b><small>Farmer account</small></div><button className="logout" onClick={logout} title="Sign out">↗</button></div>
    </aside>
    <main className="main-area"><header className="topbar"><div className="mobile-brand"><Brand compact /></div><div className="breadcrumb">Workspace <span>/</span> {title}</div><div className="top-right"><span className="status-dot"></span><span>Demo workspace</span><div className="avatar small">{(user.name || "F")[0].toUpperCase()}</div></div></header>{children}</main>
  </div>;
}

function PageHeading({ eyebrow, title, subtitle, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

function Dashboard({ user, history }) {
  const latest = history[0];
  return <div className="content">
    <PageHeading eyebrow="TUESDAY, NOVEMBER 17, 2026" title={`Good morning, ${user.name.split(" ")[0]} 👋`} subtitle="Here's what's happening with your crop health today." action={<Link className="btn primary" to="/detect">＋ New detection</Link>} />
    <section className="welcome-banner"><div><span className="banner-tag">YOUR FARM, IN FOCUS</span><h2>Every healthy harvest<br/>starts with an early check.</h2><p>Upload a clear photo of a crop leaf to explore a sample disease assessment and care guidance.</p><Link to="/detect" className="banner-link">Check crop health <span>→</span></Link></div><div className="banner-art"><div className="sun"></div><div className="plant plant-one">♣</div><div className="plant plant-two">♣</div><div className="field-lines"></div></div></section>
    <div className="section-title"><div><h3>Your workspace</h3><p>Quick access to your crop-care tools</p></div><span className="subtle-label">OVERVIEW</span></div>
    <div className="action-grid">
      <Link to="/detect" className="action-card"><div className="action-icon green">⌕</div><div><h4>Detect a disease</h4><p>Upload a leaf or crop image for a sample assessment.</p></div><span className="card-arrow">↗</span></Link>
      <Link to="/results" className="action-card"><div className="action-icon gold">▤</div><div><h4>View my reports</h4><p>Review your saved detection results and guidance.</p></div><span className="card-arrow">↗</span></Link>
      <div className="action-card info-card"><div className="action-icon blue">✳</div><div><h4>Crop-care tips</h4><p>Use clean images and check both sides of affected leaves.</p></div></div>
    </div>
    <div className="section-title history-title"><div><h3>Recent activity</h3><p>Your latest crop health checks</p></div><Link to="/results" className="text-link">View all reports →</Link></div>
    {latest ? <div className="recent-row"><div className="recent-thumb">🌿</div><div className="recent-main"><b>{latest.disease}</b><small>{latest.crop} · {latest.date}</small></div><span className="pill warning">{latest.severity} severity</span><Link to="/results" className="row-arrow">→</Link></div> : <div className="empty-state compact-empty"><div className="empty-icon">⌕</div><b>No detections yet</b><p>Your saved crop checks will appear here.</p><Link to="/detect" className="text-link">Start your first detection →</Link></div>}
    <div className="demo-disclaimer">ⓘ <span><b>Demo mode:</b> This interface demonstrates the intended workflow. It does not run a trained AI model or provide verified pesticide prescriptions.</span></div>
  </div>;
}

function Detect({ onSave }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [crop, setCrop] = useState("Tomato");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(null);
  const [drag, setDrag] = useState(false);
  const navigate = useNavigate();

  const acceptFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { alert("Please select an image file."); return; }
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null);
  };
  const analyze = () => {
    if (!file) return;
    const sample = crop === "Tomato"
      ? { disease: "Early blight (sample result)", severity: "Moderate", confidence: "92%", description: "Early blight is a common fungal disease that can cause dark, target-like spots on older leaves.", treatment: "Remove badly affected leaves, avoid overhead watering, improve airflow and monitor new growth.", pesticide: "Copper-based fungicide (example category)", prevention: "Rotate crops, keep foliage dry and remove plant debris." }
      : crop === "Wheat"
      ? { disease: "Leaf rust (sample result)", severity: "Low", confidence: "89%", description: "Leaf rust can appear as orange-brown pustules on leaf surfaces and may affect plant vigour.", treatment: "Monitor spread, remove volunteer host plants where practical and seek local agronomy advice.", pesticide: "Wheat-appropriate registered fungicide (example category)", prevention: "Use resistant varieties and follow local crop advisories." }
      : { disease: "Leaf spot (sample result)", severity: "Moderate", confidence: "87%", description: "Leaf spot symptoms may include small discoloured lesions. Several causes can look similar.", treatment: "Remove heavily affected foliage, avoid wetting leaves and confirm the cause before treatment.", pesticide: "Crop-specific registered treatment only after diagnosis", prevention: "Use clean planting material and maintain good field sanitation." };
    const record = { ...sample, crop, date: new Date().toLocaleDateString("en-IN"), fileName: file.name, notes };
    setResult(record); onSave(record);
  };
  return <div className="content">
    <PageHeading eyebrow="CROP HEALTH TOOL" title="Detect a crop disease" subtitle="Upload a clear image of an affected leaf to explore the detection workflow." action={<Link to="/results" className="btn secondary">View reports ↗</Link>} />
    <div className="detect-layout">
      <section className="panel upload-panel"><div className="panel-head"><div><h3>Upload crop image</h3><p>Choose a photo from your device</p></div><span className="step-count">STEP 01</span></div>
        <label className={`upload-zone ${drag ? "dragging" : ""}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);acceptFile(e.dataTransfer.files[0]);}}>
          {preview ? <div className="preview-wrap"><img src={preview} alt="Selected crop preview"/><span className="replace-hint">Click to replace image</span></div> : <><div className="upload-icon">↑</div><b>Drop your crop image here</b><span>or <u>browse files</u> from your device</span><small>JPG, PNG or WEBP · Maximum 10 MB</small></>}
          <input type="file" accept="image/*" onChange={e=>acceptFile(e.target.files[0])} hidden />
        </label>
        {file && <div className="file-chip"><span>▧</span><div><b>{file.name}</b><small>{(file.size/1024/1024).toFixed(2)} MB</small></div><button onClick={()=>{setFile(null);setPreview("");setResult(null);}}>✕</button></div>}
        <div className="field-grid"><label>Crop type<select value={crop} onChange={e=>setCrop(e.target.value)}><option>Tomato</option><option>Wheat</option><option>Rice</option><option>Potato</option><option>Cotton</option><option>Maize</option><option>Other crop</option></select></label><label>Additional notes <span className="optional">(optional)</span><input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="e.g. yellow spots on older leaves"/></label></div>
        <button className="btn primary full analyze-btn" disabled={!file} onClick={analyze}>Run sample analysis <span>→</span></button>
        <p className="privacy-note">▣ Your image stays in this browser demo and is not sent to a server.</p>
      </section>
      <aside className="panel tips-panel"><div className="tips-icon">✳</div><h3>Tips for a better image</h3><p>Good photos help make a more useful assessment.</p><ul><li><span>✓</span> Use natural daylight</li><li><span>✓</span> Focus on the affected leaf</li><li><span>✓</span> Keep the camera steady</li><li><span>✓</span> Avoid blurry or dark photos</li><li><span>✓</span> Include the whole leaf if possible</li></ul><div className="tips-bottom"><b>Not sure what to photograph?</b><p>Capture both a close-up of the symptoms and a wider view of the plant.</p></div></aside>
    </div>
    {result && <section className="inline-result"><div><span className="success-mark">✓</span><div><b>Sample assessment generated</b><p>{result.disease} · {result.severity} severity · {result.confidence} demo confidence</p></div></div><button className="btn primary" onClick={()=>navigate("/results")}>View result <span>→</span></button></section>}
    <div className="demo-disclaimer">ⓘ <span><b>Important:</b> The analysis shown is simulated sample content selected for demonstration. It is not an AI prediction or an agricultural recommendation.</span></div>
  </div>;
}

function Results({ history }) {
  const [selected, setSelected] = useState(0);
  const current = history[selected];
  return <div className="content">
    <PageHeading eyebrow="YOUR CROP HEALTH JOURNAL" title="Detection reports" subtitle="Review your saved sample assessments and explore crop-care information." action={<Link to="/detect" className="btn primary">＋ New detection</Link>} />
    {!history.length ? <div className="empty-state reports-empty"><div className="empty-icon">▤</div><h3>Your reports will live here</h3><p>Once you run a sample detection, the result and crop-care guidance will be saved in this browser.</p><Link to="/detect" className="btn primary">Start a detection →</Link></div> :
      <div className="reports-layout"><aside className="panel report-list"><div className="panel-head"><div><h3>Saved assessments</h3><p>{history.length} report{history.length===1?"":"s"} in this browser</p></div></div>{history.map((item,i)=><button key={i} className={`report-item ${selected===i?"selected":""}`} onClick={()=>setSelected(i)}><span className="report-leaf">🌿</span><span className="report-item-text"><b>{item.crop} · {item.disease.split(" (")[0]}</b><small>{item.date}</small></span><span className="report-chevron">›</span></button>)}</aside>
      <section className="panel result-detail"><div className="result-top"><div><span className="eyebrow">SAMPLE ASSESSMENT</span><h2>{current.disease}</h2><p>{current.crop} · {current.date}</p></div><span className="pill warning">{current.severity} severity</span></div>
        <div className="confidence-box"><div><span>DEMO CONFIDENCE</span><b>{current.confidence}</b></div><div className="progress"><span style={{width:current.confidence}}></span></div><small>Illustrative value only — not generated by an AI model.</small></div>
        <div className="result-section"><h3>About this condition</h3><p>{current.description}</p></div>
        <div className="result-section"><h3>Suggested next steps</h3><p>{current.treatment}</p></div>
        <div className="pesticide-card"><div className="pesticide-head"><span>✳</span><div><small>PESTICIDE ASSISTANCE · EXAMPLE</small><h3>{current.pesticide}</h3></div></div><p>Confirm the disease and crop label with a qualified local agricultural officer before using any plant-protection product. Always follow the registered label, dosage, protective equipment and pre-harvest interval.</p></div>
        <div className="result-section"><h3>Prevention tips</h3><p>{current.prevention}</p></div>
        {current.notes && <div className="result-section"><h3>Your notes</h3><p>{current.notes}</p></div>}
        <div className="result-footnote">This is a frontend demonstration using sample content. It is not a verified diagnosis or pesticide prescription.</div>
      </section></div>}
  </div>;
}

export default App;
