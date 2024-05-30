using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Database.DBModels
{
    public class payloadListing //this only carries the necessary information about the listing
    {
        public string id { get; set; } = null!;
        public string title { get; set; } = null!;
        public long price { get; set; }
        public string description { get; set; } = null!;
        public string image1 { get; set; } = null!;
    }
    [BsonIgnoreExtraElements] //add this if you're using mongodb atlas to store data -- on atlas db, we have an additional objectid field so this attribute ignores that and maps our models accurately
    public class Reservation
    {
        [BsonId] //this defines the Id -- it will make it a primary key
        [BsonRepresentation(BsonType.ObjectId)] //converts the parameter type from ObjectId to string

        // properties with * will need be passed their values somehow from the front-end (state management?)
        public string? id { get; set; } = null!;
        public string listing_id { get; set; } = null!; //* will receive from the listings collection
        public string guestname { get; set; } = null!;
        public string guestemail { get; set; } = null!; //* will receive from the users collection
        public string? user_id { get; set; } = null!; //* will receive from the users collection
        public string checkindate { get; set; } = null!;
        public string checkoutdate { get; set; } = null!;
        public bool showreservation { get; set; } = true;
        public string? reasoncancel { get; set; }
        public payloadListing? listingDetails { get; set; }
        public DateTime? datecreated { get; set; } = DateTime.UtcNow;

    }
}
