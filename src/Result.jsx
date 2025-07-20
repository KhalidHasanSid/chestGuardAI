import axios from "axios";
import React, { useState, useEffect } from "react";

export default function Result() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4500/api/v1/chestguardDetection/getDetectedResults",
          { withCredentials: true }
        );
        setData(response.data.data);
      } catch (err) {
        setError("Loading...");
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl border border-black">
        <h2 className="text-2xl font-semibold text-black mb-4 border-b pb-2">Chest Guard Analysis</h2>

        {loading ? (
          <p className="text-black">Loading results...</p>
        ) : error ? (
          <p className="text-blue-500">{error}</p>
        ) : data.length > 0 ? (
          <div className="space-y-4">
            {data.map((eachValue) => (
              <div
                key={eachValue._id}
                className="border border-black p-4 rounded-lg bg-gray-50 shadow-sm"
              >
                <p className="text-black font-medium">Result: {eachValue.result}</p>
                <p className="text-gray-700 text-sm">Date: {new Date(eachValue.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-black">No results found.</p>
        )}
      </div>
    </div>
  );
}