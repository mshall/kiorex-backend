export declare enum NoteType {
    ASSESSMENT = "assessment",
    CARE_PLAN = "care_plan",
    PROGRESS = "progress",
    MEDICATION = "medication",
    VITALS = "vitals",
    INCIDENT = "incident",
    HANDOVER = "handover",
    EDUCATION = "education",
    FAMILY = "family",
    DISCHARGE = "discharge"
}
export declare enum NotePriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class NurseNotes {
    id: string;
    patientId: string;
    nurseId: string;
    nurseName: string;
    noteType: NoteType;
    priority: NotePriority;
    content: string;
    summary?: string;
    tags?: string[];
    attachments?: {
        type: string;
        url: string;
        name: string;
        size: number;
    }[];
    relatedCare?: {
        careId: string;
        careType: string;
        relationship: string;
    }[];
    vitalSigns?: {
        temperature?: number;
        bloodPressure?: string;
        heartRate?: number;
        respiratoryRate?: number;
        oxygenSaturation?: number;
        painLevel?: number;
    };
    medications?: {
        name: string;
        dosage: string;
        route: string;
        time: string;
        response?: string;
    }[];
    assessments?: {
        type: string;
        findings: string;
        score?: number;
        recommendations?: string;
    }[];
    interventions?: {
        intervention: string;
        response: string;
        effectiveness: 'effective' | 'partially_effective' | 'ineffective';
        notes?: string;
    }[];
    patientResponse?: {
        verbal: string;
        nonVerbal: string;
        emotional: string;
        physical: string;
    };
    familyCommunication?: {
        present: boolean;
        concerns: string;
        questions: string;
        education: string;
    };
    safetyConcerns?: {
        concern: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        action: string;
        resolved: boolean;
    }[];
    carePlanUpdates?: {
        goal: string;
        intervention: string;
        evaluation: string;
        revision?: string;
    }[];
    requiresFollowUp: boolean;
    followUpTime?: Date;
    followUpNotes?: string;
    requiresSupervisorReview: boolean;
    supervisorId?: string;
    supervisorName?: string;
    reviewedBy?: string;
    reviewedAt?: Date;
    reviewComments?: string;
    isConfidential: boolean;
    isDraft: boolean;
    publishedAt?: Date;
    metadata?: {
        shiftId?: string;
        unit?: string;
        room?: string;
        bed?: string;
        diagnosis?: string;
        allergies?: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}
