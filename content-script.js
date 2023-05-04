function main() {
  if (!window.location.href.startsWith("https://chat.openai.com")) {
    return;
  }

  const mainElement = document.querySelector("main");

  function handleClick(e) {
    e.stopPropagation();

    const turndownService = new TurndownService({
      codeBlockStyle: "fenced",
    });
    turndownService.addRule("codeBlock", {
      filter: ["pre"],
      replacement: (content, node) => {
        const codeContent = node.querySelector("code")?.textContent || "";
        const language = node.querySelector("span")?.textContent || "plaintext";
        return `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n`;
      },
    });
    const html = mainElement.innerHTML;
    let markdown = turndownService.turndown(html);
    markdown = markdown.replace(/\d+\s*\/\s*\d+/g, "");
    markdown = markdown.replace("ChatGPTChatGPT", "");
    markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, "");

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
  const formElement = document.querySelector("form > div > div > div");
  console.log(formElement);
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
observe(main);
window.addEventListener(
  "load",
  function load(event) {
    window.removeEventListener("load", load, false);
    main();
  },
  false
);
