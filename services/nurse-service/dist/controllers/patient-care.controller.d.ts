import { PatientCareService } from '../services/patient-care.service';
import { CreatePatientCareDto } from '../dto/create-patient-care.dto';
export declare class PatientCareController {
    private readonly patientCareService;
    constructor(patientCareService: PatientCareService);
    create(createDto: CreatePatientCareDto, user: any): Promise<import("../entities/patient-care.entity").PatientCare>;
    findAll(filters: any, user: any): Promise<{
        data: import("../entities/patient-care.entity").PatientCare[];
        total: number;
    }>;
    findOne(id: string, user: any): Promise<import("../entities/patient-care.entity").PatientCare>;
    update(id: string, updateDto: any, user: any): Promise<import("../entities/patient-care.entity").PatientCare>;
    start(id: string, user: any): Promise<import("../entities/patient-care.entity").PatientCare>;
    complete(id: string, outcome: string, notes: string, user: any): Promise<import("../entities/patient-care.entity").PatientCare>;
    cancel(id: string, reason: string, user: any): Promise<import("../entities/patient-care.entity").PatientCare>;
    getByPatient(patientId: string, user: any): Promise<import("../entities/patient-care.entity").PatientCare[]>;
    getByNurse(nurseId: string, user: any): Promise<import("../entities/patient-care.entity").PatientCare[]>;
    getPendingCare(): Promise<import("../entities/patient-care.entity").PatientCare[]>;
    getOverdueCare(): Promise<import("../entities/patient-care.entity").PatientCare[]>;
    getStatistics(user: any): Promise<any>;
    getWorkload(nurseId: string, startDate: Date, endDate: Date): Promise<any>;
}
