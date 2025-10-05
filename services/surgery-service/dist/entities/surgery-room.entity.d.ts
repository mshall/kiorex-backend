export declare enum RoomStatus {
    AVAILABLE = "available",
    OCCUPIED = "occupied",
    MAINTENANCE = "maintenance",
    OUT_OF_ORDER = "out_of_order"
}
export declare enum RoomType {
    OPERATING_ROOM = "operating_room",
    RECOVERY_ROOM = "recovery_room",
    PREP_ROOM = "prep_room",
    HOLDING_ROOM = "holding_room"
}
export declare class SurgeryRoom {
    id: string;
    roomNumber: string;
    name: string;
    type: RoomType;
    status: RoomStatus;
    description?: string;
    equipment?: string[];
    capabilities?: string[];
    capacity?: number;
    size?: number;
    floor?: string;
    wing?: string;
    building?: string;
    isActive: boolean;
    maintenanceSchedule?: {
        lastMaintenance?: Date;
        nextMaintenance?: Date;
        maintenanceType?: string;
        notes?: string;
    };
    availability?: {
        monday?: {
            start: string;
            end: string;
            available: boolean;
        }[];
        tuesday?: {
            start: string;
            end: string;
            available: boolean;
        }[];
        wednesday?: {
            start: string;
            end: string;
            available: boolean;
        }[];
        thursday?: {
            start: string;
            end: string;
            available: boolean;
        }[];
        friday?: {
            start: string;
            end: string;
            available: boolean;
        }[];
        saturday?: {
            start: string;
            end: string;
            available: boolean;
        }[];
        sunday?: {
            start: string;
            end: string;
            available: boolean;
        }[];
    };
    hourlyRate?: number;
    restrictions?: string[];
    specialRequirements?: string[];
    createdAt: Date;
    updatedAt: Date;
}
