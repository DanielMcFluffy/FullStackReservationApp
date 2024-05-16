import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css',
})
export class ImageModalComponent implements OnInit {
  constructor(
    //access the data passed by the listing-detail component
    public dialogRef: MatDialogRef<ImageModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { image1: string; image2: string; image3: string }
  ) {}

  listingImage1!: string;
  listingImage2!: string;
  listingImage3!: string;

  ngOnInit(): void {
    this.listingImage1 = this.data.image1;
    this.listingImage2 = this.data.image2;
    this.listingImage3 = this.data.image3;
  }
}
