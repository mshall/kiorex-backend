import { Repository } from 'typeorm';
import { Surgery, SurgeryStatus } from '../entities/surgery.entity';
import { CreateSurgeryDto } from '../dto/create-surgery.dto';
export declare class SurgeryService {
    private surgeryRepository;
    constructor(surgeryRepository: Repository<Surgery>);
    createSurgery(createDto: CreateSurgeryDto, userId: string): Promise<Surgery>;
    getSurgeries(userId: string, userRole: string, filters?: {
        patientId?: string;
        surgeonId?: string;
        status?: SurgeryStatus;
        type?: string;
        category?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        data: Surgery[];
        total: number;
    }>;
    getSurgery(id: string, userId: string, userRole: string): Promise<Surgery>;
    updateSurgery(id: string, updateDto: any, userId: string, userRole: string): Promise<Surgery>;
    startSurgery(id: string, userId: string, userRole: string): Promise<Surgery>;
    completeSurgery(id: string, operativeNotes: string, userId: string, userRole: string): Promise<Surgery>;
    cancelSurgery(id: string, cancellationReason: string, userId: string, userRole: string): Promise<Surgery>;
    postponeSurgery(id: string, postponementReason: string, rescheduledDate: Date, userId: string, userRole: string): Promise<Surgery>;
    getSurgeriesByPatient(patientId: string, userId: string, userRole: string): Promise<Surgery[]>;
    getSurgeriesBySurgeon(surgeonId: string, userId: string, userRole: string): Promise<Surgery[]>;
    getScheduledSurgeries(userId: string, userRole: string): Promise<Surgery[]>;
    getSurgeryStatistics(userId: string, userRole: string): Promise<any>;
    getSurgeryHistory(patientId: string, userId: string, userRole: string): Promise<Surgery[]>;
    getUpcomingSurgeries(days?: number): Promise<Surgery[]>;
}
