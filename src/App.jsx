import React, { useState } from 'react';
import { defaultVehicleTypes } from './data/vehicleTypes';
import { calculateFleetSize } from './utils/calculations';
import { unitConversions } from './utils/unitConversions';
import VehicleCard from './components/VehicleCard';
import FleetCharts from './components/FleetCharts';

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [useMetric, setUseMetric] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState(['8TB50A', 'M10']);
  const [connections, setConnections] = useState([]);
  const [operatingHours, setOperatingHours] = useState(16);
  const [results, setResults] = useState(null);
  const [availabilityTarget, setAvailabilityTarget] = useState(95);
  const [trafficDensity, setTrafficDensity] = useState('moderate');
  const [showWhatIf, setShowWhatIf] = useState(false);

  const theme = {
    light: {
      bg: "#f9fafb",
      cardBg: "#ffffff",
      text: "#1f2937",
      primary: "#1e3a4f",
      secondary: "#2a4f69"
    },
    dark: {
      bg: "#1f2937",
      cardBg: "#374151",
      text: "#f9fafb",
      primary: "#3b82f6",
      secondary: "#60a5fa"
    }
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  const handleVehicleSelect = (vehicleType) => {
    setSelectedVehicles(prev => 
      prev.includes(vehicleType)
        ? prev.filter(v => v !== vehicleType)
        : [...prev, vehicleType]
    );
  };

  const addConnection = () => {
    const newConnection = {
      id: Date.now(),
      from: '',
      to: '',
      distance: 0,
      throughput: 0,
      vehicleType: selectedVehicles[0] || Object.keys(defaultVehicleTypes)[0]
    };
    setConnections([...connections, newConnection]);
  };

  const updateConnection = (id, field, value) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id ? { ...conn, [field]: value } : conn
    ));
  };

  const removeConnection = (id) => {
    setConnections(prev => prev.filter(conn => conn.id !== id));
  };

  const calculateResults = () => {
    const calculationResults = calculateFleetSize(
      connections, 
      defaultVehicleTypes, 
      operatingHours, 
      availabilityTarget, 
      trafficDensity
    );
    setResults(calculationResults);
    setCurrentStep(4);
  };

  const runWhatIfAnalysis = (newAvailability, newTraffic) => {
    const whatIfResults = calculateFleetSize(
      connections,
      defaultVehicleTypes,
      operatingHours,
      newAvailability,
      newTraffic
    );
    return whatIfResults;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: currentTheme.primary }}>
          AGV Vehicle Selection
        </h2>
        <p className="text-lg" style={{ color: currentTheme.text }}>
          Choose the AGV models for your fleet analysis
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: currentTheme.text }}>
          Available AGV Models
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(defaultVehicleTypes).map(([type, vehicle]) => (
            <VehicleCard
              key={type}
              vehicleType={type}
              vehicle={vehicle}
              useMetric={useMetric}
              onSelect={handleVehicleSelect}
              isSelected={selectedVehicles.includes(type)}
            />
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">
          Selected Vehicles ({selectedVehicles.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {selectedVehicles.map(type => (
            <span key={type} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: currentTheme.primary }}>
          System Configuration
        </h2>
        <p className="text-lg" style={{ color: currentTheme.text }}>
          Configure operational parameters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
            Operating Hours per Day
          </label>
          <input
            type="number"
            value={operatingHours}
            onChange={(e) => setOperatingHours(parseInt(e.target.value))}
            className="w-full p-3 border rounded-lg"
            min="1"
            max="24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
            Unit System
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setUseMetric(false)}
              className={`px-4 py-2 rounded-lg font-medium ${
                !useMetric ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Imperial
            </button>
            <button
              onClick={() => setUseMetric(true)}
              className={`px-4 py-2 rounded-lg font-medium ${
                useMetric ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Metric
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
            System Availability Target (%)
          </label>
          <input
            type="number"
            value={availabilityTarget}
            onChange={(e) => setAvailabilityTarget(parseInt(e.target.value))}
            className="w-full p-3 border rounded-lg"
            min="80"
            max="99"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
            Traffic Density
          </label>
          <select
            value={trafficDensity}
            onChange={(e) => setTrafficDensity(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="low">Low - Minimal congestion</option>
            <option value="moderate">Moderate - Normal operations</option>
            <option value="high">High - Heavy traffic areas</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: currentTheme.primary }}>
          Route Configuration
        </h2>
        <p className="text-lg" style={{ color: currentTheme.text }}>
          Define your AGV routes and requirements
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold" style={{ color: currentTheme.text }}>
          Routes ({connections.length})
        </h3>
        <button
          onClick={addConnection}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Route
        </button>
      </div>

      <div className="space-y-4">
        {connections.map(connection => (
          <div key={connection.id} className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-lg">Route #{connection.id}</h4>
              <button
                onClick={() => removeConnection(connection.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">From Location</label>
                <input
                  type="text"
                  value={connection.from}
                  onChange={(e) => updateConnection(connection.id, 'from', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Start location"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">To Location</label>
                <input
                  type="text"
                  value={connection.to}
                  onChange={(e) => updateConnection(connection.id, 'to', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="End location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Distance ({unitConversions.getDistanceUnit(useMetric)})
                </label>
                <input
                  type="number"
                  value={connection.distance}
                  onChange={(e) => updateConnection(connection.id, 'distance', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Throughput (trips/hour)</label>
                <input
                  type="number"
                  value={connection.throughput}
                  onChange={(e) => updateConnection(connection.id, 'throughput', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                <select
                  value={connection.vehicleType}
                  onChange={(e) => updateConnection(connection.id, 'vehicleType', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {Object.entries(defaultVehicleTypes).map(([type, vehicle]) => (
                    <option key={type} value={type}>{vehicle.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        {connections.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No routes configured yet</p>
            <button
              onClick={addConnection}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Route
            </button>
          </div>
        )}
      </div>

      {connections.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={calculateResults}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Calculate Fleet Size
          </button>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: currentTheme.primary }}>
          Fleet Analysis Results
        </h2>
        <p className="text-lg" style={{ color: currentTheme.text }}>
          Recommended fleet size and configuration
        </p>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Total Fleet Size</h3>
            <div className="text-3xl font-bold text-green-600">{results.totalFleet}</div>
            <div className="text-sm text-green-700">AGVs Required</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">System Utilization</h3>
            <div className="text-3xl font-bold text-blue-600">{results.utilization}%</div>
            <div className="text-sm text-blue-700">Efficiency Rating</div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Charging Stations</h3>
            <div className="text-3xl font-bold text-orange-600">{results.chargingStations}</div>
            <div className="text-sm text-orange-700">Stations Needed</div>
          </div>
        </div>
      )}

      {/* Live Calculations Display */}
      {results && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: currentTheme.primary }}>
            Live Calculation Formulas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Fleet Sizing Formula:</h4>
              <div className="bg-gray-50 p-3 rounded font-mono">
                Fleet Size = ⌈(Throughput ÷ Vehicles/Hour) ÷ Availability⌉
              </div>
              <p className="mt-2 text-gray-600">
                Where Vehicles/Hour = 60 ÷ (Cycle Time × Traffic Multiplier)
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Battery Consumption:</h4>
              <div className="bg-gray-50 p-3 rounded font-mono">
                Consumption = (Amp Draw × Time) + Accessory Usage
              </div>
              <p className="mt-2 text-gray-600">
                Remaining = Battery Capacity - Total Consumption
              </p>
            </div>
          </div>
        </div>
      )}

      {/* What-If Analysis */}
      {results && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold" style={{ color: currentTheme.primary }}>
              What-If Scenario Analysis
            </h3>
            <button
              onClick={() => setShowWhatIf(!showWhatIf)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {showWhatIf ? 'Hide' : 'Show'} Analysis
            </button>
          </div>
          
          {showWhatIf && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h4 className="font-semibold text-green-800 mb-2">High Availability (98%)</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {runWhatIfAnalysis(98, trafficDensity).totalFleet} AGVs
                  </div>
                  <div className="text-sm text-green-700">
                    +{runWhatIfAnalysis(98, trafficDensity).totalFleet - results.totalFleet} vehicles
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">High Traffic Density</h4>
                  <div className="text-2xl font-bold text-yellow-600">
                    {runWhatIfAnalysis(availabilityTarget, 'high').totalFleet} AGVs
                  </div>
                  <div className="text-sm text-yellow-700">
                    +{runWhatIfAnalysis(availabilityTarget, 'high').totalFleet - results.totalFleet} vehicles
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Worst Case (98% + High Traffic)</h4>
                  <div className="text-2xl font-bold text-red-600">
                    {runWhatIfAnalysis(98, 'high').totalFleet} AGVs
                  </div>
                  <div className="text-sm text-red-700">
                    +{runWhatIfAnalysis(98, 'high').totalFleet - results.totalFleet} vehicles
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts and Analysis */}
      {results && (
        <FleetCharts results={results} theme={currentTheme} />
      )}

      {/* Executive Summary */}
      {results && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: currentTheme.primary }}>
            Executive Summary
          </h3>
          <div className="prose max-w-none">
            <p className="mb-4">
              <strong>Fleet Recommendation:</strong> Deploy {results.totalFleet} AGVs across {connections.length} routes 
              to achieve {results.utilization}% system utilization during {operatingHours}-hour operations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-semibold mb-2">Key Metrics:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Total Fleet: {results.totalFleet} vehicles</li>
                  <li>Charging Stations: {results.chargingStations} units</li>
                  <li>System Availability: {availabilityTarget}%</li>
                  <li>Traffic Conditions: {trafficDensity} density</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Fleet Composition:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {Object.entries(results.fleetByVehicleType).map(([type, count]) => (
                    <li key={type}>{defaultVehicleTypes[type].name}: {count} units</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                <li>Implement staged deployment starting with highest throughput routes</li>
                <li>Monitor battery levels and schedule charging at 30% capacity</li>
                <li>Consider traffic management system for high-density areas</li>
                <li>Plan for {Math.ceil(results.totalFleet * 0.1)} spare vehicles for maintenance rotation</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: currentTheme.bg }}>
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="rounded-lg p-6 mb-6 shadow-lg" style={{ backgroundColor: currentTheme.primary }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Bastian Solutions AGV Fleet Calculator
              </h1>
              <p className="text-blue-100">Professional-grade fleet sizing tool</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg"
            >
              {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center">
            <div className="flex space-x-4">
              {[
                { step: 1, label: 'Vehicles' },
                { step: 2, label: 'System' },
                { step: 3, label: 'Routes' },
                { step: 4, label: 'Results' }
              ].map(({ step, label }) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    currentStep >= step
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-800 text-white opacity-60'
                  }`}
                >
                  {step}. {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-lg shadow-lg p-8" style={{ backgroundColor: currentTheme.cardBg }}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              disabled={currentStep === 4}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 4
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;