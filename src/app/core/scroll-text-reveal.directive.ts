import { Directive, ElementRef, NgZone, OnDestroy, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Opacity a character sits at before the scroll reaches it. */
const DIM_OPACITY = 0.18;

/**
 * Scroll-scrubbed, character-by-character text fill (the fotog.in heading
 * effect): each letter starts faded and brightens in reading order as the
 * heading travels up the viewport, reversing when scrolling back up.
 *
 * Only use on headings with static text — the text nodes are replaced by
 * per-character spans, so Angular bindings inside the element would break.
 * Gradient-clipped text (background-clip: text) is animated as one unit so
 * the gradient isn't sliced per letter. SSR renders the plain heading; the
 * split happens in the browser only, and is skipped for reduced motion.
 */
@Directive({ selector: '[appScrollTextReveal]' })
export class ScrollTextRevealDirective implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private readonly el = inject(ElementRef<HTMLElement>);

  private units: HTMLElement[] = [];
  private frame: number | null = null;
  private observer: IntersectionObserver | null = null;
  private readonly onScroll = () => this.schedule();

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      const host = this.el.nativeElement;
      this.split(host);
      if (!this.units.length) {
        return;
      }

      // Only listen to scroll while the heading is near the viewport.
      this.zone.runOutsideAngular(() => {
        this.observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              window.addEventListener('scroll', this.onScroll, { passive: true });
              window.addEventListener('resize', this.onScroll, { passive: true });
              this.schedule();
            } else {
              this.detachScroll();
              this.update();
            }
          },
          { rootMargin: '25% 0px 25% 0px' },
        );
        this.observer.observe(host);
      });
      this.update();
    });
  }

  private split(root: HTMLElement): void {
    const walk = (node: Node): void => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
          this.splitText(child as Text);
        } else if (child instanceof HTMLElement) {
          const clip = getComputedStyle(child);
          if (clip.backgroundClip === 'text' || clip.webkitBackgroundClip === 'text') {
            child.classList.add('scroll-char');
            this.units.push(child);
          } else {
            walk(child);
          }
        }
      }
    };
    walk(root);
  }

  /** Words become nowrap wrappers so a line never breaks mid-word. */
  private splitText(text: Text): void {
    const content = text.textContent ?? '';
    if (!content.trim()) {
      return;
    }
    const fragment = document.createDocumentFragment();
    for (const part of content.split(/(\s+)/)) {
      if (!part) {
        continue;
      }
      if (/^\s+$/.test(part)) {
        fragment.append(document.createTextNode(' '));
        continue;
      }
      const word = document.createElement('span');
      word.className = 'scroll-word';
      for (const ch of part) {
        const span = document.createElement('span');
        span.className = 'scroll-char';
        span.textContent = ch;
        word.append(span);
        this.units.push(span);
      }
      fragment.append(word);
    }
    text.replaceWith(fragment);
  }

  private schedule(): void {
    if (this.frame === null) {
      this.frame = requestAnimationFrame(() => {
        this.frame = null;
        this.update();
      });
    }
  }

  private update(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const vh = window.innerHeight;
    // Fill starts when the heading's top reaches 85% of the viewport and
    // completes by the time it reaches 35%.
    const start = vh * 0.85;
    const end = vh * 0.35;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
    const filled = progress * this.units.length;

    this.units.forEach((unit, i) => {
      const t = Math.min(1, Math.max(0, filled - i));
      unit.style.opacity = String(DIM_OPACITY + (1 - DIM_OPACITY) * t);
    });
  }

  private detachScroll(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.observer?.disconnect();
    this.detachScroll();
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
    }
  }
}
