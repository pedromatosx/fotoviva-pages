/* FotoViva: API exclusivamente SIMULADA para a prévia estática do GitHub Pages.
 * Não há rede, autenticação, pagamentos, upload remoto ou vínculo com D1/R2.
 * Apenas o caminho /api/studio/albums é interceptado neste navegador.
 */
(() => {
  "use strict";
  if (typeof window === "undefined" || window.__fotovivaDemoApiInstalled) return;
  window.__fotovivaDemoApiInstalled = true;

  const KEY = "fotoviva-demo-albums-v1";
  const categories = new Set(["Corrida", "Ciclismo", "Crossfit", "Futebol", "Lutas", "Social"]);
  const photos = [];
  const originalFetch = window.fetch.bind(window);

  const respond = (body, status = 200) => Promise.resolve(new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  }));

  const readAlbums = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(saved) ? saved.filter(a =>
        a && typeof a.id === "string" && a.id.startsWith("demo-") &&
        typeof a.title === "string" && categories.has(a.category)
      ).slice(0, 30) : [];
    } catch { return []; }
  };
  const saveAlbums = albums => {
    try { localStorage.setItem(KEY, JSON.stringify(albums.slice(0, 30))); return true; }
    catch { return false; }
  };
  const asView = album => ({ ...album, photoCount: photos.filter(p => p.eventId === album.id).length });
  const eventPhoto = p => ({ id: p.id, eventId: p.eventId, image: p.image, bib: p.bib });

  async function handle(input, init, path) {
    const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
    const root = path === "/api/studio/albums";
    const patch = path.match(/^\/api\/studio\/albums\/(demo-[a-z0-9-]+)$/i);
    const upload = path.match(/^\/api\/studio\/albums\/(demo-[a-z0-9-]+)\/photos$/i);

    if (root && method === "GET") {
      return respond({ albums: readAlbums().map(asView), photos: photos.map(eventPhoto) });
    }

    if (root && method === "POST") {
      let data;
      try { data = JSON.parse(init?.body || "{}"); } catch { return respond({ error: "Dados inválidos." }, 400); }
      const title = typeof data.title === "string" ? data.title.trim() : "";
      const venue = typeof data.venue === "string" ? data.venue.trim() : "";
      const location = typeof data.location === "string" ? data.location.trim() : "";
      const category = data.category;
      const price = Number(data.price);
      if (!title || title.length > 120 || !venue || venue.length > 120 ||
          !location || location.length > 120 || !categories.has(category) ||
          !Number.isFinite(price) || price < 2 || price > 10000) {
        return respond({ error: "Informe nome, local, modalidade e preço válido." }, 400);
      }
      const albums = readAlbums();
      if (albums.length >= 30) return respond({ error: "Limite de 30 álbuns demonstrativos. Reinicie o teste para começar novamente." }, 400);
      const album = {
        id: "demo-" + crypto.randomUUID(), title, venue, location, category,
        date: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()),
        photographer: "Meu estúdio (demonstração)", image: null, price,
        status: "Rascunho",
      };
      if (!saveAlbums([album, ...albums])) return respond({ error: "Seu navegador não permitiu salvar a demonstração." }, 503);
      return respond({ album: asView(album) }, 201);
    }

    if (patch && method === "PATCH") {
      const albums = readAlbums();
      const album = albums.find(x => x.id === patch[1]);
      if (!album) return respond({ error: "Álbum não encontrado." }, 404);
      let data;
      try { data = JSON.parse(init?.body || "{}"); } catch { return respond({ error: "Status inválido." }, 400); }
      if (data.status !== "draft" && data.status !== "published") return respond({ error: "Status inválido." }, 400);
      album.status = data.status === "published" ? "Publicado" : "Rascunho";
      if (!saveAlbums(albums)) return respond({ error: "Falha ao salvar a demonstração." }, 503);
      return respond({ ok: true, status: data.status });
    }

    if (upload && method === "POST") {
      const album = readAlbums().find(x => x.id === upload[1]);
      if (!album) return respond({ error: "Álbum não encontrado." }, 404);
      const form = init?.body;
      if (!(form instanceof FormData)) return respond({ error: "Envie um JPEG." }, 415);
      const file = form.get("photo");
      if (!(file instanceof File) || file.size < 3 || file.size > 12 * 1024 * 1024 ||
          !["image/jpeg", "image/jpg"].includes(file.type)) {
        return respond({ error: "Apenas fotos JPEG de até 12 MB." }, 400);
      }
      // This blob URL is local to the browser tab. No file is uploaded anywhere.
      const photo = {
        id: "demo-photo-" + crypto.randomUUID(),
        eventId: album.id,
        image: URL.createObjectURL(file),
        bib: file.name.match(/(?:^|[^0-9])([0-9]{2,5})(?:[^0-9]|$)/)?.[1] || "",
        price: album.price,
      };
      photos.push(photo);
      return respond({ photo }, 201);
    }
    return respond({ error: "Funcionalidade não disponível nesta demonstração." }, 404);
  }

  window.fetch = function (input, init) {
    let url;
    try { url = new URL(input instanceof Request ? input.url : String(input), location.href); }
    catch { return originalFetch(input, init); }
    // Strictly isolated: no interception outside this origin or outside the demo-studio paths.
    if (url.origin !== location.origin || !url.pathname.startsWith("/api/studio/albums")) {
      return originalFetch(input, init);
    }
    return handle(input, init, url.pathname);
  };

  window.FotoVivaDemo = Object.freeze({
    reset() {
      try {
        [KEY, "fv-cart", "fv-purchased", "fv-print"].forEach(key => localStorage.removeItem(key));
      } catch {}
      photos.forEach(photo => URL.revokeObjectURL(photo.image));
      location.reload();
    },
    stats() { return { albums: readAlbums().length, photosThisSession: photos.length }; },
  });
})();
