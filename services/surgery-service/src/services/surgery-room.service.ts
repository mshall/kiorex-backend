import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurgeryRoom, RoomStatus } from '../entities/surgery-room.entity';
import { CreateSurgeryRoomDto } from '../dto/create-surgery-room.dto';

@Injectable()
export class SurgeryRoomService {
  constructor(
    @InjectRepository(SurgeryRoom)
    private surgeryRoomRepository: Repository<SurgeryRoom>,
  ) {}

  async createSurgeryRoom(createDto: CreateSurgeryRoomDto): Promise<SurgeryRoom> {
    // Check if room number already exists
    const existingRoom = await this.surgeryRoomRepository.findOne({
      where: { roomNumber: createDto.roomNumber },
    });

    if (existingRoom) {
      throw new BadRequestException('Room with this number already exists');
    }

    const room = this.surgeryRoomRepository.create(createDto);
    return await this.surgeryRoomRepository.save(room);
  }

  async getSurgeryRooms(filters?: {
    type?: string;
    status?: RoomStatus;
    isActive?: boolean;
    search?: string;
  }): Promise<{ data: SurgeryRoom[]; total: number }> {
    const query = this.surgeryRoomRepository.createQueryBuilder('room');

    if (filters?.type) {
      query.andWhere('room.type = :type', { type: filters.type });
    }
    if (filters?.status) {
      query.andWhere('room.status = :status', { status: filters.status });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('room.isActive = :isActive', { isActive: filters.isActive });
    }
    if (filters?.search) {
      query.andWhere(
        '(room.name ILIKE :search OR room.roomNumber ILIKE :search OR room.description ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    const [data, total] = await query
      .orderBy('room.roomNumber', 'ASC')
      .getManyAndCount();

    return { data, total };
  }

  async getSurgeryRoom(id: string): Promise<SurgeryRoom> {
    const room = await this.surgeryRoomRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException('Surgery room not found');
    }

    return room;
  }

  async getSurgeryRoomByNumber(roomNumber: string): Promise<SurgeryRoom> {
    const room = await this.surgeryRoomRepository.findOne({
      where: { roomNumber },
    });

    if (!room) {
      throw new NotFoundException('Surgery room not found');
    }

    return room;
  }

  async updateSurgeryRoom(id: string, updateDto: Partial<CreateSurgeryRoomDto>): Promise<SurgeryRoom> {
    const room = await this.getSurgeryRoom(id);

    // Check if room number is being changed and if it already exists
    if (updateDto.roomNumber && updateDto.roomNumber !== room.roomNumber) {
      const existingRoom = await this.surgeryRoomRepository.findOne({
        where: { roomNumber: updateDto.roomNumber },
      });

      if (existingRoom) {
        throw new BadRequestException('Room with this number already exists');
      }
    }

    Object.assign(room, updateDto);
    return await this.surgeryRoomRepository.save(room);
  }

  async deleteSurgeryRoom(id: string): Promise<void> {
    const room = await this.getSurgeryRoom(id);
    await this.surgeryRoomRepository.remove(room);
  }

  async getAvailableRooms(
    startDate: Date,
    endDate: Date,
    roomType?: string,
  ): Promise<SurgeryRoom[]> {
    const query = this.surgeryRoomRepository
      .createQueryBuilder('room')
      .where('room.status = :status', { status: RoomStatus.AVAILABLE })
      .andWhere('room.isActive = :isActive', { isActive: true });

    if (roomType) {
      query.andWhere('room.type = :type', { type: roomType });
    }

    return await query
      .orderBy('room.roomNumber', 'ASC')
      .getMany();
  }

  async getRoomsByType(type: string): Promise<SurgeryRoom[]> {
    return await this.surgeryRoomRepository.find({
      where: { type: type as any, isActive: true },
      order: { roomNumber: 'ASC' },
    });
  }

  async getRoomsByStatus(status: RoomStatus): Promise<SurgeryRoom[]> {
    return await this.surgeryRoomRepository.find({
      where: { status, isActive: true },
      order: { roomNumber: 'ASC' },
    });
  }

  async updateRoomStatus(id: string, status: RoomStatus): Promise<SurgeryRoom> {
    const room = await this.getSurgeryRoom(id);
    room.status = status;
    return await this.surgeryRoomRepository.save(room);
  }

  async getRoomStatistics(): Promise<any> {
    const total = await this.surgeryRoomRepository.count();
    const active = await this.surgeryRoomRepository.count({ where: { isActive: true } });
    const available = await this.surgeryRoomRepository.count({ 
      where: { status: RoomStatus.AVAILABLE, isActive: true } 
    });
    const occupied = await this.surgeryRoomRepository.count({ 
      where: { status: RoomStatus.OCCUPIED, isActive: true } 
    });
    const maintenance = await this.surgeryRoomRepository.count({ 
      where: { status: RoomStatus.MAINTENANCE, isActive: true } 
    });
    const outOfOrder = await this.surgeryRoomRepository.count({ 
      where: { status: RoomStatus.OUT_OF_ORDER, isActive: true } 
    });

    const typeStats = await this.surgeryRoomRepository
      .createQueryBuilder('room')
      .select('room.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('room.isActive = :isActive', { isActive: true })
      .groupBy('room.type')
      .getRawMany();

    const statusStats = await this.surgeryRoomRepository
      .createQueryBuilder('room')
      .select('room.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('room.isActive = :isActive', { isActive: true })
      .groupBy('room.status')
      .getRawMany();

    return {
      total,
      active,
      available,
      occupied,
      maintenance,
      outOfOrder,
      utilizationRate: total > 0 ? (occupied / total) * 100 : 0,
      typeStats,
      statusStats,
    };
  }

  async getRoomsNeedingMaintenance(): Promise<SurgeryRoom[]> {
    return await this.surgeryRoomRepository
      .createQueryBuilder('room')
      .where('room.status = :status', { status: RoomStatus.MAINTENANCE })
      .andWhere('room.isActive = :isActive', { isActive: true })
      .orderBy('room.roomNumber', 'ASC')
      .getMany();
  }

  async getRoomsOutOfOrder(): Promise<SurgeryRoom[]> {
    return await this.surgeryRoomRepository
      .createQueryBuilder('room')
      .where('room.status = :status', { status: RoomStatus.OUT_OF_ORDER })
      .andWhere('room.isActive = :isActive', { isActive: true })
      .orderBy('room.roomNumber', 'ASC')
      .getMany();
  }

  async searchRooms(searchTerm: string): Promise<SurgeryRoom[]> {
    return await this.surgeryRoomRepository
      .createQueryBuilder('room')
      .where(
        '(room.name ILIKE :search OR room.roomNumber ILIKE :search OR room.description ILIKE :search)',
        { search: `%${searchTerm}%` }
      )
      .andWhere('room.isActive = :isActive', { isActive: true })
      .orderBy('room.roomNumber', 'ASC')
      .getMany();
  }

  async getRoomUtilization(roomId: string, startDate: Date, endDate: Date): Promise<any> {
    // This would typically calculate room utilization based on scheduled surgeries
    // For now, return a mock response
    return {
      roomId,
      period: { startDate, endDate },
      totalHours: 0,
      utilizedHours: 0,
      utilizationRate: 0,
    };
  }
}
