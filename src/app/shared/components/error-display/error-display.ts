import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Component for displaying error details consistently across demos.
 * Shows error type, message, and HTTP cause details if available.
 */
@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.html',
  styleUrl: './error-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorDisplayComponent {
  /** The error to display */
  error = input.required<unknown>();

  getErrorMessage(error: unknown): string {
    if (!error) return 'No error';
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return JSON.stringify(error, null, 2);
  }

  getErrorType(error: unknown): string {
    if (!error) return 'unknown';
    if (error instanceof Error) return error.constructor.name;
    return typeof error;
  }

  hasCause(error: unknown): boolean {
    return error instanceof Error && 'cause' in error && error.cause !== undefined;
  }

  getCauseDetails(error: unknown): string {
    if (!this.hasCause(error)) return 'No cause available';
    const err = error as Error & { cause: any };
    if (err.cause && typeof err.cause === 'object') {
      const status = err.cause.status || 'unknown';
      const statusText = err.cause.statusText || 'unknown';
      const url = err.cause.url || 'unknown';
      return `Status: ${status} ${statusText}\nURL: ${url}`;
    }
    return JSON.stringify(err.cause, null, 2);
  }
}
