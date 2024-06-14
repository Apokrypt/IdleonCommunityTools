import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestartDisplayComponent } from './restart-display.component';

describe('RestartDisplayComponent', () => {
  let component: RestartDisplayComponent;
  let fixture: ComponentFixture<RestartDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestartDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RestartDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
