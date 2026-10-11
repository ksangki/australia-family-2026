'use strict';

(() => {
  const section = document.querySelector('#journey');
  const canvas = document.querySelector('#journey-map');
  const status = document.querySelector('#journey-status');
  const placesList = document.querySelector('#journey-places');
  const points = {
    wirye: {name:'송파 위례 일대',coords:[37.478,127.145],date:'9/29 출발 · 10/8 귀가',note:'집 주소가 아닌 지역 대표 위치입니다.',day:1},
    incheon: {name:'인천공항',coords:[37.469,126.434],date:'9/29 출국 · 10/8 귀국',note:'출국·귀국 공항입니다.',day:1},
    sydneyAirport: {name:'시드니공항',coords:[-33.94,151.18],date:'9/30 도착 · 10/4 국내선 이동',note:'공항을 대표하는 위치이며 실제 탑승 게이트는 아닙니다.',day:6},
    sydneyStay: {name:'시드니 숙소 주변',coords:[-33.872,151.204],date:'9/30–10/4 · 시드니 4박',note:'기존 숙소 자료와 사진에서 확인한 서섹스 스트리트 일대입니다.',day:2},
    darling: {name:'달링하버',coords:[-33.873,151.202],date:'9/30 · 항구 산책',note:'첫날 산책 사진의 위치를 단순화했습니다.',day:2},
    quay: {name:'서큘러 키',coords:[-33.861,151.212],date:'10/1 · 항구와 페리',note:'항구 산책과 페리 이동이 사진으로 확인됩니다.',day:3},
    opera: {name:'시드니 오페라하우스',coords:[-33.857,151.215],date:'10/1 · 오페라하우스',note:'외관 관람 사진으로 확인한 방문지입니다.',day:3},
    taronga: {name:'타롱가 동물원',coords:[-33.842,151.243],date:'10/1 · 동물원 관람',note:'페리 이동·동물원 입구·관람 사진으로 확인했습니다.',day:3},
    university: {name:'시드니대학교',coords:[-33.887,151.189],date:'10/2 · 캠퍼스·기념품점',note:'캠퍼스와 기념품점 방문 사진으로 확인했습니다.',day:4},
    market: {name:'마켓 시티 주변',coords:[-33.88,151.205],date:'10/2 · 도심 산책',note:'건물 앞에서 찍은 사진으로 확인한 지역입니다.',day:4},
    theatre: {name:'라이온킹 공연장 주변',coords:[-33.879,151.206],date:'10/3 · 라이온킹 관람',note:'공연장 앞·관람 사진의 위치를 단순화했습니다.',day:5},
    brisbaneDomestic: {name:'브리즈번 국내선 공항',coords:[-27.385,153.12],date:'10/4 · 국내선 도착',note:'시드니에서 도착한 뒤 골드코스트로 이동했습니다.',day:6},
    goldCoast: {name:'골드코스트 숙소·해변',coords:[-27.996,153.43],date:'10/4–10/7 · 골드코스트 3박',note:'서퍼스 파라다이스 숙소와 바다 사진으로 확인한 일대입니다.',day:6},
    currumbin: {name:'커럼빈 야생동물 보호구역',coords:[-28.135,153.488],date:'10/5 오전 · 커럼빈',note:'방문 대화와 동물원 사진으로 날짜를 확인했습니다.',day:7},
    surfers: {name:'서퍼스 파라다이스 해변',coords:[-28.002,153.431],date:'10/5–10/6 · 해변·밤 산책',note:'해변 표지와 낮·밤 산책 사진으로 확인했습니다.',day:8},
    hurricanes: {name:'허리케인스 그릴',coords:[-28.001,153.431],date:'10/5 · 가족 저녁',note:'예약 대화와 식사 사진으로 확인한 방문지입니다.',day:7},
    skygate: {name:'브리즈번 공항·Skygate 주변',coords:[-27.415,153.082],date:'10/7–10/8 · 마지막 1박',note:'공항 주변 숙소 자료와 장보기 사진을 묶은 대표 위치입니다. 개별 매장 방문을 뜻하지는 않습니다.',day:9},
    brisbaneInternational: {name:'브리즈번 국제선 공항',coords:[-27.403,153.111],date:'10/8 · 인천행 귀국',note:'귀국일 공항 사진으로 확인했습니다.',day:10}
  };
  const routes = [
    {name:'9/29 · 위례 → 인천공항',kind:'local',stops:['wirye','incheon']},
    {name:'9/29–9/30 · 인천 → 시드니',kind:'flight',stops:['incheon','sydneyAirport']},
    {name:'9/30 · 시드니 도착·달링하버',kind:'local',stops:['sydneyAirport','sydneyStay','darling']},
    {name:'10/1 · 서큘러 키·오페라하우스',kind:'local',stops:['quay','opera']},
    {name:'10/1 · 항구 → 타롱가 동물원',kind:'ferry',stops:['quay','taronga']},
    {name:'10/2 · 대학교 → 마켓 시티 주변',kind:'local',stops:['university','market']},
    {name:'10/4 · 시드니 숙소 → 공항',kind:'local',stops:['sydneyStay','sydneyAirport']},
    {name:'10/4 · 시드니 → 브리즈번',kind:'flight',stops:['sydneyAirport','brisbaneDomestic']},
    {name:'10/4 · 브리즈번 공항 → 골드코스트',kind:'local',stops:['brisbaneDomestic','goldCoast']},
    {name:'10/5 · 숙소 → 커럼빈 → 해변 → 허리케인스',kind:'local',stops:['goldCoast','currumbin','surfers','hurricanes']},
    {name:'10/6 · 숙소·서퍼스 파라다이스',kind:'local',stops:['goldCoast','surfers']},
    {name:'10/7 · 골드코스트 → 브리즈번 공항 주변',kind:'local',stops:['goldCoast','skygate']},
    {name:'10/8 · 공항 주변 → 국제선',kind:'local',stops:['skygate','brisbaneInternational']},
    {name:'10/8 · 브리즈번 → 인천',kind:'flight',stops:['brisbaneInternational','incheon']},
    {name:'10/8 · 인천공항 → 위례',kind:'local',stops:['incheon','wirye']}
  ];
  const views = {
    all: {name:'전체 여정',stops:['wirye','incheon','sydneyAirport','goldCoast','brisbaneDomestic'],zoom:5,summary:'위례 → 인천 → 시드니 4박 → 브리즈번 경유 → 골드코스트 3박 → 브리즈번 1박 → 인천 → 위례'},
    korea: {name:'한국',stops:['wirye','incheon'],zoom:11,summary:'9/29 위례에서 인천공항으로 출발 · 10/8 인천공항을 거쳐 위례로 귀가'},
    sydney: {name:'시드니',stops:['sydneyAirport','sydneyStay','darling','quay','opera','taronga','university','market','theatre'],zoom:13,summary:'9/30 달링하버 · 10/1 서큘러 키·오페라하우스·타롱가 · 10/2 대학교·마켓 시티 · 10/3 라이온킹'},
    queensland: {name:'골드코스트 ↔ 브리즈번',stops:['brisbaneDomestic','goldCoast','currumbin','skygate','brisbaneInternational'],zoom:11,summary:'10/4 브리즈번 도착 후 골드코스트로 · 10/7 브리즈번으로 돌아와 공항 주변 1박 · 10/8 귀국'},
    goldCoast: {name:'골드코스트',stops:['goldCoast','currumbin','surfers','hurricanes'],zoom:14,summary:'10/5 커럼빈 → 해변 → 허리케인스 그릴 · 10/6 서퍼스 파라다이스 산책'},
    brisbane: {name:'브리즈번',stops:['brisbaneDomestic','skygate','brisbaneInternational'],zoom:14,summary:'10/4 국내선 도착 · 10/7 공항·Skygate 주변 · 10/8 국제선 출국'}
  };
  let journeyMap;
  let markerLayer;
  let currentView = 'all';
  const markers = new Map();
  const overview = {
    korea:{name:'위례 · 인천',coords:points.incheon.coords,date:'9/29 출국 · 10/8 귀가'},
    sydney:{name:'시드니',coords:points.sydneyStay.coords,date:'9/30–10/4 · 4박',direction:'left'},
    queensland:{name:'골드코스트 · 브리즈번',coords:points.brisbaneDomestic.coords,date:'10/4–10/8 · 3박 + 1박'}
  };

  function flightArc(start, end) {
    const toVector = coordinate => {
      const latitude = coordinate[0] * Math.PI / 180;
      const longitude = coordinate[1] * Math.PI / 180;
      return [Math.cos(latitude) * Math.cos(longitude), Math.cos(latitude) * Math.sin(longitude), Math.sin(latitude)];
    };
    const origin = toVector(start);
    const destination = toVector(end);
    const angle = Math.acos(Math.max(-1, Math.min(1, origin.reduce((sum, value, index) => sum + value * destination[index], 0))));
    if (angle < 0.000001) return [start, end];
    return Array.from({length:49}, (unused, index) => {
      const fraction = index / 48;
      const originWeight = Math.sin((1 - fraction) * angle) / Math.sin(angle);
      const destinationWeight = Math.sin(fraction * angle) / Math.sin(angle);
      const vector = origin.map((value, axis) => value * originWeight + destination[axis] * destinationWeight);
      return [Math.atan2(vector[2], Math.hypot(vector[0], vector[1])) * 180 / Math.PI, Math.atan2(vector[1], vector[0]) * 180 / Math.PI];
    });
  }

  function popupFor(point) {
    const content = document.createElement('div');
    const heading = document.createElement('strong');
    heading.textContent = point.name;
    const date = document.createElement('p');
    date.textContent = point.date;
    const note = document.createElement('p');
    note.textContent = point.note;
    const link = document.createElement('a');
    link.href = `#record-day-${point.day}`;
    link.textContent = '이날의 기록·사진 보기 →';
    content.append(heading,date,note,link);
    return content;
  }

  function addPoint(key, point, label, focusView) {
    const icon = L.divIcon({className:'journey-pin',html:`<span>${label}</span>`,iconSize:[30,30],iconAnchor:[15,15]});
    const marker = L.marker(point.coords,{icon,title:point.name,alt:point.name,keyboard:true}).addTo(markerLayer);
    if (!focusView) marker.bindPopup(popupFor(point),{maxWidth:260});
    if (focusView) {
      marker.bindTooltip(point.name,{permanent:true,direction:point.direction || 'right',offset:[point.direction === 'left' ? -13 : 13,0],className:'journey-label'});
      marker.on('click',() => selectView(focusView));
    }
    markers.set(key,marker);
  }

  function renderPlaces(view) {
    placesList.replaceChildren();
    const keys = currentView === 'all' ? Object.keys(overview) : view.stops;
    keys.forEach((key,index) => {
      const point = currentView === 'all' ? overview[key] : points[key];
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      const name = document.createElement('strong');
      name.textContent = `${index + 1}. ${point.name}`;
      const date = document.createElement('span');
      date.textContent = point.date;
      button.append(name,date);
      button.addEventListener('click',() => {
        if (currentView === 'all') { selectView(key); return; }
        journeyMap.setView(point.coords,Math.max(journeyMap.getZoom(),12),{animate:false});
        markers.get(key)?.openPopup();
        status.textContent = `${point.name} · ${point.date} · ${point.note}`;
      });
      item.append(button);
      placesList.append(item);
    });
  }

  function selectView(key) {
    currentView = key;
    const view = views[key];
    document.querySelectorAll('[data-map-view]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.mapView === key)));
    markerLayer.clearLayers();
    markers.clear();
    if (key === 'all') {
      Object.entries(overview).forEach(([region,point],index) => addPoint(region,point,index + 1,region));
    } else {
      view.stops.forEach((pointKey,index) => addPoint(pointKey,points[pointKey],index + 1));
    }
    journeyMap.invalidateSize({pan:false});
    journeyMap.fitBounds(view.stops.map(pointKey => points[pointKey].coords),{padding:[35,45],maxZoom:view.zoom,animate:false});
    markers.forEach(marker => marker.getElement()?.setAttribute('aria-label',marker.options.title));
    status.textContent = view.summary;
    renderPlaces(view);
  }

  function activateMap() {
    if (section.hidden) return;
    if (journeyMap) {
      requestAnimationFrame(() => journeyMap.invalidateSize({pan:false}));
      return;
    }
    if (!window.L) {
      status.textContent = '지도를 불러오지 못했어요. 아래 여행 순서와 지역별 목록을 확인해 주세요.';
      return;
    }
    journeyMap = L.map(canvas,{scrollWheelZoom:false,minZoom:2,maxZoom:16});
    markerLayer = L.layerGroup().addTo(journeyMap);
    const tiles = L.tileLayer(canvas.dataset.tileUrl,{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(journeyMap);
    tiles.on('tileerror',() => { document.querySelector('#journey-tile-error').hidden = false; });
    const colors = {flight:'#7155a5',local:'#007b76',ferry:'#287ab7'};
    routes.forEach(route => {
      const coordinates = route.stops.map(key => points[key].coords);
      const path = route.kind === 'flight' ? flightArc(coordinates[0],coordinates[1]) : coordinates;
      const line = L.polyline(path,{color:colors[route.kind],weight:route.kind === 'flight' ? 3 : 4,dashArray:route.kind === 'flight' ? '9 8' : '5 6',opacity:0.85}).addTo(journeyMap);
      const description = document.createElement('span');
      description.textContent = `${route.name} · 실제 항로·도로가 아닌 개략 연결선`;
      line.bindPopup(description);
      if (route.kind === 'flight') {
        const middle = Math.floor(path.length / 2);
        const start = journeyMap.project(path[middle],0);
        const end = journeyMap.project(path[middle + 1],0);
        const angle = Math.atan2(end.y - start.y,end.x - start.x) * 180 / Math.PI;
        const arrow = L.divIcon({className:'journey-arrow',html:`<span style="transform:rotate(${angle}deg)">➤</span>`,iconSize:[20,20],iconAnchor:[10,10]});
        L.marker(path[middle],{icon:arrow,interactive:false,keyboard:false}).addTo(journeyMap);
      }
    });
    document.querySelectorAll('[data-map-view]').forEach(button => {
      button.disabled = false;
      button.addEventListener('click',() => selectView(button.dataset.mapView));
    });
    new ResizeObserver(() => { if (!section.hidden) journeyMap.invalidateSize({pan:false}); }).observe(canvas);
    selectView(currentView);
  }

  document.addEventListener('travel-tab-change',activateMap);
  activateMap();
})();
