import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BooleanValues } from 'src/app/core/enums';
import { ExaminationPeriod, Student, Exam, Subject, Professor } from 'src/app/core/models';
import { Mark } from 'src/app/core/models/mark.model';
import { HttpExamService } from 'src/app/core/services/http-exam.service';
import { HttpExaminationPeriodService } from 'src/app/core/services/http-examination-period.service';
import { HttpMarkService } from 'src/app/core/services/http-mark.service';
import { HttpProfessorService } from 'src/app/core/services/http-professor.service';
import { HttpSubjectService } from 'src/app/core/services/http-subject.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';

@Component({
  selector: 'app-home-professor',
  templateUrl: './home-professor.component.html',
  styleUrls: ['./home-professor.component.css']
})
export class HomeProfessorComponent implements OnInit {
  examinationPeriod? : ExaminationPeriod;
  firstDay?: Date;
  lastDay?: Date;
  monthNameFirstDay? : string;
  monthNameLastDay?: string;
  dayNameFirstDay?: string;
  dayNameLastDay?: string;
  currentDate: Date = new Date();
  student?: Student;
  students?: Student[];
  subjects?: Subject[];
  exams? : Exam[];
  averageMark? :number;
  professors?: Professor[];
  professor?: Professor;
  marks?:Mark[];
  averageMarks?: number[];

  subjectTime: string[] = ["Utorak | 17:00", "Sreda | 15:30", "Cetvrtak | 14:00", "Utorak | 18:00", "Utorak | 12:00", "Petak | 13:00", "Petak | 16:00", "Ponedeljak | 18:00"];
  examTime: string[] = ["16:00", "18:00", "14:00","18:00", "17:00", "15:30", "12:00", "13:00"];
  allSubjects?: Subject[];
  allExams?: Exam[];

  constructor(private translateService: TranslateService,private httpExaminationPeriod: HttpExaminationPeriodService, private httpSubject: HttpSubjectService,public userLoginData: UserLoginDataService, private httpMark: HttpMarkService, private httpProfessor: HttpProfessorService, private httpExam: HttpExamService) {
    
  }

  ngOnInit(): void {
    this.loadActiveExaminationPeriod();
    this.loadProfessorsSubjects();
    this.loadSubjects();
    this.loadExams();
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  loadActiveExaminationPeriod() {
    this.httpExaminationPeriod.getAll().subscribe((ep: ExaminationPeriod[]) => {
      this.examinationPeriod = ep?.find((period) => period.active.toString().toUpperCase() === BooleanValues.TRUE.toString().toUpperCase());
     const firstDay = new Date(this.examinationPeriod!.beginDate.toString());
     firstDay.setDate(firstDay.getDate() - 7);
     this.firstDay = firstDay;
     const lastDay = new Date(this.examinationPeriod!.beginDate.toString());
     lastDay.setDate(lastDay.getDate() - 1);
     this.lastDay = lastDay;
     this.monthNameFirstDay = firstDay.toLocaleString('default', { month: 'long' });
     this.monthNameLastDay = lastDay.toLocaleString('default', { month: 'long' });
     this.dayNameFirstDay = firstDay.toLocaleString('default', { weekday: 'long' });
     this.dayNameLastDay = lastDay.toLocaleString('default', { weekday: 'long' });
    });
  }

  loadProfessorsSubjects(){
    this.httpProfessor.getAll().subscribe((professors: Professor[]) => {
      this.professors = professors;
      this.professor = this.professors?.find((loginData) => loginData.username === this.userLoginData?.userLoginData?.username);
      this.httpSubject.getAllP(this.professor?.id!).subscribe((subjects: Subject[]) => {
        this.subjects=subjects;
        this.httpExam.getAll().subscribe((exams:Exam[]) => {
          this.exams = exams.filter(
            (exam) =>
              this.subjects?.some((subject) => subject.id === exam.subject.id) &&
              exam.professor.id === this.professor?.id
          );
        
          this.httpMark.getAll().subscribe((marks: Mark[]) => {
            this.marks = marks.filter((mark) => this.exams?.some((exam) => exam.id === mark.exam.id));
            this.averageMarks = this.exams?.map((exam) => {
              const marksForExam = this.marks!.filter((mark) => mark.exam.id === exam.id);
              return this.calculateAverageMark(marksForExam);
             
            });
          });
        });
      });
    });
  }
  
  calculateAverageMark(marks: Mark[]): number {
    if (!marks || marks.length === 0) {
      return 0; 
    }
    const sumOfMarks = marks.reduce((total, mark) => {
      if (mark.mark > 0) {
        return total + mark.mark;
      } else {
        return total;
      }
    }, 0);
    
    const nonZeroMarks = marks.filter(mark => mark.mark > 0);
    
    const averageMark = nonZeroMarks.length > 0 ? sumOfMarks / nonZeroMarks.length : 0;
    
    return averageMark;
  }

  loadSubjects() {
    this.httpSubject.getAll().subscribe((subjects: Subject[]) => {
      this.allSubjects = subjects;
    });
  }

  loadExams() {
    this.httpExam.getAll().subscribe((exams: Exam[]) => {
      this.allExams = exams.filter(exam => exam.examinationPeriod.active);
    });
  }

  downloadScheduleClasses() {
    let csvContent = 'Year of study,Subject,Day and time\n';

    this.allSubjects?.forEach((subject, index) => {
      const csvLine = `${subject.yearOfStudy},${subject.name},${this.subjectTime[index % this.subjectTime.length]}\n`;
      csvContent += csvLine;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule_classes.csv';
    a.click();

    URL.revokeObjectURL(url);
  }

  downloadScheduleExams() {
    let csvContent = 'Examination period,Subject,Exam date,Time\n';

    this.allExams?.forEach((exam, index) => {
      const csvLine = `${exam.examinationPeriod.name},${exam.subject.name},${exam.examDate},${this.examTime[index % this.examTime.length]}\n`;
      csvContent += csvLine;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule_exams.csv';
    a.click();

    URL.revokeObjectURL(url);
  }

}
