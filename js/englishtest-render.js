/* /home/js/englishtest-render.js */
(() => {
  "use strict";

  // ---- JSON URL の解決（HTML側に残す）----
  // 優先順:
  // 1) window.ENG_TEST_DATA_URL（HTMLが設定）
  // 2) #app の data-json 属性
  // 3) <link rel="englishtest-json" href="...">
  // 4) 自動導出: 現在のHTMLと同じ場所の同名 .json（例: 0909.html -> 0909.json）
  function resolveDataUrl() {
    if (
      typeof window !== "undefined" &&
      typeof window.ENG_TEST_DATA_URL === "string" &&
      window.ENG_TEST_DATA_URL.trim()
    ) {
      return window.ENG_TEST_DATA_URL.trim();
    }
    const app = document.getElementById("app");
    if (app && app.dataset && app.dataset.json) {
      return app.dataset.json.trim();
    }
    const link = document.querySelector('link[rel="englishtest-json"][href]');
    if (link) {
      return link.getAttribute("href").trim();
    }
    const m = location.pathname.match(/\/([^\/]+)\.html?$/i);
    if (m) {
      return location.pathname.replace(/\.html?$/i, ".json");
    }
    return null;
  }

  // ---- DOMユーティリティ ----
  const el = (tag, props = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    }
    for (const c of children) {
      if (c == null) continue;
      Array.isArray(c) ? node.append(...c) : node.append(c);
    }
    return node;
  };
  const ensureSlash = (s = "") => (s.endsWith("/") ? s : s + "/");

  // ---- ビルダー ----
  function renderItem(item, baseSubdir) {
    const base = ensureSlash(baseSubdir || "");
    const det = el("details");
    const sum = el("summary", { text: item?.ja || "" });
    const en = el("div", { lang: "en", text: item?.en || "" });

    // m4a 優先
    // const audio = el(
    //   "audio",
    //   { controls: "", preload: "none" },
    //   el("source", {
    //     src: base + (item?.stem || "") + ".m4a",
    //     type: "audio/mp4",
    //   }),
    //   el("source", {
    //     src: base + (item?.stem || "") + ".mp3",
    //     type: "audio/mpeg",
    //   })
    // );

    // mp3 優先
    const audio = el(
      "audio",
      { controls: "", preload: "none" },
      el("source", {
        src: base + (item?.stem || "") + ".mp3",
        type: "audio/mpeg",
      }),
      el("source", {
        src: base + (item?.stem || "") + ".m4a",
        type: "audio/mp4",
      })
    );

    det.append(sum, en, audio);
    return det;
  }

  function renderUnit(unit, baseSubdir, unitLabel) {
    const frag = document.createDocumentFragment();
    frag.append(el("h4", { text: unit?.title || "" }));

    const ul = el("ul");
    const li = el("li");
    li.append(
      document.createTextNode(unitLabel || "次の日本語を英語にしましょう")
    );

    (unit?.items || []).forEach((it) => li.append(renderItem(it, baseSubdir)));
    ul.append(li);
    frag.append(ul);
    return frag;
  }

  function renderSection(section, baseSubdir, unitLabel) {
    const frag = document.createDocumentFragment();
    frag.append(el("h2", { text: section?.title || "" }));
    (section?.units || []).forEach((u) =>
      frag.append(renderUnit(u, baseSubdir, unitLabel))
    );
    return frag;
  }

  async function main() {
    const app = document.getElementById("app");
    if (!app) return;

    const DATA_URL = resolveDataUrl();
    if (!DATA_URL) {
      app.innerHTML =
        '<p style="color:#c00">JSON の場所が未指定です。' +
        "HTML内で <code>window.ENG_TEST_DATA_URL</code> の設定、" +
        "<code>#app data-json</code>、" +
        '<code>&lt;link rel="englishtest-json" href="...json"&gt;</code> のいずれかを設定してください。</p>';
      return;
    }

    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();

      const baseAudioSubdir = data?.baseAudioSubdir || "";
      const unitLabel = data?.unitLabel || "次の日本語を英語にしましょう";

      (data?.sections || []).forEach((sec) => {
        app.append(renderSection(sec, baseAudioSubdir, unitLabel));
      });
    } catch (e) {
      app.innerHTML =
        '<p style="color:#c00">データの読込みに失敗しました。' +
        "JSONのURL・配置・CORS設定を確認してください。</p>";
      console.error(e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main, { once: true });
  } else {
    main();
  }
})();
