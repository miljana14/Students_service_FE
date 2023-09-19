import { ExaminationPeriodListComponent } from './pages/examination-period-list/examination-period-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExaminationPeriodRoutingModule } from './examination-period-routing.module';
import { ExaminationPeriodFormComponent } from './pages/examination-period-form/examination-period-form.component';
import { ExaminatinPeriodDetailsComponent } from './pages/examinatin-period-details/examinatin-period-details.component';


@NgModule({
  declarations: [
    ExaminationPeriodListComponent,
    ExaminationPeriodFormComponent,
    ExaminatinPeriodDetailsComponent
  ],
  imports: [
    CommonModule,
    ExaminationPeriodRoutingModule,
    SharedModule
  ]
})
export class ExaminationPeriodModule { }
