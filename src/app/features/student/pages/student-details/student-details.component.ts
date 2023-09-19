import { HttpExamService } from './../../../../core/services/http-exam.service';
import { Observable } from 'rxjs';
import { HttpStudentService } from './../../../../core/services/http-student.service';
import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmOption } from 'src/app/core/enums';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {

  studentForm?: FormGroup;
  mode: string = '';
  student? : Student ;
  indexNumber = this.activatedRoute.snapshot.paramMap.get('indexNumber');
  indexYear = Number(this.activatedRoute.snapshot.paramMap.get('indexYear'));
  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;

  constructor(private fb: FormBuilder, private httpStudent: HttpStudentService, private activatedRoute: ActivatedRoute,  private modalService: NgbModal, private translateService: TranslateService, private toastService: ToastService, private route: Router, private httpExam : HttpExamService, public userLoginData: UserLoginDataService) {
    this.student = this.activatedRoute.snapshot.data['studentData'];
    this.mode = this.activatedRoute.snapshot.data['mode'];
    this.buildForm(this.student);
   }

  ngOnInit(): void {
  }

  buildForm(student?: Student){
    this.studentForm = this.fb.group({
      indexNumber: [student?.indexNumber, Validators.required ],
      indexYear: [student?.indexYear],
      firstName: [student?.firstName],
      lastName: [student?.lastName],
      email: [student?.email],
      address: [student?.address],
      postalCode: [student?.postalCode?.name],
      currentYear: [student?.currentYearOfStudy],
      username: [student?.username],
      password: [student?.password]
    })

    if(student){
      this.studentForm.get('indexNumber')?.get('indexYear')?.disable();
    }
  }

  hasErrors(componentName: string, errorCode?: string) {
    return  (this.studentForm?.get(componentName)?.dirty || this.studentForm?.get(componentName)?.touched) &&
    ((!errorCode && this.studentForm?.get(componentName)?.errors ) ||
    (errorCode && this.studentForm?.get(componentName)?.hasError(errorCode)));
  }

  onDelete(){
      const modalRef = this.modalService.open(ConfirmDialogComponent);
      modalRef.componentInstance.message = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.MESSAGE', {entityName: 'student',objectDetails: [this.student?.firstName, ' ', this.student?.lastName, ' ', this.student?.indexNumber, '/', this.student?.indexYear].join('')});
      modalRef.componentInstance.headerText = this.translateService.instant('COMMON.DELETE_CONFIRM_DIALOG.TITLE', {entityName: 'student'});
      modalRef.result.then(
        result => result === ConfirmOption.OK && this.deleteSelectedStudent()
      )
    }

    deleteSelectedStudent() {
        this.httpStudent.deleteStudent(this.student!).subscribe(
          {
            next: response =>  {
              this.toastService.showToast({header: 'Deleting student', message: 'Student deleted successfully'});
              this.route.navigate(['/student/student-list']);
            },
            error: error =>  this.toastService.showToast({header: 'Deleting student', message: 'Student was not deleted', className:'bg-danger'})
          }
        )
      }

      applyExam(){
        this.httpExam.availableExamsForStudent().subscribe();

       }

    }
