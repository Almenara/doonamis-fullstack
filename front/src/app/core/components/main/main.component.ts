import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  private commonService: CommonService = inject(CommonService);

  public addHeader() {
    this.commonService.addHeader();
  }
}
