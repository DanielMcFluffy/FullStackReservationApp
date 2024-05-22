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
  private apiUrl = 'https://localhost:7066';

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
    return this.http.get<Reservation>(this.apiUrl + '/reservations/' + id);
  }

  //get reservations based on username provided from token

  getUserReservation(): Observable<Reservation[]> {
    //endpoint expects a json request object with key 'token'

    return this.http.get<Reservation[]>(this.apiUrl + '/reservations/user');
  }

  addReservation(reservation: Reservation): Observable<void> {
    return this.http.post<void>(this.apiUrl + '/reservations', reservation);
  }

  deleteReservation(
    id: string | undefined,
    listing_id: string,
    reasoncancel: string
  ): Observable<void> {
    return this.http.put<void>(
      this.apiUrl + '/reservations/' + id + '/delete',
      {
        listing_id,
        reasoncancel,
      }
    );
  }

  updateReservation(
    id: string,
    updatedReservation: Reservation
  ): Observable<void> {
    return this.http.put<void>(
      this.apiUrl + '/reservations/' + id,
      updatedReservation
    );
  }
}
