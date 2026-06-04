import React, { useMemo, useState } from 'react';
import './Echo.css';

const INIT_ECHOES = [
  {
    id: 1,
    time: '3 天前',
    original: '下午睡到四點，醒來突然不知道今天要幹嘛。',
    reply:
      '有陣子我也是這樣，時間一直過去，但感覺自己停在原地。',
    sealed: false,
    thread: [],
  },

  {
    id: 2,
    time: '昨天',
    original: '畢業倒數一個月，我履歷還是一片空白。',
    reply:
      '看到這句有點想笑，因為我的資料夾也還是空的。',
    sealed: false,
    thread: [],
  },

  {
    id: 3,
    time: '1 小時前',
    original: '有人突然傳了一段很真誠的話給我，我看了三遍。',
    reply:
      '能讓人反覆讀的訊息其實很少，好好收著。',
    sealed: false,
    thread: [
      {
        from: 'me',
        text: '後來回了一句謝謝，但其實想說的更多。',
      },
    ],
  },

  {
    id: 4,
    time: '2 小時前',
    original: '下雨天一個人吃火鍋好像有點可憐。',
    reply:
      '但火鍋應該不會介意你是一個人。',
    sealed: false,
    thread: [],
  },

  {
    id: 5,
    time: '5 天前',
    original: '發完限動又跑回去看誰看過。',
    reply:
      '明明不想被注意，卻又偷偷期待有人發現。',
    sealed: false,
    thread: [
      {
        from: 'me',
        text: '被你說中了。',
      },
      {
        from: 'them',
        text: '我們好像都一樣矛盾。',
      },
    ],
  },

  {
    id: 6,
    time: '6 小時前',
    original: '今天跟朋友吃飯一直在笑，回家卻有點想哭。',
    reply:
      '情緒有時候會慢半拍，回到安靜的地方才追上來。',
    sealed: false,
    thread: [],
  },

  {
    id: 7,
    time: '8 小時前',
    original: '把聊天紀錄翻到很前面，然後什麼都沒做。',
    reply:
      '有些人已經離開很久了，但還是住在某幾頁對話裡。',
    sealed: false,
    thread: [],
  },


];

const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

const createBottleLayout = (echoes) => {
  const count = echoes.length;
  const slotCenters = count > 0
    ? Array.from({ length: count }, (_, i) => 10 + (i + 0.5) * (80 / count))
    : [50];

  const slotOrder = Array.from({ length: count }, (_, i) => ({
    idx: i,
    value: seededRandom((echoes[i].id * 131) + 7),
  }))
    .sort((a, b) => a.value - b.value)
    .map(item => item.idx);

  return echoes.reduce((acc, echo, index) => {
    const seed = (echo.id * 31) + (index * 17);
    const rawBottom = seededRandom(seed + 1);
    const slotIndex = slotOrder[index];
    const baseLeft = slotCenters[slotIndex];
    const jitter = (seededRandom(seed + 2) - 0.5) * (80 / Math.max(count, 1)) * 0.3;
    const left = Math.min(90, Math.max(10, baseLeft + jitter));

    acc[echo.id] = {
      left,
      bottom: 3 + rawBottom * 15,
      scale: 0.55 + seededRandom(seed + 3) * 0.45,
      rotate: -18 + seededRandom(seed + 4) * 36,
      delay: seededRandom(seed + 5) * -4,
      duration: 5.5 + seededRandom(seed + 6) * 3.5,
      opacity: 0.75 + seededRandom(seed + 7) * 0.25,
      zIndex: Math.round(20 + seededRandom(seed + 8) * 40),
    };
    return acc;
  }, {});
};

