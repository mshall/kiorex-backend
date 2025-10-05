import { InventoryService } from '../services/inventory.service';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createDto: CreateInventoryDto, user: any): Promise<import("../entities/inventory.entity").Inventory>;
    findAll(filters: any): Promise<{
        data: import("../entities/inventory.entity").Inventory[];
        total: number;
    }>;
    findOne(id: string): Promise<import("../entities/inventory.entity").Inventory>;
    getByMedication(medicationId: string): Promise<import("../entities/inventory.entity").Inventory[]>;
    getCurrentStock(medicationId: string): Promise<{
        medicationId: string;
        currentStock: number;
    }>;
    getStatistics(user: any): Promise<any>;
    getLowStock(user: any): Promise<any[]>;
    getExpired(user: any): Promise<any[]>;
    getExpiringSoon(days: number, user: any): Promise<any[]>;
    getInventoryValue(user: any): Promise<{
        totalValue: number;
    }>;
    getInventoryTurnover(medicationId: string, days: number, user: any): Promise<{
        medicationId: string;
        turnover: number;
        period: number;
    }>;
    getInventoryReport(startDate: Date, endDate: Date, user: any): Promise<any>;
}
