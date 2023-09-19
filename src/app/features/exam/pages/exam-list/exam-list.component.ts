import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Exam, PageRequest } from 'src/app/core/models';
import { HttpExamService } from 'src/app/core/services/http-exam.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';
import { SortableHeaderDirective, SortEvent } from 'src/app/shared/directives/sortable-header.directive';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit {

  exams?: Exam[];

  subsciptions = new Subscription();

  pageInfo: PageRequest = {pageNo:1, pageSize:3, totalItems:10, sortBy:'examDate', sortOrder:'asc'}

  availablePageSizes = [2, 3, 5, 10, 15, 20]

  keyword = '';

  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;

  examinationPeriod: boolean = false;

  subject: boolean = false;

  professor: boolean = false;

  examDate: boolean = false;
  
  advancedSearch = false;

  currentDisplayedPage: number = 1;

  @ViewChildren(SortableHeaderDirective)
  headers?:QueryList<SortableHeaderDirective>

  constructor(private httpExam: HttpExamService, private activatedRoute: ActivatedRoute, private route: Router, public userLoginData: UserLoginDataService) { }

  ngOnInit(): void {
    const pageNoParam = Number(this.activatedRoute.snapshot.paramMap.get('pageNo'));
    if(pageNoParam){
      this.pageInfo.pageNo = pageNoParam;
      this.pageInfo.pageSize = Number(this.activatedRoute.snapshot.paramMap.get('pageSize'));
    }
    this.loadExams();
  }

  ngOnDestroy(): void {
    this.subsciptions.unsubscribe();
  }

  onPageChange(pageNo: number){
    if (this.keyword !== '') {
      this.currentDisplayedPage = pageNo;
      this.search();
    } else {
      this.loadExams();
    }
  }

  loadExams(){
    this.subsciptions.add(
    this.httpExam.getByPage(this.pageInfo).subscribe( examPage => {
      this.exams = examPage.content;
      this.pageInfo.totalItems = examPage.totalElements;
      this.pageInfo.pageSize = examPage.size;
      this.pageInfo.pageNo = examPage.number+1;
    }));
  }

  changePageSize() {
    this.pageInfo.pageNo = 1;
    this.currentDisplayedPage = 1;
    if (this.keyword !== '') {
      this.search();
    } else {
      this.loadExams();
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
    this.loadExams();
  }

  getById(id: number){
    this.httpExam.getById(id);
  }

  search(){
    
    if (this.keyword === "") {
      this.pageInfo.pageNo = this.currentDisplayedPage;
      this.loadExams();
    } else {
      this.pageInfo.pageNo = 1;
      this.currentDisplayedPage = 1;
      
    }
    this.pageInfo.pageNo = this.currentDisplayedPage;
    this.subsciptions.add(
      this.httpExam.searchExams(this.pageInfo, this.keyword, this.examinationPeriod, this.subject, this.professor, this.examDate)
        .subscribe(data => {
          this.exams = data.content;
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

