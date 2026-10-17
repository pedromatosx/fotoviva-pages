/* Guia da prévia FotoViva. Zero rastreamento, login ou serviços externos. */
(() => {
  "use strict";
  function start() {
    if (document.getElementById("fv-demo-tour") || !window.FotoVivaDemo) return;
    const style = document.createElement("style");
    style.textContent = `
      .pages-demo-banner { display:none!important; }
      #fv-demo-tour { position:relative; z-index:70; font:500 12px/1.45 "DM Sans",Arial,sans-serif; background:#fff7ed; color:#602e1d; border-bottom:1px solid #f3d8c3; }
      #fv-demo-tour * { box-sizing:border-box; }
      .fvd-ribbon { width:min(1220px,calc(100% - 44px)); margin:auto; min-height:44px; display:flex; align-items:center; gap:12px; }
      .fvd-pill { background:#f97344; color:white; font-weight:800; letter-spacing:.075em; border-radius:40px; padding:5px 10px; font-size:10px; white-space:nowrap; }
      .fvd-description { flex:1; color:#704b3c; }
      .fvd-link { border:0; background:transparent; padding:7px 5px; color:#a34223; font-weight:800; cursor:pointer; }
      .fvd-link:focus-visible, .fvd-action:focus-visible { outline:3px solid #ff9473; outline-offset:2px; }
      .fvd-overlay[hidden] { display:none!important; }
      .fvd-overlay { position:fixed; inset:0; z-index:9999; background:#121e22b8; display:flex; align-items:center; justify-content:center; padding:20px; }
      .fvd-panel { color:#1c2529; width:min(690px,100%); max-height:min(92vh,800px); overflow-y:auto; background:#fff; border-radius:22px; padding:clamp(23px,5vw,38px); box-shadow:0 24px 90px #0c11126b; }
      .fvd-top { display:flex; justify-content:space-between; gap:18px; align-items:center; }
      .fvd-eyebrow { display:block; letter-spacing:.12em; font-weight:800; color:#e7653c; font-size:11px; margin-bottom:8px; }
      .fvd-panel h2 { font-family:Manrope,Arial,sans-serif; font-size:clamp(24px,3.5vw,32px); letter-spacing:-1px; line-height:1.2; margin:0 0 10px; }
      .fvd-panel p { color:#677178; line-height:1.65; margin:0 0 17px; font-size:13px; }
      .fvd-close { width:36px; height:36px; border-radius:50%; flex-shrink:0; border:1px solid #e2e7e6; background:#f7f9f8; cursor:pointer; font-size:20px; }
      .fvd-steps { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin:20px 0; }
      .fvd-step { border:1px solid #e8ecea; border-radius:14px; padding:16px; background:#fff; display:flex; flex-direction:column; align-items:flex-start; gap:7px; }
      .fvd-num { display:inline-grid; place-items:center; width:30px; height:30px; border-radius:10px; background:#fff1eb; color:#e26137; font-weight:800; }
      .fvd-step strong { font-size:14px; }
      .fvd-step span:not(.fvd-num) { color:#677178; font-size:12px; line-height:1.5; }
      .fvd-action { border:0; color:white; background:#1c2729; font-size:12px; font-weight:800; border-radius:8px; margin-top:auto; padding:10px 13px; cursor:pointer; }
      .fvd-action:hover { background:#e9613c; }
      .fvd-bottom { border-top:1px solid #e8ecea; padding-top:16px; display:flex; justify-content:space-between; align-items:center; gap:15px; }
      .fvd-bottom small { color:#68747a; max-width:400px; }
      .fvd-danger { border:1px solid #eacabd; border-radius:8px; padding:9px 12px; background:#fff7f2; color:#b14c2d; font-size:12px; font-weight:700; white-space:nowrap; cursor:pointer; }
      @media(max-width:600px){.fvd-ribbon{width:calc(100% - 28px);gap:6px;min-height:48px}.fvd-description{font-size:10px}.fvd-pill{font-size:9px;padding:5px 7px}.fvd-steps{grid-template-columns:1fr}.fvd-panel{padding:20px}.fvd-step{gap:5px}.fvd-bottom{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(style);

    const wrapper = document.createElement("div");
    wrapper.id = "fv-demo-tour";
    wrapper.innerHTML = `
      <div class="fvd-ribbon">
        <span class="fvd-pill">VERSÃO DE TESTES</span>
        <span class="fvd-description">Explore à vontade. Nenhuma compra ou envio de foto é real.</span>
        <button class="fvd-link" type="button" data-fvd="open">Como testar →</button>
      </div>
      <div class="fvd-overlay" hidden>
        <div class="fvd-panel" role="dialog" aria-modal="true" aria-labelledby="fvd-heading">
          <div class="fvd-top">
            <div>
              <span class="fvd-eyebrow">BEM-VINDO À FOTOVIVA</span>
              <h2 id="fvd-heading">Faça um tour pelo seu site.</h2>
            </div>
            <button class="fvd-close" type="button" data-fvd="close" aria-label="Fechar guia">×</button>
          </div>
          <p>Experimente a experiência do cliente e a do fotógrafo. Tudo aqui é uma simulação segura para você avaliar o visual e as telas.</p>
          <div class="fvd-steps">
            <div class="fvd-step"><span class="fvd-num">01</span><strong>Descubra os eventos</strong><span>Filtre pela cidade, esporte e nome da competição. Abra uma galeria para ver as fotos.</span><button type="button" class="fvd-action" data-fvd="events">Explorar eventos →</button></div>
            <div class="fvd-step"><span class="fvd-num">02</span><strong>Simule uma compra</strong><span>Adicione fotos ao carrinho e finalize sem pagar nada. Veja como aparece em “Minhas fotos”.</span><button type="button" class="fvd-action" data-fvd="cart">Abrir carrinho →</button></div>
            <div class="fvd-step"><span class="fvd-num">03</span><strong>Monte seu estúdio</strong><span>Crie álbuns, marque como publicados e adicione imagens JPEG. Nenhum arquivo vai para a nuvem.</span><button type="button" class="fvd-action" data-fvd="studio">Abrir painel →</button></div>
            <div class="fvd-step"><span class="fvd-num">04</span><strong>Veja a coleção</strong><span>As fotos de compras simuladas aparecem no seu navegador, sem login ou cobrança.</span><button type="button" class="fvd-action" data-fvd="purchases">Minhas fotos →</button></div>
          </div>
          <div class="fvd-bottom">
            <small>Álbuns demonstrativos são guardados neste navegador. Arquivos enviados só permanecem enquanto esta página estiver aberta.</small>
            <button type="button" class="fvd-danger" data-fvd="reset">Reiniciar demonstração</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertBefore(wrapper, document.getElementById("root"));
    // The shared React UI also runs on a real backend. Replace backend-specific
    // copy ONLY on the public demo, avoiding claims of cloud uploads here.
    function clarifyDemoCopy() {
      const captions = [
        [".dashboard-content .demo-banner span",
          "Indicadores e eventos iniciais são ilustrativos. Seus álbuns são salvos só neste navegador; as fotos escolhidas não são enviadas à nuvem."],
        [".table-footnote",
          "Os eventos iniciais são exemplos. Crie álbuns e teste JPEGs de até 12 MB: nesta demonstração, as fotos ficam apenas na aba aberta do navegador."],
        [".footer-demo", "Prévia pública interativa • dados e eventos fictícios"],
      ];
      captions.forEach(([selector, copy]) => {
        const element = document.querySelector(selector);
        if (element && element.textContent !== copy) element.textContent = copy;
      });
    }
    const root = document.getElementById("root");
    if (root) {
      new MutationObserver(clarifyDemoCopy).observe(root, { subtree: true, childList: true, characterData: true });
      clarifyDemoCopy();
    }
    const overlay = wrapper.querySelector(".fvd-overlay");
    let lastFocus = null;
    const close = () => {
      overlay.hidden = true;
      document.body.style.removeProperty("overflow");
      lastFocus?.focus?.();
    };
    function navigate(destination) {
      const targets = {
        events: ".desktop-nav button:nth-child(2)",
        studio: ".desktop-nav button:nth-child(3)",
        cart: ".cart-header",
        purchases: '.header-actions button[aria-label="Minhas fotos"]',
      };
      close();
      const trigger = document.querySelector(targets[destination]);
      trigger?.click();
    }
    wrapper.addEventListener("click", event => {
      const clicked = event.target.closest("[data-fvd]");
      if (!clicked) {
        if (event.target === overlay) close();
        return;
      }
      const action = clicked.dataset.fvd;
      if (action === "open") {
        lastFocus = clicked;
        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        overlay.querySelector(".fvd-close").focus();
      } else if (action === "close") close();
      else if (action === "reset") {
        if (window.confirm("Apagar os álbuns, o carrinho e as compras fictícias deste navegador?")) window.FotoVivaDemo.reset();
      } else navigate(action);
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !overlay.hidden) close(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
