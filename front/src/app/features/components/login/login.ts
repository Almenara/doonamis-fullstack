import { Component, inject } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { User } from './../../../models/user';
import { UserLoginResponse } from '../../../models/auth';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'

})
export class Login {

  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);
  private userService: UserService = inject(UserService);
  public users: User[] = [];

  public login(): void {
    this.authService.login({'email': 'admin@admin.com', 'password': '12345'}).subscribe({
      next: (response: UserLoginResponse) => {
        if(response.data.message){
          this.alertService.success(response.data.message, {autoClose: true, keepAfterRouteChange: true});
        }
      },
      error: () => {
        this.alertService.error('Login failed', {autoClose: true, keepAfterRouteChange: false});
      }
    });
  }
  public logout(): void {
    this.authService.logout();
  }

  public getUsers(){
    this.userService.getUsers().subscribe({
      next: (response: User[]) => {
        this.users = response;
        this.alertService.success('Users fetched successfully', {autoClose: true, keepAfterRouteChange: false});
      }
      , error: () => {
        //TODO: handle error
      }
    });
  }

}
