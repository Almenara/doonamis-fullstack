import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router, Event } from '@angular/router';

import { BehaviorSubject, lastValueFrom, Observable, tap, throwError,} from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { environment } from './../../environments/environment.development';
import { User } from './../models/user';
import { UserLoginResponse } from './../models/auth.d';
import { NgxPermissionsService } from 'ngx-permissions';

export interface RecoverPasswords {
  password: string;
  password_confirmation: string;
  token?: string | null;
  email?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public lastUrl!: string | null;

  get isLoggedIn(): BehaviorSubject<boolean> {
    return this._isLoggedIn;
  }

  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private ngxPermissionsService: NgxPermissionsService = inject(NgxPermissionsService);

  constructor(
  ) {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.lastUrl = event.urlAfterRedirects;
      }
    );
    if (localStorage.getItem('access_token')) {
      this._isLoggedIn.next(true);
    }
  }

  login(user: {
    email: string;
    password: string;
  }): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(`${environment.BACKEND_BASE_URL}/auth/login`, {...user})
      .pipe(
        tap((res) => {
          if (this.lastUrl && this.lastUrl !== '/login') {
            this.router.navigate([this.lastUrl]);
            this.lastUrl = null;
          } else {
            this.router.navigate(['/']);
          }
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('access_token', res.data.token);
          this._isLoggedIn.next(true);
        })
      )
  }

  getUserLogged(): Promise<{ status: string; data: User }> {
    return lastValueFrom(
      this.http
        .get<{ status: string; data: User }>(`${environment.BACKEND_BASE_URL}/user`)
        .pipe(
          tap((res) => {
            localStorage.setItem('user', JSON.stringify(res.data));
          }),
          catchError((err) => {
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            this.router.navigate(['/login']);
            this.ngxPermissionsService.flushPermissions();
            return throwError(() => err);
          })
        )
    );
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
          this.ngxPermissionsService.flushPermissions();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
