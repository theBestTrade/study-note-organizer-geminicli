export function formatDate(dateStr: string): { month: number; day: number; weekday: string } {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return { month, day, weekday };
}

export function formatYYMMDD(dateStr: string): string {
  const date = new Date(dateStr);
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

export function extractKeywords(content: string): [string, string] {
  const keywordMatch = content.match(/\[핵심 키워드\]\s*([\s\S]*)/);
  if (keywordMatch && keywordMatch[1]) {
    const keywords = keywordMatch[1]
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    if (keywords.length >= 2) {
      return [keywords[0], keywords[1]];
    }
  }
  return ['정리', '수업'];
}

export function cleanContent(content: string): string {
  return content.replace(/\[핵심 키워드\][\s\S]*/, '').trim();
}
