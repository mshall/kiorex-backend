import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplate } from '../entities/notification-template.entity';
import * as Handlebars from 'handlebars';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(NotificationTemplate)
    private templateRepository: Repository<NotificationTemplate>,
  ) {}

  async getTemplate(templateId: string): Promise<NotificationTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id: templateId, isActive: true },
    });

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    return template;
  }

  async renderTitle(template: NotificationTemplate, data: any): Promise<string> {
    const compiledTemplate = Handlebars.compile(template.subject);
    return compiledTemplate(data);
  }

  async renderBody(template: NotificationTemplate, data: any): Promise<string> {
    const compiledTemplate = Handlebars.compile(template.content);
    return compiledTemplate(data);
  }

  async renderHtml(template: NotificationTemplate, data: any): Promise<string> {
    if (!template.htmlContent) {
      return await this.renderBody(template, data);
    }

    const compiledTemplate = Handlebars.compile(template.htmlContent);
    return compiledTemplate(data);
  }

  async createTemplate(templateData: {
    name: string;
    displayName: string;
    type: string;
    subject: string;
    content: string;
    htmlContent?: string;
    variables?: any[];
  }): Promise<NotificationTemplate> {
    const template = this.templateRepository.create({
      ...templateData,
      type: templateData.type as any,
    });
    const savedTemplate = await this.templateRepository.save(template);
    return Array.isArray(savedTemplate) ? savedTemplate[0] : savedTemplate;
  }

  async updateTemplate(id: string, updates: any): Promise<NotificationTemplate> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new Error(`Template ${id} not found`);
    }

    Object.assign(template, updates);
    return await this.templateRepository.save(template);
  }

  async getTemplates(type?: string): Promise<NotificationTemplate[]> {
    const query = this.templateRepository.createQueryBuilder('template')
      .where('template.isActive = :isActive', { isActive: true });

    if (type) {
      query.andWhere('template.type = :type', { type });
    }

    return await query.getMany();
  }
}
