// Enhanced calculation functions
export const calculateTravelTime = (distance, maxSpeed, acceleration, deceleration, turnCount, turnTime) => {
  const d = Math.max(0, parseFloat(distance) || 0);
  const vMax = Math.max(0.1, parseFloat(maxSpeed) || 0.5);
  const a = Math.max(0.1, parseFloat(acceleration) || 0.2);
  const dec = Math.max(0.1, parseFloat(deceleration) || 0.3);
  const turns = Math.max(0, parseInt(turnCount) || 0);
  const tTurn = Math.max(0, parseFloat(turnTime) || 3.0);

  // Physics: v² = u² + 2as, where u=0, so v² = 2as, therefore s = v²/2a
  const dAccelMax = Math.pow(vMax, 2) / (2 * a); // Max distance needed to reach vMax
  const dDecelMax = Math.pow(vMax, 2) / (2 * dec); // Max distance needed to stop from vMax
  
  // Check if we have enough distance to reach max speed
  const dAccel = Math.min(d / 2, dAccelMax);
  const dDecel = Math.min(d / 2, dDecelMax);
  
  // Physics: v = u + at, where u=0, so v = at, therefore t = v/a
  // But since s = ½at², we get t = √(2s/a)
  const tAccel = Math.sqrt(2 * dAccel / a);
  const tDecel = Math.sqrt(2 * dDecel / dec);
  
  // Actual speeds reached during acceleration/deceleration
  const vAccelEnd = Math.sqrt(2 * a * dAccel);
  const vDecelStart = Math.sqrt(2 * dec * dDecel);
  const actualMaxSpeed = Math.min(vAccelEnd, vDecelStart, vMax);
  
  // Cruise phase calculations
  const dCruise = Math.max(0, d - dAccel - dDecel);
  const tCruise = dCruise > 0 ? dCruise / actualMaxSpeed : 0;
  
  // Check if vehicle actually reaches max speed
  const reachesMaxSpeed = actualMaxSpeed >= vMax * 0.99; // Within 1% of max speed
  
  // Total time calculations
  const tStraight = tAccel + tCruise + tDecel;
  const tTurnTotal = turns * tTurn;
  const tTotal = tStraight + tTurnTotal;
  const tTotalMin = tTotal / 60;
  
  // Calculate average speed (total distance / total time)
  const avgSpeed = d > 0 && tTotal > 0 ? d / tTotal : 0;
  
  return {
    distance: d,
    maxSpeed: vMax,
    acceleration: a,
    deceleration: dec,
    turnCount: turns,
    turnTime: tTurn,
    accelerationTime: tAccel,
    accelerationDistance: dAccel,
    cruiseTime: tCruise,
    cruiseDistance: dCruise,
    decelerationTime: tDecel,
    decelerationDistance: dDecel,
    straightLineTime: tStraight,
    totalTurnTime: tTurnTotal,
    totalTimeSeconds: tTotal,
    totalMinutes: tTotalMin,
    averageSpeed: avgSpeed,
    reachesMaxSpeed: reachesMaxSpeed,
    actualMaxSpeedReached: actualMaxSpeed
  };
};

export const calculateBatteryConsumption = (vehicle, travelData, accessoryUsage = []) => {
  const { totalTimeSeconds, distance } = travelData;
  const operationTimeHours = totalTimeSeconds / 3600;
  
  // Base consumption during travel
  const travelConsumption = vehicle.nominalAmpDraw * operationTimeHours;
  
  // Accessory consumption
  let accessoryConsumption = 0;
  accessoryUsage.forEach(accessory => {
    if (accessory.baseTime === 0) { // Continuous operation
      accessoryConsumption += accessory.ampDraw * operationTimeHours;
    } else {
      const cycleTime = accessory.baseTime / 3600; // Convert to hours
      accessoryConsumption += accessory.ampDraw * cycleTime;
    }
  });
  
  const totalConsumption = travelConsumption + accessoryConsumption;
  const batteryRemaining = vehicle.batteryCapacity - totalConsumption;
  const batteryPercentage = (batteryRemaining / vehicle.batteryCapacity) * 100;
  
  return {
    travelConsumption,
    accessoryConsumption,
    totalConsumption,
    batteryRemaining: Math.max(0, batteryRemaining),
    batteryPercentage: Math.max(0, Math.min(100, batteryPercentage)),
    chargeTime: totalConsumption / vehicle.chargeRate
  };
};

