import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly #translateService = inject(TranslateService);

  ngOnInit(): void {
    this.setUpLanguage();
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
}
