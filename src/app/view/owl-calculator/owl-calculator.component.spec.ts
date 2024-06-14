import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwlCalculatorComponent } from './owl-calculator.component';

describe('OwlCalculatorComponent', () => {
  let component: OwlCalculatorComponent;
  let fixture: ComponentFixture<OwlCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwlCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwlCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
