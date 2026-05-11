"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
const io_1 = require("../socket/io");
class NotificationService {
    static async create(input) {
        const notification = await prisma_1.prisma.notification.create({
            data: {
                userId: input.userId,
                type: input.type,
                title: input.title,
                body: input.body,
                // Cast metadata to Prisma's InputJsonValue
                metadata: input.metadata
                    ? input.metadata
                    : client_1.Prisma.JsonNull,
            },
        });
        try {
            (0, io_1.emitNotification)(input.userId, notification);
        }
        catch { /* socket may not be ready */ }
        return notification;
    }
    static async getForUser(userId, page = 1, pageSize = 20) {
        const [items, total] = await Promise.all([
            prisma_1.prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma_1.prisma.notification.count({ where: { userId } }),
        ]);
        return { items, total };
    }
    static async markRead(id, _userId) {
        return prisma_1.prisma.notification.update({ where: { id }, data: { isRead: true } });
    }
    static async markAllRead(userId) {
        return prisma_1.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    static async getUnreadCount(userId) {
        return prisma_1.prisma.notification.count({ where: { userId, isRead: false } });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map