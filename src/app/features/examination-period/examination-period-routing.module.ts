import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExaminationPeriodFormComponent } from './pages/examination-period-form/examination-period-form.component';
import { ExaminationPeriodListComponent } from './pages/examination-period-list/examination-period-list.component';
import { ExaminationPeriodLoadOneResolver } from './resolvers/examination-period-load-one.resolver';
import { AuthRolesGuard } from 'src/app/core/guards/auth-roles.guard';
import { ExaminatinPeriodDetailsComponent } from './pages/examinatin-period-details/examinatin-period-details.component';

const routes: Routes = [
  {path: 'examination-period-list', component:ExaminationPeriodListComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN','ROLE_STUDENT', 'ROLE_PROFESSOR'] } },
  {path: 'examination-period-form/:id', component: ExaminationPeriodFormComponent, resolve:{examinationPeriodData: ExaminationPeriodLoadOneResolver}, canActivate: [AuthRolesGuard], data: { mode: 'EDIT', roles: ['ROLE_ADMIN'] } },
  {path: 'examination-period-form', component: ExaminationPeriodFormComponent, canActivate: [AuthRolesGuard], data: { roles: ['ROLE_ADMIN'] } },
  {path: 'examination-period-details/:id', component: ExaminatinPeriodDetailsComponent, resolve:{examinationPeriodData: ExaminationPeriodLoadOneResolver}, canActivate: [AuthRolesGuard], data: { mode: 'DETAILS', roles: ['ROLE_ADMIN','ROLE_PROFESSOR'] }},
  {path:'', pathMatch:'full', redirectTo:'examination-period-list'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExaminationPeriodRoutingModule { }
