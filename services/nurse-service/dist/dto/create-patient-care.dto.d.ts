import { CareType, Priority } from '../entities/patient-care.entity';
export declare class CreatePatientCareDto {
    patientId: string;
    nurseId: string;
    nurseName: string;
    careType: CareType;
    priority: Priority;
    scheduledTime: Date;
    description: string;
    instructions?: string;
    notes?: string;
    supervisorId?: string;
    supervisorName?: string;
    requiresFollowUp?: boolean;
    followUpTime?: Date;
}
