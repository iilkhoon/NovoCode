/**
 * Element picker injected into the generated site's index.html. Inert until the studio
 * sends {source:"novo-studio",type:"pick",on:true}; then hovering outlines elements and a
 * click reports the element back so the user can say "change this".
 */
export const PICKER_MARK = "novo-picker";

export const PICKER_SCRIPT = `<script id="${PICKER_MARK}">(function(){
var on=false,box=null,tag=null,cur=null;
function ui(){if(box)return;box=document.createElement("div");box.style.cssText="position:fixed;pointer-events:none;z-index:2147483646;border:2px solid #6447ff;background:rgba(100,71,255,.08);border-radius:6px;transition:all .08s ease-out;display:none";
tag=document.createElement("div");tag.style.cssText="position:fixed;pointer-events:none;z-index:2147483647;background:#6447ff;color:#fff;font:600 11px/1 system-ui,sans-serif;padding:4px 7px;border-radius:6px;display:none;white-space:nowrap";
document.documentElement.appendChild(box);document.documentElement.appendChild(tag);}
function label(el){var t=el.tagName.toLowerCase();var m={h1:"Başlıq",h2:"Başlıq",h3:"Başlıq",p:"Mətn",a:"Link",button:"Düymə",img:"Şəkil",nav:"Menyu",header:"Yuxarı hissə",footer:"Aşağı hissə",section:"Bölmə",form:"Forma",input:"Sahə",ul:"Siyahı",li:"Siyahı elementi"};return (m[t]||t)}
function path(el){var p=[];while(el&&el.nodeType===1&&p.length<5&&el!==document.body){var s=el.tagName.toLowerCase();if(el.id){s+="#"+el.id;p.unshift(s);break}var c=(el.getAttribute("class")||"").trim().split(/\\s+/).filter(Boolean).slice(0,2);if(c.length)s+="."+c.join(".");var i=1,sb=el;while((sb=sb.previousElementSibling))if(sb.tagName===el.tagName)i++;if(i>1)s+=":nth-of-type("+i+")";p.unshift(s);el=el.parentElement}return p.join(" > ")}
function show(el){cur=el;var r=el.getBoundingClientRect();box.style.display="block";box.style.left=r.left-2+"px";box.style.top=r.top-2+"px";box.style.width=r.width+4+"px";box.style.height=r.height+4+"px";tag.textContent=label(el);tag.style.display="block";tag.style.left=Math.max(4,r.left)+"px";tag.style.top=(r.top>24?r.top-24:r.bottom+4)+"px"}
function hide(){if(box){box.style.display="none";tag.style.display="none"}cur=null}
function move(e){if(!on)return;var el=document.elementFromPoint(e.clientX,e.clientY);if(el&&el!==cur&&el!==document.documentElement&&el!==document.body)show(el)}
function click(e){if(!on)return;e.preventDefault();e.stopPropagation();var el=cur||e.target;if(!el||el===document.body||el===document.documentElement)return;var html=el.outerHTML.replace(/\\s+/g," ");
parent.postMessage({source:"novo-preview",type:"picked",el:{tag:el.tagName.toLowerCase(),label:label(el),text:(el.innerText||el.getAttribute("alt")||"").trim().replace(/\\s+/g," ").slice(0,140),selector:path(el),html:html.length>700?html.slice(0,700)+"…":html}},"*");set(false)}
function key(e){if(on&&e.key==="Escape"){set(false);parent.postMessage({source:"novo-preview",type:"pick-cancel"},"*")}}
function set(v){on=v;ui();document.documentElement.style.cursor=v?"crosshair":"";if(!v)hide()}
addEventListener("message",function(e){var d=e.data;if(d&&d.source==="novo-studio"&&d.type==="pick")set(!!d.on)});
addEventListener("mousemove",move,true);addEventListener("click",click,true);addEventListener("keydown",key,true);
addEventListener("scroll",function(){if(on&&cur)show(cur)},true);
})();</script>`;

/** Adds the picker to an index.html that does not have it yet. */
export function ensurePicker(html: string): string {
  if (!html || html.includes(PICKER_MARK) || !html.includes("</head>")) return html;
  return html.replace("</head>", `    ${PICKER_SCRIPT}\n  </head>`);
}

export interface PickedElement {
  tag: string;
  label: string;
  text: string;
  selector: string;
  html: string;
}

/** Context prepended to the user's request so the model edits exactly that element. */
export function describePick(el: PickedElement): string {
  return `[Selected element in the preview — change ONLY this unless the request says otherwise]
tag: <${el.tag}>${el.text ? `\ntext: "${el.text}"` : ""}
css path: ${el.selector}
html: ${el.html}`;
}
