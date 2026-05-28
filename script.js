let orderType = ''; 
let currentCategory = 'coffee'; 
let currentTemp = '아이스'; 
let cart = []; 
let fontStep = 0; 

let detailBasePrice = 0;
let detailItemName = '';
let detailSelectedSize = { name: '작은', price: 0 };
let detailFreeOptions = new Set();
let detailPaidOptions = [];

function hideAllScreens() {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
}

function goToMenu(type) {
  orderType = type;
  hideAllScreens();
  document.getElementById('menu-screen').classList.remove('hidden');
}

function goToHome() {
  hideAllScreens();
  document.getElementById('home-screen').classList.remove('hidden');
  cart = []; 
  updateCartUI();
}

function changeCategory(category, element) {
  currentCategory = category; 
  document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
  document.querySelectorAll('.menu-grid').forEach(grid => grid.classList.add('hidden'));
  document.getElementById('list-' + category).classList.remove('hidden');

  const tempToggle = document.getElementById('temp-toggle-area');
  tempToggle.style.visibility = (category === 'snack') ? 'hidden' : 'visible';
}

function setTemp(temp, element) {
  currentTemp = temp;
  document.querySelectorAll('.temp-btn').forEach(btn => btn.classList.remove('active-temp'));
  element.classList.add('active-temp');
}

function toggleFontSize() {
  fontStep = (fontStep + 1) % 4; 
  const scaleValues = [1, 1.1, 1.2, 1.3]; 
  document.documentElement.style.setProperty('--font-scale', scaleValues[fontStep]);
}

// === 메뉴별 옵션 보이기/숨기기 스마트 로직 ===
function openDetail(name, price) {
  detailItemName = name;
  detailBasePrice = price;
  
  detailSelectedSize = { name: '작은', price: 0 };
  detailFreeOptions.clear();
  detailPaidOptions = [];
  
  document.getElementById('detail-name').innerText = name;
  
  if(currentCategory === 'snack') {
    document.getElementById('detail-options-area').style.display = 'none';
  } else {
    document.getElementById('detail-options-area').style.display = 'block';
    
    // 버튼 스타일 리셋
    document.querySelectorAll('.free-options-grid .opt-box').forEach(b => b.classList.remove('active-opt'));
    document.querySelectorAll('.paid-options-grid .opt-box').forEach(b => b.classList.remove('active-opt'));
    document.querySelectorAll('.size-box').forEach(b => b.classList.remove('active-opt'));
    document.querySelector('.size-box').classList.add('active-opt'); // 사이즈는 무조건 '작은'부터

    // --- 유료옵션(샷, 두유) 필터링 로직 ---
    const milkDrinks = ['카페라떼', '바닐라라떼', '카라멜마끼아또', '크림콜드브루']; // 우유가 들어가는 메뉴 리스트
    const optShot = document.getElementById('opt-shot');
    const optMilk = document.getElementById('opt-milk');
    const paidTitle = document.getElementById('paid-options-title');
    const paidGrid = document.getElementById('paid-options-grid');

    // 1. 기본적으로 다 보이게 세팅
    optShot.style.display = 'flex';
    optMilk.style.display = 'flex';
    paidTitle.style.display = 'block';
    paidGrid.style.display = 'grid';
    paidGrid.style.gridTemplateColumns = 'repeat(2, 1fr)'; // 2칸 배열

    // 2. 커피가 아니면(차, 주스) '샷 추가' 숨기기
    if (currentCategory !== 'coffee') {
      optShot.style.display = 'none';
    }

    // 3. 우유가 들어가는 음료가 아니면 '두유 변경' 숨기기
    if (!milkDrinks.includes(name)) {
      optMilk.style.display = 'none';
    }

    // 4. 둘 다 숨겨졌으면 '유료 옵션' 타이틀과 영역 자체를 숨김
    if (optShot.style.display === 'none' && optMilk.style.display === 'none') {
      paidTitle.style.display = 'none';
      paidGrid.style.display = 'none';
    } else if (optShot.style.display === 'none' || optMilk.style.display === 'none') {
      // 5. 하나만 보일 땐 예쁘게 가운데 꽉 차게 1칸으로 변경
      paidGrid.style.gridTemplateColumns = '1fr';
    }
  }
  
  updateDetailBottomBar();
  hideAllScreens();
  document.getElementById('detail-screen').classList.remove('hidden');
}

function closeDetail() {
  hideAllScreens();
  document.getElementById('menu-screen').classList.remove('hidden');
}

function toggleFreeOption(optName, element) {
  if (optName === '달게') {
    detailFreeOptions.delete('덜 달게');
    document.querySelectorAll('.free-options-grid .opt-box')[1].classList.remove('active-opt');
  } else if (optName === '덜 달게') {
    detailFreeOptions.delete('달게');
    document.querySelectorAll('.free-options-grid .opt-box')[0].classList.remove('active-opt');
  }

  if (detailFreeOptions.has(optName)) {
    detailFreeOptions.delete(optName);
    element.classList.remove('active-opt');
  } else {
    detailFreeOptions.add(optName);
    element.classList.add('active-opt');
  }
  updateDetailBottomBar();
}

