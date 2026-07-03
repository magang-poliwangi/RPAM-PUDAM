const response = (res, statusCode, message, data) => {
  const body = {
    status: statusCode < 400 ? 'success' : statusCode < 500 ? 'fail' : 'error',
  };
  if (message) body.message = message;
  if (data !== undefined && data !== null) body.data = data;
  return res.status(statusCode).json(body);
};
export default response;