import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostCommonQuestionsComponent } from './most-common-questions.component';

describe('MostCommonQuestionsComponent', () => {
  let component: MostCommonQuestionsComponent;
  let fixture: ComponentFixture<MostCommonQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostCommonQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostCommonQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
