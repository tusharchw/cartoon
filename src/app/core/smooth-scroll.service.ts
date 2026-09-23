import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Lenis from 'lenis';

/**
 * Wraps Lenis to give the whole app a capped, eased scroll feel: fast wheel
 * flicks and trackpad swipes are absorbed into a slower, consistent glide
 * instead of a 1:1 jump, while native scrollbar/keyboard/anchor scrolling
 * keeps working.
 */
@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private lenis: Lenis | null = null;
  private rafId: number | null = null;

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.lenis) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    this.lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.65,
      touchMultiplier: 1,
      syncTouch: false,
    });

    const raf = (time: number) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);
  }

  scrollTo(target: string | HTMLElement | number, offset = -88): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.lenis) {
      this.lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : offset, duration: 1.6 });
      return;
    }
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (typeof target === 'string') {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /** Jump to the top without animation — used when a new page is routed in. */
  resetToTop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.lenis) {
      this.lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.lenis?.destroy();
    this.lenis = null;
  }
}
