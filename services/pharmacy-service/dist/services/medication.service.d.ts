import { Repository } from 'typeorm';
import { Medication } from '../entities/medication.entity';
import { CreateMedicationDto } from '../dto/create-medication.dto';
export declare class MedicationService {
    private medicationRepository;
    constructor(medicationRepository: Repository<Medication>);
    createMedication(createDto: CreateMedicationDto): Promise<Medication>;
    getMedications(filters?: {
        category?: string;
        isActive?: boolean;
        requiresPrescription?: boolean;
        search?: string;
    }): Promise<{
        data: Medication[];
        total: number;
    }>;
    getMedication(id: string): Promise<Medication>;
    getMedicationByName(name: string): Promise<Medication>;
    updateMedication(id: string, updateDto: Partial<CreateMedicationDto>): Promise<Medication>;
    deleteMedication(id: string): Promise<void>;
    getMedicationsByCategory(category: string): Promise<Medication[]>;
    getMedicationsByDosageForm(dosageForm: string): Promise<Medication[]>;
    getLowStockMedications(): Promise<Medication[]>;
    getExpiredMedications(): Promise<Medication[]>;
    getMedicationsExpiringSoon(days?: number): Promise<Medication[]>;
    searchMedications(searchTerm: string): Promise<Medication[]>;
    getMedicationStatistics(): Promise<any>;
    updateStock(medicationId: string, quantity: number, operation: 'add' | 'subtract'): Promise<Medication>;
}
