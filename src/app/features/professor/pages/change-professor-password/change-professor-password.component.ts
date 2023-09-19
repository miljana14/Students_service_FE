import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Professor, UserLoginData } from 'src/app/core/models';
import { HttpCityService } from 'src/app/core/services/http-city.service';
import { HttpProfessorService } from 'src/app/core/services/http-professor.service';
import { HttpSubjectService } from 'src/app/core/services/http-subject.service';
import { HttpTitleService } from 'src/app/core/services/http-title.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';

@Component({
  selector: 'app-change-professor-password',
  templateUrl: './change-professor-password.component.html',
  styleUrls: ['./change-professor-password.component.css']
})
export class ChangeProfessorPasswordComponent implements OnInit {

  professorChangePasswordForm?: FormGroup;
  professor?: Professor;
  mode: string = '';
  id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  uld?: UserLoginData;
  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;

  constructor(private fb: FormBuilder, private router: Router, private httpProfessor: HttpProfessorService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private translateService: TranslateService, private toastService: ToastService, private route: Router, private httpCity: HttpCityService, private httpTitle: HttpTitleService, public userLoginData: UserLoginDataService, private httpSubject: HttpSubjectService) {
      this.professor = this.activatedRoute.snapshot.data['professorData'];
      this.mode = this.activatedRoute.snapshot.data['mode'];
      this.buildForm(this.professor);
     }

  ngOnInit(): void {
  }

  buildForm(professor?: Professor) {
    this.professorChangePasswordForm = this.fb.group({
      username: [professor?.username],
      password: [professor?.password, Validators.required],
      repeatedPassword: [professor?.password, Validators.required],
    }, { validator: this.fieldsMatchValidator });
    this.professorChangePasswordForm.get('username')?.disable();
  }

  fieldsMatchValidator = (formGroup: FormGroup) => {
    const password = formGroup.get('password')?.value;
    const repeatedPassword = formGroup.get('repeatedPassword')?.value;
  
    if (password !== repeatedPassword) {
      formGroup.get('repeatedPassword')?.setErrors({ fieldsMismatch: true });
    } 
  };

  
  hasErrors(componentName: string, errorCode?: string) {
    return  (this.professorChangePasswordForm?.get(componentName)?.dirty || this.professorChangePasswordForm?.get(componentName)?.touched) &&
    ((!errorCode && this.professorChangePasswordForm?.get(componentName)?.errors ) ||
    (errorCode && this.professorChangePasswordForm?.get(componentName)?.hasError(errorCode)));
  }

  onSave() {
    const p =this.professorChangePasswordForm?.getRawValue();
    this.httpProfessor.editProfessor(this.id, p).subscribe();
    if(this.userLoginData?.userLoginData?.authorities[0].authority === 'ROLE_PROFESSOR'){
      const userLoginData: UserLoginData = {
        firstname: this.professor!.firstName,
        lastname: this.professor!.lastName,
        username: this.professor!.username,
        password: p.password, 
        accountNonExpired: true, 
        accountNonLocked: true,
        credentialsNonExpired: true,
        enabled: true,
        newUser: false,
        authorities: [{authority: 'ROLE_PROFESSOR'}] 
      };
      this.userLoginData.updateUser(userLoginData);
      this.userLoginData.token = 'Basic ' + btoa(`${userLoginData.username}:${userLoginData.password}`);
    }
  }
}