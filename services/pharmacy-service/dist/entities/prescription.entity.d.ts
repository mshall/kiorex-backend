export declare enum PrescriptionStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    DISPENSED = "dispensed",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum PrescriptionPriority {
    ROUTINE = "routine",
    URGENT = "urgent",
    STAT = "stat"
}
export declare class Prescription {
    id: string;
    patientId: string;
    providerId: string;
    appointmentId?: string;
    medicationId?: string;
    medicationName: string;
    genericName?: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity?: number;
    instructions?: string;
    clinicalNotes?: string;
    status: PrescriptionStatus;
    priority: PrescriptionPriority;
    prescribedBy?: string;
    prescribedAt?: Date;
    approvedBy?: string;
    approvedAt?: Date;
    rejectedBy?: string;
    rejectedAt?: Date;
    rejectionReason?: string;
    dispensedBy?: string;
    dispensedAt?: Date;
    completedAt?: Date;
    cancelledBy?: string;
    cancelledAt?: Date;
    cancellationReason?: string;
    refills?: {
        authorized: number;
        remaining: number;
        lastRefillDate?: Date;
    };
    drugInteractions?: string[];
    allergies?: string[];
    contraindications?: string[];
    totalCost?: number;
    patientCost?: number;
    insuranceCost?: number;
    insuranceCoverage?: string;
    priorAuthorization?: string;
    sideEffects?: string[];
    monitoring?: string[];
    followUpDate?: Date;
    followUpNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}
