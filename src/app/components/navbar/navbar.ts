import { Component, inject, signal } from '@angular/core';
import { IsActiveMatchOptions, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SmoothScrollService } from '../../core/smooth-scroll.service';

interface NavLink {
  label: string;
  path: string;
  fragment?: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [RouterLink, RouterLinkActive],
})
export class Navbar {
  private readonly router = inject(Router);
  private readonly smoothScroll = inject(SmoothScrollService);

  protected readonly isMenuOpen = signal(false);

  protected readonly links: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Products', path: '/products' },
    { label: 'Gallery', path: '/gallery' },
    //{ label: 'Reviews', path: '/', fragment: 'testimonials' },
  ];

  protected readonly activeOptions: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'exact',
  };

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  /**
   * Same-page clicks don't trigger a router navigation, so glide there
   * ourselves (top of page, or the in-page section).
   */
  onNavigate(link: NavLink): void {
    this.isMenuOpen.set(false);
    const currentPath = this.router.url.split('#')[0].split('?')[0] || '/';
    if (currentPath !== link.path) {
      return;
    }
    this.smoothScroll.scrollTo(link.fragment ? `#${link.fragment}` : 0);
  }
}
