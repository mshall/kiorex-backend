import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProxyModule } from '@nestjs/microservices';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import * as redisStore from 'cache-manager-redis-store';

// Middleware
import { AuthMiddleware } from './middleware/auth.middleware';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { CircuitBreakerMiddleware } from './middleware/circuit-breaker.middleware';

// Controllers
import { GatewayController } from './controllers/gateway.controller';
import { HealthController } from './controllers/health.controller';

// Services
import { ProxyService } from './services/proxy.service';
import { AuthService } from './services/auth.service';
import { RateLimitService } from './services/rate-limit.service';
import { CircuitBreakerService } from './services/circuit-breaker.service';
import { LoadBalancerService } from './services/load-balancer.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      ttl: 60,
    }),
  ],
  controllers: [GatewayController, HealthController],
  providers: [
    ProxyService,
    AuthService,
    RateLimitService,
    CircuitBreakerService,
    LoadBalancerService,
  ],
})
export class GatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware, AuthMiddleware, CircuitBreakerMiddleware)
      .forRoutes('*');
  }
}
