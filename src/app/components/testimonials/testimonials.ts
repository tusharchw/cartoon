import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';
import { ScrollTextRevealDirective } from '../../core/scroll-text-reveal.directive';

interface Testimonial {
  quote: string;
  initials: string;
  name: string;
  role: string;
}

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.html',
  imports: [ScrollTextRevealDirective, RevealOnScrollDirective],
})
export class Testimonials {
  protected readonly rowDark: Testimonial[] = [
    {
      quote: 'The optical clarity on my Ferrari 296 GTB is breathtaking. You cannot tell there is a film installed, and the hydrophobic shine is unreal.',
      initials: 'PS',
      name: 'Priya S.',
      role: 'Ferrari Delhi',
    },
    {
      quote: 'CARTRON applied Stealth Matte PPF on my Rolls-Royce Ghost. Flawless edge tucking and complete peace of mind on Delhi roads.',
      initials: 'S',
      name: 'Sophie',
      role: 'Rolls-Royce Owner',
    },
    {
      quote: 'Took my Porsche GT3 RS straight to CARTRON for full-body track PPF. Track days at BIC without a single rock chip scratch.',
      initials: 'PK',
      name: 'Palak Khanna',
      role: 'Porsche Club India',
    },
  ];

  protected readonly rowLight: Testimonial[] = [
    {
      quote: 'The self-healing capability on my Huracán STO is magic. Swirl marks literally disappear under sunlight or warm water.',
      initials: 'K',
      name: 'Krishna',
      role: 'Supercar Collector',
    },
    {
      quote: 'Full wrap on my AMG G63. Incredible attention to detail around badges and door edges. Best studio in India.',
      initials: 'RK',
      name: 'Rajeev Khanna',
      role: 'AMG Delhi',
    },
    {
      quote: 'Opted for the 10-year warranty ultra-gloss film on my BMW M8. The mirror reflection and stone chip defense are unmatched.',
      initials: 'P',
      name: 'Pranav',
      role: 'DLF',
    },
  ];
}
