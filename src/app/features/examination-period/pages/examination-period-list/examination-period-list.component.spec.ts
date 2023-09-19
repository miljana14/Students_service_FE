import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationPeriodListComponent } from './examination-period-list.component';

describe('ExaminationPeriodListComponent', () => {
  let component: ExaminationPeriodListComponent;
  let fixture: ComponentFixture<ExaminationPeriodListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationPeriodListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminationPeriodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
