import { Repository } from 'typeorm';
import { Prescription, PrescriptionStatus } from '../entities/prescription.entity';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';
export declare class PrescriptionService {
    private prescriptionRepository;
    constructor(prescriptionRepository: Repository<Prescription>);
    createPrescription(createDto: CreatePrescriptionDto, userId: string): Promise<Prescription>;
    getPrescriptions(userId: string, userRole: string, filters?: {
        patientId?: string;
        providerId?: string;
        status?: PrescriptionStatus;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        data: Prescription[];
        total: number;
    }>;
    getPrescription(id: string, userId: string, userRole: string): Promise<Prescription>;
    updatePrescription(id: string, updateDto: any, userId: string, userRole: string): Promise<Prescription>;
    approvePrescription(id: string, userId: string, userRole: string): Promise<Prescription>;
    rejectPrescription(id: string, rejectionReason: string, userId: string, userRole: string): Promise<Prescription>;
    dispensePrescription(id: string, userId: string, userRole: string): Promise<Prescription>;
    completePrescription(id: string, userId: string, userRole: string): Promise<Prescription>;
    cancelPrescription(id: string, cancellationReason: string, userId: string, userRole: string): Promise<Prescription>;
    getPrescriptionsByPatient(patientId: string, userId: string, userRole: string): Promise<Prescription[]>;
    getPrescriptionsByProvider(providerId: string, userId: string, userRole: string): Promise<Prescription[]>;
    getPendingPrescriptions(userId: string, userRole: string): Promise<Prescription[]>;
    getPrescriptionStatistics(userId: string, userRole: string): Promise<any>;
    getPrescriptionHistory(patientId: string, medicationName: string, userId: string, userRole: string): Promise<Prescription[]>;
    checkDrugInteractions(medicationIds: string[]): Promise<any>;
    checkAllergies(patientId: string, medicationName: string): Promise<any>;
}
