import 'tachyons';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DisasterList = () => {
  const [disasters, setDisasters] = useState([]); // Proper array initialization
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://disaster-sentinel-64565e2d120b.herokuapp.com/api/past-disasters/'
        );

        // Ensure we're working with an array
        const data = Array.isArray(response.data) 
          ? response.data 
          : response.data?.results || [];

        setDisasters(data);
      } catch (err) {
        setError(err.message);
        setDisasters([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Disaster Records</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={tableHeaderStyle}>Year</th>
            <th style={tableHeaderStyle}>Location</th>
            <th style={tableHeaderStyle}>Type</th>
            <th style={tableHeaderStyle}>Deaths</th>
            <th style={tableHeaderStyle}>Losses (INR)</th>
          </tr>
        </thead>
        <tbody>
          {disasters?.map((disaster) => ( // Optional chaining
            <tr key={disaster.id} style={tableRowStyle}>
              <td style={tableCellStyle}>{disaster.Disaster_Year}</td>
              <td style={tableCellStyle}>{disaster.Location}, {disaster.State}</td>
              <td style={tableCellStyle}>{disaster.Disaster_Type}</td>
              <td style={tableCellStyle}>
                {new Intl.NumberFormat().format(disaster.Total_Deaths)}
              </td>
              <td style={tableCellStyle}>
                ₹{new Intl.NumberFormat('en-IN').format(disaster.Economic_Loss_INR)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {disasters?.length === 0 && !loading && (
        <p style={{ marginTop: '20px' }}>No disaster records found</p>
      )}
    </div>
  );
};

// Style constants
const tableHeaderStyle = {
  padding: '12px',
  borderBottom: '2px solid #ddd',
  textAlign: 'left'
};

const tableRowStyle = {
  borderBottom: '1px solid #ddd',
  ':hover': {
    backgroundColor: '#f5f5f5'
  }
};

const tableCellStyle = {
  padding: '12px',
  verticalAlign: 'top'
};

export default DisasterList;