import { Component } from '@angular/core';
import { ComputerComponent } from "./computer/computer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [ComputerComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private phrases: string[] = [
    'Cuando empecé Flash lo petaba.',
    'Programando desde antes de que JavaScript molara.',
    'Aprendí a programar sin ChatGPT... y sin StackOverflow.',
    'Mi primer Github era un pendrive de 64 MB.',
    'Yo llegué a maquetar con tablas.',

  ]

  public currentPhrase: string = ""
  public currentPhraseIndex: number = Math.floor(Math.random() * this.phrases.length);
  public writing: boolean = false;

  constructor() {
    this.writePhrase();
  }


  private writePhrase() {
    if (this.currentPhrase.length < this.phrases[this.currentPhraseIndex].length) {
      this.writing = true;
      this.currentPhrase += this.phrases[this.currentPhraseIndex].charAt(this.currentPhrase.length);
      setTimeout(() => {
        this.writePhrase();
      }, Math.random() * 300 + 50);
    }
    else {
      this.writing = false;
      this.currentPhraseIndex++;
      if (this.currentPhraseIndex >= this.phrases.length) {
        this.currentPhraseIndex = 0;
      }
      setTimeout(() => {
        this.deletePhrase();
      }, 8000);
    }
  }
  private deletePhrase() {
    if (this.currentPhrase.length > 0) {
      this.currentPhrase = this.currentPhrase.slice(0, -1);
      setTimeout(() => {
        this.writing = true;
        this.deletePhrase();
      }, this.writing ? 100 : 500);
    }
    else {
      this.writing = false;
      setTimeout(() => {
        this.writePhrase();
      }, 1000);
    }
  }

}
