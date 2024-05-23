using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ReservationApp.Server.Models;
using ReservationApp.Server.Requests;
using ReservationApp.Server.Services;
using System.IdentityModel.Tokens.Jwt;


namespace ReservationApp.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("reservations/")]
    public class ReservationsController : ControllerBase
    {
        private readonly ReservationsService _reservationsService;
        private readonly ListingsService _listingsService;
        private readonly UsersService _usersService;
        private readonly AuthService _authService;

        public ReservationsController(
            ReservationsService reservationsService,
            ListingsService listingsService,
            UsersService usersService,
            AuthService authService)
        {
            _reservationsService = reservationsService;
            _listingsService = listingsService;
            _usersService = usersService;
            _authService = authService;

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

        //get reservation by user 

        [HttpGet("user")]
        public async Task<List<Reservation>> GetUserReservation()
        {

            var user_id = await _authService.DecodeTokenClaimFromHeader("user_id");

            return await _reservationsService.GetReservationByUserAsync(user_id);

        }

        [HttpPost]
        public async Task<IActionResult> Post(Reservation newReservation)
        {
            var listing = await _listingsService.GetAsync(newReservation.listing_id);

            if(listing == null) return NotFound();

            if (listing.isbooked == true)
            {
                var errorMessage = new { message = "Listing has been previouly booked!" };
                return NotFound(errorMessage);
            }

            listing.isbooked = true; // set the listing booking status to true

            //update it via the listingService
            await _listingsService.UpdateAsync(newReservation.listing_id, listing);

            await _reservationsService.CreateAsync(newReservation);

            return CreatedAtAction(nameof(Get), new { message = "Reservation created successfully", id = newReservation.id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] ReservationNameRequest updatedReservationName)
        {
            var reservation = await _reservationsService.GetAsync(id);

            if (reservation == null)
            {
                return NotFound();
            }

            reservation.guestname = updatedReservationName.name;

            await _reservationsService.UpdateAsync(id, reservation);

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
