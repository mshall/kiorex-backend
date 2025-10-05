import { NurseShiftService } from '../services/nurse-shift.service';
import { CreateNurseShiftDto } from '../dto/create-nurse-shift.dto';
export declare class NurseShiftController {
    private readonly nurseShiftService;
    constructor(nurseShiftService: NurseShiftService);
    create(createDto: CreateNurseShiftDto, user: any): Promise<import("../entities/nurse-shift.entity").NurseShift>;
    findAll(filters: any, user: any): Promise<{
        data: import("../entities/nurse-shift.entity").NurseShift[];
        total: number;
    }>;
    findOne(id: string, user: any): Promise<import("../entities/nurse-shift.entity").NurseShift>;
    update(id: string, updateDto: any, user: any): Promise<import("../entities/nurse-shift.entity").NurseShift>;
    start(id: string, user: any): Promise<import("../entities/nurse-shift.entity").NurseShift>;
    end(id: string, handoverNotes: string, user: any): Promise<import("../entities/nurse-shift.entity").NurseShift>;
    cancel(id: string, cancellationReason: string, user: any): Promise<import("../entities/nurse-shift.entity").NurseShift>;
    getByNurse(nurseId: string, user: any): Promise<import("../entities/nurse-shift.entity").NurseShift[]>;
    getByUnit(unit: string): Promise<import("../entities/nurse-shift.entity").NurseShift[]>;
    getCurrentShifts(): Promise<import("../entities/nurse-shift.entity").NurseShift[]>;
    getUpcomingShifts(days?: number): Promise<import("../entities/nurse-shift.entity").NurseShift[]>;
    getStatistics(user: any): Promise<any>;
    getWorkload(nurseId: string, startDate: Date, endDate: Date): Promise<any>;
}
