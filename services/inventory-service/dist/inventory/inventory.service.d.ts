import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { Supplier } from './entities/supplier.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
export declare class InventoryService {
    private itemRepository;
    private stockMovementRepository;
    private supplierRepository;
    constructor(itemRepository: Repository<InventoryItem>, stockMovementRepository: Repository<StockMovement>, supplierRepository: Repository<Supplier>);
    createItem(createItemDto: CreateItemDto): Promise<InventoryItem>;
    getItems(filters: {
        category?: string;
        status?: string;
        lowStock?: boolean;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: InventoryItem[];
        total: number;
        page: number;
        limit: number;
    }>;
    getItem(id: string): Promise<InventoryItem>;
    updateItem(id: string, updateItemDto: UpdateItemDto): Promise<InventoryItem>;
    deleteItem(id: string): Promise<{
        message: string;
    }>;
    createStockMovement(createStockMovementDto: CreateStockMovementDto, performedBy: string): Promise<StockMovement>;
    getStockMovements(filters: {
        itemId?: string;
        type?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        movements: StockMovement[];
        total: number;
        page: number;
        limit: number;
    }>;
    getItemStockHistory(itemId: string, filters: {
        startDate?: Date;
        endDate?: Date;
    }): Promise<StockMovement[]>;
    getLowStockItems(): Promise<InventoryItem[]>;
    getExpiringItems(days?: number): Promise<InventoryItem[]>;
    createSupplier(createSupplierDto: CreateSupplierDto): Promise<Supplier>;
    getSuppliers(filters: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        suppliers: Supplier[];
        total: number;
        page: number;
        limit: number;
    }>;
    getSupplier(id: string): Promise<Supplier>;
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
    getItemByBarcode(barcode: string): Promise<InventoryItem>;
}
