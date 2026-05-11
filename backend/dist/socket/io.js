"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIO = setIO;
exports.getIO = getIO;
exports.emitToUser = emitToUser;
exports.emitDashboardUpdate = emitDashboardUpdate;
exports.emitNotification = emitNotification;
exports.emitScoreUpdate = emitScoreUpdate;
// Shared singleton — set once in server.ts, used throughout the app
let _io = null;
function setIO(io) {
    _io = io;
}
function getIO() {
    if (!_io)
        throw new Error('Socket.IO not initialised yet');
    return _io;
}
function emitToUser(userId, event, data) {
    getIO().to(`user:${userId}`).emit(event, data);
}
function emitDashboardUpdate(userId, data) {
    emitToUser(userId, 'dashboard:update', data);
}
function emitNotification(userId, notification) {
    emitToUser(userId, 'notification:new', notification);
}
function emitScoreUpdate(userId, subscriptionId, score) {
    emitToUser(userId, 'score:updated', { subscriptionId, score });
}
//# sourceMappingURL=io.js.map