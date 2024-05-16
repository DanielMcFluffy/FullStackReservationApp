import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingsService } from '../landing/listings.service';
import { Listings } from '../shared/models/listings';
import { MatDialog } from '@angular/material/dialog';
import { CalendarComponent } from '../features/calendar/calendar.component';
import { Store } from '@ngrx/store';
import { addToCart } from '../features/store/checkout-actions';
import { BookingDates } from '../shared/models/booking-dates';
import { AppState } from '../features/store/app.state';
import { ImageModalComponent } from './image-modal/image-modal.component';

@Component({
  selector: 'app-listing-detail',
  templateUrl: './listing-detail.component.html',
  styleUrl: './listing-detail.component.css',
})
export class ListingDetailComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private listingsService: ListingsService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {}

  listing!: Listings;

  listingId!: number;

  facility_gym?: boolean;
  facility_kitchen?: boolean;
  facility_laundry?: boolean;
  facility_parking?: boolean;
  facility_pool?: boolean;
  facility_security?: boolean;

  //properties to store the calendar days
  /////////////////////////////////////////
  bookingDaysTracked!: number;
  receiveBookingDaysTracked(days: number) {
    this.bookingDaysTracked = days;
  }

  bookingDates!: BookingDates;
  receiveBookingDates(dates: BookingDates) {
    this.bookingDates = dates;
  }
  /////////////////////////////////////////

  //track route params and pass it in getListing to initialize listing property to be used in view
  ngOnInit(): void {
    const routeParams = this.route.snapshot.params['id'];

    this.listingsService.getListing(routeParams).subscribe((listingData) => {
      const {
        id,
        facility_gym,
        facility_kitchen,
        facility_laundry,
        facility_parking,
        facility_pool,
        facility_security,
      } = listingData;

      this.listing = listingData;
      console.log(this.listing);
      this.listingId = id;

      this.facility_gym = facility_gym;
      this.facility_kitchen = facility_kitchen;
      this.facility_laundry = facility_laundry;
      this.facility_parking = facility_parking;
      this.facility_pool = facility_pool;
      this.facility_security = facility_security;
    });
  }
    //TODO: migrate this logic to the calendar component as below bug fix attempt doesn't work.
    // REPLICATE ERROR: Check console log while opening and closing the (mobile-view) calendar component

    ///////////////////////////////////////////////////////////////
    //patch the values with a previously booked value on the page if the user decides to reopen their calendar (values were reset to the pre-defined ones as this component is a new instance)
    //manipulate the 'today'(start) and 'tomorrow'(end) date to the user's previous booking dates to patch the value

    //this is the start date -- set it as the day before the starting booking date (refer the original logic in the calendar component)
    // const { checkInDate, checkOutDate } = this.bookingDates;
    // dialogRef.componentInstance.tomorrow.setDate(checkInDate.getDate() - 1);
    // dialogRef.componentInstance.endDate.setDate(checkOutDate.getDate());
    ///////////////////////////////////////////////////////////////
    //open a new instance of the calendar component (separate from the one in listing-detail)

  openCalendarDialog() {

    const dialogRef = this.dialog.open(CalendarComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.receiveBookingDaysTracked(result);
        //console.log(result);
      }
    });

    dialogRef.componentInstance.sendBookingDaysTracked.subscribe((days) => {
      this.bookingDaysTracked = days;
    });

    dialogRef.componentInstance.sendBookingDates.subscribe((dates) => {
      this.bookingDates = dates;
    });
  }

  //pass information about listing into the image modal component
  openImageModal(listing: Listings) {
    this.dialog.open(ImageModalComponent, {
      width: '50%',
      height: '60%',
      data: {
        image1: listing.image1,
        image2: listing.image2,
        image3: listing.image3,
      },
    });
  }

  //method to dispatch addToCart action to save pre-payment booking info into the store

  //dispatch addToCart action
  onAddToCart() {
    //extract dates received from calendar component
    const { checkInDate, checkOutDate } = this.bookingDates;
    this.store.dispatch(
      addToCart({
        reservation: {
          checkindate: checkInDate,
          checkoutdate: checkOutDate,
          listing_id: this.listingId,
        },
        listing: {
          id: this.listingId,
          title: this.listing!.title,
          price: this.listing!.price,
          description: this.listing!.description,
          image1: this.listing!.image1,
        },
      })
    );
    console.log('dispatched', this.listingId, this.listing!.title);

    //programmatically navigate to the checkout page
    this.router.navigate(['checkout'], { relativeTo: this.route });
  }
}
