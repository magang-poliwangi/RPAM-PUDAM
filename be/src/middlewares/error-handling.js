import { ClientError } from '../exceptions/client-error.js';
import logger from '../utils/logger.js';
import response from '../utils/response.js';

const FIELD_SENSITIF = ['password', 'token', 'refreshToken', 'accessToken'];

function redact(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const hasil = { ...obj };
  for (const key of FIELD_SENSITIF) {
    if (key in hasil) hasil[key] = '***';
  }
  return hasil;
}

function buildContext(req) {
  return {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id ?? null,
    params: req.params,
    query: req.query,
    body: redact(req.body),
  };
}

// eslint-disable-next-line no-unused-vars
const ErrorHandler = (err, req, res, next) => {
  const context = buildContext(req);

  if (err instanceof ClientError) {
    logger.warn({
      message: err.message,
      statusCode: err.statusCode,
      ...context,
    });
    return response(res, err.statusCode, err.message, null);
  }

  if (err.isJoi) {
    const pesan = err.details[0].message;
    logger.warn({
      message: `Validasi gagal: ${pesan}`,
      statusCode: 400,
      ...context,
    });
    return response(res, 400, pesan, null);
  }

  const status = err.statusCode || err.status || 500;
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: status,
    ...context,
  });

  return response(
    res,
    status,
    process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    null,
  );
};

export default ErrorHandler;