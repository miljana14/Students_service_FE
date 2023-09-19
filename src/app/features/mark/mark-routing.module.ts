import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessorExamListComponent } from './pages/professor-exam-list/professor-exam-list.component';
import { StudentsExamapplicationListComponent } from './pages/students-examapplication-list/students-examapplication-list.component';
import { ExamLoadOneResolver } from '../exam/resolvers/exam-load-one.resolver';
import { MarkListComponent } from './pages/mark-list/mark-list.component';
import { AuthRolesGuard } from 'src/app/core/guards/auth-roles.guard';

const routes: Routes = [
  {path: 'professor-exam-list', component: ProfessorExamListComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_PROFESSOR'] } },
  {path: 'mark-list', component: MarkListComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_STUDENT'] } },
  {path: 'student-examapplication-list/:id', component: StudentsExamapplicationListComponent, resolve:{examData: ExamLoadOneResolver}, canActivate: [AuthRolesGuard], data: { mode: 'DETAILS', roles: ['ROLE_PROFESSOR'] } },
  {path:'', pathMatch:'full', redirectTo:'professor-exam-list'}
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkRoutingModule { }
