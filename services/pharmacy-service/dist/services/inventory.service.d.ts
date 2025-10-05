import { Repository } from 'typeorm';
import { Inventory, InventoryTransactionType } from '../entities/inventory.entity';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
export declare class InventoryService {
    private inventoryRepository;
    constructor(inventoryRepository: Repository<Inventory>);
    createInventoryTransaction(createDto: CreateInventoryDto): Promise<Inventory>;
    getInventoryTransactions(filters?: {
        medicationId?: string;
        transactionType?: InventoryTransactionType;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        data: Inventory[];
        total: number;
    }>;
    getInventoryTransaction(id: string): Promise<Inventory>;
    getInventoryByMedication(medicationId: string): Promise<Inventory[]>;
    getCurrentStock(medicationId: string): Promise<number>;
    getInventoryStatistics(): Promise<any>;
    getLowStockMedications(): Promise<any[]>;
    getExpiredMedications(): Promise<any[]>;
    getMedicationsExpiringSoon(days?: number): Promise<any[]>;
    getInventoryValue(): Promise<number>;
    getInventoryTurnover(medicationId: string, days?: number): Promise<number>;
    getInventoryReport(startDate: Date, endDate: Date): Promise<any>;
}
