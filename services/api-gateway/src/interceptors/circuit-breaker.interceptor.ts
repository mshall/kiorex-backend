import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CircuitBreakerService } from '../services/circuit-breaker.service';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  constructor(private readonly circuitBreaker: CircuitBreakerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const serviceName = request.headers['X-Service-Name'] as string;

    if (!serviceName) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        // Record success
        this.circuitBreaker.recordSuccess(serviceName);
      }),
      catchError((error) => {
        // Record failure
        this.circuitBreaker.recordFailure(serviceName);
        return throwError(() => error);
      }),
    );
  }
}
