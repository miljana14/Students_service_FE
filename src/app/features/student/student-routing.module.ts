import { StudentFormComponent } from './pages/student-form/student-form.component';
import { StudentDetailsComponent } from './pages/student-details/student-details.component';
import { StudentListComponent } from './pages/student-list/student-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentLoadOneResolver } from './resolvers/student-load-one.resolver';
import { ChangeStudentPasswordComponent } from './pages/change-student-password/change-student-password.component';
import { AuthRolesGuard } from 'src/app/core/guards/auth-roles.guard';
import { StudentSubjectsComponent } from './pages/student-subjects/student-subjects.component';

const routes: Routes = [
  {path: 'student-list', component:StudentListComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN'] } },
  {path: 'student-form/:indexNumber/:indexYear', component: StudentFormComponent, resolve:{studentData: StudentLoadOneResolver}, canActivate: [AuthRolesGuard], data: { mode: 'EDIT', roles: ['ROLE_ADMIN', 'ROLE_STUDENT'] } },
  {path: 'change-student-password/:indexNumber/:indexYear', component: ChangeStudentPasswordComponent, resolve:{studentData: StudentLoadOneResolver}, canActivate: [AuthRolesGuard], data: { mode: 'EDIT', roles: ['ROLE_ADMIN', 'ROLE_STUDENT'] } },
  {path: 'student-details/:indexNumber/:indexYear', component: StudentDetailsComponent, resolve:{studentData: StudentLoadOneResolver}, canActivate: [AuthRolesGuard], data: { mode: 'DETAILS', roles: ['ROLE_ADMIN', 'ROLE_STUDENT'] } },
  {path: 'student-form', component: StudentFormComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN'] } },
  {path: 'student-subjects', component: StudentSubjectsComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_STUDENT'] } },
  {path:'', pathMatch:'full', redirectTo:'student-list'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
