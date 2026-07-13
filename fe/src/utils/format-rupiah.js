export function formatRupiah(value) {
  return value != null ? `Rp ${Number(value).toLocaleString('id-ID')}` : '-';
}