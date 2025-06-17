import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { UserLoginResponse } from '../../../models/auth';
import { AuthService } from './../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'

})
export class Login {

private authService: AuthService    = inject(AuthService);
  private alertService: AlertService  = inject(AlertService);

  private fb = inject(FormBuilder);
  public loginForm = this.fb.group({
    email:    ['admin@admin.com', Validators.required],
    password: ['12345', Validators.required]
  });

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.login(
      this.loginForm.value as { email: string; password: string }
    );
    this.loginForm.reset();
  }


  private login(credentials: { email: string; password: string }): void {
    this.authService.login(credentials).subscribe({
      next: (response: UserLoginResponse) => {
        if(response.data.message){
          this.alertService.success(response.data.message, {autoClose: true, keepAfterRouteChange: true});
        }
      },
      error: () => {
        this.alertService.error('Algo ha ido mal', {autoClose: true, keepAfterRouteChange: false});
      }
    });
  }



  public logout(): void {
    this.authService.logout();
  }

  /*public getUsers(){
    this.userService.getUsers().subscribe({
      next: (response: User[]) => {
        this.users = response;
        this.alertService.success('Users fetched successfully', {autoClose: true, keepAfterRouteChange: false});
      }
      , error: () => {
        //TODO: handle error
      }
    });
  }*/

}
