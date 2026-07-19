 export function generateKode(prefix, nextNumber, { padLength = 0 } = {}) {
  const num = padLength > 0 ? String(nextNumber).padStart(padLength, '0') : String(nextNumber);
  return `${prefix}${num}`;
}

 export function parseKodeNumber(kode, prefix) {
  if (!kode) return 0;
  const match = kode.match(new RegExp(`^${prefix}(\\d+)$`));
  return match ? parseInt(match[1], 10) : 0;
}


export const generateKodeRisiko = (prefix, n) => generateKode(prefix, n, { padLength: 4 });
export const parseKodeRisikoNumber = parseKodeNumber;