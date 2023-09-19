import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MostCommonQuestionsComponent } from './pages/most-common-questions/most-common-questions.component';
import { AuthRolesGuard } from 'src/app/core/guards/auth-roles.guard';

const routes: Routes = [
  {path: 'questions', component:MostCommonQuestionsComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN','ROLE_STUDENT', 'ROLE_PROFESSOR'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
