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
  selector: 'app-bug3-reload',
  imports: [RouterLink, BookCardComponent, ControlButtonsComponent, ErrorDisplayComponent],
  providers: [BookService], // Provide instance per component for isolation
  templateUrl: './bug3-reload.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Bug3Reload {
  readonly bookService = inject(BookService);

  // ISBN for the latest Angular book (4th edition)
  readonly selectedIsbn = signal('9783864909467');

  // BUGGY: Standard rxResource - error state persists during reload()
  readonly buggyResource = rxResource<Book, string>({
    params: () => this.selectedIsbn(),
    stream: ({ params: isbn }) => this.bookService.getBook(isbn)
  });

  // FIXED: Using rxResourceFixed - reload() clears error state immediately
  readonly fixedResource = rxResourceFixed<Book, string>({
    params: () => this.selectedIsbn(),
    stream: ({ params: isbn }) => this.bookService.getBook(isbn)
  });

  constructor() {
    // Start in error mode and slow mode to immediately demonstrate the bug
    this.bookService.toggleErrorMode();
    this.bookService.toggleSlowMode();
  }

  reload(): void {
    this.buggyResource.reload();
    this.fixedResource.reload();
  }
}
