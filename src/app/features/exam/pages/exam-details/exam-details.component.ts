import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmOption } from 'src/app/core/enums';
import { Exam } from 'src/app/core/models';
import { HttpExamService } from 'src/app/core/services/http-exam.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css']
})
export class ExamDetailsComponent implements OnInit {
  examForm?: FormGroup;
  mode: string = '';
  exam? : Exam;
  id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;

  constructor(private fb: FormBuilder, private httpExam: HttpExamService, private activatedRoute: ActivatedRoute,  private modalService: NgbModal, private translateService: TranslateService, private toastService: ToastService, private route: Router, public userLoginData: UserLoginDataService) {
    this.exam = this.activatedRoute.snapshot.data['examData'];
    this.mode = this.activatedRoute.snapshot.data['mode'];
    this.buildForm(this.exam);
   }

  ngOnInit(): void {
  }

  buildForm(exam?: Exam){
    this.examForm = this.fb.group({
      examinationPeriod: [exam?.examinationPeriod.name, Validators.required ],
      subject: [exam?.subject.name, Validators.required],
      professor: [exam?.professor.firstName.concat(' ',exam?.professor.lastName), Validators.required],
      examDate: [exam?.examDate, Validators.required]

    })
  }

  hasErrors(componentName: string, errorCode?: string) {
    return  (this.examForm?.get(componentName)?.dirty || this.examForm?.get(componentName)?.touched) &&
    ((!errorCode && this.examForm?.get(componentName)?.errors ) ||
    (errorCode && this.examForm?.get(componentName)?.hasError(errorCode)));
  }

  onDelete(){
      const modalRef = this.modalService.open(ConfirmDialogComponent);
      modalRef.componentInstance.message = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.MESSAGE', {entityName: 'exam',objectDetails: this.exam?.examinationPeriod.name});
      modalRef.componentInstance.headerText = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.TITLE', {entityName: 'exam'});
      modalRef.result.then(
        result => result === ConfirmOption.OK && this.deleteSelectedExam()
      )
    }

    deleteSelectedExam() {
        this.httpExam.deleteExam(this.exam!).subscribe(
          {
            next: response =>  {
              this.toastService.showToast({header: 'Deleting exam', message: 'Exam deleted successfully'});
              this.route.navigate(['/exam/exam-list']);
            },
            error: error =>  this.toastService.showToast({header: 'Deleting exam', message: 'Exam was not deleted', className:'bg-danger'})
          }
        )
      }

    }
