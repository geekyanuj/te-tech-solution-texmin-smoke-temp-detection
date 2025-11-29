import React, { useEffect, useState } from 'react';
import '../assets/custom.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import ConfigureThresholdTemp from '../components/ConfigureThresholdTemp';
import { Modal, Button } from 'react-bootstrap';
import CurrentThresholdTemp from '../components/CurrentThresholdTemp';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

export default function ThermalDetection() {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State to manage modal visibility
  const [showConfigureTempModal, setShowConfigureTempModal] = useState(false);

  // Function to close the modal
  const handleConfigureTempModalClose = () => setShowConfigureTempModal(false);

  // Function to show the modal
  const handleConfigureTempModalShow = () => setShowConfigureTempModal(true);

  // Fetch function (reusable)
  const fetchData = () => {
    fetch(`${API_BASE}/ventlogs?since=1h`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("API fetch error:", err));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Reverse data so latest comes first
  const reversedData = [...data].reverse();

  // Pagination logic
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = reversedData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reversedData.length / rowsPerPage);

  // Handle page change
  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // reset to page 1
  };

  // Get threshold temperature from latest data entry (or fallback to null)
  // Use latest data point's threshold_temp, or default to null if no data
  // const latestThresholdTemp = data.length > 0 ? data[data.length - 1].threshold_temp : null;

  // ===== Line Chart for Temperature =====
  const tempChartData = {
    labels: data.map((entry) => new Date(entry.timestamp)),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.map((entry) => entry.temperature),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        tension: 0.3,
      },
      ...(
        [
            {
              label: 'Threshold Temperature',
              data: data.map((entry) => entry.threshold_temp),
              borderColor: 'red',
              borderWidth: 2,
              borderDash: [10, 5], // dashed line
              pointRadius: 0,
              fill: false,
              tension: 0, // straight line
            },
          ]
        ),
    ],
  };

  const tempChartOptions = {
  responsive: true,
  plugins: {
    title: { display: true, text: 'Temperature Over Time' },
  },
  scales: {
    x: { type: 'time', title: { display: true, text: 'Time' } },
    y: {
      title: { display: true, text: 'Temperature (°C)' },
      min: 15,
      max: 45,
    },
  },
};

  // ===== Timeline Chart for Vent State =====
  const ventChartData = {
    labels: data.map((entry) => new Date(entry.timestamp)),
    datasets: [
      {
        label: 'Vent State',
        data: data.map((entry) => (entry.vent === 'on' ? 1 : 0)),
        borderColor: 'green',
        backgroundColor: 'rgba(0, 200, 0, 0.5)',
        stepped: true,
      },
    ],
  };

  const ventChartOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Vent ON/OFF Timeline' },
    },
    scales: {
      x: { type: 'time', title: { display: true, text: 'Time' } },
      y: {
        ticks: {
          callback: (value) => (value === 1 ? 'ON' : 'OFF'),
          stepSize: 1,
          max: 1,
          min: 0,
        },
      },
    },
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <Button className='mb-2' variant="primary" onClick={handleConfigureTempModalShow}>
          Configure Threshold Temperature
        </Button>

        <span><CurrentThresholdTemp/></span>
      </div>
      {/* Data Log Table with Pagination */}
      <h4 className='m-0 p-0'>Ventilation Logs</h4>
      <div className="table-wrapper mt-0">
        <table className="people-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Timestamp</th>
              <th>Temperature (°C)</th>
              <th>Vent</th>
              <th>Mode</th>
              <th>Threshold</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((entry, index) => (
              <tr key={index}>
                <td>{indexOfFirst + index + 1}</td>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                <td>{entry.temperature}</td>
                <td className={entry.vent === 'on' ? 'status-on' : 'status-off'}>
                  {entry.vent}
                </td>
                <td>{entry.mode}</td>
                <td>{entry.threshold_temp}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          {/* Rows per page dropdown */}
          <div>
            <label className="me-2">Rows per page:</label>
            <select
              value={rowsPerPage}
              onChange={handleRowsChange}
              className="form-select d-inline-block"
              style={{ width: 'auto' }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page navigation */}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>
            <span>
              Page <strong>{currentPage}</strong> of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary ms-2"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mt-4">
        <div className="col-md-6">
          <Line options={tempChartOptions} data={tempChartData} />
        </div>
        <div className="col-md-6">
          <Line options={ventChartOptions} data={ventChartData} />
        </div>
      </div>

      <Modal show={showConfigureTempModal} onHide={handleConfigureTempModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Configure Threshold Temperature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ConfigureThresholdTemp onUpdate={handleConfigureTempModalClose}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfigureTempModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
