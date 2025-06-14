export const unitConversions = {
  getDistanceUnit: (useMetric) => useMetric ? "m" : "ft",
  getWeightUnit: (useMetric) => useMetric ? "kg" : "lbs",
  getSpeedUnit: (useMetric) => useMetric ? "m/s" : "mph",
  
  displayDistance: (meters, useMetric) => {
    if (!meters && meters !== 0) return "0.0";
    const metersValue = parseFloat(meters);
    if (isNaN(metersValue)) return "0.0";
    return useMetric ? metersValue.toFixed(1) : (metersValue * 3.28084).toFixed(1);
  },

  displayWeight: (kg, useMetric) => {
    if (!kg && kg !== 0) return "0";
    const kgValue = parseFloat(kg);
    if (isNaN(kgValue)) return "0";
    return useMetric ? kgValue.toFixed(0) : (kgValue * 2.20462).toFixed(0);
  },

  displaySpeed: (ms, useMetric) => {
    if (!ms && ms !== 0) return "0.0";
    const msValue = parseFloat(ms);
    if (isNaN(msValue)) return "0.0";
    return useMetric ? msValue.toFixed(1) : (msValue * 2.23694).toFixed(1);
  },

  convertDistanceToMeters: (inputValue, useMetric) => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return 0;
    return useMetric ? value : value * 0.3048;
  },

  convertMetersToDisplay: (meters, useMetric) => {
    const value = parseFloat(meters);
    if (isNaN(value)) return 0;
    return useMetric ? value : value * 3.28084;
  }
};