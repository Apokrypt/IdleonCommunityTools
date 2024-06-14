import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

interface Crop {
  seed: number;
  evolution: number;
}

@Component({
  selector: 'farming-simulator',
  standalone: true,
  imports: [MatButtonToggleModule],
  templateUrl: './farming-simulator.component.html',
  styleUrl: './farming-simulator.component.scss',
})
export class FarmingSimulatorComponent {
  protected crops: (Crop | null)[] = Array(36).fill(null);
}
