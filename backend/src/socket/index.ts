import { Server } from 'socket.io';
import jwt         from 'jsonwebtoken';
import { env }     from '../config/env';
import { logger }  from '../utils/logger';
import { JwtPayload } from '../types';

export function registerSocketHandlers(io: Server) {
  // ── Auth middleware ──────────────────────────────────────
  io.use((socket, next) => {
    const token =
      socket.handshake.auth.token ??
      socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication required'));
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId as string;
    socket.join(`user:${userId}`);
    logger.debug(`[Socket] connected: ${userId} (${socket.id})`);

    socket.on('subscribe:dashboard', () => socket.join(`dashboard:${userId}`));
    socket.on('disconnect', () => logger.debug(`[Socket] disconnected: ${userId}`));
  });
}
