(()=>{"use strict";var t;function e(t){t.stopImmediatePropagation()}function n(t){return`${t}px`}!function(t){t.normal="Normal",t.search="Search"}(t||(t={}));class o extends HTMLElement{constructor(){super(),this.recordPosition=t=>{const[e,n]=[parseInt(this.style.top),parseInt(this.style.left)],{pageX:o,pageY:s}=t;document.body.style.userSelect="none",this.state.adjustment=[e-s,n-o],this.state.dragging=!0,this.container.classList.add("dragging")},this.drag=t=>{if(this.state.dragging){const[e,o]=this.state.adjustment;this.style.top=n(t.pageY+e),this.style.left=n(t.pageX+o)}},this.updatePosition=(t,e)=>{this.style.top=n(t),this.style.left=n(e)},this.attachShadow({mode:"open"}),this.state={dragging:!1,adjustment:[0,0]},this.container=document.createElement("div");const t=document.createElement("h3");t.textContent=this.hasAttribute("header-text")?this.getAttribute("header-text"):"Note";const o=document.createElement("textarea");t.classList.add("header"),o.classList.add("input"),this.container.classList.add("container"),this.container.appendChild(t),this.container.appendChild(o);const i=document.createElement("style");i.textContent=s,this.input=o;const r=document.body.style.userSelect;return this.input.onmousedown=e,this.container.onmousedown=this.recordPosition,document.onmousemove=this.drag,this.container.onmouseup=()=>{document.body.style.userSelect=r,this.state.dragging=!1,this.container.classList.remove("dragging");const t=new CustomEvent("ondragstop",{detail:[parseInt(this.style.top),parseInt(this.style.left)]});this.dispatchEvent(t)},this.shadowRoot.append(i,this.container),this}}const s="\n  .header {\n    font-family: sans serif;\n  }\n  .container {\n    opacity: 0.6;\n    position: absolute;\n    width: 200px;\n    height: 200px;\n    background-color: yellow;\n    cursor: pointer;\n    padding: 0.5rem 0.5rem 0 0.5rem;\n  }\n\n  .input {\n    resize: none;\n    width: 100%;\n    height: 70%;\n  }\n\n  .dragging {\n    opacity: 0.2;\n    background-color: purple;\n    transform: translate(20deg);\n  }\n";function i(t){function e(e){return{type:t,data:e}}return e.type=t,e}const r=t=>t[t.length-1],c=(t,e,n)=>t.map(((t,o)=>o===e?n:t));!function(t){t.body.style.border="3px solid green"}(document),customElements.define("share-note",o);const a=i("ADD_BASIC_NOTE"),d=i("DRAG_STOP_POSITION_CHANGE"),u=(h=function(t,{type:e,data:n}){void 0===t&&(t={noteIds:[],notePositions:[]});const{noteIds:o,notePositions:s}=t;switch(e){case a.type:let e;return e=null!=r(o)?r(o)+1:1,{noteIds:[...o,e],notePositions:[...s,n]};case d.type:const i=o.indexOf(n.id);return{noteIds:[...o],notePositions:c(s,i,n.position)};default:return t}},t=>{return e=void 0,n=void 0,s=function*(){const e=window.location.href;return browser.storage.local.get(e).then((n=>h(n[e],t))).then((t=>(console.log("observed nextState: ",t),browser.storage.local.set({[window.location.href]:t}),t)))},new((o=void 0)||(o=Promise))((function(t,i){function r(t){try{a(s.next(t))}catch(t){i(t)}}function c(t){try{a(s.throw(t))}catch(t){i(t)}}function a(e){var n;e.done?t(e.value):(n=e.value,n instanceof o?n:new o((function(t){t(n)}))).then(r,c)}a((s=s.apply(e,n||[])).next())}));var e,n,o,s});var h;const l=document.createElement("style");l.textContent="\n  share-note {\n    position: absolute;\n    width: 200px;\n    height: 200px;\n    backgroundColor: red;\n  }\n",document.body.append(l);const p=["TEXTAREA","INPUT"],g={normal:"Backslash",search:"Forwardslash"},m=new class{constructor(t){this._contextEntries=t,this._currentContext="",this._action="",this._object=""}clear(){this._currentContext="",this._action="",this._object=""}triggerContext(e){if(this.inContext)return!1;switch(e){case this._contextEntries.normal:return this._currentContext=t.normal,!0;case this._contextEntries.search:return this._currentContext=t.search,!0;default:return this._currentContext="",!1}}add(t){return this.inContext?""===this._action?this._action=t:""===this._object&&(this._object=t):this.triggerContext(t),this}get sequenceComplete(){return!!this._action&&!!this._object}get inContext(){return""!==this._currentContext}get sequence(){return[this._action,this._object].join("-")}get contextEntries(){return this._contextEntries}set contextEntries(t){this._contextEntries=t}get currentContext(){return this._currentContext}}(g),f=t=>e=>{u(d({id:parseInt(t.id),position:e.detail}))};function x(t){const e=document.createElement("share-note");return e.updatePosition(...t),document.body.appendChild(e),e}document.addEventListener("keydown",(e=>{return p.includes(document.activeElement.nodeName)?null:m.add(e.code).sequenceComplete?"Escape"===e.code?(m.clear(),null):(m.add(e.code),void(m.currentContext===t.normal?(t=>{switch(t){case"KeyA-KeyN":const e=document.getSelection();let n=0;e.anchorNode instanceof HTMLElement||(n=e.anchorOffset);const o=function(t,e){if(null===t)return[0,0];let n=t.parentElement||t,o=0,s=e.anchorOffset||0;do{o+=n.offsetTop||0,s+=n.offsetLeft||0,n=n.offsetParent}while(n);return[o,s]}(e.anchorNode,{anchorOffset:n}),s=x(o);setTimeout((()=>s.input.focus()),20),u(a(o)).then((t=>{s.id=r(t.noteIds),s.addEventListener("ondragstop",f(s))}));break;case"KeyA-KeyA":console.log("Add Question Note Path Hit");break;case"KeyN-KeyV":console.log("Make the notes invisible!");break;default:console.log(`Not a configured normal mode action sequence ${t}`)}})(m.sequence):m.currentContext===t.search&&(n=m.sequence,console.log(`Not a configured search mode action sequence ${n}`)))):null;var n})),document.addEventListener("keyup",(t=>{m.sequenceComplete&&m.clear()})),document.addEventListener("selectionchange",(t=>{""===document.getSelection().toString()&&m.clear(),m.inContext||m.triggerContext(g.normal)})),(()=>{const t=window.location.href;browser.storage.local.get(t).then((e=>{const{noteIds:n,notePositions:o}=e[t];n.forEach(((t,e)=>{const n=x(o[e]);n.id=t,n.addEventListener("ondragstop",f(n))}))}))})()})();