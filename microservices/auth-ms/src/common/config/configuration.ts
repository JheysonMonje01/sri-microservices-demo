//src/common/config/configuration.ts
/**
 * Mapea las variables de entorno a un objeto accesible en toda la app.
 */
export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL ?? '',
    shadowUrl: process.env.SHADOW_DATABASE_URL ?? '',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    ttl: parseInt(process.env.REDIS_TTL ?? '900', 10),
    password: process.env.REDIS_PASSWORD ?? '',
  },
});

