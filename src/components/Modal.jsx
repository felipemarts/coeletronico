const Modal = ({
  onClose,
  tipos,
  filtros,
  setFiltros,
  emojiMap,
  defaultEmoji,
  locationError,
  userLocation,
  flyToPoint,
}) => {

  const handleOk = () => {
    if (userLocation) {
      flyToPoint(userLocation[0], userLocation[1]);
      onClose();
    }
  };

  return (
    <div style={{
      position: "fixed",
      zIndex: 2000,
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(30,70,50,0.26)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(2.5px)",
    }}>
      <div style={{
        background: "#fff",
        padding: "32px 28px",
        borderRadius: 15,
        boxShadow: "0 7px 36px #209f6933",
        maxWidth: 400,
        width: "94vw",
        textAlign: "center",
      }}>
        <h2 style={{ marginTop: 0, color: "#249f69" }}>Mapa de Coleta de Lixo Eletrônico</h2>
        <div style={{ fontSize: 17, color: "#176944", margin: "12px 0 20px 0" }}>
          Este mapa mostra pontos oficiais para o descarte correto de lixo eletrônico, pilhas, lâmpadas e toners.<br />
          Contribua com o meio ambiente destinando resíduos em locais apropriados!
        </div>
        { /* Convite para contribuir */}
        <div style={{
          background: "#f7fdf8",
          border: "1px solid #bae8cc",
          borderRadius: 7,
          padding: "8px 12px",
          fontSize: "0.98em",
          margin: "16px 0 10px 0",
          color: "#164f32"
        }}>
          <b>Quer ajudar?</b> Você pode <a href="https://github.com/felipemarts/coeletronico" target="_blank" rel="noopener">contribuir</a> com novos pontos de coleta ou sugestões! 💡
        </div>

        {locationError ? (
          <div style={{ color: "red", margin: "18px 0 15px 0", fontWeight: 600, fontSize: 16 }}>
            ⚠️ Não foi possível acessar sua localização.<br />
            <span style={{ color: "#444", fontSize: "0.97em", fontWeight: 400 }}>
              Por favor, permita o acesso à localização no navegador para utilizar o mapa.<br />
              <br />
              <span style={{ color: "#bb6e00" }}>
                Nas configurações de privacidade do navegador, encontre este site e libere o acesso à localização, depois recarregue a página.
              </span>
            </span>
          </div>
        ) : !userLocation ? (
          <div style={{ color: "#185f39", margin: "15px 0", fontWeight: 600 }}>
            Aguarde, solicitando acesso à sua localização...
          </div>
        ) : null}

        {/* Filtros - desabilitados se sem localização */}
        <div
          className="filtros-bar"
          style={{
            background: "#e8f8efcc",
            borderBottom: "2px solid #b7efd4",
            padding: "14px 2vw 10px 2vw",
            boxShadow: "0 3px 16px #4cc18516",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            position: "relative",
            left: 0,
            zIndex: 900,
            fontSize: "1.13em",
            alignItems: "start",
            backdropFilter: "blur(2px)",
            pointerEvents: (!userLocation || locationError) ? 'none' : 'auto',
            opacity: (!userLocation || locationError) ? 0.4 : 1,
          }}
        >
          <div style={{ marginBottom: 4, fontWeight: 700, color: "#249f69", fontSize: 17 }}>O que você quer descartar?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {tipos?.map(tipo => (
              <label key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="checkbox"
                  checked={filtros[tipo] ?? true}
                  onChange={() => setFiltros(cf => ({ ...cf, [tipo]: !cf[tipo] }))}
                />
                <span>{emojiMap?.[tipo] || defaultEmoji}</span>
                <span>{tipo}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Botão OK */}
        <button
          style={{
            marginTop: 22,
            background: "linear-gradient(90deg,#249f69,#67e08b)",
            color: "#fff",
            padding: "10px 28px",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.04em",
            fontWeight: 600,
            cursor: (!userLocation || locationError) ? "not-allowed" : "pointer",
            boxShadow: "0 1px 8px #16703c12",
            opacity: (!userLocation || locationError) ? 0.5 : 1,
          }}
          disabled={!userLocation || locationError}
          onClick={handleOk}
        >
          Vamos lá!
        </button>
      </div>
    </div>
  );
};

export default Modal;
