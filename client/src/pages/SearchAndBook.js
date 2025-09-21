import React, { useState } from "react";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";

const SearchAndBook = () => {
  const [capacityRequired, setCapacityRequired] = useState("");
  const [fromPincode, setFromPincode] = useState("");
  const [toPincode, setToPincode] = useState("");
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:4000/api/vehicles/available", {
        params: {
          capacity: capacityRequired,
          fromPincode,
          toPincode,
          startDateTime: startDateTime.toISOString(),
        },
      });
      setVehicles(response.data);
    } catch (error) {
      setMessage("Error fetching vehicles");
    }
  };

  const handleBook = async (vehicleId) => {
    try {
      const response = await axios.post("http://localhost:4000/api/bookings", {
        vehicleId,
        fromPincode,
        toPincode,
        startDateTime,
        customerId: 1, // Hardcoded for simplicity
      });
      setMessage("Booking successful!");
    } catch (error) {
      setMessage("Error booking vehicle");
    }
  };

  return (
    <div className="search-book-page">
      <h2>Search & Book Vehicle</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSearch}>
        <input
          type="number"
          placeholder="Capacity Required"
          value={capacityRequired}
          onChange={(e) => setCapacityRequired(e.target.value)}
        />
        <input
          type="text"
          placeholder="From Pincode"
          value={fromPincode}
          onChange={(e) => setFromPincode(e.target.value)}
        />
        <input
          type="text"
          placeholder="To Pincode"
          value={toPincode}
          onChange={(e) => setToPincode(e.target.value)}
        />
        <DateTimePicker
          value={startDateTime}
          onChange={setStartDateTime}
          minDate={new Date()}
        />
        <button type="submit">Search Availability</button>
      </form>
      <div className="vehicle-results">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <div key={vehicle._id} className="vehicle-item">
              <div>{vehicle.name}</div>
              <div>{vehicle.capacity} KG</div>
              <div>{vehicle.tyres} Tyres</div>
              <div>{vehicle.estimatedRideDuration} hrs</div>
              <button onClick={() => handleBook(vehicle._id)}>Book Now</button>
            </div>
          ))
        ) : (
          <div>No vehicles available</div>
        )}
      </div>
    </div>
  );
};

export default SearchAndBook;
