import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatBubble } from '../../components/user/ChatBubble';
import { useAIStore } from '../../stores/ai-store';
import { formatYuan } from '../../utils/money';
import './HomePage.scss';

export function HomePage() {
  const [input, setInput] = useState('');
  const askHistory = useAIStore((s) => s.askHistory);
  const recommendation = useAIStore((s) => s.recommendation);
  const ask = useAIStore((s) => s.ask);
  const navigate = useNavigate();

  const onSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await ask(text);
  };

  return (
    <div className="gp-home">
      <section className="gp-home__hero">
        <div className="gp-home__hero-row">
          <div className="gp-home__avatar">小礼</div>
          <div>
            <div className="gp-home__hero-title">Hi，我是小礼 👋</div>
            <div className="gp-home__hero-sub">你的 AI 礼物经营助手</div>
          </div>
        </div>
        <p className="gp-home__hero-quote">
          今天准备送谁、预算多少、什么场景，我来帮你想得体又有新意。
        </p>
      </section>

      {askHistory.length > 0 && (
        <section className="gp-home__chat">
          {askHistory.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} />
          ))}
        </section>
      )}

      {recommendation && (
        <section className="gp-card gp-home__card">
          <h2 className="gp-h2">{recommendation.match_label}</h2>
          <div className="gp-home__overview">
            <div className="gp-home__overview-row">
              <span className="gp-caption">对象</span><span>{recommendation.query.relation}</span>
            </div>
            <div className="gp-home__overview-row">
              <span className="gp-caption">场景</span><span>{recommendation.query.scene}</span>
            </div>
            <div className="gp-home__overview-row">
              <span className="gp-caption">预算</span><span>{formatYuan(recommendation.query.budget_fen)}</span>
            </div>
          </div>
          <button className="gp-btn gp-btn--primary" onClick={() => navigate('/recommend')}>
            查看推荐 →
          </button>
        </section>
      )}

      <section className="gp-card gp-home__card">
        <h2 className="gp-h2">🔥 今日推荐机会</h2>
        <div className="gp-home__hscroll">
          <div className="gp-home__horiz-card">
            <div className="gp-home__horiz-cover">🎁</div>
            <div>
              <div className="gp-home__horiz-title">母亲节：送长辈健康礼物</div>
              <div className="gp-home__horiz-meta">首推花盒 ¥26.60</div>
              <span className="gp-pill gp-pill--green">一键生成</span>
            </div>
          </div>
          <div className="gp-home__horiz-card">
            <div className="gp-home__horiz-cover">🌸</div>
            <div>
              <div className="gp-home__horiz-title">生日：送闺蜜永生花</div>
              <div className="gp-home__horiz-meta">首推花盒 ¥16.60</div>
              <span className="gp-pill gp-pill--green">一键生成</span>
            </div>
          </div>
          <div className="gp-home__horiz-card">
            <div className="gp-home__horiz-cover">🌿</div>
            <div>
              <div className="gp-home__horiz-title">同事：香氛礼盒</div>
              <div className="gp-home__horiz-meta">首推 ¥19.90 起</div>
              <span className="gp-pill gp-pill--green">一键生成</span>
            </div>
          </div>
        </div>
      </section>

      <section className="gp-home__input-card">
        <textarea
          className="gp-home__textarea"
          placeholder="说说你今天想送谁、预算多少..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          rows={3}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <button className="gp-btn gp-btn--ghost" onClick={() => setInput('')}>清空</button>
          <button className="gp-btn gp-btn--primary" onClick={onSend} disabled={!input.trim()}>
            发送给小礼
          </button>
        </div>
      </section>
    </div>
  );
}
