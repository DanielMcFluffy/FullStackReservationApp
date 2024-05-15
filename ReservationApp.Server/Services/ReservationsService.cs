using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ReservationApp.Server.Models;

namespace ReservationApp.Server.Services
{
    public class ReservationsService
    {
        private readonly IMongoDatabase _database; //the singleton db entity that will be injected from the cosntructor
        private readonly IMongoCollection<Reservation> _reservationCollection; //we then inject the collection that is obtained from the IMongoDatabase DI
        
        public ReservationsService(
            IMongoDatabase database)
        {
           _database = database; //initialize

            _reservationCollection = _database.GetCollection<Reservation>(
                "Reservations"); //initialize
        }

        public async Task<List<Reservation>> GetAsync() =>
            await _reservationCollection.Find(_ => true).ToListAsync();
        public async Task<Reservation?> GetAsync(string id) =>
            await _reservationCollection.Find(x => x.id == id).FirstOrDefaultAsync();
        public async Task CreateAsync(Reservation newReservation) =>
            await _reservationCollection.InsertOneAsync(newReservation);
        public async Task UpdateAsync(string id, Reservation updatedReservation) =>
            await _reservationCollection.ReplaceOneAsync(x => x.id == id, updatedReservation);
        public async Task RemoveAsync(string id) =>
            await _reservationCollection.DeleteOneAsync(x => x.id == id);
    }
}
