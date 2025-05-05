import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import Modal from './Modal';

const emojiMap = {
  "Electronico": "💻",
  "Pontos Restrito de Eletrônicos": "📦",
  "Lampadas": "💡",
  "Pilhas e Baterias": "🔋",
  "Tonner de Impressora": "🖨️"
};
const defaultEmoji = "📦";

// Função para calcular distância (em km) entre dois pontos lat/lng
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  function deg2rad(deg) { return deg * (Math.PI/180); }
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distância em km
  return d;
}
const RADIUS_KM = 50; // Raio de busca em km

function EmojiMarker({ position, emoji, children }) {
  const icon = new L.DivIcon({
    className: '',
    html: `<div style="font-size:2.1rem;filter:drop-shadow(0 2px 6px #0001);">${emoji}</div>`,
    iconAnchor: [16, 30]
  });
  return (
    <Marker position={position} icon={icon}>
      {children}
    </Marker>
  );
}

function extractTipos(data) {
  return [...new Set(data.map((item) => item.tipo))];
}

function MapaColeta() {
  const [showModal, setShowModal] = useState(true);
  const [rawData, setRawData] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [pontos, setPontos] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    fetch('/coeletronico/pontos.json')
      .then(res => res.json())
      .then(data => {
        setRawData(data);
        const tiposDetectados = extractTipos(data);
        setTipos(tiposDetectados);
        setFiltros(Object.fromEntries(tiposDetectados.map(t => [t, false])));
      });
  }, []);

  useEffect(() => {
    const allPontos = [];
    rawData.forEach(tipoInfo => {
      tipoInfo.itens.forEach(pto => {
        allPontos.push({ ...pto, tipo: tipoInfo.tipo });
      });
    });
    setPontos(allPontos);
  }, [rawData]);

  useEffect(() => {
    if (showModal) {
      setLocationError(false);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation([pos.coords.latitude, pos.coords.longitude]);
            setLocationError(false);
          },
          () => {
            setLocationError(true);
            setUserLocation(null);
          }
        );
      } else {
        setLocationError(true);
      }
    }
  }, [showModal]);

  // Só mostra marcadores dentro do raio da localização do usuário e dos filtros ativos
  const pontosFiltrados = pontos.filter(pto =>
    filtros[pto.tipo] &&
    userLocation &&
    getDistanceFromLatLonInKm(pto.latitude, pto.longitude, userLocation[0], userLocation[1]) <= RADIUS_KM
  );

  // Função para mostrar a distância de cada ponto para o usuário
  const getDistanceLabel = (ponto) => {
    if (!userLocation) return '';
    const dist = getDistanceFromLatLonInKm(ponto.latitude, ponto.longitude, userLocation[0], userLocation[1]);
    return dist < 1
      ? `${(dist*1000).toFixed(0)} m`
      : `${dist.toFixed(2)} km`;
  };

  const flyToPoint = (lat, lng) => {
    const map = mapRef.current;
    if (map) map.flyTo([lat, lng], 15, { duration: 1 });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      minHeight: 0,
      minWidth: 0,
      overflow: 'hidden'
    }}>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          tipos={tipos}
          filtros={filtros}
          setFiltros={setFiltros}
          emojiMap={emojiMap}
          defaultEmoji={defaultEmoji}
          locationError={locationError}
          userLocation={userLocation}
          flyToPoint={flyToPoint}
        />
      )}
      {/* Sidebar */}
      <div className="sidebar-pontos" style={{ height: '100%', boxSizing: 'border-box', minWidth: 0 }}>
        <h3>Pontos Próximos (<span style={{color:"#249f69"}}>{RADIUS_KM}km</span>)</h3>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#e8f8ef',
            border: '1.5px solid #83deb7',
            color: '#185f39',
            fontWeight: 600,
            borderRadius: 7,
            padding: '7px 18px',
            marginBottom: 20,
            marginTop: -10,
            cursor: 'pointer',
            boxShadow: '0 1px 7px #249f6936',
            fontSize: '1em',
            transition: 'background .18s, border .15s'
          }}
        >
          Alterar Filtros
        </button>
        {pontosFiltrados.map((ponto, idx) => (
          <div
            className="ponto-card"
            key={idx}
            title="Clique para localizar no mapa"
            onClick={() => flyToPoint(ponto.latitude, ponto.longitude)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                {emojiMap[ponto.tipo] || defaultEmoji} {ponto.Empresa || "Desconhecida"}
                <span style={{ marginLeft: 10, fontSize: 13, color: "#888" }}>
                  {getDistanceLabel(ponto)}
                </span>
              </span>
              <span className="tipo" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>{emojiMap[ponto.tipo] || defaultEmoji}</span>
                <span>{ponto.tipo}</span>
              </span>
            </div>
            <div style={{ fontSize: 15, margin: "6px 0 2px 0", color: "#26885c" }}>
              {ponto.Endereço}
            </div>
            <div style={{ fontSize: 13, color: "#135f36" }}>{ponto.Região}</div>
            {ponto.Contato && (
              <div style={{ fontSize: 13, color: "#289963" }}>📞 {ponto.Contato}</div>
            )}
          </div>
        ))}
        {pontosFiltrados.length === 0 &&
          <div style={{ color: "#666", marginTop: 30 }}>Nenhum ponto visível com estes filtros ou próximos de você.</div>
        }
      </div>

      {/* Área principal com mapa */}
      <div style={{ flex: 1, position: "relative", minWidth: 0, minHeight: 0 }}>
        {/* A barra de filtros foi movida para o Modal */}
        {userLocation && <MapContainer
          center={userLocation}
          zoom={12}
          ref={el => { if (el) mapRef.current = el; }}
          style={{ height: "100%", width: "100%", zIndex: 10, minHeight: 0, minWidth: 0 }}
          className="custom-leaflet-mapa"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {userLocation &&
            <Marker position={userLocation}>
              <Popup>Sua localização</Popup>
            </Marker>
          }
          {pontosFiltrados.map((ponto, idx) => (
            <EmojiMarker
              position={[ponto.latitude, ponto.longitude]}
              emoji={emojiMap[ponto.tipo] || defaultEmoji}
              key={idx}
            >
              <Popup>
                <strong>{emojiMap[ponto.tipo] || defaultEmoji} {ponto.Empresa || "Desconhecida"}</strong><br />
                {ponto.Endereço}<br />
                {ponto.Contato && <>📞 {ponto.Contato}<br /></>}
                <span>Tipo: {ponto.tipo}</span><br />
                📍 {ponto.Região}<br />
                <span style={{color:'#249f69', fontWeight:500}}>{getDistanceLabel(ponto)} de você</span>
              </Popup>
            </EmojiMarker>
          ))}
        </MapContainer>}
      </div>
    </div>
  );
}

export default MapaColeta;
