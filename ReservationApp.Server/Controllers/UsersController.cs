using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ReservationApp.Server.Models;
using ReservationApp.Server.Services;
using System.Security.Cryptography;

namespace ReservationApp.Server.Controllers
{
    public interface IAuthData
    {
        string token { get; set; }
        string refreshToken { get; set; }
    }


    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UsersService _usersService;

        public UsersController(UsersService usersService)
        {
            _usersService = usersService;
        }

        //http requests
        [HttpGet("/users")]
        public async Task<List<User>> Get() =>
            await _usersService.GetAsync();

        [HttpGet("/users/{id}")]
        public async Task<ActionResult<User>> Get(string id)
        {
            var user = await _usersService.GetByIdAsync(id);

            if(user == null)
            {
               var errorResponse = new { Message = "User does not exist" };

                return NotFound(errorResponse);
            }
            return user;
        }
        //signup
        [HttpPost("/signup")]
        public async Task<IActionResult> Signup(User newUser)
        {
            var user = await _usersService.GetByUsernameAsync(newUser.username);

            if(user != null)
            {
                var errorResponse = new { Message = "Email has registered previously" };

                return BadRequest(errorResponse);
            }


            await _usersService.CreateAsync(newUser);

            var successResponse = new { Message = "Registration successful", id = newUser.id };

            return CreatedAtAction(nameof(Get), successResponse);
        }

        //[HttpPut("{id}")]
        //public async Task<IActionResult> Update(string id, User updatedUser)
        //{
        //    var user = await _usersService.GetAsync(id);

        //    if (user == null)
        //    {
        //        return NotFound();
        //    }

        //    await _usersService.UpdateAsync(id, updatedUser);

        //    return NoContent();
        //}

        ////////////////////
        ///get back to this when you understand authentication

        ////login
        //[HttpPost("/login")]
        //public async Task<ActionResult<IAuthData>> Login(User loginUser)
        //{
        //    var user = _usersService.GetByUsernameAsync(loginUser.username);

        //    if (user == null)
        //    {
        //        return Unauthorized(new { Message = "Authentication failed" });
        //    }

        //    var newToken = SHA256.Create();

            


        //}


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _usersService.GetByIdAsync(id);

            if(user == null)
            {
                return NotFound();
            }

            await _usersService.RemoveAsync(id);

            return NoContent();
        }


    }
}
