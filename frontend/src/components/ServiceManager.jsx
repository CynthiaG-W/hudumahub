import { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5000/api";

function ServiceManager() {
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // GET all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/services`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to fetch services"
        );
      }

      setServices(data.services || []);
    } catch (error) {
      console.error("Fetch services error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // POST / PUT
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const url = editingId
        ? `${API_BASE_URL}/services/${editingId}`
        : `${API_BASE_URL}/services`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          address: form.address,
          latitude: form.latitude
            ? Number(form.latitude)
            : null,
          longitude: form.longitude
            ? Number(form.longitude)
            : null,
        }),
      });

      const data = await response.json();

      console.log(
        `${method} service response:`,
        response.status,
        data
      );

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to save service"
        );
      }

      setMessage(
        editingId
          ? "Service updated successfully."
          : "Service created successfully."
      );

      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Service save error:", error);
      setError(error.message);
    }
  };

  // DELETE
  const handleDelete = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/services/${serviceId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      console.log(
        "DELETE service response:",
        response.status,
        data
      );

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete service"
        );
      }

      setMessage("Service deleted successfully.");

      fetchServices();
    } catch (error) {
      console.error("Delete service error:", error);
      setError(error.message);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);

    setForm({
      name: service.name || "",
      category: service.category || "",
      address: service.address || "",
      latitude: service.latitude ?? "",
      longitude: service.longitude ?? "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      category: "",
      address: "",
      latitude: "",
      longitude: "",
    });
  };

  return (
    <section className="service-manager">
      <div className="section-heading centered">
        <div>
          <span className="section-label">
            MANAGEMENT
          </span>

          <h2>
            Manage Services
          </h2>

          <p>
            Add, view, update, and delete services.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        className="service-manager-form"
        onSubmit={handleSubmit}
      >
        <h3>
          {editingId
            ? "Edit Service"
            : "Add New Service"}
        </h3>

        <input
          type="text"
          name="name"
          placeholder="Service name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">
            Select category
          </option>

          <option value="hospital">
            Hospital
          </option>

          <option value="pharmacy">
            Pharmacy
          </option>

          <option value="police">
            Police
          </option>

          <option value="atm">
            ATM
          </option>

          <option value="fuel">
            Fuel
          </option>
        </select>

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          type="number"
          step="any"
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          onChange={handleChange}
        />

        <input
          type="number"
          step="any"
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          onChange={handleChange}
        />

        <div className="service-manager-actions">
          <button type="submit">
            {editingId
              ? "Update Service"
              : "Add Service"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* Services */}
      <div className="managed-services">
        <h3>
          Existing Services
        </h3>

        {loading ? (
          <p>Loading services...</p>
        ) : services.length === 0 ? (
          <p>No services found.</p>
        ) : (
          services.map((service) => (
            <div
              className="managed-service"
              key={service.id}
            >
              <div>
                <strong>
                  {service.name}
                </strong>

                <span>
                  {service.category}
                </span>

                <small>
                  {service.address ||
                    "Address not available"}
                </small>
              </div>

              <div className="managed-service-actions">
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(service)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(service.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default ServiceManager;
