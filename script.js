// Cấu hình mật khẩu - BẠN CÓ THỂ THAY ĐỔI PHẦN NÀY
const CORRECT_PASSWORD = "1268"; // Thay đổi mật khẩu 4 số ở đây

// Lấy các elements
const passwordScreen = document.getElementById('passwordScreen');
const mainScreen = document.getElementById('mainScreen');
const passwordInputs = document.querySelectorAll('.password-digit');
const errorMessage = document.getElementById('errorMessage');
const errorSound = document.getElementById('errorSound');
const bgMusic = document.getElementById('bgMusic');
const muteButton = document.getElementById('muteButton');

let isMuted = false;

// Xử lý nhập mật khẩu
passwordInputs.forEach((input, index) => {
    // Tự động chuyển sang ô tiếp theo
    input.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Chỉ cho phép nhập số
        if (!/^\d*$/.test(value)) {
            e.target.value = '';
            return;
        }
        
        if (value.length === 1 && index < passwordInputs.length - 1) {
            passwordInputs[index + 1].focus();
        }
        
        // Kiểm tra mật khẩu khi nhập đủ 4 số
        if (index === passwordInputs.length - 1 && value.length === 1) {
            setTimeout(checkPassword, 300);
        }
    });
    
    // Xử lý phím Backspace
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            passwordInputs[index - 1].focus();
        }
    });
    
    // Ngăn paste
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');
        if (/^\d{4}$/.test(pasteData)) {
            pasteData.split('').forEach((char, i) => {
                if (passwordInputs[i]) {
                    passwordInputs[i].value = char;
                }
            });
            passwordInputs[3].focus();
            setTimeout(checkPassword, 300);
        }
    });
});

// Focus vào ô đầu tiên khi load trang
window.addEventListener('load', () => {
    passwordInputs[0].focus();
});

// Kiểm tra mật khẩu
function checkPassword() {
    let enteredPassword = '';
    passwordInputs.forEach(input => {
        enteredPassword += input.value;
    });
    
    if (enteredPassword.length !== 4) {
        return;
    }
    
    if (enteredPassword === CORRECT_PASSWORD) {
        // Mật khẩu đúng
        errorMessage.classList.add('hidden');
        
        // Thêm hiệu ứng thành công cho các ô nhập
        passwordInputs.forEach((input, index) => {
            setTimeout(() => {
                input.classList.add('success');
            }, index * 100);
        });
        
        // Thêm hiệu ứng glow cho container
        document.querySelector('.password-container').classList.add('success');
        
        // Tạo hiệu ứng trái tim bùng nổ
        createSuccessExplosion();
        
        // Đợi hiệu ứng xong rồi mới chuyển trang
        setTimeout(() => {
            passwordScreen.classList.add('fade-out');
            
            setTimeout(() => {
                passwordScreen.style.display = 'none';
                mainScreen.classList.remove('hidden');
                
                // Phát nhạc nền
                bgMusic.play().catch(err => {
                    console.log('Không thể tự động phát nhạc:', err);
                });
                
                // Tạo hiệu ứng
                createHearts();
                createStars();
            }, 800);
        }, 1500);
    } else {
        // Mật khẩu sai
        errorMessage.classList.remove('hidden');
        
        // Phát âm thanh lỗi
        errorSound.currentTime = 0;
        errorSound.play().catch(err => {
            console.log('Không thể phát âm thanh lỗi:', err);
        });
        
        // Hiệu ứng lắc
        passwordInputs.forEach(input => {
            input.classList.add('shake');
            input.value = '';
        });
        
        setTimeout(() => {
            passwordInputs.forEach(input => {
                input.classList.remove('shake');
            });
            passwordInputs[0].focus();
        }, 500);
        
        // Ẩn thông báo lỗi sau 3 giây
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 3000);
    }
}

// Xử lý nút mute
muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    muteButton.classList.toggle('muted');
    
    // Thay đổi icon
    const soundIcon = document.getElementById('soundIcon');
    if (isMuted) {
        soundIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    } else {
        soundIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }
});

// Tạo hiệu ứng trái tim rơi
function createHearts() {
    const heartsContainer = document.querySelector('.hearts-container');
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        
        heartsContainer.appendChild(heart);
        
        // Xóa trái tim sau khi animation kết thúc
        setTimeout(() => {
            heart.remove();
        }, 7000);
    }, 800);
}

// Tạo hiệu ứng ngôi sao lấp lánh
function createStars() {
    const starsContainer = document.querySelector('.stars-container');
    
    // Tạo 50 ngôi sao
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        
        starsContainer.appendChild(star);
    }
}

// Tạo hiệu ứng bùng nổ trái tim khi thành công
function createSuccessExplosion() {
    const container = document.createElement('div');
    container.className = 'success-hearts';
    document.body.appendChild(container);
    
    const heartEmojis = ['💙', '💗', '💖', '💕', '💓', '💝', '💘', '✨', '⭐', '💫'];
    const colors = ['#4169e1', '#87ceeb', '#6495ed', '#1e90ff', '#00bfff'];
    
    // Lấy vị trí giữa màn hình
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Tạo 50 trái tim bay ra từ trung tâm
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.className = 'exploding-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        
        // Góc ngẫu nhiên (360 độ)
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 150 + Math.random() * 200; // Khoảng cách bay
        
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const rotate = Math.random() * 720 - 360;
        
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        heart.style.setProperty('--tx', tx + 'px');
        heart.style.setProperty('--ty', ty + 'px');
        heart.style.setProperty('--rotate', rotate + 'deg');
        heart.style.animationDelay = (i * 0.01) + 's';
        
        container.appendChild(heart);
    }
    
    // Tạo confetti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const angle = (Math.PI * 2 * i) / 100;
        const velocity = 100 + Math.random() * 300;
        
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity + Math.random() * 200;
        
        confetti.style.left = centerX + 'px';
        confetti.style.top = centerY + 'px';
        confetti.style.setProperty('--tx', tx + 'px');
        confetti.style.setProperty('--ty', ty + 'px');
        confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
        confetti.style.animationDelay = (i * 0.005) + 's';
        
        container.appendChild(confetti);
    }
    
    // Xóa container sau khi animation xong
    setTimeout(() => {
        container.remove();
    }, 2000);
}

// Cho phép nhấn Enter để kiểm tra mật khẩu
passwordInputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
});

