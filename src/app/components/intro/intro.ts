import { Component, DestroyRef, ElementRef, afterNextRender, inject, output, signal, viewChild } from '@angular/core';
import type { IntroScene } from './intro-scene';

interface Chapter {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
}

type Phase = 'loading' | 'ready' | 'protecting' | 'leaving';

/** Progress at which each chapter takes over (one full car turn spans all four). */
const CHAPTER_STARTS = [0, 0.22, 0.5, 0.78];
const WHEEL_SENSITIVITY = 0.00055;
const TOUCH_SENSITIVITY = 0.0028;
const DRAG_SENSITIVITY = 0.008;

/**
 * Full-screen 3D landing intro shown over the home page on first visit.
 * Scrolling turns the car and steps through the chapters; the CTA plays the
 * protection-film sequence and then lifts the curtain on the hero.
 */
@Component({
  selector: 'app-intro',
  templateUrl: './intro.html',
})
export class Intro {
  private readonly destroyRef = inject(DestroyRef);

  readonly done = output<void>();

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly yawReadout = viewChild<ElementRef<HTMLElement>>('yawReadout');
  private readonly cta = viewChild<ElementRef<HTMLElement>>('cta');

  protected readonly phase = signal<Phase>('loading');
  protected readonly loadPct = signal(0);
  protected readonly chapter = signal(0);
  protected readonly armorPct = signal(0);
  protected readonly webglFailed = signal(false);

  protected readonly chapters: Chapter[] = [
    {
      index: '01',
      eyebrow: 'Rosso Corsa // 458 Italia',
      title: 'Born to Be Seen.',
      body: 'A finish this rare deserves more than wax and hope. Scroll to walk around it.',
    },
    {
      index: '02',
      eyebrow: 'Self-Healing TPU',
      title: 'Invisible Armor.',
      body: 'Rock chips, swirl marks and scratches meet a film that heals itself with heat.',
    },
    {
      index: '03',
      eyebrow: 'Optically Clear',
      title: 'Gloss, Amplified.',
      body: 'Deeper than factory shine, in ultra-gloss or stealth matte, edge to edge.',
    },
    {
      index: '04',
      eyebrow: 'Your Move',
      title: 'Protect It.',
      body: 'Shield. Shine. Sustain. One click to see what CARTRON does for your car.',
    },
  ];

  /** Titles pre-split into words of letters (with a running stagger index) for the reveal. */
  protected readonly titleWords = this.chapters.map((c) => {
    let d = 0;
    return c.title.split(' ').map((word) => [...word].map((ch) => ({ c: ch, d: d++ })));
  });

  private scene?: IntroScene;
  private target = 0;
  private reducedMotion = false;
  private cursor = { x: 0, y: 0, sx: 0, sy: 0 };

  constructor() {
    afterNextRender(() => this.boot());
    this.destroyRef.onDestroy(() => this.scene?.dispose());
  }

  protected chapterActive(i: number): boolean {
    return this.chapter() === i;
  }

  protected goToChapter(i: number): void {
    this.setTarget(CHAPTER_STARTS[i] + (i === 0 ? 0 : 0.04));
  }

  protected onCtaHover(on: boolean): void {
    this.scene?.setHover(on);
    if (!on) {
      this.cta()?.nativeElement.style.setProperty('--mx', '0px');
      this.cta()?.nativeElement.style.setProperty('--my', '0px');
    }
  }

