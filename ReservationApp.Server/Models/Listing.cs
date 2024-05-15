using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ReservationApp.Server.Models
{
    public class Listing
    {
        [BsonId] //this defines the Id -- it will make it a primary key
        [BsonRepresentation(BsonType.ObjectId)] //converts the parameter type from ObjectId to string

        // properties with * will need be passed their values somehow from the front-end (state management?)
        public string id { get; set; } = null!; //* passed to the reservation collection
        public string? title { get; set; } = null!;
        public long price { get; set; }
        public string description { get; set; } = null!;
        public bool isbooked { get; set; } = false;
        public string image1 { get; set; } = null!;
        public string image2 { get; set; } = null!;
        public string image3 { get; set; } = null!;
        public long distance { get; set; }
        public long guests { get; set; }
        public long bedroom { get; set; }
        public long beds { get; set; }
        public long bathroom { get; set; }
        public bool facility_pool { get; set; } = false;
        public bool facility_gym { get; set; } = false;
        public bool facility_kitchen { get; set; } = false;
        public bool facility_laundry { get; set; } = false;
        public bool facility_parking { get; set; } = false;
        public bool facility_security { get; set; } = false;




    }
}
