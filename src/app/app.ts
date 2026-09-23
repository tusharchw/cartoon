import { Component, DestroyRef, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SmoothScrollService } from './core/smooth-scroll.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  constructor(smoothScroll: SmoothScrollService) {
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      smoothScroll.init();

      // Route changes: jump to top for new pages, glide to #fragment targets.
      // Registered after first render so the browser's own reload scroll
      // restoration on the initial page is left alone.
      const sub = router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => {
          const fragment = router.parseUrl(e.urlAfterRedirects).fragment;
          if (fragment) {
            setTimeout(() => smoothScroll.scrollTo(`#${fragment}`), 60);
          } else {
            smoothScroll.resetToTop();
          }
        });
      destroyRef.onDestroy(() => sub.unsubscribe());

      const initialFragment = router.parseUrl(router.url).fragment;
      if (initialFragment) {
        setTimeout(() => smoothScroll.scrollTo(`#${initialFragment}`), 300);
      }
    });
  }
}
