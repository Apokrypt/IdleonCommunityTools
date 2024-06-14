import { CommonModule } from '@angular/common';
import {
  Component,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { ComputedStatus } from '../../models/talent.model';
import { DurationPipe } from '../../pipes/duration';
import { computeStatus } from '../../utils/talent.utils';
import { TalentCardComponent } from '../talent-card';

@Component({
  selector: 'restart-display',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatIconButton,
    MatIcon,
    MatMiniFabButton,
    DurationPipe,
    TalentCardComponent,
  ],
  templateUrl: './restart-display.component.html',
  styleUrl: './restart-display.component.scss',
})
export class RestartDisplayComponent {
  readonly bonusesOfOrionLevel: WritableSignal<number> = signal<number>(32);
  readonly featherRestartLevel: WritableSignal<number> = signal<number>(36);
  readonly theGreatMegaResetLevel: WritableSignal<number> = signal<number>(24);

  readonly computedStatus: Signal<ComputedStatus> = computed(() => {
    return computeStatus({
      bonusesOfOrionLevel: this.bonusesOfOrionLevel(),
      featherRestartLevel: this.featherRestartLevel(),
      theGreatMegaResetLevel: this.theGreatMegaResetLevel(),
    });
  });
}
