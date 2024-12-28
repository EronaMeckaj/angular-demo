import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../core/services/auth.service';
import { GenericFormComponent } from "../shared/components/generic-form/generic-form.component";
import { ControlType } from '../shared/enums/control-type.enum';
import { IFormField } from '../shared/models/i-form-field.interface';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    GenericFormComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly #authService = inject(AuthService)

  filtersConfig: IFormField[] = [
    {
      name: 'date1',
      controlType: ControlType.datePicker,
      label: 'Enter a date',
      hint: 'MM/DD/YYYY',
      containerClass: 'col-3',
    },
    {
      name: 'date',
      controlType: ControlType.dateRange,
      label: 'Enter a date range',
      startDatePlaceholder: 'Start date',
      endDatePlaceholder: 'End date',
      hint: 'MM/DD/YYYY – MM/DD/YYYY',
      containerClass: 'col-3',
      startControlName: 'startDate',
      endControlName: 'endDate',
    },
    {
      name: 'datasetName',
      controlType: ControlType.text,
      enableSuffixIcon: true,
      suffixIcon: "search",
      label: 'Name',
      containerClass: 'col-3',
      appearance: 'fill',
    },
    {
      name: 'databaseId',
      label: 'Database',
      containerClass: 'col-md-3',
      controlType: ControlType.select,
      multiselect: true,
      selectAll: true,
      options: of([
        { value: 'steak-0', key: 'Steak' },
        { value: 'pizza-1', key: 'Pizza' },
        { value: 'tacos-2', key: 'Tacos' },
      ]),
    },
    {
      name: 'chartType',
      label: 'Favorite Drink',
      containerClass: 'col-3',
      controlType: ControlType.select,
      multiselect: false,
      disabled: true,
      options: of([
        { value: 'water-0', key: 'Water' },
        { value: 'juice-1', key: 'Juice' },
        { value: 'soda-2', key: 'Soda' },
      ]),
    },
  ];

  editData = {
    date1: new Date('2023-12-01'),
    date: { startDate: new Date('2023-12-01'), endDate: new Date('2023-12-10') },
    datasetName: 'Dataset Example',
    databaseId: ['steak-0', 'pizza-1', 'tacos-2'],
    chartType: 'juice-1',
  };

  logout(): void {
    this.#authService.logout()
  }
}
