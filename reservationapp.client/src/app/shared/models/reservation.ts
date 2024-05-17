export interface Reservation {
  id?: string;
  listing_id: string;
  guestname?: string;
  guestemail?: string;
  checkindate: Date;
  checkoutdate: Date;
  userId?: string;
  reasonCancel?: string;
  token?: string | number;
  listingDetails?: any; //this should contain details about listing such as img url, etc
}
