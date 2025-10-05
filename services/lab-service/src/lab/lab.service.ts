import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { LabTest, TestCategory, TestType } from './entities/lab-test.entity';
import { LabPartner, LabStatus } from './entities/lab-partner.entity';
import { LabBooking, BookingStatus, CollectionType } from './entities/lab-booking.entity';
import { LabResult, ResultStatus, SeverityLevel } from './entities/lab-result.entity';
import { CreateLabTestDto } from './dto/create-lab-test.dto';
import { CreateLabBookingDto } from './dto/create-lab-booking.dto';
import { CreateLabResultDto } from './dto/create-lab-result.dto';

@Injectable()
export class LabService {
  constructor(
    @InjectRepository(LabTest)
    private labTestRepository: Repository<LabTest>,
    @InjectRepository(LabPartner)
    private labPartnerRepository: Repository<LabPartner>,
    @InjectRepository(LabBooking)
    private labBookingRepository: Repository<LabBooking>,
    @InjectRepository(LabResult)
    private labResultRepository: Repository<LabResult>,
  ) {}

  // Lab Tests
  async searchTests(filters: {
    search?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<{ tests: LabTest[]; total: number; page: number; limit: number }> {
    const { search, category, priceMin, priceMax, location, page = 1, limit = 20 } = filters;
    
    const queryBuilder = this.labTestRepository.createQueryBuilder('test');
    
    queryBuilder.where('test.isActive = :isActive', { isActive: true });
    
    if (search) {
      queryBuilder.andWhere(
        '(test.name ILIKE :search OR test.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    if (category) {
      queryBuilder.andWhere('test.category = :category', { category });
    }
    
    if (priceMin !== undefined) {
      queryBuilder.andWhere('test.price >= :priceMin', { priceMin });
    }
    
    if (priceMax !== undefined) {
      queryBuilder.andWhere('test.price <= :priceMax', { priceMax });
    }
    
    const [tests, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('test.name', 'ASC')
      .getManyAndCount();
    
    return { tests, total, page, limit };
  }

  async getTest(id: string): Promise<LabTest> {
    const test = await this.labTestRepository.findOne({
      where: { id, isActive: true },
    });
    
    if (!test) {
      throw new NotFoundException('Lab test not found');
    }
    
    return test;
  }

  async createTest(createTestDto: CreateLabTestDto): Promise<LabTest> {
    const test = this.labTestRepository.create(createTestDto);
    return await this.labTestRepository.save(test);
  }

  // Lab Partners
  async getLabPartners(filters: {
    location?: string;
    rating?: number;
    page?: number;
    limit?: number;
  }): Promise<{ partners: LabPartner[]; total: number; page: number; limit: number }> {
    const { location, rating, page = 1, limit = 20 } = filters;
    
    const queryBuilder = this.labPartnerRepository.createQueryBuilder('partner');
    
    queryBuilder.where('partner.status = :status', { status: LabStatus.ACTIVE });
    
    if (location) {
      queryBuilder.andWhere(
        '(partner.city ILIKE :location OR partner.state ILIKE :location OR partner.address ILIKE :location)',
        { location: `%${location}%` }
      );
    }
    
    if (rating !== undefined) {
      queryBuilder.andWhere('partner.rating >= :rating', { rating });
    }
    
    const [partners, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('partner.rating', 'DESC')
      .addOrderBy('partner.reviewCount', 'DESC')
      .getManyAndCount();
    
    return { partners, total, page, limit };
  }

  async getLabPartner(id: string): Promise<LabPartner> {
    const partner = await this.labPartnerRepository.findOne({
      where: { id, status: LabStatus.ACTIVE },
    });
    
    if (!partner) {
      throw new NotFoundException('Lab partner not found');
    }
    
    return partner;
  }

  // Lab Bookings
  async createBooking(createBookingDto: CreateLabBookingDto, userId: string): Promise<LabBooking> {
    // Verify test exists
    const test = await this.labTestRepository.findOne({
      where: { id: createBookingDto.testId, isActive: true },
    });
    
    if (!test) {
      throw new NotFoundException('Lab test not found');
    }
    
    // Verify lab partner exists
    const lab = await this.labPartnerRepository.findOne({
      where: { id: createBookingDto.labId, status: LabStatus.ACTIVE },
    });
    
    if (!lab) {
      throw new NotFoundException('Lab partner not found');
    }
    
    // Check if home collection is available
    if (createBookingDto.collectionType === CollectionType.HOME_COLLECTION && !lab.homeCollectionAvailable) {
      throw new BadRequestException('Home collection not available for this lab');
    }
    
    const booking = this.labBookingRepository.create({
      ...createBookingDto,
      patientId: userId,
      totalAmount: test.price * (createBookingDto.quantity || 1),
    });
    
    return await this.labBookingRepository.save(booking);
  }

  async getUserBookings(
    userId: string,
    filters: {
      status?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    },
  ): Promise<{ bookings: LabBooking[]; total: number; page: number; limit: number }> {
    const { status, startDate, endDate, page = 1, limit = 20 } = filters;
    
    const queryBuilder = this.labBookingRepository.createQueryBuilder('booking');
    
    queryBuilder.where('booking.patientId = :userId', { userId });
    
    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }
    
    if (startDate && endDate) {
      queryBuilder.andWhere('booking.scheduledDateTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }
    
    const [bookings, total] = await queryBuilder
      .leftJoinAndSelect('booking.test', 'test')
      .leftJoinAndSelect('booking.lab', 'lab')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('booking.scheduledDateTime', 'DESC')
      .getManyAndCount();
    
    return { bookings, total, page, limit };
  }

  async getBooking(id: string, userId: string): Promise<LabBooking> {
    const booking = await this.labBookingRepository.findOne({
      where: { id, patientId: userId },
      relations: ['test', 'lab', 'result'],
    });
    
    if (!booking) {
      throw new NotFoundException('Lab booking not found');
    }
    
    return booking;
  }

  async cancelBooking(id: string, userId: string, reason: string): Promise<LabBooking> {
    const booking = await this.labBookingRepository.findOne({
      where: { id, patientId: userId },
    });
    
    if (!booking) {
      throw new NotFoundException('Lab booking not found');
    }
    
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }
    
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed booking');
    }
    
    booking.status = BookingStatus.CANCELLED;
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    
    return await this.labBookingRepository.save(booking);
  }

  async rescheduleBooking(id: string, newDateTime: Date, userId: string): Promise<LabBooking> {
    const booking = await this.labBookingRepository.findOne({
      where: { id, patientId: userId },
    });
    
    if (!booking) {
      throw new NotFoundException('Lab booking not found');
    }
    
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cannot reschedule cancelled booking');
    }
    
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot reschedule completed booking');
    }
    
    booking.scheduledDateTime = newDateTime;
    
    return await this.labBookingRepository.save(booking);
  }

  // Lab Results
  async uploadResults(createResultDto: CreateLabResultDto, uploadedBy: string): Promise<LabResult> {
    const booking = await this.labBookingRepository.findOne({
      where: { id: createResultDto.bookingId },
    });
    
    if (!booking) {
      throw new NotFoundException('Lab booking not found');
    }
    
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot upload results for incomplete booking');
    }
    
    // Check for abnormal values
    const hasAbnormalValues = createResultDto.parameters.some(
      param => param.severity !== SeverityLevel.NORMAL
    );
    
    const hasCriticalValues = createResultDto.parameters.some(
      param => param.severity === SeverityLevel.CRITICAL
    );
    
    let status = ResultStatus.COMPLETED;
    if (hasCriticalValues) {
      status = ResultStatus.CRITICAL;
    } else if (hasAbnormalValues) {
      status = ResultStatus.ABNORMAL;
    }
    
    const result = this.labResultRepository.create({
      ...createResultDto,
      uploadedBy,
      isAbnormal: hasAbnormalValues,
    });
    
    return await this.labResultRepository.save(result);
  }

  async getUserResults(
    userId: string,
    filters: {
      testId?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    },
  ): Promise<{ results: LabResult[]; total: number; page: number; limit: number }> {
    const { testId, startDate, endDate, page = 1, limit = 20 } = filters;
    
    const queryBuilder = this.labResultRepository.createQueryBuilder('result');
    
    queryBuilder.where('result.patientId = :userId', { userId });
    
    if (testId) {
      queryBuilder.andWhere('result.testId = :testId', { testId });
    }
    
    if (startDate && endDate) {
      queryBuilder.andWhere('result.testDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }
    
    const [results, total] = await queryBuilder
      .leftJoinAndSelect('result.booking', 'booking')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('result.testDate', 'DESC')
      .getManyAndCount();
    
    return { results, total, page, limit };
  }

  async getResult(id: string, userId: string): Promise<LabResult> {
    const result = await this.labResultRepository.findOne({
      where: { id, patientId: userId },
      relations: ['booking', 'booking.test', 'booking.lab'],
    });
    
    if (!result) {
      throw new NotFoundException('Lab result not found');
    }
    
    return result;
  }

  async downloadResult(id: string, userId: string): Promise<{ downloadUrl: string }> {
    const result = await this.labResultRepository.findOne({
      where: { id, patientId: userId },
    });
    
    if (!result) {
      throw new NotFoundException('Lab result not found');
    }
    
    if (!result.pdfUrl) {
      throw new BadRequestException('PDF not available for this result');
    }
    
    return { downloadUrl: result.pdfUrl };
  }

  // Home Collection
  async scheduleHomeCollection(
    id: string,
    collectionDto: {
      address: string;
      preferredTime: string;
      contactPhone: string;
    },
    userId: string,
  ): Promise<LabBooking> {
    const booking = await this.labBookingRepository.findOne({
      where: { id, patientId: userId },
      relations: ['lab'],
    });
    
    if (!booking) {
      throw new NotFoundException('Lab booking not found');
    }
    
    if (booking.collectionType !== CollectionType.HOME_COLLECTION) {
      throw new BadRequestException('This booking is not for home collection');
    }
    
    if (!booking.lab.homeCollectionAvailable) {
      throw new BadRequestException('Home collection not available for this lab');
    }
    
    booking.address = collectionDto.address;
    booking.contactPhone = collectionDto.contactPhone;
    booking.preferredTimeSlot = collectionDto.preferredTime;
    
    return await this.labBookingRepository.save(booking);
  }

  async getCollectionStatus(id: string, userId: string): Promise<{ status: string; details: any }> {
    const booking = await this.labBookingRepository.findOne({
      where: { id, patientId: userId },
    });
    
    if (!booking) {
      throw new NotFoundException('Lab booking not found');
    }
    
    if (booking.collectionType !== CollectionType.HOME_COLLECTION) {
      throw new BadRequestException('This booking is not for home collection');
    }
    
    // Mock collection status - in real implementation, this would come from tracking service
    const status = booking.status === BookingStatus.CONFIRMED ? 'scheduled' : 'pending';
    
    return {
      status,
      details: {
        scheduledDateTime: booking.scheduledDateTime,
        address: booking.address,
        contactPhone: booking.contactPhone,
        preferredTimeSlot: booking.preferredTimeSlot,
      },
    };
  }

  // Reports and Analytics
  async getAbnormalResults(filters: {
    startDate?: Date;
    endDate?: Date;
    severity?: string;
    page?: number;
    limit?: number;
  }): Promise<{ results: LabResult[]; total: number; page: number; limit: number }> {
    const { startDate, endDate, severity, page = 1, limit = 20 } = filters;
    
    const queryBuilder = this.labResultRepository.createQueryBuilder('result');
    
    queryBuilder.where('result.isAbnormal = :isAbnormal', { isAbnormal: true });
    
    if (startDate && endDate) {
      queryBuilder.andWhere('result.testDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }
    
    if (severity) {
      queryBuilder.andWhere('result.parameters @> :severity', {
        severity: JSON.stringify([{ severity }]),
      });
    }
    
    const [results, total] = await queryBuilder
      .leftJoinAndSelect('result.booking', 'booking')
      .leftJoinAndSelect('booking.test', 'test')
      .leftJoinAndSelect('booking.lab', 'lab')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('result.testDate', 'DESC')
      .getManyAndCount();
    
    return { results, total, page, limit };
  }

  async getLabStatistics(filters: {
    startDate?: Date;
    endDate?: Date;
    labId?: string;
  }): Promise<any> {
    const { startDate, endDate, labId } = filters;
    
    const queryBuilder = this.labBookingRepository.createQueryBuilder('booking');
    
    if (startDate && endDate) {
      queryBuilder.where('booking.scheduledDateTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }
    
    if (labId) {
      queryBuilder.andWhere('booking.labId = :labId', { labId });
    }
    
    const totalBookings = await queryBuilder.getCount();
    
    const statusCounts = await queryBuilder
      .select('booking.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('booking.status')
      .getRawMany();
    
    const collectionTypeCounts = await queryBuilder
      .select('booking.collectionType', 'collectionType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('booking.collectionType')
      .getRawMany();
    
    return {
      totalBookings,
      statusBreakdown: statusCounts.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      collectionTypeBreakdown: collectionTypeCounts.reduce((acc, item) => {
        acc[item.collectionType] = parseInt(item.count);
        return acc;
      }, {}),
    };
  }
}
