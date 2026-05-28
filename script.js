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

// 메뉴별 다이나믹 설명 데이터베이스
const menuDescriptions = {
  '아메리카노': '진한 에스프레소의 풍미를 느낄 수 있는 깔끔한 커피',
  '카페라떼': '에스프레소에 부드러운 우유를 더해 고소한 커피',
  '바닐라라떼': '부드러운 우유와 에스프레소에 바닐라 시럽을 더해 달콤하고 향긋한 라떼',
  '카라멜마끼아또': '카라멜의 달콤함과 부드러운 우유 거품이 어우러진 커피',
  '크림콜드브루': '콜드브루 위에 달콤하고 부드러운 크림이 올라간 커피',
  '치즈 케이크': '입 안 가득 퍼지는 진한 치즈의 풍미가 매력적인 케이크',
  '망고 스무디': '달콤한 망고를 듬뿍 갈아 만든 시원한 스무디'
};

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

// === 메뉴 클릭 시 상세창 열기 (에러 완벽 수정) ===
function openDetail(name, price) {
  detailItemName = name;
  detailBasePrice = price;
  
  detailSelectedSize = { name: '작은', price: 0 };
  detailFreeOptions.clear();
  detailPaidOptions = [];
  
  // 1. 메뉴명 및 설명 텍스트 넣기
  document.getElementById('detail-name').innerHTML = name + ' <span class="badge">BEST</span>';
  document.getElementById('detail-desc').innerText = menuDescriptions[name] || '선택하신 메뉴를 나만의 취향으로 변경해보세요.';
  
  // 2. 핫/아이스 뱃지 설정
  const tempBadge = document.getElementById('detail-temp-badge');
  if (currentCategory !== 'snack') {
    tempBadge.style.display = 'inline-block';
    tempBadge.innerText = currentTemp;
    tempBadge.className = 'temp-badge scalable-text ' + (currentTemp === '핫' ? 'hot' : 'ice');
  } else {
    tempBadge.style.display = 'none'; // 간식은 온도 표시 없음
  }

  // 3. 옵션 영역 숨기기/보이기 로직
  const optionsArea = document.getElementById('detail-options-area');
  if(currentCategory === 'snack') {
    optionsArea.style.display = 'none';
  } else {
    optionsArea.style.display = 'block';
    
    // 버튼 초기화
    document.querySelectorAll('.free-options-grid .opt-box').forEach(b => b.classList.remove('active-opt'));
    document.querySelectorAll('.paid-options-grid .opt-box').forEach(b => b.classList.remove('active-opt'));
    document.querySelectorAll('.size-box').forEach(b => b.classList.remove('active-opt'));
    
    // 사이즈 기본 선택 방어코드
    const firstSizeBox = document.querySelector('.size-box');
    if (firstSizeBox) firstSizeBox.classList.add('active-opt');

    // 4. 유료옵션(샷, 두유) 필터링
    const milkDrinks = ['카페라떼', '바닐라라떼', '카라멜마끼아또', '크림콜드브루']; 
    const optShot = document.getElementById('opt-shot');
    const optMilk = document.getElementById('opt-milk');
    const paidTitle = document.getElementById('paid-options-title');
    const paidGrid = document.getElementById('paid-options-grid');

    if (optShot && optMilk && paidTitle && paidGrid) {
      optShot.style.display = 'flex';
      optMilk.style.display = 'flex';
      paidTitle.style.display = 'block';
      paidGrid.style.display = 'grid';
      paidGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';

      if (currentCategory !== 'coffee') optShot.style.display = 'none';
      if (!milkDrinks.includes(name)) optMilk.style.display = 'none';

      if (optShot.style.display === 'none' && optMilk.style.display === 'none') {
        paidTitle.style.display = 'none';
        paidGrid.style.display = 'none';
      } else if (optShot.style.display === 'none' || optMilk.style.display === 'none') {
        paidGrid.style.gridTemplateColumns = '1fr'; // 한개면 꽉 차게
      }
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