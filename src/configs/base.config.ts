export default () => ({
    port: process.env.PORT,
    db: {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/roameazy',
    },
    jwtSecret: process.env.JWT_SECRET,
    saltRounds: process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10,
    authCookieMaxAge: process.env.AUTH_COOKIE_MAX_AGE
      ? Number(process.env.AUTH_COOKIE_MAX_AGE)
      : 7 * 24 * 60,
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['localhost:3000', 'http://localhost:3000', 'localhost'],
  });