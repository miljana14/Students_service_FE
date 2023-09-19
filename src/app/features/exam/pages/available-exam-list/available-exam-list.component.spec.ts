import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableExamListComponent } from './available-exam-list.component';

describe('AvailableExamListComponent', () => {
  let component: AvailableExamListComponent;
  let fixture: ComponentFixture<AvailableExamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableExamListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
