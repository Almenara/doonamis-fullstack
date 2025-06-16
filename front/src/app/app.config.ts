import { Component } from '@angular/core';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { MainComponent } from "./core/components/main/main.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    
  ],
  styles: [`
    @import '../styles/_color.scss';
    @import '../styles/_typography.scss';
    @import '../styles/_variables.scss';
    :host{  
      min-width: 100dvw;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    header{
      display: flex;
      width: 100%;
      position: fixed;
      background-color: $background-color;
      flex-direction: column;
      justify-content: start;
      top: 0;
      min-height: $min-header-height;
      z-index: 999; 
    }
    main{
      background-color: $background-color;
      padding-top: $min-header-height;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: start;
      min-width: 100dvw;
      flex: 1;
    }
    footer{
      background-color: $background-color;
      width: 100%;
      position: fixed;
      bottom: 0;
      z-index: 899;
    }
  `],
  template: `
  
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
export class AppComponent {
  public title = 'Alberto Almenara';
}
