import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSubjectComponent } from './pages/add-subject/add-subject.component';
import { ProfessorDetailsComponent } from './pages/professor-details/professor-details.component';
import { ProfessorFormComponent } from './pages/professor-form/professor-form.component';
import { ProfessorListComponent } from './pages/professor-list/professor-list.component';
import { ProfessorLoadOneResolver } from './resolvers/professor-load-one.resolver';
import { ChangeProfessorPasswordComponent } from './pages/change-professor-password/change-professor-password.component';
import { AuthRolesGuard } from 'src/app/core/guards/auth-roles.guard';
import { ProfessorSubjectsListComponent } from './pages/professor-subjects-list/professor-subjects-list.component';

const routes: Routes = [
  {path: 'professor-list', component:ProfessorListComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN'] } },
  {path: 'professor-form/:id', component: ProfessorFormComponent, resolve:{professorData: ProfessorLoadOneResolver}, canActivate: [AuthRolesGuard], data: { mode: 'EDIT', roles: ['ROLE_ADMIN','ROLE_PROFESSOR'] } },
  {path: 'change-professor-password/:id', component: ChangeProfessorPasswordComponent, resolve:{professorData: ProfessorLoadOneResolver}, canActivate: [AuthRolesGuard], data: { mode: 'EDIT', roles: ['ROLE_ADMIN','ROLE_PROFESSOR'] } },
  {path: 'professor-details/:id', component: ProfessorDetailsComponent, resolve:{professorData: ProfessorLoadOneResolver}, canActivate: [AuthRolesGuard], data: { mode: 'DETAILS', roles: ['ROLE_ADMIN','ROLE_PROFESSOR'] },
  children:[
    {path: 'add-subject', component: AddSubjectComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN'] }},
  ]},
  {path: 'professor-form', component: ProfessorFormComponent, canActivate: [AuthRolesGuard], data: { mode: 'DETAILS', roles: ['ROLE_ADMIN'] }},
  {path: 'professor-subjects-list', component:ProfessorSubjectsListComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_PROFESSOR'] } },
  {path:'', pathMatch:'full', redirectTo:'home/home-professor'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorRoutingModule { }
