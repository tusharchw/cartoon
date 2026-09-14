import { Component, signal } from '@angular/core';
import { SmoothScrollService } from '../../core/smooth-scroll.service';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly isMenuOpen = signal(false);

  protected readonly links: NavLink[] = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Products', href: '#services' },
    { label: 'Gallery', href: '#portfolio' },
    { label: 'Reviews', href: '#testimonials' },
  ];

  constructor(private readonly smoothScroll: SmoothScrollService) {}

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  navigate(href: string): void {
    this.isMenuOpen.set(false);
    this.smoothScroll.scrollTo(href);
  }
}
