import { Server } from 'socket.io';

// Shared singleton — set once in server.ts, used throughout the app
let _io: Server | null = null;

export function setIO(io: Server) {
  _io = io;
}

export function getIO(): Server {
  if (!_io) throw new Error('Socket.IO not initialised yet');
  return _io;
}

export function emitToUser(userId: string, event: string, data: unknown) {
  getIO().to(`user:${userId}`).emit(event, data);
}

export function emitDashboardUpdate(userId: string, data: unknown) {
  emitToUser(userId, 'dashboard:update', data);
}

export function emitNotification(userId: string, notification: unknown) {
  emitToUser(userId, 'notification:new', notification);
}

export function emitScoreUpdate(userId: string, subscriptionId: string, score: unknown) {
  emitToUser(userId, 'score:updated', { subscriptionId, score });
}
