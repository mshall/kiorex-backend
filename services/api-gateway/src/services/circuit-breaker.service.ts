import { Injectable } from '@nestjs/common';

enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half_open',
}

interface CircuitBreaker {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime: Date | null;
  nextAttempt: Date | null;
}

@Injectable()
export class CircuitBreakerService {
  private circuits: Map<string, CircuitBreaker> = new Map();
  private readonly FAILURE_THRESHOLD = 5;
  private readonly SUCCESS_THRESHOLD = 3;
  private readonly TIMEOUT_DURATION = 60000; // 60 seconds
  private readonly HALF_OPEN_REQUESTS = 3;

  async isOpen(serviceName: string): Promise<boolean> {
    const circuit = this.getCircuit(serviceName);

    if (circuit.state === CircuitState.OPEN) {
      if (new Date() >= circuit.nextAttempt!) {
        this.transitionToHalfOpen(serviceName);
        return false;
      }
      return true;
    }

    return false;
  }

  recordSuccess(serviceName: string): void {
    const circuit = this.getCircuit(serviceName);

    if (circuit.state === CircuitState.HALF_OPEN) {
      circuit.successCount++;
      if (circuit.successCount >= this.SUCCESS_THRESHOLD) {
        this.close(serviceName);
      }
    } else if (circuit.state === CircuitState.CLOSED) {
      circuit.failureCount = 0;
    }
  }

  recordFailure(serviceName: string): void {
    const circuit = this.getCircuit(serviceName);

    if (circuit.state === CircuitState.HALF_OPEN) {
      this.open(serviceName);
    } else if (circuit.state === CircuitState.CLOSED) {
      circuit.failureCount++;
      circuit.lastFailureTime = new Date();

      if (circuit.failureCount >= this.FAILURE_THRESHOLD) {
        this.open(serviceName);
      }
    }
  }

  private getCircuit(serviceName: string): CircuitBreaker {
    if (!this.circuits.has(serviceName)) {
      this.circuits.set(serviceName, {
        state: CircuitState.CLOSED,
        failureCount: 0,
        successCount: 0,
        lastFailureTime: null,
        nextAttempt: null,
      });
    }

    return this.circuits.get(serviceName)!;
  }

  private open(serviceName: string): void {
    const circuit = this.getCircuit(serviceName);
    circuit.state = CircuitState.OPEN;
    circuit.nextAttempt = new Date(Date.now() + this.TIMEOUT_DURATION);
    console.warn(`Circuit breaker OPEN for service: ${serviceName}`);
  }

  private close(serviceName: string): void {
    const circuit = this.getCircuit(serviceName);
    circuit.state = CircuitState.CLOSED;
    circuit.failureCount = 0;
    circuit.successCount = 0;
    circuit.lastFailureTime = null;
    circuit.nextAttempt = null;
    console.info(`Circuit breaker CLOSED for service: ${serviceName}`);
  }

  private transitionToHalfOpen(serviceName: string): void {
    const circuit = this.getCircuit(serviceName);
    circuit.state = CircuitState.HALF_OPEN;
    circuit.successCount = 0;
    console.info(`Circuit breaker HALF-OPEN for service: ${serviceName}`);
  }
}
