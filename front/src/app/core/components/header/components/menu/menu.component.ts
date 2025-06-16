import { CommonService } from './../../../../../services/common.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss', 
})
export class MenuComponent {

  public commonService: CommonService = inject(CommonService);
  public touched: boolean = false;


  public openMenu() {
    this.touched = true;
    this.commonService.menuOpen.set(true);
  }

  public closeMenu(event: Event) {
    event.stopPropagation();
    this.commonService.menuOpen.set(false);
  }

}
