import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';

interface ShowcaseImage {
  src: string;
  alt: string;
  caption: string;
}

interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  imports: [RevealOnScrollDirective],
})
export class About {
  protected readonly images: ShowcaseImage[] = [
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvUjVuMuKrrq_7hSzOreNadtgLRiKOVeOHI2An_MIFx_3feMHhoVhwkj-nTLTnn-1QOJcXx9PTpRBMDJgCgajpq136BzIk-bQuWJi9W-r_juv9oldjNSQpeKPRFLv4sX6biK5eRr-2YtJih2NJwOaoKicM-i3IfbJZPKjBZ9DgTLX5j2WJgfvhWr8kzVGJiUhpeplgAmpm2O6W1Woq0Wt7w0lvqzWu5TYoqsnq11FXyYJVBDBftrK_',
      alt: 'High gloss PPF application on exotic sports car fender',
      caption: 'Ultra-Gloss Mirror TPU Finish',
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKOyO59SyhgANVvu5Xa1hKwLOQp2vcwqDS0kKJDUh-2k3fI1s_u3D2QGBaWM-Tk7421cXkXr_YIX7CxmYWFUfM3DpXDSgXJaT6PdrNTMyHuXbX35DNI8NzCMVSrIr-DKAVAtgoh7qCuwV1ZxSb048p072r_LoBSJrSS7ZfyIQdNjUMduDK3a7HSRgvnITzDdo689cTbjOtuBtUf3-1SLKyJ2Jhetqe4YozSGJra8aMhI5lz71MsVhs',
      alt: 'Self-healing hydrophobic paint protection film water test',
      caption: 'Edge-Wrapped Impact Defense',
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_djfzz2ARwPkXO__eMi3f3bkqBWh5X-6HKphm_5MdRHp74tGdlS33RI0seSZp36rzdryg3e0hG-0qqMauphruBn96NGXywXn9N8c5GX5exfRs9w8J-zFgqn9iROFm-yDdEyNixkVLhewiUVOaoJtlOfTTZlKuaX8GOVQhxlsaiTiJbgK4BgOVgm1oPH3FlaBlgrY0ZygZ4TY1ogMguGiI9nwtatwKWUufj2xtxshbdtvD69h0Rp6d',
      alt: 'Full body protected white 4x4 supercar offroad trail',
      caption: 'Gravel & High-Altitude Protection',
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSM-W70jpFlmHI97sQlfUJxscCnk-WlEzaNjd1OT--QM9EIbvMo4zuTqTxsj1lRCFl0Voo9QB2W8x-f_fyzL96kMuVlkiRDDJB-QSHQT4hPPXMtMkfE4adkywQh2W75yhl9Yjf7ULAJoGN_cau_cmY-rgJTdfpr8Gj3b7RdsldB_Y32FNVALr0vOb5YxQDWlvLZdK97-iXm43B6Ai2hQLcegFHaMFo_C7KrngdnyRLDx-XzGb4w07M',
      alt: 'Certified master technician inspecting clear bra film',
      caption: 'Dust-Free Clean Bay Application',
    },
  ];

  protected readonly stats: Stat[] = [
    { value: '10+', label: 'Years Warranty' },
    { value: '99%', label: 'Optical Clarity' },
    { value: '100k+', label: 'Sq. Ft. Installed' },
    { value: '650+', label: 'Supercars Protected' },
  ];
}
