// ALL JS uses createElement — zero string concatenation with quotes
var ls = {
  g: function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
  s: function(k,v){
    if(k==='tx7'&&Array.isArray(v))v=v.filter(function(t){return !isDerived(t);});
    var str=JSON.stringify(v);
    try{localStorage.setItem(k,str);return true;}catch(e){}
    // Storage full: drop history (least important) and retry
    try{
      if(k!=='hist7'){localStorage.removeItem('hist7');if(typeof changeHistory!=='undefined')changeHistory=[];}
      localStorage.setItem(k,str);return true;
    }catch(e2){
      if(!window._lsWarned){window._lsWarned=true;alert('No se pudo guardar en este dispositivo: el almacenamiento está lleno. Exporta tus datos desde Ajustes.');}
      return false;
    }
  }
};

var DA = [{id:'a1',name:'Bancolombia',icon:'@bank',balance:0},{id:'a2',name:'Nu Bank',icon:'@card',balance:0},{id:'a3',name:'Efectivo',icon:'@cash',balance:0}];
var DC = {
  income:[{id:'ci1',name:'Empleo',icon:'@briefcase'},{id:'ci2',name:'Freelance ingreso',icon:'@laptop'},{id:'ci3',name:'Dividendos',icon:'@trend'},{id:'ci4',name:'Otros ingresos',icon:'@coins'}],
  expenses:[{id:'ce1',name:'Arriendo',icon:'@home'},{id:'ce2',name:'Servicios',icon:'@bulb'},{id:'ce3',name:'Mercado',icon:'@cart'},{id:'ce4',name:'Comidas fuera',icon:'@food'},{id:'ce5',name:'Transporte',icon:'@car'},{id:'ce6',name:'Mantenimiento',icon:'@tools'},{id:'ce7',name:'Seguro carro',icon:'@shield'},{id:'ce8',name:'Viajes',icon:'@plane'},{id:'ce9',name:'Telefono',icon:'@phone'},{id:'ce10',name:'Freelance gasto',icon:'@laptop'},{id:'ce11',name:'Educacion',icon:'@book'},{id:'ce12',name:'Deporte',icon:'@ball'},{id:'ce13',name:'Gastos personales',icon:'@tag'},{id:'ce14',name:'Salud',icon:'@health'},{id:'ce15',name:'Ropa',icon:'@shirt'},{id:'ce16',name:'Suscripciones',icon:'@repeat'},{id:'ce17',name:'Regalos',icon:'@gift'},{id:'ce18',name:'Cadena',icon:'@tag'},{id:'ce19',name:'Otros gastos',icon:'@box'}],
  savings:[{id:'cs1',name:'Fondo renovacion',icon:'@building'},{id:'cs2',name:'Fondo emergencia',icon:'@shield'},{id:'cs3',name:'Inversion',icon:'@chart'},{id:'cs4',name:'Proximo viaje',icon:'@plane'}]
};

var accts=ls.g('ac7',DA), cats=ls.g('ca7',DC), txs=ls.g('tx7',[]), budgets=ls.g('bu7',{});
if(!ls.g('mg8',false)){txs=migrateLegacy(txs);ls.s('tx7',txs);ls.s('mg8',true);}
// One-time upgrade: default emojis → minimalist line icons (custom emojis untouched)
(function migrateIcons(){
  if(ls.g('icmig7',false))return;
  var M={'🏦':'@bank','💜':'@card','💳':'@card','💵':'@cash','💼':'@briefcase','💻':'@laptop','📈':'@trend','💰':'@coins','🏠':'@home','💡':'@bulb','🛒':'@cart','🍽️':'@food','🚗':'@car','🔧':'@tools','🛡️':'@shield','✈️':'@plane','📱':'@phone','📚':'@book','🎾':'@ball','🧴':'@tag','🏥':'@health','👕':'@shirt','🔁':'@repeat','🎁':'@gift','🔗':'@tag','📦':'@box','🏗️':'@building','🆘':'@shield','📊':'@chart','🗺️':'@plane','🪙':'@wallet'};
  accts.forEach(function(a){if(M[a.icon])a.icon=M[a.icon];});
  ['income','expenses','savings'].forEach(function(k){if(cats[k])cats[k].forEach(function(c){if(M[c.icon])c.icon=M[c.icon];});});
  ls.s('ac7',accts);ls.s('ca7',cats);ls.s('icmig7',true);
})();
// Íconos que aún sean emoji (elegidos a mano) → versión de línea; si no hay equivalente, etiqueta
(function migrateIcons8(){
  if(ls.g('icmig8',false))return;
  var M={'🏦':'bank','💜':'card','💳':'card','💵':'cash','💰':'coins','🪙':'coins','💼':'briefcase','💻':'laptop','📈':'trend','📊':'chart','🏠':'home','🏡':'home','💡':'bulb','🛒':'cart','🍽️':'food','🍔':'food','🍕':'food','☕':'coffee','🚗':'car','🚕':'car','🚌':'bus','⛽':'car','🔧':'tools','🛡️':'shield','🆘':'shield','✈️':'plane','🗺️':'plane','📱':'phone','📶':'wifi','💧':'droplet','📚':'book','🎓':'book','🎾':'ball','⚽':'ball','🏋️':'ball','🏥':'health','💊':'health','❤️':'heart','👕':'shirt','🔁':'repeat','🎁':'gift','⭐':'star','📍':'pin','📦':'box','🏗️':'building','🏢':'building','⏰':'clock'};
  function fix(o){if(o&&o.icon&&String(o.icon).charAt(0)!=='@')o.icon='@'+(M[o.icon]||M[String(o.icon).replace(/\uFE0F/g,'')]||'tag');}
  accts.forEach(fix);['income','expenses','savings'].forEach(function(k){(cats[k]||[]).forEach(fix);});
  ls.s('ac7',accts);ls.s('ca7',cats);ls.s('icmig8',true);
})();
var DEFAULT_CID='942296139727-uu6nkcaehiqlckrrtok01fqeul9iei6p.apps.googleusercontent.com';
var driveCid=ls.g('dc7','')||DEFAULT_CID, driveToken=ls.g('dt7',''), driveFileId=ls.g('df7',''), driveSt='off';
var curY=new Date().getFullYear(), curM=new Date().getMonth(), sumY=new Date().getFullYear();
var curFilt='all', curFiltExp='all', curFiltSrc='all', editId=null, mTab='tracking', txType='Expenses', cfgType='', cfgEditId=null, cfgIcon='';
var blurred=ls.g('bl7',false), theme=ls.g('th7','dark'), sumTab='ov';
var iconStyle=ls.g('ic7','color');
var userName=ls.g('un7','David');
var showPendiente=ls.g('sp7',true);
var partnerName=ls.g('pn7','Lina');
var sumMode='year', sumM=new Date().getMonth();
var changeHistory=ls.g('hist7',[]);
var recs=ls.g('rc7',[]);
if(changeHistory.length>10){changeHistory=changeHistory.slice(0,10);try{localStorage.setItem('hist7',JSON.stringify(changeHistory));}catch(e){localStorage.removeItem('hist7');changeHistory=[];}}

function pushHistory(label){
  var snap={txs:JSON.parse(JSON.stringify(baseTxs())),accts:JSON.parse(JSON.stringify(accts)),cats:JSON.parse(JSON.stringify(cats)),budgets:JSON.parse(JSON.stringify(budgets))};
  changeHistory.unshift({id:uid(),label:label,at:new Date().toISOString(),snap:snap});
  if(changeHistory.length>10)changeHistory=changeHistory.slice(0,10);
  ls.s('hist7',changeHistory);
}

function revertHistory(hid){
  var idx=-1;for(var i=0;i<changeHistory.length;i++){if(changeHistory[i].id===hid){idx=i;break;}}
  if(idx<0)return;
  showConfirm('Revertir cambio','Se perderan los cambios realizados despues de este punto.',function(){
  var snap=changeHistory[idx].snap;
  txs=JSON.parse(JSON.stringify(snap.txs));
  accts=JSON.parse(JSON.stringify(snap.accts));
  cats=JSON.parse(JSON.stringify(snap.cats));
  budgets=JSON.parse(JSON.stringify(snap.budgets));
  ls.s('tx7',txs);ls.s('ac7',accts);ls.s('ca7',cats);ls.s('bu7',budgets);
  changeHistory=changeHistory.slice(idx+1);
  ls.s('hist7',changeHistory);
  renderAll();syncDrive();
  });
}

var histExpanded=false;
function showConfirm(title,desc,onOk){
  document.getElementById('confirm-title').textContent=title;
  document.getElementById('confirm-desc').textContent=desc;
  var btn=document.getElementById('confirm-ok-btn');
  var newBtn=btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn,btn);
  newBtn.addEventListener('click',function(){closeM('m-confirm');onOk();});
  document.getElementById('m-confirm').classList.add('open');
}

var currentAcctId=null;

function recalcAcctBalance(){
  var acct=null;for(var i=0;i<accts.length;i++){if(accts[i].id===currentAcctId){acct=accts[i];break;}}
  if(!acct)return;
  var calc=0;
  txs.forEach(function(t){
    if(t.accountId===currentAcctId&&t.mode==='tracking'){
      var affects=(t.type==='Income'||(t.type==='Expenses'&&t.status==='Paid'));
      if(affects)calc+=t.type==='Income'?t.amount:-t.amount;
    }
  });
  acct.balance=calc;
  ls.s('ac7',accts);
  document.getElementById('acct-modal-balance').textContent=fmt(calc);
  document.getElementById('acct-modal-calc').textContent='Saldo recalculado desde movimientos';
  document.getElementById('acct-modal-calc').style.color='var(--green)';
  renderAll();
  // re-open to refresh
  openAcctModal(currentAcctId);
}

function openAcctModal(acctId){
  currentAcctId=acctId;
  var acct=null;for(var i=0;i<accts.length;i++){if(accts[i].id===acctId){acct=accts[i];break;}}
  if(!acct)return;
  document.getElementById('acct-modal-title').textContent=icoLabel(acct.icon,acct.name);
  document.getElementById('acct-modal-balance').textContent=fmt(acct.balance||0);
  var rcl=document.getElementById('acct-modal-recon');if(rcl)rcl.textContent=acct.lastRecon?'Cuadrada el '+fmtDateCO(acct.lastRecon):'Nunca cuadrada con el banco';

  // Get all txs affecting this account
  var related=txs.filter(function(t){
    if(t.mode==='transfer')return t.fromId===acctId||t.toId===acctId;
    return t.accountId===acctId&&t.mode==='tracking'&&!t.isReimb&&!t.isReimbursed;
  }).sort(function(a,b){return new Date(b.date)-new Date(a.date);});

  var totalInc=0,totalExp=0;
  related.forEach(function(t){
    if(t.mode==='transfer'){if(t.toId===acctId)totalInc+=t.amount;else totalExp+=t.amount;return;}
    if(t.type==='Income')totalInc+=t.amount;
    else totalExp+=t.amount;
  });
  document.getElementById('acct-modal-inc').textContent=fmt(totalInc);
  document.getElementById('acct-modal-exp').textContent=fmt(totalExp);
  var calcEl=document.getElementById('acct-modal-calc');
  calcEl.textContent='Calculado desde '+related.length+' movimientos';
  calcEl.style.color='var(--text3)';

  // Conciliador: find shared expenses paid from this account (full amount debited)
  // but only David's part registered in app
  var realDebits=0; // total actually debited from account
  var myPart=0;     // only David's share registered in app
  var adelanto=0;   // difference = amount paid on behalf of others

  // Find shared expense originals that were paid from this account
  txs.forEach(function(t){
    if(t.linkedFrom&&t.accountId===acctId&&t.mode==='tracking'&&t.type==='Expenses'){
      // Find the parent shared expense
      var parent=null;for(var i=0;i<txs.length;i++){if(txs[i].id===t.linkedFrom){parent=txs[i];break;}}
      if(parent&&parent.charge==='Los dos'){
        realDebits+=parent.amount; // full amount left account
        myPart+=t.amount;          // only half registered as mine
        adelanto+=(parent.amount-t.amount); // other half = adelanto
      }
    }
    // Also count personal expenses paid from this account
    if(!t.linkedFrom&&t.mode==='tracking'&&t.type==='Expenses'&&t.accountId===acctId){
      realDebits+=t.amount;
      myPart+=t.amount;
    }
  });
  // Add incomes to real flow (they come in full)
  document.getElementById('acct-real-debits').textContent=fmt(realDebits);
  document.getElementById('acct-my-part').textContent=fmt(myPart);
  document.getElementById('acct-adelanto').textContent=fmt(adelanto);
  document.getElementById('acct-adelanto').style.color=adelanto>0?'var(--amber)':'var(--green)';

  var list=document.getElementById('acct-modal-list');
  while(list.firstChild)list.removeChild(list.firstChild);

  if(!related.length){
    list.appendChild(el('div',{cls:'empty'},[
      el('div',{cls:'ei',html:uiI('bank',34)}),
      el('p',{txt:'Sin movimientos en esta cuenta'})
    ]));
  } else {
    // Group by date
    var grp={};
    related.forEach(function(t){
      var d=new Date(t.date+'T00:00:00');
      var k=d.toLocaleDateString('es-CO',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
      if(!grp[k])grp[k]=[];grp[k].push(t);
    });
    Object.keys(grp).forEach(function(d){
      list.appendChild(el('div',{cls:'txdh',txt:d}));
      grp[d].forEach(function(t){
        var isTr=t.mode==='transfer';
        var isInc=isTr?t.toId===acctId:t.type==='Income';
        var row=el('div',{cls:'tx',click:function(){closeM('m-acct');openTx(t.id);}});
        row.appendChild(el('div',{cls:'tico',html:isTr?TRANSFER_ICO:icoHTML(cIcon(t.category))}));
        var inf=el('div',{cls:'tinf'});
        inf.appendChild(el('div',{cls:'td',txt:t.description}));
        var meta=el('div',{cls:'tm',txt:isTr?(isInc?'Transferencia desde '+acctNameById(t.fromId):'Transferencia hacia '+acctNameById(t.toId)):(t.category||'Sin categoria')});
        if(t.isShared)meta.appendChild(el('span',{cls:'badge sh',txt:'Compartido',style:'margin-left:4px'}));
        if(t.status==='Paid')meta.appendChild(el('span',{cls:'badge paid',txt:'Pagado',style:'margin-left:4px'}));
        inf.appendChild(meta);
        row.appendChild(inf);
        var amtCol=isInc?'var(--green)':'var(--red)';
        row.appendChild(el('div',{cls:'ta',txt:(isInc?'+':'−')+fmt(t.amount),style:'color:'+amtCol}));
        list.appendChild(row);
      });
    });
  }
  document.getElementById('m-acct').classList.add('open');
}

function renderHistory(){
  var wrap=clr('s-hist-wrap');if(!wrap)return;
  if(!changeHistory.length){
    wrap.appendChild(el('div',{cls:'srow'},[el('div',{cls:'srt'},[el('div',{cls:'srs',txt:'Sin cambios registrados aun'})])]));
    return;
  }
  var limit=histExpanded?changeHistory.length:Math.min(4,changeHistory.length);
  for(var i=0;i<limit;i++){
    var h=changeHistory[i];
    var d=new Date(h.at);
    var dateStr=d.toLocaleDateString('es-CO',{day:'numeric',month:'short'})+' '+d.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});
    var btn=el('button',{cls:'btnout',txt:'Revertir'});
    btn.addEventListener('click',(function(hid){return function(){revertHistory(hid);};})(h.id));
    wrap.appendChild(el('div',{cls:'srow'},[
      el('div',{cls:'srt'},[el('div',{cls:'srn',txt:h.label}),el('div',{cls:'srs',txt:dateStr})]),
      btn
    ]));
  }
  if(changeHistory.length>4){
    var toggleRow=el('div',{cls:'addsrow'});
    var toggleTxt=document.createTextNode(histExpanded?'Ver menos':'Ver todos ('+changeHistory.length+')');
    toggleRow.appendChild(toggleTxt);
    toggleRow.addEventListener('click',function(){histExpanded=!histExpanded;renderHistory();});
    wrap.appendChild(toggleRow);
  }
}
var MONTHS=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
var MO=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
var CI=['#4ade80','#a3e635','#34d399','#60a5fa'];
var CE=['#f87171','#fb923c','#fbbf24','#c084fc','#60a5fa','#34d399','#f472b6','#94a3b8'];

function fmt(n){return '$'+Math.round(n).toLocaleString('es-CO');}
function fmtb(n){return blurred?'$ ••••':fmt(n);}
function rawNum(elx){return parseFloat((elx&&elx.value||'').replace(/\./g,''))||0;}
function formatMoneyInput(elx){
  var digits=elx.value.replace(/[^\d]/g,'');
  if(!digits){elx.value='';return;}
  elx.value=parseInt(digits,10).toLocaleString('es-CO');
}
function mkK(y,m){return y+'-'+(m<9?'0':'')+(m+1);}
function mLbl(){return MONTHS[curM]+' '+curY;}
// Id único: tiempo + contador (no se repite en el mismo milisegundo) + 8 caracteres aleatorios
// (no choca entre dos celulares que crean algo al mismo tiempo)
var uidSeq=0;
function uid(){
  uidSeq=(uidSeq+1)%1296;
  var r='';
  if(window.crypto&&crypto.getRandomValues){var a=crypto.getRandomValues(new Uint32Array(2));r=a[0].toString(36)+a[1].toString(36);}
  else r=Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
  return Date.now().toString(36)+('0'+uidSeq.toString(36)).slice(-2)+r.slice(0,8);
}
function cIcon(n){var a=cats.income.concat(cats.expenses,cats.savings);for(var i=0;i<a.length;i++){if(a[i].name===n)return a[i].icon;}return '@tag';}