export default function Echo() {
  const [echoes, setEchoes] = useState(INIT_ECHOES);
  const [fading, setFading] = useState({});
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [activeEchoId, setActiveEchoId] = useState(null); // 預設不選中任何瓶子，點擊才觸發儀式

  const bottleLayout = useMemo(() => createBottleLayout(echoes), [echoes]);
  const activeEcho = echoes.find(e => e.id === activeEchoId);
  const allSealed = echoes.length > 0 && echoes.every(e => e.sealed);
  const totalReplies = useMemo(() => {
    return echoes.reduce((acc, e) => acc + (e.reply && e.reply.trim() ? 1 : 0) + (e.thread ? e.thread.length : 0), 0);
  }, [echoes]);

  const handleSeal = (id) => {
    setReplyingId(null);
    setFading(f => ({ ...f, [id]: true }));
    setTimeout(() => {
      setEchoes(prev => prev.map(e => e.id === id ? { ...e, sealed: true } : e));
      setFading(f => {
        const n = { ...f };
        delete n[id];
        return n;
      });
    }, 550);
  };

  const handleOpenReply = (id) => {
    setActiveEchoId(id);
    setReplyingId(id);
    setReplyText('');
  };

  const handleSendReply = (id) => {
    if (!replyText.trim()) return;
    const newMsg = { from: 'me', text: replyText.trim() };
    setEchoes(prev => prev.map(e =>
      e.id === id ? { ...e, thread: [...e.thread, newMsg] } : e
    ));
    setReplyingId(null);
    setReplyText('');
  };

  const handleReopen = (id) => {
    setEchoes(prev => prev.map(e => e.id === id ? { ...e, sealed: false } : e));
    setActiveEchoId(id);
    setReplyingId(id);
    setReplyText('');
  };

  return (
    <div className="page echo-page">
      {/* 漂流瓶層 */}
      <div className="echo-bottles-layer" aria-hidden="true">
        {echoes.map((e, index) => {
          const layout = bottleLayout[e.id];
          if (!layout) return null;
          
          const isActive = activeEchoId === e.id;
          const hasActiveAny = activeEchoId !== null;

          return (
            <button
              key={e.id}
              type="button"
              className={`drift-bottle 
                ${isActive ? 'drift-bottle--active' : ''} 
                ${hasActiveAny && !isActive ? 'drift-bottle--inactive' : ''} 
                ${e.sealed ? 'drift-bottle--sealed' : ''}`}
              style={{
                '--bottle-left': `${layout.left}%`,
                '--bottle-bottom': `${layout.bottom}%`,
                '--bottle-scale': layout.scale,
                '--bottle-rotate': `${layout.rotate}deg`,
                '--bottle-delay': `${layout.delay}s`,
                '--bottle-duration': `${layout.duration}s`,
                '--bottle-opacity': layout.opacity,
                zIndex: isActive ? 999 : layout.zIndex,
              }}
              onClick={() => {
                // 如果點擊已選中的，就關閉它回到海面
                if (isActive) {
                  setActiveEchoId(null);
                } else {
                  setActiveEchoId(e.id);
                }
                setReplyingId(null);
              }}
              aria-label={`第 ${index + 1} 個漂流瓶，${e.time} 的回應`}
            >
              <span className="drift-bottle__shadow" />
              <span className="drift-bottle__glass">
                <span className="drift-bottle__neck" />
                <span className="drift-bottle__cork" />
                <span className="drift-bottle__paper" />
                <span className="drift-bottle__shine" />
              </span>
              <span className="drift-bottle__ripple" />
            </button>
          );
        })}
      </div>

      <div className="page-header">
        <div className="page-header__eyebrow">VOICES FROM THE SEA</div>
        <h2 className="page-header__title">回聲</h2>
        <p className="page-header__sub">點擊海浪中的漂流瓶，開啟心事回聲</p>
        <p className="page-header__meta">目前共有 <strong>{totalReplies}</strong> 則回信</p>
      </div>

      {activeEcho && (
        <section
          key={activeEcho.id} /* 關鍵：切換 ID 時重新觸發 CSS 動畫 */
          className={`echo-card card ${fading[activeEcho.id] ? 'echo-card--fading' : ''} ${activeEcho.sealed ? 'echo-card--sealed' : ''}`}
        >
          {/* 關閉按鈕，方便隨時把卡片收回瓶子丟回海裡 */}
          <button 
            type="button" 
            className="echo-card__close" 
            onClick={() => setActiveEchoId(null)}
            aria-label="收起卡片"
          >
            ✕
          </button>

          <div className="echo-card__meta">
            <span className="echo-card__time">{activeEcho.time}</span>
            <span className="echo-card__badge">有人回應了你</span>
          </div>

          <blockquote className="echo-card__original">「{activeEcho.original}」</blockquote>

          <div className="echo-thread">
            <div className="echo-thread__msg echo-thread__msg--them">
              <span className="echo-thread__label">對方</span>
              <p className="echo-thread__text">{activeEcho.reply}</p>
            </div>

            {activeEcho.thread.map((msg, idx) => (
              <div
                key={idx}
                className={`echo-thread__msg echo-thread__msg--${msg.from}`}
              >
                <span className="echo-thread__label">{msg.from === 'me' ? '我' : '對方'}</span>
                <p className="echo-thread__text">{msg.text}</p>
              </div>
            ))}
          </div>

          {replyingId === activeEcho.id && (
            <div className="echo-reply-box">
              <textarea
                className="form-textarea echo-reply-box__textarea"
                placeholder="繼續說……"
                value={replyText}
                onChange={ev => setReplyText(ev.target.value)}
                rows={3}
                autoFocus
              />
              <div className="echo-reply-box__actions">
                <button
                  className="btn btn--gold echo-reply-box__send"
                  onClick={() => handleSendReply(activeEcho.id)}
                  disabled={!replyText.trim()}
                >
                  送出
                </button>
                <button
                  className="btn btn--ghost echo-reply-box__cancel"
                  onClick={() => setReplyingId(null)}
                >
                  取消
                </button>
              </div>
            </div>
          )}

          <div className="echo-card__footer">
            {!activeEcho.sealed && replyingId !== activeEcho.id && (
              <>
                <button
                  className="echo-btn echo-btn--continue"
                  onClick={() => handleOpenReply(activeEcho.id)}
                >
                  繼續說
                </button>
                <button
                  className="echo-btn"
                  onClick={() => handleSeal(activeEcho.id)}
                >
                  就到這裡
                </button>
              </>
            )}

            {activeEcho.sealed && (
              <>
                <button className="echo-btn echo-btn--sealed" disabled>
                  已封存
                </button>
                <button
                  className="echo-btn echo-btn--reopen"
                  onClick={() => handleReopen(activeEcho.id)}
                >
                  再回覆一次
                </button>
                <span className="echo-card__sealed-label">已自動封存於海底</span>
              </>
            )}
          </div>
        </section>
      )}

      {allSealed && (
        <div className="echo-empty">
          <span className="echo-empty__icon" aria-hidden="true">🌊</span>
          <p className="echo-empty__text">所有回聲都已封存於海底</p>
        </div>
      )}
    </div>
  );
}