import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminatinPeriodDetailsComponent } from './examinatin-period-details.component';

describe('ExaminatinPeriodDetailsComponent', () => {
  let component: ExaminatinPeriodDetailsComponent;
  let fixture: ComponentFixture<ExaminatinPeriodDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminatinPeriodDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminatinPeriodDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
