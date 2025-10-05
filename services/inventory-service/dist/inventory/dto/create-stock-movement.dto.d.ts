import { StockMovementType } from './create-item.dto';
export declare class CreateStockMovementDto {
    itemId: string;
    type: StockMovementType;
    quantity: number;
    reason?: string;
    supplierId?: string;
    patientId?: string;
    appointmentId?: string;
    movementDate?: string;
    notes?: string;
    batchNumber?: string;
    expiryDate?: string;
}
