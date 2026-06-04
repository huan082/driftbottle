import React, { useState } from 'react';
import './Confess.css';

const TAGS = [
  { label: '迷茫' },
  { label: '難過' },
  { label: '憤怒' },
  { label: '平靜' },
  { label: '開心' },
  { label: '想說說' },
];

const DURATIONS = [
  { value: '24h',     label: '24 小時後消失' },
  { value: '7d',      label: '7 天後消失' },
  { value: 'forever', label: '就讓它漂著' },
];

const DURATION_LABEL = {
  '24h':     '24小時',
  '7d':      '7天',
  'forever': '漂著',
};

// ── 寫入 localStorage，讓 Trace 頁面能讀到 ──
function saveToTrace(text, tag, duration) {
  try {
    const existing = JSON.parse(localStorage.getItem('shilang_traces') || '[]');
    const newItem = {
      id: Date.now(),
      text,
      tag: tag || '未標記',
      status: 'floating',
      time: '剛剛',
      duration: DURATION_LABEL[duration] || duration,
    };
    localStorage.setItem('shilang_traces', JSON.stringify([newItem, ...existing]));
  } catch (e) {
    console.warn('儲存失敗', e);
  }
}

export default function Confess() {
  const [text, setText]         = useState('');
  const [tag, setTag]           = useState('');
  const [duration, setDuration] = useState('24h');
  const [throwing, setThrowing] = useState(false);
  const [drift, setDrift]       = useState(false);
  const [done, setDone]         = useState(false);

  const handleSubmit = () => {
    if (!text.trim() || throwing) return;
    // 存進 localStorage → 留痕頁面會讀到
    saveToTrace(text, tag, duration);
    setDrift(true);
    setThrowing(true);
    setTimeout(() => {
      setDrift(false);
      setThrowing(false);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setText('');
        setTag('');
        setDuration('24h');
      }, 2200);
    }, 2900);
  };

  return (
    <div className="page confess-page">
      {throwing && (
        <div className="confess-throw-overlay" aria-hidden="true">
          <svg className="confess-throw-bottle" width="70" height="108" viewBox="0 0 80 124" fill="none">
            <rect x="33" y="12" width="14" height="8" rx="2"
              fill="rgba(212,168,83,0.25)" stroke="#d4a853" strokeWidth="1.4" opacity="0.7"/>
            <line x1="31" y1="28" x2="49" y2="28" stroke="#d4a853" strokeWidth="1.6" opacity="0.7"/>
            <path d="M30 28 L24 46 Q12 60 12 80 Q12 108 40 108 Q68 108 68 80 Q68 60 56 46 L50 28 Z"
              fill="rgba(30,80,140,0.3)" stroke="#d4a853" strokeWidth="1.6" strokeLinejoin="round"/>
            <circle cx="40" cy="64" r="3" fill="#d4a853" opacity="0.35"/>
          </svg>
        </div>
      )}

      {done && (
        <div className="confess-success">
          <span className="confess-success__icon">🌊</span>
          <p className="confess-success__text">你的心事已投入海流</p>
          <p className="confess-success__sub">它已出現在「留痕」中</p>
        </div>
      )}

      {!done && (
        <div className="confess-card card">
          <div className="confess-card__header">
            <div className="page-header__eyebrow">TELL THE SEA</div>
            <h2 className="confess-card__title">傾訴</h2>
            <p className="confess-card__sub">把此刻想說的，裝進瓶子裡</p>
          </div>

          <textarea
            className="form-textarea"
            placeholder="寫下此刻想說的話……"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            disabled={throwing}
          />

          <label className="form-label">此刻的心情</label>
          <div className="confess-tags">
            {TAGS.map(t => (
              <button
                key={t.label}
                className={`confess-tag${tag === t.label ? ' confess-tag--active' : ''}`}
                onClick={() => setTag(tag === t.label ? '' : t.label)}
                disabled={throwing}
              >
                {t.label}
              </button>
            ))}
          </div>

          <label className="form-label">瓶子的壽命</label>
          <select
            className="form-select"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            disabled={throwing}
          >
            {DURATIONS.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          <button
            className={`btn btn--gold confess-submit${drift ? ' confess-submit--drift' : ''}`}
            onClick={handleSubmit}
            disabled={!text.trim() || throwing}
          >
            {throwing ? '投擲中……' : '投擲瓶子'}
          </button>
        </div>
      )}
    </div>
  );
}