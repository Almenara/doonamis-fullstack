import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';

import { environment } from '../../environments/environment.development';
import { User } from './../models/user';
import { HttpImport } from '../models/httpImport';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http: HttpClient = inject(HttpClient);

  public getUsers(): Observable<User[]> {
    return this.http.get<{data: User[]}>(`${environment.BACKEND_BASE_URL}/users/`)
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

  public deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.BACKEND_BASE_URL}/users/${id}`);
  }

  public restoreUser(user: User): Observable<void> {
    return this.http.patch<void>(`${environment.BACKEND_BASE_URL}/users/restore/${user.id}`, {});
  }
  public uploadCSV(file: File): Observable<HttpEvent<HttpImport>> {
    const formData = new FormData();
    formData.append('file', file);
    console.log('Subiendo archivo:', file);

    return this.http.post<HttpImport>(`${environment.BACKEND_BASE_URL}/users/import-csv`, formData, {
      reportProgress: true,
      observe: 'events',
      headers: {
        'Accept': 'application/json',
      },
      withCredentials: true
    })
    .pipe(
      filter(e => e.type === HttpEventType.UploadProgress || e.type === HttpEventType.Response)
    );
  }
}

