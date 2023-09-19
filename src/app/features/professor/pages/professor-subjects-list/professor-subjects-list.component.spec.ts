import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorSubjectsListComponent } from './professor-subjects-list.component';

describe('ProfessorSubjectsListComponent', () => {
  let component: ProfessorSubjectsListComponent;
  let fixture: ComponentFixture<ProfessorSubjectsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessorSubjectsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorSubjectsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
