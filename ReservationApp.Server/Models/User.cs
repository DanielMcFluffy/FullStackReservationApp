using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ReservationApp.Server.Models
{
    public class User
    {
        [BsonId] //this defines the Id -- it will make it a primary key
        [BsonRepresentation(BsonType.ObjectId)] //converts the parameter type from ObjectId to string

        // properties with * will need be passed their values somehow from the front-end (state management?)
        public string id { get; set; } = null!; //* will need to pass this to reservations collection
        public string? uid { get; set; } //* will need to pass this to reservations collection
        public string username { get; set; } = null!; //* will need to pass this to reservations collection
        public string? password { get; set; }

    }
}
