// Simple markdown renderer utility
export function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;
  let inList = false;
  let listItems: JSX.Element[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={key++} className="list-disc list-inside space-y-3 mb-6 text-white/60 font-body">{listItems}</ul>);
      listItems = [];
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={key++} className="font-display text-4xl md:text-5xl font-bold mb-8 mt-12 tracking-tighter uppercase italic text-primary">{trimmed.slice(2)}</h1>);
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={key++} className="font-display text-2xl md:text-3xl font-bold mb-6 mt-10 tracking-tight text-white uppercase">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={key++} className="font-display text-xl font-bold mb-4 mt-8 text-white/90 uppercase tracking-wide">{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      const content = trimmed.slice(2);
      const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
      listItems.push(<li key={key++} className="pl-2" dangerouslySetInnerHTML={{ __html: formattedContent }} />);
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      const formattedContent = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
      elements.push(<p key={key++} className="text-white/60 mb-6 font-body leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: formattedContent }} />);
    }
  }
  
  flushList();
  return elements;
}
