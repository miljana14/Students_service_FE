import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentListComponent } from './pages/student-list/student-list.component';
import { StudentFormComponent } from './pages/student-form/student-form.component';
import { StudentDetailsComponent } from './pages/student-details/student-details.component';
import { ChangeStudentPasswordComponent } from './pages/change-student-password/change-student-password.component';
import { StudentSubjectsComponent } from './pages/student-subjects/student-subjects.component';


@NgModule({
  declarations: [
    StudentListComponent,
    StudentFormComponent,
    StudentDetailsComponent,
    ChangeStudentPasswordComponent,
    StudentSubjectsComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    SharedModule
  ]
})
export class StudentModule { }
