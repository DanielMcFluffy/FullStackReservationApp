import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchFilterService {
  constructor() {}

  private searchSubject = new BehaviorSubject<string>('');
  public search = this.searchSubject.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter((term) => term.length === 0 || term.length > 2)
  );

  setSearchTerm(term: string) {
    this.searchSubject.next(term);
  }
}
