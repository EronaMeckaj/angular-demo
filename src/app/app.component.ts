import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  readonly #translateService = inject(TranslateService);

  ngOnInit(): void {
    this.setUpLanguage()
  }

  setUpLanguage() {
    this.#translateService.addLangs(['en', 'sq']);
    const lang = localStorage.getItem('language') ?? this.#translateService.getBrowserLang();
    const selectedLang = lang?.match(/sq|en/) ? lang : 'en';
    localStorage.setItem('language', selectedLang);
    this.#translateService.setDefaultLang(selectedLang);
    this.#translateService.use(selectedLang);
  }
}
