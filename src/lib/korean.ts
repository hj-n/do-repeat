/** 단어 끝 글자에 받침이 있는지 (한글이 아니면 null) */
function hasFinalConsonant(word: string): boolean | null {
  const code = word.trim().slice(-1).charCodeAt(0);
  if (Number.isNaN(code) || code < 0xac00 || code > 0xd7a3) return null;
  return (code - 0xac00) % 28 !== 0;
}

/**
 * 받침에 맞는 조사를 붙입니다.
 * withParticle('운동', '을', '를') → '운동을', withParticle('독서', '을', '를') → '독서를'
 * 한글로 끝나지 않으면 '을(를)'처럼 둘 다 씁니다.
 */
export function withParticle(word: string, afterConsonant: string, afterVowel: string): string {
  const final = hasFinalConsonant(word);
  if (final === null) return `${word}${afterConsonant}(${afterVowel})`;
  return `${word}${final ? afterConsonant : afterVowel}`;
}
