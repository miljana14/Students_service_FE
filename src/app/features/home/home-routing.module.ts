import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeStudentComponent } from './pages/home-student/home-student.component';
import { HomeProfessorComponent } from './pages/home-professor/home-professor.component';
import { AuthRolesGuard } from 'src/app/core/guards/auth-roles.guard';

const routes: Routes = [
  {path:'home', component: HomePageComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN'] } },
  {path:'home-student', component: HomeStudentComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_STUDENT'] } },
  {path:'home-professor', component: HomeProfessorComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_PROFESSOR'] } },
  {path:'', component: HomePageComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN'] } },
  {path:'', pathMatch:'full', redirectTo:'home'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
