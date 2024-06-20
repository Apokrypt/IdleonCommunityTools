import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'owl-calculator',
    loadComponent: () =>
      import('./view/owl-calculator').then((m) => m.OwlCalculatorComponent),
  },
  {
    path: 'farming-simulator',
    loadComponent: () =>
      import('./view/farming-simulator').then(
        (m) => m.FarmingSimulatorComponent
      ),
  },
  // TODO: Remove
  {
    path: '**',
    redirectTo: '/owl-calculator',
  },
];
