//src/common/config/configuration.ts
export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  jwtSecret: process.env.JWT_SECRET ?? 'default_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  authService: {
    host: process.env.AUTH_MS_HOST ?? 'auth-ms',
    port: parseInt(process.env.AUTH_MS_PORT ?? '4001', 10),
  },
});
