export declare enum ShiftType {
    DAY = "day",
    EVENING = "evening",
    NIGHT = "night",
    ROTATING = "rotating"
}
export declare enum ShiftStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show"
}
export declare class NurseShift {
    id: string;
    nurseId: string;
    nurseName: string;
    shiftDate: Date;
    type: ShiftType;
    status: ShiftStatus;
    startTime: string;
    endTime: string;
    actualStartTime?: string;
    actualEndTime?: string;
    unit?: string;
    floor?: string;
    ward?: string;
    patientCount?: number;
    notes?: string;
    handoverNotes?: string;
    assignedPatients?: string[];
    tasks?: {
        task: string;
        completed: boolean;
        completedAt?: Date;
        notes?: string;
    }[];
    medications?: {
        patientId: string;
        medication: string;
        time: string;
        given: boolean;
        givenAt?: Date;
        notes?: string;
    }[];
    vitals?: {
        patientId: string;
        temperature?: number;
        bloodPressure?: string;
        heartRate?: number;
        respiratoryRate?: number;
        oxygenSaturation?: number;
        recordedAt: Date;
    }[];
    incidents?: {
        type: string;
        description: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        reportedAt: Date;
        resolved: boolean;
        resolution?: string;
    }[];
    supervisorId?: string;
    supervisorName?: string;
    breakStartTime?: string;
    breakEndTime?: string;
    breakDuration?: number;
    overtimeHours?: number;
    overtimeReason?: string;
    cancelledBy?: string;
    cancelledAt?: Date;
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
