import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory, InventoryTransactionType } from '../entities/inventory.entity';
import { CreateInventoryDto } from '../dto/create-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async createInventoryTransaction(createDto: CreateInventoryDto): Promise<Inventory> {
    const inventory = this.inventoryRepository.create(createDto);
    return await this.inventoryRepository.save(inventory);
  }

  async getInventoryTransactions(filters?: {
    medicationId?: string;
    transactionType?: InventoryTransactionType;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ data: Inventory[]; total: number }> {
    const query = this.inventoryRepository.createQueryBuilder('inventory');

    if (filters?.medicationId) {
      query.andWhere('inventory.medicationId = :medicationId', { medicationId: filters.medicationId });
    }
    if (filters?.transactionType) {
      query.andWhere('inventory.transactionType = :transactionType', { transactionType: filters.transactionType });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('inventory.transactionDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('inventory.transactionDate', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async getInventoryTransaction(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory transaction not found');
    }

    return inventory;
  }

  async getInventoryByMedication(medicationId: string): Promise<Inventory[]> {
    return await this.inventoryRepository.find({
      where: { medicationId },
      order: { transactionDate: 'DESC' },
    });
  }

  async getCurrentStock(medicationId: string): Promise<number> {
    const result = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('SUM(CASE WHEN inventory.transactionType = :in THEN inventory.quantity ELSE -inventory.quantity END)', 'stock')
      .where('inventory.medicationId = :medicationId', { medicationId })
      .setParameter('in', InventoryTransactionType.IN)
      .getRawOne();

    return parseInt(result.stock) || 0;
  }

  async getInventoryStatistics(): Promise<any> {
    const totalTransactions = await this.inventoryRepository.count();
    
    const transactionTypeStats = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('inventory.transactionType', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(inventory.quantity)', 'totalQuantity')
      .addSelect('SUM(inventory.totalCost)', 'totalCost')
      .groupBy('inventory.transactionType')
      .getRawMany();

    const medicationStats = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('inventory.medicationName', 'medication')
      .addSelect('COUNT(*)', 'transactions')
      .addSelect('SUM(CASE WHEN inventory.transactionType = :in THEN inventory.quantity ELSE -inventory.quantity END)', 'currentStock')
      .setParameter('in', InventoryTransactionType.IN)
      .groupBy('inventory.medicationName')
      .orderBy('currentStock', 'DESC')
      .limit(10)
      .getRawMany();

    const monthlyStats = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('DATE_TRUNC(\'month\', inventory.transactionDate)', 'month')
      .addSelect('COUNT(*)', 'transactions')
      .addSelect('SUM(inventory.totalCost)', 'totalCost')
      .groupBy('DATE_TRUNC(\'month\', inventory.transactionDate)')
      .orderBy('month', 'DESC')
      .limit(12)
      .getRawMany();

    return {
      totalTransactions,
      transactionTypeStats,
      medicationStats,
      monthlyStats,
    };
  }

  async getLowStockMedications(): Promise<any[]> {
    // This would typically join with medication table to get current stock levels
    // For now, return a mock response
    return [];
  }

  async getExpiredMedications(): Promise<any[]> {
    const expired = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.expiryDate < :now', { now: new Date() })
      .andWhere('inventory.transactionType = :in', { in: InventoryTransactionType.IN })
      .orderBy('inventory.expiryDate', 'ASC')
      .getMany();

    return expired;
  }

  async getMedicationsExpiringSoon(days: number = 30): Promise<any[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const expiringSoon = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.expiryDate BETWEEN :now AND :futureDate', { 
        now: new Date(), 
        futureDate 
      })
      .andWhere('inventory.transactionType = :in', { in: InventoryTransactionType.IN })
      .orderBy('inventory.expiryDate', 'ASC')
      .getMany();

    return expiringSoon;
  }

  async getInventoryValue(): Promise<number> {
    const result = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('SUM(inventory.totalCost)', 'totalValue')
      .where('inventory.transactionType = :in', { in: InventoryTransactionType.IN })
      .getRawOne();

    return parseFloat(result.totalValue) || 0;
  }

  async getInventoryTurnover(medicationId: string, days: number = 30): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const outTransactions = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('SUM(inventory.quantity)', 'totalOut')
      .where('inventory.medicationId = :medicationId', { medicationId })
      .andWhere('inventory.transactionType = :out', { out: InventoryTransactionType.OUT })
      .andWhere('inventory.transactionDate >= :startDate', { startDate })
      .getRawOne();

    const currentStock = await this.getCurrentStock(medicationId);
    const totalOut = parseInt(outTransactions.totalOut) || 0;

    return currentStock > 0 ? (totalOut / currentStock) * 100 : 0;
  }

  async getInventoryReport(startDate: Date, endDate: Date): Promise<any> {
    const transactions = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.transactionDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('inventory.transactionDate', 'DESC')
      .getMany();

    const summary = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('inventory.transactionType', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(inventory.quantity)', 'totalQuantity')
      .addSelect('SUM(inventory.totalCost)', 'totalCost')
      .where('inventory.transactionDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('inventory.transactionType')
      .getRawMany();

    return {
      transactions,
      summary,
      period: { startDate, endDate },
    };
  }
}
