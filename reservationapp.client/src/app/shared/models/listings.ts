export interface Listings {
  
    id: string,
    title: string,
    price: number,
    description: "A cozy place to live in",
    isbooked: boolean,
    image1: string,
    image2: string | null,
    image3: string | null,
    facility_pool: boolean,
    facility_gym: boolean,
    facility_kitchen: boolean,
    facility_laundry: boolean,
    facility_security: boolean,
    facility_parking: boolean,
    distance: number,
    guests: number,
    bedroom: number,
    beds: number,
    bathroom: number
}
