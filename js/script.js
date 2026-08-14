// --- 1. VERİ TANIMLAMALARI (Blueprint Koordinatları) ---
const bolgeler = [
    { isim: "HALLE 2 MAKİNELERİ (ÜST VE ORTA BÖLGE)", x: 100, y: 100, w: 900, h: 500 },
    { isim: "HALLE 1 MAKİNELERİ", x: 1100, y: 100, w: 700, h: 400 },
    { isim: "BEREICH 1700 MAKİNELERİ", x: 100, y: 700, w: 600, h: 300 },
    { isim: "KAYNAK NOKTASI: SILO FARM", x: 800, y: 700, w: 1000, h: 300 }
];

const makinalar = [
    // Halle 2
    { id: "m_650_2", isim: "650-2", x: 150, y: 150 }, { id: "m_400_2", isim: "400-2", x: 350, y: 150 }, { id: "m_800_1", isim: "800-1", x: 550, y: 150 }, { id: "m_900_1", isim: "900-1", x: 750, y: 150 },
    { id: "m_800_4", isim: "800-4", x: 150, y: 300 }, { id: "m_850_4", isim: "850-4", x: 350, y: 300 }, { id: "m_1000_3", isim: "1000-3", x: 550, y: 300 }, { id: "m_400_3", isim: "400-3", x: 750, y: 300 },
    { id: "m_1450_1", isim: "1450-1", x: 150, y: 450 }, { id: "m_125_1", isim: "125-1", x: 350, y: 450 }, { id: "m_1100_1", isim: "1100-1", x: 550, y: 450 },
    // Halle 1
    { id: "m_600_7", isim: "600-7", x: 1150, y: 150 }, { id: "m_850_2", isim: "850-2", x: 1350, y: 150 }, { id: "m_500_6", isim: "500-6", x: 1550, y: 150 },
    { id: "m_650_8", isim: "650-8", x: 1150, y: 350 }, { id: "m_600_4", isim: "600-4", x: 1350, y: 350 }, { id: "m_500_9", isim: "500-9", x: 1550, y: 350 },
    // Bereich 1700
    { id: "m_1600_03", isim: "1600-03", x: 150, y: 750 }, { id: "m_1000_4", isim: "1000-4", x: 350, y: 750 }, { id: "m_1700_02", isim: "1700-02", x: 550, y: 750 }
];

const zentraller = [
    { id: "z_1", isim: "Zentrale 1", x: 800, y: 550 },
    { id: "z_2", isim: "Zentrale 2", x: 950, y: 550 }
];

let silolar = [];
for (let i = 1; i <= 14; i++) {
    silolar.push({ id: `silo_${i}`, isim: `Silo ${i}`, x: 850 + ((i-1) * 65), y: 750 });
}

// Global Bağlantılar (Test için manuel birkaç hat ekliyoruz)
let baglantilar = [
    { kaynak: "silo_1", hedef: "z_1", renk: "kablo-gri" },
    { kaynak: "z_1", hedef: "m_600_7", renk: "kablo-mavi" },
    { kaynak: "z_2", hedef: "m_650_2", renk: "kablo-yesil" },
    { kaynak: "z_1", hedef: "m_1600_03", renk: "kablo-turuncu" }
];

