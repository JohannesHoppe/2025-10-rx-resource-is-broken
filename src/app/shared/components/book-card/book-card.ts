import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Book } from '../../book.model';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookCardComponent {
  /**
   * The book to display
   */
  book = input.required<Book>();
}
