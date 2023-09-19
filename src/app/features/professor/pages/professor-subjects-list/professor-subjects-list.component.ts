import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageRequest, Professor, Student, Subject } from 'src/app/core/models';
import { HttpProfessorService } from 'src/app/core/services/http-professor.service';
import { HttpStudentService } from 'src/app/core/services/http-student.service';
import { HttpSubjectService } from 'src/app/core/services/http-subject.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';

@Component({
  selector: 'app-professor-subjects-list',
  templateUrl: './professor-subjects-list.component.html',
  styleUrls: ['./professor-subjects-list.component.css']
})
export class ProfessorSubjectsListComponent implements OnInit {
  students?: Student[];
  student?: Student;
  professors?: Professor[];
  professor?: Professor;
  subjects?: Subject[];
  showTable: boolean = false;
  pageInfo: PageRequest = { pageNo: 1, pageSize: 3, totalItems: 10, sortBy: 'firstName', sortOrder: 'asc' }
  availablePageSizes = [2, 3, 5, 10, 15, 20]
  keyword = '';
  indexNumber: boolean = false;
  indexYear: boolean = false;
  firstName: boolean = false;
  lastName: boolean = false;
  currentYearOfStudy: boolean = false;
  advancedSearch = false;
  subsciptions = new Subscription();
  currentDisplayedPage: number = 1;
  currentSubject: any;

  constructor(private httpStudent: HttpStudentService, private httpProfessor: HttpProfessorService, private httpSubject: HttpSubjectService, public userLoginData: UserLoginDataService) { }

  ngOnInit(): void {
    this.loadSubjectsForProfessor();
  }

  loadSubjectsForProfessor() {
    this.httpProfessor.getAll().subscribe((professors: Professor[]) => {
      this.professors = professors;
      this.professor = this.professors?.find((loginData) => loginData.username === this.userLoginData?.userLoginData?.username);
      if (this.professor?.id) {
        this.httpSubject.getAllP(this.professor.id).subscribe((subjects: Subject[]) => {
          this.subjects = subjects;
        })
      }
    })
  }
  loadStudentsForSubject(subjectId: number) {
    this.currentSubject = subjectId;
    this.httpStudent.subjectsForStudent(this.pageInfo, subjectId).subscribe(data => {
      this.students = data.content;
      this.pageInfo.totalItems = data.totalElements;
      this.pageInfo.pageSize = data.size;
      this.pageInfo.pageNo = data.number + 1;
      this.showTable = true;
    })
  }

  onPageChange(pageNo: number) {
    if (this.keyword !== '') {
      this.currentDisplayedPage = pageNo;
      this.searchBySubject(this.currentSubject);
    } else {
      this.loadStudentsForSubject(this.currentSubject);
    }
  }

  changePageSize() {
    this.pageInfo.pageNo = 1;
    if (this.keyword !== '') {
      this.searchBySubject(this.currentSubject);
    } else {
      this.loadStudentsForSubject(this.currentSubject);
    }
  }

  searchBySubject(subjectId: number) {
    if (this.keyword === "") {
      this.pageInfo.pageNo = this.currentDisplayedPage;
      this.loadStudentsForSubject(subjectId);
    } else {
      this.pageInfo.pageNo = 1;
      this.currentDisplayedPage = 1;

    }
    this.pageInfo.pageNo = this.currentDisplayedPage;
    this.subsciptions.add(
      this.httpStudent.searchStudentsBySubject(subjectId, this.pageInfo, this.keyword, this.indexNumber, this.indexYear,
        this.firstName, this.lastName, this.currentYearOfStudy).subscribe(data => {
          this.students = data.content;
          this.pageInfo.totalItems = data.totalElements;
          this.pageInfo.pageSize = data.size;
          this.pageInfo.pageNo = data.number + 1;
        },
          error => {
            console.error(error);
          })
    );
    this.advancedSearch = false;
  }


  showAdvanced() {
    this.advancedSearch = !this.advancedSearch;
  }

}
