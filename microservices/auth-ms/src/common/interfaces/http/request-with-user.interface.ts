// src/common/interfaces/http/request-with-user.interface.ts
import type { Request } from 'express';

export type RequestWithUser = Request & {
  user: {
    sub: string;
    email: string;
    roles: string[];   // ✔️ lista real de roles
  };
  sessionId?: string;
};
