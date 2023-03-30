function main() {
  if (!window.location.href.startsWith("https://chat.openai.com/chat")) {
    return;
  }

  const mainElement = document.querySelector("main");

  function handleClick(e) {
    e.stopPropagation();

    const turndownService = new TurndownService();
    turndownService.addRule("coder", {
      filter: "code",
      replacement: function (content, node, options) {
        return options.fence + content + options.fence;
      },
    });
    const html = mainElement.innerHTML;
    const markdown = turndownService.turndown(html);

    const blob = new Blob([markdown], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    const dt = new Date();
    el.download = `GPT-${dt.getFullYear()}-${
      dt.getMonth() + 1
    }-${dt.getDate()}.md`;
    el.click();
    el.remove();
  }

  const prevElement = document.getElementById("gpt-markdown-export-button");
  if (prevElement) {
    prevElement.remove();
  }

  const btnElement = document.createElement("button");
  btnElement.id = "gpt-markdown-export-button";
  btnElement.textContent = "Export Markdown";
  btnElement.addEventListener("click", handleClick);
  const formElement = document.querySelector("form > div > div");
  formElement.appendChild(btnElement);
}

function observe(cb) {
  const observer = new MutationObserver(cb);
  const root = document.querySelector("#__next");
  observer.observe(root, {
    attributes: false,
    childList: true,
    subtree: false,
  });
}

main();
observe(main);
