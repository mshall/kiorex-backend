import { SurgeryType, SurgeryCategory } from '../entities/surgery.entity';
export declare class CreateSurgeryDto {
    patientId: string;
    surgeonId: string;
    appointmentId?: string;
    procedureName: string;
    type: SurgeryType;
    category: SurgeryCategory;
    scheduledDate: Date;
    estimatedDuration?: number;
    operatingRoom?: string;
    description?: string;
    preoperativeNotes?: string;
    anesthesia?: string;
    equipment?: string[];
    medications?: string[];
    cost?: number;
    insuranceCoverage?: string;
    priorAuthorization?: string;
    consentForm?: string;
    followUpDate?: Date;
}
