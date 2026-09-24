import { Component, signal } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';
import { ScrollTextRevealDirective } from '../../core/scroll-text-reveal.directive';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.html',
  imports: [ScrollTextRevealDirective, RevealOnScrollDirective],
})
export class Portfolio {
  protected readonly filters = ['Full Body PPF', 'Track Package', 'Stealth Matte', 'Interior & Carbon'];
  protected readonly activeFilter = signal(this.filters[0]);

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
}
