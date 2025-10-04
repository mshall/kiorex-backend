import { Repository } from 'typeorm';
import { NotificationTemplate } from '../entities/notification-template.entity';
export declare class TemplateService {
    private templateRepository;
    constructor(templateRepository: Repository<NotificationTemplate>);
    getTemplate(templateId: string): Promise<NotificationTemplate>;
    renderTitle(template: NotificationTemplate, data: any): Promise<string>;
    renderBody(template: NotificationTemplate, data: any): Promise<string>;
    renderHtml(template: NotificationTemplate, data: any): Promise<string>;
    createTemplate(templateData: {
        name: string;
        displayName: string;
        type: string;
        subject: string;
        content: string;
        htmlContent?: string;
        variables?: any[];
    }): Promise<NotificationTemplate>;
    updateTemplate(id: string, updates: any): Promise<NotificationTemplate>;
    getTemplates(type?: string): Promise<NotificationTemplate[]>;
}
