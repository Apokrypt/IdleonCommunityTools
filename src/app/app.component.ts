import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RestartDisplayComponent } from './components/restart-display';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RestartDisplayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
