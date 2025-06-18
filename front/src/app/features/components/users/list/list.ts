import { AuthService } from './../../../../services/auth.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class UserList implements OnInit, OnDestroy {

  public users$: User[] = [];
  public selfUser!: User;
  private userService = inject(UserService);
  private authService = inject(AuthService);
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
            } else {
              console.error('No user found in auth service');
            }
          },
          error: (error) => {
            console.error('Error getting user from auth service:', error);
          }
        })
      );
    }

    this.subscriptions.add(
      this.userService.getUsers().subscribe({
        next: (users) => {
          console.log('Users loaded:', users);
          this.users$ = users;
        }
        , error: (error) => {
          console.error('Error loading users:', error);
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  
  deleteUser(id: number) {
    this.subscriptions.add(
      this.userService.deleteUser(id).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.users$ = this.users$.filter(user => user.id !== id);
        }
      })
    );
  }

}
