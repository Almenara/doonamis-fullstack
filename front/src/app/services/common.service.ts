import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public menuOpen = signal<boolean>(false);

  public addHeader(): Observable<boolean> {
    return of(true);
  }
}
