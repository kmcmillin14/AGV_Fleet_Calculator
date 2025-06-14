import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const FleetCharts = ({ results, theme }) => {
  if (!results) return null;

  const colors = ['#1e3a4f', '#2a4f69', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

  // Prepare data for route analysis bar chart
  const routeData = results.routeAnalysis?.map(route => ({
    ...route,
    shortRoute: route.route.length > 15 ? route.route.substring(0, 12) + '...' : route.route
  })) || [];

  // Prepare data for fleet composition pie chart
  const fleetCompositionData = Object.entries(results.fleetByVehicleType).map(([type, count], index) => ({
    name: type,
    value: count,
    color: colors[index % colors.length]
  }));

  // Prepare data for utilization comparison
  const utilizationData = results.routeAnalysis?.map(route => ({
    route: route.route.length > 10 ? route.route.substring(0, 8) + '...' : route.route,
    utilization: route.utilization,
    target: 85
  })) || [];

  return (
    <div className="space-y-8">
      {/* Route Analysis Bar Chart */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: theme.primary }}>
          AGV Route Analysis
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={routeData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="shortRoute" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'vehiclesRequired' ? `${value} AGVs` : 
                  name === 'throughput' ? `${value} trips/hr` :
                  name === 'cycleTime' ? `${value.toFixed(1)} min` :
                  name === 'distance' ? `${value} m` : value,
                  name === 'vehiclesRequired' ? 'Vehicles Required' :
                  name === 'throughput' ? 'Throughput' :
                  name === 'cycleTime' ? 'Cycle Time' :
                  name === 'distance' ? 'Distance' : name
                ]}
                labelFormatter={(label) => `Route: ${results.routeAnalysis?.find(r => r.route.includes(label))?.route || label}`}
              />
              <Legend />
              <Bar dataKey="vehiclesRequired" fill={colors[0]} name="Vehicles Required" />
              <Bar dataKey="throughput" fill={colors[1]} name="Throughput (trips/hr)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fleet Composition and Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Composition Pie Chart */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: theme.primary }}>
            Fleet Composition
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fleetCompositionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fleetCompositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} AGVs`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Utilization Comparison */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: theme.primary }}>
            Route Utilization vs Target
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="route" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value, name) => [`${value.toFixed(1)}%`, name === 'utilization' ? 'Actual Utilization' : 'Target']} />
                <Legend />
                <Bar dataKey="utilization" fill={colors[2]} name="Actual Utilization" />
                <Bar dataKey="target" fill={colors[3]} name="Target Utilization" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Battery Depletion Line Chart */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: theme.primary }}>
          Battery Depletion Over Operating Hours
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={results.batteryDepletionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                label={{ value: 'Operating Hours', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                domain={[0, 100]}
                label={{ value: 'Battery Level (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Battery Level']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="batteryLevel" 
                stroke={colors[0]} 
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                name="Average Battery Level"
              />
              <Line 
                type="monotone" 
                dataKey={() => 20} 
                stroke="#dc2626" 
                strokeDasharray="5 5"
                name="Critical Level (20%)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Charging Strategy:</strong> Based on the depletion curve, schedule charging when battery levels approach 30% 
            to maintain operational efficiency and avoid critical shutdowns.
          </p>
        </div>
      </div>

      {/* Battery Analysis Table */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: theme.primary }}>
          Battery Analysis by Route
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold">Route</th>
                <th className="text-left p-3 font-semibold">Vehicle Type</th>
                <th className="text-left p-3 font-semibold">Battery Used (Ah)</th>
                <th className="text-left p-3 font-semibold">Remaining (%)</th>
                <th className="text-left p-3 font-semibold">Charge Time (hrs)</th>
              </tr>
            </thead>
            <tbody>
              {results.batteryAnalysis?.map((battery, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 text-sm">{battery.route}</td>
                  <td className="p-3 text-sm font-medium">{battery.vehicleType}</td>
                  <td className="p-3 text-sm">{battery.batteryUsed.toFixed(1)}</td>
                  <td className="p-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      battery.batteryRemaining > 50 ? 'bg-green-100 text-green-800' :
                      battery.batteryRemaining > 30 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {battery.batteryRemaining.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3 text-sm">{battery.chargeTimeNeeded.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FleetCharts;