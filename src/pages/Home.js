import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// 隨機語錄
const QUOTES = [
  '海浪會帶走你的心事',
  '瓶子裡的秘密，總有人願意聽',
  '漂流的心情，總會找到岸',
  '把話交給海洋，它會傳到遠方',
];

function BottleSVG({ className = '' }) {
  return (
    <svg width="80" height="124" viewBox="0 0 80 124" fill="none"
      className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="31" y="18" width="18" height="10" rx="3" fill="none" stroke="#d4a853" strokeWidth="1.6" opacity="0.7" />
      <rect x="33" y="12" width="14" height="8" rx="2" fill="rgba(212,168,83,0.18)" stroke="#d4a853" strokeWidth="1.4" opacity="0.6" />
      <line x1="31" y1="28" x2="49" y2="28" stroke="#d4a853" strokeWidth="1.6" opacity="0.7" />
      <path d="M30 28 L24 46 Q12 60 12 80 Q12 108 40 108 Q68 108 68 80 Q68 60 56 46 L50 28 Z" fill="rgba(30,80,140,0.22)" stroke="#d4a853" strokeWidth="1.6" strokeLinejoin="round" opacity="0.85" />
      <path d="M18 80 Q40 74 62 80" stroke="#d4a853" strokeWidth="0.8" opacity="0.2" fill="none" />
      <path d="M16 88 Q40 82 64 88" stroke="#d4a853" strokeWidth="0.8" opacity="0.15" fill="none" />
      <circle cx="40" cy="64" r="4" fill="#d4a853" opacity="0.28" />
      <circle cx="40" cy="64" r="2" fill="#d4a853" opacity="0.4" />
    </svg>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [shaking, setShaking] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [quote, setQuote] = useState('');
  
  // 實時統計狀態
  const [stats, setStats] = useState({
    userThrownCount: 0,
    onlineCount: 42, // 線上人數可保持模擬隨機跳動
    pickedCount: 3
  });

  useEffect(() => {
    // 1. 隨機語錄初始化
    const idx = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[idx]);

    // 2. 從 localStorage 讀取目前使用者投出的瓶子總數
    try {
      const savedTraces = JSON.parse(localStorage.getItem('shilang_traces') || '[]');
      
      // 模擬線上人數：以 42 為基準上下小幅隨機跳動，增加真實感
      const randomOnline = Math.floor(40 + Math.random() * 8);
      
      // 假設已撿起瓶子數量會隨著使用者投擲數量有微幅成長
      const simulatedPicked = 3 + Math.floor(savedTraces.length * 0.4);

      setStats({
        userThrownCount: savedTraces.length,
        onlineCount: randomOnline,
        pickedCount: simulatedPicked
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleBottleClick = () => {
    if (shaking) return;
    setShaking(true);
    setClicked(true);
    setTimeout(() => setShaking(false), 700);
  };

  return (
    <div className="page home-page">
      <div className="home-hero">
        <div className="home-hero__eyebrow">漂流於此，靜候緣分</div>
        <h1 className="home-hero__title">拾浪</h1>
        <p className="home-hero__sub">把心事交給海，等待有緣人撿起</p>
      </div>

      <div className="home-bottle-wrap" onClick={handleBottleClick} title="點我">
        <BottleSVG
          className={`home-bottle ${shaking ? 'home-bottle--shake' : 'home-bottle--float'}`}
        />
        {clicked && <div className="home-bottle__hint">搖一搖，讓心事漂出去</div>}
      </div>

      {quote && (
        <p className="home-quote">「{quote}」</p>
      )}

      {/* 動態統計數字區塊 */}
      <div className="home-stats">
        <span className="home-stat">
          你已投出瓶子 <span className="home-stat__num">{stats.userThrownCount}</span>
        </span>
        <span className="home-stat__divider">·</span>
        <span className="home-stat">
          此刻 <span className="home-stat__num">{stats.onlineCount}</span> 人正在傾訴
        </span>
        <span className="home-stat__divider">·</span>
        <span className="home-stat">
          海流已撿起瓶子 <span className="home-stat__num">{stats.pickedCount}</span>
        </span>
      </div>

      <div className="home-cta">
        <button className="btn btn--gold" onClick={() => navigate('/talk')}>傾訴</button>
        <button className="btn btn--ghost" onClick={() => navigate('/meet')}>遇見</button>
      </div>
    </div>
  );
}