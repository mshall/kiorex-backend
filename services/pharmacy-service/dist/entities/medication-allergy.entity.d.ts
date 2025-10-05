export declare enum AllergySeverity {
    MILD = "mild",
    MODERATE = "moderate",
    SEVERE = "severe",
    LIFE_THREATENING = "life_threatening"
}
export declare enum AllergyType {
    MEDICATION = "medication",
    FOOD = "food",
    ENVIRONMENTAL = "environmental",
    CONTACT = "contact"
}
export declare class MedicationAllergy {
    id: string;
    patientId: string;
    medicationId?: string;
    medicationName: string;
    allergyType: AllergyType;
    severity: AllergySeverity;
    description?: string;
    symptoms?: string;
    treatment?: string;
    notes?: string;
    onsetDate?: Date;
    lastOccurrence?: Date;
    reportedBy?: string;
    verifiedBy?: string;
    verifiedAt?: Date;
    isActive: boolean;
    crossReactions?: string[];
    alternativeMedications?: string[];
    documentation?: string[];
    createdAt: Date;
    updatedAt: Date;
}
