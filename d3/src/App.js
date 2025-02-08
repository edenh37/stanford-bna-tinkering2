import './App.css';
import React, { useState } from "react";
import Barchart from './components/Barchart';
import Treemap from './components/Treemap';

function App() {
  const [selectedVis, setSelectedVis] = useState("happiness");

  return (
    <div className="App">
    <h1>World's Happiness Countries 2024</h1>
    <label htmlFor="dropdown">Choose a visualization: </label>
      <select
        id="dropdown"
        onChange={(e) => setSelectedVis(e.target.value)}
        value={selectedVis}
      >
        <option value="happiness">By Happiness Index</option>
        <option value="gdp">By GDP</option>
      </select>

      <div className="visualization">
        {selectedVis === "happiness" && <Barchart />}
        {selectedVis === "gdp" && <Treemap />}
      </div>
    </div>
  );
}

export default App;