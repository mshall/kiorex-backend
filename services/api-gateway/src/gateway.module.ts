import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

// Guards
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthGuard } from './guards/auth.guard';
import { ApiKeyGuard } from './guards/api-key.guard';

// Interceptors
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { CircuitBreakerInterceptor } from './interceptors/circuit-breaker.interceptor';

// Middleware
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { CompressionMiddleware } from './middleware/compression.middleware';
import { CorsMiddleware } from './middleware/cors.middleware';

// Services
import { ProxyService } from './services/proxy.service';
import { AuthService } from './services/auth.service';
import { RateLimitService } from './services/rate-limit.service';
import { CircuitBreakerService } from './services/circuit-breaker.service';
import { LoadBalancerService } from './services/load-balancer.service';
import { HealthCheckService } from './services/health-check.service';

// Controllers
import { GatewayController } from './controllers/gateway.controller';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    HealthCheckService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CircuitBreakerInterceptor,
    },
  ],
})
export class GatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, CompressionMiddleware, CorsMiddleware)
      .forRoutes('*');
  }
}
