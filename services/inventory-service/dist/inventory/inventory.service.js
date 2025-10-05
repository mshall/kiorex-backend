"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_item_entity_1 = require("./entities/inventory-item.entity");
const stock_movement_entity_1 = require("./entities/stock-movement.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
let InventoryService = class InventoryService {
    constructor(itemRepository, stockMovementRepository, supplierRepository) {
        this.itemRepository = itemRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.supplierRepository = supplierRepository;
    }
    async createItem(createItemDto) {
        const existingItem = await this.itemRepository.findOne({
            where: { sku: createItemDto.sku },
        });
        if (existingItem) {
            throw new common_1.BadRequestException('Item with this SKU already exists');
        }
        const item = this.itemRepository.create(createItemDto);
        return await this.itemRepository.save(item);
    }
    async getItems(filters) {
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
            queryBuilder.andWhere('(item.name ILIKE :search OR item.description ILIKE :search OR item.sku ILIKE :search)', { search: `%${search}%` });
        }
        const [items, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('item.createdAt', 'DESC')
            .getManyAndCount();
        return { items, total, page, limit };
    }
    async getItem(id) {
        const item = await this.itemRepository.findOne({
            where: { id },
            relations: ['supplier', 'stockMovements'],
        });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        return item;
    }
    async updateItem(id, updateItemDto) {
        const item = await this.itemRepository.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        Object.assign(item, updateItemDto);
        return await this.itemRepository.save(item);
    }
    async deleteItem(id) {
        const item = await this.itemRepository.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        await this.itemRepository.remove(item);
        return { message: 'Item deleted successfully' };
    }
    async createStockMovement(createStockMovementDto, performedBy) {
        const item = await this.itemRepository.findOne({
            where: { id: createStockMovementDto.itemId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        const previousStock = item.currentStock;
        let newStock = previousStock;
        switch (createStockMovementDto.type) {
            case stock_movement_entity_1.StockMovementType.IN:
            case stock_movement_entity_1.StockMovementType.ADJUSTMENT:
                newStock = previousStock + createStockMovementDto.quantity;
                break;
            case stock_movement_entity_1.StockMovementType.OUT:
            case stock_movement_entity_1.StockMovementType.EXPIRED:
            case stock_movement_entity_1.StockMovementType.DAMAGED:
                newStock = previousStock - createStockMovementDto.quantity;
                if (newStock < 0) {
                    throw new common_1.BadRequestException('Insufficient stock');
                }
                break;
        }
        const stockMovement = this.stockMovementRepository.create({
            ...createStockMovementDto,
            previousStock,
            newStock,
            performedBy,
        });
        const savedMovement = await this.stockMovementRepository.save(stockMovement);
        item.currentStock = newStock;
        await this.itemRepository.save(item);
        return savedMovement;
    }
    async getStockMovements(filters) {
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
    async getItemStockHistory(itemId, filters) {
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
    async getLowStockItems() {
        return await this.itemRepository
            .createQueryBuilder('item')
            .where('item.currentStock <= item.minimumStock')
            .andWhere('item.status = :status', { status: inventory_item_entity_1.ItemStatus.ACTIVE })
            .orderBy('item.currentStock', 'ASC')
            .getMany();
    }
    async getExpiringItems(days = 30) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);
        return await this.itemRepository
            .createQueryBuilder('item')
            .where('item.expiryDate <= :expiryDate', { expiryDate })
            .andWhere('item.expiryDate IS NOT NULL')
            .andWhere('item.status = :status', { status: inventory_item_entity_1.ItemStatus.ACTIVE })
            .orderBy('item.expiryDate', 'ASC')
            .getMany();
    }
    async createSupplier(createSupplierDto) {
        const supplier = this.supplierRepository.create(createSupplierDto);
        return await this.supplierRepository.save(supplier);
    }
    async getSuppliers(filters) {
        const { status, search, page = 1, limit = 20 } = filters;
        const queryBuilder = this.supplierRepository.createQueryBuilder('supplier');
        if (status) {
            queryBuilder.andWhere('supplier.status = :status', { status });
        }
        if (search) {
            queryBuilder.andWhere('(supplier.name ILIKE :search OR supplier.email ILIKE :search)', { search: `%${search}%` });
        }
        const [suppliers, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('supplier.createdAt', 'DESC')
            .getManyAndCount();
        return { suppliers, total, page, limit };
    }
    async getSupplier(id) {
        const supplier = await this.supplierRepository.findOne({
            where: { id },
            relations: ['items'],
        });
        if (!supplier) {
            throw new common_1.NotFoundException('Supplier not found');
        }
        return supplier;
    }
    async getStockSummary() {
        const totalItems = await this.itemRepository.count({
            where: { status: inventory_item_entity_1.ItemStatus.ACTIVE },
        });
        const items = await this.itemRepository.find({
            where: { status: inventory_item_entity_1.ItemStatus.ACTIVE },
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
    async getUsageAnalytics(filters) {
        const { startDate, endDate, category } = filters;
        const queryBuilder = this.stockMovementRepository
            .createQueryBuilder('movement')
            .leftJoin('movement.item', 'item');
        queryBuilder.where('movement.type = :type', { type: stock_movement_entity_1.StockMovementType.OUT });
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
    async getCostAnalysis(filters) {
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
    async generateBarcode(id) {
        const item = await this.itemRepository.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        const barcode = `BC${item.sku}${Date.now()}`;
        const qrCode = `QR${item.id}`;
        item.barcode = barcode;
        await this.itemRepository.save(item);
        return { barcode, qrCode };
    }
    async getItemByBarcode(barcode) {
        const item = await this.itemRepository.findOne({
            where: { barcode },
            relations: ['supplier'],
        });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        return item;
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __param(1, (0, typeorm_1.InjectRepository)(stock_movement_entity_1.StockMovement)),
    __param(2, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map