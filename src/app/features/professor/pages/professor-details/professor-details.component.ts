import { HttpSubjectService } from './../../../../core/services/http-subject.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfirmOption } from 'src/app/core/enums';
import { Professor, Subject } from 'src/app/core/models';
import { HttpProfessorService } from 'src/app/core/services/http-professor.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-professor-details',
  templateUrl: './professor-details.component.html',
  styleUrls: ['./professor-details.component.css']
})
export class ProfessorDetailsComponent implements OnInit {

  professorForm?: FormGroup;
  mode: string = '';
  professor? : Professor ;
  id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  subjects?: Subject[] = [];

  subsciptions = new Subscription();

  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;

  constructor(private fb: FormBuilder, private httpProfessor: HttpProfessorService, private activatedRoute: ActivatedRoute,  private modalService: NgbModal, private translateService: TranslateService, private toastService: ToastService, private route: Router, private httpSubject: HttpSubjectService, private location: Location, public userLoginData: UserLoginDataService) {
    this.professor = this.activatedRoute.snapshot.data['professorData'];
    this.mode = this.activatedRoute.snapshot.data['mode'];
    this.loadSubject();
    this.buildForm(this.professor);
   }

   loadSubject() {
    this.subsciptions.add(this.httpSubject.getAllP(this.id).subscribe(s => this.subjects=s));
   }

  ngOnInit(): void {
  }

  buildForm(professor?: Professor){
    this.professorForm = this.fb.group({
      firstName: [professor?.firstName],
      lastName: [professor?.lastName],
      email: [professor?.email],
      address: [professor?.address],
      postalCode: [professor?.postalCode?.postalCode + ' - '+ professor?.postalCode?.name],
      phone: [professor?.phone],
      reelectionDate: [professor?.reelectionDate],
      title: [professor?.title.title],
      subjects: [professor?.subjects],
      username: [professor?.username],
      password: [professor?.password]
    });
    this.professorForm.get('username')?.disable();
    this.professorForm.get('password')?.disable();
  }

  hasErrors(componentName: string, errorCode?: string) {
    return  (this.professorForm?.get(componentName)?.dirty || this.professorForm?.get(componentName)?.touched) &&
    ((!errorCode && this.professorForm?.get(componentName)?.errors ) ||
    (errorCode && this.professorForm?.get(componentName)?.hasError(errorCode)));
  }

  onDelete(){
      const modalRef = this.modalService.open(ConfirmDialogComponent);
      modalRef.componentInstance.message = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.MESSAGE', {entityName: 'professor',objectDetails: [this.professor?.firstName, ' ', this.professor?.lastName].join('')});
      modalRef.componentInstance.headerText = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.TITLE', {entityName: 'professor'});
      modalRef.result.then(
        result => result === ConfirmOption.OK && this.deleteSelectedProfessor()
      )
    }

    deleteSelectedProfessor() {
        this.httpProfessor.deleteProfessor(this.professor!).subscribe(
          {
            next: response =>  {
              this.toastService.showToast({header: 'Deleting professor', message: 'Professor deleted successfully'});
              this.route.navigate(['/professor/professor-list']);
            },
            error: error =>  this.toastService.showToast({header: 'Deleting professor', message: 'Professor was not deleted', className:'bg-danger'})
          }
        )
      }

      onDeleteSubject(subject: Subject){
        const modalRef = this.modalService.open(ConfirmDialogComponent);
        modalRef.componentInstance.message = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.MESSAGE', {entityName: 'subject',objectDetails: [subject?.name]});
        modalRef.componentInstance.headerText = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.TITLE', {entityName: 'subject'});
        modalRef.result.then(
          result => result === ConfirmOption.OK && this.deleteSubject(subject) 
        )
      }

      deleteSubject(subject: Subject) {
        this.httpSubject.removeSubjectFromProfessor(this.id, subject.id).subscribe({
          next: response =>  {
            this.toastService.showToast({header: 'Deleting professor', message: 'Professor deleted successfully'});
            window.location.reload();
          },
          error: error =>  this.toastService.showToast({header: 'Deleting professor', message: 'Professor was not deleted', className:'bg-danger'})
        });
      }

    }
