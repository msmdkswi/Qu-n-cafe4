/* QUÁN CÀ PHÊ - HỆ THỐNG QUẢN LÝ
   Chức năng: Xử lý giỏ hàng, đăng nhập/đăng ký, thanh toán, lịch sử mua hàng
   Tính năng: Menu mobile, Filter sản phẩm, Modal auth, localStorage
*/

// Giỏ hàng: lưu danh sách sản phẩm người dùng chọn
let cart = [];
// Người dùng hiện tại: null nếu chưa đăng nhập
let currentUser = null;
// Lịch sử mua hàng: lưu danh sách đơn hàng đã thanh toán
let purchaseHistory = [];

const products = [
    { id: 1, tên: 'Cà Phê Espresso Đen', giá: 28000 },
    { id: 2, tên: 'Cà Phê Cappuccino', giá: 38000 },
    { id: 3, tên: 'Cà Phê Latte Kem', giá: 42000 },
    { id: 4, tên: 'Cà Phê Đá', giá: 32000 },
    { id: 5, tên: 'Cà Phê Mocha', giá: 40000 },
    { id: 6, tên: 'Cà Phê Sữa Đặc', giá: 30000 },
    { id: 7, tên: 'Cheesecake Bơ', giá: 48000 },
    { id: 8, tên: 'Tiramisu', giá: 52000 },
    { id: 9, tên: 'Chocolate Mousse', giá: 45000 },
    { id: 10, tên: 'Fruit Tart', giá: 42000 }
];

function initMobileMenu() {
    // Lấy phần tử button hamburger từ HTML
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    // Lấy phần tử menu chính
    const navMenu = document.getElementById('navMenu');

    // Nếu nút hamburger tồn tại
    if (hamburgerBtn) {
        // Click nút hamburger: bật/tắt menu
        hamburgerBtn.addEventListener('click', function() {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Click vào link: đóng menu tự động
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Click giỏ hàng: đóng menu và hiển thị tóm tắt đơn hàng
        const cartLinks = navMenu.querySelectorAll('.cart-link');
        cartLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                goToCheckoutHistory();
            });
        });

        // Click giỏ hàng ở header: hiển thị tóm tắt đơn hàng
        const headerCartLinks = document.querySelectorAll('.cart-link');
        headerCartLinks.forEach(link => {
            link.addEventListener('click', goToCheckoutHistory);
        });
    }
}

/**
 * Hiển thị tóm tắt đơn hàng
 * - Hiển thị phần tóm tắt
 * - Cuộn mền tới phần đó
 */
function showOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    if (orderSummary) {
        // Hiển thị phần tóm tắt
        orderSummary.style.display = 'block';
        // Cuộn mền tới phần tóm tắt
        setTimeout(() => {
            orderSummary.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

/**
 * Hàm hiển thị giỏ hàng
 * - Hiển thị phần #cart
 * - Cuộn mịn tới phần đó
 */
function showCart() {
    const cart = document.getElementById('cart');
    if (cart) {
        cart.style.display = 'block';
        setTimeout(() => {
            cart.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

/**
 * Hàm hiển thị sản phẩm và ẩn lịch sử
 */
function showProducts() {
    const checkoutHistorySection = document.getElementById('checkout-history');
    const productsSection = document.getElementById('products');
    const hero = document.querySelector('.hero');
    const contact = document.getElementById('contact');
    const creators = document.getElementById('creators');
    
    if (checkoutHistorySection) checkoutHistorySection.style.display = 'none';
    if (productsSection) productsSection.style.display = 'block';
    if (hero) hero.style.display = 'flex';
    if (contact) contact.style.display = 'block';
    if (creators) creators.style.display = 'none';
    
    // Scroll đến products
    productsSection.scrollIntoView();
}

/**
 * Hàm hiển thị liên hệ
 */
function showContact() {
    const productsSection = document.getElementById('products');
    const hero = document.querySelector('.hero');
    const contact = document.getElementById('contact');
    const creators = document.getElementById('creators');
    const checkoutHistorySection = document.getElementById('checkout-history');
    
    if (productsSection) productsSection.style.display = 'none';
    if (hero) hero.style.display = 'none';
    if (contact) contact.style.display = 'block';
    if (creators) creators.style.display = 'none';
    if (checkoutHistorySection) checkoutHistorySection.style.display = 'none';
    
    // Scroll đến contact
    contact.scrollIntoView();
}

/**
 * Hàm đi đến mục thanh toán & lịch sử
 */
function goToCheckoutHistory() {
    const checkoutHistorySection = document.getElementById('checkout-history');
    const productsSection = document.getElementById('products');
    const cartSection = document.getElementById('cart');
    const hero = document.querySelector('.hero');
    const contact = document.getElementById('contact');
    const creators = document.getElementById('creators');
    
    if (checkoutHistorySection && productsSection && cartSection) {
        // Ẩn tất cả sections khác, chỉ hiển thị thanh toán & lịch sử
        cartSection.style.display = 'none';
        productsSection.style.display = 'none';
        if (hero) hero.style.display = 'none';
        if (contact) contact.style.display = 'none';
        if (creators) creators.style.display = 'none';
        checkoutHistorySection.style.display = 'block';
        
        // Scroll đến mục
        checkoutHistorySection.scrollIntoView();
        
        updatePurchaseHistory();
    }
}

/**
 * Hàm ẩn giỏ hàng và lịch sử mua hàng
 * - Ẩn phần #cart
 * - Ẩn phần #history
 * - Ẩn phần #order-summary
 * - Cuộn lên đầu trang
 */
function hideCartAndHistory() {
    const cart = document.getElementById('cart');
    const checkoutHistory = document.getElementById('checkout-history');
    const orderSummary = document.getElementById('order-summary');
    const creators = document.getElementById('creators');
    const hero = document.querySelector('.hero');
    const products = document.getElementById('products');
    const contact = document.getElementById('contact');
    
    if (cart) cart.style.display = 'none';
    if (checkoutHistory) checkoutHistory.style.display = 'none';
    if (orderSummary) orderSummary.style.display = 'none';
    if (creators) creators.style.display = 'none';
    
    if (hero) hero.style.display = 'flex';
    if (products) products.style.display = 'block';
    if (contact) contact.style.display = 'block';
    
    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Hàm hiển thị phần Những Người Tạo Ra Trang Web
 * - Ẩn tất cả section khác
 * - Hiển thị #creators
 * - Cuộn mịn tới phần đó
 */
function showCreators() {
    // Ẩn các section khác
    const products = document.getElementById('products');
    const contact = document.getElementById('contact');
    const cart = document.getElementById('cart');
    const orderSummary = document.getElementById('order-summary');
    const hero = document.querySelector('.hero');
    const checkoutHistory = document.getElementById('checkout-history');
    
    if (products) products.style.display = 'none';
    if (contact) contact.style.display = 'none';
    if (cart) cart.style.display = 'none';
    if (orderSummary) orderSummary.style.display = 'none';
    if (hero) hero.style.display = 'none';
    if (checkoutHistory) checkoutHistory.style.display = 'none';
    
    // Hiển thị creators
    const creators = document.getElementById('creators');
    if (creators) {
        creators.style.display = 'block';
        setTimeout(() => {
            creators.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

function toggleAddMemberForm() {
    const form = document.getElementById('addMemberForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addMember(event) {
    event.preventDefault();
    const name = document.getElementById('memberName').value;
    const birth = document.getElementById('memberBirth').value;
    const id = document.getElementById('memberId').value;
    const school = document.getElementById('memberSchool').value;
    const year = document.getElementById('memberYear').value;
    const image = document.getElementById('memberImage').value;
    
    const grid = document.querySelector('.creators-grid');
    const card = document.createElement('div');
    card.className = 'creator-card';
    card.innerHTML = `
        <img src="${image}" alt="${name}" class="creator-avatar">
        <h3>${name}</h3>
        <p class="creator-birth">📅 Ngày sinh: ${birth}</p>
        <p class="creator-student-id">🎓 Mã sinh viên: ${id}</p>
        <p class="creator-school">🏫 Trường: ${school}</p>
        <p class="creator-year">📘 Năm học: ${year}</p>
    `;
    grid.appendChild(card);
    
    // Reset form
    document.getElementById('memberForm').reset();
    toggleAddMemberForm();
}

// Add event listener for the form
document.getElementById('memberForm').addEventListener('submit', addMember);


function addToCart(productId) {
    // Tìm sản phẩm từ danh sách products bằng id
    const product = products.find(p => p.id === productId);
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // Nếu sản phẩm đã có: tăng số lượng lên 1
        existingItem.quantity++;
    } else {
        // Nếu sản phẩm chưa có: thêm sản phẩm mới với số lượng 1
        cart.push({ ...product, quantity: 1 });
    }

    // Cập nhật giao diện
    updateCart();
    // Thông báo cho người dùng
    alert('✅ ' + product.tên + ' đã được thêm vào giỏ!');
}

function updateCart() {
    // Lấy div chứa danh sách sản phẩm giỏ hàng
    const cartItemsDiv = document.getElementById('cartItems');
    
    // Tính tổng số lượng sản phẩm: duyệt qua tất cả item, cộng số lượng
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Tính tổng tiền: duyệt qua tất cả item, cộng (giá × số lượng)
    const totalPrice = cart.reduce((sum, item) => sum + (item.giá * item.quantity), 0);
    
    // Tính phí vận chuyển: miễn phí nếu tổng tiền > 100k, ngược lại 15k
    const shipping = totalPrice > 100000 ? 0 : 15000;
    
    // Tính tổng cộng cuối cùng = giá hàng + phí ship
    const finalTotal = totalPrice + shipping;

    // ===== CẬP NHẬT SỐ LƯỢNG Ở HEADER =====
    // Cập nhật tất cả phần tử có class 'cart-count'
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
    
    // Cập nhật số lượng ở nút giỏ hàng nổi bên dưới màn hình
    const floatCartCount = document.getElementById('floatCartCount');
    if (floatCartCount) {
        floatCartCount.textContent = totalItems;
    }

    // ===== CẬP NHẬT TRẠNG THÁI NÚT THANH TOÁN =====
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        // Nút thanh toán chỉ bật lên khi có ít nhất 1 sản phẩm trong giỏ
        checkoutBtn.disabled = cart.length === 0;
    }

    // ===== HIỂN THỊ DANH SÁCH SẢN PHẨM =====
    if (cart.length === 0) {
        // Nếu giỏ trống: hiển thị thông báo
        cartItemsDiv.innerHTML = `
            <div class="empty-cart">
                <p>Giỏ hàng của bạn trống</p>
                <a href="#products" class="cta-button" onclick="hideCartAndHistory(); return false;">Tiếp tục mua sắm</a>
            </div>
        `;
    } else {
        // Nếu có sản phẩm: hiển thị danh sách với nút điều khiển
        cartItemsDiv.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="item-details">
                    <h4>${item.tên}</h4>
                    <p style="color: #999; margin: 5px 0;">Giá: ${item.giá.toLocaleString('vi-VN')}₫</p>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div class="item-controls">
                        <!-- Nút giảm số lượng -->
                        <button onclick="changeQuantity(${item.id}, -1)">−</button>
                        <!-- Hiển thị số lượng hiện tại -->
                        <input type="number" value="${item.quantity}" min="1" style="width: 50px; text-align: center;" onchange="updateQuantity(${item.id}, this.value)">
                        <!-- Nút tăng số lượng -->
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                    <!-- Hiển thị thành tiền (giá × số lượng) -->
                    <div class="item-price">${(item.giá * item.quantity).toLocaleString('vi-VN')}₫</div>
                    <!-- Nút xóa sản phẩm khỏi giỏ -->
                    <button onclick="removeFromCart(${item.id})" style="background: #ff6b6b; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;">Xóa</button>
                </div>
            </div>
        `).join('');
    }

    // ===== CẬP NHẬT DANH SÁCH SẢN PHẨM TRONG THANH TOÁN =====
    const checkoutCartItemsDiv = document.getElementById('checkoutCartItems');
    if (checkoutCartItemsDiv) {
        if (cart.length === 0) {
            checkoutCartItemsDiv.innerHTML = '';
        } else {
            checkoutCartItemsDiv.innerHTML = `
                <h4 style="margin-bottom: 15px;">Sản phẩm trong giỏ:</h4>
                ${cart.map(item => `
                    <div class="cart-item">
                        <div class="item-details">
                            <h4>${item.tên}</h4>
                            <p style="color: #999; margin: 5px 0;">Giá: ${item.giá.toLocaleString('vi-VN')}₫</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div class="item-controls">
                                <!-- Nút giảm số lượng -->
                                <button onclick="changeQuantity(${item.id}, -1)">−</button>
                                <!-- Hiển thị số lượng hiện tại -->
                                <input type="number" value="${item.quantity}" min="1" style="width: 50px; text-align: center;" onchange="updateQuantity(${item.id}, this.value)">
                                <!-- Nút tăng số lượng -->
                                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                            </div>
                            <!-- Hiển thị thành tiền (giá × số lượng) -->
                            <div class="item-price">${(item.giá * item.quantity).toLocaleString('vi-VN')}₫</div>
                            <!-- Nút xóa sản phẩm khỏi giỏ -->
                            <button onclick="removeFromCart(${item.id})" style="background: #ff6b6b; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;">Xóa</button>
                        </div>
                    </div>
                `).join('')}
            `;
        }
    }

    // ===== CẬP NHẬT PHẦN TÓM TẮT ĐƠN HÀNG =====
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Miễn phí' : shipping.toLocaleString('vi-VN') + '₫';
    document.getElementById('totalPrice').textContent = finalTotal.toLocaleString('vi-VN') + '₫';
}

/**
 * Hàm thay đổi số lượng sản phẩm
 * @param {number} productId - ID của sản phẩm
 * @param {number} change - Số thay đổi (+1 để tăng, -1 để giảm)
 * Chức năng:
 * - Tìm sản phẩm trong giỏ
 * - Thay đổi số lượng
 * - Nếu số lượng ≤ 0: xóa sản phẩm
 * - Cập nhật giao diện
 */
function changeQuantity(productId, change) {
    // Tìm sản phẩm trong giỏ
    const item = cart.find(item => item.id === productId);
    if (item) {
        // Thay đổi số lượng
        item.quantity += change;
        // Nếu số lượng ≤ 0: xóa sản phẩm khỏi giỏ
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            // Cập nhật giao diện
            updateCart();
        }
    }
}

/**
 * Hàm cập nhật số lượng sản phẩm trực tiếp
 * @param {number} productId - ID của sản phẩm
 * @param {number} newQuantity - Số lượng mới
 */
function updateQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity <= 0) {
        removeFromCart(productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            updateCart();
        }
    }
}

/**
 * Hàm xóa một sản phẩm khỏi giỏ hàng
 * @param {number} productId - ID của sản phẩm cần xóa
 * Chức năng:
 * - Lọc ra khỏi mảng giỏ hàng những sản phẩm không phải productId này
 * - Cập nhật giao diện
 */
function removeFromCart(productId) {
    // Lọc giỏ hàng: giữ lại những sản phẩm có id khác productId
    cart = cart.filter(item => item.id !== productId);
    // Cập nhật giao diện
    updateCart();
}

// ============ V. THANH TOÁN & LÍU SỬ MUA HÀNG ============
/**
 * Hàm xử lý thanh toán
 * Chức năng:
 * - Kiểm tra giỏ hàng có sản phẩm không
 * - Kiểm tra người dùng đã đăng nhập chưa
 * - Tính tổng giá tiền + phí ship
 * - Tạo đối tượng đơn hàng
 * - Lưu vào localStorage
 * - Cập nhật lịch sử mua hàng
 * - Xóa giỏ hàng sau khi thanh toán thành công
 */
function checkout() {
    // Giỏ hàng phải có sản phẩm
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }

    // Phải đăng nhập mới được thanh toán
    if (!currentUser) {
        alert('❌ Vui lòng đăng nhập trước khi thanh toán!');
        openLoginModal();
        return;
    }

    // Tính tiền sản phẩm
    const totalPrice = cart.reduce((sum, item) => sum + (item.giá * item.quantity), 0);
    // Phí vận chuyển: 0 nếu đơn > 100.000đ, ngược lại 15.000đ
    const shipping = totalPrice > 100000 ? 0 : 15000;
    // Tổng tiền cuối cùng
    const finalTotal = totalPrice + shipping;

    // ===== TẠO ĐƠN HÀNG =====
    const order = {
        id: 'ĐH' + Date.now(),      // ID đơn hàng (độc nhất)
        userId: currentUser.id,      // ID người dùng
        date: new Date().toLocaleDateString('vi-VN'), // Ngày mua
        items: [...cart],            // Danh sách sản phẩm
        subtotal: totalPrice,        // Tiền sản phẩm
        shipping: shipping,          // Phí vận chuyển
        total: finalTotal,           // Tổng cộng
        status: 'completed'          // Trạng thái: hoàn thành
    };

    // ===== LƯU VÀO LOCALSTORAGE =====
    let history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    history.push(order);
    localStorage.setItem('purchaseHistory', JSON.stringify(history));

    // ===== THÔNG BÁO THÀNH CÔNG =====
    const message = `
Đơn hàng của bạn:
${cart.map(item => `- ${item.tên} x${item.quantity}: ${(item.giá * item.quantity).toLocaleString('vi-VN')}₫`).join('\n')}

Tổng cộng: ${finalTotal.toLocaleString('vi-VN')}₫

Cảm ơn bạn đã mua hàng!
    `;

    alert('✅ Thanh toán thành công!\n' + message);
    
    // ===== XÓA GIỎ HÀNG =====
    cart = [];
    updateCart();
    updatePurchaseHistory();
    // Reset hiển thị giỏ hàng
    document.getElementById('cartItems').innerHTML = `
        <div class="empty-cart">
            <p>Giỏ hàng của bạn trống</p>
            <a href="#products" class="cta-button" onclick="hideCartAndHistory(); return false;">Tiếp tục mua sắm</a>
        </div>
    `;
}

/**
 * Cuộn tới giỏ hàng
 */
function scrollToCart() {
    // Hiển thị giỏ hàng
    showCart();
}

/**
 * Hàm chuyển đổi hiển thị lịch sử mua hàng trong giỏ hàng
 */
function toggleHistory() {
    const checkoutHistorySection = document.getElementById('checkout-history');
    const productsSection = document.getElementById('products');
    const cartSection = document.getElementById('cart');
    
    if (checkoutHistorySection && productsSection && cartSection) {
        // Ẩn giỏ hàng và sản phẩm, hiển thị thanh toán & lịch sử
        cartSection.style.display = 'none';
        productsSection.style.display = 'none';
        checkoutHistorySection.style.display = 'block';
        
        // Scroll đến mục
        checkoutHistorySection.scrollIntoView();
        
        updatePurchaseHistory();
    }
}

/**
 * Hàm cập nhật hiển thị lịch sử mua hàng
 * Chức năng:
 * - Kiểm tra người dùng đã đăng nhập chưa
 * - Lấy lịch sử của người dùng từ localStorage
 * - Hiển thị danh sách đơn hàng hoặc thông báo trống
 * - Thêm nút xóa từng đơn hàng và xóa toàn bộ
 */
function updatePurchaseHistory() {
    // Lấy div chứa danh sách lịch sử
    const historyDiv = document.getElementById('historyItems');
    
    // Nếu chưa đăng nhập: hiển thị yêu cầu đăng nhập
    if (!currentUser) {
        historyDiv.innerHTML = `
            <h3>📋 Lịch Sử Mua Hàng</h3>
            <div class="empty-history">
                <p>Vui lòng đăng nhập để xem lịch sử mua hàng</p>
                <button onclick="openLoginModal()" class="cta-button">Đăng Nhập</button>
            </div>
        `;
        return;
    }

    // Lấy toàn bộ lịch sử từ localStorage
    let allHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    
    // Lọc ra chỉ những đơn hàng của người dùng hiện tại (dựa trên userId)
    const userHistory = allHistory.filter(order => order.userId === currentUser.id);

    // Nếu người dùng chưa có đơn hàng nào
    if (userHistory.length === 0) {
        historyDiv.innerHTML = `
            <h3>📋 Lịch Sử Mua Hàng</h3>
            <div class="empty-history">
                <p>Bạn chưa có đơn hàng nào</p>
                <a href="#products" class="cta-button">Mua Hàng Ngay</a>
            </div>
        `;
    } else {
        // Hiển thị danh sách đơn hàng
        historyDiv.innerHTML = `
            <h3>📋 Lịch Sử Mua Hàng</h3>
            <div style="margin-bottom: 20px; text-align: right;">
                <!-- Nút xóa toàn bộ lịch sử -->
                <button onclick="clearAllPurchaseHistory()" style="background: #ff6b6b; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">🗑️ Xóa Toàn Bộ Lịch Sử</button>
            </div>
            <!-- Duyệt qua danh sách đơn hàng (reverse để hiển thị mới nhất trước) -->
            ${userHistory.reverse().map(order => `
                <div class="history-item">
                    <!-- Phần header: ID đơn hàng, ngày, trạng thái, nút xóa -->
                    <div class="history-header">
                        <div>
                            <span class="history-id">Đơn hàng: ${order.id}</span>
                            <span class="history-date">${order.date}</span>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <!-- Hiển thị trạng thái (Hoàn thành / Chờ xử lý) -->
                            <span class="history-status ${order.status}">${order.status === 'completed' ? '✓ Hoàn thành' : '⏳ Chờ xử lý'}</span>
                            <!-- Nút xóa đơn hàng này -->
                            <button onclick="deleteOrderFromHistory('${order.id}')" style="background: #ff6b6b; color: white; padding: 5px 12px; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">Xóa</button>
                        </div>
                    </div>
                    <!-- Phần danh sách sản phẩm trong đơn hàng -->
                    <div class="history-items-list">
                        ${order.items.map(item => `
                            <div class="history-item-row">
                                <span>${item.tên} x${item.quantity}</span>
                                <span>${(item.giá * item.quantity).toLocaleString('vi-VN')}₫</span>
                            </div>
                        `).join('')}
                    </div>
                    <!-- Phần tổng tiền -->
                    <div class="history-total">
                        <span>Tổng cộng:</span>
                        <span>${order.total.toLocaleString('vi-VN')}₫</span>
                    </div>
                </div>
            `).join('')}
        `;
    }
}

/**
 * Hàm xóa một đơn hàng cụ thể
 * @param {string} orderId - ID của đơn hàng cần xóa
 * Chức năng:
 * - Hỏi xác nhận trước khi xóa
 * - Lọc ra đơn hàng đó khỏi danh sách
 * - Lưu lại vào localStorage
 * - Cập nhật hiển thị
 */
function deleteOrderFromHistory(orderId) {
    // Hỏi người dùng xác nhận trước khi xóa
    if (confirm('Bạn chắc chắn muốn xóa đơn hàng này?')) {
        // Lấy toàn bộ lịch sử từ localStorage
        let allHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        
        // Lọc ra khỏi lịch sử những đơn hàng có id khác orderId
        allHistory = allHistory.filter(order => order.id !== orderId);
        
        // Lưu lại vào localStorage
        localStorage.setItem('purchaseHistory', JSON.stringify(allHistory));
        
        // Cập nhật hiển thị
        updatePurchaseHistory();
        
        // Thông báo thành công
        alert('✅ Đã xóa đơn hàng!');
    }
}

/**
 * Hàm xóa toàn bộ lịch sử mua hàng của người dùng hiện tại
 * Chức năng:
 * - Hỏi xác nhận 2 lần (cảnh báo không thể hoàn tác)
 * - Lọc ra toàn bộ đơn hàng của người dùng hiện tại
 * - Lưu lại vào localStorage
 * - Cập nhật hiển thị
 * - LƯU Ý: Chỉ xóa đơn hàng của người dùng hiện tại, không xóa đơn hàng người khác
 */
function clearAllPurchaseHistory() {
    // Hỏi xác nhận với cảnh báo mạnh (không thể hoàn tác)
    if (confirm('Bạn chắc chắn muốn xóa TOÀN BỘ lịch sử mua hàng? Hành động này không thể hoàn tác!')) {
        // Lấy toàn bộ lịch sử từ localStorage
        let allHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        
        // Lọc ra khỏi lịch sử những đơn hàng của người dùng hiện tại
        // Giữ lại những đơn hàng của người dùng khác
        allHistory = allHistory.filter(order => order.userId !== currentUser.id);
        
        // Lưu lại vào localStorage
        localStorage.setItem('purchaseHistory', JSON.stringify(allHistory));
        
        // Cập nhật hiển thị
        updatePurchaseHistory();
        
        // Thông báo thành công
        alert('✅ Đã xóa toàn bộ lịch sử mua hàng!');
    }
}

// ============ VI. KHỞI TẠO VÀ SỰ KIỆN ============
/**
 * Sự kiện chạy khi DOM load hoàn toàn
 * Chức năng:
 * - Khởi tạo mobile menu
 * - Lắng nghe click nút "Thêm vào Giỏ" (event delegation)
 * - Khởi tạo giỏ hàng
 * - Kiểm tra đăng nhập
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing...');
    
    // Khởi tạo mobile menu
    initMobileMenu();
    
    // Lắng nghe sự kiện click cho tất cả nút "Thêm vào Giỏ"
    // Sử dụng event delegation để không phải lắng nghe từng nút riêng lẻ
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            console.log('Add to cart button clicked');
            // Lấy phần tử .product-card chứa nút được click
            const button = e.target;
            const productCard = button.closest('.product-card');
            // Lấy tất cả phần tử .product-card trên trang
            const allCards = document.querySelectorAll('.product-card');
            // Tìm vị trí của card được click (0-based)
            let productIndex = 0;
            
            for (let i = 0; i < allCards.length; i++) {
                if (allCards[i] === productCard) {
                    // Vị trí của product (1-based vì ID sản phẩm bắt đầu từ 1)
                    productIndex = i + 1;
                    break;
                }
            }
            
            console.log('Adding product', productIndex);
            // Gọi hàm thêm vào giỏ
            addToCart(productIndex);
        }
    });

    // Lắng nghe click nút CTA chính
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '') {
                e.preventDefault();
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Khởi tạo
    // Cập nhật hiển thị giỏ hàng lần đầu
    updateCart();
    // Kiểm tra người dùng đã đăng nhập chưa (lấy từ localStorage)
    checkUserLogin();

    // ============ FILTER & SORT ============
    // Lắng nghe thay đổi checkbox loại cà phê
    ['coffee1', 'coffee2', 'coffee3'].forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.addEventListener('change', filterProducts);
    });
    
    // Lắng nghe thay đổi checkbox giá
    ['price1', 'price2', 'price3'].forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.addEventListener('change', filterProducts);
    });
});

// ============ VII. ĐĂNG NHẬP & ĐĂNG KÝ ============
/**
 * Hàm mở modal đăng nhập
 * Chức năng:
 * - Thêm class 'show' để hiển thị modal
 * - Chuyển sang tab Đăng Nhập
 */
function openLoginModal() {
    document.getElementById('authModal').classList.add('show');
    switchToLogin();
}

/**
 * Hàm mở modal đăng ký
 * - Hiển thị modal
 * - Chuyển sang tab Đăng Ký
 */
function openRegisterModal() {
    document.getElementById('authModal').classList.add('show');
    switchToRegister();
}

/**
 * Hàm đóng modal đăng nhập
 * Chức năng:
 * - Loại bỏ class 'show' để ẩn modal
 */
function closeAuthModal() {
    document.getElementById('authModal').classList.remove('show');
}

function switchToLogin() {
    // Thêm class 'active' vào tab đăng nhập
    document.getElementById('loginTab').classList.add('active');
    // Loại bỏ class 'active' khỏi tab đăng ký
    document.getElementById('registerTab').classList.remove('active');
    
    // Cập nhật trạng thái nút tab
    const buttons = document.querySelectorAll('.auth-tab-button');
    buttons[0].classList.add('active');      // Nút "Đăng Nhập" active
    buttons[1].classList.remove('active');   // Nút "Đăng Ký" không active
}

/**
 * Hàm chuyển sang tab Đăng Ký
 * Chức năng:
 * - Ẩn tab Đăng Nhập
 * - Hiển thị tab Đăng Ký
 * - Cập nhật trạng thái nút tab
 */
function switchToRegister() {
    // Loại bỏ class 'active' khỏi tab đăng nhập
    document.getElementById('loginTab').classList.remove('active');
    // Thêm class 'active' vào tab đăng ký
    document.getElementById('registerTab').classList.add('active');
    
    // Cập nhật trạng thái nút tab
    const buttons = document.querySelectorAll('.auth-tab-button');
    buttons[0].classList.remove('active');   // Nút "Đăng Nhập" không active
    buttons[1].classList.add('active');      // Nút "Đăng Ký" active
}

/**
 * Đăng nhập
 * - Lấy email và password từ form
 * - Kiểm tra thông tin đăng nhập
 * - Lưu vào currentUser nếu đúng
 */
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('✅ Đăng nhập thành công!');
        closeAuthModal();
        updateUserDisplay();
    } else {
        alert('❌ Email hoặc mật khẩu không chính xác!');
    }
}

/**
 * Đăng ký tài khoản
 * - Lấy thông tin từ form
 * - Kiểm tra password trùng khớp
 * - Kiểm tra email chưa dùng
 * - Tạo tài khoản và lưu vào localStorage
 */
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    if (password !== passwordConfirm) {
        alert('❌ Mật khẩu không trùng khớp!');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email)) {
        alert('❌ Email đã được sử dụng!');
        return;
    }

    const newUser = { 
        id: Date.now(),
        tên: name,
        email,
        password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('✅ Đăng ký thành công! Vui lòng đăng nhập.');
    switchToLogin();
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = '';
}

/**
 * Đăng xuất
 * - Xóa thông tin người dùng
 * - Xóa dữ liệu localStorage
 * - Cập nhật giao diện
 */
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    alert('✅ Đã đăng xuất!');
    updateUserDisplay();
    updatePurchaseHistory();
}

/**
 * Cập nhật hiển thị người dùng
 * - Nếu đã đăng nhập: hiển thị tên và nút Đăng Xuất
 * - Nếu chưa đăng nhập: hiển thị nút Đăng Nhập
 */
function updateUserDisplay() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userDisplay = document.getElementById('userDisplay');

    if (currentUser) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        userDisplay.textContent = '👤 ' + currentUser.tên;
        userDisplay.style.display = 'block';
        updatePurchaseHistory();
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        userDisplay.style.display = 'none';
    }
}

/**
 * Hàm kiểm tra người dùng đã đăng nhập chưa
 * Chức năng:
 * - Kiểm tra localStorage có dữ liệu người dùng không
 * - Nếu có: lấy thông tin người dùng và cập nhật giao diện
 * - Hàm này chạy khi trang load để khôi phục đăng nhập trước đó
 */
function checkUserLogin() {
    // Lấy dữ liệu người dùng từ localStorage
    const saved = localStorage.getItem('currentUser');
    if (saved) {
        // Nếu có dữ liệu người dùng: parse JSON và lưu vào currentUser
        currentUser = JSON.parse(saved);
    }
    // Cập nhật giao diện dù có đăng nhập hay không
    updateUserDisplay();
}

/**
 * Lọc sản phẩm
 * - Lấy các checkbox được chọn
 * - Lọc sản phẩm theo loại và giá
 * - Sắp xếp danh sách nếu cần
 */
function filterProducts() {
    // Hiển thị trang sản phẩm trước khi lọc
    showProducts();
    
    const productCards = document.querySelectorAll('#products .product-card');
    
    // Loại cà phê được chọn
    const selectedCoffeeTypes = [];
    if (document.getElementById('coffee1')?.checked) selectedCoffeeTypes.push('coffee-black');
    if (document.getElementById('coffee2')?.checked) selectedCoffeeTypes.push('coffee-milk');
    if (document.getElementById('coffee3')?.checked) selectedCoffeeTypes.push('coffee-ice');
    
    // Khoảng giá được chọn
    const selectedPrices = [];
    if (document.getElementById('price1')?.checked) selectedPrices.push('under30k');
    if (document.getElementById('price2')?.checked) selectedPrices.push('30k-40k');
    if (document.getElementById('price3')?.checked) selectedPrices.push('above40k');
    
    const visibleCards = [];
    
    productCards.forEach(card => {
        const type = card.getAttribute('data-type');
        const price = parseInt(card.getAttribute('data-price'));
        
        let priceRange = '';
        if (price < 30000) priceRange = 'under30k';
        else if (price >= 30000 && price <= 40000) priceRange = '30k-40k';
        else priceRange = 'above40k';
        
        const typeMatch = selectedCoffeeTypes.length === 0 || selectedCoffeeTypes.includes(type) || type === 'dessert';
        const priceMatch = selectedPrices.length === 0 || selectedPrices.includes(priceRange) || type === 'dessert';
        
        if (typeMatch && priceMatch) {
            card.style.display = 'block';
            visibleCards.push({ card, type, price });
        } else {
            card.style.display = 'none';
        }
    });
    
    // Hiển thị thông báo nếu không có sản phẩm nào
    const noProductsDiv = document.getElementById('no-products');
    if (visibleCards.length === 0) {
        noProductsDiv.style.display = 'block';
    } else {
        noProductsDiv.style.display = 'none';
    }
}

function resetFilters() {
    // Đặt lại tất cả checkbox
    const checkboxes = document.querySelectorAll('#products .sidebar input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Lọc lại
    filterProducts();
}

