function formatTime(date) {
  const now = new Date();
  const created = new Date(date);
  const diff = now - created;

  const second = Math.floor(diff / 1000);
  const minute = Math.floor(diff / (1000 * 60));
  const hour = Math.floor(diff / (1000 * 60 * 60));
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  const week = Math.floor(day / 7);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  if (year > 0) {
    return `${year} tahun yang lalu`;
  }

  if (month > 0) {
    return `${month} bulan yang lalu`;
  }

  if (week > 0) {
    return `${week} minggu yang lalu`;
  }

  if (day > 0) {
    return `${day} hari yang lalu`;
  }

  if (hour > 0) {
    return `${hour} jam yang lalu`;
  }

  if (minute > 0) {
    return `${minute} menit yang lalu`;
  }

  if (second > 5) {
    return `${second} detik yang lalu`;
  }

  return "Baru saja";
}

export { formatTime };