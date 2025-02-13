import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyConverter = ({ prices }) => {
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState({});
  const [convertedPrices, setConvertedPrices] = useState([]);

  // Fetch exchange rates on component mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(
          `https://api.exchangeratesapi.io/v1/latest?access_key=e1f139606cb7ffd25e6c429aa60badcc`
        );
        setRates(response.data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };
    fetchRates();
  }, []);

  // Convert prices whenever currency or rates change
  useEffect(() => {
    if (rates[currency]) {
      const newPrices = prices.map((price) => (price * rates[currency]).toFixed(2));
      setConvertedPrices(newPrices);
    }
  }, [currency, rates, prices]);

  return (
    <div>
      <label htmlFor="currency">Choose Currency:</label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="border px-3 py-2"
      >
        {Object.keys(rates).map((rate) => (
          <option key={rate} value={rate}>
            {rate}
          </option>
        ))}
      </select>

      <div className="prices mt-4">
        <h2>Converted Prices ({currency}):</h2>
        <ul>
          {convertedPrices.map((price, index) => (
            <li key={index}>Product {index + 1}: {price} {currency}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CurrencyConverter;