import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, tap, throwError,} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment.development';
import { User } from './../models/user';
import { UserLoginResponse } from './../models/auth.d';

export interface RecoverPasswords {
  password: string;
  password_confirmation: string;
  token?: string | null;
  email?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get isLoggedIn(): BehaviorSubject<boolean> {
    return this._isLoggedIn;
  }

  private _user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  get user(): BehaviorSubject<User | null> {
    return this._user;
  }

  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  constructor() {
    if (localStorage.getItem('access_token')) {
      this._isLoggedIn.next(true);
    }
  }

  login(user: { email: string; password: string; }): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(`${environment.BACKEND_BASE_URL}/auth/login`, {...user})
      .pipe(
        tap((res) => {
          this.router.navigate(['/']);
          this.saveUserLoggedIn(res.data.user);
          localStorage.setItem('access_token', res.data.token);
          this._isLoggedIn.next(true);
        })
      )
  }

  private saveUserLoggedIn(user: User) {
    // Guardamos el usuario en localStorage
    localStorage.setItem('user', JSON.stringify(user));
    // Actualizamos el BehaviorSubject
    this._user.next(user);
  }

  checkLogin() {
    // Comprbamos si tenemos un token en localStorage
    if (!localStorage.getItem('access_token')) {
      this._isLoggedIn.next(false);
      return;
    }
    this.http
      .get<UserLoginResponse>(`${environment.BACKEND_BASE_URL}/auth/check-login`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      )
      .pipe(
        tap((res) => {
          this.saveUserLoggedIn(res.data.user);
        }),
        catchError((err) => {
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          this.router.navigate(['/login']);
          return throwError(() => err);
      })
    ).subscribe();
  }

  logout() {
    this.http
      .post(`${environment.BACKEND_BASE_URL}/auth/logout`, {},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      )
      .subscribe({
        next: () => {
          this._isLoggedIn.next(false);
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
