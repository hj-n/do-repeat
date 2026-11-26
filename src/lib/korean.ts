/** 단어 끝 글자에 받침이 있는지 (한글이 아니면 null) */
function hasFinalConsonant(word: string): boolean | null {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return null;
  return (code - 0xac00) % 28 !== 0;
}

/** "운동" → "운동을", "독서" → "독서를" */
export function withObjectParticle(word: string): string {
  const final = hasFinalConsonant(word);
  if (final === null) return `${word}을(를)`;
  return `${word}${final ? '을' : '를'}`;
}
