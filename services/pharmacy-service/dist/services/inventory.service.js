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
const inventory_entity_1 = require("../entities/inventory.entity");
let InventoryService = class InventoryService {
    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }
    async createInventoryTransaction(createDto) {
        const inventory = this.inventoryRepository.create(createDto);
        return await this.inventoryRepository.save(inventory);
    }
    async getInventoryTransactions(filters) {
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
    async getInventoryTransaction(id) {
        const inventory = await this.inventoryRepository.findOne({
            where: { id },
        });
        if (!inventory) {
            throw new common_1.NotFoundException('Inventory transaction not found');
        }
        return inventory;
    }
    async getInventoryByMedication(medicationId) {
        return await this.inventoryRepository.find({
            where: { medicationId },
            order: { transactionDate: 'DESC' },
        });
    }
    async getCurrentStock(medicationId) {
        const result = await this.inventoryRepository
            .createQueryBuilder('inventory')
            .select('SUM(CASE WHEN inventory.transactionType = :in THEN inventory.quantity ELSE -inventory.quantity END)', 'stock')
            .where('inventory.medicationId = :medicationId', { medicationId })
            .setParameter('in', inventory_entity_1.InventoryTransactionType.IN)
            .getRawOne();
        return parseInt(result.stock) || 0;
    }
    async getInventoryStatistics() {
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
            .setParameter('in', inventory_entity_1.InventoryTransactionType.IN)
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
    async getLowStockMedications() {
        return [];
    }
    async getExpiredMedications() {
        const expired = await this.inventoryRepository
            .createQueryBuilder('inventory')
            .where('inventory.expiryDate < :now', { now: new Date() })
            .andWhere('inventory.transactionType = :in', { in: inventory_entity_1.InventoryTransactionType.IN })
            .orderBy('inventory.expiryDate', 'ASC')
            .getMany();
        return expired;
    }
    async getMedicationsExpiringSoon(days = 30) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        const expiringSoon = await this.inventoryRepository
            .createQueryBuilder('inventory')
            .where('inventory.expiryDate BETWEEN :now AND :futureDate', {
            now: new Date(),
            futureDate
        })
            .andWhere('inventory.transactionType = :in', { in: inventory_entity_1.InventoryTransactionType.IN })
            .orderBy('inventory.expiryDate', 'ASC')
            .getMany();
        return expiringSoon;
    }
    async getInventoryValue() {
        const result = await this.inventoryRepository
            .createQueryBuilder('inventory')
            .select('SUM(inventory.totalCost)', 'totalValue')
            .where('inventory.transactionType = :in', { in: inventory_entity_1.InventoryTransactionType.IN })
            .getRawOne();
        return parseFloat(result.totalValue) || 0;
    }
    async getInventoryTurnover(medicationId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const outTransactions = await this.inventoryRepository
            .createQueryBuilder('inventory')
            .select('SUM(inventory.quantity)', 'totalOut')
            .where('inventory.medicationId = :medicationId', { medicationId })
            .andWhere('inventory.transactionType = :out', { out: inventory_entity_1.InventoryTransactionType.OUT })
            .andWhere('inventory.transactionDate >= :startDate', { startDate })
            .getRawOne();
        const currentStock = await this.getCurrentStock(medicationId);
        const totalOut = parseInt(outTransactions.totalOut) || 0;
        return currentStock > 0 ? (totalOut / currentStock) * 100 : 0;
    }
    async getInventoryReport(startDate, endDate) {
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map