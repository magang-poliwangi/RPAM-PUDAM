// Konversi enum Prisma <-> kolom checkbox "v" di Excel (Efektif/Tidak Efektif/Tidak Pasti, Pendek/Menengah/Panjang)

export function boolToCheck(value) {
  return value ? "v" : "";
}

export function checkToBool(value) {
  return String(value ?? "").trim().toLowerCase() === "v";
}

export function validasiChecks(validasi) {
  return {
    efektif: boolToCheck(validasi === "EFEKTIF"),
    tidakEfektif: boolToCheck(validasi === "TIDAK_EFEKTIF"),
    tidakPasti: boolToCheck(validasi === "TIDAK_PASTI"),
  };
}

export function validasiFromChecks({ efektif, tidakEfektif, tidakPasti }) {
  if (checkToBool(efektif)) return "EFEKTIF";
  if (checkToBool(tidakEfektif)) return "TIDAK_EFEKTIF";
  if (checkToBool(tidakPasti)) return "TIDAK_PASTI";
  return null;
}

export function prioritasChecks(prioritas) {
  return {
    pendek: boolToCheck(prioritas === "PENDEK"),
    menengah: boolToCheck(prioritas === "MENENGAH"),
    panjang: boolToCheck(prioritas === "PANJANG"),
  };
}

export function prioritasFromChecks({ pendek, menengah, panjang }) {
  if (checkToBool(pendek)) return "PENDEK";
  if (checkToBool(menengah)) return "MENENGAH";
  if (checkToBool(panjang)) return "PANJANG";
  return null;
}