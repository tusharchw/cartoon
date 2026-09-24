import { Component, DestroyRef, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IsActiveMatchOptions, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isMenuOpen = signal(false);
  /** Home sits on the dark hero video, so its nav text is white; inner pages use black. */
  protected readonly isHome = signal(this.currentPath() === '/');
  /** Hidden once the page is scrolled past its first section. */
  protected readonly isHidden = signal(false);

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

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.isHome.set(this.currentPath() === '/');
        this.updateHidden();
      });

    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      const onScroll = () => this.updateHidden();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      });
      this.updateHidden();
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  /**
   * Same-page clicks don't trigger a router navigation, so glide there
   * ourselves (top of page, or the in-page section).
   */
  onNavigate(link: NavLink): void {
    this.isMenuOpen.set(false);
    if (this.currentPath() !== link.path) {
      return;
    }
    this.smoothScroll.scrollTo(link.fragment ? `#${link.fragment}` : 0);
  }

  private currentPath(): string {
    return this.router.url.split('#')[0].split('?')[0] || '/';
  }

  private updateHidden(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const firstSection = document.querySelector('section');
    const firstHeight = firstSection?.getBoundingClientRect().height || window.innerHeight;
    // Leave a little slack so the nav disappears as the next section arrives under it.
    const hide = window.scrollY > firstHeight - 80;
    if (hide) {
      this.isMenuOpen.set(false);
    }
    this.isHidden.set(hide);
  }
}
