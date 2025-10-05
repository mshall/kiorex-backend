import { Repository } from 'typeorm';
import { NurseNotes, NoteType } from '../entities/nurse-notes.entity';
import { CreateNurseNotesDto } from '../dto/create-nurse-notes.dto';
export declare class NurseNotesService {
    private nurseNotesRepository;
    constructor(nurseNotesRepository: Repository<NurseNotes>);
    createNurseNotes(createDto: CreateNurseNotesDto, userId: string): Promise<NurseNotes>;
    getNurseNotes(userId: string, userRole: string, filters?: {
        patientId?: string;
        nurseId?: string;
        noteType?: NoteType;
        priority?: string;
        isDraft?: boolean;
        isConfidential?: boolean;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        data: NurseNotes[];
        total: number;
    }>;
    getNurseNotesById(id: string, userId: string, userRole: string): Promise<NurseNotes>;
    updateNurseNotes(id: string, updateDto: any, userId: string, userRole: string): Promise<NurseNotes>;
    publishNotes(id: string, userId: string, userRole: string): Promise<NurseNotes>;
    reviewNotes(id: string, reviewComments: string, userId: string, userRole: string): Promise<NurseNotes>;
    deleteNurseNotes(id: string, userId: string, userRole: string): Promise<void>;
    getNotesByPatient(patientId: string, userId: string, userRole: string): Promise<NurseNotes[]>;
    getNotesByNurse(nurseId: string, userId: string, userRole: string): Promise<NurseNotes[]>;
    getDraftNotes(nurseId: string, userId: string, userRole: string): Promise<NurseNotes[]>;
    getNotesRequiringReview(): Promise<NurseNotes[]>;
    getNotesRequiringFollowUp(): Promise<NurseNotes[]>;
    getNotesStatistics(userId: string, userRole: string): Promise<any>;
    searchNotes(searchTerm: string, userId: string, userRole: string): Promise<NurseNotes[]>;
}
