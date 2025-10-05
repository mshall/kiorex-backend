import { SurgeryRoomService } from '../services/surgery-room.service';
import { CreateSurgeryRoomDto } from '../dto/create-surgery-room.dto';
import { RoomStatus } from '../entities/surgery-room.entity';
export declare class SurgeryRoomController {
    private readonly surgeryRoomService;
    constructor(surgeryRoomService: SurgeryRoomService);
    create(createDto: CreateSurgeryRoomDto, user: any): Promise<import("../entities/surgery-room.entity").SurgeryRoom>;
    findAll(filters: any): Promise<{
        data: import("../entities/surgery-room.entity").SurgeryRoom[];
        total: number;
    }>;
    search(searchTerm: string): Promise<import("../entities/surgery-room.entity").SurgeryRoom[]>;
    findOne(id: string): Promise<import("../entities/surgery-room.entity").SurgeryRoom>;
    findByNumber(roomNumber: string): Promise<import("../entities/surgery-room.entity").SurgeryRoom>;
    update(id: string, updateDto: Partial<CreateSurgeryRoomDto>, user: any): Promise<import("../entities/surgery-room.entity").SurgeryRoom>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    getAvailableRooms(startDate: Date, endDate: Date, roomType?: string): Promise<import("../entities/surgery-room.entity").SurgeryRoom[]>;
    getByType(type: string): Promise<import("../entities/surgery-room.entity").SurgeryRoom[]>;
    getByStatus(status: RoomStatus): Promise<import("../entities/surgery-room.entity").SurgeryRoom[]>;
    updateStatus(id: string, status: RoomStatus, user: any): Promise<import("../entities/surgery-room.entity").SurgeryRoom>;
    getStatistics(user: any): Promise<any>;
    getRoomsNeedingMaintenance(user: any): Promise<import("../entities/surgery-room.entity").SurgeryRoom[]>;
    getRoomsOutOfOrder(user: any): Promise<import("../entities/surgery-room.entity").SurgeryRoom[]>;
    getRoomUtilization(roomId: string, startDate: Date, endDate: Date, user: any): Promise<any>;
}
