import { Component } from '@angular/core';

interface FooterColumn {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly year = new Date().getFullYear();

  protected readonly columns: FooterColumn[] = [
    {
      title: 'Company',
      links: [
        { label: 'About us', href: '#about' },
        { label: 'PPF Products', href: '#services' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Protection',
      links: [
        { label: 'Supercar Gallery', href: '#portfolio' },
        { label: 'Warranty Registration', href: '#packages' },
        { label: 'Aftercare Guide', href: '#packages' },
      ],
    },
    {
      title: 'Social',
      links: [
        { label: 'Instagram', href: 'https://instagram.com', external: true },
        { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
        { label: 'YouTube', href: 'https://youtube.com', external: true },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Film Warranty Terms', href: '#' },
        { label: 'Maintenance Policies', href: '#' },
      ],
    },
  ];
}
