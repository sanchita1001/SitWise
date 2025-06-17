import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const STATUS_COLORS = {
  booked: "#facc15",
  confirmed: "#22c55e",
  free: "#e5e7eb",
};

function MyReservations({ isLoggedIn }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // Fetch user's full reservation history
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setApiError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id || payload.sub;
        // Fetch all reservations for this user (including history)
        const res = await axios.get(
          `${API_URL}/api/reservations?user_id=${userId}`
        );
        setReservations(res.data || []);
      } catch (err) {
        setApiError("Failed to load reservations. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) fetchReservations();
  }, [isLoggedIn]);

  // Data for charts
  const chartData = useMemo(() => {
    // Group by status
    const statusCounts = { booked: 0, confirmed: 0, free: 0 };
    reservations.forEach(r => {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    });

    // Bookings by hour (for peak times)
    const hourCounts = Array(24).fill(0);
    reservations.forEach(r => {
      if (r.booked_at) {
        const hour = new Date(r.booked_at).getHours();
        hourCounts[hour]++;
      }
    });

    // Prepare data for recharts
    const statusPie = Object.keys(statusCounts).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status],
      fill: STATUS_COLORS[status] || "#8884d8",
    }));

    const hourBar = hourCounts.map((count, hour) => ({
      hour: `${hour}:00`,
      Bookings: count,
    }));

    return {
      statusPie,
      hourBar,
    };
  }, [reservations]);

  // Table columns
  const columns = [
    { label: "Seat", key: "seat_number" },
    { label: "Floor", key: "floor" },
    { label: "Status", key: "status" },
    { label: "Booked At", key: "booked_at" },
    { label: "Checked In", key: "confirmed_at" },
    { label: "Expires At", key: "expires_at" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-2">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-10"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-2 text-center">
          My Reservations
        </h1>
        <div className="text-center text-gray-500 text-sm mb-6">
          {reservations.length === 0
            ? "No reservation history found."
            : "Below is your complete seat reservation history, including past and current bookings."}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <span className="text-lg text-blue-700 font-semibold animate-pulse">
              Loading…
            </span>
          </div>
        ) : apiError ? (
          <div className="flex flex-col items-center py-16">
            <span className="text-red-500 font-semibold mb-4">{apiError}</span>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : reservations.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <span className="text-gray-500 font-semibold mb-4">
              No reservations found.
            </span>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => navigate("/")}
            >
              Book a Seat
            </button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow mb-10">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm md:text-base">
                <thead className="bg-blue-50">
                  <tr>
                    {columns.map(col => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left font-bold text-blue-700 uppercase tracking-wider"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {reservations.map((r, idx) => (
                    <tr key={r.id || idx} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-2 font-semibold">{r.seat_number}</td>
                      <td className="px-4 py-2">{r.floor}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold capitalize
                            ${r.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : r.status === "booked"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-400"}
                          `}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {r.booked_at
                          ? new Date(r.booked_at).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2">
                        {r.confirmed_at
                          ? new Date(r.confirmed_at).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2">
                        {r.expires_at
                          ? new Date(r.expires_at).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              {/* Status Pie Chart */}
              <div className="w-full md:w-1/2 bg-blue-50 rounded-2xl shadow p-4 mb-6 md:mb-0">
                <h2 className="text-lg font-bold text-blue-700 mb-2 text-center">
                  Booking Status Distribution
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={chartData.statusPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {chartData.statusPie.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Peak Times Bar Chart */}
              <div className="w-full md:w-1/2 bg-blue-50 rounded-2xl shadow p-4">
                <h2 className="text-lg font-bold text-blue-700 mb-2 text-center">
                  Booking Peak Hours
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData.hourBar}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis allowDecimals={false} />
                    <Tooltip cursor={{ fill: "#e0e7ef", opacity: 0.3 }} />
                    <Bar
                      dataKey="Bookings"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default MyReservations;