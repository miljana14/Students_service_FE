import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfirmOption } from 'src/app/core/enums';
import { ExaminationPeriod, PageRequest } from 'src/app/core/models';
import { HttpExaminationPeriodService } from 'src/app/core/services/http-examination-period.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { SortableHeaderDirective, SortEvent } from 'src/app/shared/directives/sortable-header.directive';

@Component({
  selector: 'app-examination-period-list',
  templateUrl: './examination-period-list.component.html',
  styleUrls: ['./examination-period-list.component.css']
})
export class ExaminationPeriodListComponent implements OnInit {

  examinationPeriod?: ExaminationPeriod[];

  pageInfo: PageRequest = {pageNo:1, pageSize:3, totalItems:10, sortBy:'name', sortOrder:'asc'}

  availablePageSizes = [2, 3, 5, 10, 15, 20]

  subsciptions = new Subscription();

  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;

  keyword = '';

  name: boolean = false;

  beginDate: boolean = false;

  endDate: boolean = false;

  active: boolean = false;

  advancedSearch = false;

  currentDisplayedPage: number = 1;

  @ViewChildren(SortableHeaderDirective)
  headers?:QueryList<SortableHeaderDirective>

  constructor(private httpExaminationPeriod: HttpExaminationPeriodService, private toastService: ToastService, private activatedRoute: ActivatedRoute, private route: Router,  private modalService: NgbModal, private translateService: TranslateService, public userLoginData: UserLoginDataService) { }

  ngOnInit(): void {
    this.loadExaminationPeriod();
  }

  ngOnDestroy(): void {
    this.subsciptions.unsubscribe();
  }

  onPageChange(pageNo: number){
    if (this.keyword !== '') {
      this.currentDisplayedPage = pageNo;
      this.search();
    } else {
     this.loadExaminationPeriod();
    }
 }

  loadExaminationPeriod(){
    this.subsciptions.add(
    this.httpExaminationPeriod.getByPage(this.pageInfo).subscribe( examinationPeriodPage => {
      this.examinationPeriod = examinationPeriodPage.content;
      this.pageInfo.totalItems = examinationPeriodPage.totalElements;
      this.pageInfo.pageSize = examinationPeriodPage.size;
      this.pageInfo.pageNo = examinationPeriodPage.number+1;
    }));
  }

  changePageSize() {
    this.pageInfo.pageNo = 1;
    if (this.keyword !== '') {
      this.search();
    } else {
      this.loadExaminationPeriod();
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
    this.loadExaminationPeriod();
  }

  getByName(name: string){
    this.httpExaminationPeriod.getByName(name);
  }

  onDelete(examinationPeriod: ExaminationPeriod){
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.MESSAGE', {entityName: 'examinationPeriod',objectDetails: [examinationPeriod?.name]});
    modalRef.componentInstance.headerText = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.TITLE', {entityName: 'examinationPeriod'});
    modalRef.result.then(
     result => result === ConfirmOption.OK && this.deleteSelectedExaminationPeriod(examinationPeriod) 
    )
  }

    deleteSelectedExaminationPeriod(examinationPeriod: ExaminationPeriod) {
      this.httpExaminationPeriod.deleteExaminationPeriod(examinationPeriod).subscribe({
        next: response =>  {
          this.toastService.showToast({header: 'Deleting examination period', message: 'Examination period deleted successfully'});
          window.location.reload();
        },
        error: error =>  this.toastService.showToast({header: 'Deleting examination period', message: 'Examination period was not deleted', className:'bg-danger'})
      });
    }

    search(){
      if (this.keyword === "") {
        this.pageInfo.pageNo = this.currentDisplayedPage;
        this.loadExaminationPeriod();
      } else {
        this.pageInfo.pageNo = 1;
        this.currentDisplayedPage = 1;
        
      }
      this.httpExaminationPeriod.searchExaminationPeriods(this.pageInfo, this.keyword, this.name, this.beginDate, this.endDate, this.active)
        .subscribe(data => {
          this.examinationPeriod = data.content;
          this.pageInfo.totalItems = data.totalElements;
          this.pageInfo.pageSize = data.size;
          this.pageInfo.pageNo = data.number + 1;
        },
        error => {
          console.error(error);
        });
      this.advancedSearch = false;
    }
  
    showAdvanced(){
      this.advancedSearch = !this.advancedSearch;
    }


}
