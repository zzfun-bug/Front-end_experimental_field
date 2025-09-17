const ak = 'N777CZMTHKGqTpopH79cFoYiItgrxPpn';   // 如果 server.js 已强制补 ak，这里可留空

/* 1. 逆地理 → adcode */
async function getCityCode({ latitude: lat, longitude: lng }) {
  const url = `/map/reverse_geocoding/v3/?coordtype=wgs84ll&location=${lat},${lng}&output=json&ak=${ak}`;
  const res = await fetch(url);
  const data = await res.json();
  // 核心容错：status ≠ 0 就抛
  if (data.status !== 0 || !data.result) {
    throw new Error(`逆地理失败 status=${data.status}·${data.msg || ''}`);
  }
  return data.result.addressComponent.adcode;
}

/* 2. 天气 */
async function getWeather(adcode) {
  const url = `/map/weather/v1/?district_id=${adcode}&data_type=all&ak=${ak}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 0 || !data.result) {
    throw new Error(`天气接口失败 status=${data.status}`);
  }
  return data.result;
}

/* 3. 渲染 */
function render({ location, now, forecasts }) {
  document.getElementById('city').textContent     = location.name;
  document.getElementById('temp').textContent     = now.temp + '°';
  document.getElementById('desc').textContent     = now.text;
  document.getElementById('forecast').innerHTML = forecasts.slice(0, 5).map(d => `
    <div>
      <p>${d.week}</p>
      <p>${d.high}°/${d.low}°</p>
    </div>
  `).join('');
}

/* 4. 错误提示 */
function showError(msg) {
  document.getElementById('city').textContent = '提示';
  document.getElementById('temp').textContent = '⚠️';
  document.getElementById('desc').textContent = msg;
  document.getElementById('forecast').innerHTML = '';
}

/* 5. 主流程 */
(async () => {
  try {
    const pos     = await getPos();
    const adcode  = await getCityCode(pos);
    const weather = await getWeather(adcode);
    render(weather);
  } catch (e) {
    console.error(e);
    showError(e.message.includes('status')
      ? '获取城市失败，已用北京兜底'
      : '定位失败，已用北京兜底');
    // 兜底北京
    const weather = await getWeather(110000);
    render(weather);
  }
})();

/* 6. 获取位置封装 */
function getPos() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject('浏览器不支持定位');
    navigator.geolocation.getCurrentPosition(
      p => resolve(p.coords),
      err => reject(err),
      { timeout: 8000 }
    );
  });
}