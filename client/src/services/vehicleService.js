const API_URL = "http://localhost:4000/api/vehicle"; 

// Get all vehicles
export const getVehicles = async () => {
  const res = await fetch(`${API_URL}/list`, {
    method: "POST"
  });
  return res.json();
};

export const getAvailableVehicles = async (data)=>{
  const res = await fetch(`${API_URL}/dropdown-list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify(data),
  });
  return res.json();
}

// Add vehicle
export const addVehicle = async (data) => {
  const res = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Update vehicle
export const updateVehicle = async (id, data) => {
  const res = await fetch(`${API_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Delete vehicle
export const deleteVehicle = async (id) => {
  const res = await fetch(`${API_URL}/delete/${id}`, { method: "POST" });
  return res.json();
};


// Search Vehicle
export const searchVehicle = async (data) => {
  const res = await fetch(`${API_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}