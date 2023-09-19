import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Exam, Student, Subject } from 'src/app/core/models';
import { Mark } from 'src/app/core/models/mark.model';
import { HttpExaminationPeriodService } from 'src/app/core/services/http-examination-period.service';
import { HttpMarkService } from 'src/app/core/services/http-mark.service';
import { HttpStudentService } from 'src/app/core/services/http-student.service';
import { HttpSubjectService } from 'src/app/core/services/http-subject.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';

@Component({
  selector: 'app-student-subjects',
  templateUrl: './student-subjects.component.html',
  styleUrls: ['./student-subjects.component.css']
})
export class StudentSubjectsComponent implements OnInit {
  student?: Student;
  students?: Student[];
  subjects?: Subject[];
  exams?: Exam[];
  marksFromExams?: number[];
  subjectsFromExams?: Subject[];
  marksBySubjectId: { [subjectId: number]: Mark } = {};
  keyword: string = '';

  constructor(private translateService: TranslateService, private httpExaminationPeriod: HttpExaminationPeriodService, private httpSubject: HttpSubjectService, public userLoginData: UserLoginDataService, private httpStudent: HttpStudentService, private httpMark: HttpMarkService) {

  }

  ngOnInit(): void {
    this.loadStudentsSubjects();
  }

  loadStudentsSubjects() {
    this.httpStudent.getAll().subscribe((students: Student[]) => {
      this.students = students;
      this.student = this.students?.find((loginData) => loginData.username === this.userLoginData?.userLoginData?.username);

      this.httpSubject.getStudentsSubjects(this.student?.indexNumber!, this.student?.indexYear!).subscribe((subjects: Subject[]) => {
        this.subjects = subjects;

        this.httpMark.getAllByStudent().subscribe((marks: Mark[]) => {
          let exams: Exam[] = marks.map(mark => mark.exam);
          let marksBySubjectId: { [subjectId: number]: Mark } = {};

          for (let i = 0; i < exams.length; i++) {
            let exam = exams[i];
            let mark = marks[i];
            let subjectId = exam.subject.id;
            marksBySubjectId[subjectId] = mark;
          }

          this.marksBySubjectId = marksBySubjectId;
        });
      });
    })
  }

  get filteredSubjects(): Subject[] {
    if(!this.subjects){
      return [];
    }
    return this.subjects.filter(subject => {
      
      const term = this.keyword.toLowerCase();

      return (
        subject.name.toLowerCase().includes(term) ||
        subject.noOfESP.toString().includes(term) ||
        subject.yearOfStudy.toString().includes(term) ||
        subject.semester.toString().toLowerCase().includes(term) ||
        (this.marksBySubjectId[subject.id] &&
          this.marksBySubjectId[subject.id].exam.examinationPeriod.name.toLowerCase().includes(term)) ||
        (this.marksBySubjectId[subject.id] &&
          this.marksBySubjectId[subject.id].exam.examDate.toString().includes(term)) ||
        (this.marksBySubjectId[subject.id] &&
          this.marksBySubjectId[subject.id].mark.toString().includes(term))
      );
    });
  }
}
