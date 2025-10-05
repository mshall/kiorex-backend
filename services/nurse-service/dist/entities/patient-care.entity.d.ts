export declare enum CareType {
    MEDICATION = "medication",
    VITALS = "vitals",
    HYGIENE = "hygiene",
    MOBILITY = "mobility",
    NUTRITION = "nutrition",
    EMOTIONAL = "emotional",
    EDUCATION = "education",
    ASSESSMENT = "assessment",
    PROCEDURE = "procedure",
    EMERGENCY = "emergency"
}
export declare enum CareStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    MISSED = "missed"
}
export declare enum Priority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent",
    CRITICAL = "critical"
}
export declare class PatientCare {
    id: string;
    patientId: string;
    nurseId: string;
    nurseName: string;
    careType: CareType;
    status: CareStatus;
    priority: Priority;
    scheduledTime: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
    description: string;
    instructions?: string;
    notes?: string;
    outcome?: string;
    medications?: {
        name: string;
        dosage: string;
        route: string;
        time: string;
        given: boolean;
        givenAt?: Date;
        notes?: string;
    }[];
    vitals?: {
        temperature?: number;
        bloodPressure?: string;
        heartRate?: number;
        respiratoryRate?: number;
        oxygenSaturation?: number;
        painLevel?: number;
        recordedAt: Date;
    };
    assessments?: {
        type: string;
        findings: string;
        score?: number;
        notes?: string;
        assessedAt: Date;
    }[];
    procedures?: {
        name: string;
        description: string;
        completed: boolean;
        completedAt?: Date;
        complications?: string;
        notes?: string;
    }[];
    education?: {
        topic: string;
        method: string;
        duration: number;
        understood: boolean;
        questions?: string;
        notes?: string;
    };
    familyCommunication?: {
        contacted: boolean;
        method: string;
        information: string;
        concerns?: string;
        nextContact?: Date;
    };
    equipment?: {
        name: string;
        status: string;
        maintenance?: string;
        notes?: string;
    }[];
    safetyChecks?: {
        check: string;
        status: 'pass' | 'fail' | 'n/a';
        notes?: string;
        checkedAt: Date;
    }[];
    supervisorId?: string;
    supervisorName?: string;
    reviewedBy?: string;
    reviewedAt?: Date;
    reviewNotes?: string;
    duration?: number;
    requiresFollowUp: boolean;
    followUpTime?: Date;
    followUpNotes?: string;
    incidentReported: boolean;
    incidentDescription?: string;
    incidentSeverity?: 'low' | 'medium' | 'high' | 'critical';
    createdAt: Date;
    updatedAt: Date;
}
