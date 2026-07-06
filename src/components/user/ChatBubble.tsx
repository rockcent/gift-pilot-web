import './ChatBubble.scss';

export interface ChatBubbleProps {
  role: 'user' | 'assistant';
  text: string;
}

export function ChatBubble({ role, text }: ChatBubbleProps) {
  return (
    <div className={`gp-chat gp-chat--${role}`}>
      <div className="gp-chat__avatar">{role === 'assistant' ? '小礼' : '你'}</div>
      <div className="gp-chat__bubble">{text}</div>
    </div>
  );
}
