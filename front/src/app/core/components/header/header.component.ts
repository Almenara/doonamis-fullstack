
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class Header {
  
  private authService: AuthService = inject(AuthService);
  public loading = false;

  logout(): void {
    this.loading = true;
    this.authService.logout()
  }  
  
}
