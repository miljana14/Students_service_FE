import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessorRoutingModule } from './professor-routing.module';
import { ProfessorListComponent } from './pages/professor-list/professor-list.component';
import { ProfessorFormComponent } from './pages/professor-form/professor-form.component';
import { ProfessorDetailsComponent } from './pages/professor-details/professor-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddSubjectComponent } from './pages/add-subject/add-subject.component';
import { ChangeProfessorPasswordComponent } from './pages/change-professor-password/change-professor-password.component';
import { ProfessorSubjectsListComponent } from './pages/professor-subjects-list/professor-subjects-list.component';


@NgModule({
  declarations: [
    ProfessorListComponent,
    ProfessorFormComponent,
    ProfessorDetailsComponent,
    AddSubjectComponent,
    ChangeProfessorPasswordComponent,
    ProfessorSubjectsListComponent
  ],
  imports: [
    CommonModule,
    ProfessorRoutingModule,
    SharedModule
  ]
})
export class ProfessorModule { }
