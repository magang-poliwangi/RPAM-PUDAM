import dotenv from 'dotenv';
// Load base .env first
dotenv.config({ path: '.env' });
// Then override with environment-specific file if it exists
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
  override: true,
});
