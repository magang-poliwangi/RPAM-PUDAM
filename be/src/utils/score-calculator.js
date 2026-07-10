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

export function getPaginationQuery(req) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || parseInt(req.query.pageSize) || 10;
  const skip = (page - 1) * limit;

  // Validate sortOrder
  let sortOrder = 'desc';
  if (req.query.sortOrder && ['asc', 'desc'].includes(req.query.sortOrder.toLowerCase())) {
    sortOrder = req.query.sortOrder.toLowerCase();
  }
  
  const sortBy = req.query.sortBy || 'createdAt';

  return { page, limit, skip, sortBy, sortOrder };
}
