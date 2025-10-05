import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, LessThanOrEqual } from 'typeorm';
import { InventoryItem, ItemCategory, ItemStatus } from './entities/inventory-item.entity';
import { StockMovement, StockMovementType } from './entities/stock-movement.entity';
import { Supplier, SupplierStatus } from './entities/supplier.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private itemRepository: Repository<InventoryItem>,
    @InjectRepository(StockMovement)
    private stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  // Item Management
  async createItem(createItemDto: CreateItemDto): Promise<InventoryItem> {
    const existingItem = await this.itemRepository.findOne({
      where: { sku: createItemDto.sku },
    });

    if (existingItem) {
      throw new BadRequestException('Item with this SKU already exists');
    }

    const item = this.itemRepository.create(createItemDto);
    return await this.itemRepository.save(item);
  }

  async getItems(filters: {
    category?: string;
    status?: string;
    lowStock?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: InventoryItem[]; total: number; page: number; limit: number }> {
    const { category, status, lowStock, search, page = 1, limit = 20 } = filters;
    
    const queryBuilder = this.itemRepository.createQueryBuilder('item');
    
    if (category) {
      queryBuilder.andWhere('item.category = :category', { category });
    }
    
    if (status) {
      queryBuilder.andWhere('item.status = :status', { status });
    }
    
    if (lowStock) {
      queryBuilder.andWhere('item.currentStock <= item.minimumStock');
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(item.name ILIKE :search OR item.description ILIKE :search OR item.sku ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('item.createdAt', 'DESC')
      .getManyAndCount();
    
    return { items, total, page, limit };
  }

  async getItem(id: string): Promise<InventoryItem> {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['supplier', 'stockMovements'],
    });
    
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    
    return item;
  }

  async updateItem(id: string, updateItemDto: UpdateItemDto): Promise<InventoryItem> {
    const item = await this.itemRepository.findOne({ where: { id } });
    
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    
    Object.assign(item, updateItemDto);
    return await this.itemRepository.save(item);
  }

  async deleteItem(id: string): Promise<{ message: string }> {
    const item = await this.itemRepository.findOne({ where: { id } });
    
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    
    await this.itemRepository.remove(item);
    
    return { message: 'Item deleted successfully' };
  }

  // Stock Management
  async createStockMovement(
    createStockMovementDto: CreateStockMovementDto,
    performedBy: string,
  ): Promise<StockMovement> {
    const item = await this.itemRepository.findOne({
      where: { id: createStockMovementDto.itemId },
    });
    
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    
    const previousStock = item.currentStock;
    let newStock = previousStock;
    
    // Calculate new stock based on movement type
    switch (createStockMovementDto.type) {
      case StockMovementType.IN:
      case StockMovementType.ADJUSTMENT:
        newStock = previousStock + createStockMovementDto.quantity;
        break;
      case StockMovementType.OUT:
      case StockMovementType.EXPIRED:
      case StockMovementType.DAMAGED:
        newStock = previousStock - createStockMovementDto.quantity;
        if (newStock < 0) {
          throw new BadRequestException('Insufficient stock');
        }
        break;
    }
    
    // Create stock movement record
    const stockMovement = this.stockMovementRepository.create({
      ...createStockMovementDto,
      previousStock,
      newStock,
      performedBy,
    });
    
    const savedMovement = await this.stockMovementRepository.save(stockMovement);
    
    // Update item stock
    item.currentStock = newStock;
    await this.itemRepository.save(item);
    
    return savedMovement;
  }

  async getStockMovements(filters: {
    itemId?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ movements: StockMovement[]; total: number; page: number; limit: number }> {
    const { itemId, type, startDate, endDate, page = 1, limit = 20 } = filters;
    
    const queryBuilder = this.stockMovementRepository.createQueryBuilder('movement');
    
    if (itemId) {
      queryBuilder.andWhere('movement.itemId = :itemId', { itemId });
    }
    
    if (type) {
      queryBuilder.andWhere('movement.type = :type', { type });
    }
    
    if (startDate && endDate) {
      queryBuilder.andWhere('movement.movementDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }
    
    const [movements, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('movement.movementDate', 'DESC')
      .getManyAndCount();
    
    return { movements, total, page, limit };
  }

  async getItemStockHistory(
    itemId: string,
    filters: { startDate?: Date; endDate?: Date },
  ): Promise<StockMovement[]> {
    const queryBuilder = this.stockMovementRepository.createQueryBuilder('movement');
    
    queryBuilder.where('movement.itemId = :itemId', { itemId });
    
    if (filters.startDate && filters.endDate) {
      queryBuilder.andWhere('movement.movementDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }
    
    return await queryBuilder
      .orderBy('movement.movementDate', 'DESC')
      .getMany();
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return await this.itemRepository
      .createQueryBuilder('item')
      .where('item.currentStock <= item.minimumStock')
      .andWhere('item.status = :status', { status: ItemStatus.ACTIVE })
      .orderBy('item.currentStock', 'ASC')
      .getMany();
  }

  async getExpiringItems(days: number = 30): Promise<InventoryItem[]> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    
    return await this.itemRepository
      .createQueryBuilder('item')
      .where('item.expiryDate <= :expiryDate', { expiryDate })
      .andWhere('item.expiryDate IS NOT NULL')
      .andWhere('item.status = :status', { status: ItemStatus.ACTIVE })
      .orderBy('item.expiryDate', 'ASC')
      .getMany();
  }

  // Supplier Management
  async createSupplier(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.supplierRepository.create(createSupplierDto);
    return await this.supplierRepository.save(supplier);
  }

  async getSuppliers(filters: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ suppliers: Supplier[]; total: number; page: number; limit: number }> {
    const { status, search, page = 1, limit = 20 } = filters;
    
    const queryBuilder = this.supplierRepository.createQueryBuilder('supplier');
    
    if (status) {
      queryBuilder.andWhere('supplier.status = :status', { status });
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(supplier.name ILIKE :search OR supplier.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    const [suppliers, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('supplier.createdAt', 'DESC')
      .getManyAndCount();
    
    return { suppliers, total, page, limit };
  }

  async getSupplier(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    
    return supplier;
  }

  // Reports and Analytics
  async getStockSummary(): Promise<{
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    expiringItems: number;
    categories: Record<string, number>;
  }> {
    const totalItems = await this.itemRepository.count({
      where: { status: ItemStatus.ACTIVE },
    });
    
    const items = await this.itemRepository.find({
      where: { status: ItemStatus.ACTIVE },
    });
    
    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
    const lowStockItems = items.filter(item => item.isLowStock).length;
    const outOfStockItems = items.filter(item => item.isOutOfStock).length;
    const expiringItems = items.filter(item => item.isExpiringSoon).length;
    
    const categories = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      expiringItems,
      categories,
    };
  }

  async getUsageAnalytics(filters: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
  }): Promise<any> {
    const { startDate, endDate, category } = filters;
    
    const queryBuilder = this.stockMovementRepository
      .createQueryBuilder('movement')
      .leftJoin('movement.item', 'item');
    
    queryBuilder.where('movement.type = :type', { type: StockMovementType.OUT });
    
    if (startDate && endDate) {
      queryBuilder.andWhere('movement.movementDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }
    
    if (category) {
      queryBuilder.andWhere('item.category = :category', { category });
    }
    
    return await queryBuilder
      .select('item.category', 'category')
      .addSelect('SUM(movement.quantity)', 'totalQuantity')
      .addSelect('COUNT(movement.id)', 'totalMovements')
      .groupBy('item.category')
      .getRawMany();
  }

  async getCostAnalysis(filters: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
  }): Promise<any> {
    const { startDate, endDate, category } = filters;
    
    const queryBuilder = this.stockMovementRepository
      .createQueryBuilder('movement')
      .leftJoin('movement.item', 'item');
    
    if (startDate && endDate) {
      queryBuilder.where('movement.movementDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }
    
    if (category) {
      queryBuilder.andWhere('item.category = :category', { category });
    }
    
    return await queryBuilder
      .select('item.category', 'category')
      .addSelect('SUM(movement.quantity * item.unitCost)', 'totalCost')
      .addSelect('SUM(movement.quantity * item.unitPrice)', 'totalValue')
      .groupBy('item.category')
      .getRawMany();
  }

  // Barcode and QR Code
  async generateBarcode(id: string): Promise<{ barcode: string; qrCode: string }> {
    const item = await this.itemRepository.findOne({ where: { id } });
    
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    
    // Generate barcode (in real implementation, use a barcode library)
    const barcode = `BC${item.sku}${Date.now()}`;
    const qrCode = `QR${item.id}`;
    
    // Update item with barcode
    item.barcode = barcode;
    await this.itemRepository.save(item);
    
    return { barcode, qrCode };
  }

  async getItemByBarcode(barcode: string): Promise<InventoryItem> {
    const item = await this.itemRepository.findOne({
      where: { barcode },
      relations: ['supplier'],
    });
    
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    
    return item;
  }
}
