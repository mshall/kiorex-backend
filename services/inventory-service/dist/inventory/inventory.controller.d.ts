import { InventoryService } from './inventory.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    createItem(createItemDto: CreateItemDto): Promise<import("./entities/inventory-item.entity").InventoryItem>;
    getItems(filters: {
        category?: string;
        status?: string;
        lowStock?: boolean;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: import("./entities/inventory-item.entity").InventoryItem[];
        total: number;
        page: number;
        limit: number;
    }>;
    getItem(id: string): Promise<import("./entities/inventory-item.entity").InventoryItem>;
    updateItem(id: string, updateItemDto: UpdateItemDto): Promise<import("./entities/inventory-item.entity").InventoryItem>;
    deleteItem(id: string): Promise<{
        message: string;
    }>;
    createStockMovement(createStockMovementDto: CreateStockMovementDto, user: any): Promise<import("./entities/stock-movement.entity").StockMovement>;
    getStockMovements(filters: {
        itemId?: string;
        type?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        movements: import("./entities/stock-movement.entity").StockMovement[];
        total: number;
        page: number;
        limit: number;
    }>;
    getItemStockHistory(id: string, filters: {
        startDate?: Date;
        endDate?: Date;
    }): Promise<import("./entities/stock-movement.entity").StockMovement[]>;
    getLowStockItems(): Promise<import("./entities/inventory-item.entity").InventoryItem[]>;
    getExpiringItems(days?: number): Promise<import("./entities/inventory-item.entity").InventoryItem[]>;
    createSupplier(createSupplierDto: CreateSupplierDto): Promise<import("./entities/supplier.entity").Supplier>;
    getSuppliers(filters: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        suppliers: import("./entities/supplier.entity").Supplier[];
        total: number;
        page: number;
        limit: number;
    }>;
    getSupplier(id: string): Promise<import("./entities/supplier.entity").Supplier>;
    getStockSummary(): Promise<{
        totalItems: number;
        totalValue: number;
        lowStockItems: number;
        outOfStockItems: number;
        expiringItems: number;
        categories: Record<string, number>;
    }>;
    getUsageAnalytics(filters: {
        startDate?: Date;
        endDate?: Date;
        category?: string;
    }): Promise<any>;
    getCostAnalysis(filters: {
        startDate?: Date;
        endDate?: Date;
        category?: string;
    }): Promise<any>;
    generateBarcode(id: string): Promise<{
        barcode: string;
        qrCode: string;
    }>;
    getItemByBarcode(barcode: string): Promise<import("./entities/inventory-item.entity").InventoryItem>;
}
