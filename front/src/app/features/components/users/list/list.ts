import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { AuthService } from './../../../../services/auth.service';
import { AlertService } from '../../../../services/alert.service';
import { Loading } from '../../../../shared/loading/loading';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    RouterModule,
    Loading
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class UserList implements OnInit, OnDestroy {

  public users$: User[] = [];
  public selfUser!: User;
  public loading = true;
  public deleting: number | null = null; // Track which user is being deleted

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private subscriptions: Subscription = new Subscription();

  ngOnInit() {
    // obtenemos el usuario de localStorage
    const user = localStorage.getItem('user');
    if (user) {
      this.selfUser = JSON.parse(user);
    }
    else {
      this.subscriptions.add(
        this.authService.user.subscribe({
          next: (user) => {
            if (user) {
              this.selfUser = user;
            } 
          },
          error: () => {
            this.alertService.error('Ha ocurrido un error al obtener el usuario', { autoClose: true, keepAfterRouteChange: true });
          }
        })
      );
    }

    this.subscriptions.add(
      this.userService.getUsers().subscribe({
        next: (users) => {
          this.users$ = users;
          this.loading = false;
        }
        , error: () => {
          this.alertService.error('Ha ocurrido un error al obtener los usuarios', { autoClose: true, keepAfterRouteChange: true });
          this.loading = false;
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  
  deleteUser(id: number) {
    this.deleting = id;
    this.subscriptions.add(
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.alertService.success('Usuario eliminado correctamente', { autoClose: true, keepAfterRouteChange: true });
          this.users$ = this.users$.filter(user => user.id !== id);
          this.deleting = null;
        },
        error: () => {
          this.alertService.error('Ha ocurrido un error al eliminar el usuario', { autoClose: true, keepAfterRouteChange: true });
          this.deleting = null;
        }
      })
    );
  }

}
