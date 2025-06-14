export const defaultVehicleTypes = {
  "8TB50A": {
    name: "Toyota 8TB50A - Core Tow Tractor",
    maxPayload: 4540, // kg
    maxSpeed: 1.79, // m/s
    acceleration: 0.3, // m/s^2
    deceleration: 0.4, // m/s^2
    turnTime: 5.0, // seconds
    batteryCapacity: 280, // Amp-hours
    nominalAmpDraw: 35, // Amps during normal operation
    chargeRate: 40, // Amps charging rate
    description: "Heavy-duty tow tractor for material transport",
    accessories: []
  },
  "8HBC40A": {
    name: "Toyota 8HBC40A - Center-Controlled Rider",
    maxPayload: 2725, // kg
    maxSpeed: 2.24, // m/s
    acceleration: 0.4, // m/s^2
    deceleration: 0.5, // m/s^2
    turnTime: 3.8, // seconds
    batteryCapacity: 210, // Amp-hours
    nominalAmpDraw: 28, // Amps during normal operation
    chargeRate: 35, // Amps charging rate
    description: "Center-controlled rider for efficient pallet handling",
    accessories: []
  },
  "M10": {
    name: "M10 Tug AV",
    maxPayload: 1000, // kg
    maxSpeed: 0.83, // m/s
    acceleration: 0.3, // m/s^2
    deceleration: 0.4, // m/s^2
    turnTime: 3.5, // seconds
    batteryCapacity: 100, // Amp-hours
    nominalAmpDraw: 15, // Amps during normal operation
    chargeRate: 25, // Amps charging rate
    description: "Designed for pallet transportation",
    accessories: []
  },
  "ML2": {
    name: "ML2 Mini Load AV",
    maxPayload: 200, // kg
    maxSpeed: 1.8, // m/s
    acceleration: 0.5, // m/s^2
    deceleration: 0.6, // m/s^2
    turnTime: 2.8, // seconds
    batteryCapacity: 80, // Amp-hours
    nominalAmpDraw: 12, // Amps during normal operation
    chargeRate: 20, // Amps charging rate
    description: "Flexible platform with multiple material handling options",
    accessories: [
      { 
        name: "Lift Table", 
        baseTime: 8, // seconds operation time
        ampDraw: 25, // Additional amps when operating
        description: "Scissor lift mechanism for height adjustment" 
      },
      { 
        name: "Pin Assembly", 
        baseTime: 3, // seconds operation time
        ampDraw: 5, // Additional amps when operating
        description: "Automatic pin engagement system" 
      },
      { 
        name: "Conveyor Topper", 
        baseTime: 0, // Continuous operation
        ampDraw: 8, // Continuous additional draw
        description: "Variable speed conveyor system" 
      },
      { 
        name: "Roller Top", 
        baseTime: 5, // seconds operation time
        ampDraw: 3, // Additional amps when operating
        description: "Gravity roller conveyor system" 
      }
    ]
  },
  "CB18": {
    name: "CB18 AGF",
    maxPayload: 1800, // kg
    maxSpeed: 3.0, // m/s
    acceleration: 0.2, // m/s^2
    deceleration: 0.3, // m/s^2
    turnTime: 4.2, // seconds
    batteryCapacity: 350, // Amp-hours
    nominalAmpDraw: 45, // Amps during normal operation
    chargeRate: 50, // Amps charging rate
    mastLiftTimePerMeter: 4, // seconds per meter of lift
    mastAmpDrawPerMeter: 30, // Additional amps per meter of lift
    description: "Forklift AGV for heavy loads",
    accessories: []
  },
  "OPPENT": {
    name: "Oppent E-Base 7",
    maxPayload: 1200, // kg
    maxSpeed: 1.4, // m/s
    acceleration: 0.4, // m/s^2
    deceleration: 0.5, // m/s^2
    turnTime: 3.0, // seconds
    batteryCapacity: 150, // Amp-hours
    nominalAmpDraw: 20, // Amps during normal operation
    chargeRate: 30, // Amps charging rate
    description: "Versatile platform with multiple accessory options",
    accessories: [
      { 
        name: "Lift Table", 
        baseTime: 12, // seconds operation time
        ampDraw: 30, // Additional amps when operating
        description: "Hydraulic lift platform" 
      },
      { 
        name: "Pin Assembly", 
        baseTime: 4, // seconds operation time
        ampDraw: 8, // Additional amps when operating
        description: "Pneumatic pin system" 
      },
      { 
        name: "Conveyor Topper", 
        baseTime: 0, // Continuous operation
        ampDraw: 10, // Continuous additional draw
        description: "Integrated conveyor system" 
      }
    ]
  }
};