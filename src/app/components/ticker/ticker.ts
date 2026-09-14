import { Component } from '@angular/core';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.html',
})
export class Ticker {
  protected readonly items = ['SELF-HEALING TPU', '10-YEAR WARRANTY', 'INVISIBLE ARMOR', 'ZERO ORANGE PEEL', 'SUPERCARS SPECIALIST'];
}
