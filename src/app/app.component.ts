import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import {
  filter,
  tap,
  switchMap,
  EMPTY,
  takeUntil,
  Observable,
  timer,
  throwError,
  Subject,
  map,
  catchError,
} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, NgxSpinnerComponent],
  template: `
    <router-outlet />
    <ngx-spinner
      bdColor="rgba(51,51,51,0.8)"
      size="medium"
      color="#fff"
      type="ball-spin-clockwise"
      [fullScreen]="true"
      ><p style="color: white">Loading...</p></ngx-spinner
    >
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  readonly #router = inject(Router);
  readonly #translateService = inject(TranslateService);
  readonly #spinnerService = inject(NgxSpinnerService);
  readonly #unSub = new Subject<void>();

  ngOnInit(): void {
    this.listenToRouteEvents();
    this.setUpLanguage();
  }

  ngOnDestroy(): void {
    this.#unSub.next();
    this.#unSub.complete();
  }

  private setUpLanguage(): void {
    this.#translateService.addLangs(['en', 'al']);
    const lang =
      localStorage.getItem('language') ??
      this.#translateService.getBrowserLang();
    const selectedLang = lang?.match(/al|en/) ? lang : 'en';
    localStorage.setItem('language', selectedLang);
    this.#translateService.setDefaultLang(selectedLang);
    this.#translateService.use(selectedLang);
  }

  private listenToRouteEvents(): void {
    this.#router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationError
        ),
        tap((event) => this.handleSpinner(event)),
        switchMap((event) =>
          event instanceof NavigationEnd
            ? this.handleNavigationEnd()
            : event instanceof NavigationError
            ? this.handleNavigationError(event)
            : EMPTY
        ),
        catchError((error) => {
          console.error('Global Navigation Error:', error);
          return EMPTY;
        }),
        takeUntil(this.#unSub)
      )
      .subscribe();
  }

  private handleSpinner(event: any): void {
    if (event instanceof NavigationStart) {
      this.#spinnerService.show();
    }
  }

  private handleNavigationEnd(): Observable<void> {
    return timer(600).pipe(
      tap(() => this.#spinnerService.hide()),
      map(() => undefined)
    );
  }

  private handleNavigationError(event: NavigationError): Observable<void> {
    if (event.error instanceof Error) {
      console.error('Navigation error occurred:', event.error);
      if (event.error.name === 'ChunkLoadError') {
        console.warn('ChunkLoadError occurred. Reloading...');
        window.location.reload();
        return EMPTY;
      } else {
        return throwError(() => new Error('Unhandled navigation error'));
      }
    }
    console.error('Unknown navigation error:', event.error);
    return throwError(() => new Error('Unknown navigation error'));
  }
}
