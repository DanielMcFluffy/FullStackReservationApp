import { Component, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ReservationService } from '../../reservation/reservation.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrl: './delete-popup.component.css',
})
export class DeletePopupComponent {
  constructor(
    private router: Router,
    private reservationsService: ReservationService,
    public dialogRef: MatDialogRef<DeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string; listing_id: string }
  ) {}

  //properties needed to pass into the onSubmit method which will trigger the deletereservation method from reservationService
  @ViewChild('cancelInput') form!: NgForm;
  reasonText!: string;

  onSubmit(formValue: any) {
    let reason: string;

    // console.log(formValue.otherReasonText);
    formValue.cancelReason !== 'Other reasons'
      ? (reason = formValue.cancelReason)
      : (reason = formValue.otherReasonText);
    console.log(reason);
    console.log(this.data.listing_id);
    this.reservationsService
      .deleteReservation(this.data.id, this.data.listing_id, reason)
      .subscribe(() => {
        console.log('deleted');
        this.dialogRef.close();
        // Navigate away, then back (ideally, we call getUserReservation method from reservationService to trigger re-fetch of data)
        this.router
          .navigateByUrl('/landing', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/list']);
          });
      });
  }
}
