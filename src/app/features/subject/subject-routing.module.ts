import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectDetailsComponent } from './pages/subject-details/subject-details.component';
import { SubjectFormComponent } from './pages/subject-form/subject-form.component';
import { SubjectListComponent } from './pages/subject-list/subject-list.component';
import { SubjectLoadOneResolver } from './resolvers/subject-load-one.resolver';
import { AuthRolesGuard } from 'src/app/core/guards/auth-roles.guard';

const routes: Routes = [
  {path: 'subject-list', component:SubjectListComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN','ROLE_STUDENT', 'ROLE_PROFESSOR'] } },
  {path: 'subject-form/:id', component: SubjectFormComponent, resolve:{subjectData: SubjectLoadOneResolver}, canActivate: [AuthRolesGuard], data: { mode: 'EDIT', roles: ['ROLE_ADMIN'] } },
  {path: 'subject-details/:id', component: SubjectDetailsComponent, resolve:{subjectData: SubjectLoadOneResolver}, canActivate: [AuthRolesGuard], data: {mode: 'DETAILS', roles: ['ROLE_ADMIN','ROLE_STUDENT', 'ROLE_PROFESSOR'] } },
  {path: 'subject-form', component: SubjectFormComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN'] } },
  {path:'', pathMatch:'full', redirectTo:'subject-list'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectRoutingModule { }
