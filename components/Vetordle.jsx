'use client';

import { useState, useEffect, useRef } from 'react';

// ─── DIAGNOSES (client-side copy for autocomplete) ──────────────────────────
const DIAGNOSES = [
  "Hypothyroidism","Hyperthyroidism","Diabetes mellitus","Diabetic ketoacidosis",
  "Hyperadrenocorticism","Hypoadrenocorticism","Primary hyperparathyroidism",
  "Hypoparathyroidism","Insulinoma","Phaeochromocytoma","Diabetes insipidus","Acromegaly",
  "Parvoviral enteritis","Acute pancreatitis","Chronic pancreatitis",
  "Exocrine pancreatic insufficiency","Inflammatory bowel disease",
  "Protein-losing enteropathy","Gastric dilatation-volvulus","Intestinal foreign body",
  "Intussusception","Megaesophagus","Gastric ulceration","Haemorrhagic gastroenteritis",
  "Giardiasis","Anal sacculitis","Perianal fistula","Intestinal lymphoma","Colitis",
  "Oesophageal stricture","Campylobacteriosis","Tritrichomonas infection",
  "Hepatic lipidosis","Portosystemic shunt","Copper-associated hepatopathy",
  "Chronic hepatitis","Cholangitis","Cholangiohepatitis","Hepatic neoplasia",
  "Gallbladder mucocoele","Biliary obstruction","Hepatic encephalopathy",
  "Chronic kidney disease","Acute kidney injury","Pyelonephritis",
  "Glomerulonephritis","Protein-losing nephropathy","Feline lower urinary tract disease",
  "Calcium oxalate urolithiasis","Struvite urolithiasis","Uroabdomen",
  "Urethral obstruction","Renal dysplasia","Polycystic kidney disease",
  "Dilated cardiomyopathy","Hypertrophic cardiomyopathy","Restrictive cardiomyopathy",
  "Mitral valve disease","Tricuspid valve dysplasia","Pericardial effusion",
  "Cardiac tamponade","Congestive heart failure","Heartworm disease",
  "Aortic stenosis","Pulmonic stenosis","Ventricular septal defect",
  "Arrhythmogenic right ventricular cardiomyopathy","Atrial fibrillation",
  "Sick sinus syndrome","Taurine-deficient cardiomyopathy",
  "Bacterial pneumonia","Aspiration pneumonia","Feline asthma","Chronic bronchitis",
  "Tracheal collapse","Brachycephalic obstructive airway syndrome","Pleural effusion",
  "Chylothorax","Pyothorax","Pneumothorax","Pulmonary hypertension",
  "Pulmonary thromboembolism","Laryngeal paralysis","Nasopharyngeal polyp",
  "Nasal tumour","Angiostrongylus infection",
  "Intervertebral disc disease","Degenerative myelopathy","Fibrocartilaginous embolism",
  "Atlantoaxial instability","Wobbler syndrome","Idiopathic epilepsy",
  "Structural epilepsy","Meningoencephalitis of unknown origin",
  "Granulomatous meningoencephalomyelitis","Feline ischaemic encephalopathy",
  "Peripheral vestibular syndrome","Central vestibular syndrome",
  "Myasthenia gravis","Polymyositis","Trigeminal neuritis","Facial nerve paralysis",
  "Hydrocephalus","Cerebellar abiotrophy",
  "Atopic dermatitis","Food-responsive dermatosis","Flea allergy dermatitis",
  "Generalised demodicosis","Localised demodicosis","Sarcoptic mange","Cheyletiellosis",
  "Dermatophytosis","Pemphigus foliaceus","Pemphigus vulgaris",
  "Discoid lupus erythematosus","Systemic lupus erythematosus","Sebaceous adenitis",
  "Alopecia X","Calcinosis cutis","Superficial pyoderma","Deep pyoderma",
  "Malassezia dermatitis","Cutaneous lymphoma","Skin fold pyoderma",
  "Hip dysplasia","Cranial cruciate ligament rupture","Patellar luxation",
  "Elbow dysplasia","Osteochondritis dissecans","Hypertrophic osteodystrophy",
  "Panosteitis","Legg-Calvé-Perthes disease","Septic arthritis",
  "Immune-mediated polyarthritis","Osteomyelitis","Masticatory muscle myositis",
  "Bicipital tenosynovitis","Osteosarcoma",
  "Corneal ulceration","Corneal sequestrum","Anterior uveitis","Glaucoma",
  "Retinal detachment","Lens luxation","Keratoconjunctivitis sicca","Entropion",
  "Ectropion","Prolapsed nictitans gland","Cataracts","Progressive retinal atrophy",
  "Feline herpesvirus keratitis","Iris melanosis",
  "Immune-mediated haemolytic anaemia","Immune-mediated thrombocytopenia",
  "Evans syndrome","Iron deficiency anaemia","Multicentric lymphoma",
  "Alimentary lymphoma","Mediastinal lymphoma","Mast cell tumour",
  "Splenic haemangiosarcoma","Hepatic haemangiosarcoma","Fibrosarcoma",
  "Oral melanoma","Mammary carcinoma","Thyroid carcinoma","Histiocytic sarcoma",
  "Thymoma","Multiple myeloma","Transitional cell carcinoma",
  "Pyometra","Benign prostatic hyperplasia","Prostatic abscess","Orchitis",
  "Cryptorchidism","Dystocia","Mastitis","Vaginitis","Ovarian remnant syndrome",
  "Testicular tumour",
  "Feline infectious peritonitis","Feline leukaemia virus","Feline immunodeficiency virus",
  "Canine distemper","Leptospirosis","Toxoplasmosis","Neosporosis","Blastomycosis",
  "Histoplasmosis","Aspergillosis","Cryptococcosis","Babesiosis","Ehrlichiosis",
  "Rocky Mountain spotted fever","Leishmaniosis",
  "Xylitol toxicity","NSAID toxicity","Paracetamol toxicity","Permethrin toxicity",
  "Lily toxicity","Grape and raisin toxicity","Zinc toxicity",
  "Anticoagulant rodenticide toxicity","Ethylene glycol toxicity","Chocolate toxicity",
  "Metaldehyde toxicity","Organophosphate toxicity","Sago palm toxicity",
  "Hypercalcaemia","Hypocalcaemia","Hypokalaemia","Hyperkalaemia","Hyponatraemia",
  "Uraemic encephalopathy","Nutritional secondary hyperparathyroidism",
].sort();

