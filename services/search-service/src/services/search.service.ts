import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  async searchProviders(query: any): Promise<any> {
    const { 
      q, 
      specialization, 
      location, 
      radius,
      insurance,
      rating,
      availability,
      page = 1,
      limit = 20,
    } = query;

    const must = [];
    const filter = [];

    // Full-text search
    if (q) {
      must.push({
        multi_match: {
          query: q,
          fields: ['name^3', 'specialization^2', 'bio', 'education'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      });
    }

    // Specialization filter
    if (specialization) {
      filter.push({
        term: { 'specialization.keyword': specialization },
      });
    }

    // Location-based search
    if (location && location.lat && location.lon) {
      filter.push({
        geo_distance: {
          distance: `${radius || 10}km`,
          location: {
            lat: location.lat,
            lon: location.lon,
          },
        },
      });
    }

    // Insurance filter
    if (insurance && insurance.length > 0) {
      filter.push({
        terms: { 'insurance_accepted.keyword': insurance },
      });
    }

    // Rating filter
    if (rating) {
      filter.push({
        range: { rating: { gte: rating } },
      });
    }

    // Availability filter
    if (availability) {
      filter.push({
        term: { accepting_new_patients: true },
      });
    }

    const body = {
      query: {
        bool: {
          must,
          filter,
        },
      },
      aggs: {
        specializations: {
          terms: { field: 'specialization.keyword' },
        },
        insurance_providers: {
          terms: { field: 'insurance_accepted.keyword' },
        },
        rating_ranges: {
          range: {
            field: 'rating',
            ranges: [
              { from: 4.5, key: '4.5+' },
              { from: 4.0, to: 4.5, key: '4.0-4.5' },
              { from: 3.5, to: 4.0, key: '3.5-4.0' },
            ],
          },
        },
      },
      highlight: {
        fields: {
          name: {},
          bio: {},
          specialization: {},
        },
      },
      from: (page - 1) * limit,
      size: limit,
      sort: this.getSortCriteria(query.sortBy),
    };

    const result = await this.esService.search({
      index: 'providers',
      body,
    });

    return this.formatSearchResults(result);
  }

  async searchAppointments(query: any): Promise<any> {
    const { providerId, date, timeSlot, type } = query;
    
    const must = [];
    const filter = [
      { term: { status: 'available' } },
    ];

    if (providerId) {
      filter.push({ term: { provider_id: providerId } });
    }

    if (date) {
      filter.push({
        range: {
          start_time: {
            gte: `${date}T00:00:00`,
            lte: `${date}T23:59:59`,
          },
        },
      });
    }

    if (type) {
      filter.push({ term: { 'appointment_type.keyword': type } });
    }

    const result = await this.esService.search({
      index: 'appointments',
      body: {
        query: { bool: { filter } },
        size: 100,
        sort: [{ start_time: 'asc' }],
      },
    });

    return this.formatSearchResults(result);
  }

  async searchClinicalRecords(patientId: string, query: string): Promise<any> {
    const result = await this.esService.search({
      index: 'clinical_records',
      body: {
        query: {
          bool: {
            must: [
              { term: { patient_id: patientId } },
              {
                multi_match: {
                  query,
                  fields: ['diagnosis', 'notes', 'medications', 'procedures'],
                },
              },
            ],
          },
        },
        highlight: {
          fields: {
            diagnosis: {},
            notes: {},
            medications: {},
          },
        },
        size: 50,
        sort: [{ encounter_date: 'desc' }],
      },
    });

    return this.formatSearchResults(result);
  }

  async autocomplete(query: string, type: string): Promise<string[]> {
    const result = await this.esService.search({
      index: type,
      body: {
        suggest: {
          suggestions: {
            prefix: query,
            completion: {
              field: 'suggest',
              size: 10,
              fuzzy: {
                fuzziness: 'AUTO',
              },
            },
          },
        },
      },
    });

    return result.suggest.suggestions[0].options.map(o => o.text);
  }

  private getSortCriteria(sortBy: string): any[] {
    switch (sortBy) {
      case 'rating':
        return [{ rating: 'desc' }];
      case 'distance':
        return [{ _geo_distance: { location: 'asc' } }];
      case 'price':
        return [{ consultation_fee: 'asc' }];
      default:
        return [{ _score: 'desc' }];
    }
  }

  private formatSearchResults(result: any): any {
    return {
      hits: result.hits.hits.map(hit => ({
        ...hit._source,
        _id: hit._id,
        _score: hit._score,
        highlights: hit.highlight,
      })),
      total: result.hits.total.value,
      aggregations: result.aggregations,
    };
  }
}
