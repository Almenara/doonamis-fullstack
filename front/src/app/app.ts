import { Component } from '@angular/core';
import { Header } from './core/components/header/header.component';
import { Footer } from './core/components/footer/footer.component';
import { Main } from "./core/components/main/main.component";
import { AlertModal } from "./features/components/alert/alert.component";

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Footer,
    Main,
    AlertModal
],
  styles: [`
    @use '../styles/_color.scss' as *;
    @use '../styles/_typography.scss' as *;
    :host{  
      min-width: 100dvw;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  `],
  template: `
    <app-alert-modal />
    
    <header class="px-[1rem] md:px-[2rem]">
      <app-header/>
    </header>

    <main class="pb-[6rem]">
      <app-main/>
    </main>
    
    <footer>
      <app-footer/>
    </footer>
  `,
  }
)
export class App {
  protected title = 'front';
}
