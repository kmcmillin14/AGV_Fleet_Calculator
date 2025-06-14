import React from 'react';
import { unitConversions } from '../utils/unitConversions';

const VehicleCard = ({ vehicleType, vehicle, useMetric, onSelect, isSelected }) => {
  return (
    <div 
      className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(vehicleType)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-800">{vehicleType}</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {vehicle.name.split(' ')[0]}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center">
          <div className="text-gray-400 text-xs text-center">
            <div className="text-lg mb-1">VEH</div>
            <div>{vehicleType}</div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {vehicle.description}
      </p>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-white rounded p-2 border">
          <div className="text-gray-500 text-xs uppercase tracking-wide">Max Payload</div>
          <div className="font-semibold text-gray-800">
            {unitConversions.displayWeight(vehicle.maxPayload, useMetric)} {unitConversions.getWeightUnit(useMetric)}
          </div>
        </div>
        
        <div className="bg-white rounded p-2 border">
          <div className="text-gray-500 text-xs uppercase tracking-wide">Max Speed</div>
          <div className="font-semibold text-gray-800">
            {unitConversions.displaySpeed(vehicle.maxSpeed, useMetric)} {unitConversions.getSpeedUnit(useMetric)}
          </div>
        </div>
        
        <div className="bg-white rounded p-2 border">
          <div className="text-gray-500 text-xs uppercase tracking-wide">Battery</div>
          <div className="font-semibold text-gray-800">
            {vehicle.batteryCapacity} Ah
          </div>
        </div>
        
        <div className="bg-white rounded p-2 border">
          <div className="text-gray-500 text-xs uppercase tracking-wide">Acceleration</div>
          <div className="font-semibold text-gray-800">
            {vehicle.acceleration} m/s²
          </div>
        </div>
      </div>
      
      {vehicle.accessories && vehicle.accessories.length > 0 && (
        <div className="mt-4 pt-3 border-t">
          <div className="text-xs font-medium text-gray-600 mb-2">
            Available Accessories ({vehicle.accessories.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {vehicle.accessories.slice(0, 3).map((accessory, index) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {accessory.name}
              </span>
            ))}
            {vehicle.accessories.length > 3 && (
              <span className="text-xs text-gray-500">+{vehicle.accessories.length - 3} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleCard;