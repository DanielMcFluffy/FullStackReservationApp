using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using ReservationApp.Server.Helpers;
using ReservationApp.Server.Models;
using ReservationApp.Server.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .WithMethods("POST", "GET", "PUT", "DELETE"); // as of writing this, only POST and GET were the allowed methods by the cors' default policy -- setting this is necessary

        });
});

// Add services to the container.

//adds the appsetings.json as a service so we can inject it into the ReservationDatabaseSettings class
builder.Services.Configure<ReservationDatabaseSettings>(
    builder.Configuration.GetSection("ReservationDatabase"));

//registers mongodatabase as a service so we can reuse it in the service classes
builder.Services.AddSingleton<IMongoDatabase>(
    services =>
    {
        //reference the settings via the configuration.getsection method
        var settings = services.GetRequiredService<IOptions<ReservationDatabaseSettings>>().Value;
        //we first access it through the mongoClient
        var mongoClient = new MongoClient(settings!.ConnectionString);
        //then access the db from mongoclient
        return mongoClient.GetDatabase(
            settings!.DatabaseName);
    });

//registers the services so we can inject it into their respective controllers
builder.Services.AddSingleton<ListingsService>();
builder.Services.AddSingleton<ReservationsService>();
builder.Services.AddSingleton<UsersService>();

//we register the authservice
builder.Services.AddTransient<AuthService>();

//this middleware returns a delegate to futher configure the auth scheme
builder.Services
    .AddAuthentication(x =>
    {   //we set auth and challenge scheme as default
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(x =>
    {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters//validation config
        {
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(AuthSettings.PrivateKey)),
            //no need to validate issuer and audience as of now
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });
//finally we add authorization
builder.Services.AddAuthorization();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "JWT Authentication",
        Description = "Enter your JWT token in this field",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    };

    c.AddSecurityDefinition("Bearer", securityScheme);

    var securityRequirement = new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    };

    c.AddSecurityRequirement(securityRequirement);
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
