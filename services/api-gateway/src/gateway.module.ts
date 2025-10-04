import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
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
import { HealthCheckService } from './services/health-check.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60000,
        limit: 100,
      }],
    }),
    CacheModule.register({
      store: redisStore as any,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
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
  ],
})
export class GatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware, AuthMiddleware, CircuitBreakerMiddleware)
      .forRoutes('*');
  }
}
