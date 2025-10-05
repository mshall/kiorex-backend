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
export declare enum StockMovementType {
    IN = "in",
    OUT = "out",
    ADJUSTMENT = "adjustment",
    TRANSFER = "transfer",
    EXPIRED = "expired",
    DAMAGED = "damaged"
}
export declare class CreateItemDto {
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
    expiryDate?: string;
    batchNumber?: string;
    storageInstructions?: string;
    requiresPrescription?: boolean;
    isControlledSubstance?: boolean;
    status?: ItemStatus;
    imageUrl?: string;
}
