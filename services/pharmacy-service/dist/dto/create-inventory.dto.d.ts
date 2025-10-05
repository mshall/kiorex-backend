import { InventoryTransactionType } from '../entities/inventory.entity';
export declare class CreateInventoryDto {
    medicationId: string;
    medicationName: string;
    transactionType: InventoryTransactionType;
    quantity: number;
    unitCost?: number;
    batchNumber?: string;
    expiryDate?: Date;
    supplier?: string;
    invoiceNumber?: string;
    reference?: string;
    notes?: string;
    performedBy?: string;
    transactionDate?: Date;
    prescriptionId?: string;
    patientId?: string;
    reason?: string;
}
