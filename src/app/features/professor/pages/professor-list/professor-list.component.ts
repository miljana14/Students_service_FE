import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageRequest, Professor, Subject } from 'src/app/core/models';
import { HttpProfessorService } from 'src/app/core/services/http-professor.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';
import { SortableHeaderDirective, SortEvent } from 'src/app/shared/directives/sortable-header.directive';

@Component({
  selector: 'app-professor-list',
  templateUrl: './professor-list.component.html',
  styleUrls: ['./professor-list.component.css']
})
export class ProfessorListComponent implements OnInit {

  professors?: Professor[];

  subsciptions = new Subscription();

  pageInfo: PageRequest = {pageNo:1, pageSize:3, totalItems:10, sortBy:'firstName', sortOrder:'asc'}

  availablePageSizes = [2, 3, 5, 10, 15, 20]

  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;

  keyword = '';

  firstName: boolean = false;

  lastName: boolean = false;

  email: boolean = false;

  address: boolean = false;

  postalCode: boolean = false;

  phone: boolean = false;

  reelectionDate: boolean = false;

  title: boolean = false;

  advancedSearch = false;

  currentDisplayedPage: number = 1;

  @ViewChildren(SortableHeaderDirective)
  headers?:QueryList<SortableHeaderDirective>

  constructor(private httpProfessor: HttpProfessorService, private activatedRoute: ActivatedRoute, private route: Router, public userLoginData: UserLoginDataService) { }

  ngOnInit(): void {
    const pageNoParam = Number(this.activatedRoute.snapshot.paramMap.get('pageNo'));
    if(pageNoParam){
      this.pageInfo.pageNo = pageNoParam;
      this.pageInfo.pageSize = Number(this.activatedRoute.snapshot.paramMap.get('pageSize'));
    }
    this.loadProfessors();
  }

  ngOnDestroy(): void {
    this.subsciptions.unsubscribe();
  }

  onPageChange(pageNo: number){
    if (this.keyword !== '') {
      this.currentDisplayedPage = pageNo;
      this.search();
    } else {
      this.loadProfessors();
    }
  }

  loadProfessors(){
    this.subsciptions.add(
    this.httpProfessor.getByPage(this.pageInfo).subscribe( professorPage => {
      this.professors = professorPage.content;
      this.pageInfo.totalItems = professorPage.totalElements;
      this.pageInfo.pageSize = professorPage.size;
      this.pageInfo.pageNo = professorPage.number+1;
    }));
  }

  changePageSize() {
    this.pageInfo.pageNo = 1;
    if (this.keyword !== '') {
      this.search();
    } else {
      this.loadProfessors();
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
    this.loadProfessors();
  }

  getById(id: number){
    this.httpProfessor.getById(id);
  }

  search(){

    if (this.keyword === "") {
      this.pageInfo.pageNo = this.currentDisplayedPage;
      this.loadProfessors();
    } else {
      this.pageInfo.pageNo = 1;
      this.currentDisplayedPage = 1;
      
    }
    this.pageInfo.pageNo = this.currentDisplayedPage;
    this.subsciptions.add(
      this.httpProfessor.searchProfessors(this.pageInfo, this.keyword, this.firstName, this.lastName, this.email, this.address, this.postalCode, this.phone, this.reelectionDate, this.title)
        .subscribe(data => {
          this.professors = data.content;
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
