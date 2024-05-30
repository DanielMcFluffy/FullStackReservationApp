using Database.DBModels;


namespace Interfaces
{
    public interface IReservationsService
    {
        public Task<List<Reservation>> GetAsync();
        public Task<Reservation> GetAsync(string id);
        //get reservations based on user_id who had booked it
        public Task<List<Reservation>> GetReservationByUserAsync(string id);
        public Task<List<Reservation>> GetAllReservationByUserAsync(string id);
        public Task CreateAsync(Reservation newReservation);
        public Task UpdateAsync(string id, Reservation updatedReservation);
        public  Task RemoveAsync(string id);
    }
}
