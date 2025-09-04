import axios from "axios";

const API_BASE = "http://localhost:8000"; // FastAPI

export const fetchOrganizations = async () => {
  try {
    const response = await axios.get(`${API_BASE}/organizations`);
    return response.data;
  } catch (error) {
    console.error("Erreur API:", error);
    return [];
  }
};
