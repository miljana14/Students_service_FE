import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmOption } from 'src/app/core/enums';
import { Subject } from 'src/app/core/models';
import { HttpSubjectService } from 'src/app/core/services/http-subject.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-subject-details',
  templateUrl: './subject-details.component.html',
  styleUrls: ['./subject-details.component.css']
})
export class SubjectDetailsComponent implements OnInit {

  subjectForm?: FormGroup;
  mode: string = '';
  subject? : Subject ;
  id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;

  constructor(private fb: FormBuilder, private httpSubject: HttpSubjectService, private activatedRoute: ActivatedRoute,  private modalService: NgbModal, private translateService: TranslateService, private toastService: ToastService, private route: Router, public userLoginData: UserLoginDataService) {
    this.subject = this.activatedRoute.snapshot.data['subjectData'];
    this.mode = this.activatedRoute.snapshot.data['mode'];
    this.buildForm(this.subject);
   }

  ngOnInit(): void {
  }

  buildForm(subject?: Subject){
    this.subjectForm = this.fb.group({
      id: [subject?.id],
      name: [subject?.name],
      description: [subject?.description],
      noOfESP: [subject?.noOfESP],
      yearOfStudy: [subject?.yearOfStudy],
      semester: [subject?.semester],
    })

    if(subject){
      this.subjectForm.get('id')?.disable();
    }
  }

  hasErrors(componentName: string, errorCode?: string) {
    return  (this.subjectForm?.get(componentName)?.dirty || this.subjectForm?.get(componentName)?.touched) &&
    ((!errorCode && this.subjectForm?.get(componentName)?.errors ) ||
    (errorCode && this.subjectForm?.get(componentName)?.hasError(errorCode)));
  }

  onDelete(){
      const modalRef = this.modalService.open(ConfirmDialogComponent);
      modalRef.componentInstance.message = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.MESSAGE', {entityName: 'subject',objectDetails: this.subject?.name});
      modalRef.componentInstance.headerText = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.TITLE', {entityName: 'subject'});
      modalRef.result.then(
        result => result === ConfirmOption.OK && this.deleteSelectedSubject()
      )
    }

    deleteSelectedSubject() {
        this.httpSubject.deleteSubject(this.subject!).subscribe(
          {
            next: response =>  {
              this.toastService.showToast({header: 'Deleting subject', message: 'Subject deleted successfully'});
              this.route.navigate(['/subject/subject-list']);
            },
            error: error =>  this.toastService.showToast({header: 'Deleting subject', message: 'Subject was not deleted', className:'bg-danger'})
          }
        )
      }

    }
