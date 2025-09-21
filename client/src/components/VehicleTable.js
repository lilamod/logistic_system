import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import Popup from "./Popup";
import {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicleService";

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]);
  const [popupType, setPopupType] = useState(""); 
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fields = [
    { name: "vehicleName", label: "Vehicle Name", type: "text" },
    { name: "capacity", label: "Capacity (KG)", type: "number" },
    { name: "tyres", label: "Tyres", type: "text" },
  ];

  useEffect(() => {
    (async () => {
      const data = await getVehicles();
      setVehicles(data.list);
    })();
  }, []);

  const openPopup = (type, vehicle = null) => {
    setPopupType(type);
    setSelectedVehicle(vehicle);
  };

  const closePopup = () => {
    setPopupType("");
    setSelectedVehicle(null);
  };

  const handleFormSubmit = async (e) => {
    // e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());

    if (popupType === "add") {
      const newVehicle = await addVehicle(formData);
      setVehicles((prev) => [...prev, newVehicle]);
    }

    if (popupType === "edit") {
      const updatedVehicle = await updateVehicle(selectedVehicle._id, formData);
      setVehicles((prev) =>
        prev.map((v) => (v._id === selectedVehicle._id ? updatedVehicle : v))
      );
    }

    closePopup();
  };

  const handleDelete = async () => {
    await deleteVehicle(selectedVehicle._id);
    setVehicles((prev) => prev.filter((v) => v._id !== selectedVehicle._id));
    closePopup();
  };

  return (
    <div className="vehicle-table">
      <h1>Vehicle Management</h1>

      <div className="table-header">
        <button className="btn-add" onClick={() => openPopup("add")}>
          + Create New Vehicle
        </button>
      </div>

      {vehicles && vehicles.length === 0 ? (
        <div className="no-data">No record available</div>
      ) : (
        <table>
          <thead>
            <tr>
              {fields.map((f) => (
                <th key={f.name}>{f.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            {vehicles.map((vehicle) => (
              <tr key={vehicle._id}>
                {fields.map((f) => (
                  <td key={f.name}>{vehicle[f.name]}</td>
                ))}
                <td>
                  <FaEye
                    onClick={() => openPopup("view", vehicle)}
                    className="action-icon"
                  />
                  <FaEdit
                    onClick={() => openPopup("edit", vehicle)}
                    className="action-icon"
                  />
                  <FaTrashAlt
                    onClick={() => openPopup("delete", vehicle)}
                    className="action-icon"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Popup for Add/Edit */}
      <Popup
        title={popupType === "add" ? "Add Vehicle" : "Edit Vehicle"}
        isOpen={popupType === "add" || popupType === "edit"}
        onClose={closePopup}
      >
        <form onSubmit={handleFormSubmit}>
          {fields.map((f) => (
            <div key={f.name} className="form-group">
              <label>{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                defaultValue={selectedVehicle?.[f.name] || ""}
                placeholder={f.label}
                required
              />
            </div>
          ))}
          <button type="submit" className="btn-submit">
            {popupType === "add" ? "Add Vehicle" : "Update Vehicle"}
          </button>
        </form>
      </Popup>

      {/* ✅ Popup for View */}
      <Popup
        title="View Vehicle"
        isOpen={popupType === "view"}
        onClose={closePopup}
      >
        <div className="view-details">
          {fields.map((f) => (
            <p key={f.name}>
              <b>{f.label}:</b> {selectedVehicle?.[f.name]}
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
        <p>Are you sure you want to delete this vehicle?</p>
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

export default VehicleTable;
