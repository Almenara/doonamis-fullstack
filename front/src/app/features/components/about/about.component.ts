import { Component, HostListener, inject } from '@angular/core';
import { FaceComponent } from './face/face.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [FaceComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  private router: Router = inject(Router);

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const sections = document.querySelectorAll('h2');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const id = section.getAttribute('id');
        if (id) this.router.navigate([], { fragment: id, replaceUrl: true });
      }
    })
  }

}
