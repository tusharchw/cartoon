import { Component, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SmoothScrollService } from './core/smooth-scroll.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  constructor(smoothScroll: SmoothScrollService) {
    afterNextRender(() => smoothScroll.init());
  }
}
