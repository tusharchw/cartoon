import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';
import { ScrollTextRevealDirective } from '../../core/scroll-text-reveal.directive';

interface PackageCard {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-packages',
  templateUrl: './packages.html',
  imports: [ScrollTextRevealDirective, RevealOnScrollDirective],
})
export class Packages {
  protected readonly cards: PackageCard[] = [
    {
      title: 'Full Body Wrap',
      description: 'Complete exterior coverage with edge-wrapped panels, zero visible seams, and 100% paint defense.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCvUjVuMuKrrq_7hSzOreNadtgLRiKOVeOHI2An_MIFx_3feMHhoVhwkj-nTLTnn-1QOJcXx9PTpRBMDJgCgajpq136BzIk-bQuWJi9W-r_juv9oldjNSQpeKPRFLv4sX6biK5eRr-2YtJih2NJwOaoKicM-i3IfbJZPKjBZ9DgTLX5j2WJgfvhWr8kzVGJiUhpeplgAmpm2O6W1Woq0Wt7w0lvqzWu5TYoqsnq11FXyYJVBDBftrK_',
    },
    {
      title: 'Track & High-Impact',
      description: 'Targeted protection for front bumper, full hood, fenders, mirrors, and rocker panels prone to gravel.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCKOyO59SyhgANVvu5Xa1hKwLOQp2vcwqDS0kKJDUh-2k3fI1s_u3D2QGBaWM-Tk7421cXkXr_YIX7CxmYWFUfM3DpXDSgXJaT6PdrNTMyHuXbX35DNI8NzCMVSrIr-DKAVAtgoh7qCuwV1ZxSb048p072r_LoBSJrSS7ZfyIQdNjUMduDK3a7HSRgvnITzDdo689cTbjOtuBtUf3-1SLKyJ2Jhetqe4YozSGJra8aMhI5lz71MsVhs',
    },
    {
      title: 'Stealth Matte Conversion',
      description: 'Convert high-gloss factory paint into a satin matte finish while shielding against high-velocity road debris.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDDlkxvvXVgZPGeJUGuhMO5fzhNqgGgbhgzNEBS-KQzuv0CFz2igdz5MeDW7vef9dm4fGqRlz1ntCeJaCXi8XZHdgnVgYtD5LFV72Bo7BGawAXgTXRu7FuZqk0_yTvPNlZj4QdOdIqn7EeGf3MftpNTnlMeEZ7fRYHMdAKTbaJDjinkG-0exFe4XHBfUIXxurPGOEryw3iGTMtXzA96z8TbD0wQn4ZhsQkpY6L-9ZcAJsj9iFQ5cgYO',
    },
    {
      title: 'Interior & Carbon Trim',
      description: 'Precision pre-cut film for center consoles, touchscreens, high-gloss trim, and exposed carbon fiber.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAAIJWtG-tqIHn0EsDYVCtVYlGbrRPmWRW0biYSwWvuJQMYcBrxwTjnxfRpmP6s4yYBmybQhvu8gzAgrwHEFEVRYl4gmgz4yKLeUVQb8DbGQlsmJT0MYGXhVczZQiK0wLfGumAzQWWX-t_ZE-HurmRA_FK-50TRAjUsij59Zi4iWJXDwxDlsri-O1q32jhOEpLqmHoMdY8kUQJbrGHdibvwpTQX_uo3Mbygkgymskl7hoqDo5dn-cJE',
    },
    {
      title: 'Windshield Defense',
      description: 'Ultra-clear exterior windshield film preventing rock chips, pitting, and star cracks at high speeds.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDLXnH1uTUPmr-aovkWiP3YpsOhetoUlGE64iEsIlDH8wATW95osOmAxcA5_5I7OslOBOgtd4DGXtY-6ObfvuhVaqaoDbSYvfAmX3-n0PEp35BII1lBc2ias4z3sDX7LIesKalM-D9loqlF6wrqX30tgiEdvLQ6sgmmw846B3vTlVQTSy6sPVqY2QypSCBbVmT3iL5P6J2tWM3ZOLwetkPuO79fTrVrPwJWNBx6a2k023t7mNpFlm0V',
    },
    {
      title: 'Ceramic Infused Topcoat',
      description: 'Hydrophobic ceramic-infused top layer shedding road grime, water spots, and brake dust effortlessly.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAeHL-Iu91cPyp3T6Nj2tjd1ymQfruhGoiLF6krpKa8bUuViASBmeWZ3jJzVNv3c7LyOlj-7bABvLZfynGhKsq6ORLApp_Gb5pWEobF9j4KH1tnKllO2O73rE0jeDKpzGCL8yFkYalm-XoKwIf2WrtKZDVuzDWib1GiKfaVpXzXT75DviJr6j0dLC8zi9kT8gUqqBBeZZpn3oq2KqsGVZxTf4iJ8eM9bS3RajeDDtIWhABbL-jGG7hq',
    },
  ];
}
