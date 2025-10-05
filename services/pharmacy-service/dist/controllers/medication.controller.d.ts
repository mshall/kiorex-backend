import { MedicationService } from '../services/medication.service';
import { CreateMedicationDto } from '../dto/create-medication.dto';
export declare class MedicationController {
    private readonly medicationService;
    constructor(medicationService: MedicationService);
    create(createDto: CreateMedicationDto, user: any): Promise<import("../entities/medication.entity").Medication>;
    findAll(filters: any): Promise<{
        data: import("../entities/medication.entity").Medication[];
        total: number;
    }>;
    search(searchTerm: string): Promise<import("../entities/medication.entity").Medication[]>;
    findOne(id: string): Promise<import("../entities/medication.entity").Medication>;
    findByName(name: string): Promise<import("../entities/medication.entity").Medication>;
    update(id: string, updateDto: Partial<CreateMedicationDto>, user: any): Promise<import("../entities/medication.entity").Medication>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    getByCategory(category: string): Promise<import("../entities/medication.entity").Medication[]>;
    getByDosageForm(dosageForm: string): Promise<import("../entities/medication.entity").Medication[]>;
    getLowStock(user: any): Promise<import("../entities/medication.entity").Medication[]>;
    getExpired(user: any): Promise<import("../entities/medication.entity").Medication[]>;
    getExpiringSoon(days: number, user: any): Promise<import("../entities/medication.entity").Medication[]>;
    getStatistics(user: any): Promise<any>;
    updateStock(id: string, quantity: number, operation: 'add' | 'subtract', user: any): Promise<import("../entities/medication.entity").Medication>;
}
