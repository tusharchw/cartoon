import { Component, ElementRef, PLATFORM_ID, ViewChild, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SmoothScrollService } from '../../core/smooth-scroll.service';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';

interface Brand {
  name: string;
  tracking: string;
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  imports: [RevealOnScrollDirective],
})
export class Hero {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly smoothScroll = inject(SmoothScrollService);

  @ViewChild('heroVideo') private readonly heroVideo?: ElementRef<HTMLVideoElement>;

  /** Drives the crossfade from the gradient placeholder to the video, so the
   * viewer never sees a blank frame while landing.mp4 downloads. */
  protected readonly videoReady = signal(false);

  protected readonly brands: Brand[] = [
    { name: 'FERRARI', tracking: 'tracking-widest' },
    { name: 'LAMBORGHINI', tracking: 'tracking-[0.25em]' },
    { name: 'PORSCHE', tracking: 'tracking-[0.3em]' },
    { name: 'ROLLS-ROYCE', tracking: 'tracking-widest' },
    { name: 'McLAREN', tracking: 'tracking-widest' },
    { name: 'BENTLEY', tracking: 'tracking-wider' },
    { name: 'ASTON MARTIN', tracking: 'tracking-[0.2em]' },
  ];

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      // Some mobile browsers ignore the autoplay attribute on first paint;
      // nudge playback explicitly once the element exists (muted autoplay
      // is universally allowed, so this call is safe cross-browser).
      const video = this.heroVideo?.nativeElement;
      video?.play().catch(() => {
        /* Autoplay blocked — the poster/gradient fallback stays visible. */
      });
    });
  }

  onVideoReady(): void {
    this.videoReady.set(true);
  }

  scrollToContact(): void {
    this.smoothScroll.scrollTo('#contact');
  }
}
