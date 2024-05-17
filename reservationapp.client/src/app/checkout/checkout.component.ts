import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Reservation } from '../shared/models/reservation';
import { editCart, payloadListing } from '../features/store/checkout-actions';
import { Store } from '@ngrx/store';
import { AppState } from '../features/store/app.state';
import { MatDialog } from '@angular/material/dialog';
import { CalendarComponent } from '../features/calendar/calendar.component';
import { BookingDates } from '../shared/models/booking-dates';
import { Subscription } from 'rxjs';
import { NgModel } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { AccountsService } from '../shared/accounts.service';
import { ReservationService } from '../reservation/reservation.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  constructor(
    private location: Location,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private accountsService: AccountsService,
    private reservationService: ReservationService,
    private router: Router
  ) {}
  // checkoutDetails$!: Observable<CheckoutState>;
  reservationDetails!: Reservation | null;
  listingDetails!: payloadListing | null;

  //checkout status
  status!: string;
/////////////////////////////////////////////////////////////
    //FOR DEVELOPMENT PURPOSES

  //username(email) and id/uid from token
  token!: string | null;
  username!: string;
  userId!: string | number;
/////////////////////////////////////////////////////////////

  //days of reservation
  bookedDays!: number;

  private bookingDaysSubscription?: Subscription;
  private bookingDatesSubscription?: Subscription;

  //new dates from edits
  editedCheckInDate?: Date;
  editedCheckOutDate?: Date;
  editedBookedDays?: number;

  //listen to reservation name input form
  @ViewChild('reservationName') reservationName!: NgModel;
  @ViewChild('reservationEmail') reservationEmail!: NgModel;

  //error message for the reservation name input
  errorMessage = false;
  //error message for users not logged in
  errorLoginMessage = false;
  //error message for booked listings
  errorBookingMessage = false;

  ngOnInit(): void {
    let checkInDate, checkOutDate;

    //assign the states to their respective properties
    this.store.select('checkout').subscribe((state) => {
      this.reservationDetails = state.addedReservation;
      this.listingDetails = state.listingData;
      this.status = state.status;

      //date calculation
      checkInDate = this.reservationDetails!.checkindate;
      checkOutDate = this.reservationDetails!.checkoutdate;

      this.bookedDays = Math.ceil(
        (checkOutDate.valueOf() - checkInDate.valueOf()) / (1000 * 60 * 60 * 24)
      );
    });
/////////////////////////////////////////////////////////////
    //FOR DEVELOPMENT PURPOSES

    //extract out user info from the token
    // this.token = this.accountsService.getToken();
    // if (this.token) {
    //   const { username, id } = jwtDecode<{
    //     username: string;
    //     id: string | number;
    //   }>(this.token);
    //   this.username = username;
    //   this.userId = id;
    // }
    /////////////////////////////////////////////////////////////
  }

  ngOnDestroy(): void {
    this.bookingDaysSubscription?.unsubscribe();
    this.bookingDatesSubscription?.unsubscribe();
  }

  onAddReservation() {
    console.log(this.reservationDetails, this.listingDetails, this.status);
    console.log(this.reservationName.value);
    console.log(this.reservationEmail.value);
/////////////////////////////////////////////////////////////
    //FOR DEVELOPMENT PURPOSES
    // if (this.reservationDetails && this.token && this.reservationName.dirty) {
      
      if (this.reservationDetails && this.reservationName.dirty) {
      this.reservationService
        .addReservation({
          ...this.reservationDetails,
          guestname: this.reservationName.value,
          guestemail: this.reservationEmail.value,
          // userId: this.userId,
          userId: 'test', 
          // token: this.token,
          listing_id: this.listingDetails!.id,
          listingDetails: this.listingDetails
        })
        .subscribe(
          () => this.router.navigate(['/list']),
          (error) => {
            console.log(error.error.message);
            if (
              error.error.message === 'This listing has already been booked.'
            ) {
              this.errorBookingMessage = true;
            }
          }
        );
    } else if (this.token && !this.reservationName.value) {
      this.errorMessage = true;
    } else if (!this.token) {
      this.errorLoginMessage = true;
    }
  }

/////////////////////////////////////////////////////////////


  editDate() {
    const dialogRef = this.dialog.open(CalendarComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog was closed');
    });

    // Listen for the booking days
    dialogRef.componentInstance.sendBookingDaysTracked.subscribe(
      (days: number) => {
        this.editedBookedDays = days;
      }
    );

    // Listen for the booking dates
    dialogRef.componentInstance.sendBookingDates.subscribe(
      (dates: BookingDates) => {
        //extract out the new edited dates
        if (dates) {
          const { checkInDate, checkOutDate } = dates;
          this.store.dispatch(
            editCart({
              newCheckInDate: checkInDate,
              newCheckOutDate: checkOutDate,
            })
          );
        }
      }
    );
  }

  back() {
    this.location.back();
  }
}
