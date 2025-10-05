import { Repository } from 'typeorm';
import { NurseShift, ShiftStatus } from '../entities/nurse-shift.entity';
import { CreateNurseShiftDto } from '../dto/create-nurse-shift.dto';
export declare class NurseShiftService {
    private nurseShiftRepository;
    constructor(nurseShiftRepository: Repository<NurseShift>);
    createNurseShift(createDto: CreateNurseShiftDto, userId: string): Promise<NurseShift>;
    getNurseShifts(userId: string, userRole: string, filters?: {
        nurseId?: string;
        shiftDate?: Date;
        status?: ShiftStatus;
        type?: string;
        unit?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        data: NurseShift[];
        total: number;
    }>;
    getNurseShift(id: string, userId: string, userRole: string): Promise<NurseShift>;
    updateNurseShift(id: string, updateDto: any, userId: string, userRole: string): Promise<NurseShift>;
    startShift(id: string, userId: string, userRole: string): Promise<NurseShift>;
    endShift(id: string, handoverNotes: string, userId: string, userRole: string): Promise<NurseShift>;
    cancelShift(id: string, cancellationReason: string, userId: string, userRole: string): Promise<NurseShift>;
    getShiftsByNurse(nurseId: string, userId: string, userRole: string): Promise<NurseShift[]>;
    getShiftsByUnit(unit: string): Promise<NurseShift[]>;
    getCurrentShifts(): Promise<NurseShift[]>;
    getUpcomingShifts(days?: number): Promise<NurseShift[]>;
    getShiftStatistics(userId: string, userRole: string): Promise<any>;
    getNurseWorkload(nurseId: string, startDate: Date, endDate: Date): Promise<any>;
}
