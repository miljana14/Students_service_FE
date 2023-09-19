import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Exam, ExaminationPeriod, PageRequest } from 'src/app/core/models';
import { HttpExamService } from 'src/app/core/services/http-exam.service';
import { HttpExaminationPeriodService } from 'src/app/core/services/http-examination-period.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';
import { SortEvent, SortableHeaderDirective } from 'src/app/shared/directives/sortable-header.directive';

@Component({
  selector: 'app-examinatin-period-details',
  templateUrl: './examinatin-period-details.component.html',
  styleUrls: ['./examinatin-period-details.component.css']
})
export class ExaminatinPeriodDetailsComponent implements OnInit {

  epForm?: FormGroup;
  mode: string = '';
  ep? : ExaminationPeriod ;
  id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;
  subsciptions = new Subscription();
  exams?: Exam[];

  @ViewChildren(SortableHeaderDirective)
  headers?:QueryList<SortableHeaderDirective>

  constructor(private fb: FormBuilder, private httpEp: HttpExaminationPeriodService, 
    private activatedRoute: ActivatedRoute,  private modalService: NgbModal, 
    private translateService: TranslateService, private toastService: ToastService, 
    private route: Router, public userLoginData: UserLoginDataService, private httpExam: HttpExamService) {
    this.ep = this.activatedRoute.snapshot.data['examinationPeriodData'];
    this.mode = this.activatedRoute.snapshot.data['mode'];
    this.buildForm(this.ep);
   }

   ngOnInit(): void {
    this.loadExams();
  }

  ngOnDestroy(): void {
    this.subsciptions.unsubscribe();
  }



  buildForm(ep?: ExaminationPeriod){
    this.epForm = this.fb.group({
 
      name: [ep?.name],
      beginDate: [ep?.beginDate],
      endDate: [ep?.endDate],
      active: [ep?.active],
     
    });
  
  }

  loadExams(){
    this.httpExam.getByExamintionPeriod(this.id).subscribe( exams => {
      this.exams = exams;
    });
  }


  onSort(event: SortEvent){

    this.headers?.forEach( sortableDirective => {
      if(sortableDirective.sortable != event.column){
        sortableDirective.direction = '';
      }
    })
    this.loadExams();
  }


}

