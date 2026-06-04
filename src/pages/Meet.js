import React, { useState } from 'react';
import './Meet.css';

const MESSAGES = [
  { tag: '迷茫',   text: '不知道自己在做什麼，也不知道想要什麼。只是覺得每天都很空，像在海裡漂著，卻沒有方向。' },
  { tag: '難過',   text: '今天和很久沒聯絡的朋友說了再見。不是吵架，只是慢慢地，就沒有消息了。' },
  { tag: '平靜',   text: '一個人在宿舍吃泡麵，窗外下著雨。意外地覺得還好。或許孤單有時候也挺溫柔的。' },
  { tag: '開心',   text: '今天去買微風下午茶，店員多送了我一塊小蛋糕！突然覺得今天是一整天的小確幸。' },
  { tag: '想說說', text: '我媽打電話來問我吃飯了嗎，我說吃了，但其實沒有。不知道為什麼說謊，可能是不想讓她擔心。' },
  { tag: '迷茫',   text: '快畢業了，每個人都問有沒有找到工作。我笑著說還在看看，其實什麼都沒動。' },
  { tag: '難過',   text: '今天心情有點低落，不知道為什麼，就是提不起勁來。' },
  { tag: '憤怒',   text: '剛剛跟朋友吵架了，說了一些不該說的話，現在好後悔。' },
  { tag: '平靜',   text: '海邊的風好舒服，什麼都不想，就這樣待著也很好。' },
  { tag: '想說說', text: '好想找人聊聊，但又不知道從哪裡開口。' },
];

const TAG_COLORS = {
  迷茫:  { color: '#7db4d8', bg: 'rgba(125,180,216,0.12)', border: 'rgba(125,180,216,0.3)' },
  難過:  { color: '#b48fd8', bg: 'rgba(180,143,216,0.12)', border: 'rgba(180,143,216,0.3)' },
  憤怒:  { color: '#d8896a', bg: 'rgba(216,137,106,0.12)', border: 'rgba(216,137,106,0.3)' },
  平靜:  { color: '#7dbd9a', bg: 'rgba(125,189,154,0.12)', border: 'rgba(125,189,154,0.3)' },
  開心:  { color: '#f3e16b', bg: 'rgba(243,225,107,0.12)', border: 'rgba(243,225,107,0.3)' },
  想說說: { color: '#d4a853', bg: 'rgba(212,168,83,0.12)',  border: 'rgba(212,168,83,0.3)' },
};

