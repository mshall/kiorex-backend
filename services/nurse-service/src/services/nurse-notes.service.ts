import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NurseNotes, NoteType } from '../entities/nurse-notes.entity';
import { CreateNurseNotesDto } from '../dto/create-nurse-notes.dto';

@Injectable()
export class NurseNotesService {
  constructor(
    @InjectRepository(NurseNotes)
    private nurseNotesRepository: Repository<NurseNotes>,
  ) {}

  async createNurseNotes(createDto: CreateNurseNotesDto, userId: string): Promise<NurseNotes> {
    const notes = this.nurseNotesRepository.create({
      ...createDto,
      isDraft: createDto.isDraft || false,
    });

    if (!notes.isDraft) {
      notes.publishedAt = new Date();
    }

    return await this.nurseNotesRepository.save(notes);
  }

  async getNurseNotes(
    userId: string,
    userRole: string,
    filters?: {
      patientId?: string;
      nurseId?: string;
      noteType?: NoteType;
      priority?: string;
      isDraft?: boolean;
      isConfidential?: boolean;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ data: NurseNotes[]; total: number }> {
    const query = this.nurseNotesRepository.createQueryBuilder('notes');

    // Role-based access control
    if (userRole === 'nurse') {
      query.where('notes.nurseId = :userId', { userId });
    }

    // Apply filters
    if (filters?.patientId) {
      query.andWhere('notes.patientId = :patientId', { patientId: filters.patientId });
    }
    if (filters?.nurseId) {
      query.andWhere('notes.nurseId = :nurseId', { nurseId: filters.nurseId });
    }
    if (filters?.noteType) {
      query.andWhere('notes.noteType = :noteType', { noteType: filters.noteType });
    }
    if (filters?.priority) {
      query.andWhere('notes.priority = :priority', { priority: filters.priority });
    }
    if (filters?.isDraft !== undefined) {
      query.andWhere('notes.isDraft = :isDraft', { isDraft: filters.isDraft });
    }
    if (filters?.isConfidential !== undefined) {
      query.andWhere('notes.isConfidential = :isConfidential', { isConfidential: filters.isConfidential });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('notes.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('notes.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async getNurseNotesById(id: string, userId: string, userRole: string): Promise<NurseNotes> {
    const notes = await this.nurseNotesRepository.findOne({
      where: { id },
    });

    if (!notes) {
      throw new NotFoundException('Nurse notes not found');
    }

    // Verify access
    if (userRole === 'nurse' && notes.nurseId !== userId) {
      throw new ForbiddenException('Cannot access other nurse notes');
    }

    return notes;
  }

  async updateNurseNotes(
    id: string,
    updateDto: any,
    userId: string,
    userRole: string,
  ): Promise<NurseNotes> {
    const notes = await this.getNurseNotesById(id, userId, userRole);

    // Only the author and supervisors can update notes
    if (userRole === 'nurse' && notes.nurseId !== userId) {
      throw new ForbiddenException('Cannot update other nurse notes');
    }

    Object.assign(notes, updateDto);
    
    // If publishing for the first time
    if (!notes.isDraft && !notes.publishedAt) {
      notes.publishedAt = new Date();
    }

    return await this.nurseNotesRepository.save(notes);
  }

  async publishNotes(id: string, userId: string, userRole: string): Promise<NurseNotes> {
    const notes = await this.getNurseNotesById(id, userId, userRole);

    if (!notes.isDraft) {
      throw new BadRequestException('Notes are already published');
    }

    notes.isDraft = false;
    notes.publishedAt = new Date();

    return await this.nurseNotesRepository.save(notes);
  }

  async reviewNotes(
    id: string,
    reviewComments: string,
    userId: string,
    userRole: string,
  ): Promise<NurseNotes> {
    const notes = await this.getNurseNotesById(id, userId, userRole);

    if (!['supervisor', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to review notes');
    }

    notes.reviewedBy = userId;
    notes.reviewedAt = new Date();
    notes.reviewComments = reviewComments;
    notes.requiresSupervisorReview = false;

    return await this.nurseNotesRepository.save(notes);
  }

  async deleteNurseNotes(id: string, userId: string, userRole: string): Promise<void> {
    const notes = await this.getNurseNotesById(id, userId, userRole);

    // Only the author and supervisors can delete notes
    if (userRole === 'nurse' && notes.nurseId !== userId) {
      throw new ForbiddenException('Cannot delete other nurse notes');
    }

    await this.nurseNotesRepository.remove(notes);
  }

  async getNotesByPatient(patientId: string, userId: string, userRole: string): Promise<NurseNotes[]> {
    return await this.nurseNotesRepository.find({
      where: { patientId, isDraft: false },
      order: { createdAt: 'DESC' },
    });
  }

  async getNotesByNurse(nurseId: string, userId: string, userRole: string): Promise<NurseNotes[]> {
    // Verify access
    if (userRole === 'nurse' && nurseId !== userId) {
      throw new ForbiddenException('Cannot access other nurse notes');
    }

    return await this.nurseNotesRepository.find({
      where: { nurseId },
      order: { createdAt: 'DESC' },
    });
  }

  async getDraftNotes(nurseId: string, userId: string, userRole: string): Promise<NurseNotes[]> {
    // Verify access
    if (userRole === 'nurse' && nurseId !== userId) {
      throw new ForbiddenException('Cannot access other nurse draft notes');
    }

    return await this.nurseNotesRepository.find({
      where: { nurseId, isDraft: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getNotesRequiringReview(): Promise<NurseNotes[]> {
    return await this.nurseNotesRepository.find({
      where: { requiresSupervisorReview: true, isDraft: false },
      order: { createdAt: 'ASC' },
    });
  }

  async getNotesRequiringFollowUp(): Promise<NurseNotes[]> {
    return await this.nurseNotesRepository.find({
      where: { requiresFollowUp: true, isDraft: false },
      order: { followUpTime: 'ASC' },
    });
  }

  async getNotesStatistics(userId: string, userRole: string): Promise<any> {
    if (!['admin', 'supervisor'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view notes statistics');
    }

    const total = await this.nurseNotesRepository.count();
    const published = await this.nurseNotesRepository.count({ where: { isDraft: false } });
    const drafts = await this.nurseNotesRepository.count({ where: { isDraft: true } });
    const confidential = await this.nurseNotesRepository.count({ where: { isConfidential: true } });
    const requiringReview = await this.nurseNotesRepository.count({ where: { requiresSupervisorReview: true } });
    const requiringFollowUp = await this.nurseNotesRepository.count({ where: { requiresFollowUp: true } });

    const typeStats = await this.nurseNotesRepository
      .createQueryBuilder('notes')
      .select('notes.noteType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('notes.isDraft = :isDraft', { isDraft: false })
      .groupBy('notes.noteType')
      .getRawMany();

    const priorityStats = await this.nurseNotesRepository
      .createQueryBuilder('notes')
      .select('notes.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .where('notes.isDraft = :isDraft', { isDraft: false })
      .groupBy('notes.priority')
      .getRawMany();

    return {
      total,
      published,
      drafts,
      confidential,
      requiringReview,
      requiringFollowUp,
      typeStats,
      priorityStats,
    };
  }

  async searchNotes(searchTerm: string, userId: string, userRole: string): Promise<NurseNotes[]> {
    const query = this.nurseNotesRepository
      .createQueryBuilder('notes')
      .where('notes.isDraft = :isDraft', { isDraft: false })
      .andWhere(
        '(notes.content ILIKE :search OR notes.summary ILIKE :search)',
        { search: `%${searchTerm}%` }
      );

    // Role-based access control
    if (userRole === 'nurse') {
      query.andWhere('notes.nurseId = :userId', { userId });
    }

    return await query
      .orderBy('notes.createdAt', 'DESC')
      .getMany();
  }
}
