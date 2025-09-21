

const API_URL = "http://localhost:4000/api/booking"; 

// Get all vehicles
export const getBookings = async () => {
  const res = await fetch(`${API_URL}/list`, {
    method: "POST"
  });
  return res.json();
};


// Add vehicle
export const addBooking = async (data) => {
  const res = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Update vehicle
export const updateBooking = async (id, data) => {
  const res = await fetch(`${API_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Delete vehicle
export const deleteBooking = async (id) => {
  const res = await fetch(`${API_URL}/delete/${id}`, { method: "POST" });
  return res.json();
};
