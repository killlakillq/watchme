export const CORS = {
  ORIGIN: [process.env.CORS_ORIGIN],
  METHODS: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS']
};

export const APP = {
  PORT: Number(process.env.APP_PORT),
  GLOBAL_PREFIX: 'api',
  URL: process.env.APP_URL
};
