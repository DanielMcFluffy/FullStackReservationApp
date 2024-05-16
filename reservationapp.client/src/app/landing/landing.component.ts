import { Component, HostListener, OnInit } from '@angular/core';
import { Listings } from '../shared/models/listings';
import { ListingsService } from './listings.service';
import { SearchFilterService } from '../header/search-bar/search-filter.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  constructor(
    private listingsService: ListingsService,
    private searchFilterService: SearchFilterService
  ) {}
  //property to track screen width to use [ngclass] on the element
  screenWidthBelow1200!: boolean;
  screenWidthBelow1000!: boolean;
  screenWidthBelow768!: boolean;
  listings!: Listings[];
  filteredListings!: Listings[];

  //method to track screenWidth
  private checkScreenWidth(width: number) {
    this.screenWidthBelow1200 = width < 1200 && width > 1000;
    this.screenWidthBelow1000 = width < 1000 && width > 768;
    this.screenWidthBelow768 = width < 768;
  }

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.checkScreenWidth(event.target.innerWidth);
  }

  ngOnInit(): void {
    //initialize the listings array
    this.listingsService.getListings().subscribe((listingsData) => {
      this.listings = listingsData;
      this.filteredListings = listingsData;
    });

    this.searchFilterService.search.subscribe((term) => {
      this.filterListings(term);
    });

    this.checkScreenWidth(window.innerWidth);
  }

  filterListings(term: string): void {
    if (term) {
      this.filteredListings = this.listings.filter((listing) => {
        return (
          listing.title.toLowerCase().includes(term.toLowerCase()) ||
          listing.description.toLowerCase().includes(term.toLowerCase())
        );
      });
    } else {
      //show all listings if search box is empty
      this.filteredListings = this.listings;
    }
  }
}
