import { PrescriptionService } from '../services/prescription.service';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';
export declare class PrescriptionController {
    private readonly prescriptionService;
    constructor(prescriptionService: PrescriptionService);
    create(createDto: CreatePrescriptionDto, user: any): Promise<import("../entities/prescription.entity").Prescription>;
    findAll(filters: any, user: any): Promise<{
        data: import("../entities/prescription.entity").Prescription[];
        total: number;
    }>;
    findOne(id: string, user: any): Promise<import("../entities/prescription.entity").Prescription>;
    update(id: string, updateDto: any, user: any): Promise<import("../entities/prescription.entity").Prescription>;
    approve(id: string, user: any): Promise<import("../entities/prescription.entity").Prescription>;
    reject(id: string, rejectionReason: string, user: any): Promise<import("../entities/prescription.entity").Prescription>;
    dispense(id: string, user: any): Promise<import("../entities/prescription.entity").Prescription>;
    complete(id: string, user: any): Promise<import("../entities/prescription.entity").Prescription>;
    cancel(id: string, cancellationReason: string, user: any): Promise<import("../entities/prescription.entity").Prescription>;
    getByPatient(patientId: string, user: any): Promise<import("../entities/prescription.entity").Prescription[]>;
    getByProvider(providerId: string, user: any): Promise<import("../entities/prescription.entity").Prescription[]>;
    getPendingPrescriptions(user: any): Promise<import("../entities/prescription.entity").Prescription[]>;
    getStatistics(user: any): Promise<any>;
    getPrescriptionHistory(patientId: string, medicationName: string, user: any): Promise<import("../entities/prescription.entity").Prescription[]>;
    checkDrugInteractions(medicationIds: string[], user: any): Promise<any>;
    checkAllergies(patientId: string, medicationName: string, user: any): Promise<any>;
}
