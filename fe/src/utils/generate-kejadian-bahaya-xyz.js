export const generateKejadianBahaya = (x, y, z) => {
  if (!x && !y && !z) return "";

  return `${x ?? ""} terjadi pada ${y ?? ""} dikarenakan ${z ?? ""}`.trim();
};