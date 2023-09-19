import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProfessorPasswordComponent } from './change-professor-password.component';

describe('ChangeProfessorPasswordComponent', () => {
  let component: ChangeProfessorPasswordComponent;
  let fixture: ComponentFixture<ChangeProfessorPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeProfessorPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeProfessorPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
