import { Injectable } from '@angular/core';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { IOption } from '../models/i-option.interface';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  getOptionsObservable(options: IOption[] | Observable<IOption[]> | undefined): Observable<IOption[]> {
    return options instanceof Observable
      ? options.pipe(map((data) => data || []))
      : new BehaviorSubject<IOption[]>(options || []).asObservable();
  }
}
