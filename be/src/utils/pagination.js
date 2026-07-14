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