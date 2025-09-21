import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import Popup from "./Popup";
import {
  getBookings,
  addBooking,
  updateBooking,
  deleteBooking,
} from "../services/bookingService";
import {
  getVehicles,
  getAvailableVehicles,
  searchVehicle
} from "../services/vehicleService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [dropdownVehicles, setDropdownVehicles] = useState([]);

  const [popupType, setPopupType] = useState(""); // "add", "edit", "view", "delete"
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [searchForm, setSearchForm] = useState({
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: new Date(),
    showSearch: false,
  });

  // Updated field name from "vehicle" to "vehicleId"
  const fields = [
    { name: "vehicle", label: "Vehicle", type: "select" },
    { name: "fromPincode", label: "From Pincode", type: "text" },
    { name: "toPincode", label: "To Pincode", type: "text" },
    { name: "startTime", label: "Start Time", type: "datetime" },
  ];

  useEffect(() => {
    (async () => {
      try {
        const [bookingsData, vehiclesData] = await Promise.all([
          getBookings(),
          getVehicles(),
        ]);
        setBookings(bookingsData.list);
        setVehicles(vehiclesData.list);
      } catch (error) {
        console.error("Failed to load initial data", error);
      }
    })();
  }, []);

  const openPopup = async (type, booking = null) => {
    setPopupType(type);
    setSelectedBooking(booking);

    if (type === "add" || type === "edit") {
      try {
        const dropdownData = await getAvailableVehicles();
        setDropdownVehicles(dropdownData.list);
      } catch (err) {
        console.error("Failed to load dropdown vehicle list", err);
      }
    }
  };

  const closePopup = () => {
    setPopupType("");
    setSelectedBooking(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    if (formData.startTime) {
      formData.startTime = new Date(formData.startTime);
    }

    try {
      if (popupType === "add") {
        const newBooking = await addBooking(formData);
        setBookings((prev) => [...prev, newBooking]);
      }

      if (popupType === "edit") {
        const updated = await updateBooking(selectedBooking._id, formData);
        setBookings((prev) =>
          prev.map((b) => (b._id === selectedBooking._id ? updated : b))
        );
      }

      closePopup();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBooking(selectedBooking._id);
      setBookings((prev) =>
        prev.filter((b) => b._id !== selectedBooking._id)
      );
      closePopup();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleSearch = async () => {
    try {
      const results = await searchVehicle(searchForm);
      setAvailableVehicles(results.list);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleBookNow = async (vehicle) => {
    try {
      const bookingPayload = {
        vehicle: vehicle._id,
        fromPincode: searchForm.fromPincode,
        toPincode: searchForm.toPincode,
        startTime: searchForm.startTime,
        customerId: "12345", // Replace as needed
      };
      const newBooking = await addBooking(bookingPayload);
      setBookings((prev) => [...prev, newBooking]);
      alert("Booking confirmed!");
    } catch (error) {
      alert("Booking failed. Vehicle may be unavailable.");
    }
  };

  return (
    <div className="booking-table">
      <h2>Bookings</h2>

      <div className="table-header">
        <button className="btn-create" onClick={() => openPopup("add")}>
          <FaPlus /> New Booking
        </button>
        <button
          className="btn-search-toggle"
          onClick={() =>
            setSearchForm((prev) => ({
              ...prev,
              showSearch: !prev.showSearch,
            }))
          }
        >
          {searchForm.showSearch ? "Hide Search" : "Search Availability"}
        </button>
      </div>

      {/* ✅ Search Form */}
      {searchForm.showSearch && (
        <div className="search-form">
          <input
            type="number"
            placeholder="Capacity Required"
            value={searchForm.capacityRequired}
            onChange={(e) =>
              setSearchForm({ ...searchForm, capacityRequired: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="From Pincode"
            value={searchForm.fromPincode}
            onChange={(e) =>
              setSearchForm({ ...searchForm, fromPincode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="To Pincode"
            value={searchForm.toPincode}
            onChange={(e) =>
              setSearchForm({ ...searchForm, toPincode: e.target.value })
            }
          />
          <DatePicker
            selected={searchForm.startTime}
            onChange={(date) =>
              setSearchForm({ ...searchForm, startTime: date })
            }
            dateFormat="dd/MM/yyyy h:mm aa"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            className="datepicker"
          />
          <button className="btn-search" onClick={handleSearch}>
            Search Availability
          </button>
        </div>
      )}

      {/* ✅ Search Results */}
      {availableVehicles.length > 0 && (
        <div className="available-vehicles">
          <h3>Available Vehicles</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Capacity</th>
                <th>Tyres</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availableVehicles.map((vehicle) => (
                <tr key={vehicle._id}>
                  <td>{vehicle.vehicleName}</td>
                  <td>{vehicle.capacity}</td>
                  <td>{vehicle.tyres}</td>
                  <td>
                    <button onClick={() => handleBookNow(vehicle)}>
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Bookings Table */}
      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>From Pincode</th>
            <th>To Pincode</th>
            <th>Start Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>
                {
                  booking.vehicle.vehicleName
                }
              </td>
              <td>{booking.fromPincode}</td>
              <td>{booking.toPincode}</td>
              <td>{new Date(booking.startTime).toLocaleString()}</td>
              <td>
                <FaEye
                  onClick={() => openPopup("view", booking)}
                  className="action-icon"
                />
                <FaEdit
                  onClick={() => openPopup("edit", booking)}
                  className="action-icon"
                />
                <FaTrashAlt
                  onClick={() => openPopup("delete", booking)}
                  className="action-icon"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Popup for Add/Edit */}
      <Popup
        title={popupType === "add" ? "Add Booking" : "Edit Booking"}
        isOpen={popupType === "add" || popupType === "edit"}
        onClose={closePopup}
      >
        <form onSubmit={handleFormSubmit}>
          {fields.map((f) => (
            <div key={f.name} className="form-group">
              <label>{f.label}</label>
              {f.name === "vehicle" && f.type === "select" ? (
                <select
                  name="vehicle"
                  defaultValue={selectedBooking?.vehicle || ""}
                  required
                >
                  <option value="">Select a vehicle</option>
                  {dropdownVehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.vehicleName}
                    </option>
                  ))}
                </select>
              ) : f.type === "datetime" ? (
                <input
                  type="datetime-local"
                  name={f.name}
                  defaultValue={
                    selectedBooking
                      ? new Date(selectedBooking[f.name])
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  required
                />
              ) : (
                <input
                  type={f.type}
                  name={f.name}
                  defaultValue={selectedBooking?.[f.name] || ""}
                  required
                />
              )}
            </div>
          ))}
          <button type="submit" className="btn-submit">
            {popupType === "add" ? "Add Booking" : "Update Booking"}
          </button>
        </form>
      </Popup>

      {/* ✅ Popup for View */}
      <Popup
        title="View Booking"
        isOpen={popupType === "view"}
        onClose={closePopup}
      >
        <div className="view-details">
          {fields.map((f) => (
            <p key={f.name}>
              <b>{f.label}:</b>{" "}
              {f.name === "vehicle"
                ? vehicles.find((v) => v._id === selectedBooking?.vehicle)
                    ?.vehicleName || "Unknown"
                : f.name === "startTime"
                ? new Date(selectedBooking?.[f.name]).toLocaleString()
                : selectedBooking?.[f.name]}
            </p>
          ))}
        </div>
      </Popup>

      {/* ✅ Popup for Delete Confirmation */}
      <Popup
        title="Confirm Delete"
        isOpen={popupType === "delete"}
        onClose={closePopup}
      >
        <p>Are you sure you want to delete this booking?</p>
        <div className="popup-actions">
          <button onClick={handleDelete} className="btn-delete">
            Yes, Delete
          </button>
          <button onClick={closePopup} className="btn-cancel">
            Cancel
          </button>
        </div>
      </Popup>
    </div>
  );
};

export default BookingTable;