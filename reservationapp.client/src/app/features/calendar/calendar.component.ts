import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { Subject, Subscription } from 'rxjs';
import { BookingDates } from '../../shared/models/booking-dates';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class CalendarComponent implements OnInit, OnDestroy {
  constructor() {}
  //properties for the calendar component
  today: Date = new Date();
  tomorrow: Date = new Date();
  endDate: Date = new Date();
  bookingDate!: FormGroup;
  dateDifference?: number;
  bookingDays = new Subject<number>();
  subscription!: Subscription;

  //properties that will store the values to be emitted to the listing-detail (parent) component

  //creating 2 output properties because I want to isolate date calculations only in this component
  @Output() sendBookingDaysTracked = new EventEmitter<number>();
  @Output() sendBookingDates = new EventEmitter<BookingDates>();

  ngOnInit(): void {
    this.tomorrow.setDate(this.today.getDate() + 1);
    this.endDate.setDate(this.tomorrow.getDate() + 4);

    this.bookingDate = new FormGroup({
      start: new FormControl(this.tomorrow),
      end: new FormControl(this.endDate),
    });

    //initial emit
    this.updateBookingDays();

    //emit on change
    this.subscription = this.bookingDate.valueChanges.subscribe(() => {
      this.updateBookingDays();
    });
  }

  updateBookingDays() {
    const { end, start } = this.bookingDate.value;
    const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    this.sendBookingDaysTracked.emit(daysDifference);
    this.sendBookingDates.emit({ checkInDate: start, checkOutDate: end });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
