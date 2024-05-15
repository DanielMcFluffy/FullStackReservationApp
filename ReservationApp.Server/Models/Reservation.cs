using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ReservationApp.Server.Models
{
    public class Reservation
    {
        [BsonId] //this defines the Id -- it will make it a primary key
        [BsonRepresentation(BsonType.ObjectId)] //converts the parameter type from ObjectId to string

        // properties with * will need be passed their values somehow from the front-end (state management?)
        public string id { get; set; } = null!;
        public int listing_id { get; set; } //* will receive from the listings collection
        public string reservationname { get; set; } = null!;
        public string guestemail { get; set; } = null!; //* will receive from the users collection
        public int? user_id { get; set; } //* will receive from the users collection
        public string? user_uid { get; set; } //* will receive from the users collection
        public string checkindate { get; set; } = null!;
        public string checkoutdate { get; set; } = null!;
        public bool showreservation { get; set; } = true;
        public string? reasoncancel { get; set; }

    }
}
