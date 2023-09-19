import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MostCommonQuestionsComponent } from './pages/most-common-questions/most-common-questions.component';



@NgModule({
  declarations: [
    MostCommonQuestionsComponent
  ],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    SharedModule
  ]
})
export class ScheduleModule { }
