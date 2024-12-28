import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class TextComponent {
  @Input() textConfig: any;
  @Output() valueChange = new EventEmitter<any>();
  @Input() control: FormControl = new FormControl('');

  ngOnInit(): void {
    this.control.valueChanges.subscribe(value => {
      this.valueChange.emit({
        name: this.textConfig?.name,
        value: value,
      });
    });
  }

  clearSearch(): void {
    this.control.setValue('');
  }
}
