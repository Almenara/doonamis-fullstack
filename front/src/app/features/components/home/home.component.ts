import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class Home {

  private phrases: string[] = [
    'Cuando empecé Flash lo petaba.',
    'Programando desde antes de que JavaScript molara.',
    'Aprendí a programar sin ChatGPT... y sin StackOverflow.',
    'Mi primer Github era un pendrive de 64 MB.',
    'Yo llegué a maquetar con tablas.',

  ]

  public currentPhrase = ""
  public currentPhraseIndex: number = Math.floor(Math.random() * this.phrases.length);
  public writing = false;

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