  /** Magnetic pull: the button leans toward the cursor. */
  protected onCtaMove(e: PointerEvent): void {
    const el = this.cta()?.nativeElement;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px`);
    el.style.setProperty('--my', `${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`);
  }

  protected async protect(): Promise<void> {
    if (this.phase() === 'protecting' || this.phase() === 'leaving') return;
    this.phase.set('protecting');
    this.scene?.setHover(false);
    if (this.scene && !this.reducedMotion) {
      await this.scene.protect((pct) => this.armorPct.set(pct));
    } else {
      this.armorPct.set(100);
      await wait(500);
    }
    await wait(350);
    this.leave();
  }

  protected skip(): void {
    if (this.phase() !== 'leaving') this.leave();
  }

  private leave(): void {
    this.phase.set('leaving');
    setTimeout(() => this.done.emit(), this.reducedMotion ? 200 : 1150);
  }

  private async boot(): Promise<void> {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.bindInput();

    try {
      const { IntroScene } = await import('./intro-scene');
      if (this.phase() === 'leaving') return;
      this.scene = new IntroScene(
        this.stage().nativeElement,
        {
          onLoadProgress: (pct) => this.loadPct.set(Math.round(pct)),
          onReady: () => setTimeout(() => this.phase.set('ready'), 250),
          onError: () => this.fallback(),
          onFrame: (p, yaw) => this.paint(p, yaw),
        },
        this.reducedMotion,
      );
      this.scene.setTarget(this.target);
    } catch {
      this.fallback();
    }
  }

  /** No WebGL / model failed: keep the page usable with a static backdrop. */
  private fallback(): void {
    this.scene?.dispose();
    this.scene = undefined;
    this.webglFailed.set(true);
    this.loadPct.set(100);
    this.phase.set('ready');
    const loop = () => {
      if (this.phase() === 'leaving') return;
      this.paint(this.target, this.target * 360);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private setTarget(p: number): void {
    this.target = Math.min(1, Math.max(0, p));
    this.scene?.setTarget(this.target);
  }

  /** Per-frame DOM writes go straight to CSS variables, not through change detection. */
  private paint(progress: number, yawDeg: number): void {
    const root = this.root().nativeElement;
    root.style.setProperty('--p', progress.toFixed(4));

    const deg = ((Math.round(yawDeg) % 360) + 360) % 360;
    const readout = this.yawReadout()?.nativeElement;
    if (readout) readout.textContent = String(deg).padStart(3, '0');

    let idx = 0;
    for (let i = 0; i < CHAPTER_STARTS.length; i++) {
      if (progress >= CHAPTER_STARTS[i] - 0.001) idx = i;
    }
    this.chapter.set(idx);

    const c = this.cursor;
    c.sx += (c.x - c.sx) * 0.12;
    c.sy += (c.y - c.sy) * 0.12;
    root.style.setProperty('--cx', `${c.sx.toFixed(1)}px`);
    root.style.setProperty('--cy', `${c.sy.toFixed(1)}px`);
  }

  private bindInput(): void {
    const root = this.root().nativeElement;
    const interactive = () => this.phase() === 'ready' || this.phase() === 'loading';
    this.cursor.x = this.cursor.sx = window.innerWidth / 2;
    this.cursor.y = this.cursor.sy = window.innerHeight / 2;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!interactive()) return;
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      // Clamp single huge flicks so one swipe can't skip the whole story.
      const delta = Math.max(-140, Math.min(140, e.deltaY * scale));
      this.setTarget(this.target + delta * WHEEL_SENSITIVITY);
    };

    let touch: { x: number; y: number } | null = null;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touch = { x: t.clientX, y: t.clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touch || !interactive()) return;
      if ((e.target as HTMLElement).closest('button, a')) return;
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - touch.x;
      const dy = t.clientY - touch.y;
      if (Math.abs(dy) >= Math.abs(dx)) {
        this.setTarget(this.target - dy * TOUCH_SENSITIVITY);
      } else {
        this.scene?.addDrag(dx * DRAG_SENSITIVITY);
      }
      touch = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = () => (touch = null);

    let dragX: number | null = null;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if ((e.target as HTMLElement).closest('button, a')) return;
      dragX = e.clientX;
      root.classList.add('is-dragging');
    };
    const onPointerMove = (e: PointerEvent) => {
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;
      this.scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      if (dragX !== null && interactive()) {
        this.scene?.addDrag((e.clientX - dragX) * DRAG_SENSITIVITY);
        dragX = e.clientX;
      }
    };
    const onPointerUp = () => {
      dragX = null;
      root.classList.remove('is-dragging');
    };

    const onKey = (e: KeyboardEvent) => {
      if (!interactive()) return;
      const step = 0.12;
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          this.setTarget(this.target + step);
          break;
        case ' ':
          if ((e.target as HTMLElement).closest('button, a')) return;
          this.setTarget(this.target + step);
          break;
        case 'ArrowUp':
        case 'PageUp':
          this.setTarget(this.target - step);
          break;
        case 'Home':
          this.setTarget(0);
          break;
        case 'End':
          this.setTarget(1);
          break;
        case 'Escape':
          this.skip();
          return;
        default:
          return;
      }
      e.preventDefault();
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    root.addEventListener('touchstart', onTouchStart, { passive: true });
    root.addEventListener('touchmove', onTouchMove, { passive: false });
    root.addEventListener('touchend', onTouchEnd, { passive: true });
    root.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKey);

    this.destroyRef.onDestroy(() => {
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('touchstart', onTouchStart);
      root.removeEventListener('touchmove', onTouchMove);
      root.removeEventListener('touchend', onTouchEnd);
      root.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKey);
    });
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
