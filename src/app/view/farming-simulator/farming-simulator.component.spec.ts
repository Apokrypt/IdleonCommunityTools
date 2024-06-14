import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmingSimulatorComponent } from './farming-simulator.component';

describe('FarmingSimulatorComponent', () => {
  let component: FarmingSimulatorComponent;
  let fixture: ComponentFixture<FarmingSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmingSimulatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmingSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
