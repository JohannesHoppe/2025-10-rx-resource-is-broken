import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { BookCardComponent } from '../../shared/components/book-card/book-card';
import { ControlButtonsComponent } from '../../shared/components/control-buttons/control-buttons';
import { ErrorDisplayComponent } from '../../shared/components/error-display/error-display';
import { Book } from '../../shared/book.model';
import { BookService } from '../../shared/book.service';
import { rxResourceFixed } from '../../shared/rx-resource-fixed';

@Component({
  selector: 'app-bug2-error-handling',
  imports: [RouterLink, BookCardComponent, ControlButtonsComponent, ErrorDisplayComponent],
  providers: [BookService], // Provide instance per component for isolation
  templateUrl: './bug2-error-handling.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Bug2ErrorHandling {
  readonly bookService = inject(BookService);

  // List of book ISBNs to cycle through
  private readonly bookIsbns = [
    '9783864909467',
    '9783864907791',
    '9783864906466',
    '9783864903571',
    '9783960092421',
    '9783960092186',
    '9783864909009',
    '9783960091578',
    '9783960091417',
    '9783864907845',
    '9783864905520',
    '9783864904523',
  ];

  // Single ISBN signal - both resources use the same signal (like Demo #1 pattern)
  readonly selectedIsbn = signal(this.bookIsbns[0]);

  // BUGGY: Standard rxResource WITHOUT error handler
  readonly buggyResource = rxResource<Book, string>({
    params: () => this.selectedIsbn(),
    stream: ({ params: isbn }) => this.bookService.getBook(isbn)
  });

  // FIXED: Using rxResourceFixed - handles errors properly
  readonly fixedResource = rxResourceFixed<Book, string>({
    params: () => this.selectedIsbn(),
    stream: ({ params: isbn }) => this.bookService.getBook(isbn)
  });

  loadNext(): void {
    this.selectedIsbn.update(current => this.getNextIsbn(current));
  }

  private getNextIsbn(currentIsbn: string): string {
    const currentIndex = this.bookIsbns.indexOf(currentIsbn);
    const nextIndex = (currentIndex + 1) % this.bookIsbns.length;
    return this.bookIsbns[nextIndex];
  }
}
