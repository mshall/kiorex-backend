import { StockMovement } from './stock-movement.entity';
import { Supplier } from './supplier.entity';
export declare enum ItemCategory {
    MEDICATION = "medication",
    MEDICAL_SUPPLIES = "medical_supplies",
    EQUIPMENT = "equipment",
    LAB_SUPPLIES = "lab_supplies",
    SURGICAL_INSTRUMENTS = "surgical_instruments",
    CONSUMABLES = "consumables"
}
export declare enum ItemStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DISCONTINUED = "discontinued"
}
export declare class InventoryItem {
    id: string;
    name: string;
    description: string;
    sku: string;
    unit?: string;
    category: ItemCategory;
    currentStock: number;
    minimumStock: number;
    maximumStock: number;
    unitCost: number;
    unitPrice: number;
    supplierId?: string;
    supplier?: Supplier;
    expiryDate?: Date;
    batchNumber?: string;
    storageInstructions?: string;
    requiresPrescription: boolean;
    isControlledSubstance: boolean;
    status: ItemStatus;
    imageUrl?: string;
    barcode?: string;
    createdAt: Date;
    updatedAt: Date;
    stockMovements: StockMovement[];
    get isLowStock(): boolean;
    get isOutOfStock(): boolean;
    get isExpired(): boolean;
    get isExpiringSoon(): boolean;
    get totalValue(): number;
}
