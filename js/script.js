// [BAŞLANGIÇ: Harita Koordinat Sistemi (JS)]
function koordinatlariYerlestir() {
    // Haritadaki tüm cihazları bul
    const cihazlar = document.querySelectorAll('.cihaz');
    
    cihazlar.forEach(cihaz => {
        // Cihazın HTML'ine yazdığımız 'A1', 'B2' bilgisini al
        const koordinat = cihaz.getAttribute('data-koordinat');
        
        if (koordinat && koordinat.length >= 2) {
            // A1 -> 'A' sütun, '1' satır
            const sutunHarf = koordinat.charAt(0).toUpperCase(); 
            const satirRakam = koordinat.substring(1); 
            
            // Bilgisayarın A, B, C harflerini 1, 2, 3 rakamlarına çevirmesi lazım
            // 'A' harfinin karakter kodu 65'tir. Bundan 64 çıkarırsak 1 elde ederiz.
            const sutunNumarasi = sutunHarf.charCodeAt(0) - 64; 
            
            // CSS Grid'e emri ver: "Bu cihazı şu satır ve sütuna oturt!"
            cihaz.style.gridColumn = sutunNumarasi;
            cihaz.style.gridRow = satirRakam;
        }
    });
}

// Sayfa ilk açıldığında yerleştirme fonksiyonunu çalıştır
document.addEventListener('DOMContentLoaded', koordinatlariYerlestir);
// [BİTİŞ: Harita Koordinat Sistemi (JS)]
