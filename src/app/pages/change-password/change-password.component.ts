import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePassword } from 'src/app/core/models';
import { ChangePasswordService } from 'src/app/core/services/change-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm?: FormGroup;

  constructor(private fb: FormBuilder,
    private passService: ChangePasswordService,
    private router: Router) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.changePasswordForm = this.fb.group({
      password: ['', Validators.required],
      repeatedPassword: ['', Validators.required],
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
    return  (this.changePasswordForm?.get(componentName)?.dirty || this.changePasswordForm?.get(componentName)?.touched) &&
    ((!errorCode && this.changePasswordForm?.get(componentName)?.errors ) ||
    (errorCode && this.changePasswordForm?.get(componentName)?.hasError(errorCode)));
  }

  onChangePassword() {
    const passwordData = this.changePasswordForm?.getRawValue();
    if (passwordData) {
      this.passService.changePassword(passwordData).subscribe({
        next: (userLoginData: any) => {
        userLoginData.newUser = false;
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.error('error:', error.error);
        }
      });
    }
  }
 
}