function togglePaidOption(optName, price, element) {
  const existingIndex = detailPaidOptions.findIndex(o => o.name === optName);
  if (existingIndex > -1) {
    detailPaidOptions.splice(existingIndex, 1);
    element.classList.remove('active-opt');
  } else {
    detailPaidOptions.push({ name: optName, price: price });
    element.classList.add('active-opt');
  }
  updateDetailBottomBar();
}

function selectSize(sizeName, price, element) {
  detailSelectedSize = { name: sizeName, price: price };
  document.querySelectorAll('.size-box').forEach(btn => btn.classList.remove('active-opt'));
  element.classList.add('active-opt');
  updateDetailBottomBar();
}

function updateDetailBottomBar() {
  let total = detailBasePrice + detailSelectedSize.price;
  detailPaidOptions.forEach(opt => total += opt.price);

  document.getElementById('detail-total-price').innerText = '₩ ' + total.toLocaleString();

  let summaryText = [];
  if (currentCategory !== 'snack') {
    document.getElementById('bottom-name').innerText = `${detailItemName} (${detailSelectedSize.name})`;
    summaryText.push(currentTemp);
    detailFreeOptions.forEach(opt => summaryText.push(opt));
    detailPaidOptions.forEach(opt => summaryText.push(opt.name));
    
    document.getElementById('bottom-options').innerText = summaryText.length > 0 ? summaryText.join(', ') : '기본 옵션';
  } else {
    document.getElementById('bottom-name').innerText = detailItemName;
    document.getElementById('bottom-options').innerText = '';
  }
}

function addToCart() {
  let finalPrice = detailBasePrice + detailSelectedSize.price;
  detailPaidOptions.forEach(opt => finalPrice += opt.price);

  let optionArray = [];
  if (currentCategory !== 'snack') {
    optionArray.push(currentTemp);
    if(detailSelectedSize.name !== '작은') optionArray.push(`사이즈: ${detailSelectedSize.name}`);
    detailFreeOptions.forEach(opt => optionArray.push(opt));
    detailPaidOptions.forEach(opt => optionArray.push(opt.name));
  }

  let optionString = optionArray.join(' / ');

  const existingItemIndex = cart.findIndex(item => 
    item.name === detailItemName && item.optionStr === optionString
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].qty += 1; 
  } else {
    cart.push({
      name: detailItemName,
      price: finalPrice,
      optionStr: optionString,
      qty: 1
    });
  }

  closeDetail();
  updateCartUI();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  
  if (cart[index].qty <= 0) {
    cart.splice(index, 1); 
  }
  updateCartUI();
}

function clearCart() {
  cart = [];
  updateCartUI();
}

function updateCartUI() {
  const cartList = document.getElementById('cart-list');
  const emptyText = document.getElementById('cart-empty');
  cartList.innerHTML = '';
  let totalPrice = 0;
  let totalCount = 0;

  if (cart.length === 0) {
    emptyText.style.display = 'block';
    cartList.style.display = 'none';
  } else {
    emptyText.style.display = 'none';
    cartList.style.display = 'flex';
    
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      totalPrice += itemTotal;
      totalCount += item.qty;
      
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <strong class="scalable-text" style="--base-size: 14px;">${item.name}</strong>
          ${item.optionStr ? `<span class="cart-item-options scalable-text">${item.optionStr}</span>` : ''}
        </div>
        <div class="cart-item-right">
          <div class="qty-control">
            <button onclick="changeQty(${index}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
          <span class="scalable-text" style="--base-size: 13px; font-weight: bold; color: #4a2c11;">₩ ${itemTotal.toLocaleString()}</span>
        </div>
      `;
      cartList.appendChild(div);
    });
  }

  document.getElementById('total-count').innerText = totalCount + '개';
  document.getElementById('total-price').innerText = '₩ ' + totalPrice.toLocaleString();
  document.getElementById('final-price').innerText = '₩ ' + totalPrice.toLocaleString();
}

function goToPaymentMethod() {
  if(cart.length === 0) {
    alert('장바구니가 비어있습니다. 메뉴를 선택해주세요.');
    return;
  }
  hideAllScreens();
  document.getElementById('payment-method-screen').classList.remove('hidden');
}

function processPayment(method) {
  hideAllScreens();
  const processingScreen = document.getElementById('processing-screen');
  processingScreen.classList.remove('hidden');
  
  if(method === 'card') {
    document.getElementById('process-icon').innerText = '💳';
    document.getElementById('process-text').innerText = 'IC카드를 삽입해주세요';
  } else if(method === 'kakao') {
    document.getElementById('process-icon').innerText = '📱';
    document.getElementById('process-text').innerText = '바코드 인식중...';
  }

  setTimeout(() => { showSuccessScreen(); }, 2500);
}

function showSuccessScreen() {
  hideAllScreens();
  document.getElementById('success-screen').classList.remove('hidden');
  document.getElementById('order-number').innerText = Math.floor(Math.random() * 900) + 100;

  setTimeout(() => { goToHome(); }, 4000);
}

function openVoiceMode() {
  hideAllScreens();
  document.getElementById('voice-screen').classList.remove('hidden');
}

function closeVoiceMode() {
  hideAllScreens();
  document.getElementById('home-screen').classList.remove('hidden');
}