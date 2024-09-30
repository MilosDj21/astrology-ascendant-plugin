import { useState } from "react";

const App = () => {
  const [birthData, setBirthData] = useState({
    year: 1995,
    month: 8,
    day: 30,
    hour: 10,
    minute: 15,
    second: 0,
    latitude: 40.7128,
    longitude: -74.006,
  });

  const [ascendant, setAscendant] = useState("");

  // Step 1: Calculate Julian Date
  const julianDate = (year, month, day, hour, minute, second) => {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5 + (hour + minute / 60 + second / 3600) / 24;
    return JD;
  };

  // Step 2: Greenwich Mean Sidereal Time (GMST)
  const greenwichMeanSiderealTime = (JD) => {
    const T = (JD - 2451545.0) / 36525.0;
    let GMST = 280.46061837 + 360.98564736629 * (JD - 2451545) + T * T * (0.000387933 - T / 38710000.0);
    GMST = GMST % 360.0;
    return GMST;
  };

  // Step 3: Local Sidereal Time (LST)
  const localSiderealTime = (GMST, longitude) => {
    let LST = GMST + longitude;
    LST = LST % 360.0;
    return LST;
  };

  // Step 4: Calculate the Ascendant
  const calculateAscendant = (LST, latitude) => {
    const eclipticObliquity = 23.439281; // Obliquity of the ecliptic in degrees
    LST = (LST * 15 * Math.PI) / 180; // Convert LST from degrees to radians
    latitude = (latitude * Math.PI) / 180; // Convert latitude to radians
    const eclipticObliquityRad = (eclipticObliquity * Math.PI) / 180;

    const tanLST = Math.tan(LST);
    const ascendantRadians = Math.atan(tanLST / Math.cos(latitude));

    let ascendantDegrees = (ascendantRadians * 180) / Math.PI; // Convert back to degrees

    if (Math.cos(LST) < 0) {
      ascendantDegrees += 180;
    }

    ascendantDegrees = ascendantDegrees % 360; // Keep within 0-360 degrees
    return ascendantDegrees;
  };

  // Step 5: Map Ascendant Degree to Zodiac Sign
  const zodiacSign = (degree) => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const signIndex = Math.floor(degree / 30);
    return signs[signIndex];
  };

  const calculateAscendantSign = () => {
    const { year, month, day, hour, minute, second, latitude, longitude } = birthData;

    const JD = julianDate(year, month, day, hour, minute, second);
    const GMST = greenwichMeanSiderealTime(JD);
    const LST = localSiderealTime(GMST, longitude);
    const ascendantDegree = calculateAscendant(LST, latitude);
    const ascendantSign = zodiacSign(ascendantDegree);

    setAscendant(`${ascendantSign} at ${ascendantDegree.toFixed(2)} degrees`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <label>Godina: </label>
        <input type="number" value={birthData.year} onChange={(e) => setBirthData({ ...birthData, year: Number(e.target.value) })} />
      </div>

      <div>
        <label>Mesec: </label>
        <select value={birthData.month} onChange={(e) => setBirthData({ ...birthData, month: Number(e.target.value) })}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        {/* <input type="number" value={birthData.month} onChange={(e) => setBirthData({ ...birthData, month: Number(e.target.value) })} /> */}
      </div>

      <div>
        <label>Dan: </label>
        <input type="number" value={birthData.day} onChange={(e) => setBirthData({ ...birthData, day: Number(e.target.value) })} />
      </div>

      <div>
        <label>Hour: </label>
        <input type="number" value={birthData.hour} onChange={(e) => setBirthData({ ...birthData, hour: Number(e.target.value) })} />
      </div>

      <div>
        <label>Minute: </label>
        <input type="number" value={birthData.minute} onChange={(e) => setBirthData({ ...birthData, minute: Number(e.target.value) })} />
      </div>

      <div>
        <label>Latitude: </label>
        <input type="number" value={birthData.latitude} onChange={(e) => setBirthData({ ...birthData, latitude: Number(e.target.value) })} />
      </div>

      <div>
        <label>Longitude: </label>
        <input type="number" value={birthData.longitude} onChange={(e) => setBirthData({ ...birthData, longitude: Number(e.target.value) })} />
      </div>

      <button onClick={calculateAscendantSign}>Calculate Ascendant</button>

      {ascendant && (
        <div>
          <h3>Your Ascendant is: {ascendant}</h3>
        </div>
      )}
    </div>
  );
};

export default App;
