import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'change-password', component: ChangePasswordComponent},
  {path: 'home',
    loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule)},
    {path: 'student',
    loadChildren: () => import('./features/student/student.module').then((m) => m.StudentModule)},
    {path: 'subject',
    loadChildren: () => import('./features/subject/subject.module').then((m) => m.SubjectModule)},
    {path: 'professor',
    loadChildren: () => import('./features/professor/professor.module').then((m) => m.ProfessorModule)},
    {path: 'examination-period',
    loadChildren: () => import('./features/examination-period/examination-period.module').then((m) => m.ExaminationPeriodModule)},
    {path: 'exam',
    loadChildren: () => import('./features/exam/exam.module').then((m) => m.ExamModule)},
    {path: 'mark',
    loadChildren: () => import('./features/mark/mark.module').then((m) => m.MarkModule)},
    {path: 'schedule',
    loadChildren: () => import('./features/schedules/schedule.module').then((m) => m.ScheduleModule)},
  {path: '', pathMatch:"full", redirectTo:'/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
