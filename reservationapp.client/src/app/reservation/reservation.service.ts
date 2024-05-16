import { Injectable } from '@angular/core';
import { Reservation } from '../shared/models/reservation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private reservations: Reservation[] = [];
  //specify api url
  private apiUrl =
    'https://743ef722-2574-4ca1-88f3-63238a52902c-00-24dm5qezjjxqk.pike.replit.dev';

  //inject the http entity to be used in methods
  constructor(private http: HttpClient) {}

  //CRUD

  //get all reservations
  getReservations(): Observable<Reservation[]> {
    //send the http request
    //syntax
    //this.http.(http method)<type of data to receive>(apiUrl endpoint)
    return this.http.get<Reservation[]>(this.apiUrl + '/reservations');
  }

  //get singular reservation
  getReservation(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(this.apiUrl + '/reservation/' + id);
  }

  //get reservations based on username provided from token

  getUserReservation(token: string | null): Observable<Reservation[]> {
    //endpoint expects a json request object with key 'token'

    return this.http.post<Reservation[]>(this.apiUrl + '/reservation/user', {
      token,
    });
  }

  addReservation(reservation: Reservation): Observable<void> {
    return this.http.post<void>(this.apiUrl + '/reservation', reservation);
  }

  deleteReservation(
    id: number | undefined,
    listing_id: number,
    reasoncancel: string
  ): Observable<void> {
    return this.http.put<void>(this.apiUrl + '/reservation/' + id + '/delete', {
      listing_id,
      reasoncancel,
    });
  }

  updateReservation(
    id: string,
    updatedReservation: Reservation
  ): Observable<void> {
    return this.http.put<void>(
      this.apiUrl + '/reservation/' + id,
      updatedReservation
    );
  }
}
