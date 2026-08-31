(() => {
  "use strict";

  const copyBlocks = document.querySelectorAll("[data-copy]");

  copyBlocks.forEach((block) => {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy command to clipboard");

    button.addEventListener("click", async () => {
      const code = block.querySelector("code");
      if (!code || !navigator.clipboard) return;

      try {
        await navigator.clipboard.writeText(code.textContent.trim());
        button.textContent = "Copied";
        window.setTimeout(() => {
          button.textContent = "Copy";
        }, 1600);
      } catch {
        button.textContent = "Select to copy";
      }
    });

    block.append(button);
  });
})();
