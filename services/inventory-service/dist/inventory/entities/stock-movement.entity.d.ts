import { InventoryItem } from './inventory-item.entity';
export declare enum StockMovementType {
    IN = "in",
    OUT = "out",
    ADJUSTMENT = "adjustment",
    TRANSFER = "transfer",
    EXPIRED = "expired",
    DAMAGED = "damaged"
}
export declare class StockMovement {
    id: string;
    itemId: string;
    item: InventoryItem;
    type: StockMovementType;
    quantity: number;
    previousStock: number;
    newStock: number;
    reason?: string;
    supplierId?: string;
    patientId?: string;
    appointmentId?: string;
    movementDate: Date;
    notes?: string;
    batchNumber?: string;
    expiryDate?: Date;
    performedBy: string;
    createdAt: Date;
    get isInbound(): boolean;
    get isOutbound(): boolean;
}
