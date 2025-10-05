import { NurseNotesService } from '../services/nurse-notes.service';
import { CreateNurseNotesDto } from '../dto/create-nurse-notes.dto';
export declare class NurseNotesController {
    private readonly nurseNotesService;
    constructor(nurseNotesService: NurseNotesService);
    create(createDto: CreateNurseNotesDto, user: any): Promise<import("../entities/nurse-notes.entity").NurseNotes>;
    findAll(filters: any, user: any): Promise<{
        data: import("../entities/nurse-notes.entity").NurseNotes[];
        total: number;
    }>;
    search(searchTerm: string, user: any): Promise<import("../entities/nurse-notes.entity").NurseNotes[]>;
    findOne(id: string, user: any): Promise<import("../entities/nurse-notes.entity").NurseNotes>;
    update(id: string, updateDto: any, user: any): Promise<import("../entities/nurse-notes.entity").NurseNotes>;
    publish(id: string, user: any): Promise<import("../entities/nurse-notes.entity").NurseNotes>;
    review(id: string, reviewComments: string, user: any): Promise<import("../entities/nurse-notes.entity").NurseNotes>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    getByPatient(patientId: string, user: any): Promise<import("../entities/nurse-notes.entity").NurseNotes[]>;
    getByNurse(nurseId: string, user: any): Promise<import("../entities/nurse-notes.entity").NurseNotes[]>;
    getDrafts(nurseId: string, user: any): Promise<import("../entities/nurse-notes.entity").NurseNotes[]>;
    getNotesRequiringReview(user: any): Promise<import("../entities/nurse-notes.entity").NurseNotes[]>;
    getNotesRequiringFollowUp(): Promise<import("../entities/nurse-notes.entity").NurseNotes[]>;
    getStatistics(user: any): Promise<any>;
}
