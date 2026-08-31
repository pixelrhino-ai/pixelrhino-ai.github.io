(() => {
  "use strict";

  const normalize = (value) => value.toLowerCase().trim();

  document.querySelectorAll("[data-copy]").forEach((block) => {
    const code = block.querySelector("code");
    if (!code) return;

    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy command to clipboard");

    button.addEventListener("click", async () => {
      if (!navigator.clipboard) return;

      try {
        await navigator.clipboard.writeText(code.textContent.trim());
        button.textContent = "Copied";
        window.setTimeout(() => {
          button.textContent = "Copy";
        }, 1400);
      } catch {
        button.textContent = "Select to copy";
      }
    });

    block.append(button);
  });

  const list = document.querySelector("[data-model-list]");
  if (!list) return;

  const entries = [...list.querySelectorAll("[data-model-id]")];
  const search = document.querySelector("[data-model-search]");
  const filters = [...document.querySelectorAll("[data-model-filter]")];
  const results = document.querySelector("[data-model-results]");
  const empty = document.querySelector("[data-model-empty]");
  let activeFilter = "ALL";

  entries.forEach((entry) => {
    entry.dataset.search = normalize(entry.textContent);
  });

  const applyFilters = () => {
    const query = normalize(search?.value || "");
    let visible = 0;

    entries.forEach((entry) => {
      const categoryMatch = activeFilter === "ALL" || entry.dataset.category === activeFilter;
      const searchMatch = !query || entry.dataset.search.includes(query);
      entry.hidden = !(categoryMatch && searchMatch);
      if (!entry.hidden) visible += 1;
    });

    if (results) results.textContent = `${visible} ${visible === 1 ? "model" : "models"}`;
    if (empty) empty.hidden = visible !== 0;
  };

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.modelFilter;
      filters.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      applyFilters();
    });
  });

  search?.addEventListener("input", applyFilters);

  const source = list.dataset.source;
  if (source) {
    fetch(source)
      .then((response) => {
        if (!response.ok) throw new Error("Model data unavailable");
        return response.json();
      })
      .then((data) => {
        const models = new Map(data.models.map((model) => [model.model_id, model]));
        entries.forEach((entry) => {
          const model = models.get(entry.dataset.modelId);
          if (!model) return;
          entry.dataset.category = model.category;
          entry.dataset.search = normalize([
            model.name,
            model.short_name,
            model.category,
            model.model_id,
            model.description,
            model.distribution,
            model.license,
            data.release
          ].filter(Boolean).join(" "));
        });
        applyFilters();
      })
      .catch(() => {
        applyFilters();
      });
  }
})();
