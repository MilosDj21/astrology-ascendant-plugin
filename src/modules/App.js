import { useState } from "react";

const App = () => {
  const startDate = new Date();
  const [isValidDate, setIsValidDate] = useState(true);
  const [birthData, setBirthData] = useState({
    year: startDate.getFullYear(),
    month: startDate.getMonth() + 1,
    day: startDate.getDate(),
    hour: 0,
    minute: 0,
    second: 0,
    latitude: 44.8125,
    longitude: 20.4612,
  });
  const [ascendant, setAscendant] = useState("");

  const validateInput = (value, min, max) => {
    if (typeof value === "number" && value < max && value >= min) {
      return true;
    }
    return false;
  };

  const isDateValid = (month, day) => {
    if (Number(month) === 2 && Number(day) > 28) {
      setIsValidDate(false);
      return false;
    }
    setIsValidDate(true);
    return true;
  };

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
    LST = (LST * 15 * Math.PI) / 180; // Convert LST from degrees to radians
    latitude = (latitude * Math.PI) / 180; // Convert latitude to radians

    const tanLST = Math.tan(LST);
    const ascendantRadians = Math.atan(tanLST / Math.cos(latitude));

    let ascendantDegrees = (ascendantRadians * 180) / Math.PI; // Convert back to degrees

    if (Math.cos(LST) < 0) {
      ascendantDegrees += 180;
    }

    ascendantDegrees = (ascendantDegrees + 360) % 360; // Keep within 0-360 degrees
    return ascendantDegrees;
  };

  // Step 5: Map Ascendant Degree to Zodiac Sign
  const zodiacSign = (degree) => {
    const signs = ["Ovan", "Bik", "Blizanci", "Rak", "Lav", "Devica", "Vaga", "Škorpija", "Strelac", "Jarac", "Vodolija", "Ribe"];
    const signIndex = Math.floor(degree / 30);
    return signs[signIndex];
  };

  const calculateAscendantSign = () => {
    setAscendant("");

    const { year, month, day, hour, minute, second, latitude, longitude } = birthData;

    if (!isDateValid(month, day)) return;

    const JD = julianDate(year, month, day, hour, minute, second);
    const GMST = greenwichMeanSiderealTime(JD);
    const LST = localSiderealTime(GMST, longitude);
    const ascendantDegree = calculateAscendant(LST, latitude);
    const ascendantSign = zodiacSign(ascendantDegree);

    setAscendant(ascendantSign);
  };

  return (
    <div className="mainDiv">
      <div className="inputDiv">
        <label>Godina: </label>
        <input
          type="number"
          min={startDate.getFullYear() - 100}
          max={startDate.getFullYear()}
          value={birthData.year}
          onChange={(e) => {
            setBirthData({ ...birthData, year: Number(e.target.value) });
          }}
          onBlur={(e) => {
            validateInput(Number(e.target.value), startDate.getFullYear() - 100, startDate.getFullYear() + 1)
              ? setBirthData({ ...birthData, year: Number(e.target.value) })
              : setBirthData({ ...birthData, year: startDate.getFullYear() });
          }}
        />
      </div>

      <div className="inputDiv">
        <label>Mesec: </label>
        <select
          value={birthData.month}
          onChange={(e) => {
            validateInput(Number(e.target.value), 1, 13) ? setBirthData({ ...birthData, month: Number(e.target.value) }) : setBirthData({ ...birthData, month: 1 });
          }}>
          <option value="1">Januar</option>
          <option value="2">Februar</option>
          <option value="3">Mart</option>
          <option value="4">April</option>
          <option value="5">Maj</option>
          <option value="6">Jun</option>
          <option value="7">Jul</option>
          <option value="8">Avgust</option>
          <option value="9">Septembar</option>
          <option value="10">Oktobar</option>
          <option value="11">Novembar</option>
          <option value="12">Decembar</option>
        </select>
      </div>

      <div className="inputDiv">
        <label>Dan: </label>
        <input
          type="number"
          min="1"
          max="31"
          value={birthData.day}
          onChange={(e) => {
            validateInput(Number(e.target.value), 1, 32) ? setBirthData({ ...birthData, day: Number(e.target.value) }) : setBirthData({ ...birthData, day: startDate.getDate() });
          }}
        />
      </div>

      <div className="inputDiv">
        <label>Sat: </label>
        <input
          type="number"
          min="0"
          max="23"
          value={birthData.hour}
          onChange={(e) => {
            validateInput(Number(e.target.value), 0, 24) ? setBirthData({ ...birthData, hour: Number(e.target.value) }) : setBirthData({ ...birthData, hour: 0 });
          }}
        />
      </div>

      <div className="inputDiv">
        <label>Minut: </label>
        <input
          type="number"
          min="0"
          max="59"
          step="5"
          value={birthData.minute}
          onChange={(e) => {
            validateInput(Number(e.target.value), 0, 60) ? setBirthData({ ...birthData, minute: Number(e.target.value) }) : setBirthData({ ...birthData, minute: 0 });
          }}
        />
      </div>

      <div className="inputDiv">
        <label>Država: </label>
        <select>
          <option value="sel">Srbija</option>
          <option value="sel">BIH</option>
          <option value="sel">Crna Gora</option>
          <option value="sel">Hrvatska</option>
          <option value="sel">Makedonija</option>
        </select>
      </div>

      <div className="buttonDiv">
        <button onClick={calculateAscendantSign}>Izračunaj podznak</button>
      </div>

      {!isValidDate && (
        <div>
          <span>Unesite datum u ispravnom formatu</span>
        </div>
      )}

      {ascendant && (
        <div className="outputDiv">
          <h2>Vaš podznak je: {ascendant}</h2>
        </div>
      )}
    </div>
  );
};

export default App;
