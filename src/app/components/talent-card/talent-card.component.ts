import {
  Component,
  InputSignal,
  OutputEmitterRef,
  Signal,
  computed,
  input,
  output,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ComputedTalent } from '../../models/talent.model';
import { DurationPipe } from '../../pipes/duration';
import { TalentName } from '../../utils/talent.utils';

function toBounds(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

@Component({
  selector: 'talent-card',
  standalone: true,
  imports: [MatIconButton, MatIcon, DurationPipe],
  templateUrl: './talent-card.component.html',
  styleUrl: './talent-card.component.scss',
  host: {
    '[style.--talent-card-background-url]': '"url(" + backgroundUrl() + ")"',
  },
})
export class TalentCardComponent {
  readonly talentName: InputSignal<`${TalentName}`> =
    input.required<`${TalentName}`>();
  readonly talent: InputSignal<ComputedTalent> =
    input.required<ComputedTalent>();
  readonly backgroundUrl: InputSignal<string> = input.required<string>();

  readonly totalSetupDuration: InputSignal<number> = input<number>(0);
  readonly canChangeLevel: InputSignal<boolean> = input<boolean>(false);
  readonly minLevel: InputSignal<number> = input<number>(20);
  readonly maxLevel: InputSignal<number> = input<number>(50);
  readonly totalShinyFeathers: InputSignal<number | null> = input<
    number | null
  >(null);

  readonly levelChange: OutputEmitterRef<number> = output<number>();
  readonly toggleChange: OutputEmitterRef<boolean> = output<boolean>();

  readonly isActiveTalent: Signal<boolean> = computed(() => {
    return this.talentName() === TalentName.BonusesOfOrion ||
      this.talentName() === TalentName.FeatherRestart ||
      this.talentName() === TalentName.TheGreatMegaReset;
  });

  readonly totalDuration: Signal<number> = computed(() => {
    return this.totalSetupDuration() + this.talent().nextDuration;
  });

  readonly setupDuration: Signal<number> = computed(() => {
    return this.talent().prevDurations.reduce((acc, nxt) => acc + nxt, 0);
  });

  protected changeLevelBy(value: number): void {
    const { level } = this.talent();
    const next = level + value;
    const min = this.minLevel();
    const max = this.maxLevel();
    this.levelChange.emit(toBounds(next, min, max));
  }
}
