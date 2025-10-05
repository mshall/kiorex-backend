export declare enum InventoryTransactionType {
    IN = "in",
    OUT = "out",
    ADJUSTMENT = "adjustment",
    EXPIRED = "expired",
    DAMAGED = "damaged",
    RETURN = "return"
}
export declare class Inventory {
    id: string;
    medicationId: string;
    medicationName: string;
    transactionType: InventoryTransactionType;
    quantity: number;
    previousQuantity: number;
    newQuantity: number;
    unitCost?: number;
    totalCost?: number;
    batchNumber?: string;
    expiryDate?: Date;
    supplier?: string;
    invoiceNumber?: string;
    reference?: string;
    notes?: string;
    performedBy?: string;
    transactionDate: Date;
    prescriptionId?: string;
    patientId?: string;
    reason?: string;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
