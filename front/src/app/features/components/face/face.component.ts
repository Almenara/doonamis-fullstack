import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.scss'],
  imports: [CommonModule]
})
export class FaceComponent {
  @ViewChild('turbulenceEl') turbulence!: ElementRef<SVGFEComponentTransferElement>;
  @ViewChild('displacementEl') displacement!: ElementRef<SVGFEDisplacementMapElement>;

  private freqX:number = 0.03;
  private freqY:number = 0.03;
  private scale:number = 3;
  private animationFrameId: number | null = null;

  public onHover(event: MouseEvent) {

    const pathElement: HTMLElement = event.target as HTMLElement;

    // recogemos todos los hermanos del pathElement
    const paths = pathElement.parentElement?.children;

    if(!paths) return;
    Array.from(paths).forEach((path: Element) => {
      path.classList.add("hover");
      const pattern = path.getAttribute("fill");
      path.setAttribute("filter", "url(#roughen)"); 
      if(!pattern) return;
      const bluePattern = pattern.slice(0, pattern.length - 1) + "-blue" + ")";
      path.setAttribute("fill", bluePattern);
    });

    this.shake();
  }

  public onLeave(event: MouseEvent) {

    const pathElement: HTMLElement = event.target as HTMLElement;
   
    // recogemos todos los hermanos del pathElement
    const paths = pathElement.parentElement?.children;

    if(!paths) return;
    Array.from(paths).forEach((path: Element) => {
      path.classList.remove("hover");
      path.removeAttribute("filter");
      const pattern = path.getAttribute("fill");
      if(!pattern) return;
      const bluePattern = pattern.slice(0, pattern.length - 6) + ")";
      path.setAttribute("fill", bluePattern);
    });

    if(this.animationFrameId){
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null;
    }

  }

  private shake() {
    // Suavizamos la variación usando interpolación
    this.freqX += (0.13 + Math.random() * 0.11 - this.freqX) * 0.1;
    this.freqY += (0.13 + Math.random() * 0.11 - this.freqY) * 0.1;
    this.scale += (3 + Math.random() * 4 - this.scale) * 0.5;
    
    if(!this.turbulence || !this.displacement) return; 
    this.turbulence.nativeElement.setAttribute("baseFrequency", `${this.freqX} ${this.freqY}`);
    this.displacement.nativeElement.setAttribute("scale", `${this.scale}`);

    this.animationFrameId = requestAnimationFrame(() => this.shake());
  }

}
