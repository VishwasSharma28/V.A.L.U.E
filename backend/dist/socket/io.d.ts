import { Server } from 'socket.io';
export declare function setIO(io: Server): void;
export declare function getIO(): Server;
export declare function emitToUser(userId: string, event: string, data: unknown): void;
export declare function emitDashboardUpdate(userId: string, data: unknown): void;
export declare function emitNotification(userId: string, notification: unknown): void;
export declare function emitScoreUpdate(userId: string, subscriptionId: string, score: unknown): void;
//# sourceMappingURL=io.d.ts.map