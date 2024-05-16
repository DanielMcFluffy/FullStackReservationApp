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
    'https://743ef722-2574-4ca1-88f3-63238a52902c-00-24dm5qezjjxqk.pike.replit.dev';

  getListings(): Observable<Listings[]> {
    return this.http.get<Listings[]>(this.apiUrl + '/listings');
  }

  getListing(id: number): Observable<Listings> {
    return this.http.get<Listings>(this.apiUrl + '/listing/' + id);
  }
}
