import { Repository } from 'typeorm';
import { SurgeryRoom, RoomStatus } from '../entities/surgery-room.entity';
import { CreateSurgeryRoomDto } from '../dto/create-surgery-room.dto';
export declare class SurgeryRoomService {
    private surgeryRoomRepository;
    constructor(surgeryRoomRepository: Repository<SurgeryRoom>);
    createSurgeryRoom(createDto: CreateSurgeryRoomDto): Promise<SurgeryRoom>;
    getSurgeryRooms(filters?: {
        type?: string;
        status?: RoomStatus;
        isActive?: boolean;
        search?: string;
    }): Promise<{
        data: SurgeryRoom[];
        total: number;
    }>;
    getSurgeryRoom(id: string): Promise<SurgeryRoom>;
    getSurgeryRoomByNumber(roomNumber: string): Promise<SurgeryRoom>;
    updateSurgeryRoom(id: string, updateDto: Partial<CreateSurgeryRoomDto>): Promise<SurgeryRoom>;
    deleteSurgeryRoom(id: string): Promise<void>;
    getAvailableRooms(startDate: Date, endDate: Date, roomType?: string): Promise<SurgeryRoom[]>;
    getRoomsByType(type: string): Promise<SurgeryRoom[]>;
    getRoomsByStatus(status: RoomStatus): Promise<SurgeryRoom[]>;
    updateRoomStatus(id: string, status: RoomStatus): Promise<SurgeryRoom>;
    getRoomStatistics(): Promise<any>;
    getRoomsNeedingMaintenance(): Promise<SurgeryRoom[]>;
    getRoomsOutOfOrder(): Promise<SurgeryRoom[]>;
    searchRooms(searchTerm: string): Promise<SurgeryRoom[]>;
    getRoomUtilization(roomId: string, startDate: Date, endDate: Date): Promise<any>;
}
