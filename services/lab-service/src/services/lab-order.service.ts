import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabOrder } from '../entities/lab-order.entity';
import { CreateLabOrderDto } from '../dto/create-lab-order.dto';
import { UpdateLabOrderDto } from '../dto/update-lab-order.dto';
import { LabOrderStatus } from '../dto/create-lab-order.dto';

@Injectable()
export class LabOrderService {
  constructor(
    @InjectRepository(LabOrder)
    private labOrderRepository: Repository<LabOrder>,
  ) {}

  async createLabOrder(createDto: CreateLabOrderDto, userId: string): Promise<LabOrder> {
    const labOrder = this.labOrderRepository.create({
      ...createDto,
      status: LabOrderStatus.PENDING,
      orderedBy: userId,
    });

    return await this.labOrderRepository.save(labOrder);
  }

  async getLabOrders(
    userId: string,
    userRole: string,
    filters?: {
      patientId?: string;
      providerId?: string;
      status?: LabOrderStatus;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ data: LabOrder[]; total: number }> {
    const query = this.labOrderRepository.createQueryBuilder('labOrder');

    // Role-based access control
    if (userRole === 'patient') {
      query.where('labOrder.patientId = :userId', { userId });
    } else if (userRole === 'provider') {
      query.where('labOrder.providerId = :userId', { userId });
    }

    // Apply filters
    if (filters?.patientId) {
      query.andWhere('labOrder.patientId = :patientId', { patientId: filters.patientId });
    }
    if (filters?.providerId) {
      query.andWhere('labOrder.providerId = :providerId', { providerId: filters.providerId });
    }
    if (filters?.status) {
      query.andWhere('labOrder.status = :status', { status: filters.status });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('labOrder.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('labOrder.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async getLabOrder(id: string, userId: string, userRole: string): Promise<LabOrder> {
    const labOrder = await this.labOrderRepository.findOne({
      where: { id },
    });

    if (!labOrder) {
      throw new NotFoundException('Lab order not found');
    }

    // Verify access
    if (userRole === 'patient' && labOrder.patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient lab orders');
    }
    if (userRole === 'provider' && labOrder.providerId !== userId) {
      throw new ForbiddenException('Cannot access other provider lab orders');
    }

    return labOrder;
  }

  async updateLabOrder(
    id: string,
    updateDto: UpdateLabOrderDto,
    userId: string,
    userRole: string,
  ): Promise<LabOrder> {
    const labOrder = await this.getLabOrder(id, userId, userRole);

    // Only providers and lab staff can update lab orders
    if (!['provider', 'lab_technician', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to update lab order');
    }

    Object.assign(labOrder, updateDto);
    return await this.labOrderRepository.save(labOrder);
  }

  async cancelLabOrder(id: string, userId: string, userRole: string): Promise<LabOrder> {
    const labOrder = await this.getLabOrder(id, userId, userRole);

    if (labOrder.status === LabOrderStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed lab order');
    }

    labOrder.status = LabOrderStatus.CANCELLED;
    return await this.labOrderRepository.save(labOrder);
  }

  async getLabOrdersByPatient(patientId: string, userId: string, userRole: string): Promise<LabOrder[]> {
    // Verify access
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient lab orders');
    }

    return await this.labOrderRepository.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }

  async getLabOrdersByProvider(providerId: string, userId: string, userRole: string): Promise<LabOrder[]> {
    // Verify access
    if (userRole === 'provider' && providerId !== userId) {
      throw new ForbiddenException('Cannot access other provider lab orders');
    }

    return await this.labOrderRepository.find({
      where: { providerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingLabOrders(userId: string, userRole: string): Promise<LabOrder[]> {
    if (!['lab_technician', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view pending lab orders');
    }

    return await this.labOrderRepository.find({
      where: { status: LabOrderStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  async getLabOrderStatistics(userId: string, userRole: string): Promise<any> {
    if (!['admin', 'lab_manager'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view lab statistics');
    }

    const total = await this.labOrderRepository.count();
    const pending = await this.labOrderRepository.count({ where: { status: LabOrderStatus.PENDING } });
    const completed = await this.labOrderRepository.count({ where: { status: LabOrderStatus.COMPLETED } });
    const cancelled = await this.labOrderRepository.count({ where: { status: LabOrderStatus.CANCELLED } });

    return {
      total,
      pending,
      completed,
      cancelled,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }
}
