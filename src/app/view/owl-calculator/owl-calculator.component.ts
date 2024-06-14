import { Component } from '@angular/core';
import { RestartDisplayComponent } from '../../components/restart-display';

@Component({
  selector: 'owl-calculator',
  standalone: true,
  imports: [RestartDisplayComponent],
  templateUrl: './owl-calculator.component.html',
  styleUrl: './owl-calculator.component.scss',
})
export class OwlCalculatorComponent {}
