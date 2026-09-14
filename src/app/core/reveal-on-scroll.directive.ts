import { AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Adds a subtle fade-up-into-view animation as sections scroll into the
 * viewport. Content stays fully visible without JS/before hydration (SSR
 * safe) — the "armed" + "visible" classes are only added once the browser
 * observer confirms the element, so there is no flash-of-invisible-content.
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const node = this.el.nativeElement;
    node.classList.add('reveal-armed');

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('reveal-visible');
            this.observer?.unobserve(node);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
