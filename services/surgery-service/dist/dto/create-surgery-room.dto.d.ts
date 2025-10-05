import { RoomType } from '../entities/surgery-room.entity';
export declare class CreateSurgeryRoomDto {
    roomNumber: string;
    name: string;
    type: RoomType;
    description?: string;
    equipment?: string[];
    capabilities?: string[];
    capacity?: number;
    size?: number;
    floor?: string;
    wing?: string;
    building?: string;
    isActive?: boolean;
    hourlyRate?: number;
    restrictions?: string[];
    specialRequirements?: string[];
}
