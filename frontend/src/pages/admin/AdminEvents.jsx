import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Image,
  Grid,
  Layers,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "../../api/axios";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [seatLayoutMode, setSeatLayoutMode] = useState("grid"); // "grid", "custom", or "sections"
  const [customSeatMap, setCustomSeatMap] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    location: "",
    category: "concert",
    pricePerSeat: "",
    posterImage: "",
    rows: 10,
    columns: 10,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/events");
      setEvents(response.data);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };

      // If custom seat layout mode, include the custom seat map
      if (seatLayoutMode === "custom" && !editingEvent) {
        submitData.customSeatMap = customSeatMap;
      }

      // If sections mode, include sections data
      if (seatLayoutMode === "sections" && !editingEvent) {
        submitData.customSeatMap = customSeatMap;
        submitData.sections = sections;
      }

      if (editingEvent) {
        await axios.put(`/events/${editingEvent._id}`, submitData);
        toast.success("Event updated successfully");
      } else {
        await axios.post("/events", submitData);
        toast.success("Event created successfully");
      }
      setShowModal(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`/events/${id}`);
      toast.success("Event deleted successfully!");
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      time: event.time,
      venue: event.venue,
      location: event.location,
      category: event.category,
      pricePerSeat: event.pricePerSeat,
      posterImage: event.posterImage || "",
      rows: event.seatMap.length,
      columns: event.seatMap[0]?.length || 10,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      location: "",
      category: "concert",
      pricePerSeat: "",
      posterImage: "",
      rows: 10,
      columns: 10,
    });
    setEditingEvent(null);
    setSeatLayoutMode("grid");
    setCustomSeatMap([]);
    setSections([]);
    setSelectedSection(null);
  };

  const initializeCustomSeatMap = () => {
    const rows = parseInt(formData.rows) || 10;
    const columns = parseInt(formData.columns) || 10;
    const newMap = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push("available");
      }
      newMap.push(row);
    }
    setCustomSeatMap(newMap);
  };

  const toggleSeat = (rowIndex, colIndex) => {
    const newMap = [...customSeatMap];
    // Toggle between available and blocked (null)
    newMap[rowIndex][colIndex] =
      newMap[rowIndex][colIndex] === "available" ? null : "available";
    setCustomSeatMap(newMap);
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      price: "",
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      shape: "rectangle", // rectangle, arc, circle
      seats: [],
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection.id);
  };

  const updateSection = (id, updates) => {
    setSections(
      sections.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec))
    );
  };

  const deleteSection = (id) => {
    setSections(sections.filter((sec) => sec.id !== id));
    if (selectedSection === id) setSelectedSection(null);
  };

  const toggleSeatInSection = (rowIndex, colIndex) => {
    if (!selectedSection) {
      toast.warning("Please select a section first");
      return;
    }

    const newMap = [...customSeatMap];
    const currentValue = newMap[rowIndex][colIndex];

    // If seat is already assigned to this section, remove it
    if (currentValue === selectedSection) {
      newMap[rowIndex][colIndex] = null;
    } else {
      // Assign seat to selected section
      newMap[rowIndex][colIndex] = selectedSection;
    }

    setCustomSeatMap(newMap);
  };

  const generateCircularLayout = () => {
    const rows = parseInt(formData.rows) || 15;
    const cols = parseInt(formData.columns) || 20;
    const newMap = [];
    const centerRow = rows / 2;
    const centerCol = cols / 2;
    const maxRadius = Math.min(centerRow, centerCol);

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const distance = Math.sqrt(
          Math.pow(i - centerRow, 2) + Math.pow(j - centerCol, 2)
        );
        // Create circular pattern with stage in center
        if (distance < maxRadius * 0.3) {
          row.push("stage"); // Center stage area
        } else if (distance < maxRadius * 0.95) {
          row.push("available");
        } else {
          row.push(null); // Outside circle
        }
      }
      newMap.push(row);
    }
    setCustomSeatMap(newMap);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            <span>Create Event</span>
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center justify-center overflow-hidden">
                {event.posterImage ? (
                  <img
                    src={event.posterImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
                    }}
                  />
                ) : (
                  <Calendar size={64} className="text-white opacity-50" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin size={16} className="mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar size={16} className="mr-2" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="mr-2">₹</span>
                    <span>{event.pricePerSeat} per seat</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users size={16} className="mr-2" />
                    <span>
                      {event.availableSeats} / {event.totalSeats} available
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows="3"
                    className="input-field"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center space-x-2">
                      <Image size={16} />
                      <span>Poster Image URL</span>
                    </div>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/poster.jpg"
                    className="input-field"
                    value={formData.posterImage}
                    onChange={(e) =>
                      setFormData({ ...formData, posterImage: e.target.value })
                    }
                  />
                  {formData.posterImage && (
                    <img
                      src={formData.posterImage}
                      alt="Poster preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      className="input-field"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      required
                      className="input-field"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      required
                      className="input-field"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="concert">Concert</option>
                      <option value="sports">Sports</option>
                      <option value="theater">Theater</option>
                      <option value="comedy">Comedy</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Per Seat (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                      value={formData.pricePerSeat}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricePerSeat: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {!editingEvent && (
                  <>
                    <div className="border-t border-gray-200 pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <div className="flex items-center space-x-2">
                          <Grid size={16} />
                          <span>Seat Layout Configuration</span>
                        </div>
                      </label>

                      <div className="flex space-x-4 mb-4">
                        <button
                          type="button"
                          onClick={() => setSeatLayoutMode("grid")}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                            seatLayoutMode === "grid"
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          Simple Grid
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSeatLayoutMode("custom");
                            if (customSeatMap.length === 0) {
                              initializeCustomSeatMap();
                            }
                          }}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                            seatLayoutMode === "custom"
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          Custom Layout
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSeatLayoutMode("sections");
                            if (customSeatMap.length === 0) {
                              initializeCustomSeatMap();
                            }
                          }}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                            seatLayoutMode === "sections"
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Layers size={16} className="inline mr-1" />
                          Sections
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rows
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="30"
                            className="input-field"
                            value={formData.rows}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                rows: e.target.value,
                              });
                              if (seatLayoutMode === "custom") {
                                setCustomSeatMap([]);
                              }
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Columns
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="30"
                            className="input-field"
                            value={formData.columns}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                columns: e.target.value,
                              });
                              if (seatLayoutMode === "custom") {
                                setCustomSeatMap([]);
                              }
                            }}
                          />
                        </div>
                      </div>

                      {seatLayoutMode === "custom" && (
                        <div className="mt-4">
                          {customSeatMap.length === 0 ? (
                            <button
                              type="button"
                              onClick={initializeCustomSeatMap}
                              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Initialize Custom Layout
                            </button>
                          ) : (
                            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                              <p className="text-sm text-gray-600 mb-2">
                                Click seats to toggle between available (green)
                                and blocked (gray)
                              </p>
                              <div className="inline-block">
                                {customSeatMap.map((row, rowIndex) => (
                                  <div
                                    key={rowIndex}
                                    className="flex items-center mb-1"
                                  >
                                    <span className="w-6 text-xs font-medium text-gray-500 mr-2">
                                      {String.fromCharCode(65 + rowIndex)}
                                    </span>
                                    {row.map((seat, colIndex) => (
                                      <button
                                        key={colIndex}
                                        type="button"
                                        onClick={() =>
                                          toggleSeat(rowIndex, colIndex)
                                        }
                                        className={`w-8 h-8 m-0.5 rounded text-xs font-medium transition-colors ${
                                          seat === "available"
                                            ? "bg-green-500 hover:bg-green-600 text-white"
                                            : "bg-gray-300 hover:bg-gray-400 text-gray-600"
                                        }`}
                                        title={
                                          seat === "available"
                                            ? "Available"
                                            : "Blocked"
                                        }
                                      >
                                        {colIndex + 1}
                                      </button>
                                    ))}
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center space-x-4 mt-3 text-sm">
                                <div className="flex items-center space-x-1">
                                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                                  <span className="text-gray-700">
                                    Available
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                  <span className="text-gray-700">Blocked</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={initializeCustomSeatMap}
                                  className="ml-auto text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Reset Layout
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {seatLayoutMode === "sections" && (
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                              Create sections with different pricing tiers
                            </p>
                            <button
                              type="button"
                              onClick={generateCircularLayout}
                              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              Generate Circular Layout
                            </button>
                          </div>

                          {/* Sections Manager */}
                          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-800">
                                Sections
                              </h4>
                              <button
                                type="button"
                                onClick={addSection}
                                className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                              >
                                + Add Section
                              </button>
                            </div>

                            {sections.map((section) => (
                              <div
                                key={section.id}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  selectedSection === section.id
                                    ? "border-indigo-600 bg-white shadow-md"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                                onClick={() => setSelectedSection(section.id)}
                              >
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="color"
                                    value={section.color}
                                    onChange={(e) =>
                                      updateSection(section.id, {
                                        color: e.target.value,
                                      })
                                    }
                                    className="w-10 h-10 rounded cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="flex-1 grid grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      value={section.name}
                                      onChange={(e) =>
                                        updateSection(section.id, {
                                          name: e.target.value,
                                        })
                                      }
                                      className="text-sm px-2 py-1 border border-gray-300 rounded"
                                      placeholder="Section name"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <input
                                      type="number"
                                      value={section.price}
                                      onChange={(e) =>
                                        updateSection(section.id, {
                                          price: e.target.value,
                                        })
                                      }
                                      className="text-sm px-2 py-1 border border-gray-300 rounded"
                                      placeholder="Price ($)"
                                      min="0"
                                      step="0.01"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteSection(section.id);
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {sections.length === 0 && (
                              <p className="text-sm text-gray-500 text-center py-4">
                                No sections yet. Add sections to define pricing
                                zones.
                              </p>
                            )}
                          </div>

                          {/* Seat Designer for Sections */}
                          {customSeatMap.length === 0 ? (
                            <button
                              type="button"
                              onClick={initializeCustomSeatMap}
                              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Initialize Seat Layout
                            </button>
                          ) : (
                            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                              <p className="text-sm text-gray-600 mb-2">
                                {selectedSection
                                  ? `Click seats to assign to: ${
                                      sections.find(
                                        (s) => s.id === selectedSection
                                      )?.name || "selected section"
                                    }`
                                  : "Select a section above, then click seats to assign"}
                              </p>
                              <div className="inline-block">
                                {customSeatMap.map((row, rowIndex) => (
                                  <div
                                    key={rowIndex}
                                    className="flex items-center mb-1"
                                  >
                                    <span className="w-6 text-xs font-medium text-gray-500 mr-2">
                                      {String.fromCharCode(65 + rowIndex)}
                                    </span>
                                    {row.map((seat, colIndex) => {
                                      const seatSection = sections.find(
                                        (s) => s.id === seat
                                      );
                                      const isStage = seat === "stage";
                                      return (
                                        <button
                                          key={colIndex}
                                          type="button"
                                          onClick={() =>
                                            toggleSeatInSection(
                                              rowIndex,
                                              colIndex
                                            )
                                          }
                                          className={`w-8 h-8 m-0.5 rounded text-xs font-medium transition-all ${
                                            isStage
                                              ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold"
                                              : seatSection
                                              ? "text-white shadow-sm hover:shadow-md"
                                              : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                                          }`}
                                          style={
                                            seatSection
                                              ? {
                                                  backgroundColor:
                                                    seatSection.color,
                                                }
                                              : {}
                                          }
                                          title={
                                            isStage
                                              ? "Stage"
                                              : seatSection
                                              ? seatSection.name
                                              : "Unassigned"
                                          }
                                        >
                                          {isStage ? "🎭" : colIndex + 1}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center space-x-4 text-sm">
                                  {sections.map((section) => (
                                    <div
                                      key={section.id}
                                      className="flex items-center space-x-1"
                                    >
                                      <div
                                        className="w-4 h-4 rounded"
                                        style={{
                                          backgroundColor: section.color,
                                        }}
                                      ></div>
                                      <span className="text-gray-700">
                                        {section.name} (${section.price})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={initializeCustomSeatMap}
                                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                  Reset Layout
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {!editingEvent && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rows
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="30"
                        className="input-field"
                        value={formData.rows}
                        onChange={(e) =>
                          setFormData({ ...formData, rows: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Columns
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="30"
                        className="input-field"
                        value={formData.columns}
                        onChange={(e) =>
                          setFormData({ ...formData, columns: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="flex-1 btn-primary">
                    {editingEvent ? "Update Event" : "Create Event"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
