import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTACT } from '../../core/site-contact';

interface FooterLink {
  label: string;
  /** Internal route (rendered with routerLink). */
  path?: string;
  fragment?: string;
  /** External URL (opens in a new tab). */
  href?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  imports: [RouterLink],
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly contact = SITE_CONTACT;

  protected readonly columns: FooterColumn[] = [
    {
      title: 'Company',
      links: [
        { label: 'About us', path: '/about' },
        { label: 'PPF Products', path: '/products' },
        { label: 'Contact', path: '/contact' },
      ],
    },
    {
      title: 'Protection',
      links: [
        { label: 'Supercar Gallery', path: '/gallery' },
        { label: 'Warranty Registration', path: '/', fragment: 'packages' },
        { label: 'Aftercare Guide', path: '/', fragment: 'packages' },
      ],
    },
    {
      title: 'Social',
      links: [
        { label: 'Instagram', href: SITE_CONTACT.instagram },
        { label: 'LinkedIn', href: SITE_CONTACT.linkedin },
        { label: 'YouTube', href: 'https://youtube.com' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Film Warranty Terms', path: '/products', fragment: 'compare-matrix' },
        { label: 'Maintenance Policies', path: '/products', fragment: 'tech-matrix' },
      ],
    },
  ];
}