// --- 2. ÇİZİM FONKSİYONLARI ---
function initSahne() {
    const kapsayici = document.getElementById('cihazlar-kapsayici');
    const bolgeKapsayici = document.getElementById('bolgeler-kapsayici');
    
    // 1. Bölge Çerçevelerini Çiz
    bolgeler.forEach(b => {
        bolgeKapsayici.innerHTML += `
            <div class="bolge-cerceve" style="left:${b.x}px; top:${b.y}px; width:${b.w}px; height:${b.h}px;">
                <div class="bolge-baslik">${b.isim}</div>
            </div>`;
    });

    // 2. Siloları Çiz
    silolar.forEach(s => {
        kapsayici.innerHTML += `
            <div class="kutu kutu-silo" id="${s.id}" style="left:${s.x}px; top:${s.y}px;">
                <div class="kutu-baslik">${s.isim}</div>
                <div class="node-out"></div>
            </div>`;
    });

    // 3. Zentrale'leri Çiz
    zentraller.forEach(z => {
        kapsayici.innerHTML += `
            <div class="kutu kutu-zentrale" id="${z.id}" style="left:${z.x}px; top:${z.y}px;">
                <div class="node-in"></div>
                <div class="kutu-baslik">${z.isim}</div>
                <div style="font-size:30px;">🎛️</div>
                <div class="node-out"></div>
            </div>`;
    });

    // 4. Makineleri Çiz
    makinalar.forEach(m => {
        kapsayici.innerHTML += `
            <div class="kutu" id="${m.id}" style="left:${m.x}px; top:${m.y}px;">
                <div class="node-in"></div>
                <div class="kutu-baslik">${m.isim}</div>
                <div style="font-size:24px;">⚙️</div>
            </div>`;
    });

    SVGKablolariCiz();
}

function SVGKablolariCiz() {
    const svg = document.getElementById('cizim-alani');
    svg.innerHTML = "";
    
    baglantilar.forEach(bag => {
        const kKutu = document.getElementById(bag.kaynak);
        const hKutu = document.getElementById(bag.hedef);
        if(!kKutu || !hKutu) return;

        // Node koordinatlarını bul (Kutunun pozisyonuna göre offset)
        const kOut = kKutu.querySelector('.node-out');
        const hIn = hKutu.querySelector('.node-in');
        
        if(kOut && hIn) {
            const startX = parseInt(kKutu.style.left) + kOut.offsetLeft + 12;
            const startY = parseInt(kKutu.style.top) + kOut.offsetTop + 12;
            const endX = parseInt(hKutu.style.left) + hIn.offsetLeft + 12;
            const endY = parseInt(hKutu.style.top) + hIn.offsetTop + 12;
            
            // Köşeli Blueprint Hattı Çizimi (Orthogonal Routing)
            const midX = startX + (endX - startX) / 2;
            const d = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
            
            svg.innerHTML += `<path class="svg-kablo ${bag.renk}" d="${d}"></path>`;
        }
    });
}

// --- 3. PAN VE ZOOM (Optimizasyonlu) ---
const sahne = document.getElementById('sahne');
let scale = 0.8, panX = 100, panY = 50;
let isPanning = false, startX, startY, startPanX, startPanY;
let konumlarKilitli = true;

function guncelleSahne() {
    sahne.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    document.getElementById('zoom-seviyesi').innerText = Math.round(scale * 100) + '%';
}

document.getElementById('btn-zoom-in').onclick = () => { scale = Math.min(scale + 0.2, 2); guncelleSahne(); };
document.getElementById('btn-zoom-out').onclick = () => { scale = Math.max(scale - 0.2, 0.3); guncelleSahne(); };

document.addEventListener('mousedown', (e) => {
    if(e.target.closest('#kontrol-paneli')) return;
    if(e.target.closest('.node-out') || e.target.closest('.node-in')) return; // Bağlantı tıklaması
    
    if(konumlarKilitli || !e.target.closest('.kutu')) {
        isPanning = true; startX = e.clientX; startY = e.clientY;
        startPanX = panX; startPanY = panY;
    }
});

document.addEventListener('mousemove', (e) => {
    if (isPanning) {
        panX = startPanX + (e.clientX - startX);
        panY = startPanY + (e.clientY - startY);
        guncelleSahne(); // Sadece sürüklerken render alır (Pil Dostu)
    }
});

document.addEventListener('mouseup', () => { isPanning = false; });

document.getElementById('btn-kilitle').onclick = function() {
    konumlarKilitli = !konumlarKilitli;
    this.className = konumlarKilitli ? "kilit-kapali" : "kilit-acik";
    this.innerText = konumlarKilitli ? "🔒 Konumlar Kilitli" : "🔓 Konumlar Serbest";
};

// Başlangıç
initSahne();
guncelleSahne();
