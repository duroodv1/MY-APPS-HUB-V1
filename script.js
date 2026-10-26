const apps = [
  {name:"JOM BIJAK PPKI V.1",category:"Pendidikan",desc:"Aktiviti pembelajaran mesra murid PPKI.",url:"https://duroodv1.github.io/JomBijakPPKI-V1/",icon:"JB",kind:"web"},
  {name:"BIJAK BAHASA PPKI V.1",category:"Pendidikan",desc:"Latihan Bahasa Melayu dan Bahasa Inggeris.",url:"https://duroodv1.github.io/BIJAK-BAHASA-PPKI-V.1/",icon:"BB",kind:"web"},
  {name:"MINDAKU V.1",category:"Pendidikan",desc:"Permainan pendidikan untuk belajar sambil bermain.",url:"https://duroodv1.github.io/MINDAKU-V1/",icon:"M",kind:"web"},
  {name:"CILIKVERSE V.1",category:"Pendidikan",desc:"Ruang penerokaan dan pembelajaran kanak-kanak.",url:"https://duroodv1.github.io/CILIKVERSE-V1/",icon:"CV",kind:"web"},
  {name:"Adventures Coloring Studio",category:"Pendidikan",desc:"Aktiviti mewarna dan kreativiti.",url:"https://duroodv1.github.io/Adventures-Coloring-V.1/",icon:"✎",kind:"web"},
  {name:"Jom Matematik PPKI",category:"Pendidikan",desc:"Aktiviti asas matematik untuk murid PPKI.",url:"https://duroodv1.github.io/JomMatematikPPKI/",icon:"+",kind:"web"},
  {name:"JOM FAHAM FARDU AIN V.1",category:"Pendidikan",desc:"Pembelajaran asas Fardu Ain.",url:"https://duroodv1.github.io/Jom-faham-fardu-ain-V.1/",icon:"✦",kind:"web"},
  {name:"CIKGU-AI-JUNIOR-V1",category:"Pendidikan",desc:"Konsep tutor AI dengan penerangan mudah dan contoh langkah demi langkah.",url:"https://duroodv1.github.io/CIKGU-AI-JUNIOR-V1/",icon:"AI",kind:"web",note:"Sesetengah fungsi AI mungkin memerlukan internet."},
  {name:"BizFinPro V.1",category:"Perniagaan",desc:"Alat kewangan dan analisis untuk membantu perancangan perniagaan.",url:"https://duroodv1.github.io/BizFinPro-V1/",icon:"BF",kind:"offline",request:true},
  {name:"BizFlow V.1",category:"Perniagaan",desc:"Pengurusan aliran kerja perniagaan.",icon:"BF",kind:"offline",request:true},
  {name:"BizStock V.1",category:"Perniagaan",desc:"Pengurusan stok dan inventori perniagaan.",icon:"BS",kind:"offline",request:true},
  {name:"MyKariah V.1",category:"Pengurusan Kariah",desc:"Pengurusan ahli kariah, khairat kematian, rekod bayaran dan laporan kewangan.",icon:"MK",kind:"offline",request:true}
];
const grids = {
  "Pendidikan": document.getElementById("educationGrid"),
  "Perniagaan": document.getElementById("businessGrid"),
  "Pengurusan Kariah": document.getElementById("kariahGrid")
};
let activeFilter = "Semua";
const email = "duroodv1@gmail.com";
function mailLink(appName){
  const subject = `Permohonan Fail Pemasangan ${appName} - Offline / Standalone`;
  const body = `Salam sejahtera,\n\nSaya ingin memohon fail pemasangan aplikasi ${appName} dalam versi Offline / Standalone.\n\nMohon pihak tuan/puan memberikan pautan muat turun atau maklumat untuk mendapatkan fail pemasangan.\n\nTerima kasih.`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
function makeCard(app){
  const card = document.createElement("article");
  card.className = `app-card ${app.category==="Perniagaan"?"business":app.category==="Pengurusan Kariah"?"kariah":""}`;
  card.dataset.name = app.name.toLowerCase();
  card.dataset.category = app.category;
  const pill = app.kind==="offline" ? '<span class="pill">OFFLINE / STANDALONE</span>' : '<span class="pill web">WEB APP</span>';
  let actions = "";
  if(app.url){
    actions += `<a class="btn btn-primary" href="${app.url}" target="_blank" rel="noopener noreferrer">Buka Aplikasi <span aria-hidden="true">↗</span></a>`;
    if(app.request) actions += `<a class="secondary-link" href="${mailLink(app.name)}">Minta Muat Turun Melalui E-mel</a>`;
  } else {
    actions += `<a class="btn btn-primary" href="${mailLink(app.name)}">Minta Muat Turun Melalui E-mel <span aria-hidden="true">↗</span></a>`;
  }
  card.innerHTML = `<div class="card-top"><div class="app-icon" aria-hidden="true">${app.icon}</div>${pill}</div><h4>${app.name}</h4><p>${app.desc}${app.note?` ${app.note}`:""}</p><div class="card-actions">${actions}</div>`;
  return card;
}
Object.values(grids).forEach(g=>g.replaceChildren());
apps.forEach(app=>grids[app.category].appendChild(makeCard(app)));
const searchInput = document.getElementById("searchInput");
function filterApps(){
  const q = searchInput.value.trim().toLowerCase();
  let shown = 0;
  document.querySelectorAll(".app-card").forEach(card=>{
    const match = (activeFilter==="Semua"||card.dataset.category===activeFilter) && card.dataset.name.includes(q);
    card.hidden = !match;
    if(match) shown++;
  });
  document.querySelectorAll(".category-title").forEach(title=>{
    const grid = title.nextElementSibling;
    const category = grid?.querySelector(".app-card")?.dataset.category;
    const any = grid && [...grid.querySelectorAll(".app-card")].some(c=>!c.hidden);
    title.hidden = !any || (activeFilter!=="Semua" && category!==activeFilter);
    if(grid) grid.hidden = !any || (activeFilter!=="Semua" && category!==activeFilter);
  });
  document.getElementById("emptyState").hidden = shown>0;
}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  activeFilter=btn.dataset.filter;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));
  filterApps();
}));
searchInput.addEventListener("input",filterApps);
document.getElementById("year").textContent = new Date().getFullYear();
let installPrompt;
const installBtn = document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault(); installPrompt=event; installBtn.hidden=false;
});
installBtn.addEventListener("click",async()=>{
  if(!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt=null; installBtn.hidden=true;
});
if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
filterApps();
