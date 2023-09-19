import { Student } from './../../../../core/models/student.model';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PageRequest } from 'src/app/core/models';
import { HttpStudentService } from 'src/app/core/services/http-student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SortableHeaderDirective, SortEvent } from 'src/app/shared/directives/sortable-header.directive';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  students?: Student[];

  subsciptions = new Subscription();

  pageInfo: PageRequest = {pageNo:1, pageSize:3, totalItems:10, sortBy:'firstName', sortOrder:'asc'}

  availablePageSizes = [2, 3, 5, 10, 15, 20]

  keyword = '';

  indexNumber: boolean = false;

  indexYear: boolean = false;

  firstName: boolean = false;

  lastName: boolean = false;

  email: boolean = false;

  address: boolean = false;

  postalCode: boolean = false;

  currentYearOfStudy: boolean = false;

  advancedSearch = false;

  currentDisplayedPage: number = 1;

  @ViewChildren(SortableHeaderDirective)
  headers?:QueryList<SortableHeaderDirective>

  constructor(private httpStudent: HttpStudentService, private activatedRoute: ActivatedRoute, private route: Router) { }

  ngOnInit(): void {
    const pageNoParam = Number(this.activatedRoute.snapshot.paramMap.get('pageNo'));
    if(pageNoParam){
      this.pageInfo.pageNo = pageNoParam;
      this.pageInfo.pageSize = Number(this.activatedRoute.snapshot.paramMap.get('pageSize'));
    }
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.subsciptions.unsubscribe();
  }

  onPageChange(pageNo: number){
    if (this.keyword !== '') {
      this.currentDisplayedPage = pageNo;
      this.search();
    } else {
      this.loadStudents();
    }
  }

  loadStudents(){
    this.subsciptions.add(
    this.httpStudent.getByPage(this.pageInfo).subscribe( studentPage => {
      this.students = studentPage.content;
      this.pageInfo.totalItems = studentPage.totalElements;
      this.pageInfo.pageSize = studentPage.size;
      this.pageInfo.pageNo = studentPage.number+1;
    }));
  }

  changePageSize() {
    this.pageInfo.pageNo = 1;
    if (this.keyword !== '') {
      this.search();
    } else {
      this.loadStudents();
    }
  }

  onSort(event: SortEvent){
    console.log(event);

    this.headers?.forEach( sortableDirective => {
      if(sortableDirective.sortable != event.column){
        sortableDirective.direction = '';
      }
    })

    this.pageInfo.pageNo = 1;
    this.pageInfo.sortBy = event.column;
    this.pageInfo.sortOrder = event.direction;
    this.loadStudents();
  }

  getById(indexNumber: string, indexYear: number){
    this.httpStudent.getById(indexNumber, indexYear);
  }

  search(){
    if (this.keyword === "") {
      this.pageInfo.pageNo = this.currentDisplayedPage;
      this.loadStudents();
    } else {
      this.pageInfo.pageNo = 1;
      this.currentDisplayedPage = 1;
      
    }
    this.pageInfo.pageNo = this.currentDisplayedPage;
    this.subsciptions.add(
      this.httpStudent.searchStudents(this.pageInfo, this.keyword, this.indexNumber, this.indexYear, 
        this.firstName, this.lastName, this.email, this.address, this.postalCode, this.currentYearOfStudy).subscribe(data => {
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


showAdvanced(){
  this.advancedSearch = !this.advancedSearch;
}
  

}
