import React from 'react';
import { unitConversions } from '../utils/unitConversions';

const ConnectionCard = ({ connection, onUpdate, onRemove, vehicleTypes, useMetric }) => {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-medium text-lg text-gray-800">
          Route: {connection.from || 'Start'} → {connection.to || 'End'}
        </h4>
        <button
          onClick={() => onRemove(connection.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Location
          </label>
          <input
            type="text"
            value={connection.from}
            onChange={(e) => onUpdate(connection.id, 'from', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Start location"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Location
          </label>
          <input
            type="text"
            value={connection.to}
            onChange={(e) => onUpdate(connection.id, 'to', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="End location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Distance ({unitConversions.getDistanceUnit(useMetric)})
          </label>
          <input
            type="number"
            value={connection.distance}
            onChange={(e) => onUpdate(connection.id, 'distance', parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Throughput (trips/hour)
          </label>
          <input
            type="number"
            value={connection.throughput}
            onChange={(e) => onUpdate(connection.id, 'throughput', parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Type
          </label>
          <select
            value={connection.vehicleType}
            onChange={(e) => onUpdate(connection.id, 'vehicleType', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(vehicleTypes).map(([type, vehicle]) => (
              <option key={type} value={type}>
                {vehicle.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;