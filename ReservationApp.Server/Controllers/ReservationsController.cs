using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ReservationApp.Server.Models;
using ReservationApp.Server.Services;

namespace ReservationApp.Server.Controllers
{
    [ApiController]
    [Route("reservations")]
    public class ReservationsController : ControllerBase
    {
        private readonly ReservationsService _reservationsService;

        public ReservationsController(ReservationsService reservationsService)
        {
            _reservationsService = reservationsService;
        }

        //http requests
        [HttpGet]
        public async Task<List<Reservation>> Get() =>
            await _reservationsService.GetAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> Get(string id)
        {
            var listing = await _reservationsService.GetAsync(id);

            if(listing == null)
            {
                return NotFound();
            }
            return listing;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Reservation newReservation)
        {
            await _reservationsService.CreateAsync(newReservation);

            return CreatedAtAction(nameof(Get), new { Message = "Reservation created successfully", id = newReservation.id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Reservation updatedReservation)
        {
            var listing = await _reservationsService.GetAsync(id);

            if (listing == null)
            {
                return NotFound();
            }

            await _reservationsService.UpdateAsync(id, updatedReservation);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var listing = await _reservationsService.GetAsync(id);

            if(listing == null)
            {
                return NotFound();
            }

            await _reservationsService.RemoveAsync(id);

            return NoContent();
        }


    }
}
