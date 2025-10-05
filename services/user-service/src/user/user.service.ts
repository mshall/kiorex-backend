import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findAllUsers(filters: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const { role, status, search, page = 1, limit = 20 } = filters;
    
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }
    
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();
    
    return { users, total, page, limit };
  }

  async getUserById(id: string, requesterId: string, requesterRoles: string[]): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Check if requester can view this user
    if (id !== requesterId && !requesterRoles.includes('admin') && !requesterRoles.includes('provider')) {
      throw new ForbiddenException('You can only view your own profile');
    }
    
    return user;
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    requesterId: string,
    requesterRoles: string[],
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Check permissions
    if (id !== requesterId && !requesterRoles.includes('admin')) {
      throw new ForbiddenException('You can only update your own profile');
    }
    
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async updateUserProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    Object.assign(user, updateProfileDto);
    return await this.userRepository.save(user);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }
    
    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedNewPassword;
    
    await this.userRepository.save(user);
    
    return { message: 'Password changed successfully' };
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    await this.userRepository.remove(user);
    
    return { message: 'User deleted successfully' };
  }

  async updateUserStatus(id: string, status: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    user.status = status as UserStatus;
    return await this.userRepository.save(user);
  }

  async getProviders(filters: {
    specialty?: string;
    location?: string;
    availability?: boolean;
  }): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    queryBuilder.where('user.role IN (:...roles)', { 
      roles: [UserRole.PROVIDER, UserRole.DOCTOR, UserRole.NURSE] 
    });
    
    queryBuilder.andWhere('user.status = :status', { status: UserStatus.ACTIVE });
    
    if (filters.specialty) {
      queryBuilder.andWhere('user.specialty = :specialty', { specialty: filters.specialty });
    }
    
    if (filters.location) {
      queryBuilder.andWhere('user.address ILIKE :location', { location: `%${filters.location}%` });
    }
    
    return await queryBuilder.getMany();
  }

  async getPatients(filters: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ patients: User[]; total: number; page: number; limit: number }> {
    const { search, status, page = 1, limit = 20 } = filters;
    
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    queryBuilder.where('user.role = :role', { role: UserRole.PATIENT });
    
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    const [patients, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();
    
    return { patients, total, page, limit };
  }

  async getUserStatistics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    usersByRole: Record<string, number>;
    usersByStatus: Record<string, number>;
  }> {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ where: { status: UserStatus.ACTIVE } });
    
    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();
    
    const usersByStatus = await this.userRepository
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.status')
      .getRawMany();
    
    return {
      totalUsers,
      activeUsers,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = parseInt(item.count);
        return acc;
      }, {}),
      usersByStatus: usersByStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
    };
  }
}
