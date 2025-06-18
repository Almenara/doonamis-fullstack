import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './../services/auth.service';
import { AlertService } from '../services/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);
  private router: Router = inject(Router);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
                
        let errorMessage = err.error.message || err.statusText;

        //comprabamos si la llamada es para saber si el ya esta logueado
        if (err.status === 401 && request.url.includes('/auth/check-login')) {
          // Si la llamada es para comprobar si el usuario está logueado, no hacemos nada
          return throwError(() => new Error(errorMessage));
        }
        
        if ([401, 403].includes(err.status)) {
          
          if (err.status === 401) {
            errorMessage = 'No tienes permiso para acceder a este recurso. Por favor, inicia sesión de nuevo.';
          }
          else if (err.status === 403) {
            errorMessage = 'No tienes permiso para acceder a este recurso.';
          }
        }
        if(err.status !== 422){
          this.router.navigate(['/error']);
        };
        
        this.alertService.error(errorMessage, { autoClose: true, keepAfterRouteChange: true });
  
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
