document.addEventListener('DOMContentLoaded', () => {

    // --- SEASONAL CONTROL ---
    const IS_RAMADAN = true; // Set to false to disable Bukber features

    const bukberPromoSection = document.getElementById('bukber-promo');
    if (IS_RAMADAN) {
        bukberPromoSection.style.display = 'block';
    } else {
        bukberPromoSection.style.display = 'none';
    }

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- DAILY MENU (PROMO VIEW) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const dailyMenuItems = document.querySelectorAll('#menu .menu-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            dailyMenuItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.animation = 'none';
                    item.offsetHeight;
                    item.style.animation = 'fadeInUp 0.5s forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- HELPER: FORMAT RP ---
    function formatRp(number) {
        return 'Rp ' + number.toLocaleString('id-ID');
    }

    // =========================================
    // --- DAILY ORDER SYSTEM LOGIC ---
    // =========================================
    const dailyCtaBtn = document.getElementById('ctaBtn');
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    const orderSection = document.getElementById('orderSection');
    const orderTableBody = document.getElementById('orderTableBody');
    const grandTotalElem = document.getElementById('grandTotal');
    const sendOrderBtn = document.getElementById('sendOrderBtn');
    const dailyCustomerNameInput = document.getElementById('dailyCustomerName');

    const dailyMenuData = [];
    dailyMenuItems.forEach(item => {
        const name = item.getAttribute('data-name');
        const price = parseInt(item.getAttribute('data-price'));
        const img = item.querySelector('img').src;
        dailyMenuData.push({ name, price, img });
    });

    // Toggle Daily Order View
    dailyCtaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        orderSection.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    backToMenuBtn.addEventListener('click', () => {
        orderSection.classList.remove('active');
        document.body.style.overflow = 'auto';
    });


    // Init Daily Table
    function initDailyTable() {
        orderTableBody.innerHTML = '';
        dailyMenuData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="menu-cell">
                        <img src="${item.img}" alt="${item.name}">
                        <span class="menu-name">${item.name}</span>
                    </div>
                </td>
                <td>${formatRp(item.price)}</td>
                <td>
                    <input type="number" min="0" value="0" class="input-qty daily-qty" data-index="${index}">
                </td>
                <td class="row-total" id="daily-total-${index}">Rp 0</td>
            `;
            orderTableBody.appendChild(row);
        });

        document.querySelectorAll('.daily-qty').forEach(input => {
            input.addEventListener('input', calculateDailyTotal);
        });
    }

    function calculateDailyTotal() {
        let grandTotal = 0;
        const inputs = document.querySelectorAll('.daily-qty');
        inputs.forEach(input => {
            const index = input.dataset.index;
            const qty = parseInt(input.value) || 0;
            const price = dailyMenuData[index].price;
            const rowTotal = qty * price;
            document.getElementById(`daily-total-${index}`).innerText = formatRp(rowTotal);
            grandTotal += rowTotal;
        });
        grandTotalElem.innerText = formatRp(grandTotal);
        return grandTotal;
    }

    sendOrderBtn.addEventListener('click', () => {
        const name = dailyCustomerNameInput.value.trim();
        if (!name) {
            alert('Mohon isi Nama Pemesan terlebih dahulu!');
            dailyCustomerNameInput.focus();
            return;
        }

        const inputs = document.querySelectorAll('.daily-qty');
        let hasOrder = false;
        let message = `Halo Dapur Bajang, saya ingin pesan Menu Harian:\n`;
        message += `Nama: ${name}\n\n`;
        let grandTotal = 0;

        inputs.forEach(input => {
            const qty = parseInt(input.value) || 0;
            if (qty > 0) {
                hasOrder = true;
                const index = input.dataset.index;
                const item = dailyMenuData[index];
                const subtotal = item.price * qty;
                grandTotal += subtotal;
                message += `- ${item.name} (${qty}x) - ${formatRp(subtotal)}\n`;
            }
        });

        if (!hasOrder) {
            alert('Silakan pilih menu terlebih dahulu!');
            return;
        }

        const serviceType = document.querySelector('input[name="serviceType"]:checked').value;

        message += `\n*Total Akhir: ${formatRp(grandTotal)}*`;
        message += `\nLayanan: ${serviceType}`;
        message += `\n\nMohon diproses, terima kasih!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/6281934577712?text=${encodedMessage}`, '_blank');
    });


    // =========================================
    // --- BUKBER ORDER SYSTEM LOGIC ---
    // =========================================
    if (IS_RAMADAN) {
        const bukberCtaBtn = document.getElementById('bukberCtaBtn');
        const backToBukberMenuBtn = document.getElementById('backToBukberMenuBtn');
        const bukberOrderSection = document.getElementById('bukberOrderSection');
        const bukberOrderTableBody = document.getElementById('bukberOrderTableBody');
        const bukberGrandTotalElem = document.getElementById('bukberGrandTotal');
        const sendBukberOrderBtn = document.getElementById('sendBukberOrderBtn');
        const bukberCustomerNameInput = document.getElementById('bukberCustomerName');
        const bukberItems = document.querySelectorAll('.bukber-item');

        const bukberData = [];
        bukberItems.forEach(item => {
            const name = item.getAttribute('data-name');
            const price = parseInt(item.getAttribute('data-price'));
            const img = item.querySelector('img').src;
            bukberData.push({ name, price, img });
        });

        bukberCtaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bukberOrderSection.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        backToBukberMenuBtn.addEventListener('click', () => {
            bukberOrderSection.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        function initBukberTable() {
            bukberOrderTableBody.innerHTML = '';
            bukberData.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="menu-cell">
                            <img src="${item.img}" alt="${item.name}">
                            <span class="menu-name">${item.name}</span>
                        </div>
                    </td>
                    <td>${formatRp(item.price)}</td>
                    <td>
                        <input type="number" min="0" value="0" class="input-qty bukber-qty" data-index="${index}">
                    </td>
                    <td class="row-total" id="bukber-total-${index}">Rp 0</td>
                `;
                bukberOrderTableBody.appendChild(row);
            });

            document.querySelectorAll('.bukber-qty').forEach(input => {
                input.addEventListener('input', calculateBukberTotal);
            });
        }

        function calculateBukberTotal() {
            let grandTotal = 0;
            const inputs = document.querySelectorAll('.bukber-qty');
            inputs.forEach(input => {
                const index = input.dataset.index;
                const qty = parseInt(input.value) || 0;
                const price = bukberData[index].price;
                const rowTotal = qty * price;
                document.getElementById(`bukber-total-${index}`).innerText = formatRp(rowTotal);
                grandTotal += rowTotal;
            });
            bukberGrandTotalElem.innerText = formatRp(grandTotal);
        }

        sendBukberOrderBtn.addEventListener('click', () => {
            const name = bukberCustomerNameInput.value.trim();
            if (!name) {
                alert('Mohon isi Nama Pemesan terlebih dahulu!');
                bukberCustomerNameInput.focus();
                return;
            }

            const inputs = document.querySelectorAll('.bukber-qty');
            let hasOrder = false;
            let message = `Halo Dapur Bajang, saya ingin pesan *Paket Bukber*:\n`;
            message += `Nama: ${name}\n\n`;
            let grandTotal = 0;

            inputs.forEach(input => {
                const qty = parseInt(input.value) || 0;
                if (qty > 0) {
                    hasOrder = true;
                    const index = input.dataset.index;
                    const item = bukberData[index];
                    const subtotal = item.price * qty;
                    grandTotal += subtotal;
                    message += `- ${item.name} (${qty}x) - ${formatRp(subtotal)}\n`;
                }
            });

            if (!hasOrder) {
                alert('Silakan pilih paket terlebih dahulu!');
                return;
            }

            // Get Service Type
            const serviceType = document.querySelector('input[name="bukberServiceType"]:checked').value;

            message += `\n*Total Akhir: ${formatRp(grandTotal)}*`;
            message += `\nLayanan: ${serviceType}`;
            message += `\n\nMohon disiapkan untuk berbuka, terima kasih!`;

            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/6281934577712?text=${encodedMessage}`, '_blank');
        });

        initBukberTable();
    }

    // Init Daily
    initDailyTable();

    // --- Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.about-text, .about-img').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

});
