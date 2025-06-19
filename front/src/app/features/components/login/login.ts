import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { UserLoginResponse } from '../../../models/auth';
import { AuthService } from './../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';
import { Loading } from "../../../shared/loading/loading";

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Loading
],
  templateUrl: './login.html',
  styleUrl: './login.scss'

})
export class Login {
  
  private authService: AuthService    = inject(AuthService);
  private alertService: AlertService  = inject(AlertService);
  private router: Router = inject(Router);
  private fb = inject(FormBuilder);
 
  public loginForm = this.fb.group({
    email:    ['admin@admin.com',[Validators.required, Validators.email]],
    password: ['12345', [Validators.required, Validators.minLength(5)]]
  });
  public loading = false;

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.login(
      this.loginForm.value as { email: string; password: string }
    );
  }


  private login(credentials: { email: string; password: string }): void {
    this.loading = true;
    this.authService.login(credentials).subscribe({
      next: (response: UserLoginResponse) => {
        if(response.data.message){
          this.alertService.success(response.data.message, {autoClose: true, keepAfterRouteChange: true});
        }
        this.router.navigate(['/home']);
        this.loginForm.reset();
        this.loading = false;
      },
      error: () => {
        this.loginForm.patchValue({ password: '' });
        this.loginForm.markAsPristine();
        this.loginForm.markAsUntouched();
        this.loading = false;
      }
    });
  }

}
