//src/common/interfaces/http/logout-request.interface.ts

import type { Request } from 'express';
import type { AuthPayload } from '../auth-payload.interface';

export interface LogoutRequest extends Request {
  user: AuthPayload;
  body: {
    session_id?: string;
  };
}
