import React, { useEffect, useState } from "react";
import { fetchOrganizations } from "./api";

function App() {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    fetchOrganizations().then(data => setOrganizations(data));
  }, []);

  return (
    <div>
      <h1>Liste des organisations</h1>
      <ul>
        {organizations.map(org => (
          <li key={org._id}>
            <strong>{org.name}</strong> - {org.description || "Pas de description"}
            {org.tags && org.tags.length > 0 && (
              <span> [{org.tags.join(", ")}]</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
