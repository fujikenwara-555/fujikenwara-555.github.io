/* wa12.js
   Minimal accessible demo:
   - Uses ipify -> ipinfo to get approximate lat/lon
   - Uses NREL Alt-Fuel Stations API to find E85 stations
   - Your NREL API key inserted below (you provided it)
   NOTE: For production, do not embed keys in client code.
*/

// ---------- CONFIG ----------
const NREL_API_KEY = 'BCO1aFMDzr1i6zx8JiFPSCiJmeOGoseaar45NgqJ'; // provided key
const NREL_ENDPOINT = 'https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json';

// ---------- UI refs ----------
const locBtn = document.getElementById('locBtn');
const findBtn = document.getElementById('findBtn');
const zipInput = document.getElementById('zipInput');
const radiusSel = document.getElementById('radius');
const statusEl = document.getElementById('status');
const stationsEl = document.getElementById('stations');
const resultsRegion = document.getElementById('results');

// ---------- helpers ----------
function setStatus(msg, isError = false){
  statusEl.textContent = msg;
  if(isError) statusEl.style.color = 'crimson'; else statusEl.style.color = '';
}
function clearStations(){ stationsEl.innerHTML = ''; }
function focusResults(){ resultsRegion.focus(); }

// ---------- IP -> geo using ipify + ipinfo ----------
async function getGeoFromIP(){
  setStatus('Getting your IP address…');
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipJson = await ipRes.json();
    const ip = ipJson.ip;
    setStatus('Getting location from IP…');
    // ipinfo endpoint (no token) returns city, region, country, loc (lat,long)
    const infoRes = await fetch(`https://ipinfo.io/${ip}/json`);
    const info = await infoRes.json();
    if(info.loc){
      const [lat, lon] = info.loc.split(',');
      return {latitude: parseFloat(lat), longitude: parseFloat(lon), source: 'ip'};
    } else {
      throw new Error('No loc in ipinfo response');
    }
  } catch(err){
    console.error(err);
    setStatus('Could not determine location from IP.', true);
    return null;
  }
}

// ---------- ZIP -> geocode using NREL (nearest supports zip parameter) ----------
function buildNrelUrlByLatLon(lat, lon, radiusMiles, limit=20){
  const params = new URLSearchParams({
    api_key: NREL_API_KEY,
    fuel_type: 'E85',
    latitude: String(lat),
    longitude: String(lon),
    radius: String(radiusMiles),
    limit: String(limit)
  });
  return `${NREL_ENDPOINT}?${params.toString()}`;
}
function buildNrelUrlByZip(zip, radiusMiles, limit=20){
  const params = new URLSearchParams({
    api_key: NREL_API_KEY,
    fuel_type: 'E85',
    zip: zip,
    radius: String(radiusMiles),
    limit: String(limit)
  });
  return `${NREL_ENDPOINT}?${params.toString()}`;
}

// ---------- Render ----------
function renderStations(list){
  clearStations();
  if(!list || list.length === 0){
    setStatus('No E85 stations found in this area.');
    return;
  }
  setStatus(`Found ${list.length} station(s).`);
  list.forEach(s => {
    const li = document.createElement('li');
    li.className = 'station';
    li.setAttribute('role','listitem');

    const a = document.createElement('a');
    a.className = 'station-link';
    a.href = s.station_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.street + ' ' + s.city)}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', `${s.station_name}. ${s.street}, ${s.city}, ${s.state}. ${s.distance ? Math.round(s.distance*10)/10 + ' miles away.' : ''}`);

    const h3 = document.createElement('h3');
    h3.textContent = s.station_name || 'Station';

    const p1 = document.createElement('p');
    p1.textContent = `${s.street || ''} ${s.city || ''}, ${s.state || ''} ${s.zip || ''}`;

    const p2 = document.createElement('p');
    p2.textContent = `Access: ${s.access_code || s.access_days_time || 'N/A'}${s.distance ? ' • ' + (Math.round(s.distance*10)/10) + ' mi' : ''}`;

    a.appendChild(h3);
    a.appendChild(p1);
    a.appendChild(p2);
    li.appendChild(a);
    stationsEl.appendChild(li);
  });
  focusResults();
}

// ---------- Main search flow ----------
async function searchUsingIP(){
  setStatus('Attempting IP-based location…');
  const geo = await getGeoFromIP();
  if(!geo){
    setStatus('IP location failed. Try entering ZIP code.', true);
    return;
  }
  await queryNrelByLatLon(geo.latitude, geo.longitude);
}

async function queryNrelByLatLon(lat, lon){
  const radiusMiles = radiusSel.value || '10';
  setStatus('Searching NREL for E85 stations…');
  clearStations();
  try {
    const url = buildNrelUrlByLatLon(lat, lon, radiusMiles);
    const res = await fetch(url);
    if(!res.ok) throw new Error('NREL fetch failed: ' + res.status);
    const json = await res.json();
    // stations are in json.fuel_stations (array)
    renderStations(json.fuel_stations || []);
  } catch(err){
    console.error(err);
    setStatus('Search failed — API may be rate limited or key invalid.', true);
  }
}

async function queryNrelByZip(zip){
  const radiusMiles = radiusSel.value || '10';
  if(!zip || zip.trim().length < 3){ setStatus('Enter a valid ZIP code.', true); zipInput.focus(); return; }
  setStatus('Searching NREL by ZIP…');
  clearStations();
  try {
    const url = buildNrelUrlByZip(zip.trim(), radiusMiles);
    const res = await fetch(url);
    if(!res.ok) throw new Error('NREL fetch failed: ' + res.status);
    const json = await res.json();
    renderStations(json.fuel_stations || []);
  } catch(err){
    console.error(err);
    setStatus('Search failed — API may be rate limited or key invalid.', true);
  }
}

// ---------- Event handlers ----------
locBtn.addEventListener('click', (e) => { e.preventDefault(); searchUsingIP(); });
locBtn.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); searchUsingIP(); }});
findBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const zip = zipInput.value.trim();
  if(zip) queryNrelByZip(zip); else searchUsingIP();
});
findBtn.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); const zip = zipInput.value.trim(); if(zip) queryNrelByZip(zip); else searchUsingIP(); }});

// Allow Enter in ZIP to trigger search
zipInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); const zip = zipInput.value.trim(); if(zip) queryNrelByZip(zip); else searchUsingIP(); }});

// initial focus
document.getElementById('locBtn').focus();
