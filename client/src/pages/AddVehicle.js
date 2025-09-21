import React, { useEffect, useState } from "react";
import axios from "axios";
import VehicleTable from "../components/VehicleTable";
import Modal from "../components/Modal";

const VehicleManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "view", "add", "edit", "delete"
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({ name: "", capacity: "", tyres: "" });
  const [message, setMessage] = useState("");

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
    //   setLoading(true);
    //   const res = await axios.get("http://localhost:4000/api/vehicle/list");
    //   setVehicles(res.data);
    } catch (error) {
    //   setMessage("Error fetching vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Open modal helpers
  const openAddModal = () => {
    setModalType("add");
    setFormData({ name: "", capacity: "", tyres: "" });
    setModalOpen(true);
  };

  const openViewModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalType("view");
    setModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      capacity: vehicle.capacity,
      tyres: vehicle.tyres,
    });
    setModalType("edit");
    setModalOpen(true);
  };

  const openDeleteModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalType("delete");
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedVehicle(null);
    setFormData({ name: "", capacity: "", tyres: "" });
    setModalType("");
    setMessage("");
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle add or edit submit
  const handleSubmit = async () => {
    try {
      if (modalType === "add") {
        // await axios.post("http://localhost:4000/api/vehicle", formData);
        setMessage("Vehicle added successfully!");
      } else if (modalType === "edit" && selectedVehicle) {
        await axios.put(`http://localhost:4000/api/vehicle/${selectedVehicle._id}`, formData);
        setMessage("Vehicle updated successfully!");
      }
      fetchVehicles();
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setMessage("Error saving vehicle");
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    try {
      if (selectedVehicle) {
        await axios.delete(`http://localhost:4000/api/vehicle/${selectedVehicle._id}`);
        setMessage("Vehicle deleted successfully!");
        fetchVehicles();
        setTimeout(() => {
          closeModal();
        }, 1500);
      }
    } catch (error) {
      setMessage("Error deleting vehicle");
    }
  };

  // Modal content based on modalType
  const renderModalContent = () => {
    switch (modalType) {
      case "view":
        return (
          <div>
            <p><strong>Name:</strong> {selectedVehicle.name}</p>
            <p><strong>Capacity (KG):</strong> {selectedVehicle.capacity}</p>
            <p><strong>Tyres:</strong> {selectedVehicle.tyres}</p>
          </div>
        );

      case "add":
      case "edit":
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Vehicle Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity (KG)"
              value={formData.capacity}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="tyres"
              placeholder="Tyres"
              value={formData.tyres}
              onChange={handleInputChange}
              required
            />
          </form>
        );

      case "delete":
        return <p>Are you sure you want to delete the vehicle <strong>{selectedVehicle.name}</strong>?</p>;

      default:
        return null;
    }
  };

  return (
    <div>
      {message && <div className="message">{message}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onAdd={openAddModal}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      {modalOpen && (
        <Modal
          title={
            modalType === "add"
              ? "Add Vehicle"
              : modalType === "edit"
              ? "Edit Vehicle"
              : modalType === "view"
              ? "View Vehicle"
              : modalType === "delete"
              ? "Delete Vehicle"
              : ""
          }
          onClose={closeModal}
          onConfirm={
            modalType === "delete"
              ? handleDeleteConfirm
              : modalType === "add" || modalType === "edit"
              ? handleSubmit
              : null
          }
          confirmText={
            modalType === "delete"
              ? "Delete"
              : modalType === "add"
              ? "Add"
              : modalType === "edit"
              ? "Update"
              : "OK"
          }
          showConfirm={modalType !== "view"}
        >
          {renderModalContent()}
          {message && <div className="message" style={{ marginTop: "10px" }}>{message}</div>}
        </Modal>
      )}
    </div>
  );
};

export default VehicleManager;