//src/common/costants/jwt.constants.ts
export const JWT_CONFIG = {
  accessTtlSeconds: 900,   // 15 min 
  refreshTtlSeconds: 60 * 60 * 24 * 30, // 30 days
  // NOTA: La clave de firma se generará en tiempo de ejecución usando `env.JWT_SECRET` + `pepper`.
};
