export declare enum InteractionSeverity {
    MINOR = "minor",
    MODERATE = "moderate",
    MAJOR = "major",
    CONTRAINDICATED = "contraindicated"
}
export declare class MedicationInteraction {
    id: string;
    medication1Id: string;
    medication1Name: string;
    medication2Id: string;
    medication2Name: string;
    severity: InteractionSeverity;
    description: string;
    mechanism?: string;
    clinicalEffects?: string;
    management?: string;
    monitoring?: string;
    references?: string[];
    isActive: boolean;
    lastUpdated?: Date;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
