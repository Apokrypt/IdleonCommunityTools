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
import { ComputedStatus, ToggleableTalent } from '../../models/talent.model';
import { DurationPipe } from '../../pipes/duration';
import { computeStatus } from '../../utils/talent.utils';
import { TalentCardComponent } from '../talent-card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
    MatButtonToggleModule,
  ],
  templateUrl: './restart-display.component.html',
  styleUrl: './restart-display.component.scss',
})
export class RestartDisplayComponent {
  readonly bonusesOfOrionLevel: WritableSignal<number> = signal<number>(20);
  readonly featherRestartLevel: WritableSignal<number> = signal<number>(20);
  readonly theGreatMegaResetLevel: WritableSignal<number> = signal<number>(20);
  readonly targetTalent: WritableSignal<`${ToggleableTalent}`> =
    signal<`${ToggleableTalent}`>(ToggleableTalent.FeatherRestart);

  readonly computedStatus: Signal<ComputedStatus> = computed(() => {
    return computeStatus({
      targetTalent: this.targetTalent(),
      bonusesOfOrionLevel: this.bonusesOfOrionLevel(),
      featherRestartLevel: this.featherRestartLevel(),
      theGreatMegaResetLevel: this.theGreatMegaResetLevel(),
    });
  });
}
