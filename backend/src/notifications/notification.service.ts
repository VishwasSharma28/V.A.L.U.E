import { prisma } from '../lib/prisma';
import { NotificationType, Prisma } from '@prisma/client';
import { emitNotification } from '../socket/io';

interface CreateNotificationInput {
  userId:   string;
  type:     NotificationType;
  title:    string;
  body:     string;
  metadata?: Record<string, unknown>;
}

export class NotificationService {
  static async create(input: CreateNotificationInput) {
    const notification = await prisma.notification.create({
      data: {
        userId:   input.userId,
        type:     input.type,
        title:    input.title,
        body:     input.body,
        // Cast metadata to Prisma's InputJsonValue
        metadata: input.metadata
          ? (input.metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });
    try { emitNotification(input.userId, notification); } catch { /* socket may not be ready */ }
    return notification;
  }

  static async getForUser(userId: string, page = 1, pageSize = 20) {
    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where:   { userId },
        orderBy: { createdAt: 'desc' },
        skip:    (page - 1) * pageSize,
        take:    pageSize,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);
    return { items, total };
  }

  static async markRead(id: string, _userId: string) {
    return prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  static async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data:  { isRead: true },
    });
  }

  static async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }
}
