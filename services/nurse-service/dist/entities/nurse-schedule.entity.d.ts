export declare enum ScheduleStatus {
    AVAILABLE = "available",
    SCHEDULED = "scheduled",
    BLOCKED = "blocked",
    VACATION = "vacation",
    SICK_LEAVE = "sick_leave",
    TRAINING = "training"
}
export declare enum ScheduleType {
    REGULAR = "regular",
    OVERTIME = "overtime",
    ON_CALL = "on_call",
    FLOAT = "float",
    PRECEPTOR = "preceptor",
    CHARGE = "charge"
}
export declare class NurseSchedule {
    id: string;
    nurseId: string;
    nurseName: string;
    scheduleDate: Date;
    status: ScheduleStatus;
    type: ScheduleType;
    startTime?: string;
    endTime?: string;
    unit?: string;
    floor?: string;
    ward?: string;
    patientLoad?: number;
    notes?: string;
    responsibilities?: {
        role: string;
        description: string;
        priority: 'low' | 'medium' | 'high';
    }[];
    competencies?: {
        skill: string;
        level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
        verified: boolean;
        verifiedBy?: string;
        verifiedAt?: Date;
    }[];
    assignments?: {
        patientId: string;
        patientName: string;
        acuity: 'low' | 'medium' | 'high' | 'critical';
        specialNeeds?: string[];
    }[];
    breaks?: {
        startTime: string;
        endTime: string;
        type: 'meal' | 'rest' | 'personal';
        duration: number;
    }[];
    training?: {
        type: string;
        description: string;
        duration: number;
        instructor?: string;
        completed: boolean;
    }[];
    meetings?: {
        title: string;
        time: string;
        duration: number;
        location?: string;
        attendees?: string[];
        mandatory: boolean;
    }[];
    hours?: number;
    overtimeHours?: number;
    payRate?: number;
    totalPay?: number;
    supervisorId?: string;
    supervisorName?: string;
    scheduledBy?: string;
    scheduledAt?: Date;
    confirmedBy?: string;
    confirmedAt?: Date;
    declinedBy?: string;
    declinedAt?: Date;
    declineReason?: string;
    cancelledBy?: string;
    cancelledAt?: Date;
    cancellationReason?: string;
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
    isOnCall: boolean;
    isFloat: boolean;
    isCharge: boolean;
    isPreceptor: boolean;
    createdAt: Date;
    updatedAt: Date;
}
