import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalNote } from '../entities/clinical-note.entity';
import { CreateClinicalNoteDto } from '../dto/create-clinical-note.dto';

@Injectable()
export class ClinicalNoteService {
  constructor(
    @InjectRepository(ClinicalNote)
    private clinicalNoteRepository: Repository<ClinicalNote>,
  ) {}

  async createClinicalNote(createDto: CreateClinicalNoteDto, userId: string): Promise<ClinicalNote> {
    const clinicalNote = this.clinicalNoteRepository.create({
      ...createDto,
      authorId: userId,
    });

    return await this.clinicalNoteRepository.save(clinicalNote);
  }

  async getClinicalNote(id: string, userId: string, userRole: string): Promise<ClinicalNote> {
    const clinicalNote = await this.clinicalNoteRepository.findOne({
      where: { id },
    });

    if (!clinicalNote) {
      throw new NotFoundException('Clinical note not found');
    }

    // Check access permissions
    await this.checkAccess(clinicalNote, userId, userRole);

    return clinicalNote;
  }

  async getPatientClinicalNotes(
    patientId: string,
    userId: string,
    userRole: string,
    filters?: any,
  ): Promise<{ data: ClinicalNote[]; total: number }> {
    // Verify access to patient records
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient records');
    }

    const query = this.clinicalNoteRepository.createQueryBuilder('clinicalNote')
      .where('clinicalNote.patientId = :patientId', { patientId });

    if (filters?.noteType) {
      query.andWhere('clinicalNote.noteType = :noteType', { noteType: filters.noteType });
    }

    if (filters?.isDraft !== undefined) {
      query.andWhere('clinicalNote.isDraft = :isDraft', { isDraft: filters.isDraft });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('clinicalNote.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('clinicalNote.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async updateClinicalNote(
    id: string,
    updateDto: any,
    userId: string,
    userRole: string,
  ): Promise<ClinicalNote> {
    const clinicalNote = await this.getClinicalNote(id, userId, userRole);

    // Only providers can update
    if (userRole !== 'provider' && userRole !== 'admin') {
      throw new ForbiddenException('Only providers can update clinical notes');
    }

    Object.assign(clinicalNote, updateDto);
    return await this.clinicalNoteRepository.save(clinicalNote);
  }

  async signClinicalNote(id: string, userId: string): Promise<ClinicalNote> {
    const clinicalNote = await this.clinicalNoteRepository.findOne({ where: { id } });

    if (!clinicalNote) {
      throw new NotFoundException('Clinical note not found');
    }

    clinicalNote.isDraft = false;
    clinicalNote.signedAt = new Date();
    clinicalNote.signedBy = userId;

    return await this.clinicalNoteRepository.save(clinicalNote);
  }

  private async checkAccess(
    clinicalNote: ClinicalNote,
    userId: string,
    userRole: string,
  ): Promise<void> {
    // Patients can only access their own clinical notes
    if (userRole === 'patient' && clinicalNote.patientId !== userId) {
      throw new ForbiddenException('Cannot access this clinical note');
    }

    // Providers can access clinical notes of their patients
    if (userRole === 'provider') {
      // Check if provider has relationship with patient
      const hasAccess = await this.checkProviderPatientRelationship(
        userId,
        clinicalNote.patientId,
      );
      if (!hasAccess) {
        throw new ForbiddenException('No access to this patient clinical note');
      }
    }
  }

  private async checkProviderPatientRelationship(
    providerId: string,
    patientId: string,
  ): Promise<boolean> {
    // Check if provider has treated this patient
    const clinicalNote = await this.clinicalNoteRepository.findOne({
      where: {
        authorId: providerId,
        patientId,
      },
    });

    return !!clinicalNote;
  }
}
