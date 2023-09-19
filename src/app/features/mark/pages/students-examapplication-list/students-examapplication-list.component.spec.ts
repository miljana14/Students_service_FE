import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsExamapplicationListComponent } from './students-examapplication-list.component';

describe('StudentsExamapplicationListComponent', () => {
  let component: StudentsExamapplicationListComponent;
  let fixture: ComponentFixture<StudentsExamapplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsExamapplicationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsExamapplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