// phase: idle → rising → card → replying → sent → sinking → idle
export default function Meet() {
  const [phase, setPhase]       = useState('idle');
  const [message, setMessage]   = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleFish = () => {
    if (phase !== 'idle') return;
    const picked = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setMessage(picked);
    setReplyText('');
    setPhase('rising');
    setTimeout(() => setPhase('card'), 2100);
  };

  const handlePutBack = () => {
    setPhase('sinking');
    setTimeout(() => { setPhase('idle'); setMessage(null); }, 1400);
  };

  // 點「回應他」→ 展開打字框
  const handleOpenReply = () => {
    setPhase('replying');
  };

  // 送出回覆
  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setPhase('sent');
    setTimeout(() => handlePutBack(), 2000);
  };

  const tagStyle = message
    ? (TAG_COLORS[message.tag] || TAG_COLORS['想說說'])
    : {};

  return (
    <div className="page meet-page">
      <div className="meet-container">
        <div className="page-header">
          <div className="page-header__eyebrow">CAST YOUR NET</div>
          <h2 className="page-header__title">遇見</h2>
          <p className="page-header__sub">隨機撈起一個陌生人的心情</p>
        </div>

        <div className="meet-sea-line" />

        {/* 瓶子 */}
        <div className="meet-bottle-area">
          {phase === 'idle' && (
            <svg className="meet-bottle-idle" width="60" height="94" viewBox="0 0 80 124" fill="none">
              <rect x="33" y="12" width="14" height="8" rx="2" fill="none" stroke="rgba(212,168,83,0.25)" strokeWidth="1.4"/>
              <line x1="31" y1="28" x2="49" y2="28" stroke="rgba(212,168,83,0.25)" strokeWidth="1.5"/>
              <path d="M30 28 L24 46 Q12 60 12 80 Q12 108 40 108 Q68 108 68 80 Q68 60 56 46 L50 28 Z"
                fill="rgba(30,80,140,0.1)" stroke="rgba(212,168,83,0.25)" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="40" cy="68" r="3" fill="rgba(212,168,83,0.18)"/>
            </svg>
          )}
          {(phase === 'rising' || phase === 'card' || phase === 'replying' || phase === 'sent' || phase === 'sinking') && (
            <svg
              className={`meet-bottle-anim ${
                phase === 'rising'  ? 'meet-bottle--rise'  :
                phase === 'sinking' ? 'meet-bottle--sink'  : ''
              }`}
              width="64" height="100" viewBox="0 0 80 124" fill="none"
            >
              <rect x="33" y="12" width="14" height="8" rx="2"
                fill="rgba(212,168,83,0.22)" stroke="#d4a853" strokeWidth="1.4" opacity="0.75"/>
              <line x1="31" y1="28" x2="49" y2="28" stroke="#d4a853" strokeWidth="1.6" opacity="0.75"/>
              <path d="M30 28 L24 46 Q12 60 12 80 Q12 108 40 108 Q68 108 68 80 Q68 60 56 46 L50 28 Z"
                fill="rgba(30,80,140,0.28)" stroke="#d4a853" strokeWidth="1.6" strokeLinejoin="round" opacity="0.9"/>
              <path d="M18 80 Q40 74 62 80" stroke="#d4a853" strokeWidth="0.8" opacity="0.22" fill="none"/>
              <circle cx="40" cy="64" r="4" fill="#d4a853" opacity="0.3"/>
            </svg>
          )}
        </div>

        <div className="meet-sea-line" />

        {/* 心情卡片 */}
        {(phase === 'card' || phase === 'replying' || phase === 'sent') && message && (
          <div className="meet-card card" style={{ animation: 'slideDown 0.5s var(--ease) both' }}>
            <span className="meet-card__tag" style={{
              color: tagStyle.color,
              background: tagStyle.bg,
              border: `1px solid ${tagStyle.border}`,
            }}>
              {message.tag}
            </span>
            <p className="meet-card__text">{message.text}</p>

            {/* 狀態一：尚未回應 */}
            {phase === 'card' && (
              <div className="meet-card__actions">
                <button className="btn btn--gold" style={{ padding: '11px 28px', fontSize: 13 }} onClick={handleOpenReply}>
                  回應他
                </button>
                <button className="btn btn--ghost" style={{ padding: '11px 28px', fontSize: 13 }} onClick={handlePutBack}>
                  放回海裡
                </button>
              </div>
            )}

            {/* 狀態二：打字回應中 */}
            {phase === 'replying' && (
              <div className="meet-reply-box">
                <textarea
                  className="form-textarea meet-reply-box__textarea"
                  placeholder="寫下你想說的話……"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <div className="meet-reply-box__actions">
                  <button
                    className="btn btn--gold"
                    style={{ padding: '11px 28px', fontSize: 13 }}
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    送出回應
                  </button>
                  <button
                    className="btn btn--ghost"
                    style={{ padding: '11px 28px', fontSize: 13 }}
                    onClick={() => setPhase('card')}
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            {/* 狀態三：已送出 */}
            {phase === 'sent' && (
              <p className="meet-card__replied">你的回應已悄悄送出 🌊</p>
            )}
          </div>
        )}

        {/* 等待撈瓶子 */}
        {phase === 'idle' && (
          <div className="meet-cta">
            <button className="btn btn--gold" onClick={handleFish}>撈瓶子</button>
            <p className="meet-cta__hint">每次都是緣分，你不知道會遇見什麼</p>
          </div>
        )}

        {phase === 'rising' && (
          <p className="meet-rising-hint">海面有東西正在浮起……</p>
        )}
      </div>
    </div>
  );
}