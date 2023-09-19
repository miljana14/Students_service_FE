import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MarkRoutingModule } from './mark-routing.module';
import { ProfessorExamListComponent } from './pages/professor-exam-list/professor-exam-list.component';
import { StudentsExamapplicationListComponent } from './pages/students-examapplication-list/students-examapplication-list.component';
import { MarkListComponent } from './pages/mark-list/mark-list.component';



@NgModule({
  declarations: [
    ProfessorExamListComponent,
    StudentsExamapplicationListComponent,
    MarkListComponent
  ],
  imports: [
    CommonModule,
    MarkRoutingModule,
    SharedModule
    
  ]
})
export class MarkModule { }
