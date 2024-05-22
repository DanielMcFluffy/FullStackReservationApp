import { Component, OnInit } from '@angular/core';
import { Reservation } from '../shared/models/reservation';
import { ReservationService } from '../reservation/reservation.service';
import { Listings } from '../shared/models/listings';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { TokenService } from '../shared/token.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css',
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  isLoading: boolean = true; // Track loading state
  listing!: Listings;
  token = this.tokenService.getToken(); //extract token from local storage

  constructor(
    private reservationService: ReservationService,
    private tokenService: TokenService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.token) {
      this.reservationService
        .getUserReservation()
        .subscribe((userReservations: Reservation[]) => {
          this.reservations = userReservations;
          console.log(this.reservations);
          this.isLoading = false;
        });
    }
  }
  //we add a data property into the dialog config to store the data in that instance of the delete modal dialog--which will then be accessed by the dialogRef type in the delete-popup (child) component
  onDelete(reservation: Reservation) {
    this.dialog.open(DeletePopupComponent, {
      width: '60%',
      data: { id: reservation.id, listing_id: reservation.listing_id },
    });
  }

  calculateDays(checkInDate: Date, checkOutDate: Date): number {
    const diffInMs =
      new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return Math.floor(diffInDays); // or Math.ceil(diffInDays) if you want to round up
  }
}
