import { useState } from "react";

const App = () => {
  const startDate = new Date();
  const [isValidDate, setIsValidDate] = useState(true);
  const [coordinates, setCoordinates] = useState("");
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
    console.log(birthData);

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
        <label>Grad: </label>
        <select
          value={coordinates}
          onChange={(e) => {
            const coordSplit = e.target.value.split("|");
            setCoordinates(e.target.value);
            setBirthData({ ...birthData, latitude: Number(coordSplit[0]), longitude: Number(coordSplit[1]) });
          }}>
          <option disabled>Srbija</option>
          <option selected value="44.8125|20.4612">
            Beograd
          </option>
          <option value="45.2396|19.8227">Novi Sad</option>
          <option value="43.3209|21.8954">Niš</option>
          <option value="42.6629|21.1655">Priština</option>
          <option value="44.0128|20.9114">Kragujevac</option>
          <option value="46.0970|19.6576">Subotica</option>
          <option value="42.9963|21.9430">Leskovac</option>
          <option value="43.5787|21.3357">Kruševac</option>
          <option value="43.7238|20.6873">Kraljevo</option>
          <option value="45.3834|20.3906">Zrenjanin</option>
          <option value="44.8706|20.6480">Pančevo</option>
          <option value="43.8914|20.3506">Čačak</option>
          <option value="44.7553|19.6923">Šabac</option>
          <option value="43.1407|20.5181">Novi Pazar</option>
          <option value="44.6620|20.9302">Smederevo</option>
          <option value="44.2742|19.8837">Valjevo</option>
          <option value="42.5521|21.8989">Vranje</option>
          <option value="45.7733|19.1151">Sombor</option>
          <option value="44.9798|19.6102">Sremska Mitrovica</option>
          <option value="44.5338|19.2238">Loznica</option>
          <option value="43.8556|19.8425">Užice</option>
          <option disabled>BIH</option>
          <option value="43.8563|18.4131">Sarajevo</option>
          <option value="44.7722|17.1910">Banja Luka</option>
          <option value="44.5375|18.6735">Tuzla</option>
          <option value="44.2034|17.9077">Zenica</option>
          <option value="44.7570|19.2150">Bijeljina</option>
          <option value="43.3438|17.8078">Mostar</option>
          <option value="44.9778|16.7061">Prijedor</option>
          <option value="44.8727|18.8106">Brčko</option>
          <option value="44.7349|18.0843">Doboj</option>
          <option value="44.3865|19.1048">Zvornik</option>
          <option disabled>Crna Gora</option>
          <option value="42.4304|19.2594">Podgorica</option>
          <option value="42.7805|18.9562">Nikšić</option>
          <option value="43.3582|19.3513">Pljevlja</option>
          <option value="43.0369|19.7562">Bijelo Polje</option>
          <option value="42.3931|18.9116">Cetinje</option>
          <option value="42.0999|19.1000">Bar</option>
          <option value="42.4572|18.5315">Herceg Novi</option>
          <option value="42.8379|19.8604">Berane</option>
          <option value="42.2911|18.8403">Budva</option>
          <option value="42.4318|18.6990">Tivat</option>
          <option disabled>Hrvatska</option>
          <option value="45.8150|15.9819">Zagreb</option>
          <option value="43.5147|16.4435">Split</option>
          <option value="45.3271|14.4422">Rijeka</option>
          <option value="45.5550|18.6955">Osijek</option>
          <option value="44.1194|15.2314">Zadar</option>
          <option value="45.4929|15.5553">Karlovac</option>
          <option value="44.8666|13.8496">Pula</option>
          <option value="45.1631|18.0116">Slavonski Brod</option>
          <option value="42.6507|18.0944">Dubrovnik</option>
          <option value="45.0812|13.6387">Rovinj</option>
          <option disabled>Makedonija</option>
          <option value="41.9981|21.4254">Skoplje</option>
          <option value="41.0297|21.3292">Bitola</option>
          <option value="42.1333|21.7258">Kumanovo</option>
          <option value="41.3441|21.5528">Prilep</option>
          <option value="41.7165|21.7723">Veles</option>
          <option value="41.7464|22.1997">Štip</option>
          <option value="41.1231|20.8016">Ohrid</option>
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
