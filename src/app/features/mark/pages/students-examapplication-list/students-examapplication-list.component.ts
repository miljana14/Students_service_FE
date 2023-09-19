import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Exam, Student } from 'src/app/core/models';
import { Mark } from 'src/app/core/models/mark.model';
import { HttpExamService } from 'src/app/core/services/http-exam.service';
import { HttpMarkService } from 'src/app/core/services/http-mark.service';
import { HttpStudentService } from 'src/app/core/services/http-student.service';

@Component({
  selector: 'app-students-examapplication-list',
  templateUrl: './students-examapplication-list.component.html',
  styleUrls: ['./students-examapplication-list.component.css']
})
export class StudentsExamapplicationListComponent implements OnInit {
  students?: Student[];
  marks: Mark[] = [];
  subsciptions = new Subscription();
  mode: string = '';
  exam: Exam;
  examId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  studentsWithMarks?: Student[];
  studentsWithoutMarks?: Student[];
  examExam?: Exam;

  constructor(private httpStudent: HttpStudentService, private activatedRoute: ActivatedRoute, private route: Router, private httpMark: HttpMarkService, private httpExam: HttpExamService) {
    this.exam = this.activatedRoute.snapshot.data['examData'];
    this.mode = this.activatedRoute.snapshot.data['mode'];
  }

  ngOnInit(): void {
    this.loadStudents();

  }

  ngOnDestroy(): void {
    this.subsciptions.unsubscribe();
  }

  loadStudents() {
    this.httpStudent.studentsForExam(this.examId).subscribe((students: Student[]) => {
      this.students = students;
      this.httpExam.getById(this.examId).subscribe(e => { this.examExam = e });

      this.httpMark.getAll().subscribe((marks: Mark[]) => {
        this.marks = marks;
        const studentsWithMarks: Student[] = [];
        const studentsWithoutMarks: Student[] = [];

        marks.forEach(mark => {
          const student = students.find(student => student.indexNumber === mark.student.indexNumber && student.indexYear === mark.student.indexYear && mark.exam.id === this.examId);
          if (student) {
            studentsWithMarks.push(student);
          }

        });

        students.forEach(student => {
          if (!studentsWithMarks.includes(student)) {
            studentsWithoutMarks.push(student);
          }
        });

        this.studentsWithMarks = studentsWithMarks;
        this.studentsWithoutMarks = studentsWithoutMarks;

        this.initializeMarks();
      });

    });
  }

  isStudentDisabled(student: Student): boolean {
    if (this.studentsWithMarks) {
      return this.studentsWithMarks.some(s => s.indexNumber === student.indexNumber && s.indexYear === student.indexYear);
    }
    else {
      return false;
    }
  }

  initializeMarks() {
    if (this.students) {
      this.marks = this.students.map(student => {
        return {
          id: 0,
          student,
          exam: this.exam,
          mark: this.getMark(student)
        };
      });
    }
  }

  getMark(student: Student): number {
    const studentWithMark = this.marks.find(mark =>
      mark.student.indexNumber === student.indexNumber &&
      mark.student.indexYear === student.indexYear && mark.exam.id === this.examId
    ); 

    if (studentWithMark) {
      return studentWithMark.mark;
    } else {
      return 0;
    }
  }

  setMark(student: Student, event: any): void {
    const value = event.target.value;
    const newMark = Number(value);
  
    const selectedStudent = this.students?.find(s =>
      s.indexNumber === student.indexNumber &&
      s.indexYear === student.indexYear
    );
  
    if (selectedStudent) {
      const existingMark = this.marks.find(mark =>
        mark.student.indexNumber === selectedStudent.indexNumber &&
        mark.student.indexYear === selectedStudent.indexYear
      );
  
      if (existingMark) {
        existingMark.mark = newMark; 
      } else {
        const newStudentMark = {
          id: 0,
          student: selectedStudent,
          exam: this.exam,
          mark: newMark
        };
    
        this.marks.push(newStudentMark);
      }
    } 
  }
  
  

  saveMarks() {
    this.studentsWithoutMarks!.forEach(student => {
      const mark = this.marks.find(mark =>
        mark.student.indexNumber === student.indexNumber &&
        mark.student.indexYear === student.indexYear
      );
  
      if (mark) {
        this.addMark(this.examId, `${student.indexNumber}/${student.indexYear}`, mark.mark);
      } else {
        this.addMark(this.examId, `${student.indexNumber}/${student.indexYear}`, 5);
      }
    });
  
    this.route.navigate(['../../mark/professor-exam-list']);
  }

  addMark(examId: number, studentId: string, mark: number) {
    this.httpMark.addMark(examId, studentId, mark).subscribe((e) => {
    });
  }

}