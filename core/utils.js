export function getHash(string) {
  let hash = 0;
  let i;
  let chr;
  let len;

  if (string.length === 0) return hash;
  for (i = 0, len = string.length; i < len; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }

  return hash;
}
