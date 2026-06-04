import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './Trace.css';

const STATUS_CONFIG = {
  floating: { label: '還在漂',  color: '#7db4d8', bg: 'rgba(125,180,216,0.1)',  border: 'rgba(125,180,216,0.28)' },
  found:    { label: '有人撿起', color: '#7dbd9a', bg: 'rgba(125,189,154,0.1)',  border: 'rgba(125,189,154,0.28)' },
  expiring: { label: '即將消失', color: '#d4896a', bg: 'rgba(212,137,106,0.1)',  border: 'rgba(212,137,106,0.28)' },
};

const TAG_BORDER_COLOR = {
  迷茫:  '#9ab0c0',
  想說說: '#d4c96a',
  平靜:  '#7db4d8',
  難過:  '#b48fd8',
  憤怒:  '#d8896a',
  開心:  '#7dbd9a',
  未標記: 'rgba(212,168,83,0.4)',
};

// 預設過去資料（當 localStorage 為空時顯示）
const DEMO_TRACES = [
  { id: 101, text: '下午睡到四點，醒來突然不知道今天要幹嘛。', status: 'found',    time: '5 天前', tag: '迷茫',  duration: '7天' },
  { id: 102, text: '今天和很久沒聯絡的朋友說了再見。不是吵架，只是慢慢地，就沒有消息了。', status: 'floating', time: '2 天前', tag: '難過',  duration: '24小時' },
  { id: 103, text: '畢業倒數一個月，我履歷還是一片空白。',  status: 'expiring', time: '昨天',   tag: '迷茫',  duration: '漂著' },
  { id: 104, text: '把聊天紀錄翻到很前面，然後什麼都沒做。', status: 'floating', time: '3 天前', tag: '迷茫',  duration: '24小時' },
  { id: 105, text: '希望能找到知音。',  status: 'found',    time: '1 週前', tag: '想說說', duration: '7天' },
  { id: 106, text: '海邊的風好舒服。', status: 'found',    time: '1 週前', tag: '平靜',  duration: '漂著' },
];

// ── 從 localStorage 讀取使用者傾訴的內容 ──
function loadFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem('shilang_traces') || '[]');
    return saved;
  } catch {
    return [];
  }
}

export default function Trace() {
  const [userItems, setUserItems] = useState([]);
  const [fading, setFading]       = useState({});
  const [qrOpen, setQrOpen]       = useState({});

  // 每次進入頁面都重新讀 localStorage
  useEffect(() => {
    setUserItems(loadFromStorage());
  }, []);

  // 合併：使用者自己的在前，過去的在後
  const items = [...userItems, ...DEMO_TRACES];

  const handleDelete = (id) => {
    setFading(f => ({ ...f, [id]: true }));
    setQrOpen(q => { const n = { ...q }; delete n[id]; return n; });
    setTimeout(() => {
      // 如果是使用者資料，也從 localStorage 移除
      const updatedUser = userItems.filter(i => i.id !== id);
      setUserItems(updatedUser);
      try {
        localStorage.setItem('shilang_traces', JSON.stringify(updatedUser));
      } catch (e) {}
      setFading(f => { const n = { ...f }; delete n[id]; return n; });
    }, 520);
  };

  const toggleQR = (id) => {
    setQrOpen(q => ({ ...q, [id]: !q[id] }));
  };

  return (
    <div className="page trace-page">
      <div className="page-header">
        <div className="page-header__eyebrow">WHAT YOU'VE SAID</div>
        <h2 className="page-header__title">留痕</h2>
        <p className="page-header__sub">你曾說出口的每一句話</p>
      </div>

      {/* 區分「我的」vs「過去」 */}
      {userItems.length > 0 && (
        <div className="trace-section-label">我投擲的瓶子</div>
      )}

      <div className="trace-list">
        {items.length === 0 && (
          <div className="trace-empty">
            <span className="trace-empty__icon">🍾</span>
            <p className="trace-empty__text">你還沒有投擲任何瓶子</p>
            <p className="trace-empty__sub">去「傾訴」說些什麼吧</p>
          </div>
        )}

        {items.map((item, idx) => {
          const s = STATUS_CONFIG[item.status] || STATUS_CONFIG['floating'];
          const tagBorderColor = TAG_BORDER_COLOR[item.tag] || 'rgba(212,168,83,0.4)';
          const isUserItem = userItems.some(u => u.id === item.id);

          return (
            <React.Fragment key={item.id}>
              {/* 過去資料分隔線 */}
              {!isUserItem && idx === userItems.length && userItems.length > 0 && (
                <div className="trace-section-divider">
                  <span>過去資料</span>
                </div>
              )}
              <div
                className={`trace-item card ${fading[item.id] ? 'trace-item--fading' : ''} ${isUserItem ? 'trace-item--mine' : ''}`}
                style={{
                  animationDelay: `${idx * 0.06}s`,
                  borderLeft: `4px solid ${tagBorderColor}`,
                }}
              >
                <div className="trace-item__body">
                  <div className="trace-item__content">
                    <p className="trace-item__text">{item.text}</p>
                    <div className="trace-item__meta">
                      <span
                        className="trace-item__status"
                        style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
                      >
                        {s.label}
                      </span>
                      <span className="trace-item__tag">{item.tag}</span>
                      {item.duration && (
                        <span className="trace-item__duration">{item.duration}</span>
                      )}
                      <span className="trace-item__time">{item.time}</span>
                    </div>
                  </div>

                  <div className="trace-item__actions">
                    <button
                      className={`trace-btn${qrOpen[item.id] ? ' trace-btn--active' : ''}`}
                      onClick={() => toggleQR(item.id)}
                      title="產生 QR Code"
                    >
                      {qrOpen[item.id] ? '收起' : '分享'}
                    </button>
                    <button
                      className="trace-btn trace-btn--delete"
                      onClick={() => handleDelete(item.id)}
                      title="讓它消失"
                    >
                      消失
                    </button>
                  </div>
                </div>

                {qrOpen[item.id] && (
                  <div className="trace-qr">
                    <p className="trace-qr__label">這瓶心事的專屬連結</p>
                    <div className="trace-qr__code">
                      <QRCodeSVG
                        value={`https://shilang.app/bottle/${item.id}`}
                        size={96}
                        bgColor="transparent"
                        fgColor="#ffffff"
                        level="M"
                      />
                    </div>
                    <p className="trace-qr__url">shilang.app/bottle/{item.id}</p>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}