export const calculateFleetSize = (connections, vehicleTypes, operatingHours, availabilityTarget, trafficDensity) => {
  const validConnections = connections.filter(conn => 
    conn.distance && conn.throughput && conn.vehicleType
  );

  let totalFleet = 0;
  let fleetByVehicleType = {};
  let routeAnalysis = [];
  let batteryAnalysis = [];
  
  const availabilityFactor = (availabilityTarget || 95) / 100;
  const trafficMultiplier = trafficDensity === 'high' ? 1.3 : trafficDensity === 'moderate' ? 1.15 : 1.0;

  for (const conn of validConnections) {
    const vehicle = vehicleTypes[conn.vehicleType];
    const travelTime = calculateTravelTime(
      conn.distance,
      vehicle.maxSpeed,
      vehicle.acceleration,
      vehicle.deceleration,
      conn.turnCount || 0,
      vehicle.turnTime
    );

    // Advanced fleet sizing calculation
    const cycleTime = travelTime.totalMinutes * 2; // Round trip
    const effectiveCycleTime = cycleTime * trafficMultiplier;
    const vehiclesPerHour = 60 / effectiveCycleTime;
    const requiredVehicles = Math.ceil((conn.throughput / vehiclesPerHour) / availabilityFactor);
    
    totalFleet += requiredVehicles;
    
    if (!fleetByVehicleType[conn.vehicleType]) {
      fleetByVehicleType[conn.vehicleType] = 0;
    }
    fleetByVehicleType[conn.vehicleType] += requiredVehicles;
    
    // Route analysis data for charts
    routeAnalysis.push({
      route: `${conn.from} → ${conn.to}`,
      vehicleType: conn.vehicleType,
      distance: conn.distance,
      throughput: conn.throughput,
      cycleTime: effectiveCycleTime,
      vehiclesRequired: requiredVehicles,
      utilization: Math.min(95, (conn.throughput / (vehiclesPerHour * requiredVehicles)) * 100)
    });
    
    // Battery analysis for each route
    const accessoryUsage = vehicle.accessories || [];
    const batteryData = calculateBatteryConsumption(vehicle, travelTime, accessoryUsage);
    batteryAnalysis.push({
      route: `${conn.from} → ${conn.to}`,
      vehicleType: conn.vehicleType,
      batteryUsed: batteryData.totalConsumption,
      batteryRemaining: batteryData.batteryPercentage,
      chargeTimeNeeded: batteryData.chargeTime
    });
  }
  
  // Calculate system-wide metrics
  const avgUtilization = routeAnalysis.length > 0 
    ? routeAnalysis.reduce((sum, route) => sum + route.utilization, 0) / routeAnalysis.length 
    : 85;
  
  const chargingStations = Math.ceil(totalFleet / 4);
  
  // Generate time-based battery depletion data
  const batteryDepletionData = [];
  for (let hour = 0; hour <= operatingHours; hour++) {
    const depletionRate = 8; // Average % per hour
    batteryDepletionData.push({
      hour,
      batteryLevel: Math.max(0, 100 - (hour * depletionRate))
    });
  }

  return {
    totalFleet,
    fleetByVehicleType,
    utilization: Math.round(avgUtilization),
    chargingStations,
    routeAnalysis,
    batteryAnalysis,
    batteryDepletionData,
    operatingHours,
    availabilityTarget,
    trafficDensity
  };
};