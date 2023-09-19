import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorExamListComponent } from './professor-exam-list.component';

describe('ProfessorExamListComponent', () => {
  let component: ProfessorExamListComponent;
  let fixture: ComponentFixture<ProfessorExamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessorExamListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