const MAX_GUESSES = 6;
const START_DATE = new Date('2026-05-17T00:00:00Z');

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getDateKey() { return new Date().toISOString().split('T')[0]; }

function getDayNumber() {
  return Math.floor((new Date() - START_DATE) / 864e5) + 1;
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

// Cookie helpers
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    try { return JSON.parse(decodeURIComponent(parts.pop().split(';').shift())); }
    catch { return null; }
  }
  return null;
}

function setCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires};path=/;SameSite=Lax`;
}

// ─── STATS ───────────────────────────────────────────────────────────────────
const EMPTY_STATS = {
  gamesPlayed: 0, wins: 0, totalGuesses: 0,
  currentStreak: 0, longestStreak: 0, lastPlayedDate: null,
  guessDistribution: { '1':0,'2':0,'3':0,'4':0,'5':0,'6':0 }
};

function loadStats() {
  return getCookie('vetordle_stats') || { ...EMPTY_STATS, guessDistribution: { ...EMPTY_STATS.guessDistribution } };
}

function computeUpdatedStats(stats, won, guessCount) {
  const today = new Date().toISOString().split('T')[0]; // UTC date
  if (stats.lastPlayedDate === today) return stats;
  const s = { ...stats, guessDistribution: { ...stats.guessDistribution } };
  s.gamesPlayed++;
  s.totalGuesses += guessCount;
  s.lastPlayedDate = today;
  if (won) {
    s.wins++;
    s.guessDistribution[String(guessCount)] = (s.guessDistribution[String(guessCount)] || 0) + 1;
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const isConsecutive = stats.lastPlayedDate === yesterdayStr;
    s.currentStreak = (isConsecutive || stats.currentStreak === 0) ? stats.currentStreak + 1 : 1;
    s.longestStreak = Math.max(s.longestStreak, s.currentStreak);
  } else {
    s.currentStreak = 0;
  }
  return s;
}

function getWinPct(stats) {
  return stats.gamesPlayed === 0 ? 0 : Math.round((stats.wins / stats.gamesPlayed) * 100);
}

// ─── SHARE ───────────────────────────────────────────────────────────────────
function buildShareText(moves, won, dayNum, dateStr) {
  const emojis = Array.from({ length: MAX_GUESSES }, (_, i) => {
    const m = moves[i];
    if (!m) return '⬛';
    if (m.result === 'correct') return '🟩';
    return '🟥';
  }).join(' ');
  const score = won ? `${moves.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Vetordle #${dayNum} — ${formatDate(dateStr)}\n🐾 ${emojis}\n${score}\n\nvetordle.com`;
}

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg:'#F2F6F8', card:'#ffffff', border:'#C8D8E4',
  text:'#1C3A52', muted:'#6A9BB0',
  accent:'#1AA898', accentLight:'#EEF6FB',
  headerBg:'#1C3A52', headerText:'#F2F8FA', headerMuted:'#6A9BB0',
  clueBg:'#EEF6FB', clueBorder:'#C8DEEC', clueText:'#1C3A52',
  inputBg:'#F7FBFC', inputBorder:'#C8D8E4', inputPlaceholder:'#9AB8C6',
  correct:'#0F6E56', correctBg:'#D6F0E8', correctBorder:'#A8DACE',
  wrong:'#8B2020', wrongBg:'#FEF0F0', wrongBorder:'#FACACA',
  skip:'#7A8A94', skipBg:'#F5F7F9', skipBorder:'#DDE4E9',
};