// ── Minimalist single-color icon library (line icons) ──
var ICONLIB={
  wallet:'<path d="M21 12V8H6a2 2 0 0 1 0-4h13"/><path d="M3 6v12a2 2 0 0 0 2 2h16v-4"/><path d="M18 12a2 2 0 0 0 0 4h3v-4z"/>',
  bank:'<path d="M3 10l9-6 9 6"/><line x1="4" y1="21" x2="20" y2="21"/><line x1="6" y1="10" x2="6" y2="18"/><line x1="10" y1="10" x2="10" y2="18"/><line x1="14" y1="10" x2="14" y2="18"/><line x1="18" y1="10" x2="18" y2="18"/>',
  card:'<rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/>',
  cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><line x1="6" y1="12" x2="6.01" y2="12"/><line x1="18" y1="12" x2="18.01" y2="12"/>',
  coins:'<ellipse cx="12" cy="6.5" rx="7" ry="3"/><path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/><path d="M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
  dollar:'<circle cx="12" cy="12" r="9"/><path d="M14.6 9.3a2.4 2.4 0 0 0-2.4-1.3h-.7a2 2 0 0 0 0 4h1a2 2 0 0 1 0 4h-.8a2.4 2.4 0 0 1-2.3-1.7"/><path d="M12 6.2v1.8M12 16v1.8"/>',
  trend:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  chart:'<line x1="6" y1="20" x2="6" y2="13"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="9"/>',
  clock:'<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',
  repeat:'<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  home:'<path d="M3 10l9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 21 9 13 15 13 15 21"/>',
  building:'<rect x="5" y="3" width="14" height="18" rx="1.5"/><line x1="9" y1="7" x2="9.01" y2="7"/><line x1="15" y1="7" x2="15.01" y2="7"/><line x1="9" y1="11" x2="9.01" y2="11"/><line x1="15" y1="11" x2="15.01" y2="11"/><path d="M10 21v-4h4v4"/>',
  cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.5l2.2 11.4a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 7H5.5"/>',
  tag:'<path d="M20.5 13.5L13 21a2 2 0 0 1-2.8 0L3 13.8V4h9.8l7.7 7.7a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="8" r="1.3"/>',
  food:'<path d="M6 3v6M9 3v7M7.5 3v6"/><path d="M5.2 9h4.6"/><path d="M16 3c-1.4 0-2.5 2.2-2.5 5.5 0 2.3 1 3.5 2.5 3.5v9"/>',
  coffee:'<path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/><line x1="7" y1="2.5" x2="7" y2="4.5"/><line x1="11" y1="2.5" x2="11" y2="4.5"/>',
  car:'<path d="M3 13l1.8-5a2 2 0 0 1 1.9-1.3h8.6a2 2 0 0 1 1.9 1.3L21 13"/><path d="M3 13h18v4a1 1 0 0 1-1 1h-1.5"/><path d="M6.5 18H4a1 1 0 0 1-1-1v-4"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/>',
  bus:'<rect x="4" y="4" width="16" height="14" rx="2"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="8" y1="4" x2="8" y2="12"/><line x1="16" y1="4" x2="16" y2="12"/><line x1="7" y1="21" x2="7" y2="18"/><line x1="17" y1="21" x2="17" y2="18"/>',
  plane:'<path d="M21 15.5l-8-2.5V6.5a1.5 1.5 0 0 0-3 0V13l-8 2.5v2l8-1.5v3l-2 1.5v1.5l3.5-1 3.5 1V20l-2-1.5v-3z"/>',
  bulb:'<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.1V16h6v-.4c0-.8.4-1.5 1-2.1A6 6 0 0 0 12 3z"/>',
  droplet:'<path d="M12 3s6 5.7 6 10a6 6 0 0 1-12 0c0-4.3 6-10 6-10z"/>',
  wifi:'<path d="M2 8.5a16 16 0 0 1 20 0"/><path d="M5 12a11 11 0 0 1 14 0"/><path d="M8.5 15.5a6 6 0 0 1 7 0"/><line x1="12" y1="19" x2="12.01" y2="19"/>',
  phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><line x1="11" y1="18" x2="13" y2="18"/>',
  laptop:'<rect x="4" y="5" width="16" height="11" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/>',
  briefcase:'<rect x="2" y="7" width="20" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="2" y1="12" x2="22" y2="12"/>',
  book:'<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v18H5.5A1.5 1.5 0 0 1 4 19.5z"/><path d="M4 16.5A1.5 1.5 0 0 1 5.5 15H20"/>',
  health:'<rect x="9" y="3" width="6" height="18" rx="1.5"/><rect x="3" y="9" width="18" height="6" rx="1.5"/>',
  heart:'<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>',
  gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/><line x1="12" y1="8" x2="12" y2="21"/><path d="M12 8S10.5 3 8 4.5 9.5 8 12 8zM12 8s1.5-5 4-3.5S14.5 8 12 8z"/>',
  star:'<polygon points="12 2.5 15 9 22 9.5 16.5 14 18.3 21 12 17.2 5.7 21 7.5 14 2 9.5 9 9"/>',
  pin:'<path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2"/>',
  tools:'<path d="M14.7 6.3a4 4 0 0 0-5 5.2l-6 6 2.8 2.8 6-6a4 4 0 0 0 5.2-5l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  shirt:'<path d="M8.5 3l3.5 2.5L15.5 3 21 6l-2.5 4-2.5-1.2V21H8V8.8L5.5 10 3 6z"/>',
  shield:'<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/>',
  ball:'<circle cx="12" cy="12" r="9"/><path d="M5 7c3.5 1 6.5 4 8 9M19 7c-3.5 1-6.5 4-8 9M3.5 13c4-.5 8 1 11 4M20.5 13c-4-.5-8 1-11 4"/>',
  box:'<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'
};
// ── Íconos de interfaz (botones, avisos). Separados de ICONLIB para que no salgan en el selector de categorías ──
var UIICO={
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.7 3.6M6.6 6.6C3.9 8.3 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><line x1="3" y1="3" x2="21" y2="21"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun:'<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  x:'<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  chevdown:'<polyline points="6 9 12 15 18 9"/>',
  chevup:'<polyline points="6 15 12 9 18 15"/>',
  search:'<circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/>',
  check:'<polyline points="4 12.5 9.5 18 20 6.5"/>',
  checkcircle:'<circle cx="12" cy="12" r="9"/><polyline points="8 12.5 11 15.5 16.5 9.5"/>',
  alert:'<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  trash:'<polyline points="3 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  edit:'<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><line x1="13.5" y1="6.5" x2="17.5" y2="10.5"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  cloud:'<path d="M7 18a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 19 9.5 4.3 4.3 0 0 1 18 18z"/>',
  palette:'<path d="M12 3a9 9 0 0 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.9-.6-1.3-.6-2.2 0-.9.7-1.7 1.7-1.7H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0 1 14 0v1"/>',
  inbox:'<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.5 5.1L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z"/>',
  receipt:'<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/>',
  mic:'<rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="21.5"/>',
  calendar:'<rect x="3" y="4.5" width="18" height="17" rx="2"/><line x1="16" y1="2.5" x2="16" y2="6.5"/><line x1="8" y1="2.5" x2="8" y2="6.5"/><line x1="3" y1="10" x2="21" y2="10"/>',
  transfer:'<path d="M7 7h13l-4-4"/><path d="M17 17H4l4 4"/>',
  list:'<line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  target:'<circle cx="12" cy="12" r="1"/><path d="M12 7a5 5 0 1 0 5 5"/><path d="M13 3.06A9 9 0 1 0 20.94 11"/><path d="M15 6v3h3l3-3h-3V3z"/><path d="M15 9l-3 3"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  chevleft:'<polyline points="15 18 9 12 15 6"/>',
  dots:'<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>'
};
function uiI(n,s){var p=UIICO[n]||ICONLIB[n];return p?svgWrap(p,s||18):'';}
function hydrateIcons(root){(root||document).querySelectorAll('[data-ui]').forEach(function(e){e.innerHTML=uiI(e.getAttribute('data-ui'),+e.getAttribute('data-s')||18);});}
function svgWrap(inner,size){size=size||20;return '<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="display:block">'+inner+'</svg>';}
function escIco(s){return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
function icoHTML(val,size){if(typeof val==='string'&&val.charAt(0)==='@'&&ICONLIB[val.slice(1)])return svgWrap(ICONLIB[val.slice(1)],size);return svgWrap(ICONLIB.tag,size);}
function icoLabel(val,name){return name;}
function mTxs(list){return list.filter(function(t){var d=new Date(t.date+'T00:00:00');return d.getFullYear()===curY&&d.getMonth()===curM;});}

// ── el() helper: create element with props ──
function el(tag,props,children){
  var e=document.createElement(tag);
  if(props){Object.keys(props).forEach(function(k){
    if(k==='cls'){e.className=props[k];}
    else if(k==='txt'){e.textContent=props[k];}
    else if(k==='html'){e.innerHTML=props[k];}
    else if(k==='click'){e.addEventListener('click',props[k]);}
    else if(k==='style'){e.style.cssText=props[k];}
    else{e.setAttribute(k,props[k]);}
  });}
  if(children){children.forEach(function(c){if(c)e.appendChild(c);});}
  return e;
}
function clr(id){var e=document.getElementById(id);if(e){while(e.firstChild)e.removeChild(e.firstChild);}return e;}
function app(id,child){var e=document.getElementById(id);if(e&&child)e.appendChild(child);}

function setTheme(t){
  theme=t;document.documentElement.setAttribute('data-theme',t);ls.s('th7',t);
  var dk=document.getElementById('th-dk'),lt=document.getElementById('th-lt');
  if(dk)dk.classList.toggle('active',t==='dark');
  if(lt)lt.classList.toggle('active',t==='light');
  var tb=document.getElementById('d-themebtn');if(tb)tb.innerHTML=uiI(t==='dark'?'sun':'moon',19);
}

function setIconStyle(s){
  iconStyle=s;ls.s('ic7',s);
  document.body.classList.toggle('mono-icons',s==='mono');
  var co=document.getElementById('ic-co'),mn=document.getElementById('ic-mn');
  if(co)co.classList.toggle('active',s==='color');
  if(mn)mn.classList.toggle('active',s==='mono');
}

function toggleBlur(){
  blurred=!blurred;ls.s('bl7',blurred);
  var sb=document.getElementById('s-hide-btn');if(sb)sb.textContent=blurred?'Desactivar':'Activar';
  var eb=document.getElementById('eyebtn');if(eb)eb.innerHTML=uiI(blurred?'eyeoff':'eye',19);
  renderAll();
}
function applyBlur(){
  /* only hero (ingresos/gastos/disponible) and KPIs (disponible/ahorro/pendiente) are covered, via fmtb dots */
}

function showPage(p){
  if(p!=='expenses')exitSelMode();
  document.querySelectorAll('.page').forEach(function(e){e.classList.remove('active');});
  document.querySelectorAll('nav button').forEach(function(e){e.classList.remove('active');});
  document.getElementById('page-'+p).classList.add('active');
  var nb=document.getElementById('nav-'+p);if(nb)nb.classList.add('active');
  document.getElementById('fab').style.display='flex';
  if(p==='budget')renderBudget();
  renderAll();
}

function cm(d){curM+=d;if(curM>11){curM=0;curY++;}if(curM<0){curM=11;curY--;}var onBudget=document.getElementById('page-budget')&&document.getElementById('page-budget').classList.contains('active');if(onBudget)renderBudget();renderAll();}
function cmY(d){sumY+=d;renderSummary();}
function cmSM(d){sumM+=d;if(sumM>11){sumM=0;sumY++;}if(sumM<0){sumM=11;sumY--;}renderSummary();}
function setSumMode(m){
  sumMode=m;
  document.getElementById('summode-year').classList.toggle('active',m==='year');
  document.getElementById('summode-month').classList.toggle('active',m==='month');
  renderSummary();
}

function recalcAllBalances(){
  accts.forEach(function(acct){
    var calc=0;
    txs.forEach(function(t){
      if(t.mode==='transfer'){if(t.fromId===acct.id)calc-=t.amount;if(t.toId===acct.id)calc+=t.amount;return;}
      if(t.accountId===acct.id&&t.mode==='tracking'){
        // Personal expenses (mode=tracking) always affect balance
        // Linked shared expenses also affect balance (they are copies of paid shared)
        if(t.isReimbursed) return; // adelanto ya reembolsado - no afecta balance
        if(t.isReimb) return; // reembolso artificial - no afecta balance
        if(t.isAdelanto&&t.isReimbursed) return; // adelanto pagado
        var isPaidExpense=(t.type==='Expenses'&&(t.status==='Paid'||!t.status||t.linkedFrom));
        var affects=(t.type==='Income'||isPaidExpense);
        if(affects)calc+=t.type==='Income'?t.amount:-t.amount;
      }
    });
    acct.balance=calc;
  });
  ls.s('ac7',accts);
}

// ── Gastos compartidos: una sola fuente de verdad ──
// Solo se guarda el gasto compartido. Tu parte y los adelantos se calculan al vuelo.
// Versión: 2.x para cambios normales (2.1, 2.2…); el primer número sube solo con cambios grandes (3.0)
var APP_VERSION='2.7', APP_DATE='2026-10-16';
function isDerived(t){return !!(t&&t.mode==='tracking'&&(t.linkedFrom||t.isAdelanto||t.isReimb));}
function baseTxs(){return txs.filter(function(t){return !isDerived(t);});}
function acctNameById(id){for(var i=0;i<accts.length;i++)if(accts[i].id===id)return accts[i].name;return '';}
function deriveFrom(p){
  var out=[];if(!p||p.mode!=='expenses')return out;
  var ch=p.charge,st=p.status,acc=p.payAccountId;
  var isRealDebit=(p.source==='Tarjeta débito'||p.source==='Efectivo');
  var davidPaid=(st==='Paid'||st==='DavidPaidLinaPending');
  var clean=(p.description||'').replace(/ \(compartido\)/g,'');
  if(davidPaid&&(ch==='David'||ch==='Los dos')){
    var a1=acc||(accts[0]&&accts[0].id);
    out.push({id:p.id+'~d',mode:'tracking',type:'Expenses',description:ch==='Los dos'?clean+' (compartido)':clean,
      amount:ch==='Los dos'?p.amount/2:p.amount,date:p.date,category:p.category,account:acctNameById(a1),accountId:a1,
      linkedFrom:p.id,isShared:ch==='Los dos'});
  }
  if(isRealDebit&&acc){
    var amt=0,who=ch==='Los dos'?partnerName:ch;
    if((ch==='Lina'||ch==='Otro')&&st!=='Paid')amt=p.amount;
    else if(ch==='Los dos'&&st==='DavidPaidLinaPending')amt=p.amount/2;
    if(amt>0)out.push({id:p.id+'~a',mode:'tracking',type:'Expenses',description:clean+' (adelanto '+who+')',
      amount:amt,date:p.date,category:p.category,account:acctNameById(acc),accountId:acc,linkedFrom:p.id,isAdelanto:true});
  }
  return out;
}
function rebuildDerived(){
  var base=baseTxs(),derived=[];
  // Limpieza: un gasto de Movimientos siempre está pagado; el estado solo aplica a Pendiente
  base.forEach(function(t){if(t.mode==='tracking'&&t.status)delete t.status;});
  base.forEach(function(p){derived=derived.concat(deriveFrom(p));});
  txs=base.concat(derived);
}
// Convierte datos del formato anterior (con copias) al nuevo, sin perder dinero
function migrateLegacy(list){
  list=list||[];var byId={};list.forEach(function(t){byId[t.id]=t;});
  var out=[];
  list.forEach(function(t){
    if(!isDerived(t)){out.push(t);return;}
    var par=byId[t.linkedFrom];
    if(par){if(!par.payAccountId&&!t.isReimb&&t.accountId)par.payAccountId=t.accountId;return;}
    if(t.isReimb||t.isReimbursed)return;
    var cp=JSON.parse(JSON.stringify(t));delete cp.linkedFrom;delete cp.isAdelanto;delete cp.isShared;out.push(cp);
  });
  out.forEach(function(t){delete t.linkedTxId;delete t.adelantoTxId;delete t.adelantoAmt;delete t.reimbTxId;delete t.isReimbursed;});
  return out;
}


// ══════ v9: Pagar varios · Sin categoría · Recurrentes · Copiar presupuesto · Cuadrar cuenta ══════
function findTx(id){for(var i=0;i<txs.length;i++)if(txs[i].id===id)return txs[i];return null;}
function findAcct(id){for(var i=0;i<accts.length;i++)if(accts[i].id===id)return accts[i];return null;}
function todayISO(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function fmtDateCO(iso){if(!iso)return '';return new Date(iso+'T00:00:00').toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'});}

// ── 3. Pagar varios a la vez ──
var selMode=false,selIds={};
function toggleSelMode(){selMode=!selMode;selIds={};renderExpenses();updateSelBar();}
function exitSelMode(){if(!selMode)return;selMode=false;selIds={};updateSelBar();}
function selShare(t){return (t.charge==='Los dos'&&(curFiltExp==='David'||curFiltExp==='Lina'))?t.amount/2:t.amount;}
function bulkNextStatus(t){
  var isDeb=(t.source==='Tarjeta débito'||t.source==='Efectivo');
  if(t.charge!=='Los dos')return 'Paid';
  if(curFiltExp==='Lina'){if(t.status==='DavidPaidLinaPending')return 'Paid';return isDeb?'Paid':'LinaPaidDavidPending';}
  if(curFiltExp==='David'){if(t.status==='LinaPaidDavidPending')return 'Paid';return 'DavidPaidLinaPending';}
  return 'Paid';
}
function selVisible(){return Array.prototype.map.call(document.querySelectorAll('#e-list [data-selid]'),function(n){return n.getAttribute('data-selid');});}
function selectAllVisible(){
  var v=selVisible();var all=v.length&&v.every(function(id){return selIds[id];});
  v.forEach(function(id){if(all)delete selIds[id];else selIds[id]=true;});
  renderExpenses();updateSelBar();
}
function updateSelBar(){
  var bar=document.getElementById('sel-bar'),fab=document.getElementById('fab');
  var tg=document.getElementById('sel-toggle'),sa=document.getElementById('sel-all');
  if(tg)tg.textContent=selMode?'Cancelar':'Seleccionar';
  if(sa)sa.style.display=selMode?'inline':'none';
  if(!bar)return;
  if(!selMode){bar.style.display='none';if(fab)fab.style.display='flex';return;}
  if(fab)fab.style.display='none';
  var ids=Object.keys(selIds),tot=0;
  ids.forEach(function(id){var t=findTx(id);if(t)tot+=selShare(t);});
  document.getElementById('sel-count').textContent=ids.length+' seleccionado'+(ids.length===1?'':'s')+' · '+fmt(tot);
  var sp=document.getElementById('sel-pay');sp.disabled=!ids.length;sp.style.opacity=ids.length?'1':'.45';
  bar.style.display='flex';
}
function bulkNeedsAcc(t){var ns=bulkNextStatus(t);var dp=(ns==='Paid'||ns==='DavidPaidLinaPending');return dp&&(t.charge==='David'||t.charge==='Los dos')&&!t.payAccountId;}
function bulkPayAsk(){
  var items=Object.keys(selIds).map(findTx).filter(Boolean);if(!items.length)return;
  var tot=0;items.forEach(function(t){tot+=selShare(t);});
  var who=curFiltExp==='David'?userName:curFiltExp==='Lina'?partnerName:null;
  document.getElementById('bulk-desc').textContent=items.length+' gasto'+(items.length===1?'':'s')+' por '+fmt(tot)+(who?' quedarán como pagados por '+who+'.':' quedarán como pagados.');
  var needAcc=items.some(bulkNeedsAcc);
  document.getElementById('bulk-acc-row').style.display=needAcc?'block':'none';
  var s=document.getElementById('bulk-acc');while(s.firstChild)s.removeChild(s.firstChild);
  accts.forEach(function(a){var o=document.createElement('option');o.value=a.id;o.textContent=a.name;s.appendChild(o);});
  document.getElementById('m-bulk').classList.add('open');
}
function bulkPayConfirm(){
  var ids=Object.keys(selIds);var acc=document.getElementById('bulk-acc').value;
  pushHistory('Marcar '+ids.length+' como pagados');
  ids.forEach(function(id){var t=findTx(id);if(!t)return;
    var need=bulkNeedsAcc(t);t.status=bulkNextStatus(t);if(need)t.payAccountId=acc;});
  closeM('m-bulk');selMode=false;selIds={};
  ls.s('tx7',txs);renderAll();updateSelBar();syncDrive();
}

// ── 2. Sin categoría ──
function catValid(t){var list=t.type==='Income'?cats.income:cats.expenses.concat(cats.savings);for(var i=0;i<list.length;i++)if(list[i].name===t.category)return true;return false;}
function noCatTxs(){return txs.filter(function(t){if(t.isAdjust||isDerived(t))return false;if(t.mode!=='tracking'&&t.mode!=='expenses')return false;return !t.category||!catValid(t);});}
function goNoCat(){curFilt='__nocat';showPage('tracking');renderTracking();}

// ── 4. Recurrentes ──
function saveRecs(){ls.s('rc7',recs);}
function findRec(id){for(var i=0;i<recs.length;i++)if(recs[i].id===id)return recs[i];return null;}
function todayMk(){var d=new Date();return mkK(d.getFullYear(),d.getMonth());}
function recDay(iso){var n=parseInt((iso||'').split('-')[2],10)||1;return Math.min(Math.max(n,1),28);}
function recFromTx(t,r){
  r=r||{id:uid(),done:{}};
  r.kind=t.mode==='expenses'?'shared':(t.type==='Income'?'income':'expense');
  r.description=t.description;r.amount=t.amount;r.category=t.category;r.accountId=t.accountId;r.day=recDay(t.date);
  if(r.kind==='shared'){r.charge=t.charge;r.source=t.source;r.status=t.status;r.payAccountId=t.payAccountId||null;}
  return r;
}
function recsDue(){var mk=todayMk(),day=new Date().getDate();
  return recs.filter(function(r){return r.active!==false&&!(r.done&&r.done[mk])&&(r.start||'')<=mk&&r.day<=day;});}
function recApproveOne(r,amt){
  var mk=todayMk();var acct=findAcct(r.accountId);
  var t={id:uid(),description:r.description,amount:amt||r.amount,date:mk+'-'+String(r.day).padStart(2,'0'),category:r.category,recId:r.id,accountId:r.accountId||'',account:acct?acct.name:''};
  if(r.kind==='shared'){t.mode='expenses';t.type='Expenses';t.charge=r.charge;t.source=r.source;t.status=r.status||'Unpaid';t.payAccountId=r.payAccountId||null;}
  else{t.mode='tracking';t.type=r.kind==='income'?'Income':'Expenses';}
  txs.unshift(t);r.amount=t.amount;r.done=r.done||{};r.done[mk]='a';
}
function recAmountFromRow(id){var inp=document.getElementById('rq_'+id);return inp?rawNum(inp):0;}
function recApprove(id){var r=findRec(id);if(!r)return;pushHistory('Aprobar recurrente: '+r.description);
  recApproveOne(r,recAmountFromRow(id));saveRecs();ls.s('tx7',txs);renderAll();syncDrive();}
function recApproveAll(){var due=recsDue();if(!due.length)return;pushHistory('Aprobar '+due.length+' recurrentes');
  due.forEach(function(r){recApproveOne(r,recAmountFromRow(r.id));});saveRecs();ls.s('tx7',txs);renderAll();syncDrive();}
function recSkip(id){var r=findRec(id);if(!r)return;r.done=r.done||{};r.done[todayMk()]='s';saveRecs();renderAll();syncDrive();}
function renderRecsCard(){
  var w=document.getElementById('d-recs');if(!w)return;
  while(w.firstChild)w.removeChild(w.firstChild);
  var due=recsDue();if(!due.length){w.style.display='none';return;}
  w.style.display='block';
  var card=el('div',{style:'background:var(--bg2);border-radius:16px;border:.5px solid var(--border);padding:14px'});
  card.appendChild(el('div',{style:'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px'},[
    el('div',{style:'font-size:14px;font-weight:700;display:flex;align-items:center;gap:7px'},[el('span',{cls:'uii',html:uiI('repeat',16)}),el('span',{txt:due.length+' recurrente'+(due.length===1?'':'s')+' por aprobar'})]),
    due.length>1?el('button',{txt:'Aprobar todos',click:recApproveAll,style:'background:var(--lime);color:#111;border:none;border-radius:10px;padding:7px 11px;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer'}):null
  ]));
  due.forEach(function(r){
    var acct=findAcct(r.accountId);
    var sub=(r.kind==='shared'?'Compartido · '+(r.charge||''):(acct?acct.name:''))+' · día '+r.day;
    var inp=el('input',{id:'rq_'+r.id,type:'text',inputmode:'numeric',oninput:'formatMoneyInput(this)',style:'width:96px;text-align:right;padding:7px 8px;border:.5px solid var(--bord2);border-radius:8px;background:var(--inp);color:var(--text);font-family:inherit;font-size:13px;font-weight:600'});
    inp.value=Number(r.amount||0).toLocaleString('es-CO');
    var row=el('div',{style:'display:flex;align-items:center;gap:8px;padding:9px 0;border-top:.5px solid var(--border)'},[
      el('div',{cls:'bpico',html:icoHTML(cIcon(r.category))}),
      el('div',{style:'flex:1;min-width:0'},[el('div',{txt:r.description,style:'font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'}),el('div',{txt:sub,style:'font-size:11px;color:var(--text3)'})]),
      inp,
      el('button',{html:uiI('check',16),title:'Aprobar','aria-label':'Aprobar',click:function(){recApprove(r.id);},style:'width:32px;height:32px;border-radius:50%;border:none;background:var(--lime);color:#111;cursor:pointer;display:flex;align-items:center;justify-content:center'}),
      el('button',{html:uiI('x',15),title:'Omitir este mes','aria-label':'Omitir este mes',click:function(){recSkip(r.id);},style:'width:32px;height:32px;border-radius:50%;border:.5px solid var(--border2);background:none;color:var(--text2);cursor:pointer;display:flex;align-items:center;justify-content:center'})
    ]);
    card.appendChild(row);
  });
  card.appendChild(el('div',{txt:'Aprobar lo registra · la X lo omite solo este mes',style:'font-size:10.5px;color:var(--text3);margin-top:6px'}));
  w.appendChild(card);
}
var recEditId=null;
function openRecEdit(id){var r=findRec(id);if(!r)return;recEditId=id;
  document.getElementById('rec-d').value=r.description;document.getElementById('rec-m').value=Number(r.amount||0).toLocaleString('es-CO');
  document.getElementById('rec-day').value=r.day;document.getElementById('m-rec').classList.add('open');}
function saveRecEdit(){var r=findRec(recEditId);if(!r)return;
  var d=document.getElementById('rec-d').value.trim();var m=rawNum(document.getElementById('rec-m'));var day=parseInt(document.getElementById('rec-day').value,10);
  if(!d||!m||!day){alert('Completa descripción, monto y día');return;}
  r.description=d;r.amount=m;r.day=Math.min(Math.max(day,1),28);saveRecs();closeM('m-rec');renderAll();syncDrive();}
function delRec(id){var r=findRec(id);if(!r)return;
  showConfirm('Eliminar recurrente','"'+r.description+'" dejará de aparecer cada mes. Los movimientos ya registrados no se borran.',function(){
    recs=recs.filter(function(x){return x.id!==id;});saveRecs();renderAll();syncDrive();});}
function renderRecsSettings(){
  var w=document.getElementById('s-rec-wrap');if(!w)return;while(w.firstChild)w.removeChild(w.firstChild);
  if(!recs.length){w.appendChild(el('div',{txt:'Activa «Repetir cada mes» al crear un movimiento para que aparezca aquí.',style:'padding:14px 16px;font-size:12px;color:var(--text3)'}));return;}
  recs.forEach(function(r){
    var kindTxt=r.kind==='income'?'Ingreso':r.kind==='shared'?'Compartido':'Gasto';
    var eb=el('button',{html:uiI('edit',17),'aria-label':'Editar',click:function(){openRecEdit(r.id);}});
    var db=el('button',{html:uiI('trash',17),'aria-label':'Eliminar',click:function(){delRec(r.id);}});
    w.appendChild(el('div',{cls:'srow'},[el('div',{cls:'srico',html:icoHTML(cIcon(r.category))}),
      el('div',{cls:'srt'},[el('div',{cls:'srn',txt:r.description}),el('div',{cls:'srs',txt:kindTxt+' · '+fmt(r.amount)+' · día '+r.day})]),
      el('div',{cls:'sra'},[eb,db])]));
  });
}

// ── 5. Copiar presupuesto ──
var bdgDismiss={};
function prevMonthInfo(){var d=new Date(curY,curM-1,1);return {mk:mkK(d.getFullYear(),d.getMonth()),name:MONTHS[d.getMonth()]};}
function budgetPrefixLists(){return [['i:',cats.income],['e:',cats.expenses],['s:',cats.savings]];}
function copyPrevBudget(){
  var pm=prevMonthInfo(),bp=budgets[pm.mk]||{},n=0;
  budgetPrefixLists().forEach(function(pl){pl[1].forEach(function(c){
    var inp=document.getElementById('bi_'+c.id);var v=bp[pl[0]+c.id]||bp[c.name]||0;
    if(inp&&v&&!rawNum(inp)){inp.value=Number(v).toLocaleString('es-CO');n++;}
  });});
  updateBudgetTotals();bdgDismiss[mkK(curY,curM)]=true;
  var bn=document.getElementById('b-copy-banner');
  if(bn){while(bn.firstChild)bn.removeChild(bn.firstChild);
    bn.appendChild(el('div',{txt:'✓ Se copiaron '+n+' valores de '+pm.name+'. Ajusta los que necesites y toca «Guardar presupuesto».',style:'font-size:12.5px;color:var(--green);font-weight:600;line-height:1.45'}));}
}
function dismissBudgetBanner(){bdgDismiss[mkK(curY,curM)]=true;var bn=document.getElementById('b-copy-banner');if(bn)bn.style.display='none';}
function renderBudgetBanner(){
  var bn=document.getElementById('b-copy-banner');if(!bn)return;
  var mk=mkK(curY,curM),pm=prevMonthInfo(),b=budgets[mk]||{},bp=budgets[pm.mk]||{};
  if(Object.keys(b).length||!Object.keys(bp).length||bdgDismiss[mk]){bn.style.display='none';return;}
  var tot=0;Object.keys(bp).forEach(function(k){if(k.indexOf('e:')===0||k.indexOf('s:')===0)tot+=bp[k];});
  while(bn.firstChild)bn.removeChild(bn.firstChild);
  bn.appendChild(el('div',{txt:'Este mes no tiene presupuesto',style:'font-size:14px;font-weight:700;margin-bottom:3px'}));
  bn.appendChild(el('div',{txt:'Puedes usar el de '+pm.name+' como base y cambiar solo lo necesario.',style:'font-size:12px;color:var(--text2);margin-bottom:11px'}));
  bn.appendChild(el('div',{style:'display:flex;gap:8px'},[
    el('button',{txt:'Usar el de '+pm.name+' ('+fmt(tot)+')',click:copyPrevBudget,style:'flex:1;background:var(--lime);color:#111;border:none;border-radius:10px;padding:10px;font-size:12.5px;font-weight:700;font-family:inherit;cursor:pointer'}),
    el('button',{txt:'En blanco',click:dismissBudgetBanner,style:'background:var(--bg3);color:var(--text2);border:none;border-radius:10px;padding:10px 12px;font-size:12.5px;font-weight:600;font-family:inherit;cursor:pointer'})
  ]));
  bn.style.display='block';
}

// ── 1. Cuadrar con el banco ──
function openAdjust(){var a=findAcct(currentAcctId);if(!a)return;
  document.getElementById('adj-acct').textContent=a.name+(a.lastRecon?' · cuadrada por última vez el '+fmtDateCO(a.lastRecon):' · nunca se ha cuadrado');
  document.getElementById('adj-bank').value='';adjCompute();document.getElementById('m-adj').classList.add('open');}
function adjDiff(){var a=findAcct(currentAcctId);var inp=document.getElementById('adj-bank');
  if(!a||!inp.value.trim())return null;return rawNum(inp)-Math.round(a.balance||0);}
function adjCompute(){
  var a=findAcct(currentAcctId),r=document.getElementById('adj-result'),btn=document.getElementById('adj-btn');if(!a||!r)return;
  while(r.firstChild)r.removeChild(r.firstChild);
  var diff=adjDiff();
  function line(l,v,col){return el('div',{style:'display:flex;justify-content:space-between;padding:5px 0;font-size:13px'},[el('span',{txt:l,style:'color:var(--text2)'}),el('span',{txt:v,style:'font-weight:700;'+(col?'color:'+col:'')})]);}
  var box=el('div',{style:'background:var(--bg3);border-radius:12px;padding:10px 12px'});
  box.appendChild(line('Saldo en la app',fmt(a.balance||0)));
  if(diff===null){r.appendChild(box);btn.textContent='Escribe el saldo del banco';btn.style.opacity='.5';return;}
  box.appendChild(line('Saldo en el banco',fmt(rawNum(document.getElementById('adj-bank')))));
  box.appendChild(line('Diferencia',(diff>0?'+':diff<0?'−':'')+fmt(Math.abs(diff)),diff===0?'var(--green)':'var(--amber)'));
  r.appendChild(box);btn.style.opacity='1';
  if(diff===0){r.appendChild(el('div',{txt:'✓ La cuenta está cuadrada.',style:'font-size:12.5px;color:var(--green);font-weight:600;margin-top:10px'}));btn.textContent='Marcar como cuadrada';}
  else{r.appendChild(el('div',{txt:'Antes de ajustar, revisa si falta registrar algún movimiento'+(a.lastRecon?' desde el '+fmtDateCO(a.lastRecon):'')+'. El ajuste corrige el saldo sin afectar tu presupuesto ni el resumen.',style:'font-size:12px;color:var(--text2);line-height:1.5;margin-top:10px'}));
    btn.textContent='Crear ajuste por '+(diff>0?'+':'−')+fmt(Math.abs(diff));}
}
function adjApply(){
  var a=findAcct(currentAcctId);var diff=adjDiff();if(!a||diff===null)return;
  if(diff!==0){pushHistory('Ajuste de saldo: '+a.name);
    txs.unshift({id:uid(),mode:'tracking',type:diff>0?'Income':'Expenses',description:'Ajuste de saldo',amount:Math.abs(diff),date:todayISO(),category:'Ajuste de saldo',account:a.name,accountId:a.id,isAdjust:true});}
  a.lastRecon=todayISO();ls.s('tx7',txs);ls.s('ac7',accts);closeM('m-adj');renderAll();openAcctModal(a.id);syncDrive();
}


// ══════ v11: Transferencias · Prestado · Buscador ══════
var TRANSFER_ICO='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h13l-4-4"/><path d="M17 17H4l4 4"/></svg>';
function populateTransferSel(){
  ['f-from','f-to'].forEach(function(id,ix){
    var s=document.getElementById(id);if(!s)return;var cur=s.value;
    while(s.firstChild)s.removeChild(s.firstChild);
    accts.forEach(function(a){var o=document.createElement('option');o.value=a.id;o.textContent=a.name;s.appendChild(o);});
    if(cur&&findAcct(cur))s.value=cur;else if(accts[ix])s.value=accts[ix].id;
  });
}
function saveTransfer(){
  var desc=document.getElementById('f-d').value.trim()||'Transferencia';
  var amount=rawNum(document.getElementById('f-m'));var date=document.getElementById('f-dt').value;
  var from=document.getElementById('f-from').value,to=document.getElementById('f-to').value;
  if(!amount||!date){alert('Completa monto y fecha');return;}
  if(!from||!to||from===to){alert('Elige dos cuentas distintas');return;}
  pushHistory((editId?'Editar':'Nueva')+' transferencia');
  var t={id:editId||uid(),mode:'transfer',type:'Transfer',description:desc,amount:amount,date:date,fromId:from,toId:to,category:'Transferencia'};
  if(editId){for(var i=0;i<txs.length;i++){if(txs[i].id===editId){txs[i]=t;break;}}}else txs.unshift(t);
  ls.s('tx7',txs);closeM('m-tx');renderAll();syncDrive();
}
function makeTransferEl(t){
  var div=el('div',{cls:'tx',click:function(){openTx(t.id);}});
  div.appendChild(el('div',{cls:'tico',html:TRANSFER_ICO}));
  var inf=el('div',{cls:'tinf'});
  inf.appendChild(el('div',{cls:'td',txt:t.description}));
  var meta=el('div',{cls:'tm',txt:acctNameById(t.fromId)+' → '+acctNameById(t.toId)});
  meta.appendChild(el('span',{cls:'badge',txt:'Transferencia',style:'margin-left:4px;background:var(--bg3);color:var(--text2)'}));
  inf.appendChild(meta);div.appendChild(inf);
  div.appendChild(el('div',{cls:'ta',txt:fmt(t.amount),style:'color:var(--text2)'}));
  return div;
}
function renderLent(){
  var w=document.getElementById('d-lent');if(!w)return;
  var by={},tot=0;
  txs.forEach(function(t){if(!t.isAdelanto)return;var p=findTx(t.linkedFrom);var who=p&&p.charge==='Otro'?'Otro':partnerName;by[who]=(by[who]||0)+t.amount;tot+=t.amount;});
  if(!tot){w.style.display='none';return;}
  document.getElementById('d-lent-txt').textContent='Prestado · '+Object.keys(by).map(function(k){return k+' '+fmt(by[k]);}).join(' · ');
  w.style.display='flex';
}
var trackQuery='';
function normTxt(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function matchQuery(t,q){
  var hay=normTxt([t.description,t.category,t.account,t.fromId?acctNameById(t.fromId):'',t.toId?acctNameById(t.toId):''].join(' '));
  return normTxt(q).split(/\s+/).filter(Boolean).every(function(w){
    if(/^\$?\d[\d.,]*$/.test(w)){var d=w.replace(/\D/g,'');return d.length>0&&String(Math.round(t.amount)).indexOf(d)>=0;}
    return hay.indexOf(w)>=0;
  });
}
function clearSearch(){trackQuery='';var s=document.getElementById('t-search');if(s)s.value='';renderTracking();}


// ══════ v12: Por asignar · Conciliación con desglose ══════
function concilData(y,m){
  var upTo=function(d){var x=new Date(d+'T00:00:00');return x.getFullYear()<y||(x.getFullYear()===y&&x.getMonth()<=m);};
  var catNames=cats.expenses.concat(cats.savings).map(function(c){return c.name;});
  var o={cuentas:0,I:0,B:0,Binc:0,Ecat:0,nocat:0,prest:0,adj:0,fut:0};
  accts.forEach(function(a){o.cuentas+=a.balance||0;});
  txs.forEach(function(t){
    if(t.mode!=='tracking')return;
    if(t.isAdjust){o.adj+=(t.type==='Income'?1:-1)*t.amount;return;}
    if(t.isAdelanto){o.prest+=t.amount;return;}
    var fut=!upTo(t.date);
    if(t.type==='Income'){if(fut)o.fut+=t.amount;else o.I+=t.amount;return;}
    if(fut){o.fut-=t.amount;return;}
    if(catNames.indexOf(t.category)>=0)o.Ecat+=t.amount;else o.nocat+=t.amount;
  });
  Object.keys(budgets).forEach(function(mk){var p=mk.split('-'),by=+p[0],bm=+p[1]-1;
    if(by<y||(by===y&&bm<=m)){var b=budgets[mk]||{};Object.keys(b).forEach(function(k){if(k.indexOf('e:')===0||k.indexOf('s:')===0)o.B+=b[k];if(k.indexOf('i:')===0)o.Binc+=b[k];});}});
  o.disp=o.B-o.Ecat;
  // Por asignar = ingresos reales + ajustes con el banco − lo asignado a gastos y ahorro
  o.porAsignar=o.I+o.adj-o.B;
  // Parte que es dinero real fuera del plan de ingresos (debe sumarse a ingresos al asignar)
  o.fueraPlan=o.I+o.adj-o.Binc;
  o.sinExplicar=o.cuentas-(o.disp+o.porAsignar-o.prest-o.nocat+o.fut);
  return o;
}
var concilOpen=false;
function toggleConcil(){concilOpen=!concilOpen;renderConcil();}
function renderConcil(){
  var st=document.getElementById('d-concil-status'),ln=document.getElementById('d-concil-lines'),ar=document.getElementById('d-concil-arrow');if(!st||!ln)return;
  var now=new Date(),o=concilData(now.getFullYear(),now.getMonth());
  var ok=Math.abs(o.sinExplicar)<1;
  st.textContent=ok?'✓ Todo explicado':'Sin explicar '+fmt(Math.abs(o.sinExplicar));
  st.style.color=ok?'var(--green)':'var(--red)';
  ln.style.display=concilOpen?'block':'none';if(ar)ar.innerHTML=uiI(concilOpen?'chevup':'chevdown',14);
  while(ln.firstChild)ln.removeChild(ln.firstChild);
  function money(v,sign){return (sign&&v>0?'+':v<0?'−':'')+fmt(Math.abs(v));}
  function line(label,v,opt){opt=opt||{};
    var r=el('div',{style:'display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:12.5px;'+(opt.top?'border-top:.5px solid var(--border);margin-top:4px;padding-top:9px;':'')+(opt.go?'cursor:pointer;':'')},[
      el('span',{txt:label+(opt.go?' ›':''),style:'color:'+(opt.strong?'var(--text)':'var(--text2)')+';font-weight:'+(opt.strong?'700':'500')}),
      el('span',{txt:opt.raw?fmt(v):money(v,true),style:'font-weight:700;'+(opt.col?'color:'+opt.col:'')})]);
    if(opt.go)r.addEventListener('click',opt.go);ln.appendChild(r);}
  line('Disponible acumulado',o.disp,{raw:true,go:function(){showPage('budget');}});
  line((o.porAsignar>=0?'Por asignar':'Te faltan por cubrir')+(o.adj?' (incl. ajustes)':''),o.porAsignar,{go:function(){showPage('budget');}});
  if(o.prest)line('Prestado (te lo deben)',-o.prest,{go:function(){showPage('expenses');}});
  if(o.nocat)line('Gastos sin categoría',-o.nocat,{go:goNoCat});
  if(Math.abs(o.fut)>=1)line('Movimientos con fecha futura',o.fut);
  line('= Total en tus cuentas',o.cuentas,{raw:true,strong:true,top:true});
  line('Sin explicar',o.sinExplicar,{col:ok?'var(--green)':'var(--red)'});
  if(!ok)ln.appendChild(el('div',{txt:'Hay una diferencia que no corresponde a nada de lo anterior. Revisa si falta registrar algún movimiento o usa «Cuadrar con el banco» en la cuenta.',style:'font-size:11px;color:var(--text3);line-height:1.45;margin-top:4px'}));
}


// ── v13: cuánto del monto asignado se suma también al plan de ingresos ──
function incomeAddFor(amt){
  // Primero se usa presupuesto que ya estaba en ingresos pero sin rubro; el resto es dinero fuera del plan
  var o=concilData(curY,curM);var libre=Math.max(0,o.porAsignar-Math.max(0,o.fueraPlan));
  var desdeLibre=Math.min(amt,libre);return Math.max(0,Math.min(amt-desdeLibre,Math.max(0,o.fueraPlan)));
}
function defaultIncomeCat(){
  // Ingreso con más excedente acumulado; si no hay, "Otros ingresos" o el último
  var best=null,bestV=0;
  cats.income.forEach(function(c){
    var real=0,bud=0;
    txs.forEach(function(t){if(t.mode==='tracking'&&t.type==='Income'&&!t.isAdjust&&t.category===c.name){var d=new Date(t.date+'T00:00:00');if(d.getFullYear()<curY||(d.getFullYear()===curY&&d.getMonth()<=curM))real+=t.amount;}});
    Object.keys(budgets).forEach(function(mk){var p=mk.split('-'),y=+p[0],m=+p[1]-1;if(y<curY||(y===curY&&m<=curM))bud+=(budgets[mk]['i:'+c.id]||0);});
    if(real-bud>bestV){bestV=real-bud;best=c;}
  });
  if(best)return best;
  for(var i=0;i<cats.income.length;i++)if(cats.income[i].name==='Otros ingresos')return cats.income[i];
  return cats.income[cats.income.length-1]||null;
}
function assignPreview(){
  var p=document.getElementById('asg-prev');if(!p)return;
  var amt=rawNum(document.getElementById('asg-m'));var add=incomeAddFor(amt);var sel=document.getElementById('asg-inc');
  if(!add){p.textContent='Este monto ya estaba en tu plan de ingresos; solo se suma al rubro.';sel.disabled=true;return;}
  sel.disabled=false;
  p.textContent=sel.value?'Se sumarán '+fmt(add)+' al ingreso «'+sel.selectedOptions[0].text+'» de '+MONTHS[curM]+', para que el presupuesto quede balanceado.':'No se sumará nada a ingresos (el balance del mes quedará en −'+fmt(add)+').';
}

var asgMax=0;
function assignCats(){return cats.expenses.map(function(c){return {c:c,p:'e:'};}).concat(cats.savings.map(function(c){return {c:c,p:'s:'};}));}
function renderUnassigned(){
  var w=document.getElementById('b-unassigned');if(!w)return;
  while(w.firstChild)w.removeChild(w.firstChild);
  var o=concilData(curY,curM),v=Math.round(o.porAsignar);asgMax=v;
  if(Math.abs(v)<1){w.style.display='block';w.style.background='var(--bg2)';
    w.appendChild(el('div',{txt:'✓ Todo tu dinero está asignado',style:'font-size:12.5px;font-weight:600;color:var(--green)'}));return;}
  w.style.display='block';
  if(v>0){
    w.style.background='var(--greenbg)';
    w.appendChild(el('div',{style:'display:flex;justify-content:space-between;align-items:baseline'},[
      el('span',{txt:'Por asignar',style:'font-size:13px;font-weight:700'}),el('span',{txt:fmt(v),style:'font-size:18px;font-weight:800;color:var(--green)'})]));
    w.appendChild(el('div',{txt:'Dinero en tus cuentas que aún no está en ningún rubro (ingresos extra'+(o.adj?' y ajustes con el banco':'')+'). Decide a qué rubro de '+MONTHS[curM]+' lo mandas.',style:'font-size:11.5px;color:var(--text2);margin:4px 0 11px;line-height:1.45'}));
    var sav=cats.savings[0];
    w.appendChild(el('div',{style:'display:flex;gap:8px'},[
      el('button',{txt:'Asignar a un rubro',click:function(){openAssign();},style:'flex:1;background:var(--lime);color:#111;border:none;border-radius:10px;padding:10px;font-size:12.5px;font-weight:700;font-family:inherit;cursor:pointer'}),
      sav?el('button',{txt:'Mandar a '+sav.name,click:function(){var dc=defaultIncomeCat();assignTo('s:',sav,v,dc?dc.id:'');},style:'flex:1;background:var(--bg2);color:var(--text);border:.5px solid var(--border2);border-radius:10px;padding:10px;font-size:12.5px;font-weight:600;font-family:inherit;cursor:pointer'}):null]));
  } else {
    w.style.background='var(--amberbg)';
    w.appendChild(el('div',{style:'display:flex;justify-content:space-between;align-items:baseline'},[
      el('span',{txt:'Te faltan por cubrir',style:'font-size:13px;font-weight:700'}),el('span',{txt:fmt(-v),style:'font-size:18px;font-weight:800;color:var(--amber)'})]));
    w.appendChild(el('div',{txt:'Te entró menos de lo que presupuestaste hasta '+MONTHS[curM]+'. Baja algún rubro de '+MONTHS[curM]+' en ese valor para que el plan se ajuste a la realidad.',style:'font-size:11.5px;color:var(--text2);margin-top:4px;line-height:1.45'}));
  }
}
function openAssign(){
  var s=document.getElementById('asg-cat');while(s.firstChild)s.removeChild(s.firstChild);
  assignCats().forEach(function(x){var o=document.createElement('option');o.value=x.p+x.c.id;o.textContent=x.c.name;s.appendChild(o);});
  document.getElementById('asg-m').value=Number(asgMax).toLocaleString('es-CO');
  document.getElementById('asg-info').textContent='Tienes '+fmt(asgMax)+' por asignar. Se sumará al presupuesto de '+MONTHS[curM]+' '+curY+' del rubro que elijas.';
  var si=document.getElementById('asg-inc');while(si.firstChild)si.removeChild(si.firstChild);
  var dc=defaultIncomeCat();
  cats.income.forEach(function(c){var o=document.createElement('option');o.value=c.id;o.textContent=c.name;si.appendChild(o);});
  var no=document.createElement('option');no.value='';no.textContent='No sumar a ingresos';si.appendChild(no);
  si.value=dc?dc.id:'';assignPreview();
  document.getElementById('m-assign').classList.add('open');
}
function assignConfirm(){
  var amt=rawNum(document.getElementById('asg-m'));var key=document.getElementById('asg-cat').value;
  if(!amt){alert('Escribe un monto');return;}
  var p=key.slice(0,2),id=key.slice(2),cat=null;assignCats().forEach(function(x){if(x.c.id===id)cat=x.c;});
  var incId=document.getElementById('asg-inc').value;
  closeM('m-assign');if(cat)assignTo(p,cat,amt,incId);
}
function assignTo(prefix,cat,amt,incId){
  var incAdd=incId?incomeAddFor(amt):0;
  var inp=document.getElementById('bi_'+cat.id);
  if(!document.getElementById('page-budget').classList.contains('active')||!inp){showPage('budget');renderBudget();inp=document.getElementById('bi_'+cat.id);}
  if(!inp)return;
  inp.value=Number(rawNum(inp)+amt).toLocaleString('es-CO');
  if(incAdd){var ii=document.getElementById('bi_'+incId);if(ii)ii.value=Number(rawNum(ii)+incAdd).toLocaleString('es-CO');}
  saveBudget();
  if(typeof updateBudgetTotals==='function')updateBudgetTotals();
  renderDisponible();if(typeof budgetTab!=='undefined'&&budgetTab==='mes')renderMesDisponible();
  renderUnassigned();renderConcil();
}

// ── v14: los gastos guardados con el NOMBRE visible se convierten al código interno ──
// Código interno: 'David' = dueño de la app, 'Lina' = su pareja (se muestran con los nombres de Ajustes)
function fixCharges(list,recList){
  var me=userName||'David',pt=partnerName||'Lina';
  if(me==='David'&&pt==='Lina')return 0;
  var n=0;
  function conv(o){if(!o||!o.charge)return;
    if(o.charge===me&&me!=='David'){o.charge='David';n++;}
    else if(o.charge===pt&&pt!=='Lina'){o.charge='Lina';n++;}}
  // Mapeo simultáneo (evita que un intercambio Lina↔David se aplique dos veces)
  (list||[]).forEach(function(t){if(t.mode!=='expenses'||!t.charge)return;
    if(t.charge===me)t._ch='David';else if(t.charge===pt)t._ch='Lina';});
  (list||[]).forEach(function(t){if(t._ch){if(t._ch!==t.charge)n++;t.charge=t._ch;delete t._ch;}});
  (recList||[]).forEach(function(r){if(r.kind!=='shared'||!r.charge)return;
    var nc=r.charge===me?'David':r.charge===pt?'Lina':r.charge;if(nc!==r.charge){r.charge=nc;n++;}});
  return n;
}

// ── v15: gastos pendientes por pagar (tu parte) dentro del presupuesto ──
function pendShare(t){
  if(!t||t.mode!=='expenses')return 0;var st=t.status||'Paid';
  if(t.charge==='David')return st==='Paid'?0:t.amount;
  if(t.charge==='Los dos')return (st==='Unpaid'||st==='LinaPaidDavidPending')?t.amount/2:0;
  return 0;
}
function pendCat(name,y,m,cum){var s=0;
  txs.forEach(function(t){if(t.mode!=='expenses'||t.category!==name)return;
    var d=new Date(t.date+'T00:00:00'),ty=d.getFullYear(),tm=d.getMonth();
    if(cum?(ty<y||(ty===y&&tm<=m)):(ty===y&&tm===m))s+=pendShare(t);});
  return s;}
var STRIPE=function(col){return 'repeating-linear-gradient(45deg,'+col+' 0 4px,transparent 4px 7px)';};
function splitBar(exp,pend,budg,col){
  var paidW=budg>0?Math.min(100,exp/budg*100):(exp>0?100:0);
  var totW=budg>0?Math.min(100,(exp+pend)/budg*100):((exp+pend)>0?100:0);
  var bg=el('div',{style:'background:var(--bg3);border-radius:6px;height:6px;overflow:hidden;margin-top:6px;display:flex'});
  bg.appendChild(el('div',{style:'height:100%;width:'+paidW+'%;background:'+col+';transition:width .5s'}));
  if(totW>paidW)bg.appendChild(el('div',{style:'height:100%;width:'+(totW-paidW)+'%;background:'+STRIPE(col)+';transition:width .5s'}));
  return bg;
}
function numLine(exp,pend,budg){
  var row=el('div',{style:'display:flex;justify-content:space-between;align-items:baseline;margin-top:3px;gap:8px'});
  row.appendChild(el('span',{txt:pend?('Pagado: '+fmt(exp)+' · Pendiente: '+fmt(pend)):('Gastado: '+fmt(exp)),style:'font-size:10px;color:var(--text2)'}));
  row.appendChild(el('span',{txt:'Presup: '+fmt(budg),style:'font-size:10px;color:var(--text2);white-space:nowrap'}));
  return row;
}

function renderDashExtras(){
  renderRecsCard();
  renderLent();
  renderUnassigned();
  var nc=noCatTxs(),w=document.getElementById('d-nocat');
  if(w){if(nc.length){var tot=0;nc.forEach(function(t){tot+=t.amount;});
    document.getElementById('d-nocat-txt').textContent=nc.length+' movimiento'+(nc.length===1?'':'s')+' sin categoría · '+fmt(tot);w.style.display='flex';}
    else w.style.display='none';}
}

function renderAll(){
  rebuildDerived();
  recalcAllBalances();
  var lbl=mLbl();
  ['d','t','e','b'].forEach(function(p){var e=document.getElementById(p+'-mbar');if(e)e.textContent=lbl;});
  var dl=document.getElementById('d-mlbl');if(dl)dl.textContent=lbl;
  renderDash();renderDashExtras();renderTracking();renderExpenses();
  if(!document.getElementById('page-budget').classList.contains('active'))renderBudget();
  renderSummary();renderSettings();
  populateAcSel();setTheme(theme);applyBlur();updateDriveUI();setIconStyle(iconStyle);
  var hn=document.getElementById('hero-name');if(hn)hn.textContent=userName;
  var un=document.getElementById('s-username');if(un)un.value=userName;
  var nb=document.getElementById('nav-brand-name');if(nb)nb.textContent=userName;
  var pn=document.getElementById('s-partnername');if(pn)pn.value=partnerName;
  applyPendienteTab();
  // Update charge select options with current names
  var chDavid=document.getElementById('ch-david');if(chDavid)chDavid.textContent=userName;
  var chLina=document.getElementById('ch-lina');if(chLina)chLina.textContent=partnerName;
  var klDav=document.getElementById('kl-dav');if(klDav)klDav.textContent=userName;
  var klLin=document.getElementById('kl-lin');if(klLin)klLin.textContent=partnerName;
  var sb=document.getElementById('s-hide-btn');if(sb)sb.textContent=blurred?'Desactivar':'Activar';
  var eb=document.getElementById('eyebtn');if(eb)eb.innerHTML=uiI(blurred?'eyeoff':'eye',19);
}

function monthStrip(id){
  var mwrap=clr(id);if(!mwrap)return;
  var onExpenses=document.getElementById('page-expenses')&&document.getElementById('page-expenses').classList.contains('active');
  for(var off=-3;off<=3;off++){
    (function(off){
      var dt=new Date(curY,curM+off,1);
      var yy=dt.getFullYear(),mm=dt.getMonth();
      var active=off===0,past=off<0,future=off>0;
      // Count pending items for this month (only on expenses page)
      var pendingCount=0,hasPaid=false;
      if(onExpenses){
        txs.forEach(function(t){
          if(t.mode!=='expenses')return;
          var d=new Date(t.date+'T00:00:00');
          if(d.getFullYear()!==yy||d.getMonth()!==mm)return;
          if(t.status==='Paid')hasPaid=true;
          else pendingCount++;
        });
      }
      var pill=el('div',{cls:'month'+(active?' active':'')+(future?' future':'')});
      pill.appendChild(el('div',{cls:'mo-nm',txt:MO[mm]}));
      // Indicator dot
      if(onExpenses){
        var dotStyle='width:6px;height:6px;border-radius:50%;margin:2px auto;';
        if(pendingCount>0){
          // Has pending - amber dot
          pill.appendChild(el('div',{style:dotStyle+'background:var(--amber)'}));
        } else if(hasPaid){
          // All paid - green dot
          pill.appendChild(el('div',{style:dotStyle+'background:var(--green)'}));
        } else {
          // Nothing - empty dot outline
          pill.appendChild(el('div',{style:dotStyle+'background:transparent;border:1.5px solid var(--border)'}));
        }
      } else {
        // Check if month has any tracking movements
        var hasMovs=false;
        txs.forEach(function(t){
          if(hasMovs||t.mode!=='tracking') return;
          var d=new Date(t.date+'T00:00:00');
          if(d.getFullYear()===yy&&d.getMonth()===mm) hasMovs=true;
        });
        pill.appendChild(el('div',{cls:'mo-mk',txt:active?'✦':(past?'✓':'✦')}));
        if(!hasMovs&&!active){
          pill.style.background='var(--bg3)';
        }
      }
      pill.appendChild(el('div',{cls:'mo-yr',txt:String(yy).slice(2)}));
      pill.addEventListener('click',function(){curM=mm;curY=yy;var onBudget=document.getElementById('page-budget').classList.contains('active');if(onBudget)renderBudget();renderAll();});
      mwrap.appendChild(pill);
    })(off);
  }
}

function renderDash(){
  var mk=mkK(curY,curM),budget=budgets[mk]||{};
  var tr=mTxs(txs).filter(function(t){return t.mode==='tracking'&&!t.isReimbursed&&!t.isReimb;});
  var inc=0,exp=0;
  tr.forEach(function(t){if(t.isAdjust||t.isAdelanto)return;if(t.type==='Income')inc+=t.amount;else exp+=t.amount;});
  var avail=inc-exp;

  // Month strip
  monthStrip('d-months');

  // Hero
  var ml=document.getElementById('d-mlbl');if(ml)ml.textContent=MONTHS[curM];
  document.getElementById('d-inc').textContent=fmtb(inc);
  document.getElementById('d-exp').textContent=fmtb(exp);
  var av=document.getElementById('d-avl');av.textContent=fmtb(avail);av.style.color=avail>=0?'var(--green)':'var(--red)';
  var spendPct=inc>0?Math.max(4,Math.min(96,Math.round(exp/inc*100))):4;
  var knob=document.getElementById('d-knob');if(knob)knob.style.left=spendPct+'%';

  // KPI macro cards
  var savNames={};cats.savings.forEach(function(c){savNames[c.name]=1;});
  var ahorro=0;tr.forEach(function(t){if(t.type==='Expenses'&&savNames[t.category])ahorro+=t.amount;});
  var pend=0;
  mTxs(txs).forEach(function(t){
    if(t.mode!=='expenses'||t.status==='Paid')return;
    var bD=0,bL=0,bO=0;
    if(t.charge==='David')bD=t.amount;else if(t.charge==='Lina')bL=t.amount;else if(t.charge==='Otro')bO=t.amount;else if(t.charge==='Los dos'){bD=t.amount/2;bL=t.amount/2;}
    if(t.status==='DavidPaidLinaPending')bD=0;else if(t.status==='LinaPaidDavidPending')bL=0;
    pend+=bD+bL+bO;
  });
  var kp=clr('d-kpis');
  [
    {nm:'Disponible',sub:'este mes',ic:'@trend',tint:'var(--limetint)',v:avail},
    {nm:'Ahorro',sub:'este mes',ic:'@dollar',tint:'var(--lav)',v:ahorro},
    {nm:'Pendiente',sub:'por saldar',ic:'@clock',tint:'var(--peach)',v:pend}
  ].forEach(function(k){
    var card=el('div',{cls:'kpic'});
    var hd=el('div',{cls:'kpic-hd'});
    hd.appendChild(el('div',{},[el('div',{cls:'kpic-nm',txt:k.nm}),el('div',{cls:'kpic-sub',txt:k.sub})]));
    hd.appendChild(el('div',{cls:'kpic-ic',html:icoHTML(k.ic)}));
    card.appendChild(hd);
    card.appendChild(el('div',{cls:'kpic-v',txt:fmtb(k.v)}));
    kp.appendChild(card);
  });

  // Accounts (neutral icon chips)
  var ac=clr('d-accts');
  accts.forEach(function(a,i){
    var pill=el('div',{cls:'apill',style:'cursor:pointer'});
    pill.appendChild(el('div',{cls:'ai',html:icoHTML(a.icon)}));
    pill.appendChild(el('div',{cls:'an',txt:a.name}));
    pill.appendChild(el('div',{cls:'av',txt:fmtb(a.balance||0)}));
    pill.addEventListener('click',(function(aid){return function(){openAcctModal(aid);};})(a.id));
    ac.appendChild(pill);
  });

  // Vertical bars
  var catData=[];
  cats.expenses.forEach(function(c){
    var tracked=0;tr.forEach(function(t){
      if(t.type==='Expenses'&&t.category===c.name&&!t.isAdelanto&&!t.isReimbursed&&!t.isReimb)
        tracked+=t.amount;
    });
    var bkx=budgets[mk]||{};var b=(bkx['e:'+c.id]||bkx[c.name]||0);
    var pend=pendCat(c.name,curY,curM,false);
    if(tracked>0||b>0||pend>0)catData.push({name:c.name,icon:c.icon,tracked:tracked,pend:pend,b:b});
  });
  catData.sort(function(a,b){var ap=a.b>0?(a.tracked+a.pend)/a.b:0,bp=b.b>0?(b.tracked+b.pend)/b.b:0;return bp-ap;});
  catData=catData.slice(0,8);
  var maxV=1;catData.forEach(function(c){if(Math.max(c.tracked+c.pend,c.b)>maxV)maxV=Math.max(c.tracked+c.pend,c.b);});
  var BH=110,vb=clr('d-vbars');
  if(!catData.length){vb.appendChild(el('p',{txt:'Sin datos — agrega un presupuesto',style:'font-size:13px;color:var(--text3);padding:16px 0'}));}
  else catData.forEach(function(c){
    var pct=c.b>0?Math.round(((c.tracked+c.pend)/c.b)*100):null;
    var cls=pct===null?"em":pct>100?"ov":pct>80?"warn":"ok";
    var tH=c.b>0?Math.min(BH,Math.round((c.tracked/c.b)*BH)):Math.round(BH*0.5);
    var pH=c.b>0?Math.max(0,Math.min(BH,Math.round(((c.tracked+c.pend)/c.b)*BH))-tH):0;
    var bH=BH;
    var pctColor=pct>100?'var(--red)':pct>80?'var(--amber)':'var(--text2)';
    var track=el('div',{cls:'vbt',style:'height:'+BH+'px'});
    if(c.b>0){var line=el('div',{cls:'vbl',style:'bottom:'+bH+'px'});track.appendChild(line);}
    var fill=el('div',{cls:'vbf '+cls,style:'height:'+tH+'px'});track.appendChild(fill);
    if(pH>0){var pcol={ok:'var(--lime)',warn:'var(--amber)',ov:'var(--red)',em:'var(--bg4)'}[cls];
      track.appendChild(el('div',{style:'position:absolute;left:0;right:0;bottom:'+tH+'px;height:'+pH+'px;border-radius:'+(tH?'12px 12px 0 0':'12px')+';background:'+STRIPE(pcol)+';transition:height .6s'}));}
    vb.appendChild(el('div',{cls:'vbi'},[
      el('div',{cls:'vbpct',txt:pct!==null?pct+'%':'—',style:'color:'+pctColor}),
      track,
      el('div',{cls:'vbico',html:icoHTML(c.icon)}),
      el('div',{cls:'vbnm',txt:c.name})
    ]));
  });
  var lg=document.getElementById('d-vbars-legend');
  if(lg){var anyP=catData.some(function(c){return c.pend>0;});lg.style.display=anyP?'flex':'none';}

  renderConcil();

  // Recent
  var recent=tr.slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);}).slice(0,5);
  var rc=clr('d-recent');
  if(!recent.length){rc.appendChild(el('div',{cls:'empty'},[el('div',{cls:'ei',html:uiI('inbox',34)}),el('p',{txt:'Sin movimientos este mes'})]));return;}
  recent.forEach(function(t){rc.appendChild(makeTxEl(t));});
}

function makeTxEl(t){
  if(t.mode==='transfer')return makeTransferEl(t);
  var isInc=t.type==='Income';
  var div=el('div',{cls:'tx',click:function(){openTx(t.id);}});
  div.appendChild(el('div',{cls:'tico',html:icoHTML(cIcon(t.category))}));
  var inf=el('div',{cls:'tinf'});
  inf.appendChild(el('div',{cls:'td',txt:t.description}));
  var meta=el('div',{cls:'tm'});
  var metaSecond=t.mode==='expenses'?(t.source||''):(t.account||'');
  meta.textContent=(t.category||'Sin categoria')+(metaSecond?' · '+metaSecond:'');
  if(t.mode==='expenses'){
    if(t.charge==='Los dos'||t.charge==='Otro'){var b=el('span',{cls:'badge sh',txt:t.charge});meta.appendChild(b);}
    var statusLabels={'Unpaid':'Pendiente','DavidPaidLinaPending':userName+' pago - '+partnerName+' pendiente','LinaPaidDavidPending':partnerName+' pago - '+userName+' pendiente','Paid':'Pagado'};
    var stLabel=statusLabels[t.status]||t.status;
    if(t.status&&t.status!=='Paid'){meta.appendChild(el('span',{cls:'badge unpaid',txt:stLabel}));}
  }
  if(t.isShared){meta.appendChild(el('span',{cls:'badge sh',txt:'Compartido'}));}
  if(t.isAdjust){meta.appendChild(el('span',{cls:'badge',txt:'Ajuste',style:'margin-left:4px;background:var(--bg3);color:var(--text2)'}));}
  if(t.isAdelanto){meta.appendChild(el('span',{cls:'badge sh',txt:t.description&&t.description.indexOf('Otro')>=0?'Adelanto Otro':'Adelanto'}));}
  if(t.isReimb){meta.appendChild(el('span',{cls:'badge sh',txt:'Reembolso'}));}
  inf.appendChild(meta);
  div.appendChild(inf);
  div.appendChild(el('div',{cls:'ta '+(isInc?'inc':'exp'),txt:(isInc?'+':'−')+fmt(t.amount)}));
  return div;
}

function renderTracking(){
  monthStrip('t-months');
  var monthAll=mTxs(txs).filter(function(t){return (t.mode==='tracking'&&!t.isReimbursed&&!t.isReimb)||t.mode==='transfer';});
  var nc=noCatTxs();if(curFilt==='__nocat'&&!nc.length)curFilt='all';
  var q=(trackQuery||'').trim();
  var sx=document.getElementById('t-search-x');if(sx)sx.style.display=q?'inline':'none';
  var all=q?txs.filter(function(t){return ((t.mode==='tracking'&&!t.isReimbursed&&!t.isReimb)||t.mode==='transfer')&&matchQuery(t,q);}):(curFilt==='__nocat'?nc:monthAll);
  var uc=[];monthAll.forEach(function(t){if(t.category&&uc.indexOf(t.category)<0)uc.push(t.category);});
  var tc=clr('t-chips');
  function addChip(label,val){
    var c=el('div',{cls:'chip'+(curFilt===val?' active':''),txt:label});
    c.addEventListener('click',function(){
      document.querySelectorAll('#t-chips .chip').forEach(function(x){x.classList.remove('active');});
      c.classList.add('active');curFilt=val;renderTracking();
    });
    tc.appendChild(c);
  }
  addChip('Todos','all');
  if(nc.length)addChip('Sin categoría ('+nc.length+')','__nocat');
  uc.forEach(function(c){addChip(icoLabel(cIcon(c),c),c);});
  var filt=(curFilt==='all'||curFilt==='__nocat')?all:all.filter(function(t){return t.category===curFilt;});
  var srt=filt.slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
  var tl=clr('t-list');
  if(!srt.length){tl.appendChild(el('div',{cls:'empty'},[el('div',{cls:'ei',html:uiI('inbox',34)}),el('p',{txt:q?'Sin resultados para «'+q+'»':'Sin movimientos este mes'})]));return;}
  if(q){var sTot=0;srt.forEach(function(t){if(t.mode!=='transfer')sTot+=(t.type==='Income'?1:-1)*t.amount;});tl.appendChild(el('div',{txt:srt.length+' resultado'+(srt.length===1?'':'s')+' en todos los meses',style:'font-size:12px;font-weight:600;color:var(--text2);padding:2px 4px 8px'}));}
  var grp={};
  srt.forEach(function(t){
    var d=new Date(t.date+'T00:00:00');
    var k=d.toLocaleDateString('es-CO',{weekday:'short',day:'numeric',month:'short',year:q?'numeric':undefined});
    if(!grp[k])grp[k]=[];grp[k].push(t);
  });
  Object.keys(grp).forEach(function(d){
    tl.appendChild(el('div',{cls:'txdh',txt:d}));
    grp[d].forEach(function(t){tl.appendChild(makeTxEl(t));});
  });
  renderPaidExpenses();
}

var ePaidOpen=false;
function toggleEPaid(){
  ePaidOpen=!ePaidOpen;
  var list=document.getElementById('e-paid-list');
  var arrow=document.getElementById('e-paid-arrow');
  if(list)list.style.display=ePaidOpen?'block':'none';
  if(arrow)arrow.innerHTML=uiI(ePaidOpen?'chevup':'chevdown',14);
}

function renderPaidExpenses(){
  var cnt=document.getElementById('e-paid-count');
  var list=document.getElementById('e-paid-list');
  if(!list)return;
  while(list.firstChild)list.removeChild(list.firstChild);

  // txs is already updated - use directly
  // Paid filter mirrors the pending filter exactly:
  // whatever showed in pending for a filter, shows in paid when status=Paid
  var paid=txs.filter(function(t){
    if(t.mode!=='expenses') return false;
    var d=new Date(t.date+'T00:00:00');
    if(d.getFullYear()!==curY||d.getMonth()!==curM) return false;
    if(curFiltSrc!=='all'&&t.source!==curFiltSrc) return false;
    if(t.status!=='Paid') return false; // only fully paid

    if(curFiltExp==='all'){
      // Todos: only shared expenses (Los dos, Lina, Otro) - not personal David ones
      return t.charge==='Los dos'||t.charge==='Lina'||t.charge==='Otro';
    }
    if(curFiltExp==='David'){
      // Pending David shows: charge=David(Unpaid) + charge=Los dos(Unpaid or LinaPaidDavidPending)
      // So paid David shows: charge=David(Paid) + charge=Los dos(Paid)
      return t.charge==='David'||t.charge==='Los dos';
    }
    if(curFiltExp==='Lina'){
      // Pending Lina shows: charge=Lina(Unpaid) + charge=Los dos(Unpaid or DavidPaidLinaPending)
      return t.charge==='Lina'||t.charge==='Los dos';
    }
    if(curFiltExp==='Los dos') return t.charge==='Los dos';
    if(curFiltExp==='Otro') return t.charge==='Otro';
    return false;
  });

  // Calculate total (share amount per filter)
  var paidTotal=0;
  paid.forEach(function(t){
    var share=t.amount;
    if(t.charge==='Los dos'&&(curFiltExp==='David'||curFiltExp==='Lina')) share=t.amount/2;
    else if(t.charge==='Los dos'&&curFiltExp==='all') share=t.amount;
    paidTotal+=share;
  });
  if(cnt){
    cnt.textContent=fmt(paidTotal);
    cnt.style.fontSize='12px';
  }

  if(!paid.length){
    list.appendChild(el('div',{style:'padding:10px 0;font-size:13px;color:var(--text3);text-align:center',txt:'Sin pagados este mes'}));
    return;
  }

  paid.sort(function(a,b){return new Date(b.date)-new Date(a.date);});
  paid.forEach(function(t){
    (function(tx){
      var shareAmt=tx.amount;
      if(tx.charge==='Los dos'&&(curFiltExp==='David'||curFiltExp==='Lina')) shareAmt=tx.amount/2;
      // Status label for partial payments
      var statusLabel='';
      if(tx.status==='DavidPaidLinaPending') statusLabel='David pagó';
      else if(tx.status==='LinaPaidDavidPending') statusLabel='Lina pagó';
      var row=el('div',{cls:'tx',click:function(){openTx(tx.id);}});
      row.appendChild(el('div',{cls:'tico',html:icoHTML(cIcon(tx.category))}));
      var inf=el('div',{cls:'tinf'});
      inf.appendChild(el('div',{cls:'td',txt:tx.description}));
      var meta=el('div',{cls:'tm'});
      meta.textContent=(tx.category||'')+(tx.source?' · '+tx.source:'');
      if(tx.charge==='Los dos') meta.appendChild(el('span',{cls:'badge sh',txt:'Los dos',style:'margin-left:4px'}));
          if(statusLabel) meta.appendChild(el('span',{cls:'badge',txt:statusLabel,style:'margin-left:4px;background:var(--greenbg);color:var(--green);font-size:9px'}));
      inf.appendChild(meta);
      row.appendChild(inf);
      var amtEl=el('div',{style:'text-align:right'});
      amtEl.appendChild(el('div',{cls:'ta exp',txt:'−'+fmt(shareAmt)}));
      if(tx.charge==='Los dos'&&(curFiltExp==='David'||curFiltExp==='Lina')){
        amtEl.appendChild(el('div',{style:'font-size:10px;color:var(--text3)',txt:'Total: '+fmt(tx.amount)}));
      }
      row.appendChild(amtEl);
      list.appendChild(row);
    })(t);
  });

  // Keep open/closed state
  var listEl=document.getElementById('e-paid-list');
  if(listEl)listEl.style.display=ePaidOpen?'block':'none';
}

function renderExpenses(){
  
  monthStrip('e-months');
  var all=mTxs(txs).filter(function(t){return t.mode==='expenses'&&t.status!=='Paid';});
  var dav=0,lin=0,otr=0,tot=0,srcEfe=0,srcCred=0,srcDeb=0;
  var srcEfeDav=0,srcEfeLin=0,srcCredDav=0,srcCredLin=0,srcDebDav=0,srcDebLin=0;
  var srcEfeOtr=0,srcCredOtr=0,srcDebOtr=0;
  all.forEach(function(t){
    var bDav=0,bLin=0,bOtr=0;
    if(t.charge==='David')bDav=t.amount;
    else if(t.charge==='Lina')bLin=t.amount;
    else if(t.charge==='Otro')bOtr=t.amount;
    else if(t.charge==='Los dos'){bDav=t.amount/2;bLin=t.amount/2;}
    if(t.status==='Paid'){bDav=0;bLin=0;bOtr=0;}
    else if(t.status==='DavidPaidLinaPending'){bDav=0;}
    else if(t.status==='LinaPaidDavidPending'){bLin=0;}
    dav+=bDav;lin+=bLin;otr+=bOtr;
    var pending=bDav+bLin+bOtr;
    tot+=pending;
    if(t.source==='Efectivo'){srcEfe+=pending;srcEfeDav+=bDav;srcEfeLin+=bLin;srcEfeOtr+=bOtr;}
    else if(t.source==='Tarjeta crédito'){srcCred+=pending;srcCredDav+=bDav;srcCredLin+=bLin;srcCredOtr+=bOtr;}
    else if(t.source==='Tarjeta débito'){srcDeb+=pending;srcDebDav+=bDav;srcDebLin+=bLin;srcDebOtr+=bOtr;}
  });
  document.getElementById('e-dav').textContent=fmt(dav);
  document.getElementById('e-lin').textContent=fmt(lin);
  document.getElementById('e-otr').textContent=fmt(otr);
  document.getElementById('e-tot').textContent=fmt(tot);
  var srcWrap=clr('e-source-body');
  [
    ['@cash','Efectivo',srcEfe,srcEfeDav,srcEfeLin,srcEfeOtr],
    ['@card','Tarjeta crédito',srcCred,srcCredDav,srcCredLin,srcCredOtr],
    ['@bank','Tarjeta débito',srcDeb,srcDebDav,srcDebLin,srcDebOtr]
  ].forEach(function(d){
    var row=el('div',{cls:'bprow',style:'margin:0 0 5px;align-items:flex-start;padding-top:10px;padding-bottom:10px'});
    row.appendChild(el('div',{cls:'bpico',html:icoHTML(d[0])}));
    var subsRow=el('div',{style:'display:flex;gap:10px;flex-wrap:wrap;margin-top:3px'});
    subsRow.appendChild(el('span',{txt:userName+': '+fmt(d[3]),style:'font-size:10px;color:var(--text2);font-weight:500'}));
    subsRow.appendChild(el('span',{txt:partnerName+': '+fmt(d[4]),style:'font-size:10px;color:var(--text2);font-weight:500'}));
    subsRow.appendChild(el('span',{txt:'Otro: '+fmt(d[5]),style:'font-size:10px;color:var(--text2);font-weight:500'}));
    var nameWrap=el('div',{cls:'bpnm'},[el('div',{txt:d[1]}),subsRow]);
    row.appendChild(nameWrap);
    row.appendChild(el('div',{txt:fmt(d[2]),style:'font-size:14px;font-weight:700'}));
    srcWrap.appendChild(row);
  });
    // Source filter chips
  var esc=clr('e-src-chips');
  [['Todos','all'],['Efectivo','Efectivo'],['Crédito','Tarjeta crédito'],['Débito','Tarjeta débito']].forEach(function(d){
    var chip=el('div',{cls:'chip'+(curFiltSrc===d[1]?' active':''),txt:d[0]});
    chip.style.fontSize='11px';
    chip.style.padding='4px 10px';
    chip.addEventListener('click',function(){
      document.querySelectorAll('#e-src-chips .chip').forEach(function(x){x.classList.remove('active');});
      chip.classList.add('active');curFiltSrc=d[1];renderExpenses();
    });
    esc.appendChild(chip);
  });
  var ec=clr('e-chips');
  [['Todos','all'],[userName,'David'],[partnerName,'Lina'],['Otro','Otro'],['Los dos','Los dos']].forEach(function(d){
    var chip=el('div',{cls:'chip'+(curFiltExp===d[1]?' active':''),txt:d[0]});
    chip.addEventListener('click',function(){
      document.querySelectorAll('#e-chips .chip').forEach(function(x){x.classList.remove('active');});
      chip.classList.add('active');curFiltExp=d[1];renderExpenses();setTimeout(function(){renderPaidExpenses();},250);
    });
    ec.appendChild(chip);
  });
  // Apply source filter on top of person filter
  // Main list shows pending + partial paid (not fully paid)
  var afterSrc=curFiltSrc==='all'?all:all.filter(function(t){return t.source===curFiltSrc;});
  var filtered=curFiltExp==='all'?afterSrc:afterSrc.filter(function(t){
    if(curFiltExp==='Los dos') return t.charge==='Los dos';
    if(curFiltExp==='Otro') return t.charge==='Otro';
    if(curFiltExp==='David'){
      // David owes: status is Unpaid, or LinaPaidDavidPending
      // David already paid: status is Paid or DavidPaidLinaPending -> hide from David filter
      if(t.charge==='David') return t.status==='Unpaid'||!t.status;
      if(t.charge==='Los dos') return t.status==='Unpaid'||t.status==='LinaPaidDavidPending'||!t.status;
      return false;
    }
    if(curFiltExp==='Lina'){
      // Lina owes: status is Unpaid, or DavidPaidLinaPending
      // Lina already paid: status is Paid or LinaPaidDavidPending -> hide from Lina filter
      if(t.charge==='Lina') return t.status==='Unpaid'||!t.status;
      if(t.charge==='Los dos') return t.status==='Unpaid'||t.status==='DavidPaidLinaPending'||!t.status;
      return false;
    }
    return t.charge===curFiltExp;
  });
  var srt=filtered.slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
  var el2=clr('e-list');
  if(!srt.length){el2.appendChild(el('div',{cls:'empty'},[el('div',{cls:'ei',html:uiI('receipt',34)}),el('p',{txt:'Sin gastos compartidos'})]));return;}
  // Render paid items section
  
  // renderPaidExpenses called at end after srt render

  srt.forEach(function(t){
    var row=makeTxEl(t);
    // If filtered by person, replace amount with their share + show total below
    if(curFiltExp==='David'||curFiltExp==='Lina'){
      var isLosDos=(t.charge==='Los dos');
      var share=isLosDos?t.amount/2:t.amount;
      var amtEl=row.querySelector('.ta');
      if(amtEl){
        var shareDiv=document.createElement('div');
        shareDiv.style.cssText='text-align:right';
        var shareAmt=document.createElement('div');
        shareAmt.className='ta exp';
        shareAmt.textContent='−'+fmt(share);
        shareDiv.appendChild(shareAmt);
        if(isLosDos){
          var totalTxt=document.createElement('div');
          totalTxt.style.cssText='font-size:10px;color:var(--text3);margin-top:1px';
          totalTxt.textContent='Total: '+fmt(t.amount);
          shareDiv.appendChild(totalTxt);
        }
        row.replaceChild(shareDiv,amtEl);
      }
    }
    if(selMode){
      row=row.cloneNode(true);row.setAttribute('data-selid',t.id);var on=!!selIds[t.id];
      var ck=el('div',{txt:on?'✓':'',style:'width:22px;height:22px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;margin-right:2px;'+(on?'background:var(--lime);color:#111':'border:1.5px solid var(--border2)')});
      row.insertBefore(ck,row.firstChild);if(on)row.style.boxShadow='0 0 0 2px var(--lime) inset';
      (function(id){row.addEventListener('click',function(){if(selIds[id])delete selIds[id];else selIds[id]=true;renderExpenses();updateSelBar();});})(t.id);
    }
    el2.appendChild(row);
  });
}

var budgetTab='acum';
function setBudgetTab(tab){
  budgetTab=tab;
  var acumBtn=document.getElementById('btab-acum');
  var mesBtn=document.getElementById('btab-mes');
  var acumWrap=document.getElementById('b-avail-wrap');
  var mesWrap=document.getElementById('b-mes-wrap');
  if(acumBtn)acumBtn.style.background=tab==='acum'?'var(--lime)':'var(--bg3)';
  if(acumBtn)acumBtn.style.color=tab==='acum'?'#000':'var(--text2)';
  if(mesBtn)mesBtn.style.background=tab==='mes'?'var(--lime)':'var(--bg3)';
  if(mesBtn)mesBtn.style.color=tab==='mes'?'#000':'var(--text2)';
  if(acumWrap)acumWrap.style.display=tab==='acum'?'block':'none';
  if(mesWrap)mesWrap.style.display=tab==='mes'?'block':'none';
  if(tab==='mes')renderMesDisponible();
}

function renderMesDisponible(){
  var wrap=document.getElementById('b-mes-wrap');if(!wrap)return;
  while(wrap.firstChild)wrap.removeChild(wrap.firstChild);
  var mk=mkK(curY,curM);
  var b=budgets[mk]||{};
  var allCats=cats.expenses.concat(cats.savings);
  var rows=[];
  var grandBudg=0,grandExp=0;

  allCats.forEach(function(cat){
    var budg=(b['e:'+cat.id]||b['s:'+cat.id]||b[cat.name]||0);
    var exp=0;
    txs.forEach(function(t){
      if(t.mode==='tracking'&&t.type==='Expenses'&&t.category===cat.name&&!t.isAdelanto&&!t.isReimbursed&&!t.isReimb){
        var d=new Date(t.date+'T00:00:00');
        if(d.getFullYear()===curY&&d.getMonth()===curM) exp+=t.amount;
      }
    });
    var pend=pendCat(cat.name,curY,curM,false);
    if(budg>0||exp>0||pend>0){
      rows.push({cat:cat,budg:budg,exp:exp,pend:pend,avail:budg-exp-pend});
      grandBudg+=budg;grandExp+=exp+pend;
    }
  });

  if(!rows.length){
    wrap.appendChild(el('div',{cls:'empty',txt:'Sin presupuesto para este mes'}));
    return;
  }

  rows.sort(function(a,b){
    var pa=a.budg>0?(a.exp+a.pend)/a.budg:0;
    var pb=b.budg>0?(b.exp+b.pend)/b.budg:0;
    return pb-pa;
  });

  rows.forEach(function(r){
    var pct=r.budg>0?Math.round((r.exp+r.pend)/r.budg*100):0;
    var isOver=r.avail<0;
    var isExact=(pct===100&&!isOver);
    var excessPct=isOver?Math.round((r.exp+r.pend)/r.budg*100):0;
    var barCol=isOver?'var(--red)':isExact?'var(--blue)':pct>80?'var(--amber)':'var(--lime)';
    var availCol=isOver?'var(--red)':isExact?'var(--blue)':pct>80?'var(--amber)':'var(--green)';

    var card=el('div',{style:'background:var(--bg2);border-radius:14px;border:.5px solid var(--border);padding:12px 14px;margin-bottom:10px'});
    card.appendChild(el('div',{style:'display:flex;align-items:center;gap:8px'},[
      el('span',{html:icoHTML(r.cat.icon,16),style:'font-size:16px;display:flex;align-items:center;color:var(--text2)'}),
      el('span',{txt:r.cat.name,style:'font-size:13px;font-weight:600;flex:1'}),
      el('span',{txt:isOver?'▲ +'+excessPct+'%':pct+'%',style:'font-size:11px;font-weight:700;color:'+barCol})
    ]));

    card.appendChild(splitBar(r.exp,r.pend,r.budg,barCol));
    card.appendChild(numLine(r.exp,r.pend,r.budg));

    var availBadge=el('div',{style:'display:flex;align-items:center;gap:6px;margin-top:4px'});
    availBadge.appendChild(el('span',{txt:isOver?'Excedido':isExact?'Completo':'Disponible',style:'font-size:10px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.04em'}));
    availBadge.appendChild(el('span',{txt:fmt(Math.abs(r.avail)),style:'font-size:14px;font-weight:700;color:'+availCol}));
    if(r.pend)availBadge.appendChild(el('span',{txt:'contando pendientes',style:'font-size:10px;color:var(--text3)'}));
    card.appendChild(availBadge);
    wrap.appendChild(card);
  });

  // Grand total
  var tot=el('div',{style:'margin-top:8px;padding:12px 14px;background:var(--bg2);border-radius:14px;border:.5px solid var(--border);display:flex;justify-content:space-between;align-items:center'});
  tot.appendChild(el('span',{txt:'Total mes',style:'font-size:12px;font-weight:600;color:var(--text2)'}));
  var grandAvail=grandBudg-grandExp;
  var grandCol=grandAvail<0?'var(--red)':'var(--green)';
  tot.appendChild(el('span',{txt:(grandAvail<0?'−':'')+fmt(Math.abs(grandAvail)),style:'font-size:15px;font-weight:700;color:'+grandCol}));
  wrap.appendChild(tot);
}

function renderBudget(){
  monthStrip('b-months');
  var mk=mkK(curY,curM),b=budgets[mk]||{};
  // Get previous month budget
  var prevDt=new Date(curY,curM-1,1);
  var prevMk=mkK(prevDt.getFullYear(),prevDt.getMonth());
  var bPrev=budgets[prevMk]||{};
  function mkRows(id,list,prefix){
    var wrap=clr(id);if(!wrap)return;
    list.forEach(function(c){
      var inp=el('input',{cls:'bpinp',type:'text',id:'bi_'+c.id,placeholder:'0',inputmode:'numeric',oninput:'formatMoneyInput(this);updateBudgetTotals()'});
      var bval=(b['i:'+c.id]||b['e:'+c.id]||b['s:'+c.id]||b[c.name]||0);inp.value=bval?bval.toLocaleString('es-CO'):'';
      // Previous month value
      var prevVal=(bPrev[prefix+c.id]||bPrev[c.name]||0);
      var prevHint=prevVal?el('div',{txt:'Mes ant: '+prevVal.toLocaleString('es-CO')+' · usar',style:'font-size:10px;color:var(--limedk);text-align:right;margin-top:2px;cursor:pointer;font-weight:600'}):null;
      if(prevHint)(function(i2,v){prevHint.addEventListener('click',function(){i2.value=Number(v).toLocaleString('es-CO');updateBudgetTotals();});})(inp,prevVal);
      var inpWrap=el('div',{style:'display:flex;flex-direction:column;align-items:flex-end'});
      inpWrap.appendChild(inp);
      if(prevHint)inpWrap.appendChild(prevHint);
      wrap.appendChild(el('div',{cls:'bprow'},[
        el('div',{cls:'bpico',html:icoHTML(c.icon)}),
        el('div',{cls:'bpnm',txt:c.name}),
        inpWrap
      ]));
    });
  }
  mkRows('b-inc',cats.income,'i:');mkRows('b-exp',cats.expenses,'e:');mkRows('b-sav',cats.savings,'s:');
  renderBudgetBanner();
  updateBudgetTotals();
  renderDisponible();
}

function updateBudgetTotals(){
  var totInc=0,totExp=0,totSav=0;
  cats.income.forEach(function(c){var inp=document.getElementById('bi_'+c.id);if(inp)totInc+=rawNum(inp);});
  cats.expenses.forEach(function(c){var inp=document.getElementById('bi_'+c.id);if(inp)totExp+=rawNum(inp);});
  cats.savings.forEach(function(c){var inp=document.getElementById('bi_'+c.id);if(inp)totSav+=rawNum(inp);});
  var iv=document.getElementById('b-inc-total-val');if(iv)iv.textContent=fmt(totInc);
  var ev=document.getElementById('b-exp-total-val');if(ev)ev.textContent=fmt(totExp);
  var sv=document.getElementById('b-sav-total-val');if(sv)sv.textContent=fmt(totSav);
  var balance=totInc-totExp-totSav;
  var bv=document.getElementById('b-balance-val');
  var bs=document.getElementById('b-balance-sub');
  var bc=document.getElementById('b-balance-card');
  if(bv){
    bv.textContent=(balance<0?'−':'')+fmt(Math.abs(balance));
    bv.style.color=balance===0?'var(--green)':balance>0?'var(--green)':'var(--red)';
  }
  if(bs){
    bs.textContent=balance===0?'Perfecto — presupuesto cuadrado':balance>0?fmt(balance)+' sin asignar':fmt(Math.abs(balance))+' por encima de los ingresos';
  }
  if(bc){
    bc.style.borderColor=balance===0?'var(--green)':balance>0?'var(--border)':'var(--red)';
    bc.style.background=balance===0?'var(--green-bg)':balance<0?'var(--red-bg)':'var(--bg2)';
  }
}

function renderDisponible(){
  var wrap=document.getElementById('b-avail-wrap');if(!wrap)return;
  while(wrap.firstChild)wrap.removeChild(wrap.firstChild);

  // Compute per-category: sum all budgets up to curY/curM minus all tracked expenses up to curY/curM
  var allCats=cats.expenses.concat(cats.savings);
  var rows=[];
  var grandBudg=0,grandExp=0,grandPend=0;

  allCats.forEach(function(cat){
    var totalBudg=0,totalExp=0;
    // Sum budgets from all months up to and including current month
    Object.keys(budgets).forEach(function(mk){
      var parts=mk.split('-');
      var y=parseInt(parts[0]),m=parseInt(parts[1])-1;
      if(y<curY||(y===curY&&m<=curM)){
        var bkd=budgets[mk]||{};totalBudg+=(bkd['e:'+cat.id]||bkd['s:'+cat.id]||bkd[cat.name]||0);
      }
    });
    // Sum real expenses from tracking up to current month
    txs.forEach(function(t){
      if(t.mode==='tracking'&&t.type==='Expenses'&&t.category===cat.name&&!t.isAdelanto&&!t.isReimbursed&&!t.isReimb){
        var d=new Date(t.date+'T00:00:00');
        var y=d.getFullYear(),m=d.getMonth();
        if(y<curY||(y===curY&&m<=curM)){
          totalExp+=t.amount;
        }
      }
    });
    var tPend=pendCat(cat.name,curY,curM,true);grandPend+=tPend;
    if(totalBudg>0||totalExp>0||tPend>0){
      rows.push({cat:cat,budg:totalBudg,exp:totalExp,pend:tPend,avail:totalBudg-totalExp-tPend});
      grandBudg+=totalBudg;grandExp+=totalExp;
    }
  });

  if(!rows.length){
    var empty=el('div',{cls:'empty'},[el('div',{cls:'ei',html:uiI('chart',34)}),el('p',{txt:'Agrega un presupuesto para ver el disponible'})]);
    wrap.appendChild(empty);return;
  }

  // Sort: biggest deficit first, then biggest surplus
  rows.sort(function(a,b){return a.avail-b.avail;});

  rows.forEach(function(r){
    var pct=r.budg>0?Math.min(100,Math.round(((r.exp+r.pend)/r.budg)*100)):100;
    var isOver=r.avail<0;
    var isExact=(pct===100&&!isOver);
    var barCol=isOver?'var(--red)':isExact?'var(--blue)':pct>80?'var(--amber)':'var(--lime)';
    var availCol=isOver?'var(--red)':isExact?'var(--blue)':pct>80?'var(--amber)':'var(--green)';
    var excessPct=isOver?Math.round((r.exp+r.pend)/r.budg*100):0;

    // Bar fill
    var barBg=splitBar(r.exp,r.pend,r.budg,barCol);
    var numRow=numLine(r.exp,r.pend,r.budg);

    // Available badge
    var availBadge=el('div',{style:'display:flex;align-items:center;gap:6px;margin-top:4px'});
    availBadge.appendChild(el('span',{txt:isOver?'Excedido':isExact?'Completo':'Disponible',style:'font-size:10px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.04em'}));
    availBadge.appendChild(el('span',{txt:fmt(Math.abs(r.avail)),style:'font-size:14px;font-weight:700;color:'+availCol}));
    if(r.pend)availBadge.appendChild(el('span',{txt:'contando pendientes',style:'font-size:10px;color:var(--text3)'}));


    var card=el('div',{style:'background:var(--bg2);border-radius:12px;border:.5px solid var(--border);padding:12px 14px;margin-bottom:8px'});
    card.appendChild(el('div',{style:'display:flex;align-items:center;gap:8px'},[
      el('span',{html:icoHTML(r.cat.icon,16),style:'font-size:16px;display:flex;align-items:center;color:var(--text2)'}),
      el('span',{txt:r.cat.name,style:'font-size:13px;font-weight:600;flex:1'}),
      el('span',{txt:isOver?'▲ +'+excessPct+'%':pct+'%',style:'font-size:11px;font-weight:700;color:'+barCol})
    ]));
    card.appendChild(barBg);
    card.appendChild(numRow);
    card.appendChild(availBadge);
    wrap.appendChild(card);
  });

  // Grand total card
  var grandAvail=grandBudg-grandExp;  // tarjeta verde: solo lo pagado (cruza con tus cuentas)
  var isOverAll=grandAvail<0;
  var totalCard=el('div',{style:'background:var(--lime);border-radius:12px;padding:14px;margin-bottom:8px'});
  var t1=el('div',{style:'font-size:10px;font-weight:700;color:rgba(0,0,0,.5);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px',txt:'Total disponible acumulado'});
  var t2=el('div',{style:'font-size:28px;font-weight:800;color:'+(isOverAll?'#dc2626':'#0d0d0d')+';letter-spacing:-1px',txt:(isOverAll?'−':'')+fmt(Math.abs(grandAvail))});
  var t3=el('div',{style:'display:flex;gap:16px;margin-top:8px'});
  t3.appendChild(el('div',{},[el('div',{txt:'Presupuestado',style:'font-size:10px;color:rgba(0,0,0,.5);font-weight:600'}),el('div',{txt:fmt(grandBudg),style:'font-size:13px;font-weight:700;color:#0d0d0d'})]));
  t3.appendChild(el('div',{},[el('div',{txt:'Gastado',style:'font-size:10px;color:rgba(0,0,0,.5);font-weight:600'}),el('div',{txt:fmt(grandExp),style:'font-size:13px;font-weight:700;color:#0d0d0d'})]));
  totalCard.appendChild(t1);totalCard.appendChild(t2);totalCard.appendChild(t3);
  var co=concilData(curY,curM),gap=Math.round(co.cuentas-grandAvail);
  var t4=el('div',{style:'margin-top:10px;padding-top:9px;border-top:1px solid rgba(0,0,0,.12)'});
  t4.appendChild(el('div',{style:'display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0d0d0d'},[el('span',{txt:'Tus cuentas'}),el('span',{txt:fmt(co.cuentas)})]));
  var parts=[];
  if(Math.round(co.porAsignar))parts.push((co.porAsignar>0?'Por asignar ':'Faltan por cubrir ')+fmt(Math.abs(co.porAsignar)));
  if(co.prest)parts.push('Prestado −'+fmt(co.prest));
  if(co.nocat)parts.push('Sin categoría −'+fmt(co.nocat));
  t4.appendChild(el('div',{txt:Math.abs(gap)<1?'✓ Coincide con tus cuentas':('Diferencia: '+parts.join(' · ')),style:'font-size:10.5px;color:rgba(0,0,0,.6);margin-top:3px;line-height:1.4'}));
  totalCard.appendChild(t4);
  if(grandPend>0){
    var t5=el('div',{style:'margin-top:8px;padding-top:8px;border-top:1px solid rgba(0,0,0,.12);display:flex;justify-content:space-between;gap:8px;font-size:11px;color:rgba(0,0,0,.72)'});
    t5.appendChild(el('span',{txt:'Pendiente por pagar −'+fmt(grandPend)}));
    t5.appendChild(el('span',{txt:'Quedaría '+fmt(grandAvail-grandPend),style:'font-weight:700;color:#0d0d0d'}));
    totalCard.appendChild(t5);
  }
  wrap.insertBefore(totalCard,wrap.firstChild);
}

function saveBudget(){
  pushHistory('Actualizar presupuesto '+MONTHS[curM]+' '+curY);
  var mk=mkK(curY,curM),b={};
  cats.income.forEach(function(cat){var inp=document.getElementById('bi_'+cat.id);if(inp&&inp.value){var r=parseFloat((inp.value+'').replace(/\./g,''))||0;if(r>0)b['i:'+cat.id]=r;}});
  cats.expenses.forEach(function(cat){var inp=document.getElementById('bi_'+cat.id);if(inp&&inp.value){var r=parseFloat((inp.value+'').replace(/\./g,''))||0;if(r>0)b['e:'+cat.id]=r;}});
  cats.savings.forEach(function(cat){var inp=document.getElementById('bi_'+cat.id);if(inp&&inp.value){var r=parseFloat((inp.value+'').replace(/\./g,''))||0;if(r>0)b['s:'+cat.id]=r;}});
  budgets[mk]=b;ls.s('bu7',budgets);
  // Save locally first - show feedback immediately
  var btn=document.getElementById('savebdg');
  btn.textContent='✓ Guardado';
  btn.style.background='var(--green)';
  renderDash();
  // Sync Drive in background without blocking
  if(driveToken&&driveCid){try{syncDrive();}catch(e){}}
  setTimeout(function(){
    btn.textContent='Guardar presupuesto';
    btn.style.background='';
  },1500);
}

function setST(t){
  sumTab=t;
  ['ov','in','ex','rk'].forEach(function(x){document.getElementById('stab-'+x).classList.toggle('active',x===t);});
  renderSummary();
}

function renderSummary(){
  var syr=document.getElementById('s-yr');if(syr)syr.textContent=String(sumY);
  var mlblE=document.getElementById('s-mlbl');if(mlblE)mlblE.textContent=MONTHS[sumM]+' '+sumY;
  var segE=document.getElementById('summode-seg');if(segE)segE.style.display=sumTab==='ov'?'none':'flex';
  var mbarME=document.getElementById('s-mbar-month');if(mbarME)mbarME.style.display=(sumTab!=='ov'&&sumMode==='month')?'flex':'none';
  var useMonth=(sumTab!=='ov'&&sumMode==='month');
  var allY=txs.filter(function(t){
    var d=new Date(t.date+'T00:00:00');
    if(useMonth)return d.getFullYear()===sumY&&d.getMonth()===sumM&&t.mode==='tracking'&&!t.isAdjust;
    return d.getFullYear()===sumY&&t.mode==='tracking'&&!t.isAdjust;
  });
  var periodLabel=useMonth?(MONTHS[sumM]+' '+sumY):String(sumY);
  var totInc=0,totExp=0;allY.forEach(function(t){if(t.type==='Income')totInc+=t.amount;else totExp+=t.amount;});
  var sb=clr('sum-body');if(!sb)return;

  if(sumTab==='ov'){
    var months=[];
    for(var i=0;i<12;i++){
      var mi=0,me=0,mb=0;
      allY.forEach(function(t){if(new Date(t.date+'T00:00:00').getMonth()===i){if(t.type==='Income')mi+=t.amount;else me+=t.amount;}});
      var bk=budgets[mkK(sumY,i)]||{};
      var mbi=0,mbe=0;
      cats.income.forEach(function(cat){mbi+=(bk['i:'+cat.id]||bk[cat.name]||0);});
      cats.expenses.concat(cats.savings).forEach(function(cat){mbe+=(bk['e:'+cat.id]||bk['s:'+cat.id]||bk[cat.name]||0);});
      months.push({i:i,inc:mi,exp:me,budgInc:mbi,budgExp:mbe});
    }
    var maxMV=1;months.forEach(function(m){var v=Math.max(m.inc,m.exp,m.budgInc,m.budgExp);if(v>maxMV)maxMV=v;});
    var CH=80;
    // KPIs
    var kgrid=el('div',{cls:'kgrid',style:'margin-bottom:10px'});
    [[fmt(totInc),'Ingresos '+sumY,'cg'],[fmt(totExp),'Gastos '+sumY,'cr'],[fmt(totInc-totExp),'Balance',totInc-totExp>=0?'cg':'cr'],[totInc>0?Math.round(((totInc-totExp)/totInc)*100)+'%':'—','Tasa ahorro','cl']].forEach(function(d){
      kgrid.appendChild(el('div',{cls:'kpi'},[el('div',{cls:'kl',txt:d[1]}),el('div',{cls:'kv '+d[2],txt:d[0]})]));
    });
    sb.appendChild(kgrid);
    // Chart
    var card=el('div',{cls:'card'});
    card.appendChild(el('div',{cls:'chd'},[el('h3',{txt:'Ingresos vs Gastos mensuales'})]));
    var chartWrap=el('div',{style:'overflow-x:auto;scrollbar-width:none'});
    var chart=el('div',{cls:'mchart'});
    months.forEach(function(m){
      var ih=m.inc?Math.max(4,Math.round((m.inc/maxMV)*CH)):2;
      var eh=m.exp?Math.max(4,Math.round((m.exp/maxMV)*CH)):2;
      var bih=m.budgInc?Math.max(4,Math.round((m.budgInc/maxMV)*CH)):0;
      var beh=m.budgExp?Math.max(4,Math.round((m.budgExp/maxMV)*CH)):0;
      var incOk=m.budgInc>0&&m.inc<=m.budgInc;
      var expOk=m.budgExp>0&&m.exp<=m.budgExp;
      var bars=el('div',{cls:'mcbars'});
      // Income bar + budget line
      var incWrap=el('div',{style:'position:relative;display:flex;flex-direction:column;justify-content:flex-end;height:'+CH+'px'});
      incWrap.appendChild(el('div',{cls:'mcbar',style:'height:'+ih+'px;background:'+(incOk?'var(--green)':'var(--amber)')+';opacity:'+(m.inc?1:.3)}));
      if(bih){var bil=el('div',{style:'position:absolute;bottom:'+bih+'px;left:-1px;right:-1px;height:2px;background:var(--green);opacity:.7;border-radius:1px'});incWrap.appendChild(bil);}
      // Expense bar + budget line
      var expWrap=el('div',{style:'position:relative;display:flex;flex-direction:column;justify-content:flex-end;height:'+CH+'px'});
      expWrap.appendChild(el('div',{cls:'mcbar',style:'height:'+eh+'px;background:'+(expOk?'var(--red)':'var(--amber)')+';opacity:'+(m.exp?1:.3)}));
      if(beh){var bel=el('div',{style:'position:absolute;bottom:'+beh+'px;left:-1px;right:-1px;height:2px;background:var(--red);opacity:.7;border-radius:1px'});expWrap.appendChild(bel);}
      bars.appendChild(incWrap);
      bars.appendChild(expWrap);
      chart.appendChild(el('div',{cls:'mccol'},[bars,el('div',{cls:'mclbl',txt:MO[m.i]})]));
    });
    chartWrap.appendChild(chart);card.appendChild(chartWrap);
    var leg=el('div',{style:'display:flex;gap:12px;margin-top:10px'});
    [['var(--green)','Ingresos reales'],['var(--red)','Gastos reales'],['var(--green)','Pres. ingresos','dashed'],['var(--red)','Pres. gastos','dashed']].forEach(function(d){
      var item=el('div',{style:'display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text2)'});
      if(d[2]==='dashed'){item.appendChild(el('div',{style:'width:14px;height:2px;background:'+d[0]+';border-radius:1px;opacity:.7'}));}
      else{item.appendChild(el('div',{style:'width:10px;height:10px;background:'+d[0]+';border-radius:2px'}));}
      item.appendChild(document.createTextNode(d[1]));
      leg.appendChild(item);
    });
    card.appendChild(leg);sb.appendChild(card);

  } else if(sumTab==='in'||sumTab==='ex'){
    var isIn=sumTab==='in',ftype=isIn?'Income':'Expenses',total=isIn?totInc:totExp;
    var colors=isIn?CI:CE,catList=isIn?cats.income:cats.expenses;
    var items=[];
    catList.forEach(function(c){var val=0;allY.forEach(function(t){if(t.type===ftype&&t.category===c.name)val+=t.amount;});if(val>0)items.push({name:c.name,icon:c.icon,val:val});});
    items.sort(function(a,b){return b.val-a.val;});
    if(!items.length){sb.appendChild(el('div',{cls:'empty'},[el('div',{cls:'ei',html:uiI('chart',34)}),el('p',{txt:'Sin datos para '+periodLabel})]));return;}
    var SIZE=120,STROKE=22,R=(SIZE-STROKE)/2,CIRC=2*Math.PI*R,offset=0;
    var svgNS='http://www.w3.org/2000/svg';
    var svg=document.createElementNS(svgNS,'svg');
    svg.setAttribute('width',SIZE);svg.setAttribute('height',SIZE);svg.setAttribute('viewBox','0 0 '+SIZE+' '+SIZE);svg.style.transform='rotate(-90deg)';svg.style.flexShrink='0';
    items.forEach(function(item,i){
      var pct=item.val/total,dash=pct*CIRC,gap=CIRC-dash;
      var circle=document.createElementNS(svgNS,'circle');
      circle.setAttribute('cx',SIZE/2);circle.setAttribute('cy',SIZE/2);circle.setAttribute('r',R);
      circle.setAttribute('fill','none');circle.setAttribute('stroke',colors[i%colors.length]);
      circle.setAttribute('stroke-width',STROKE);circle.setAttribute('stroke-dasharray',dash+' '+gap);
      circle.setAttribute('stroke-dashoffset',-offset);
      svg.appendChild(circle);offset+=dash;
    });
    var dleg=el('div',{cls:'dleg'});
    items.forEach(function(item,i){
      dleg.appendChild(el('div',{cls:'dlrow'},[
        el('div',{cls:'dldot',style:'background:'+colors[i%colors.length]}),
        el('div',{cls:'dlnm',txt:icoLabel(item.icon,item.name)}),
        el('div',{cls:'dlvl',txt:fmt(item.val)})
      ]));
    });
    dleg.appendChild(el('div',{cls:'dlrow'},[
      el('div',{cls:'dldot'}),
      el('div',{cls:'dlnm',txt:'Total',style:'color:var(--text);font-weight:700'}),
      el('div',{cls:'dlvl',txt:fmt(total),style:'color:var(--text)'})
    ]));
    var dw=el('div',{cls:'donut-wrap'});dw.appendChild(svg);dw.appendChild(dleg);
    var card2=el('div',{cls:'card'});
    card2.appendChild(el('div',{cls:'chd'},[el('h3',{txt:(isIn?'Ingresos':'Gastos')+' - '+periodLabel})]));
    card2.appendChild(dw);sb.appendChild(card2);

  } else {
    var rkItems=[];
    cats.expenses.forEach(function(c){
      var tracked=0;allY.forEach(function(t){if(t.type==='Expenses'&&t.category===c.name)tracked+=t.amount;});
      var budgTot=0;
      if(useMonth){var bkm=budgets[mkK(sumY,sumM)]||{};budgTot=bkm[c.name]||0;}
      else{for(var i=0;i<12;i++){var bk2=budgets[mkK(sumY,i)]||{};budgTot+=(bk2['e:'+c.id]||bk2['s:'+c.id]||bk2[c.name]||0);}}
      if(tracked>0||budgTot>0)rkItems.push({name:c.name,icon:c.icon,tracked:tracked,budget:budgTot});
    });
    rkItems.sort(function(a,b){return b.tracked-a.tracked;});
    var maxV2=1;rkItems.forEach(function(c){if(Math.max(c.tracked,c.budget)>maxV2)maxV2=Math.max(c.tracked,c.budget);});
    if(!rkItems.length){sb.appendChild(el('div',{cls:'empty'},[el('div',{cls:'ei',html:uiI('chart',34)}),el('p',{txt:'Sin datos para '+periodLabel})]));return;}
    var card3=el('div',{cls:'card'});
    card3.appendChild(el('div',{cls:'chd'},[el('h3',{txt:'Ranking gastos - '+periodLabel})]));
    rkItems.forEach(function(c){
      var tp=Math.min(100,(c.tracked/maxV2)*100);
      var bp=c.budget>0?Math.min(100,(c.budget/maxV2)*100):null;
      var pct2=c.budget>0?Math.round((c.tracked/c.budget)*100):null;
      var col=pct2===null?'var(--lime)':pct2>100?'var(--red)':pct2>80?'var(--amber)':'var(--lime)';
      var bg=el('div',{cls:'rkbg'});
      var fill=el('div',{cls:'rkfill',style:'width:'+tp+'%;background:'+col});
      if(pct2!==null)fill.appendChild(el('span',{cls:'rkpct',txt:pct2+'%'}));
      bg.appendChild(fill);
      var wrap=el('div',{cls:'rkwrap'});wrap.appendChild(bg);
      if(bp!==null)wrap.appendChild(el('div',{cls:'rkdash',style:'left:'+bp+'%'}));
      card3.appendChild(el('div',{cls:'rkrow'},[
        el('div',{cls:'rklbl',txt:icoLabel(c.icon,c.name)}),
        wrap,
        el('div',{cls:'rkamt',txt:fmt(c.tracked)})
      ]));
    });
    var legR=el('div',{style:'display:flex;gap:12px;margin-top:12px;padding-top:10px;border-top:.5px solid var(--border)'});
    [['var(--lime)','Gastado'],['dashed','Presupuesto']].forEach(function(d){
      var item=el('div',{style:'display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text2)'});
      if(d[0]==='dashed')item.appendChild(el('div',{style:'width:2px;height:14px;border-right:2px dashed var(--text3)'}));
      else item.appendChild(el('div',{style:'width:10px;height:10px;background:'+d[0]+';border-radius:2px'}));
      item.appendChild(document.createTextNode(d[1]));legR.appendChild(item);
    });
    card3.appendChild(legR);sb.appendChild(card3);
  }
}

function renderSettings(){
  renderHistory();
  renderRecsSettings();
  var av=document.getElementById('app-version');if(av)av.textContent='Versión '+APP_VERSION+' · '+fmtDateCO(APP_DATE);
  var ag=clr('s-ag');
  accts.forEach(function(a,i){
    var card=el('div',{cls:'abig',style:'cursor:pointer'});
    card.appendChild(el('div',{cls:'abi',html:icoHTML(a.icon)}));
    card.appendChild(el('div',{cls:'abn',txt:a.name}));
    card.appendChild(el('div',{cls:'abv',txt:fmtb(a.balance||0)}));
    card.addEventListener('click',(function(aid){return function(){openAcctModal(aid);};})(a.id));
    ag.appendChild(card);
  });

  function makeList(wrapId,items,type,addLabel){
    var wrap=clr(wrapId);if(!wrap)return;
    var isCat=type!=='account';
    var dragSrc=null;

    function reorder(fromId,toId){
      var from=items.findIndex(function(x){return x.id===fromId;});
      var to=items.findIndex(function(x){return x.id===toId;});
      if(from<0||to<0||from===to)return;
      var item=items.splice(from,1)[0];
      items.splice(to,0,item);
      ls.s('ca7',cats);syncDrive();
      makeList(wrapId,items,type,addLabel);
      populateCatSel();
    }

    items.forEach(function(item){
      var sub=type==='account'?fmt(item.balance||0):'';
      var editBtn=el('button',{html:uiI('edit',17),'aria-label':'Editar'});
      editBtn.addEventListener('click',(function(id){return function(){openCfg(type,id);};})(item.id));
      var delBtn=el('button',{html:uiI('trash',17),'aria-label':'Eliminar'});
      delBtn.addEventListener('click',(function(id){return function(){delCfg(type,id);};})(item.id));
      var controls=el('div',{cls:'sra'});
      // Drag handle for categories
      var handle=null;
      if(isCat){
        handle=el('div',{txt:'⠿',style:'cursor:grab;font-size:18px;color:var(--text3);padding:0 8px;touch-action:none'});
      }
      controls.appendChild(editBtn);
      controls.appendChild(delBtn);
      var row=el('div',{cls:'srow',style:'cursor:default'});
      if(handle)row.insertBefore(handle,row.firstChild);
      row.appendChild(el('div',{cls:'srico',html:icoHTML(item.icon)}));
      row.appendChild(el('div',{cls:'srt'},[el('div',{cls:'srn',txt:item.name}),sub?el('div',{cls:'srs',txt:sub}):null]));
      row.appendChild(controls);

      if(isCat){
        row.setAttribute('draggable','true');
        row.dataset.id=item.id;
        row.addEventListener('dragstart',function(e){
          dragSrc=item.id;
          e.dataTransfer.effectAllowed='move';
          row.style.opacity='0.5';
        });
        row.addEventListener('dragend',function(){row.style.opacity='1';});
        row.addEventListener('dragover',function(e){e.preventDefault();e.dataTransfer.dropEffect='move';row.style.background='var(--bg3)';});
        row.addEventListener('dragleave',function(){row.style.background='';});
        row.addEventListener('drop',function(e){
          e.preventDefault();row.style.background='';
          if(dragSrc&&dragSrc!==item.id)reorder(dragSrc,item.id);
        });
        // Touch support
        var touchStartY=0,touchItem=null;
        handle.addEventListener('touchstart',function(e){
          touchStartY=e.touches[0].clientY;
          dragSrc=item.id;
          row.style.opacity='0.6';
          e.preventDefault();
        },{passive:false});
        handle.addEventListener('touchmove',function(e){
          e.preventDefault();
          var touch=e.touches[0];
          var el2=document.elementFromPoint(touch.clientX,touch.clientY);
          var targetRow=el2?el2.closest('[draggable]'):null;
          if(targetRow&&targetRow!==row){
            document.querySelectorAll('[draggable]').forEach(function(r){r.style.background='';});
            targetRow.style.background='var(--bg3)';
            touchItem=targetRow.dataset.id;
          }
        },{passive:false});
        handle.addEventListener('touchend',function(){
          row.style.opacity='1';
          document.querySelectorAll('[draggable]').forEach(function(r){r.style.background='';});
          if(dragSrc&&touchItem&&dragSrc!==touchItem)reorder(dragSrc,touchItem);
          dragSrc=null;touchItem=null;
        });
      }
      wrap.appendChild(row);
    });
    var addRow=el('div',{cls:'addsrow'});
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.style.width='18px';svg.style.height='18px';svg.style.stroke='currentColor';svg.style.fill='none';svg.style.strokeWidth='2.2';
    var circle=document.createElementNS('http://www.w3.org/2000/svg','circle');circle.setAttribute('cx','12');circle.setAttribute('cy','12');circle.setAttribute('r','10');svg.appendChild(circle);
    var h=document.createElementNS('http://www.w3.org/2000/svg','line');h.setAttribute('x1','12');h.setAttribute('y1','8');h.setAttribute('x2','12');h.setAttribute('y2','16');svg.appendChild(h);
    var v=document.createElementNS('http://www.w3.org/2000/svg','line');v.setAttribute('x1','8');v.setAttribute('y1','12');v.setAttribute('x2','16');v.setAttribute('y2','12');svg.appendChild(v);
    addRow.appendChild(svg);addRow.appendChild(document.createTextNode(addLabel));
    addRow.addEventListener('click',(function(t){return function(){openCfg(t,null);};})(type));
    wrap.appendChild(addRow);
  }
  makeList('s-al-wrap',accts,'account','Agregar cuenta');
  makeList('s-ci-wrap',cats.income,'cat-income','Agregar categoría de ingreso');
  makeList('s-ce-wrap',cats.expenses,'cat-expenses','Agregar categoría de gasto');
  makeList('s-cs-wrap',cats.savings,'cat-savings','Agregar categoría de ahorro');
}

function populateDescList(){
  var dl=document.getElementById('desc-list');if(!dl)return;
  while(dl.firstChild)dl.removeChild(dl.firstChild);
  var seen={};
  for(var i=0;i<txs.length;i++){
    var dsc=txs[i].description;
    if(dsc&&!seen[dsc]){
      seen[dsc]=true;
      var opt=document.createElement('option');opt.value=dsc;dl.appendChild(opt);
    }
  }
}

function populateAcSel(){
  ['f-ac','f-ac-inc','f-payacc'].forEach(function(id){
    var sel=document.getElementById(id);if(!sel)return;
    while(sel.firstChild)sel.removeChild(sel.firstChild);
    accts.forEach(function(a){
      var opt=document.createElement('option');opt.value=a.id;opt.textContent=icoLabel(a.icon,a.name);sel.appendChild(opt);
    });
  });
}

function populateCatSel(){
  var s=document.getElementById('f-c');if(!s)return;
  while(s.firstChild)s.removeChild(s.firstChild);
  var list=(mTab==='income')?cats.income:cats.expenses.concat(cats.savings);
  var ph=document.createElement('option');ph.value='';ph.textContent='Elige una categoría…';s.appendChild(ph);
  list.forEach(function(c){
    var opt=document.createElement('option');opt.value=c.name;opt.textContent=icoLabel(c.icon,c.name);s.appendChild(opt);
  });
}

function setMTab(t){
  mTab=t;
  document.getElementById('mt-inc').classList.toggle('active',t==='income');
  document.getElementById('mt-gasto').classList.toggle('active',t==='gasto');
  document.getElementById('mt-shared').classList.toggle('active',t==='shared');
  document.getElementById('tf-income-ac').style.display=(t==='income')?'':'none';
  document.getElementById('tf-gasto').style.display=(t==='gasto')?'':'none';
  document.getElementById('tf-shared').style.display=(t==='shared')?'':'none';
  var mtt=document.getElementById('mt-transfer');if(mtt)mtt.classList.toggle('active',t==='transfer');
  var tft=document.getElementById('tf-transfer');if(tft)tft.style.display=(t==='transfer')?'':'none';
  var fgc=document.getElementById('fg-cat');if(fgc)fgc.style.display=(t==='transfer')?'none':'';
  var rrw=document.getElementById('rec-row');if(rrw)rrw.style.display=(t==='transfer')?'none':'flex';
  if(t==='transfer')populateTransferSel();
  // Movimiento nuevo: al pasar a Pendiente, el estado arranca en «Pendiente» (no recuerda el último usado)
  if(t==='shared'&&!editId){var fst=document.getElementById('f-st');if(fst){fst.value='Unpaid';updateStatusOptions();}}
  if(t==='income')txType='Income';else if(t==='transfer')txType='Transfer';else txType='Expenses';
  // Conservar la categoría si sigue existiendo en el nuevo tipo (ej. de Gasto a Compartido)
  var fc=document.getElementById('f-c'),prevCat=fc?fc.value:'';
  populateCatSel();
  if(prevCat&&fc){fc.value=prevCat;if(fc.value!==prevCat)fc.value='';}
  txFormRefresh();
}

function setTT(t){txType=t;populateCatSel();}

function updateStatusOptions(){
  var chSel=document.getElementById('f-ch');if(!chSel)return;
  var charge=chSel.value;
  var stSel=document.getElementById('f-st');if(!stSel)return;
  var soEl=document.getElementById('f-so');
  var src=soEl?soEl.value:'';
  var isRealDebit=(src==='Tarjeta débito'||src==='Efectivo');
  var currentVal=stSel.value;
  while(stSel.firstChild)stSel.removeChild(stSel.firstChild);
  function addOpt(val,label){var o=document.createElement('option');o.value=val;o.textContent=label;stSel.appendChild(o);}
  if(charge==='Los dos'){
    // Con débito o efectivo la plata ya salió de tu cuenta: tú ya pagaste
    if(!isRealDebit)addOpt('Unpaid','Pendiente');
    addOpt('DavidPaidLinaPending',userName+' pago - '+partnerName+' pendiente');
    if(!isRealDebit){
      // With credit card, Lina can also pay first
      addOpt('LinaPaidDavidPending',partnerName+' pago - '+userName+' pendiente');
    }
    addOpt('Paid','Pagado');
  } else {
    addOpt('Unpaid','Pendiente');
    addOpt('Paid','Pagado');
  }
  // Movimiento nuevo y estado no elegido a mano: arranca en «Pendiente» si existe
  var want=(!editId&&stSel.dataset.touched!=='1')?'Unpaid':currentVal;
  var stillValid=false;
  for(var i=0;i<stSel.options.length;i++){if(stSel.options[i].value===want){stillValid=true;break;}}
  stSel.value=stillValid?want:stSel.options[0].value;
  updatePayAccVis();
}

function updatePayAccVis(){
  var stEl=document.getElementById('f-st');if(!stEl)return;
  var st=stEl.value;
  var chEl=document.getElementById('f-ch');
  var charge=chEl?chEl.value:'';
  var soEl=document.getElementById('f-so');
  var src=soEl?soEl.value:'';
  var isRealDebit=(src==='Tarjeta débito'||src==='Efectivo');
  // Show account field when:
  // 1. David pays (any charge) - Paid or DavidPaidLinaPending
  // 2. Lina/Otro with debit/cash - money left David's account
  var show=false;
  if(charge==='David'&&st==='Paid') show=true;
  else if(charge==='Los dos'&&(st==='Paid'||st==='DavidPaidLinaPending')) show=true;
  else if((charge==='Lina'||charge==='Otro')&&isRealDebit) show=true;
  var row=document.getElementById('payacc-row');
  var lbl=document.querySelector('#payacc-row label');
  if(lbl){
    if((charge==='Lina'||charge==='Otro')&&isRealDebit&&st!=='Paid')
      lbl.textContent='Cuenta que lo adelantó';
    else lbl.textContent='¿De dónde salió el dinero?';
  }
  if(row)row.style.display=show?'block':'none';
}

function saveUserName(){
  var v=document.getElementById('s-username').value.trim()||'David';
  userName=v;ls.s('un7',userName);
  var hn=document.getElementById('hero-name');if(hn)hn.textContent=userName;
  renderAll();
}

function togglePendienteTab(){
  showPendiente=!showPendiente;
  ls.s('sp7',showPendiente);
  applyPendienteTab();
}
function applyPendienteTab(){
  var navBtn=document.getElementById('nav-expenses');
  var page=document.getElementById('page-expenses');
  var settBtn=document.getElementById('s-pend-btn');
  var modalTab=document.getElementById('mt-shared');
  if(navBtn)navBtn.style.display=showPendiente?'':'none';
  if(modalTab)modalTab.style.display=showPendiente?'':'none';
  if(settBtn)settBtn.textContent=showPendiente?'Activada':'Desactivada';
  // If on expenses page and hiding, go to dash
  if(!showPendiente&&page&&page.classList.contains('active')){
    showPage('dash');
  }
  // If modal is open on shared tab and hiding, switch to gasto
  if(!showPendiente&&mTab==='shared'){
    setMTab('gasto');
  }
}
function savePartnerName(){
  var v=document.getElementById('s-partnername').value.trim()||'Lina';
  partnerName=v;ls.s('pn7',partnerName);
  renderAll();
}

function openTx(id){
  var fstT=document.getElementById('f-st');if(fstT)fstT.dataset.touched='';
  editId=id;populateAcSel();populateDescList();
  if(id){
    var t=null;for(var i=0;i<txs.length;i++){if(txs[i].id===id){t=txs[i];break;}}
    if(!t)return;
    document.getElementById('tx-ttl').textContent='Editar movimiento';
    document.getElementById('delbtn-wrap').style.display='block';
    // If this is a linked tracking tx (copy of shared), open the parent shared tx
    if(t.linkedFrom){
      var parent=null;for(var i=0;i<txs.length;i++){if(txs[i].id===t.linkedFrom){parent=txs[i];break;}}
      if(parent){closeM('m-tx');openTx(parent.id);return;}
    }
    if(t.mode==='transfer'){
      setMTab('transfer');
      document.getElementById('f-d').value=t.description||'';
      document.getElementById('f-m').value=t.amount.toLocaleString('es-CO');
      document.getElementById('f-dt').value=t.date;
      document.getElementById('f-from').value=t.fromId;document.getElementById('f-to').value=t.toId;
      txFormRefresh();document.getElementById('m-tx').classList.add('open');return;
    }
    var openTab;
    if(t.mode==='expenses') openTab='shared';
    else if(t.type==='Income') openTab='income';
    else openTab='gasto';
    setMTab(openTab);
    document.getElementById('f-d').value=t.description;
    document.getElementById('f-m').value=t.amount.toLocaleString('es-CO');
    document.getElementById('f-dt').value=t.date;
    setTimeout(function(){document.getElementById('f-c').value=t.category;renderTxCats(true);},10);
    if(t.mode==='tracking'){
      if(t.type==='Income')document.getElementById('f-ac-inc').value=t.accountId||accts[0].id;
      else document.getElementById('f-ac').value=t.accountId||accts[0].id;
    }
    else{document.getElementById('f-ch').value=t.charge||'Los dos';updateStatusOptions();document.getElementById('f-so').value=t.source||'Tarjeta crédito';document.getElementById('f-st').value=t.status||'Paid';document.getElementById('f-payacc').value=t.payAccountId||accts[0].id;updatePayAccVis();}
  } else {
    document.getElementById('delbtn-wrap').style.display='none';
    document.getElementById('f-d').value='';document.getElementById('f-m').value='';document.getElementById('f-c').value='';
    document.getElementById('f-dt').value=todayISO();
    var ap=document.querySelector('.page.active');
    var defaultTab=ap&&ap.id==='page-expenses'?'shared':'gasto';
    setMTab(defaultTab);
    document.getElementById('f-ch').value='David';
    updateStatusOptions();
    document.getElementById('f-st').value='Unpaid';updateStatusOptions();
    if(accts[0]){document.getElementById('f-payacc').value=accts[0].id;document.getElementById('f-ac-inc').value=accts[0].id;}
    updatePayAccVis();
  }
  var frec=document.getElementById('f-rec');if(frec){var ct=id?findTx(id):null;frec.checked=!!(ct&&ct.recId&&findRec(ct.recId));}
  txFormRefresh();
  document.getElementById('m-tx').classList.add('open');
  if(!id)document.getElementById('f-m').focus();
}



// ══════ Registro rápido: categorías en cuadrícula, favoritos, sugerencias y voz ══════
var txRec=null;
function txAmtW(){var m=document.getElementById('f-m');if(m)m.style.width=Math.max(1,(m.value||m.placeholder).length)+0.5+'ch';}
function txErr(m){var e=document.getElementById('tx-err');if(e)e.textContent=m||'';}
function txNorm(s){return normTxt(s).replace(/[^a-z0-9ñ ]/g,' ').replace(/\s+/g,' ').trim();}
function txCatList(){return mTab==='income'?cats.income:cats.expenses.concat(cats.savings);}
function isoAdd(iso,d){var x=new Date(iso+'T00:00:00');x.setDate(x.getDate()+d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');}

function txFormRefresh(){
  var ttl={gasto:'Nuevo gasto',income:'Nuevo ingreso',shared:'Gasto compartido',transfer:'Transferencia'};
  var h=document.getElementById('tx-ttl');if(h)h.textContent=editId?'Editar movimiento':(ttl[mTab]||'Nuevo movimiento');
  txErr('');
  var v=document.getElementById('tx-voice');if(v)v.textContent='';
  clr('tx-sug');renderTxCats(true);renderTxFavs();txDateLbl();txAmtW();
}
// Abre el calendario al tocar la fecha (algunos navegadores no lo abren solos con el campo invisible)
function txOpenDate(e){var d=document.getElementById('f-dt');if(d&&d.showPicker){try{d.showPicker();if(e)e.preventDefault();}catch(err){}}}
function txDateLbl(){
  var v=document.getElementById('f-dt').value,l=document.getElementById('tx-dlbl');if(!l)return;
  var t=todayISO();
  if(v===t)l.textContent='Hoy';else if(v===isoAdd(t,-1))l.textContent='Ayer';
  else if(v)l.textContent=new Date(v+'T00:00:00').toLocaleDateString('es-CO',v.slice(0,4)===t.slice(0,4)?{day:'numeric',month:'short'}:{day:'numeric',month:'short',year:'numeric'});
  else l.textContent='Fecha';
}

// Lo aprendido del historial: por descripción, la última categoría, cuenta y montos usados
function txLearn(){
  var by={},isInc=mTab==='income';
  baseTxs().forEach(function(t){
    if(t.mode==='transfer'||t.isAdjust||!t.description)return;
    if(isInc!==(t.type==='Income'))return;
    var k=txNorm(t.description);if(!k)return;
    var e=by[k]||(by[k]={k:k,n:0,date:'',amounts:[]});
    e.n++;e.amounts.push({d:t.date,a:t.amount});
    if(t.date>=e.date){e.date=t.date;e.description=t.description;e.category=t.category;e.accountId=t.mode==='expenses'?t.payAccountId:t.accountId;}
  });
  return by;
}
// Si las últimas veces fue el mismo valor (ej. café), se propone ese monto
function txFixedAmt(e){
  var a=e.amounts.slice().sort(function(x,y){return x.d<y.d?1:-1;}).slice(0,3);
  return (a.length>=2&&a.every(function(x){return x.a===a[0].a;}))?a[0].a:0;
}
function txApply(e){
  document.getElementById('f-d').value=e.description;
  if(e.category&&txCatList().some(function(c){return c.name===e.category;}))document.getElementById('f-c').value=e.category;
  if(e.accountId&&findAcct(e.accountId)){var s=document.getElementById(mTab==='income'?'f-ac-inc':mTab==='shared'?'f-payacc':'f-ac');if(s)s.value=e.accountId;}
  var m=document.getElementById('f-m'),fx=txFixedAmt(e);
  if(fx&&!rawNum(m))m.value=fx.toLocaleString('es-CO');
  txAmtW();
  clr('tx-sug');renderTxCats();txErr('');
  if(!rawNum(m))m.focus();
}

// Categorías en una sola fila deslizable, las más usadas primero
function renderTxCats(scrollToSel){
  var w=document.getElementById('tx-cats');if(!w)return;
  var keep=w.scrollLeft;clr('tx-cats');
  var sel=document.getElementById('f-c').value,use={},selEl=null;
  baseTxs().forEach(function(t){if(t.category)use[t.category]=(use[t.category]||0)+1;});
  var list=txCatList().slice().sort(function(a,b){return (use[b.name]||0)-(use[a.name]||0);});
  list.forEach(function(c){
    var b=el('button',{type:'button',cls:'tx-cat'+(c.name===sel?' on':''),click:function(){txSetCat(sel===c.name?'':c.name);}},
      [el('span',{cls:'uii',html:icoHTML(c.icon,18)}),el('span',{cls:'tx-cat-n',txt:c.name})]);
    if(c.name===sel)selEl=b;
    w.appendChild(b);
  });
  // Al tocar una categoría la fila no vuelve al inicio; al abrir, se muestra la elegida
  // (se repite en el siguiente cuadro porque al abrir, el formulario aún está oculto)
  function pos(){w.scrollLeft=selEl?Math.max(0,selEl.offsetLeft-w.clientWidth/2+selEl.offsetWidth/2):0;}
  if(scrollToSel){pos();requestAnimationFrame(pos);}
  else w.scrollLeft=keep;
}
function txSetCat(n){document.getElementById('f-c').value=n;renderTxCats();txErr('');}

function renderTxFavs(){
  var w=clr('tx-favs');if(!w)return;
  if(editId||mTab==='transfer'){w.style.display='none';return;}
  var L=txLearn(),now=Date.parse(todayISO());
  var arr=Object.keys(L).map(function(k){return L[k];}).filter(function(e){return e.n>=2;});
  arr.forEach(function(e){var days=(now-Date.parse(e.date))/864e5;e.score=e.n+(days<30?3:0)-(days>120?e.n/2:0);});
  arr.sort(function(a,b){return b.score-a.score;});
  arr=arr.slice(0,8);
  w.style.display=arr.length?'':'none';
  arr.forEach(function(e){
    var fx=txFixedAmt(e);
    w.appendChild(el('button',{type:'button',cls:'tx-chip',click:function(){txApply(e);}},
      [el('span',{cls:'uii',html:icoHTML(cIcon(e.category),15)}),el('span',{txt:e.description+(fx?' · '+fmt(fx):'')})]));
  });
}
function txSuggest(){
  var w=clr('tx-sug');if(!w)return;
  var q=txNorm(document.getElementById('f-d').value);if(q.length<2)return;
  var L=txLearn(),res=[];
  Object.keys(L).forEach(function(k){if(k!==q&&(k.indexOf(q)===0||k.indexOf(' '+q)>=0))res.push(L[k]);});
  res.sort(function(a,b){return b.n-a.n;});
  res.slice(0,3).forEach(function(e){
    w.appendChild(el('button',{type:'button',cls:'tx-chip tx-chip-sug',click:function(){txApply(e);}},
      [el('span',{cls:'uii',html:icoHTML(cIcon(e.category),14)}),el('span',{txt:e.description+(e.category?' · '+e.category:'')})]));
  });
  // Si lo escrito coincide con algo que ya registraste, completa la categoría sola
  var ex=L[q];
  if(ex&&ex.category&&!document.getElementById('f-c').value&&txCatList().some(function(c){return c.name===ex.category;})){document.getElementById('f-c').value=ex.category;renderTxCats();}
}

// ── Entender una frase: «35 mil en Uber», «ayer mercado 120 mil con Nu», «me pagaron 2 millones» ──
var TX_NUMW={un:1,uno:1,una:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12,trece:13,catorce:14,quince:15,veinte:20,veinticinco:25,treinta:30,cuarenta:40,cincuenta:50,sesenta:60,setenta:70,ochenta:80,noventa:90,cien:100,ciento:100,doscientos:200,trescientos:300,cuatrocientos:400,quinientos:500,seiscientos:600,setecientos:700,ochocientos:800,novecientos:900};
var TX_MUL={mil:1e3,lucas:1e3,luca:1e3,k:1e3,millon:1e6,millones:1e6,palo:1e6,palos:1e6,melones:1e6,melon:1e6};
var TX_STOP={gaste:1,gasto:1,pague:1,pago:1,compre:1,compra:1,en:1,de:1,del:1,por:1,un:1,una:1,el:1,la:1,los:1,las:1,para:1,pesos:1,peso:1,y:1,con:1,me:1,mi:1,hoy:1,ayer:1,antier:1,anteayer:1,ingreso:1,recibi:1,cobre:1,pagaron:1,a:1,al:1,que:1,fue:1,fueron:1,se:1,le:1,lo:1,unos:1,unas:1,anote:1,anota:1,registra:1,registrar:1,sueldo:0};
var TX_HINTS={transporte:['uber','taxi','didi','indriver','cabify','bus','buseta','transmilenio','metro','gasolina','tanqueo','peaje','parqueadero','sitp','mio'],
  'comidas fuera':['restaurante','almuerzo','cena','desayuno','domicilio','rappi','hamburguesa','pizza','crepes','corral','frisby','kfc','mcdonalds','sushi','helado','postre','cafe','tinto','starbucks','juan valdez'],
  mercado:['mercado','supermercado','exito','d1','ara','jumbo','carulla','olimpica','tienda','surtimax','makro','fruver','panaderia'],
  servicios:['luz','agua','gas','internet','epm','energia','acueducto','codensa','enel','vanti'],
  telefono:['celular','claro','movistar','tigo','wom','recarga'],
  suscripciones:['netflix','spotify','disney','hbo','max','prime','youtube','icloud','suscripcion','chatgpt'],
  salud:['farmacia','drogueria','medico','cita','eps','medicamento','odontologo','examen'],
  ropa:['ropa','zapatos','tenis','camisa','pantalon','zara'],arriendo:['arriendo','renta','administracion'],
  educacion:['curso','universidad','colegio','libro','platzi','udemy'],deporte:['gimnasio','gym','smartfit','futbol','cancha','raqueta'],
  regalos:['regalo','cumpleanos'],viajes:['vuelo','hotel','viaje','airbnb','tiquete'],mantenimiento:['mantenimiento','reparacion','taller','lavado'],
  empleo:['sueldo','salario','nomina','quincena','prima'],freelance:['freelance','proyecto','cliente']};

function txToNum(w){
  w=w.replace(/^\$/,'');
  var m=w.match(/^(\d+(?:[.,]\d+)?)k$/);if(m)return parseFloat(m[1].replace(',','.'))*1e3;
  if(/^\d{1,3}([.,]\d{3})+$/.test(w))return parseInt(w.replace(/[.,]/g,''),10);
  if(/^\d+([.,]\d+)?$/.test(w))return parseFloat(w.replace(',','.'));
  if(TX_NUMW[w]!=null)return TX_NUMW[w];
  return null;
}
function txParse(text){
  // toks0 conserva las palabras como se dijeron (tildes, mayúsculas); toks es su versión normalizada
  var toks0=String(text||'').replace(/\$\s+/g,'$').replace(/[¿?¡!«»"]/g,' ').split(/\s+/).map(function(t){return t.replace(/^[,.;:]+|[,.;:]+$/g,'');}).filter(Boolean);
  var toks=toks0.map(function(t){return normTxt(t);});
  var res={amount:0,desc:'',cat:'',date:'',acc:'',type:''},used={};
  // Monto: primer tramo de números y multiplicadores («1 millon 200 mil», «35 lucas», «medio millon»)
  var total=0,cur=0,lastMul=0,start=-1,end=-1;
  for(var i=0;i<toks.length;i++){
    var w=toks[i],n=txToNum(w),mul=TX_MUL[w];
    if(n!=null){if(start<0)start=i;cur+=n;end=i;continue;}
    if(mul&&start>=0){total+=(cur||1)*mul;cur=0;lastMul=mul;end=i;continue;}
    if(w==='medio'&&start<0&&TX_MUL[toks[i+1]]){start=i;cur=0.5;end=i;continue;}
    if(w==='medio'&&lastMul&&start>=0){total+=lastMul/2;end=i;continue;}
    if(w==='y'&&start>=0&&i+1<toks.length&&(txToNum(toks[i+1])!=null||toks[i+1]==='medio')){continue;}
    if(start>=0)break;
  }
  total+=cur;
  if(start>=0&&total>0){res.amount=Math.round(total);for(var k=start;k<=end;k++)used[k]=1;}
  var joined=' '+toks.join(' ')+' ';
  // Tipo
  if(/ (me pagaron|me consignaron|recibi|cobre|ingreso|sueldo|salario|nomina|quincena) /.test(joined))res.type='income';
  else if(/ (compartido|a medias|entre los dos|mitad y mitad) /.test(joined))res.type='shared';
  // Fecha
  if(/ (antier|anteayer|antes de ayer) /.test(joined))res.date=isoAdd(todayISO(),-2);
  else if(/ ayer /.test(joined))res.date=isoAdd(todayISO(),-1);
  // Cuenta: por nombre («nu», «bancolombia», «efectivo»)
  accts.forEach(function(a){var an=txNorm(a.name),first=an.split(' ')[0];
    if(!res.acc&&(joined.indexOf(' '+an+' ')>=0||(first.length>=2&&joined.indexOf(' '+first+' ')>=0)))res.acc=a.id;});
  var accWords={};if(res.acc){txNorm(acctNameById(res.acc)).split(' ').forEach(function(x){accWords[x]=1;});}
  // Descripción: lo que queda sin monto, fecha, cuenta ni palabras de relleno
  var TX_TYPEW={compartido:1,compartida:1,medias:1,mitad:1,pagaron:1,consignaron:1};
  var d=toks0.filter(function(w0,i){var w=toks[i];return !used[i]&&!TX_STOP[w]&&!accWords[w]&&!TX_MUL[w]&&!TX_TYPEW[w]&&w!=='antes';}).join(' ').trim();
  res.desc=d?d.charAt(0).toUpperCase()+d.slice(1):'';
  // Categoría: 1) lo aprendido, 2) nombre de una categoría mencionada, 3) palabras típicas
  var list=res.type==='income'?cats.income:cats.expenses.concat(cats.savings);
  var L=txLearn(),dk=txNorm(res.desc);
  if(dk&&L[dk]&&L[dk].category)res.cat=L[dk].category;
  if(!res.cat)list.forEach(function(c){if(!res.cat&&joined.indexOf(' '+txNorm(c.name)+' ')>=0)res.cat=c.name;});
  if(!res.cat)Object.keys(TX_HINTS).some(function(h){
    if(!TX_HINTS[h].some(function(w){return joined.indexOf(' '+w+' ')>=0;}))return false;
    var c=list.filter(function(c){return txNorm(c.name).indexOf(h)>=0;})[0];
    if(c){res.cat=c.name;return true;}return false;
  });
  if(!res.cat&&dk)Object.keys(L).some(function(k){if(L[k].category&&(k.indexOf(dk)===0||dk.indexOf(k)===0)){res.cat=L[k].category;if(!res.acc)res.acc=L[k].accountId||'';return true;}return false;});
  if(!res.acc&&dk&&L[dk]&&L[dk].accountId)res.acc=L[dk].accountId;
  return res;
}
function txFillFromText(text){
  var p=txParse(text);
  if(p.type&&!editId&&p.type!==mTab&&!(p.type==='shared'&&!showPendiente))setMTab(p.type);
  var m=document.getElementById('f-m');
  if(p.amount)m.value=p.amount.toLocaleString('es-CO');
  txAmtW();
  document.getElementById('f-d').value=p.desc;
  if(p.cat&&txCatList().some(function(c){return c.name===p.cat;}))document.getElementById('f-c').value=p.cat;
  if(p.date){document.getElementById('f-dt').value=p.date;txDateLbl();}
  if(p.acc&&findAcct(p.acc)){var s=document.getElementById(mTab==='income'?'f-ac-inc':mTab==='shared'?'f-payacc':'f-ac');if(s)s.value=p.acc;}
  clr('tx-sug');renderTxCats();txErr('');
  var parts=[];if(p.amount)parts.push(fmt(p.amount));if(p.desc)parts.push(p.desc);if(p.cat)parts.push(p.cat);
  var v=document.getElementById('tx-voice');
  if(v)v.textContent=parts.length?('Entendí: '+parts.join(' · ')+(p.amount?'':' — falta el monto')):'No entendí el monto. Intenta: «35 mil en Uber»';
  if(!p.amount)m.focus();
}
// Al escribir o dictar la frase completa en «¿En qué?» (ej. con el micrófono del teclado)
function txTyped(){
  var d=document.getElementById('f-d');if(rawNum(document.getElementById('f-m')))return;
  if(txParse(d.value).amount)txFillFromText(d.value);
}
function txVoice(){
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition,st=document.getElementById('tx-voice'),mic=document.getElementById('tx-mic');
  if(txRec){try{txRec.stop();}catch(e){}return;}
  if(!SR){var d=document.getElementById('f-d');d.focus();st.textContent='Usa el micrófono del teclado y di, por ejemplo: «35 mil en Uber»';return;}
  var r=new SR(),heard='';
  r.lang='es-CO';r.interimResults=true;r.continuous=false;r.maxAlternatives=1;
  r.onresult=function(e){heard=Array.prototype.map.call(e.results,function(x){return x[0].transcript;}).join(' ');st.textContent='«'+heard+'»';};
  r.onerror=function(e){heard='';st.textContent=(e.error==='not-allowed'||e.error==='service-not-allowed')?'Sin permiso para el micrófono. Puedes usar el micrófono del teclado en «¿En qué?».':(e.error==='no-speech'?'No escuché nada. Toca el micrófono e intenta de nuevo.':'No pude escuchar. Intenta de nuevo.');};
  r.onend=function(){txRec=null;mic.classList.remove('on');if(heard&&document.getElementById('m-tx').classList.contains('open'))txFillFromText(heard);};
  try{r.start();txRec=r;mic.classList.add('on');st.textContent='Te escucho… di el monto y en qué fue';}
  catch(e){txRec=null;st.textContent='No pude abrir el micrófono.';}
}

function saveTx(){
  if(mTab==='transfer'){saveTransfer();return;}
  var desc=document.getElementById('f-d').value.trim();
  var amount=rawNum(document.getElementById('f-m'));
  var date=document.getElementById('f-dt').value;
  var cat=document.getElementById('f-c').value;
  if(!amount){txErr('Escribe el monto');document.getElementById('f-m').focus();return;}
  if(!date){txErr('Elige la fecha');return;}
  if(!desc)desc=cat||(mTab==='income'?'Ingreso':'Gasto');
  pushHistory((editId?'Editar movimiento: ':'Nuevo movimiento: ')+desc);
  var aId=(mTab==='income')?document.getElementById('f-ac-inc').value:document.getElementById('f-ac').value;
  var acct=null;for(var i=0;i<accts.length;i++){if(accts[i].id===aId){acct=accts[i];break;}}
  var old=null;
  if(editId){for(var i=0;i<txs.length;i++){if(txs[i].id===editId){old=txs[i];break;}}}
  // Map mTab to mode/type
  var txMode=(mTab==='shared')?'expenses':'tracking';
  var txTypeResolved=(mTab==='income')?'Income':'Expenses';
  var t={id:editId||uid(),mode:txMode,type:txTypeResolved,description:desc,amount:amount,date:date,category:cat,account:acct?acct.name:'',accountId:aId,charge:document.getElementById('f-ch').value,source:document.getElementById('f-so').value,status:(txMode==='expenses')?(document.getElementById('f-st').value||'Paid'):undefined,linkedTxId:null,payAccountId:null,linkedFrom:(old&&old.linkedFrom)||null,isShared:(old&&old.isShared)||false,adelantoTxId:(old&&old.adelantoTxId)||null,adelantoAmt:(old&&old.adelantoAmt)||0,payAccountId:(old&&old.payAccountId)||null};
  if(old&&old.isAdjust){t.isAdjust=true;t.category='Ajuste de saldo';}
  if(old&&old.recId)t.recId=old.recId;
  // Balance is recalculated automatically in renderAll via recalcAllBalances()
  if(txMode==='expenses'){
    // Solo se guarda el gasto compartido; tu parte y los adelantos se calculan solos
    var chargeVal=document.getElementById('f-ch')?document.getElementById('f-ch').value:'';
    var src=document.getElementById('f-so')?document.getElementById('f-so').value:'';
    var isRealDebit=(src==='Tarjeta débito'||src==='Efectivo');
    var payerIsDavid=(t.status==='Paid'||t.status==='DavidPaidLinaPending');
    var payEl=document.getElementById('f-payacc');
    var needsAcc=(payerIsDavid&&(chargeVal==='David'||chargeVal==='Los dos'))||(isRealDebit&&(chargeVal==='Lina'||chargeVal==='Otro'||chargeVal==='Los dos'));
    t.payAccountId=needsAcc?((payEl&&payEl.value)||(accts[0]&&accts[0].id)):((old&&old.payAccountId)||null);
    delete t.linkedTxId;delete t.adelantoTxId;delete t.adelantoAmt;delete t.reimbTxId;
  }
  if(editId){for(var i=0;i<txs.length;i++){if(txs[i].id===editId){txs[i]=t;break;}}}else txs.unshift(t);
  var recEl=document.getElementById('f-rec'),recOn=recEl&&recEl.checked&&!t.isAdjust;
  var exRec=t.recId?findRec(t.recId):null;
  if(recOn){var rr=recFromTx(t,exRec);if(!exRec){rr.start=t.date.slice(0,7);rr.done={};rr.done[t.date.slice(0,7)]='a';recs.push(rr);t.recId=rr.id;}saveRecs();}
  else if(exRec){recs=recs.filter(function(x){return x!==exRec;});saveRecs();}
  ls.s('tx7',txs);closeM('m-tx');renderAll();setTimeout(function(){if(document.getElementById('page-expenses').classList.contains('active')){renderPaidExpenses();}},300);syncDrive();
}

function delTx(){
  showConfirm('Eliminar movimiento','Esta accion no se puede deshacer (puedes revertir desde el historial de cambios).',function(){
  var t=null;for(var i=0;i<txs.length;i++){if(txs[i].id===editId){t=txs[i];break;}}
  pushHistory('Eliminar movimiento: '+(t?t.description:''));
  // Balance recalculated automatically via recalcAllBalances()
  // Tu parte y adelantos se recalculan solos al borrar el gasto compartido
  txs=txs.filter(function(x){return x.id!==editId;});
  ls.s('tx7',txs);ls.s('dts7',new Date().toISOString());closeM('m-tx');renderAll();syncDrive();
  });
}

function buildIcoGrid(){
  var g=document.getElementById('cfg-grid');if(!g)return;g.innerHTML='';
  Object.keys(ICONLIB).forEach(function(k){
    var b=document.createElement('button');b.type='button';b.className='icobtn'+(cfgIcon==='@'+k?' active':'');
    b.innerHTML=svgWrap(ICONLIB[k],20);
    b.onclick=function(){cfgIcon='@'+k;refreshIcoActive();};
    g.appendChild(b);
  });
}
function refreshIcoActive(){
  var keys=Object.keys(ICONLIB);
  document.querySelectorAll('#cfg-grid .icobtn').forEach(function(b,i){b.classList.toggle('active',cfgIcon==='@'+keys[i]);});
}

function openCfg(type,id){
  cfgType=type;cfgEditId=id;
  var titles={'account':'cuenta','cat-income':'ingreso','cat-expenses':'gasto','cat-savings':'ahorro'};
  var isA=type==='account';
  document.getElementById('cfg-ttl').textContent=(id?'Editar ':'Nueva ')+titles[type];
  document.getElementById('cfg-lbl').textContent=isA?'Nombre de la cuenta':'Nombre de la categoria';
  document.getElementById('cfg-br').style.display=isA?'block':'none';
  document.getElementById('cfg-n').value='';cfgIcon='';
  if(isA)document.getElementById('cfg-b').value='';
  if(id){
    var all2=isA?accts:cats.income.concat(cats.expenses,cats.savings);
    for(var i=0;i<all2.length;i++){if(all2[i].id===id){document.getElementById('cfg-n').value=all2[i].name||'';cfgIcon=all2[i].icon||'';if(isA)document.getElementById('cfg-b').value=(all2[i].balance||0).toLocaleString('es-CO');break;}}
  }
  buildIcoGrid();
  document.getElementById('m-cfg').classList.add('open');
}

function saveCfg(){
  var name=document.getElementById('cfg-n').value.trim(),icon=cfgIcon||'@tag';
  if(!name){alert('Escribe un nombre');return;}
  pushHistory((cfgEditId?'Editar ':'Agregar ')+(cfgType==='account'?'cuenta':'categoria')+': '+name);
  if(cfgType==='account'){
    var bal=rawNum(document.getElementById('cfg-b'));
    if(cfgEditId){for(var i=0;i<accts.length;i++){if(accts[i].id===cfgEditId){accts[i].name=name;accts[i].icon=icon;accts[i].balance=bal;break;}}}
    else accts.push({id:uid(),name:name,icon:icon,balance:bal});
    ls.s('ac7',accts);
  } else {
    var key=cfgType.replace('cat-','');
    if(cfgEditId){for(var i=0;i<cats[key].length;i++){if(cats[key][i].id===cfgEditId){cats[key][i].name=name;cats[key][i].icon=icon;break;}}}
    else cats[key].push({id:uid(),name:name,icon:icon});
    ls.s('ca7',cats);
  }
  closeM('m-cfg');renderAll();syncDrive();
}

function delCfg(type,id){
  showConfirm('Eliminar elemento','Se eliminara de la lista. Puedes revertirlo desde el historial.',function(){
  pushHistory('Eliminar '+(type==='account'?'cuenta':'categoria'));
  if(type==='account')accts=accts.filter(function(a){return a.id!==id;});
  else{var k=type.replace('cat-','');cats[k]=cats[k].filter(function(c){return c.id!==id;});}
  ls.s(type==='account'?'ac7':'ca7',type==='account'?accts:cats);renderAll();syncDrive();
  });
}

function exportData(){
  var data={txs:baseTxs(),accts:accts,cats:cats,budgets:budgets,recs:recs,at:new Date().toISOString(),v:9};
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  a.download='finanzas-'+new Date().toISOString().split('T')[0]+'.json';a.click();
}
function importData(e){
  var file=e.target.files[0];if(!file)return;
  var r=new FileReader();
  r.onload=function(ev){
    try{var d=JSON.parse(ev.target.result);if(!d.txs||!d.accts)throw new Error('Formato invalido');showConfirm('Restaurar datos','Se reemplazaran todos los datos actuales.',function(){txs=(d.v>=8)?d.txs:migrateLegacy(d.txs);if(d.recs){recs=d.recs;ls.s('rc7',recs);}if(!(d.v>=9)){fixCharges(txs,recs);ls.s('rc7',recs);}accts=d.accts;cats=d.cats||DC;budgets=d.budgets||{};ls.s('tx7',txs);ls.s('ac7',accts);ls.s('ca7',cats);ls.s('bu7',budgets);renderAll();});}catch(err){alert('Error: '+err.message);}
  };r.readAsText(file);
}

function handleDrive(){if(driveCid&&driveToken)syncDrive();else if(driveCid)initGAuth();else{document.getElementById('drive-cid').value=driveCid||'';document.getElementById('m-drive').classList.add('open');}}
function saveDriveCid(){var c=document.getElementById('drive-cid').value.trim();if(!c){alert('Pega tu Client ID');return;}driveCid=c;ls.s('dc7',c);closeM('m-drive');initGAuth();}
function isMobile(){
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||window.innerWidth<768;
}

function initGAuth(){
  if(!document.getElementById('gsi-script')){
    var s=document.createElement('script');
    s.id='gsi-script';
    s.src='https://accounts.google.com/gsi/client';
    s.async=true;
    s.onload=function(){startGAuth();};
    document.head.appendChild(s);
  } else {
    startGAuth();
  }
}

function startGAuth(){
  if(!window.google){setTimeout(startGAuth,500);return;}
  if(isMobile()){
    // Mobile: use popup token client
    var tokenClient=google.accounts.oauth2.initTokenClient({
      client_id:driveCid,
      scope:'https://www.googleapis.com/auth/drive.file',
      callback:function(resp){
        if(resp.error){driveSt='er';updateDriveUI();return;}
        driveToken=resp.access_token;
        ls.s('dt7',driveToken);
        driveSt='sy';updateDriveUI();syncDrive();
      }
    });
    tokenClient.requestAccessToken({prompt:''});
  } else {
    // Desktop: use redirect flow
    var state=Math.random().toString(36).slice(2);
    ls.s('oauth_state',state);
    var params=new URLSearchParams({
      client_id:driveCid,
      redirect_uri:window.location.origin+window.location.pathname,
      response_type:'token',
      scope:'https://www.googleapis.com/auth/drive.file',
      state:state,
      include_granted_scopes:'true'
    });
    window.location.href='https://accounts.google.com/o/oauth2/v2/auth?'+params.toString();
  }
}

function checkOAuthCallback(){
  // Handle redirect flow response (desktop)
  var hash=window.location.hash;
  if(hash&&hash.indexOf('access_token')>=0){
    var params=new URLSearchParams(hash.slice(1));
    var token=params.get('access_token');
    var state=params.get('state');
    var savedState=ls.g('oauth_state','');
    if(token&&(!savedState||state===savedState)){
      window.history.replaceState({},'',window.location.pathname);
      driveToken=token;
      ls.s('dt7',token);
      driveSt='sy';updateDriveUI();
      syncDrive();
    }
  }
}
var syncPending=false,syncRunning=false,syncAgain=false;
var DRIVE_Q='https://www.googleapis.com/drive/v3/files?q=name%3D%22finanzas-david-data.json%22+and+trashed%3Dfalse&spaces=drive';
function driveFetch(url,opts){
  opts=opts||{};opts.headers=opts.headers||{};opts.headers.Authorization='Bearer '+driveToken;
  return fetch(url,opts).then(function(r){if(!r.ok)throw{status:r.status};return r;});
}
function localDoc(){return {txs:baseTxs(),accts:accts,cats:cats,budgets:budgets,recs:recs};}
// Normaliza un documento leído de Drive (formatos anteriores)
function normDoc(d){
  var t=(d.v>=8)?(d.txs||[]):migrateLegacy(d.txs),rc=d.recs||[];
  if(!(d.v>=9))fixCharges(t,rc);
  return {txs:t,accts:d.accts||DA,cats:d.cats||DC,budgets:d.budgets||{},recs:rc};
}
function applyDoc(d){
  d=JSON.parse(JSON.stringify(d));
  txs=d.txs;accts=d.accts;cats=d.cats;budgets=d.budgets;recs=d.recs;
  ls.s('tx7',txs);ls.s('ac7',accts);ls.s('ca7',cats);ls.s('bu7',budgets);ls.s('rc7',recs);
  renderAll();
}
// Fusión de 3 vías: b = última versión sincronizada, l = este dispositivo, r = Drive.
// Gana el lado que cambió; si cambiaron ambos se fusiona por id/campo (empate: local).
function sameJ(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function isObj(x){return !!x&&typeof x==='object'&&!Array.isArray(x);}
function byIdList(x){return Array.isArray(x)&&x.every(function(o){return isObj(o)&&o.id!=null;});}
function merge3(b,l,r){
  if(sameJ(l,r))return l;
  if(sameJ(l,b))return r;
  if(sameJ(r,b))return l;
  if(byIdList(l)&&byIdList(r)){
    var bm={},lm={},out=[];
    if(byIdList(b))b.forEach(function(o){bm[o.id]=o;});
    var rm={};r.forEach(function(o){rm[o.id]=o;});
    l.forEach(function(o){lm[o.id]=1;var m=merge3(bm[o.id],o,rm[o.id]);if(m!==undefined)out.push(m);});
    r.forEach(function(o){if(lm[o.id])return;var m=merge3(bm[o.id],undefined,o);if(m!==undefined)out.push(m);});
    return out;
  }
  if(isObj(l)&&isObj(r)){
    var res={},seen={},bb=isObj(b)?b:{};
    Object.keys(l).concat(Object.keys(r)).forEach(function(k){
      if(seen[k])return;seen[k]=1;var m=merge3(bb[k],l[k],r[k]);if(m!==undefined)res[k]=m;});
    return res;
  }
  return l;
}
function ensureFileId(){
  if(driveFileId)return Promise.resolve();
  return driveFetch(DRIVE_Q).then(function(r){return r.json();}).then(function(sd){
    if(sd.files&&sd.files.length>0){driveFileId=sd.files[0].id;ls.s('df7',driveFileId);}
  });
}
function createDF(data){
  var meta=new Blob([JSON.stringify({name:'finanzas-david-data.json'})],{type:'application/json'});
  var form=new FormData();form.append('metadata',meta);form.append('file',new Blob([data],{type:'application/json'}));
  return driveFetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',{method:'POST',body:form})
    .then(function(r){return r.json();}).then(function(fd){driveFileId=fd.id;ls.s('df7',driveFileId);});
}
function updateDF(data){return driveFetch('https://www.googleapis.com/upload/drive/v3/files/'+driveFileId+'?uploadType=media',{method:'PATCH',headers:{'Content-Type':'application/json'},body:new Blob([data],{type:'application/json'})});}
// Sync: primero trae Drive y fusiona, luego sube. Así un dispositivo desactualizado
// no pisa lo que guardó el otro.
function syncDrive(){
  if(!driveToken||!driveCid)return;
  if(syncRunning){syncAgain=true;return;}
  syncRunning=true;syncPending=true;driveSt='sy';updateDriveUI();
  ensureFileId().then(function(){
    if(!driveFileId)return null;
    return driveFetch('https://www.googleapis.com/drive/v3/files/'+driveFileId+'?alt=media').then(function(r){return r.json();});
  }).then(function(d){
    var loc=localDoc(),doc=loc,base=ls.g('sb7',null),baseAt=ls.g('sbat','');
    var hasRemote=!!(d&&Array.isArray(d.txs));
    if(hasRemote&&d.at===baseAt&&sameJ(loc,base))return;   // nada nuevo en ningún lado
    if(hasRemote&&d.at!==baseAt){                          // alguien más escribió en Drive
      doc=merge3(base,loc,normDoc(d));
      if(!sameJ(doc,loc))applyDoc(doc);
      doc=localDoc();
    }
    var at=new Date().toISOString(),sent=JSON.parse(JSON.stringify(doc));
    var body=JSON.stringify({txs:sent.txs,accts:sent.accts,cats:sent.cats,budgets:sent.budgets,recs:sent.recs,at:at,v:9});
    return (driveFileId?updateDF(body):createDF(body)).then(function(){ls.s('sb7',sent);ls.s('sbat',at);});
  }).then(function(){
    driveSt='ok';ls.s('dts7',new Date().toISOString());
  }).catch(function(e){
    // 401: el token (~1h) venció → pedir reconectar; los cambios quedan guardados en el celular
    if(e&&e.status===401){driveToken='';ls.s('dt7','');}
    else if(e&&e.status===404){driveFileId='';ls.s('df7','');syncAgain=true;}
    driveSt='er';
  }).then(function(){
    syncRunning=false;syncPending=false;updateDriveUI();
    if(syncAgain&&driveToken){syncAgain=false;syncDrive();}
  });
}

function updateDriveUI(){
  var cb=document.getElementById('dbtn-cancel');if(cb)cb.style.display=(driveSt==='sy')?'inline':'none';
  var dot=document.getElementById('ddot'),txt=document.getElementById('dtxt'),btn=document.getElementById('dbtn');
  var sn=document.getElementById('s-drn'),ss=document.getElementById('s-drs'),sb=document.getElementById('s-drb');
  if(!dot)return;
  if(driveSt==='ok'){dot.className='ddot ok';var ts=ls.g('dts7','');txt.textContent='Sincronizado'+(ts?' · '+new Date(ts).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'}):'');if(btn)btn.textContent='Sync';if(sn)sn.textContent='Google Drive conectado';if(ss)ss.textContent='Datos seguros en la nube';if(sb)sb.textContent='Sync';}
  else if(driveSt==='sy'){dot.className='ddot sy';txt.textContent='Guardando...';if(btn)btn.textContent='...';}
  else if(driveSt==='er'){dot.className='ddot er';txt.textContent='Error Drive';if(btn)btn.textContent='Reconectar';if(sn)sn.textContent='Error';if(sb)sb.textContent='Reconectar';}
  else{dot.className='ddot';txt.textContent='Sin sincronizacion';if(btn)btn.textContent='Conectar Drive';if(sn)sn.textContent='Sin conexion';if(ss)ss.textContent='Datos solo en este celular';if(sb)sb.textContent='Conectar';}
}

function cancelDrive(){
  driveSt='off';
  driveToken='';driveFileId='';
  ls.s('dt7','');ls.s('df7','');
  updateDriveUI();
}



function closeM(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('.mback').forEach(function(m){m.addEventListener('click',function(e){if(e.target===m)m.classList.remove('open');});});

setTheme(theme);populateCatSel();populateAcSel();

// Warn user if sync is still pending when closing
window.addEventListener('beforeunload',function(e){
  if(syncPending){
    e.preventDefault();
    e.returnValue='Hay cambios que aún se están guardando en Drive. ¿Seguro que quieres salir?';
    return e.returnValue;
  }
});
if(!ls.g('mg9',false)){fixCharges(txs,recs);ls.s('tx7',txs);ls.s('rc7',recs);ls.s('mg9',true);}
hydrateIcons();
checkOAuthCallback();
renderAll();
// Al abrir: traer cambios de otros dispositivos y fusionarlos con los locales
if(driveToken){setTimeout(syncDrive,500);}

// Atajo "Nuevo movimiento" (mantener presionado el ícono de la app): abre el formulario
if(/[?&]nuevo=1/.test(window.location.search)){
  window.history.replaceState({},'',window.location.pathname);
  openTx(null);
}

// Tocar la versión en Ajustes: busca una versión nueva y recarga
function checkUpdate(){
  var av=document.getElementById('app-version');if(av)av.textContent='Buscando actualización…';
  var done=function(){location.reload();};
  if('serviceWorker' in navigator)navigator.serviceWorker.getRegistration().then(function(r){return r&&r.update();}).then(done,done);
  else done();
}

// App instalable: service worker para abrir sin internet y recibir actualizaciones
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){
  window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});
}
