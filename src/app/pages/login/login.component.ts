import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { HttpAuthService } from 'src/app/core/services/http-auth.service';
import { HttpUserService } from 'src/app/core/services/http-user.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm?: FormGroup;
  users?:User[] = [];
  submitted = false;

  constructor(private fb: FormBuilder,
    private httpAuth: HttpAuthService,
    private userLoginData: UserLoginDataService,
    private router: Router,
    private httpUser: HttpUserService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    }, {validators: [this.validateUsername, this.validatePassword]});
  }


  validateUsername = (formGroup: FormGroup) => {
    const username = formGroup.get('username')?.value;
  
    this.httpUser.getAll().subscribe((users) => {
      const user = users.find((user) => user.username === username);
      if (!user) {
        formGroup.get('username')?.setErrors({ invalidCredentials: true });
      } else {
        formGroup.get('username')?.setErrors(null);
      }
    });
  };

  validatePassword = (formGroup: FormGroup) => {
    const username = formGroup.get('username')?.value;
    const password = formGroup.get('password')?.value;
  
    this.httpUser.getAll().subscribe((users) => {
      const user = users.find((user) => user.username === username);
      if (user?.password !== password) {
        formGroup.get('password')?.setErrors({ invalidCredentialsPassword: true });
      } else {
        formGroup.get('password')?.setErrors(null);
      }
    });
  };

  hasErrors(componentName: string, errorCode?: string) {
    return  (this.submitted && this.loginForm?.get(componentName)?.dirty || this.loginForm?.get(componentName)?.touched) &&
    ((!errorCode && this.loginForm?.get(componentName)?.errors ) ||
    (errorCode && this.loginForm?.get(componentName)?.hasError(errorCode)));
  }

  onLogin() {
    this.submitted = true;
    const loginData = this.loginForm?.getRawValue();
    if (loginData) {
      this.httpAuth.login(loginData).subscribe({
        next: (userLoginData: any) => {
       
         this.userLoginData.token = 'Basic ' + btoa(`${loginData.username}:${loginData.password}`);
         if ((userLoginData.role === 'ROLE_STUDENT' || userLoginData.role === 'ROLE_PROFESSOR') && userLoginData.newUser) {
            this.router.navigate(['/change-password']);
          
        } else {
          this.userLoginData.userLoginData = userLoginData;
          if (userLoginData.role === 'ROLE_STUDENT'){
            this.router.navigate(['/home/home-student']);
          } else if (userLoginData.role === 'ROLE_PROFESSOR'){
            this.router.navigate(['/home/home-professor']);
          }else if(userLoginData.role === 'ROLE_ADMIN'){
            this.router.navigate(['/home']);
          }
        }
          
        },
        error: (error: any) => {
          console.error('error:', error.error);
        }
      });
    }
  }
 
}
