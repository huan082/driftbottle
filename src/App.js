import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home    from './pages/Home';
import Confess from './pages/Confess';
import Meet    from './pages/Meet';
import Echo    from './pages/Echo';
import Trace   from './pages/Trace';
import './App.css';

/* ── Stars (generated once) ── */
const STARS = Array.from({ length: 110 }, (_, i) => ({
  id: i,
  x:    +(Math.random() * 100).toFixed(2),
  y:    +(Math.random() * 58).toFixed(2),
  size: Math.random() > 0.82 ? 2.5 : Math.random() > 0.55 ? 1.5 : 1,
  delay: +(Math.random() * 5).toFixed(2),
  dur:   +(2.5 + Math.random() * 3).toFixed(2),
  op:    +(0.08 + Math.random() * 0.45).toFixed(2),
}));

const WAVE_PATH1 = "M0,70 C200,110 400,30 600,70 C800,110 1000,30 1200,70 C1400,110 1600,30 1800,70 C2000,110 2200,30 2400,70 L2400,200 L0,200 Z";
const WAVE_PATH2 = "M0,80 C250,40 500,120 750,80 C1000,40 1250,120 1500,80 C1750,40 2000,120 2250,80 L2400,80 L2400,200 L0,200 Z";
const WAVE_PATH3 = "M0,90 C180,130 360,50 540,90 C720,130 900,50 1080,90 C1260,130 1440,50 1620,90 C1800,130 1980,50 2160,90 L2400,90 L2400,200 L0,200 Z";

function OceanBackground() {
  return (
    <div className="ocean-bg">
      <div className="ocean-bg__blob ocean-bg__blob--1" />
      <div className="ocean-bg__blob ocean-bg__blob--2" />
      <div className="ocean-bg__blob ocean-bg__blob--3" />
      {STARS.map(s => (
        <div key={s.id} className="ocean-bg__star" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          opacity: s.op,
          animationDelay: `${s.delay}s`,
          animationDuration: `${s.dur}s`,
        }} />
      ))}
      <div className="ocean-bg__moon" />
      <div className="ocean-bg__shimmer" />
      <svg className="ocean-bg__wave ocean-bg__wave--1" viewBox="0 0 2400 200" preserveAspectRatio="none">
        <path d={WAVE_PATH1} />
      </svg>
      <svg className="ocean-bg__wave ocean-bg__wave--2" viewBox="0 0 2400 200" preserveAspectRatio="none">
        <path d={WAVE_PATH2} />
      </svg>
      <svg className="ocean-bg__wave ocean-bg__wave--3" viewBox="0 0 2400 200" preserveAspectRatio="none">
        <path d={WAVE_PATH3} />
      </svg>
      <div className="ocean-bg__vignette" />
    </div>
  );
}

/* ── Guide Panel ── */
const GUIDE_KEYS  = ['now', 'talk', 'meet', 'echo', 'trace'];
const GUIDE_NAMES = { now: '此刻', talk: '傾訴', meet: '遇見', echo: '回聲', trace: '留痕' };

function GuidePanel() {
  const { t, i18n } = useTranslation();
  const LANGS = [
    { code: 'zh', label: '中文' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
  ];
  return (
    <div className="guide-panel" onClick={e => e.stopPropagation()}>
      <div className="guide-panel__title">{t('title')}</div>
      {GUIDE_KEYS.map(key => (
        <div key={key} className="guide-panel__item">
          <span className="guide-panel__name">{GUIDE_NAMES[key]}</span>
          <span className="guide-panel__desc">{t(`features.${key}.desc`)}</span>
        </div>
      ))}
      <div className="guide-panel__lang">
        {LANGS.map(l => (
          <button
            key={l.code}
            className={`lang-btn${i18n.language === l.code ? ' active' : ''}`}
            onClick={() => i18n.changeLanguage(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Navbar ── */
const NAV_LINKS = [
  { to: '/now',   label: '此刻' },
  { to: '/talk',  label: '傾訴' },
  { to: '/meet',  label: '遇見' },
  { to: '/echo',  label: '回聲' },
  { to: '/trace', label: '留痕' },
];

function Navbar() {
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <span className="navbar__logo" onClick={() => navigate('/now')}>拾浪</span>
        <ul className="navbar__links">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          className="navbar__guide-btn"
          onClick={() => setShowGuide(v => !v)}
        >
          使用指南
        </button>
      </nav>

      {showGuide && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 98 }}
          onClick={() => setShowGuide(false)}
        >
          <GuidePanel />
        </div>
      )}
    </>
  );
}

/* ── App Inner (needs Router context) ── */
function AppInner() {
  return (
    <>
      <OceanBackground />
      <Navbar />
      <div className="page-wrapper">
        <Routes>
          <Route path="/"      element={<Navigate to="/now" replace />} />
          <Route path="/now"   element={<Home />} />
          <Route path="/talk"  element={<Confess />} />
          <Route path="/meet"  element={<Meet />} />
          <Route path="/echo"  element={<Echo />} />
          <Route path="/trace" element={<Trace />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}