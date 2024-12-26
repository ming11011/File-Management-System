/*!
 * pinia v2.3.0
 * (c) 2024 Eduardo San Martin Morote
 * @license MIT
 */
var Pinia=function(t,e){"use strict";let n;const i=t=>n=t,s=Symbol();function o(t){return t&&"object"==typeof t&&"[object Object]"===Object.prototype.toString.call(t)&&"function"!=typeof t.toJSON}var r;t.MutationType=void 0,(r=t.MutationType||(t.MutationType={})).direct="direct",r.patchObject="patch object",r.patchFunction="patch function";const c="undefined"!=typeof window;const a=()=>{};function u(t,n,i,s=a){t.push(n);const o=()=>{const e=t.indexOf(n);e>-1&&(t.splice(e,1),s())};return!i&&e.getCurrentScope()&&e.onScopeDispose(o),o}function p(t,...e){t.slice().forEach((t=>{t(...e)}))}const f=t=>t(),l=Symbol(),h=Symbol();function d(t,n){t instanceof Map&&n instanceof Map?n.forEach(((e,n)=>t.set(n,e))):t instanceof Set&&n instanceof Set&&n.forEach(t.add,t);for(const i in n){if(!n.hasOwnProperty(i))continue;const s=n[i],r=t[i];t[i]=o(r)&&o(s)&&t.hasOwnProperty(i)&&!e.isRef(s)&&!e.isReactive(s)?d(r,s):s}return t}const y=Symbol();function v(t){return!o(t)||!t.hasOwnProperty(y)}const{assign:$}=Object;function _(n,s,o={},r,c,y){let _;const b=$({actions:{}},o),j={deep:!0};let S,m,O,g=[],R=[];const P=r.state.value[n];let V;function w(i){let s;S=m=!1,"function"==typeof i?(i(r.state.value[n]),s={type:t.MutationType.patchFunction,storeId:n,events:O}):(d(r.state.value[n],i),s={type:t.MutationType.patchObject,payload:i,storeId:n,events:O});const o=V=Symbol();e.nextTick().then((()=>{V===o&&(S=!0)})),m=!0,p(g,s,r.state.value[n])}y||P||(e.isVue2?e.set(r.state.value,n,{}):r.state.value[n]={}),e.ref({});const A=y?function(){const{state:t}=o,e=t?t():{};this.$patch((t=>{$(t,e)}))}:a;const M=(t,e="")=>{if(l in t)return t[h]=e,t;const s=function(){i(r);const e=Array.from(arguments),o=[],c=[];let a;p(R,{args:e,name:s[h],store:T,after:function(t){o.push(t)},onError:function(t){c.push(t)}});try{a=t.apply(this&&this.$id===n?this:T,e)}catch(t){throw p(c,t),t}return a instanceof Promise?a.then((t=>(p(o,t),t))).catch((t=>(p(c,t),Promise.reject(t)))):(p(o,a),a)};return s[l]=!0,s[h]=e,s},k={_p:r,$id:n,$onAction:u.bind(null,R),$patch:w,$reset:A,$subscribe(i,s={}){const o=u(g,i,s.detached,(()=>c())),c=_.run((()=>e.watch((()=>r.state.value[n]),(e=>{("sync"===s.flush?m:S)&&i({storeId:n,type:t.MutationType.direct,events:O},e)}),$({},j,s))));return o},$dispose:function(){_.stop(),g=[],R=[],r._s.delete(n)}};e.isVue2&&(k._r=!1);const T=e.reactive(k);r._s.set(n,T);const x=(r._a&&r._a.runWithContext||f)((()=>r._e.run((()=>(_=e.effectScope()).run((()=>s({action:M})))))));for(const t in x){const i=x[t];if(e.isRef(i)&&(!e.isRef(E=i)||!E.effect)||e.isReactive(i))y||(P&&v(i)&&(e.isRef(i)?i.value=P[t]:d(i,P[t])),e.isVue2?e.set(r.state.value[n],t,i):r.state.value[n][t]=i);else if("function"==typeof i){const n=M(i,t);e.isVue2?e.set(x,t,n):x[t]=n,b.actions[t]=i}}var E;return e.isVue2?Object.keys(x).forEach((t=>{e.set(T,t,x[t])})):($(T,x),$(e.toRaw(T),x)),Object.defineProperty(T,"$state",{get:()=>r.state.value[n],set:t=>{w((e=>{$(e,t)}))}}),e.isVue2&&(T._r=!0),r._p.forEach((t=>{$(T,_.run((()=>t({store:T,app:r._a,pinia:r,options:b}))))})),P&&y&&o.hydrate&&o.hydrate(T.$state,P),S=!0,m=!0,T}
/*! #__NO_SIDE_EFFECTS__ */let b="Store";function j(t,e){return Array.isArray(e)?e.reduce(((e,n)=>(e[n]=function(){return t(this.$pinia)[n]},e)),{}):Object.keys(e).reduce(((n,i)=>(n[i]=function(){const n=t(this.$pinia),s=e[i];return"function"==typeof s?s.call(this,n):n[s]},n)),{})}const S=j;return t.PiniaVuePlugin=function(t){t.mixin({beforeCreate(){const t=this.$options;if(t.pinia){const e=t.pinia;if(!this._provided){const t={};Object.defineProperty(this,"_provided",{get:()=>t,set:e=>Object.assign(t,e)})}this._provided[s]=e,this.$pinia||(this.$pinia=e),e._a=this,c&&i(e)}else!this.$pinia&&t.parent&&t.parent.$pinia&&(this.$pinia=t.parent.$pinia)},destroyed(){delete this._pStores}})},t.acceptHMRUpdate=function(t,e){return()=>{}},t.createPinia=function(){const t=e.effectScope(!0),n=t.run((()=>e.ref({})));let o=[],r=[];const c=e.markRaw({install(t){i(c),e.isVue2||(c._a=t,t.provide(s,c),t.config.globalProperties.$pinia=c,r.forEach((t=>o.push(t))),r=[])},use(t){return this._a||e.isVue2?o.push(t):r.push(t),this},_p:o,_a:null,_e:t,_s:new Map,state:n});return c},t.defineStore=function(t,o,r){let c,a;const u="function"==typeof o;function p(t,r){const p=e.hasInjectionContext();(t=t||(p?e.inject(s,null):null))&&i(t),(t=n)._s.has(c)||(u?_(c,o,a,t):function(t,n,s){const{state:o,actions:r,getters:c}=n,a=s.state.value[t];let u;u=_(t,(function(){a||(e.isVue2?e.set(s.state.value,t,o?o():{}):s.state.value[t]=o?o():{});const n=e.toRefs(s.state.value[t]);return $(n,r,Object.keys(c||{}).reduce(((n,o)=>(n[o]=e.markRaw(e.computed((()=>{i(s);const n=s._s.get(t);if(!e.isVue2||n._r)return c[o].call(n,n)}))),n)),{}))}),n,s,0,!0)}(c,a,t));return t._s.get(c)}return"string"==typeof t?(c=t,a=u?r:o):(a=t,c=t.id),p.$id=c,p},t.disposePinia=function(t){t._e.stop(),t._s.clear(),t._p.splice(0),t.state.value={},t._a=null},t.getActivePinia=()=>e.hasInjectionContext()&&e.inject(s)||n,t.mapActions=function(t,e){return Array.isArray(e)?e.reduce(((e,n)=>(e[n]=function(...e){return t(this.$pinia)[n](...e)},e)),{}):Object.keys(e).reduce(((n,i)=>(n[i]=function(...n){return t(this.$pinia)[e[i]](...n)},n)),{})},t.mapGetters=S,t.mapState=j,t.mapStores=function(...t){return t.reduce(((t,e)=>(t[e.$id+b]=function(){return e(this.$pinia)},t)),{})},t.mapWritableState=function(t,e){return Array.isArray(e)?e.reduce(((e,n)=>(e[n]={get(){return t(this.$pinia)[n]},set(e){return t(this.$pinia)[n]=e}},e)),{}):Object.keys(e).reduce(((n,i)=>(n[i]={get(){return t(this.$pinia)[e[i]]},set(n){return t(this.$pinia)[e[i]]=n}},n)),{})},t.setActivePinia=i,t.setMapStoreSuffix=function(t){b=t},t.shouldHydrate=v,t.skipHydrate=function(t){return Object.defineProperty(t,y,{})},t.storeToRefs=function(t){if(e.isVue2)return e.toRefs(t);{const n=e.toRaw(t),i={};for(const s in n){const o=n[s];o.effect?i[s]=e.computed({get:()=>t[s],set(e){t[s]=e}}):(e.isRef(o)||e.isReactive(o))&&(i[s]=e.toRef(t,s))}return i}},t}({},VueDemi);