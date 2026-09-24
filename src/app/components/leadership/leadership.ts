import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';

interface Founder {
  name: string;
  role: string;
  image: string;
}

@Component({
  selector: 'app-leadership',
  templateUrl: './leadership.html',
  imports: [RevealOnScrollDirective],
})
export class Leadership {
  protected readonly founders: Founder[] = [
    {
      name: 'Vishnu Drolia',
      role: 'Co-Founder',
      image: 'co-founder1.jpeg',
    },
    {
      name: 'Shivam Kumar',
      role: 'Co-Founder',
      image: 'co-founder2.jpeg',
    },
  ];
}
