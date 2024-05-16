import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Listings } from '../shared/models/listings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListingsService {
  constructor(private http: HttpClient) {}

  apiUrl =
    'https://localhost:7066';

  getListings(): Observable<Listings[]> {
    return this.http.get<Listings[]>(this.apiUrl + '/listings');
  }

  getListing(id: string): Observable<Listings> {
    return this.http.get<Listings>(this.apiUrl + '/listings/' + id);
  }
}
