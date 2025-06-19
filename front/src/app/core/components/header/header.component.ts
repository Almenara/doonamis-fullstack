
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Loading } from "../../../shared/loading/loading";

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, Loading],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class Header implements OnInit {
  
  private authService: AuthService = inject(AuthService);
  // varioable de subscription para saber si el usuario esta logueado
  private isLoggedInSubscription!: Subscription;
  public loading = false;
  public isLogged = false;

  ngOnInit(): void {
    this.isLoggedInSubscription =this.authService.isLoggedIn.subscribe((logged:boolean) => {
      this.isLogged = logged;
    });
  }

  logout(): void {
    this.loading = true;
    this.authService.logout().subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  
}
