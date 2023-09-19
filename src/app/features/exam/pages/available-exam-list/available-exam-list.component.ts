import { ExamApplication } from './../../../../core/models/exam-application.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Exam } from 'src/app/core/models';
import { HttpExamApplicationService } from 'src/app/core/services/http-exam-application.service';
import { HttpExamService } from 'src/app/core/services/http-exam.service';

@Component({
  selector: 'app-available-exam-list',
  templateUrl: './available-exam-list.component.html',
  styleUrls: ['./available-exam-list.component.css']
})
export class AvailableExamListComponent implements OnInit {

  exams?: Exam[];
  examApplication?: ExamApplication;
  examApplications?: ExamApplication[] = [];
  appId?:number;
  selectedExams: Exam[] = [];
  subsciptions = new Subscription();

  indexNumber = this.activatedRoute.snapshot.paramMap.get('indexNumber');
  indexYear = Number(this.activatedRoute.snapshot.paramMap.get('indexYear'));

  constructor(private httpExam: HttpExamService, private httpExamApplication: HttpExamApplicationService, private activatedRoute: ActivatedRoute, private route: Router, private location: Location) { }

  ngOnInit(): void {
    this.loadExams();
  }

  ngOnDestroy(): void {
    this.subsciptions.unsubscribe();
  }

  loadExams() {
    this.httpExam.availableExamsForStudent().subscribe((exams: Exam[]) => {
      this.exams = exams; 
    });
  }

  onExamCheckboxChange(exam: Exam) {
    if (exam.isSelected) {
      this.selectedExams.push(exam);
    } else {
      this.selectedExams = this.selectedExams.filter((selectedExam) => selectedExam.id !== exam.id);
    }
  }


  saveEnrolledExams(){
    this.subsciptions.add(this.httpExamApplication.enrollExams(this.selectedExams).subscribe());
    window.location.reload();
  }

  goBack() {
    this.location.back();
  }

}
