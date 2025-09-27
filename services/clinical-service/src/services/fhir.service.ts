import { Injectable } from '@nestjs/common';

@Injectable()
export class FHIRService {
  async convertToFHIR(medicalRecord: any): Promise<any> {
    // Convert medical record to FHIR Bundle format
    const bundle = {
      resourceType: 'Bundle',
      type: 'document',
      id: medicalRecord.id,
      timestamp: new Date().toISOString(),
      entry: [
        {
          resource: {
            resourceType: 'Composition',
            id: medicalRecord.id,
            status: 'final',
            type: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: this.getRecordTypeCode(medicalRecord.recordType),
                  display: medicalRecord.recordType,
                },
              ],
            },
            subject: {
              reference: `Patient/${medicalRecord.patientId}`,
            },
            author: [
              {
                reference: `Practitioner/${medicalRecord.providerId}`,
              },
            ],
            date: medicalRecord.encounterDate,
            title: 'Medical Record',
            section: [
              {
                title: 'Chief Complaint',
                text: {
                  status: 'generated',
                  div: `<div>${medicalRecord.chiefComplaint}</div>`,
                },
              },
              {
                title: 'History of Present Illness',
                text: {
                  status: 'generated',
                  div: `<div>${medicalRecord.historyOfPresentIllness}</div>`,
                },
              },
              {
                title: 'Physical Examination',
                text: {
                  status: 'generated',
                  div: `<div>${medicalRecord.physicalExamination}</div>`,
                },
              },
              {
                title: 'Assessment and Plan',
                text: {
                  status: 'generated',
                  div: `<div><strong>Assessment:</strong> ${medicalRecord.assessment}<br/><strong>Plan:</strong> ${medicalRecord.plan}</div>`,
                },
              },
            ],
          },
        },
      ],
    };

    return bundle;
  }

  async createBundle(records: any[]): Promise<any> {
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      id: 'patient-records-bundle',
      timestamp: new Date().toISOString(),
      entry: records.map(record => ({
        resource: this.convertToFHIR(record),
      })),
    };

    return bundle;
  }

  private getRecordTypeCode(recordType: string): string {
    const typeMap = {
      consultation: '11488-4',
      hospitalization: '11490-0',
      emergency: '11492-6',
      routine_checkup: '185349003',
      follow_up: '185350003',
    };

    return typeMap[recordType] || '11488-4';
  }
}
