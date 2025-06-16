import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, keyframes, state, AnimationEvent } from '@angular/animations';
import { OhmummyComponent } from "./games/ohmummy/ohmummy.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-os',
  imports: [
    CommonModule,
    OhmummyComponent
],
  templateUrl: './os.component.html',
  styleUrl: './os.component.scss',
  animations: [
    trigger('runOS', [
      state('off', style({
        opacity: 0,
        transform: 'scale(0.2, 0.1)',
        borderRadius: '50%'
      })),
      state('on', style({
        opacity: 1,
        transform: 'scale(1, 1)',
        borderRadius: '1rem'
      })),
      transition('off => on', [
        animate('.3s', keyframes([
          style({ opacity: 0, transform: 'scale(.2, 0.1)', borderRadius: '50%' }),
          style({ opacity: 0.6, transform: 'translate(0, 3%)', borderRadius: '1rem' }),
          style({ opacity: 0.4, transform: 'translate(0, 2%)', borderRadius: '1rem' }),
          style({ opacity: 0.7, transform: 'translate(0, 4%)', borderRadius: '1rem' }),
          style({ opacity: 0.6, transform: 'translate(0, 3%)', borderRadius: '1rem' }),
          style({ opacity: 0.3, transform: 'translate(0, 1%)', borderRadius: '1rem' }),
          style({ opacity: 0.8, transform: 'scale(.9, .7)', borderRadius: '1rem' }),
          style({ opacity: 0.3, transform: 'scale(1, 1)', borderRadius: '1rem' }),
          style({ opacity: 0.8, transform: 'scale(.95, .8)', borderRadius: '1rem' }),
          style({ opacity: 0.8, transform: 'scale(1, 1)', borderRadius: '1rem' }),
        ]))
      ]),
      transition('on => off', [
        animate('.3s', keyframes([
          style({ opacity: 1, transform: 'scale(1, 1)', borderRadius: '50%' }),
          style({ opacity: 1, transform: 'scale(1, .2)', borderRadius: '40%' }),
          style({ opacity: 1, transform: 'scale(1, .1)', borderRadius: '10%' }),
          style({ opacity: 1, transform: 'scale(1, .1)', borderRadius: '15%' }),
          style({ opacity: 1, transform: 'scale(1, .1)', borderRadius: '50%' }),
          style({ opacity: 1, transform: 'scale(1, .1)', borderRadius: '50%' }),
          style({ opacity: 1, transform: 'scale(0, 0)', borderRadius: '50%' }),
        ]))
      ]),
    ])
  ],
})
export class OsComponent {
  @Input('computerOn') computerOn: boolean = false;
  @ViewChild('commandLine') commandLine!: ElementRef;
  @ViewChild('os') osContainer!: ElementRef;
  public gameIsRunning: boolean = false;
  public gameIsLoading: boolean = false;
  public systemReady: boolean = false;
  private command: string = 'run"';
  private keyPressedNTimes: number = 0;
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  public run(): void {
    if (this.gameIsRunning || this.gameIsLoading || !this.systemReady) return;

    if (this.keyPressedNTimes === 4) {
      this.runGame();
      return;
    }
    this.commandLine.nativeElement.innerHTML += this.command[this.keyPressedNTimes];
    this.keyPressedNTimes++;
  }

  private runGame(): void {
    this.gameIsLoading = true;
    setTimeout(() => {
      this.gameIsRunning = true;
      this.gameIsLoading = false;
    }, 2000);
  }

  public offOS(event: AnimationEvent) {
    if(event.toState === 'off') {

      this.router.navigate(['../'], { relativeTo: this.route });
      this.systemReady = false;
      this.gameIsRunning = false;
      this.gameIsLoading = false;
      this.keyPressedNTimes = 0;
      
    }
    if(event.toState === 'on') this.systemReady = true;
  }
}
