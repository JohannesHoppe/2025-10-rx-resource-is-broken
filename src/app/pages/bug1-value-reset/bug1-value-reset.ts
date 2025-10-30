import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { BookCardComponent } from '../../shared/components/book-card/book-card';
import { ControlButtonsComponent } from '../../shared/components/control-buttons/control-buttons';
import { Book } from '../../shared/book.model';
import { BookService } from '../../shared/book.service';
import { rxResourceFixed } from '../../shared/rx-resource-fixed';

@Component({
  selector: 'app-bug1-value-reset',
  imports: [RouterLink, BookCardComponent, ControlButtonsComponent],
  providers: [BookService], // Provide instance per component for isolation
  templateUrl: './bug1-value-reset.html',
  styleUrl: './bug1-value-reset.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Bug1ValueReset {
  readonly bookService = inject(BookService);

  // Search terms to cycle through
  private readonly searchTerms = ['Angular', 'TypeScript', 'Node', 'JavaScript'];

  // Search term to trigger reload (start with first search term)
  readonly searchTerm = signal(this.searchTerms[0]);

  constructor() {
    // Enable slow mode by default for easier bug recognition
    this.bookService.toggleSlowMode();
  }

  // BUGGY: Standard rxResource (demonstrates the bug)
  readonly buggyResource = rxResource<Book[], string>({
    params: () => this.searchTerm(),
    stream: ({ params: search }) => this.bookService.searchBooks(search)
  });

  // FIXED: Our fixed version (demonstrates the solution)
  readonly fixedResource = rxResourceFixed<Book[], string>({
    params: () => this.searchTerm(),
    stream: ({ params: search }) => this.bookService.searchBooks(search)
  });

  nextSearch(): void {
    this.searchTerm.update(current => this.getNextSearch(current));
  }

  private getNextSearch(currentSearch: string): string {
    const currentIndex = this.searchTerms.indexOf(currentSearch);
    const nextIndex = (currentIndex + 1) % this.searchTerms.length;
    return this.searchTerms[nextIndex];
  }
}
