import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ohmommyGame } from './game/main';

@Component({
  selector: 'app-ohmummy',
  imports: [],
  templateUrl: './ohmummy.component.html',
  styleUrl: './ohmummy.component.scss'
})
export class OhmummyComponent {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private game!: ohmommyGame;
  ngAfterViewInit(): void {
    this.game = new ohmommyGame(this.canvasRef.nativeElement);
    this.resizeCanvas();
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    if (!parent) return;

    //const size = Math.min(parent.clientWidth, parent.clientHeight, 400);
    canvas.width = 400;
    canvas.height = 400;

    this.game.onResize(); // Notifica al modelo si hace falta
  }
}
