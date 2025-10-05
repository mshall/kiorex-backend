import { NoteType, NotePriority } from '../entities/nurse-notes.entity';
export declare class CreateNurseNotesDto {
    patientId: string;
    nurseId: string;
    nurseName: string;
    noteType: NoteType;
    priority: NotePriority;
    content: string;
    summary?: string;
    tags?: string[];
    requiresFollowUp?: boolean;
    followUpTime?: Date;
    requiresSupervisorReview?: boolean;
    supervisorId?: string;
    supervisorName?: string;
    isConfidential?: boolean;
    isDraft?: boolean;
}
