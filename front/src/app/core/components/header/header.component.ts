
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Subscription } from 'rxjs';
import { MenuComponent } from "./components/menu/menu.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MenuComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  
  private commonService: CommonService    = inject(CommonService);
  private subscriptions: Subscription     = new Subscription();

  public changeHeaderAnimation: number[]  = [];
  public changingHeader: boolean          = false;

  ngOnInit(): void {
    this.subscriptions.add(this.commonService.addHeader().subscribe(() => {
      this.animateHeader();
    }))
  }

  public animateHeader() {
    if(this.changingHeader) return;
    this.changingHeader = true;
    setTimeout(() => {
      this.changeHeaderAnimation.push(this.changeHeaderAnimation.length + 1);
      this.changingHeader = false;
    }, this.changeHeaderAnimation.length > 0 ? 1000 : 0);
    setTimeout(() => {
      // borramos el primer elemento del array
      if(this.changeHeaderAnimation.length > 1)
      this.changeHeaderAnimation.shift();
    }, 2500);
  }
}
