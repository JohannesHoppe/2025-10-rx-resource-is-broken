import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-control-buttons',
  templateUrl: './control-buttons.html',
  styleUrl: './control-buttons.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlButtonsComponent {
  /**
   * Whether slow mode is currently enabled
   */
  isSlowModeEnabled = input.required<boolean>();

  /**
   * Whether error mode is currently enabled
   */
  isErrorModeEnabled = input.required<boolean>();

  /**
   * Emitted when the slow mode button is clicked
   */
  slowModeToggle = output<void>();

  /**
   * Emitted when the error mode button is clicked
   */
  errorModeToggle = output<void>();
}
