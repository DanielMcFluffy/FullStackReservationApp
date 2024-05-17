using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ReservationApp.Server.Models;
using ReservationApp.Server.Services;

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

//builder.Services.AddAuthentication()

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
