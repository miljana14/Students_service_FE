import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectRoutingModule } from './subject-routing.module';
import { SubjectListComponent } from './pages/subject-list/subject-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubjectDetailsComponent } from './pages/subject-details/subject-details.component';
import { SubjectFormComponent } from './pages/subject-form/subject-form.component';


@NgModule({
  declarations: [
    SubjectListComponent,
    SubjectDetailsComponent,
    SubjectFormComponent
  ],
  imports: [
    CommonModule,
    SubjectRoutingModule,
    SharedModule
  ]
})
export class SubjectModule { }
