import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvailableExamListComponent } from './pages/available-exam-list/available-exam-list.component';
import { ExamDetailsComponent } from './pages/exam-details/exam-details.component';
import { ExamFormComponent } from './pages/exam-form/exam-form.component';
import { ExamListComponent } from './pages/exam-list/exam-list.component';
import { ExamLoadOneResolver } from './resolvers/exam-load-one.resolver';
import { AuthRolesGuard } from 'src/app/core/guards/auth-roles.guard';

const routes: Routes = [
  {path: 'exam-list', component:ExamListComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN','ROLE_STUDENT', 'ROLE_PROFESSOR'] } },
  {path: 'available-exam-list', component:AvailableExamListComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_STUDENT'] } },
  {path: 'exam-details/:id', component: ExamDetailsComponent, resolve:{examData: ExamLoadOneResolver}, canActivate: [AuthRolesGuard], data: {mode: 'DETAILS', roles: ['ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_PROFESSOR'] } },
  {path: 'exam-form/:id', component: ExamFormComponent,  resolve:{examData: ExamLoadOneResolver}, canActivate: [AuthRolesGuard], data: {mode: 'EDIT', roles: ['ROLE_ADMIN'] } },
  {path: 'exam-form', component: ExamFormComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN'] } },
  {path:'', pathMatch:'full', redirectTo:'exam-list'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }
