import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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

  // Fetch user's reservations
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setApiError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id || payload.sub;
        const res = await axios.get(`${API_URL}/api/seats`);
        // Filter reservations for this user
        const userReservations = res.data.filter(
          seat => seat.user_id === userId && seat.status !== "free"
        );
        setReservations(userReservations);
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
    const statusCounts = { booked: 0, confirmed: 0 };
    reservations.forEach(r => {
      if (r.status === "booked") statusCounts.booked++;
      if (r.status === "confirmed") statusCounts.confirmed++;
    });

    // Bookings by hour (for peak times)
    const hourCounts = Array(24).fill(0);
    reservations.forEach(r => {
      if (r.booked_at) {
        const hour = new Date(r.booked_at).getHours();
        hourCounts[hour]++;
      }
    });

    return {
      statusCounts,
      hourCounts,
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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-6 text-center">
          My Reservations
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <span className="text-lg text-blue-700 font-semibold animate-pulse">Loading…</span>
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
                    <tr key={r.id} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-2 font-semibold">{r.seat_number}</td>
                      <td className="px-4 py-2">{r.floor}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold
                            ${r.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"}
                          `}
                        >
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {r.booked_at
                          ? new Date(r.booked_at).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2">
                        {r.status === "confirmed" && r.confirmed_at
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
                <h2 className="text-lg font-bold text-blue-700 mb-2 text-center">Booking Status</h2>
                <Pie
                  data={{
                    labels: ["Booked", "Checked In"],
                    datasets: [
                      {
                        data: [
                          chartData.statusCounts.booked,
                          chartData.statusCounts.confirmed,
                        ],
                        backgroundColor: ["#facc15", "#22c55e"],
                        borderColor: ["#fde047", "#16a34a"],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { display: true, position: "bottom" },
                    },
                  }}
                />
              </div>
              {/* Peak Times Bar Chart */}
              <div className="w-full md:w-1/2 bg-blue-50 rounded-2xl shadow p-4">
                <h2 className="text-lg font-bold text-blue-700 mb-2 text-center">Booking Peak Hours</h2>
                <Bar
                  data={{
                    labels: Array.from({ length: 24 }, (_, i) =>
                      `${i}:00`
                    ),
                    datasets: [
                      {
                        label: "Bookings",
                        data: chartData.hourCounts,
                        backgroundColor: "#3b82f6",
                        borderRadius: 6,
                        maxBarThickness: 24,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { grid: { display: false } },
                      y: { beginAtZero: true, grid: { color: "#e0e7ef" } },
                    },
                  }}
                />
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default MyReservations;