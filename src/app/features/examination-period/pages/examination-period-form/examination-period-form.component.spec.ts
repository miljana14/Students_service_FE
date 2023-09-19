import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationPeriodFormComponent } from './examination-period-form.component';

describe('ExaminationPeriodFormComponent', () => {
  let component: ExaminationPeriodFormComponent;
  let fixture: ComponentFixture<ExaminationPeriodFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationPeriodFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminationPeriodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
