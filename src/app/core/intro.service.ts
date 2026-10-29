import { Injectable, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { SmoothScrollService } from './smooth-scroll.service';

/**
 * Tracks whether the 3D landing intro is showing. It only plays when the
 * visitor's first page is the bare home URL — deep links (/about, /#contact)
 * skip it, and once dismissed it stays gone for in-app navigation.
 * Page scrolling is locked while it is up.
 */
@Injectable({ providedIn: 'root' })
export class IntroService {
  private readonly smoothScroll = inject(SmoothScrollService);
  private readonly router = inject(Router);

  readonly active = signal(true);

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        take(1),
      )
      .subscribe((e) => {
        const tree = this.router.parseUrl(e.urlAfterRedirects);
        const path = e.urlAfterRedirects.split(/[?#]/)[0] || '/';
        if (path !== '/' || tree.fragment) {
          this.active.set(false);
        }
      });

    effect(() => this.smoothScroll.setPaused(this.active()));
  }

  finish(): void {
    this.active.set(false);
    this.smoothScroll.resetToTop();
  }
}
