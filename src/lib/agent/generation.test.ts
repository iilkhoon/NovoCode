/** Deterministic provider fixtures: test orchestration, not live model quality. */
import { afterEach, expect, it, vi } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { streamTurn } from "./turn";
afterEach(() => vi.restoreAllMocks());

const response = (v: string) => new Response(JSON.stringify({ t: "d", v }) + '\n{"t":"done"}\n');
const file = (path: string, content: string) => `<novo-file path="${path}">${content}</novo-file>`;

it.each(["deepseek-v4-flash", "deepseek-v4-pro"])("finishes a visible multi-batch site for %s without hitting a continuation cliff", async (id) => {
  const files: Record<string, string> = {
    "package.json": '{"type":"module"}',
    "index.html": '<html><body><div id="root"></div><script type="module" src="/src/main.js"></script></body></html>',
    "src/main.js": 'import React from "react"; import {createRoot} from "react-dom/client"; import App from "./App.js"; import "./style.css"; createRoot(document.getElementById("root")).render(React.createElement(App));',
  };
  const batches = [
    file('src/style.css', 'body{font-family:system-ui;margin:0;padding:40px;background:#f5f4ef;color:#18251d}button{padding:12px 20px}section{padding:20px 0}') +
      file('src/App.js', 'import React from "react"; export default function App(){return React.createElement("main",null,React.createElement("h1",null,"Hesabla"),React.createElement("button",{onClick:()=>alert("Müraciət qəbul edildi")},"Başla"));}') +
      '<novo-continue>Add features, pricing and contact</novo-continue>',
    file('src/Features.js', 'import React from "react"; export default function Features(){return React.createElement("section",null,"Gəlir və xərclər bir yerdə");}') +
      '<novo-continue>Add pricing and contact</novo-continue>',
    file('src/Pricing.js', 'import React from "react"; export default function Pricing(){return React.createElement("section",null,"Aylıq 19 AZN");}') +
      '<novo-continue>Add contact and wire sections into App</novo-continue>',
    file('src/Contact.js', 'import React from "react"; export default function Contact(){return React.createElement("section",null,React.createElement("button",{onClick:()=>alert("Müraciət qəbul edildi")},"Əlaqə saxla"));}') +
      file('src/App.js', 'import React from "react"; import Features from "./Features.js"; import Pricing from "./Pricing.js"; import Contact from "./Contact.js"; export default function App(){return React.createElement("main",null,React.createElement("h1",null,"Hesabla"),React.createElement(Features),React.createElement(Pricing),React.createElement(Contact));}') + 'Sayt hazırdır.',
  ];
  let batch = 0;
  const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) => {
    const request = JSON.parse(init!.body as string);
    expect(request.model).toBe(`deepseek::${id}`);
    if (batch > 0) expect(request.files['src/App.js']).toContain('Hesabla');
    return response(batches[batch++]);
  });
  const raw = await streamTurn({ model: `deepseek::${id}`, messages: [{ role: 'user', content: 'Mühasibat saytı qur' }], files, onEvent: (event) => {
    if (event.type === 'file-close') files[event.path] = event.content;
  } });
  expect(fetch).toHaveBeenCalledTimes(4);
  expect(raw).toContain('Sayt hazırdır.');
  expect(files['src/App.js']).toContain('Contact');
  if (process.env.NOVO_GENERATION_OUT) {
    mkdirSync(process.env.NOVO_GENERATION_OUT, { recursive: true });
    writeFileSync(`${process.env.NOVO_GENERATION_OUT}/${id}.json`, JSON.stringify(files));
  }
});

it("bounds productive batches as well as stalled batches", async () => {
  let n = 0;
  const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => response(file(`src/f${n++}.js`, 'export default 1;') + '<novo-continue>More sections</novo-continue>'));
  await expect(streamTurn({ messages: [], files: {}, onEvent: () => {} })).rejects.toThrow('12 avtomatik');
  expect(fetch).toHaveBeenCalledTimes(12);
});
