import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { OsComponent } from "./os/os.component";
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { trigger, state, style, animate, transition, keyframes, animateChild, query, group } from '@angular/animations';
import { filter } from 'rxjs';

@Component({
  selector: 'app-computer',
  imports: [CommonModule, OsComponent],
  templateUrl: './computer.component.html',
  styleUrl: './computer.component.scss',
  animations: [

    trigger('expandAnimation', [
      state('normal', style({
        width: '*',
      })),
      state('fullscreen', style({
        width: '90dvw',
      })),
      transition('normal => fullscreen', animate(
        '500ms 250ms cubic-bezier(0.8, 0, 0.2, 1)',
        keyframes([
          style({ width: '*', offset: 0 }),
          style({ width: '90dvw', offset: 1 }),
        ])
      )),
      transition('fullscreen => normal', animate(
        '250ms  cubic-bezier(0.8, 0, 0.2, 1)',
        keyframes([
          style({ width: '90dvw', offset: 0 }),
          style({ width: '*', offset: 1 }),
        ])
      )
    ),
    ]),

    trigger('fadeOutMonitor', [
      state('normal', style({
        borderColor: '*',
        aspectRatio: '*',
      })),
      state('fullscreen', style({
        borderColor: 'transparent',
        aspectRatio: '1.1/1',
      })),
      transition('normal => fullscreen', [
        group([
          animate('500ms cubic-bezier(0.8, 0, 0.2, 1)'), 
          query('@fadeOutMonitorInnerBorders', animateChild()),
          query('@expandAnimation', animateChild())
        ])
      ]),
      transition('fullscreen => normal', [
        group([
          animate('500ms cubic-bezier(0.8, 0, 0.2, 1)'),
          query('@fadeOutMonitorInnerBorders', animateChild()),
          query('@expandAnimation', animateChild())
        ])
      ]),
    ]),

    trigger('fadeOutMonitorInnerBorders', [
      state('normal', style({
        borderColor: '*',
        padding: '*',
        margin: '*',
      })),
      state('fullscreen', style({
        borderColor: 'transparent',
        padding: '0px',
        margin: '0px',
      })),
      transition('normal <=> fullscreen', [
        animate('250ms cubic-bezier(0.8, 0, 0.2, 1)'),
      ]),
    ]),

    trigger('fadeOutPhrases', [
      state('marginTop', style({
        opacity: 1,
        display: 'flex',
      })),
      state('fullscreen', style({
        opacity: 0,
        display: 'none',
      })),
      transition('normal => fullscreen', animate(
        '250ms cubic-bezier(0.8, 0, 0.2, 1)',
        keyframes([
          style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
          style({ opacity: 0, width: "0px", transform: 'translateY(-20px)', offset: .1 }),
          style({ opacity: 0, transform: 'translateY(-20px)', offset: 1 }),
        ])
      )),
      transition('fullscreen => normal', animate(
        '500ms 1s cubic-bezier(0.8, 0, 0.2, 1)',
        keyframes([
          style({ opacity: 0, width: "*", transform: 'translateY(-20px)', offset: 0 }),
          style({ opacity: 0, display: 'flex', transform: 'translateY(-20px)', offset: .1 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ])
      )),
    ]),

    trigger('fadeOutKeyboard', [
      state('marginTop', style({
        opacity: 1,
        display: 'flex',
      })),
      state('fullscreen', style({
        opacity: 0,
        display: 'none',
      })),
      transition('normal => fullscreen', animate(
        '250ms cubic-bezier(0.8, 0, 0.2, 1)',
        keyframes([
          style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
          style({ opacity: 0, transform: 'translateY(-20px)', offset: .9 }),
          style({ opacity: 0, width: "0px", transform: 'translateY(-20px)', offset: 1 }),
        ])
      )),
      transition('fullscreen => normal', animate(
        '500ms 1s cubic-bezier(0.8, 0, 0.2, 1)',
        keyframes([
          style({ opacity: 0, width: "*", transform: 'translateY(-20px)', offset: 0 }),
          style({ opacity: 0, display: 'flex', transform: 'translateY(-20px)', offset: .1 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ])
      )),
    ]),
  ],
})
export class ComputerComponent {
  @ViewChild(OsComponent) os!: OsComponent;
  public computerOn: boolean = false;
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  public animationState: string = 'normal';

  ngOnInit() {
    const isFullscreen = this.router.url.includes('/fullscreen');
    this.animationState = isFullscreen ? 'fullscreen' : 'normal';
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      const isFullscreen = this.router.url.includes('/fullscreen');
      this.animationState = isFullscreen ? 'fullscreen' : 'normal';
    });
  }
  public keyPressed():void {
      if(!this.computerOn){
        this.computerOn = true;
        return;
      }
      this.os.run();
  }
  public fullScreenGame():void {
    this.router.navigate(['fullscreen'], { relativeTo: this.route });
  }
}
