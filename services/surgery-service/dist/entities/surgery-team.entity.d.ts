export declare enum TeamMemberRole {
    SURGEON = "surgeon",
    ASSISTANT_SURGEON = "assistant_surgeon",
    ANESTHESIOLOGIST = "anesthesiologist",
    NURSE = "nurse",
    TECHNICIAN = "technician",
    RESIDENT = "resident",
    INTERN = "intern",
    OBSERVER = "observer"
}
export declare class SurgeryTeam {
    id: string;
    surgeryId: string;
    memberId: string;
    memberName: string;
    role: TeamMemberRole;
    specialty?: string;
    licenseNumber?: string;
    contactInfo?: string;
    notes?: string;
    isActive: boolean;
    assignedBy?: string;
    assignedAt?: Date;
    confirmedAt?: Date;
    declinedAt?: Date;
    declineReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
