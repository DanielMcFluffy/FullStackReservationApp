using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ReservationApp.Server.Models;
using ReservationApp.Server.Requests;
using ReservationApp.Server.Services;

namespace ReservationApp.Server.Controllers
{
    [ApiController]
    [Route("reservations/")]
    public class ReservationsController : ControllerBase
    {
        private readonly ReservationsService _reservationsService;
        private readonly ListingsService _listingsService;

        public ReservationsController(
            ReservationsService reservationsService,
            ListingsService listingsService)
        {
            _reservationsService = reservationsService;
            _listingsService = listingsService;

        }

        //http requests
        [HttpGet]
        public async Task<List<Reservation>> Get() =>
            await _reservationsService.GetAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> Get(string id)
        {
            var reservation = await _reservationsService.GetAsync(id);

            if(reservation == null)
            {
                return NotFound();
            }
            return reservation;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Reservation newReservation)
        {
            var listing = await _listingsService.GetAsync(newReservation.listing_id);

            if(listing == null) return NotFound();

            if (listing.isbooked == true)
            {
                var errorMessage = new { Message = "Listing has been previouly booked!" };
                return NotFound(errorMessage);
            }

            listing.isbooked = true; // set the listing booking status to true

            //update it via the listingService
            await _listingsService.UpdateAsync(newReservation.listing_id, listing);

            await _reservationsService.CreateAsync(newReservation);

            return CreatedAtAction(nameof(Get), new { Message = "Reservation created successfully", id = newReservation.id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Reservation updatedReservation)
        {
            var reservation = await _reservationsService.GetAsync(id);

            if (reservation == null)
            {
                return NotFound();
            }

            await _reservationsService.UpdateAsync(id, updatedReservation);

            return NoContent();
        }

        [HttpPut("{id}/delete")]
        public async Task<IActionResult> DeleteWithReason( string id, [FromBody] DeleteWithReasonRequest request)
        {
            //we get the reservation and its listing to be updated
            var reservation = await _reservationsService.GetAsync(id);
            var listing = await _listingsService.GetAsync(request.listing_id);
            if (reservation == null || listing == null)
            {
                return NotFound();
            }

            //update it
            reservation.showreservation = false;
            reservation.reasoncancel = request.reasoncancel;
            listing.isbooked = false;
            
            //pass it in after update
            await _reservationsService.UpdateAsync(id, reservation);
            await _listingsService.UpdateAsync(request.listing_id, listing);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var reservation = await _reservationsService.GetAsync(id);

            if(reservation == null)
            {
                return NotFound();
            }

            await _reservationsService.RemoveAsync(id);

            return NoContent();
        }


    }
}
