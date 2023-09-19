import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BooleanValues } from 'src/app/core/enums';
import { Exam, ExaminationPeriod, Student, Subject } from 'src/app/core/models';
import { Mark } from 'src/app/core/models/mark.model';
import { HttpExamService } from 'src/app/core/services/http-exam.service';
import { HttpExaminationPeriodService } from 'src/app/core/services/http-examination-period.service';
import { HttpMarkService } from 'src/app/core/services/http-mark.service';
import { HttpStudentService } from 'src/app/core/services/http-student.service';
import { HttpSubjectService } from 'src/app/core/services/http-subject.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';

@Component({
  selector: 'app-home-student',
  templateUrl: './home-student.component.html',
  styleUrls: ['./home-student.component.css']
})
export class HomeStudentComponent implements OnInit {

  examinationPeriod?: ExaminationPeriod;
  firstDay?: Date;
  lastDay?: Date;
  monthNameFirstDay?: string;
  monthNameLastDay?: string;
  dayNameFirstDay?: string;
  dayNameLastDay?: string;
  currentDate: Date = new Date();
  student?: Student;
  students?: Student[];
  subjects?: Subject[];
  exams?: Exam[];
  marksFromExams?: number[];
  subjectWithMaxMark?: Subject;
  maxMark?: number;
  subjectTime: string[] = ["Utorak | 17:00", "Sreda | 15:30", "Cetvrtak | 14:00", "Utorak | 18:00", "Utorak | 12:00", "Petak | 13:00", "Petak | 16:00", "Ponedeljak | 18:00"];
  allSubjects?: Subject[];
  allExams?: Exam[];
  examTime: string[] = ["16:00", "18:00", "14:00","18:00", "17:00", "15:30", "12:00", "13:00"];

  constructor(private translateService: TranslateService, private httpExaminationPeriod: HttpExaminationPeriodService, private httpSubject: HttpSubjectService, public userLoginData: UserLoginDataService, private httpStudent: HttpStudentService, private httpMark: HttpMarkService, private httpExam: HttpExamService) {

  }

  ngOnInit(): void {
    this.loadActiveExaminationPeriod();
    this.loadStudentsSubjects();
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

  loadStudentsSubjects() {
    this.httpStudent.getAll().subscribe((students: Student[]) => {
      this.students = students;
      this.student = this.students?.find((loginData) => loginData.username === this.userLoginData?.userLoginData?.username);
      this.httpSubject.getStudentsSubjects(this.student?.indexNumber!, this.student?.indexYear!).subscribe(() => {
        this.httpMark.getAllByStudent().subscribe((marks: Mark[]) => {
          let exams: Exam[] = marks.map(mark => mark.exam);
          let subjectsFromExams: Subject[] = exams.map(exam => exam.subject);
          let marksFromExams: number[] = marks.map(mark => mark.mark);
          this.exams = exams;
          this.subjects = subjectsFromExams;
          this.marksFromExams = marksFromExams;

          let maxMark = Math.max(...marksFromExams);
          let subjectWithMaxMark = subjectsFromExams.find((subject, index) => marksFromExams[index] === maxMark);

          this.subjectWithMaxMark = subjectWithMaxMark;
          this.maxMark = maxMark;
        });
      });
    });
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
