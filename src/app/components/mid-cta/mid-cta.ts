import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';
import { ScrollTextRevealDirective } from '../../core/scroll-text-reveal.directive';

@Component({
  selector: 'app-mid-cta',
  templateUrl: './mid-cta.html',
  imports: [ScrollTextRevealDirective, RevealOnScrollDirective],
})
export class MidCta {}
