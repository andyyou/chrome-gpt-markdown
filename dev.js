const fs = require("fs");
const Turndown = require("turndown");

const html = fs.readFileSync("__.html", "utf8");

const service = new Turndown();
service.addRule("coder", {
  filter: "code",
  replacement: function (content, node, options) {
    return options.fence + content + options.fence;
  },
});
const markdown = service.turndown(html);

console.log(markdown);
