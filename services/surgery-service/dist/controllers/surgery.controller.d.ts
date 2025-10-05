import { SurgeryService } from '../services/surgery.service';
import { CreateSurgeryDto } from '../dto/create-surgery.dto';
export declare class SurgeryController {
    private readonly surgeryService;
    constructor(surgeryService: SurgeryService);
    create(createDto: CreateSurgeryDto, user: any): Promise<import("../entities/surgery.entity").Surgery>;
    findAll(filters: any, user: any): Promise<{
        data: import("../entities/surgery.entity").Surgery[];
        total: number;
    }>;
    findOne(id: string, user: any): Promise<import("../entities/surgery.entity").Surgery>;
    update(id: string, updateDto: any, user: any): Promise<import("../entities/surgery.entity").Surgery>;
    start(id: string, user: any): Promise<import("../entities/surgery.entity").Surgery>;
    complete(id: string, operativeNotes: string, user: any): Promise<import("../entities/surgery.entity").Surgery>;
    cancel(id: string, cancellationReason: string, user: any): Promise<import("../entities/surgery.entity").Surgery>;
    postpone(id: string, postponementReason: string, rescheduledDate: Date, user: any): Promise<import("../entities/surgery.entity").Surgery>;
    getByPatient(patientId: string, user: any): Promise<import("../entities/surgery.entity").Surgery[]>;
    getBySurgeon(surgeonId: string, user: any): Promise<import("../entities/surgery.entity").Surgery[]>;
    getScheduledSurgeries(user: any): Promise<import("../entities/surgery.entity").Surgery[]>;
    getUpcomingSurgeries(days?: number): Promise<import("../entities/surgery.entity").Surgery[]>;
    getStatistics(user: any): Promise<any>;
    getSurgeryHistory(patientId: string, user: any): Promise<import("../entities/surgery.entity").Surgery[]>;
}
