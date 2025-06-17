import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert, AlertType } from '../../../models/alert';
import { AlertService } from '../../../services/alert.service';
import { CommonModule } from '@angular/common';

@Component({ 
  selector: 'app-alert-modal', 
  templateUrl: 'alert.component.html',
  imports: [CommonModule],
  styleUrls: ['./alert.component.scss']
})
export class AlertModal implements OnInit, OnDestroy {
    @Input() id = 'default-alert';
    @Input() fade = true;
    @Input() fadeIn = true;

    alerts: Alert[] = [];
    alertSubscription!: Subscription;
    routeSubscription!: Subscription;
    private readonly router: Router = inject(Router);
    private readonly alertService: AlertService = inject(AlertService);

    ngOnInit() {
        this.alertSubscription = this.alertService.onAlert(this.id)
            .subscribe(alert => {
                // Borramos alertas cuando recibe una sin mensaje
                if (!alert.message) {
                    // filter alertas sin 'keepAfterRouteChange'
                    this.alerts = this.alerts.filter(alert => alert.keepAfterRouteChange);

                    // borra 'keepAfterRouteChange' del resto
                    this.alerts.forEach(alert => delete alert.keepAfterRouteChange);
                    return;
                }

                // añade alert al array
                this.alerts.push(alert);

                // añade autoClose de 3 segundos 
                if (alert.autoClose) {
                    setTimeout(() => this.removeAlert(alert), 3000);
                }
           });

        // Borra alartas cuando cambia la ruta
        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.alertService.clear(this.id);
            }
        });
    }

    ngOnDestroy() {
        if(this.alertSubscription) this.alertSubscription.unsubscribe();
        if(this.routeSubscription) this.routeSubscription.unsubscribe();
    }

    removeAlert(alert: Alert) {
        // comprobamos si ya se borro la alerta
        if (!this.alerts.includes(alert)) return;

        if (this.fade) {
            // añade el fade out
            alert.fade = true;

            // borra tras el faded out
            setTimeout(() => {
                this.alerts = this.alerts.filter(x => x !== alert);
            }, 250);
        } else {
            // borra alert
            this.alerts = this.alerts.filter(x => x !== alert);
        }
    }

    cssClass(alert: Alert) {
      if (!alert) return;

      const classes = ['alert', 'alert-dismissible', 'alert-animation' , 'container'];
              
      const alertTypeClass = {
          [AlertType.Success]: 'alert-success',
          [AlertType.Error]: 'alert-danger',
          [AlertType.Info]: 'alert-info',
          [AlertType.Warning]: 'alert-warning'
      }

      if (alert.type !== undefined) {
          classes.push(alertTypeClass[alert.type]);
      }

      if (alert.fade) {
        classes.push('fade');
      }

      return classes.join(' ');
    }
}