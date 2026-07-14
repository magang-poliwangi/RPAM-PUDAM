export function hitungSkorRisiko(peluang, dampak) {
  const peluangScore = parseInt(peluang) || 0;
  const dampakScore = parseInt(dampak) || 0;
  return peluangScore * dampakScore;
}

export function hitungTingkatRisiko(skor) {
  if (skor >= 1 && skor <= 5) return 'Rendah';
  if (skor >= 6 && skor <= 10) return 'Medium';
  if (skor >= 11 && skor <= 15) return 'Tinggi';
  if (skor >= 16 && skor <= 20) return 'Sangat Tinggi';
  if (skor >= 21 && skor <= 25) return 'Ekstrem';
  return 'Rendah';
}