const CLUE_KEYS   = ['clue_1','clue_2','clue_3','clue_4','clue_5'];
const CLUE_LABELS = ['History','Physical Examination','Diagnostics','Advanced Diagnostics','Clinching Detail'];

// ─── STATS MODAL ─────────────────────────────────────────────────────────────
function StatsModal({ stats, onClose, moves, won, dayNum, dateStr }) {
  const winPct = getWinPct(stats);
  const maxVal = Math.max(...Object.values(stats.guessDistribution), 1);
  const [copied, setCopied] = useState(false);
  const [shareText, setShareText] = useState('');

  function handleShare() {
    const text = buildShareText(moves, won, dayNum, dateStr);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); })
        .catch(() => setShareText(text));
    } else { setShareText(text); }
  }

  return (
    <div style={{ position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:C.card,borderRadius:'12px',padding:'2rem',width:'100%',maxWidth:'480px',position:'relative',boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }} className="bounce-up">
        <button onClick={onClose} style={{ position:'absolute',top:'10px',right:'10px',background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer',color:C.muted,lineHeight:1 }}>×</button>
        <h2 style={{ margin:'0 0 20px',fontSize:'1.1rem',fontWeight:'700',color:C.text,fontFamily:"'Inter', sans-serif" }}>📊 Statistics</h2>

        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'24px' }}>
          {[
            { val: stats.gamesPlayed, label: 'Played' },
            { val: `${winPct}%`, label: 'Win Rate' },
            { val: stats.currentStreak, label: 'Streak' },
            { val: stats.longestStreak, label: 'Best' },
          ].map(({ val, label }) => (
            <div key={label} style={{ textAlign:'center',padding:'10px 4px',background:'#f8f9ff',borderRadius:'8px',border:'1px solid #e1e8ff' }}>
              <div style={{ fontSize:'1.5rem',fontWeight:'700',color:C.accent,fontFamily:"'Inter', sans-serif",lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:'10px',color:C.muted,fontFamily:"'Inter', sans-serif",letterSpacing:'0.06em',textTransform:'uppercase',marginTop:'4px' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize:'11px',fontWeight:'700',letterSpacing:'0.1em',textTransform:'uppercase',color:C.muted,marginBottom:'10px',fontFamily:"'Inter', sans-serif" }}>Guess Distribution</div>
        <div style={{ display:'flex',flexDirection:'column',gap:'5px',marginBottom:'20px' }}>
          {['1','2','3','4','5','6'].map(k => {
            const count = stats.guessDistribution[k] || 0;
            const pct = count > 0 ? Math.max((count / maxVal) * 100, 14) : 3;
            return (
              <div key={k} style={{ display:'flex',alignItems:'center',gap:'8px' }}>
                <div style={{ width:'14px',fontSize:'12px',fontFamily:"'Inter', sans-serif",color:C.muted,textAlign:'right',flexShrink:0 }}>{k}</div>
                <div style={{ flex:1,height:'22px',background:'#eef2f5',borderRadius:'4px',overflow:'hidden' }}>
                  <div style={{ height:'100%',width:`${pct}%`,background:C.accent,borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'flex-end',paddingRight:'6px',transition:'width 0.5s ease' }}>
                    {count > 0 && <span style={{ fontSize:'11px',fontWeight:'700',color:'#fff',fontFamily:"'Inter', sans-serif" }}>{count}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {moves.length > 0 && (
          <>
            <button onClick={handleShare} style={{ width:'100%',padding:'11px',background:copied?C.correctBg:C.accent,border:`1px solid ${copied?C.correctBorder:C.accent}`,borderRadius:'8px',color:copied?C.correct:'#fff',fontSize:'14px',fontWeight:'700',fontFamily:"'Inter', sans-serif",cursor:'pointer',transition:'all 0.2s' }}>
              {copied ? '✓ Copied to clipboard!' : 'Share Results'}
            </button>
            {shareText && (
              <textarea readOnly value={shareText} onClick={e => e.target.select()}
                style={{ width:'100%',marginTop:'10px',padding:'10px',fontSize:'12px',fontFamily:"'Inter', monospace",border:`1px solid ${C.border}`,borderRadius:'8px',resize:'none',height:'90px',color:C.text,background:C.bg,boxSizing:'border-box' }} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── RESULT MODAL ─────────────────────────────────────────────────────────────
function ResultModal({ won, caseData, moves, dayNum, dateStr, onClose, onShowStats }) {
  const [copied, setCopied] = useState(false);
  const [shareText, setShareText] = useState('');

  function handleShare() {
    const text = buildShareText(moves, won, dayNum, dateStr);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); })
        .catch(() => setShareText(text));
    } else { setShareText(text); }
  }

  return (
    <div style={{ position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:C.card,borderRadius:'12px',padding:'2rem',width:'100%',maxWidth:'420px',position:'relative',boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }} className="bounce-up">
        <button onClick={onClose} style={{ position:'absolute',top:'10px',right:'10px',background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer',color:C.muted,lineHeight:1 }}>×</button>

        <div style={{ textAlign:'center',marginBottom:'20px' }}>
          <div style={{ fontSize:'2rem',marginBottom:'8px' }}>{won ? '🎉' : '💀'}</div>
          <div style={{ fontSize:'1.1rem',fontWeight:'700',color:won?C.correct:C.wrong,fontFamily:"'Inter', sans-serif",marginBottom:'6px' }}>
            {won ? `Correct in ${moves.length} guess${moves.length!==1?'es':''}!` : 'Better luck tomorrow!'}
          </div>
          <div style={{ fontSize:'13px',color:C.muted,fontFamily:"'Inter', sans-serif" }}>
            The diagnosis was <strong style={{ color:C.text }}>{caseData.diagnosis}</strong>
          </div>
        </div>

        {/* Emoji preview */}
        <div style={{ textAlign:'center',fontSize:'1.3rem',letterSpacing:'2px',marginBottom:'20px',padding:'12px',background:C.clueBg,borderRadius:'8px',border:`1px solid ${C.clueBorder}` }}>
          {Array.from({ length: MAX_GUESSES }, (_, i) => {
            const m = moves[i];
            if (!m) return '⬛';
            if (m.result === 'correct') return '🟩';
            return '🟥';
          }).join(' ')}
        </div>

        <button onClick={handleShare} style={{ width:'100%',padding:'11px',marginBottom:'10px',background:copied?C.correctBg:C.accent,border:`1px solid ${copied?C.correctBorder:C.accent}`,borderRadius:'8px',color:copied?C.correct:'#fff',fontSize:'14px',fontWeight:'700',fontFamily:"'Inter', sans-serif",cursor:'pointer',transition:'all 0.2s' }}>
          {copied ? '✓ Copied!' : 'Share Results'}
        </button>
        {shareText && (
          <textarea readOnly value={shareText} onClick={e => e.target.select()}
            style={{ width:'100%',marginBottom:'10px',padding:'10px',fontSize:'12px',fontFamily:"monospace",border:`1px solid ${C.border}`,borderRadius:'8px',resize:'none',height:'90px',color:C.text,background:C.bg,boxSizing:'border-box' }} />
        )}
        <button onClick={onShowStats} style={{ width:'100%',padding:'11px',background:'none',border:`1px solid ${C.border}`,borderRadius:'8px',color:C.text,fontSize:'14px',fontWeight:'600',fontFamily:"'Inter', sans-serif",cursor:'pointer' }}>
          📊 View Statistics
        </button>
      </div>
    </div>
  );
}

// ─── AUTOCOMPLETE INPUT ───────────────────────────────────────────────────────
function DiagnosisInput({ onSubmit, guessedNames, disabled }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const inputRef = useRef(null);

  const filtered = query.length >= 1
    ? DIAGNOSES.filter(d => d.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
    : [];

  function choose(d) {
    if (guessedNames.includes(d)) return;
    setSelected(d); setQuery(d); setOpen(false); setHi(0);
    inputRef.current?.focus();
  }

  function handleKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => Math.min(h+1, filtered.length-1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(h-1, 0)); }
    else if (e.key === 'Enter') {
      if (open && filtered[hi] && !guessedNames.includes(filtered[hi])) {
        e.preventDefault(); choose(filtered[hi]);
      } else if (!open) { handleSubmit(); }
    } else if (e.key === 'Escape') setOpen(false);
  }

  function handleSubmit() {
    if (disabled) return;
    onSubmit(selected || null);
    setQuery(''); setSelected(''); setOpen(false);
  }

  const isSkip = !selected;

  return (
    <div style={{ marginTop:'1rem' }}>
      <div style={{ display:'flex',gap:'8px',position:'relative' }}>
        <div style={{ position:'relative',flex:1 }}>
          <input ref={inputRef} value={query} disabled={disabled}
            onChange={e => { setQuery(e.target.value); setSelected(''); setOpen(true); setHi(0); }}
            onFocus={() => query.length >= 1 && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={handleKey}
            placeholder="Type a diagnosis, or leave blank to skip…"
            style={{ width:'100%',padding:'0.75rem',fontSize:'1rem',border:`1.5px solid ${open&&filtered.length?C.accent:C.inputBorder}`,borderRadius:'8px',outline:'none',background:C.inputBg,color:C.text,fontFamily:"'Inter', sans-serif",boxSizing:'border-box',transition:'border-color 0.15s' }}
          />
          {open && filtered.length > 0 && (
            <div style={{ position:'absolute',top:'calc(100% + 4px)',left:0,right:0,zIndex:50,background:C.card,border:`1.5px solid ${C.accent}`,borderRadius:'8px',boxShadow:'0 8px 24px rgba(0,0,0,0.12)',overflow:'hidden',maxHeight:'250px',overflowY:'auto' }}>
              {filtered.map((d, i) => {
                const alreadyGuessed = guessedNames.includes(d);
                return (
                  <div key={d} onMouseDown={() => choose(d)} style={{
                    padding:'9px 14px',fontSize:'0.9rem',
                    cursor: alreadyGuessed ? 'not-allowed' : 'pointer',
                    background: i===hi && !alreadyGuessed ? C.accentLight : 'transparent',
                    color: alreadyGuessed ? '#bbb' : i===hi ? C.accent : C.text,
                    fontFamily:"'Inter', sans-serif",
                    borderBottom: i<filtered.length-1 ? `1px solid ${C.border}` : 'none',
                    fontWeight: i===hi&&!alreadyGuessed ? '600' : '400',
                  }}>
                    {d}{alreadyGuessed ? ' (already guessed)' : ''}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <button onClick={handleSubmit} disabled={disabled}
          style={{
            padding:'0.75rem 1.25rem',borderRadius:'8px',
            cursor: disabled ? 'default' : 'pointer',
            background: disabled ? C.border : isSkip ? C.skipBg : C.accent,
            color: disabled ? C.muted : isSkip ? C.skip : '#fff',
            border: isSkip ? `1.5px solid ${C.skipBorder}` : 'none',
            fontSize:'1rem',fontWeight:'600',fontFamily:"'Inter', sans-serif",
            transition:'background 0.15s',whiteSpace:'nowrap',
          }}>
          {isSkip ? 'Skip' : 'Submit'}
        </button>
      </div>
      <div style={{ fontSize:'12px',color:C.muted,marginTop:'6px',fontFamily:"'Inter', sans-serif" }}>
        Leave blank and click Skip to reveal the next clue
      </div>
    </div>
  );
}

// ─── GUESS HISTORY ────────────────────────────────────────────────────────────
function GuessHistory({ moves }) {
  if (!moves.length) return null;
  return (
    <div style={{ display:'flex',flexDirection:'column',gap:'0.25rem',margin:'0.5rem 0' }}>
      {moves.map((m, i) => {
        const isCorrect = m.result === 'correct';
        const isSkip = m.result === 'skip';
        const icon = isCorrect ? '✓' : isSkip ? '—' : '✗';
        const bg = isCorrect ? C.correctBg : isSkip ? C.skipBg : C.wrongBg;
        const border = isCorrect ? C.correctBorder : isSkip ? C.skipBorder : C.wrongBorder;
        const col = isCorrect ? C.correct : isSkip ? C.skip : C.wrong;
        return (
          <div key={i} style={{ display:'flex',alignItems:'center',gap:'8px',padding:'0.35rem 0.75rem',borderRadius:'50px',background:bg,border:`1px solid ${border}` }}>
            <span style={{ width:'1.4rem',height:'1.4rem',borderRadius:'50%',background:'rgba(0,0,0,0.12)',fontSize:'0.7rem',fontWeight:'700',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:"'Inter', sans-serif",color:C.text }}>{i+1}</span>
            <span style={{ flex:1,fontSize:'0.85rem',color:C.text,fontFamily:"'Inter', sans-serif",fontWeight:'500',textAlign:'left' }}>{m.name}</span>
            <span style={{ fontSize:'0.9rem',fontWeight:'700',color:col,flexShrink:0 }}>{icon}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── CASE CARD ────────────────────────────────────────────────────────────────
function CaseCard({ c, revealCount }) {
  return (
    <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:'16px',overflow:'hidden',marginBottom:'1.5rem',boxShadow:'0 4px 20px rgba(0,0,0,0.08)',textAlign:'left' }}>
      <div style={{ padding:'1.25rem 1.5rem 0.5rem',textAlign:'center' }}>
        <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif",fontSize:'1.5rem',fontWeight:'600',color:C.text,margin:0 }}>
          What&apos;s the Diagnosis?
        </h2>
        <div style={{ width:'2.5rem',height:'3px',background:C.accent,borderRadius:'2px',margin:'0.6rem auto 1rem' }}/>
        <div style={{ display:'flex',gap:'6px',flexWrap:'wrap',justifyContent:'center',marginBottom:'1rem' }}>
          {[c.species==='dog'?'Canine':'Feline',c.breed,c.age,c.sex].filter(Boolean).map((t,i)=>(
            <span key={i} style={{ padding:'2px 10px',borderRadius:'4px',background:C.clueBg,border:`1px solid ${C.clueBorder}`,color:C.clueText,fontSize:'12px',fontWeight:'600',fontFamily:"'Inter', sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ padding:'0 1.5rem 1.5rem' }}>
        <div style={{ padding:'0.75rem',background:C.clueBg,border:`1px solid ${C.clueBorder}`,borderRadius:'12px',minHeight:'3rem',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'0.5rem' }}>
          <p style={{ margin:0,fontSize:'1rem',color:C.text,lineHeight:'1.65',fontFamily:"'Inter', sans-serif",fontWeight:'600',textAlign:'center' }}>{c.presenting_complaint}</p>
        </div>
        {CLUE_KEYS.map((key, i) => revealCount > i && (
          <div key={key} className="flip-in" style={{ marginTop:'0.5rem',padding:'0.75rem',background:C.clueBg,border:`1px solid ${C.clueBorder}`,borderRadius:'12px',minHeight:'3rem' }}>
            <div style={{ fontSize:'10px',fontWeight:'700',letterSpacing:'0.1em',textTransform:'uppercase',color:C.accent,marginBottom:'4px',fontFamily:"'Inter', sans-serif" }}>{CLUE_LABELS[i]}</div>
            <p style={{ margin:0,fontSize:'0.95rem',color:C.clueText,lineHeight:'1.65',fontFamily:"'Inter', sans-serif" }}>{c[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SUMMARY CARD ─────────────────────────────────────────────────────────────
function SummaryCard({ c }) {
  return (
    <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:'16px',padding:'1.5rem',marginTop:'1rem',boxShadow:'0 4px 20px rgba(0,0,0,0.08)',textAlign:'left' }}>
      <div style={{ fontSize:'10px',fontWeight:'700',letterSpacing:'0.1em',textTransform:'uppercase',color:C.muted,marginBottom:'8px',fontFamily:"'Inter', sans-serif" }}>Diagnosis Summary</div>
      <div style={{ fontSize:'1.2rem',fontWeight:'600',color:C.accent,marginBottom:'10px',fontFamily:"'Playfair Display', Georgia, serif" }}>{c.diagnosis}</div>
      <p style={{ margin:0,fontSize:'0.95rem',color:'#333',lineHeight:'1.7',fontFamily:"'Inter', sans-serif" }}>{c.summary}</p>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Vetordle() {
  const [phase, setPhase] = useState('loading');
  const [caseData, setCaseData] = useState(null);
  const [moves, setMoves] = useState([]);
  const [won, setWon] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [stats, setStats] = useState({ ...EMPTY_STATS, guessDistribution: { ...EMPTY_STATS.guessDistribution } });
  const [showStats, setShowStats] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const dateKey = getDateKey();
  const dayNum = getDayNumber();

  useEffect(() => { init(); }, []);

  async function init() {
    const savedStats = loadStats();
    setStats(savedStats);

    // Load today's case from our API
    try {
      const res = await fetch('/api/case/today');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCaseData(data);
    } catch (e) {
      setErrorMsg(e.message);
      setPhase('error');
      return;
    }

    // Check saved game for today
    const savedGame = getCookie(`vetordle_game_${dateKey}`);
    if (savedGame) {
      let savedMoves;
      if (Array.isArray(savedGame.moves) && savedGame.moves.length > 0) {
        savedMoves = savedGame.moves;
      } else if (Array.isArray(savedGame.guesses) && savedGame.guesses.length > 0) {
        savedMoves = savedGame.guesses.map(g => ({ name: g.text || g, result: g.correct ? 'correct' : 'wrong' }));
      } else {
        setPhase('playing');
        return;
      }
      setMoves(savedMoves);
      setWon(!!savedGame.won);
      setPhase('done');
      setTimeout(() => setShowResult(true), 300);
    } else {
      setPhase('playing');
    }
  }

  function handleSubmit(diagnosis) {
    const isSkip = !diagnosis;
    const isCorrect = !isSkip && diagnosis.toLowerCase() === caseData.diagnosis.toLowerCase();
    const name = isSkip ? 'Skipped' : diagnosis;
    const result = isCorrect ? 'correct' : isSkip ? 'skip' : 'wrong';

    const newMoves = [...moves, { name, result }];
    setMoves(newMoves);

    const finished = isCorrect || newMoves.length >= MAX_GUESSES;
    if (finished) {
      const didWin = isCorrect;
      setWon(didWin);
      setPhase('done');
      setCookie(`vetordle_game_${dateKey}`, { moves: newMoves, won: didWin }, 2);
      const updatedStats = computeUpdatedStats(stats, didWin, newMoves.length);
      setStats(updatedStats);
      setCookie('vetordle_stats', updatedStats);
      setTimeout(() => setShowResult(true), 400);
    }
  }

  const nonCorrect = (moves || []).filter(m => m.result !== 'correct').length;
  const revealCount = Math.min(nonCorrect, 5);
  const guessedNames = (moves || []).filter(m => m.result !== 'skip').map(m => m.name);

  return (
    <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column' }}>
      {/* Modals */}
      {showStats && (
        <StatsModal stats={stats} onClose={() => setShowStats(false)}
          moves={moves} won={won} dayNum={dayNum} dateStr={dateKey} />
      )}
      {showResult && caseData && (
        <ResultModal won={won} caseData={caseData} moves={moves}
          dayNum={dayNum} dateStr={dateKey}
          onClose={() => setShowResult(false)}
          onShowStats={() => { setShowResult(false); setShowStats(true); }} />
      )}

      {/* Header */}
      <header style={{ background:C.headerBg,padding:'0 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:'58px',position:'sticky',top:0,zIndex:100,boxShadow:'0 1px 6px rgba(0,0,0,0.08)' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={C.accent}>
            <ellipse cx="12" cy="17" rx="5" ry="4"/>
            <ellipse cx="7" cy="11" rx="2.2" ry="3"/>
            <ellipse cx="17" cy="11" rx="2.2" ry="3"/>
            <ellipse cx="4.5" cy="14.5" rx="1.8" ry="2.5"/>
            <ellipse cx="19.5" cy="14.5" rx="1.8" ry="2.5"/>
          </svg>
          <span style={{ fontSize:'1.3rem',fontWeight:'700',color:C.headerText,fontFamily:"'Playfair Display', Georgia, serif",letterSpacing:'0.01em' }}><span style={{color:C.accent}}>VET</span>ordle</span>
          <span style={{ fontSize:'12px',color:C.headerMuted,fontFamily:"'Inter', sans-serif" }}>#{dayNum}</span>
        </div>
        <div style={{ fontSize:'12px',color:C.headerMuted,fontFamily:"'Inter', sans-serif" }}>{formatDate(dateKey)}</div>
        <button onClick={() => setShowStats(true)} style={{ background:'none',border:'1px solid #2d5470',borderRadius:'6px',padding:'5px 12px',fontSize:'12px',fontFamily:"'Inter', sans-serif",color:C.headerMuted,cursor:'pointer' }}>
          STATS
        </button>
      </header>

      {/* Main */}
      <main style={{ display:'flex',justifyContent:'center',alignItems:'flex-start',flex:1,padding:'2rem 1rem' }}>
        <div style={{ background:C.card,borderRadius:'16px',boxShadow:'0 4px 20px rgba(0,0,0,0.1)',border:`1px solid ${C.border}`,padding:'2rem',maxWidth:'600px',width:'100%',textAlign:'center' }}>

          {/* Loading */}
          {phase === 'loading' && (
            <div style={{ padding:'60px 0',color:C.muted }}>
              <div style={{ fontSize:'2rem',marginBottom:'12px' }}>🩺</div>
              <div style={{ fontFamily:"'Inter', sans-serif",fontSize:'12px',letterSpacing:'0.12em',textTransform:'uppercase' }}>Loading today&apos;s case…</div>
            </div>
          )}

          {/* Error */}
          {phase === 'error' && (
            <div style={{ padding:'40px 0' }}>
              <div style={{ fontSize:'2rem',marginBottom:'12px' }}>⚠️</div>
              <div style={{ color:C.wrong,fontSize:'15px',fontWeight:'600',marginBottom:'16px',fontFamily:"'Inter', sans-serif" }}>Failed to load today&apos;s case</div>
              <button onClick={init} style={{ background:C.accent,color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:'700',cursor:'pointer',fontSize:'14px',fontFamily:"'Inter', sans-serif",marginBottom:'20px' }}>Retry</button>
              <div style={{ background:C.wrongBg,border:`1px solid ${C.wrongBorder}`,borderRadius:'8px',padding:'14px',textAlign:'left',fontSize:'11px',fontFamily:'monospace',color:C.muted,wordBreak:'break-all' }}>{errorMsg}</div>
            </div>
          )}

          {/* Playing */}
          {phase === 'playing' && caseData && (
            <>
              <CaseCard c={caseData} revealCount={revealCount} />
              <GuessHistory moves={moves} />
              <DiagnosisInput onSubmit={handleSubmit} guessedNames={guessedNames} disabled={false} />
              <p style={{ fontSize:'12px',color:C.muted,marginTop:'1rem',fontFamily:"'Inter', sans-serif",fontStyle:'italic' }}>
                *For educational purposes only. Does not constitute veterinary advice.
              </p>
            </>
          )}

          {/* Done */}
          {phase === 'done' && caseData && (
            <>
              <CaseCard c={caseData} revealCount={5} />
              <GuessHistory moves={moves} />
              <button onClick={() => setShowResult(true)} style={{ width:'100%',padding:'12px',background:C.accent,border:'none',borderRadius:'8px',color:'#fff',fontSize:'14px',fontWeight:'700',fontFamily:"'Inter', sans-serif",cursor:'pointer',marginTop:'1rem' }}>
                {won ? '🎉 View Result' : '💀 View Result'}
              </button>
              <SummaryCard c={caseData} />
              <p style={{ fontSize:'12px',color:C.muted,marginTop:'1rem',fontFamily:"'Inter', sans-serif",fontStyle:'italic' }}>
                *For educational purposes only. Does not constitute veterinary advice.
              </p>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign:'center',padding:'1rem',background:C.headerBg,color:'#7A9AAA',fontSize:'0.85rem',fontFamily:"'Inter', sans-serif",borderTop:`2px solid ${C.headerBg}` }}>
        © {new Date().getFullYear()} VETordle · vetordle.com · For educational purposes only
      </footer>
    </div>
  );
}
