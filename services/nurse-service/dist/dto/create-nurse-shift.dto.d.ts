import { ShiftType } from '../entities/nurse-shift.entity';
export declare class CreateNurseShiftDto {
    nurseId: string;
    nurseName: string;
    shiftDate: Date;
    type: ShiftType;
    startTime: string;
    endTime: string;
    unit?: string;
    floor?: string;
    ward?: string;
    patientCount?: number;
    notes?: string;
    assignedPatients?: string[];
    supervisorId?: string;
    supervisorName?: string;
}
