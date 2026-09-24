import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';

interface LineupCard {
  title: string;
  description: string;
  image: string;
  cta: string;
}

@Component({
  selector: 'app-ppf-lineup',
  templateUrl: './ppf-lineup.html',
  imports: [RevealOnScrollDirective],
})
export class PpfLineup {
  protected readonly cards: LineupCard[] = [
    {
      title: 'Ultra-Gloss PPF',
      description:
        'Optically clear, high-gloss hydrophobic TPU with instant thermal self-healing. Enhances factory paint depth while resisting rock chips, gravel, and swirl marks.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCvUjVuMuKrrq_7hSzOreNadtgLRiKOVeOHI2An_MIFx_3feMHhoVhwkj-nTLTnn-1QOJcXx9PTpRBMDJgCgajpq136BzIk-bQuWJi9W-r_juv9oldjNSQpeKPRFLv4sX6biK5eRr-2YtJih2NJwOaoKicM-i3IfbJZPKjBZ9DgTLX5j2WJgfvhWr8kzVGJiUhpeplgAmpm2O6W1Woq0Wt7w0lvqzWu5TYoqsnq11FXyYJVBDBftrK_',
      cta: 'Know More',
    },
    {
      title: 'Matte & Satin Stealth',
      description:
        'Transforms factory gloss finishes into a sleek satin matte sheen while delivering heavy-duty impact defense against road hazards and UV oxidation.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDDlkxvvXVgZPGeJUGuhMO5fzhNqgGgbhgzNEBS-KQzuv0CFz2igdz5MeDW7vef9dm4fGqRlz1ntCeJaCXi8XZHdgnVgYtD5LFV72Bo7BGawAXgTXRu7FuZqk0_yTvPNlZj4QdOdIqn7EeGf3MftpNTnlMeEZ7fRYHMdAKTbaJDjinkG-0exFe4XHBfUIXxurPGOEryw3iGTMtXzA96z8TbD0wQn4ZhsQkpY6L-9ZcAJsj9iFQ5cgYO',
      cta: 'Contact',
    },
    {
      title: 'Track & Custom Packages',
      description:
        'Precision digital plotter templating and custom edge-wrapped protection for high-speed track-day exotics, carbon-fiber splitters, and rocker panels.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAeHL-Iu91cPyp3T6Nj2tjd1ymQfruhGoiLF6krpKa8bUuViASBmeWZ3jJzVNv3c7LyOlj-7bABvLZfynGhKsq6ORLApp_Gb5pWEobF9j4KH1tnKllO2O73rE0jeDKpzGCL8yFkYalm-XoKwIf2WrtKZDVuzDWib1GiKfaVpXzXT75DviJr6j0dLC8zi9kT8gUqqBBeZZpn3oq2KqsGVZxTf4iJ8eM9bS3RajeDDtIWhABbL-jGG7hq',
      cta: 'Contact',
    },
  ];
}
