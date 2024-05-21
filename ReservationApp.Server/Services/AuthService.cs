﻿using Microsoft.IdentityModel.Tokens;
using ReservationApp.Server.Helpers;
using ReservationApp.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ReservationApp.Server.Services
{
    public class AuthService //this class will take care of JWT token generation
    {
        public async Task<string> GenerateToken(User user)
        {
            var handler = new JwtSecurityTokenHandler(); //initialize JWT token handler
            var key = Encoding.ASCII.GetBytes(AuthSettings.PrivateKey); //ideally this is fetched from a secured place
            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature); // we will sign the key with an algorithm specified as the second parameter

            //I am making the assumption that token creation will take some time to resolve and thus making it an awaitable task via Task.Run()
            var token = await Task.Run(() =>
            {
                //we construct the token

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    //3 parts here make up a JWT token
                    Subject = GenerateClaims(user),
                    Expires = DateTime.UtcNow.AddMinutes(15),
                    SigningCredentials = credentials,
                };
                var token = handler.CreateToken(tokenDescriptor);
                return token;
            });
            return handler.WriteToken(token);
        }

        //refresh token is also a jwt
        public async Task<Tuple<string, DateTime>> GenerateRefreshToken()
        {
            var handler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(AuthSettings.RefreshKey); //again, this is an example -- keys should be stored privately
            var credentials = new SigningCredentials( new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);

            var refreshToken = await Task.Run(() =>
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = GenerateClaims(AuthSettings.RefreshKey),
                    Expires = DateTime.UtcNow.AddHours(1), // Set token to expire after 1 hour
                    SigningCredentials = credentials
                };

                var token = handler.CreateToken(tokenDescriptor);
                return handler.WriteToken(token);
            });
            return new Tuple<string, DateTime>(refreshToken, DateTime.UtcNow.AddHours(1)); //we return the refresh token and the time it expires so we can upload it to the db
        }

        private static ClaimsIdentity GenerateClaims(User user)
        {
            var claims = new ClaimsIdentity(); //initialize a claim

            claims.AddClaim(new Claim(ClaimTypes.Email, user.username));//here we add add the username(email) as a claim

            //below handles roles to be added into the claim if implemented

            //foreach(var role in user.Roles)//scan through all the available roles that the user is assigned and add that as a claim
            //{
            //    claims.AddClaim(new Claim(ClaimTypes.Role, role));
            //}

            return claims;

        }

        private static ClaimsIdentity GenerateClaims(string refreshKey)
        {
            var claims = new ClaimsIdentity(); //initialize a claim

            claims.AddClaim(new Claim(ClaimTypes.Thumbprint, refreshKey));

            return claims;

        }
    }
}