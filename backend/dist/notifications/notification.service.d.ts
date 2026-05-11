import { NotificationType, Prisma } from '@prisma/client';
interface CreateNotificationInput {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    metadata?: Record<string, unknown>;
}
export declare class NotificationService {
    static create(input: CreateNotificationInput): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        isRead: boolean;
        body: string;
        metadata: Prisma.JsonValue | null;
    }>;
    static getForUser(userId: string, page?: number, pageSize?: number): Promise<{
        items: {
            type: import(".prisma/client").$Enums.NotificationType;
            id: string;
            userId: string;
            createdAt: Date;
            title: string;
            isRead: boolean;
            body: string;
            metadata: Prisma.JsonValue | null;
        }[];
        total: number;
    }>;
    static markRead(id: string, _userId: string): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        isRead: boolean;
        body: string;
        metadata: Prisma.JsonValue | null;
    }>;
    static markAllRead(userId: string): Promise<Prisma.BatchPayload>;
    static getUnreadCount(userId: string): Promise<number>;
}
export {};
//# sourceMappingURL=notification.service.d.ts.map