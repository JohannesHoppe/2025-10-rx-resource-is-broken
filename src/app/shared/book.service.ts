import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Book } from './book.model';

/**
 * Service for fetching book data from the Angular Buch API.
 *
 * Includes error simulation mode for testing error handling in demos.
 *
 * NOT provided in root - each component should provide its own instance
 * to ensure isolated state for demos.
 */
@Injectable()
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'https://api6.angular-buch.com';
  private simulateError = false;
  private slowModeDelay = 0; // milliseconds

  toggleErrorMode(): void {
    this.simulateError = !this.simulateError;
  }

  isErrorModeEnabled(): boolean {
    return this.simulateError;
  }

  toggleSlowMode(): void {
    this.slowModeDelay = this.slowModeDelay > 0 ? 0 : 3000;
  }

  isSlowModeEnabled(): boolean {
    return this.slowModeDelay > 0;
  }

  getBook(isbn: string): Observable<Book> {
    const url = `${this.apiBaseUrl}/books/${isbn}`;
    return this.makeRequest(url, this.http.get<Book>(url));
  }

  getAllBooks(): Observable<Book[]> {
    const url = `${this.apiBaseUrl}/books`;
    return this.makeRequest(url, this.http.get<Book[]>(url));
  }

  searchBooks(searchTerm: string): Observable<Book[]> {
    const url = `${this.apiBaseUrl}/books?search=${encodeURIComponent(searchTerm)}`;
    return this.makeRequest(url, this.http.get<Book[]>(url));
  }

  /**
   * Helper method to handle error simulation and slow mode delay for all requests.
   * Delay happens first, THEN the observable executes (timer(0) emits immediately).
   */
  private makeRequest<T>(url: string, observable$: Observable<T>): Observable<T> {
    const request$ = this.simulateError
      ? throwError(() =>
          new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
            url,
            error: { message: 'Simulated server error for testing' }
          })
        )
      : observable$;

    return timer(this.slowModeDelay).pipe(switchMap(() => request$));
  }
}
