import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Student, UserLoginData } from 'src/app/core/models';
import { HttpCityService } from 'src/app/core/services/http-city.service';
import { HttpProfessorService } from 'src/app/core/services/http-professor.service';
import { HttpStudentService } from 'src/app/core/services/http-student.service';
import { HttpSubjectService } from 'src/app/core/services/http-subject.service';
import { HttpTitleService } from 'src/app/core/services/http-title.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';

@Component({
  selector: 'app-change-student-password',
  templateUrl: './change-student-password.component.html',
  styleUrls: ['./change-student-password.component.css']
})
export class ChangeStudentPasswordComponent implements OnInit {

  studentChangePasswordForm?: FormGroup;
  student?: Student;
  mode: string = '';
  indexNumber = this.activatedRoute.snapshot.paramMap.get('indexNumber');
  indexYear = Number(this.activatedRoute.snapshot.paramMap.get('indexYear'));
  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;

  constructor(private fb: FormBuilder, private router: Router, private httpStudent: HttpStudentService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private translateService: TranslateService, private toastService: ToastService, private route: Router, public userLoginData: UserLoginDataService, private httpCity: HttpCityService) {
      this.student = this.activatedRoute.snapshot.data['studentData'];
      this.mode = this.activatedRoute.snapshot.data['mode'];
      this.buildForm(this.student);
     }

  ngOnInit(): void {
  }

  buildForm(student?: Student) {
    this.studentChangePasswordForm = this.fb.group({
      username: [student?.username],
      password: [student?.password, Validators.required],
      repeatedPassword: [student?.password, Validators.required],
    }, { validator: this.fieldsMatchValidator });
  }

  fieldsMatchValidator = (formGroup: FormGroup) => {
    const password = formGroup.get('password')?.value;
    const repeatedPassword = formGroup.get('repeatedPassword')?.value;
  
    if (password !== repeatedPassword) {
      formGroup.get('repeatedPassword')?.setErrors({ fieldsMismatch: true });
    } 
  };

  
  hasErrors(componentName: string, errorCode?: string) {
    return  (this.studentChangePasswordForm?.get(componentName)?.dirty || this.studentChangePasswordForm?.get(componentName)?.touched) &&
    ((!errorCode && this.studentChangePasswordForm?.get(componentName)?.errors ) ||
    (errorCode && this.studentChangePasswordForm?.get(componentName)?.hasError(errorCode)));
  }

  onSave() {
    const s =this.studentChangePasswordForm?.getRawValue();
    this.httpStudent.editStudent(this.indexNumber!, this.indexYear, s).subscribe();
    if(this.userLoginData?.userLoginData?.authorities[0].authority === 'ROLE_STUDENT'){
      const userLoginData: UserLoginData = {
        firstname: this.student!.firstName,
        lastname: this.student!.lastName,
        username: this.student!.username,
        password: s.password, 
        accountNonExpired: true, 
        accountNonLocked: true,
        credentialsNonExpired: true,
        enabled: true,
        newUser: false,
        authorities: [{authority: 'ROLE_STUDENT'}] 
      };
      this.userLoginData.updateUser(userLoginData);
      this.userLoginData.token = 'Basic ' + btoa(`${userLoginData.username}:${userLoginData.password}`);
    }
  }
}