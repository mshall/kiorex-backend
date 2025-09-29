import axios from 'axios';

const services = [
  { name: 'Gateway', url: 'http://localhost:3000/health' },
  { name: 'Auth', url: 'http://localhost:3001/health' },
  { name: 'User', url: 'http://localhost:3002/health' },
  { name: 'Appointment', url: 'http://localhost:3005/health' },
  { name: 'Payment', url: 'http://localhost:3004/health' },
  { name: 'Clinical', url: 'http://localhost:3006/health' },
  { name: 'Notification', url: 'http://localhost:3007/health' },
  { name: 'Search', url: 'http://localhost:3008/health' },
  { name: 'Video', url: 'http://localhost:3009/health' },
  { name: 'Analytics', url: 'http://localhost:3010/health' },
];

async function checkHealth() {
  const results = await Promise.all(
    services.map(async (service) => {
      try {
        const response = await axios.get(service.url, { timeout: 5000 });
        return {
          service: service.name,
          status: 'healthy',
          responseTime: response.headers['x-response-time'],
        };
      } catch (error) {
        return {
          service: service.name,
          status: 'unhealthy',
          error: error.message,
        };
      }
    })
  );

  const unhealthy = results.filter(r => r.status === 'unhealthy');
  
  if (unhealthy.length > 0) {
    console.error('Unhealthy services:', unhealthy);
    process.exit(1);
  }

  console.log('All services healthy:', results);
  process.exit(0);
}

checkHealth();
