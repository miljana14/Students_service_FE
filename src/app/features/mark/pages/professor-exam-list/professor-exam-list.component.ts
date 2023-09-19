import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Exam } from 'src/app/core/models';
import { HttpExamService } from 'src/app/core/services/http-exam.service';

@Component({
  selector: 'app-professor-exam-list',
  templateUrl: './professor-exam-list.component.html',
  styleUrls: ['./professor-exam-list.component.css']
})
export class ProfessorExamListComponent implements OnInit {
  exams?: Exam[];

  subsciptions = new Subscription();

  id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  constructor(private httpExam: HttpExamService, private activatedRoute: ActivatedRoute, private route: Router) { }

  ngOnInit(): void {
    this.loadExams();
  }

  ngOnDestroy(): void {
    this.subsciptions.unsubscribe();
  }

  loadExams() {
    this.httpExam.availableExamsForProfessor().subscribe((exams: Exam[]) => {
      this.exams = exams; 
    });
  }

  

}

