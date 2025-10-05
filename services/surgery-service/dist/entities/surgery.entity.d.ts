export declare enum SurgeryStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    POSTPONED = "postponed"
}
export declare enum SurgeryType {
    ELECTIVE = "elective",
    EMERGENCY = "emergency",
    URGENT = "urgent"
}
export declare enum SurgeryCategory {
    CARDIAC = "cardiac",
    NEUROSURGERY = "neurosurgery",
    ORTHOPEDIC = "orthopedic",
    GENERAL = "general",
    PLASTIC = "plastic",
    UROLOGY = "urology",
    GYNECOLOGY = "gynecology",
    ONCOLOGY = "oncology",
    PEDIATRIC = "pediatric",
    TRAUMA = "trauma"
}
export declare class Surgery {
    id: string;
    patientId: string;
    surgeonId: string;
    appointmentId?: string;
    procedureName: string;
    type: SurgeryType;
    category: SurgeryCategory;
    status: SurgeryStatus;
    scheduledDate: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
    estimatedDuration?: number;
    actualDuration?: number;
    operatingRoom?: string;
    description?: string;
    preoperativeNotes?: string;
    operativeNotes?: string;
    postoperativeNotes?: string;
    complications?: string;
    anesthesia?: string;
    bloodLoss?: string;
    specimens?: string;
    teamMembers?: {
        surgeon?: string;
        assistantSurgeon?: string;
        anesthesiologist?: string;
        nurse?: string;
        technician?: string;
    };
    equipment?: string[];
    medications?: string[];
    complicationsList?: string[];
    followUpInstructions?: string[];
    cost?: number;
    insuranceCoverage?: string;
    priorAuthorization?: string;
    consentForm?: string;
    preoperativeChecklist?: string;
    postoperativeChecklist?: string;
    dischargeInstructions?: string;
    followUpDate?: Date;
    cancelledBy?: string;
    cancelledAt?: Date;
    cancellationReason?: string;
    postponedBy?: string;
    postponedAt?: Date;
    postponementReason?: string;
    rescheduledDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
