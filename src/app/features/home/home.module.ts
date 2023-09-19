import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeStudentComponent } from './pages/home-student/home-student.component';
import { HomeProfessorComponent } from './pages/home-professor/home-professor.component';


@NgModule({
  declarations: [
    HomePageComponent,
    HomeStudentComponent,
    HomeProfessorComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
