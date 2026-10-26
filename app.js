let globalSupplies = [
    {
        id: "sup-1",
        title: "Cordless Power Drill Set",
        description: "Complete drill Set with masonry bits. Available for borrowing for weekend household repairs.",
        category: "Tools",
        donor: "Michael Chen",
        phone: "+1 555-0143",
        email: "m.chena@gmail.com",
        imgUrl: "https://avatars.mds.yandex.net/i?id=2744dc82b0494a7e31adee65b6b0949978eb72ae-5869150-images-thumbs&n=13",
        urgency: "Low",
        createdAt: Date.now() - (15 * 60 * 1000),
        expiresInMinutes: 120,
        isClaimed: false
    },
    {
        id: "sup-2",
        title: "Fresh Organic Bakery Bread",
        description: "Surplus sourdough bread baked this morning. Free to pick up",
        category: "Food",
        donor: "Clara Rossi",
        phone: "+1 555-0188",
        email: "mde.cLara@gmail.com",
        imgUrl: "https://plus.unsplash.com/premium_photo-1664640733898-d5c3f71f44e1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        urgency: "High",
        createdAt: Date.now() - (80 * 60 * 1000),
        expiresInMinutes: 90,
        isClaimed: false
    },
    {
        id: "sup-3",
        title: "Digital Blood Pressure Monitor",
        description: "Digital arm monitor. Great for elderly neighborhood checkups.",
        category: "Medical",
        donor: "Dr. Omar V.",
        phone: "+1 555-0122",
        email: "dr.omar@gmail.com",
        imgUrl: "https://avatars.mds.yandex.net/i?id=282f17ff865c7ba65ac7c70e698776d5409a4d6b-12938945-images-thumbs&n=13",
        urgency: "Medium",
        createdAt: Date.now() - (115 * 60 * 1000),
        expiresInMinutes: 120,
        isClaimed: true
    }
];

// 2. RENDER FONKSİYONU: `gloabalSupplies` ve `escapeHTML` fonksiyon adlarındaki yazım hataları düzeltildi.
function renderCards() {
    const container = document.getElementById('suppliesContainer');
    const counterElement = document.getElementById('activeCount');

    if (!container) return;
    container.innerHTML = '';

    // Aktif kart sayısını hesaplama
    const activeCount = globalSupplies.filter(item => {
        const elapsedMinutes = Math.floor((Date.now() - item.createdAt) / (1000 * 60));
        return !item.isClaimed && elapsedMinutes < item.expiresInMinutes;
    }).length;

    if (counterElement) {
        counterElement.textContent = activeCount;
    }

    // Boş liste kontrolü (gloabalSupplies -> globalSupplies yapıldı)
    if (globalSupplies.length === 0) {
        container.innerHTML = `
        <div class="empty-state">
        No active items available. Use the form to publish supply!
        </div>
        `;
        return;
    }

    globalSupplies.forEach(item => {
        const elapsedMinutes = Math.floor((Date.now() - item.createdAt) / (1000 * 60));
        const remainingMinutes = item.expiresInMinutes - elapsedMinutes;
        const isExpired = remainingMinutes <= 0;

        let urgencyClass = 'urgency-medium';
        if (item.urgency === 'Low') urgencyClass = 'urgency-low';
        if (item.urgency === 'High') urgencyClass = 'urgency-high';

        const defaultImage = "https://image.com";
        const displayImg = item.imgUrl && item.imgUrl.trim() !== "" ? item.imgUrl : defaultImage;

        let buttonText = item.isClaimed ? "Cancel reservation" : "Reserve Item";
        if (isExpired) buttonText = "Expired";

        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${item.isClaimed ? 'claimed' : ''} ${isExpired ? 'expired' : ''}`;

        // HTML'deki dırnaq işarəsi səhvi ("time-left>) və escape funksiya adları düzəldildi
        cardDiv.innerHTML = `
        <div class="card-img-wrapper">
            <img src="${displayImg}" alt="${escape(item.title)}" class="card-img" onerror="this.src='${defaultImage}'">
            <span class="urgency-badge ${urgencyClass}">${item.urgency} Urgency</span>
            <span class="category-badge">${item.category}</span>
        </div>

        <div class="card-content"> 
            <h3 class="card-title">${escape(item.title)}</h3>
            <p class="card-desc">${escape(item.description)}</p>
            <div class="card-donor-info">
                Donor: <strong>${escape(item.donor)}</strong>
                <div class="card-contact">
                    <span>📞 ${escape(item.phone)}</span>
                    <span>📧 ${escape(item.email)}</span>
                </div>
            </div>

            <div class="card-footer">
                <div class="time-left">⏰ ${isExpired ? 'Time Expired' : `${remainingMinutes} mins left`}</div>
                <button class="btn-reserve ${item.isClaimed ? 'claimed-btn' : ''}"
                        onclick="toggleClaim('${item.id}')"
                        ${isExpired ? 'disabled' : ''}>
                    ${buttonText}
                </button>
            </div>
        </div>
        `;

        container.appendChild(cardDiv);
    });
}

// 3. YENİ ELAN EKLEME: Sabit metinler yerine formdan gelen değişkenler atandı. `createdAt` eklendi.
function addNewSupply(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const urgency = document.getElementById('urgency').value;
    const donor = document.getElementById('donor').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const imageUrl = document.getElementById('imgUrl').value;

    const newSupply = {
        id: "sup-" + Date.now(),
        title: title,
        description: description,
        category: category,
        urgency: urgency,
        donor: donor,
        phone: phone,
        email: email,       // "email" yazısı düzeltildi
        imgUrl: imageUrl,   // "imgUrl" yazısı düzeltildi
        createdAt: Date.now(), // Eksik olan oluşturulma tarihi eklendi
        expiresInMinutes: 120,
        isClaimed: false
    };

    globalSupplies.unshift(newSupply);
    renderCards();

    document.getElementById('supplyForm').reset();
}

// 4. REZERVASYON FONKSİYONU: `isClamied` -> `isClaimed` olarak düzeltildi.
function toggleClaim(id) {
    const supply = globalSupplies.find(item => item.id === id);
    if (supply) {
        supply.isClaimed = !supply.isClaimed;
        renderCards();
    }
}

// Her 10 saniyede bir kalan süreyi güncellemek için ekranı yeniler
setInterval(() => {
    renderCards();
}, 10000);

// Güvenlik için HTML Karakter Temizleme Fonksiyonu
function escape(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Sayfa yüklendiğinde tetiklenen ana dinleyici
window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('supplyForm');
    if (form) {
        form.addEventListener('submit', addNewSupply);
    }
    renderCards();
});
