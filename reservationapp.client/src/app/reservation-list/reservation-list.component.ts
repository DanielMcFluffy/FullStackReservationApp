import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Reservation } from '../shared/models/reservation';
import { ReservationService } from '../reservation/reservation.service';
import { AccountsService } from '../shared/accounts.service';
import { Listings } from '../shared/models/listings';
import { ListingsService } from '../landing/listings.service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css',
})
export class ReservationListComponent implements OnInit, OnDestroy {
  reservations: Reservation[] = [];
  isLoading: boolean = true; // Track loading state
  listing!: Listings;
  token = this.accountsService.getToken();

  constructor(
    private reservationService: ReservationService,
    private accountsService: AccountsService,
    private listingsService: ListingsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.token) {
      this.reservationService
        .getUserReservation(this.token)
        .subscribe((userReservations: Reservation[]) => {
          this.reservations = userReservations;
          console.log(this.reservations);
          this.isLoading = false;
        });
    }
  }

  ngOnDestroy(): void {}

  // onGetListing$(listingId: number): Observable<Listings> {
  //   console.log(listingId);
  //   return this.listingsService.getListing(listingId);
  // }

  checkGetListing$(listingId: number) {
    console.log(listingId);
    this.listingsService
      .getListing(listingId)
      .subscribe((data) => console.log(typeof data));
  }

  //we add a data property into the dialog config to store the data in that instance of the delete modal dialog--which will then be accessed by the dialogRef type in the delete-popup (child) component
  onDelete(reservation: Reservation) {
    this.dialog.open(DeletePopupComponent, {
      width: '60%',
      data: { id: reservation.id, listing_id: reservation.listing_id },
    });

    // console.log(reservation.listing_id);
  }
}
