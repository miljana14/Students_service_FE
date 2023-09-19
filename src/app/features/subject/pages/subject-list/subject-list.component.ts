import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageRequest, Subject } from 'src/app/core/models';
import { HttpSubjectService } from 'src/app/core/services/http-subject.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';
import { SortableHeaderDirective, SortEvent } from 'src/app/shared/directives/sortable-header.directive';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {

  subjects?: Subject[];

  subsciptions = new Subscription();

  pageInfo: PageRequest = {pageNo:1, pageSize:3, totalItems:10, sortBy:'name', sortOrder:'asc'}

  availablePageSizes = [2, 3, 5, 10, 15, 20]

  keyword = '';

  name: boolean = false;

  description: boolean = false;

  semester: boolean = false;

  noOfESP: boolean = false;

  yearOfStudy: boolean = false;

  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;

  advancedSearch = false;

  currentDisplayedPage: number = 1;

  @ViewChildren(SortableHeaderDirective)
  headers?:QueryList<SortableHeaderDirective>

  constructor(private httpSubject: HttpSubjectService, private activatedRoute: ActivatedRoute, private route: Router, public userLoginData: UserLoginDataService) { }

  ngOnInit(): void {
    const pageNoParam = Number(this.activatedRoute.snapshot.paramMap.get('pageNo'));
    if(pageNoParam){
      this.pageInfo.pageNo = pageNoParam;
      this.pageInfo.pageSize = Number(this.activatedRoute.snapshot.paramMap.get('pageSize'));
    }
    this.loadSubjects();
  }

  ngOnDestroy(): void {
    this.subsciptions.unsubscribe();
  }

  onPageChange(pageNo: number){
    if (this.keyword !== '') {
      this.currentDisplayedPage = pageNo;
      this.search();
    } else {
      this.loadSubjects();
    }
  }

  loadSubjects(){
    this.subsciptions.add(
    this.httpSubject.getByPage(this.pageInfo).subscribe( subjectPage => {
      this.subjects = subjectPage.content;
      this.pageInfo.totalItems = subjectPage.totalElements;
      this.pageInfo.pageSize = subjectPage.size;
      this.pageInfo.pageNo = subjectPage.number+1;
    }));
  }

  changePageSize() {
    this.pageInfo.pageNo = 1;
    if (this.keyword !== '') {
      this.search();
    } else {
      this.loadSubjects();
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
      this.search(); 
      this.loadSubjects(); 
  }

  getById(id: number){
    this.httpSubject.getById(id);
  }

  search(){
    if (this.keyword === "") {
      this.pageInfo.pageNo = this.currentDisplayedPage;
      this.loadSubjects();
    } else {
      this.pageInfo.pageNo = 1;
      this.currentDisplayedPage = 1;
      
    }
    this.pageInfo.pageNo = this.currentDisplayedPage;
    this.subsciptions.add(
      this.httpSubject.searchSubjects(this.pageInfo, this.keyword, this.name, 
        this.description, this.semester, this.noOfESP, this.yearOfStudy).subscribe(data => {
          this.subjects = data.content;
          this.pageInfo.totalItems = data.totalElements;
          this.pageInfo.pageSize = data.size;
          this.pageInfo.pageNo = data.number + 1;
      }));
      this.advancedSearch = false;
  }

  showAdvanced(){
    this.advancedSearch = !this.advancedSearch;
  }

}