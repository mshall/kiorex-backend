import { Repository } from 'typeorm';
import { PatientCare, CareStatus } from '../entities/patient-care.entity';
import { CreatePatientCareDto } from '../dto/create-patient-care.dto';
export declare class PatientCareService {
    private patientCareRepository;
    constructor(patientCareRepository: Repository<PatientCare>);
    createPatientCare(createDto: CreatePatientCareDto, userId: string): Promise<PatientCare>;
    getPatientCare(userId: string, userRole: string, filters?: {
        patientId?: string;
        nurseId?: string;
        careType?: string;
        status?: CareStatus;
        priority?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        data: PatientCare[];
        total: number;
    }>;
    getPatientCareById(id: string, userId: string, userRole: string): Promise<PatientCare>;
    updatePatientCare(id: string, updateDto: any, userId: string, userRole: string): Promise<PatientCare>;
    startCare(id: string, userId: string, userRole: string): Promise<PatientCare>;
    completeCare(id: string, outcome: string, notes: string, userId: string, userRole: string): Promise<PatientCare>;
    cancelCare(id: string, reason: string, userId: string, userRole: string): Promise<PatientCare>;
    getCareByPatient(patientId: string, userId: string, userRole: string): Promise<PatientCare[]>;
    getCareByNurse(nurseId: string, userId: string, userRole: string): Promise<PatientCare[]>;
    getPendingCare(): Promise<PatientCare[]>;
    getOverdueCare(): Promise<PatientCare[]>;
    getCareStatistics(userId: string, userRole: string): Promise<any>;
    getNurseCareWorkload(nurseId: string, startDate: Date, endDate: Date): Promise<any>;
}
