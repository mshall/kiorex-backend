export declare enum ScheduleStatus {
    AVAILABLE = "available",
    BOOKED = "booked",
    BLOCKED = "blocked",
    MAINTENANCE = "maintenance"
}
export declare class SurgerySchedule {
    id: string;
    roomId: string;
    surgeonId?: string;
    surgeryId?: string;
    scheduledDate: Date;
    startTime: Date;
    endTime: Date;
    status: ScheduleStatus;
    notes?: string;
    blockedBy?: string;
    blockedAt?: Date;
    blockReason?: string;
    unblockedBy?: string;
    unblockedAt?: Date;
    recurringPattern?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        interval: number;
        daysOfWeek?: number[];
        endDate?: Date;
    };
    exceptions?: {
        date: Date;
        reason: string;
        action: 'block' | 'unblock' | 'modify';
    }[];
    cost?: number;
    createdBy?: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
