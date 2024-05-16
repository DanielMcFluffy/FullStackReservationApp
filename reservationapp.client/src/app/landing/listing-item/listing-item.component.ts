import { Component, Input } from '@angular/core';
import { Listings } from '../../shared/models/listings';

@Component({
  selector: 'app-listing-item',
  templateUrl: './listing-item.component.html',
  styleUrl: './listing-item.component.css',
})
export class ListingItemComponent {
  constructor() {}

  @Input() listing!: Listings;
}
