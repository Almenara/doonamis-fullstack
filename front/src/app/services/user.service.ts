import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment.development';
import { User } from './../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http: HttpClient = inject(HttpClient);

  public getUsers(): Observable<User[]> {
    return this.http.get<{data: User[]}>(`${environment.BACKEND_BASE_URL}/users`)
    .pipe(
      map((response) => response.data)
    );
  }

  public getTrashedUser(): Observable<User[]> {
    return this.http.get<{data: User[]}>(`${environment.BACKEND_BASE_URL}/users/trashed`)
    .pipe(
      map((response) => response.data)
    );
  }

  public deleteUser(user: User): Observable<void> {
    return this.http.delete<void>(`${environment.BACKEND_BASE_URL}/users/${user.id}`);
  }

  public restoreUser(user: User): Observable<void> {
    return this.http.patch<void>(`${environment.BACKEND_BASE_URL}/users/restore/${user.id}`, {});
  }
}
