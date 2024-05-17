import { Component, OnDestroy, OnInit } from '@angular/core';
import { Reservation } from '../shared/models/reservation';
import { ReservationService } from '../reservation/reservation.service';
import { AccountsService } from '../shared/accounts.service';
import { Listings } from '../shared/models/listings';
import { ListingsService } from '../landing/listings.service';
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
  token = this.accountsService.getToken(); //extract token from local storage

  constructor(
    private reservationService: ReservationService,
    private accountsService: AccountsService,
    private listingsService: ListingsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    ////////////////////////////////////////////
    //FOR DEVELOPMENT PURPOSES
    // if (this.token) {
      // this.reservationService
      //   .getUserReservation(this.token)
      //   .subscribe((userReservations: Reservation[]) => {
      //     this.reservations = userReservations;
      //     console.log(this.reservations);
      //     this.isLoading = false;
      //   });
    // }

    this.reservationService.getReservations()
      .subscribe(reservations => {
        this.reservations = reservations;
        console.log(this.reservations);
        this.isLoading = false;
      })
    ////////////////////////////////////////////

  }

  ngOnDestroy(): void {}

  // onGetListing$(listingId: number): Observable<Listings> {
  //   console.log(listingId);
  //   return this.listingsService.getListing(listingId);
  // }

  //for debugging
  // checkGetListing$(listingId: string) {
  //   console.log(listingId);
  //   this.listingsService
  //     .getListing(listingId)
  //     .subscribe((data) => console.log(typeof data));
  // }

  //we add a data property into the dialog config to store the data in that instance of the delete modal dialog--which will then be accessed by the dialogRef type in the delete-popup (child) component
  onDelete(reservation: Reservation) {
    this.dialog.open(DeletePopupComponent, {
      width: '60%',
      data: { id: reservation.id, listing_id: reservation.listing_id },
    });

    // console.log(reservation.listing_id);
  }
}
