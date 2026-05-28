let orderType = ''; 
let currentCategory = 'coffee'; // 현재 선택된 카테고리 (간식 구분용)
let currentTemp = '아이스'; // 핫/아이스 상태 저장
let currentOptions = { sweetness: '기본(달게)', milk: '일반 우유' }; // 모달에서 선택한 옵션
let currentItem = { name: '', price: 0 }; 
let cart = []; 
let fontStep = 0; 

// 화면 전환
function hideAllScreens() {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.add('hidden'));
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

// 탭(카테고리) 전환
function changeCategory(category, element) {
  currentCategory = category; // 상태 저장
  
  const btns = document.querySelectorAll('.category-btn');
  btns.forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  const grids = document.querySelectorAll('.menu-grid');
  grids.forEach(grid => grid.classList.add('hidden'));
  document.getElementById('list-' + category).classList.remove('hidden');

  // 간식 탭이면 핫/아이스 버튼 숨기기
  const tempToggle = document.getElementById('temp-toggle-area');
  if(category === 'snack') {
    tempToggle.style.visibility = 'hidden';
  } else {
    tempToggle.style.visibility = 'visible';
  }
}

// 핫/아이스 토글 (색상 변경 및 상태 저장)
function setTemp(temp, element) {
  currentTemp = temp;
  const btns = document.querySelectorAll('.temp-btn');
  btns.forEach(btn => btn.classList.remove('active-temp'));
  element.classList.add('active-temp');
}

// 글씨 크기 조절
function toggleFontSize() {
  fontStep = (fontStep + 1) % 4; 
  const scaleValues = [1, 1.1, 1.2, 1.3]; 
  document.documentElement.style.setProperty('--font-scale', scaleValues[fontStep]);
}

// 모달창 옵션 선택 시 색상 변경
function setOption(type, value, element) {
  currentOptions[type] = value;
  
  // 클릭한 버튼의 형제 요소들 색상 초기화
  const parent = element.parentElement;
  if(type === 'sweetness') {
    parent.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active-option'));
    element.classList.add('active-option');
  } else if (type === 'milk') {
    parent.querySelectorAll('.toggle-item').forEach(btn => btn.classList.remove('active-toggle'));
    element.classList.add('active-toggle');
  }
}

// 모달창 열기
function openModal(name, price) {
  currentItem = { name: name, price: price };
  document.getElementById('modal-name').innerText = name;
  document.getElementById('modal-price').innerText = '₩ ' + price.toLocaleString();
  
  // 간식이면 옵션 영역 숨기기
  if(currentCategory === 'snack') {
    document.getElementById('modal-options-area').style.display = 'none';
  } else {
    document.getElementById('modal-options-area').style.display = 'block';
  }
  
  document.getElementById('option-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('option-modal').classList.add('hidden');
}

// 장바구니 담기 (옵션 포함)
function addToCart() {
  let itemToAdd = { ...currentItem };
  
  // 간식이 아닐 때만 핫/아이스, 당도, 우유 옵션 저장
  if(currentCategory !== 'snack') {
    itemToAdd.temp = currentTemp;
    itemToAdd.sweetness = currentOptions.sweetness;
    itemToAdd.milk = currentOptions.milk;
  }
  
  cart.push(itemToAdd); 
  closeModal();
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

  if (cart.length === 0) {
    emptyText.style.display = 'block';
    cartList.style.display = 'none';
  } else {
    emptyText.style.display = 'none';
    cartList.style.display = 'flex';
    
    cart.forEach(item => {
      totalPrice += item.price;
      
      // 하단 옵션 텍스트 생성 (예: 아이스 / 덜 달게 / 두유로 변경)
      let optionTextArray = [];
      if(item.temp) optionTextArray.push(item.temp);
      if(item.sweetness && item.sweetness !== '기본(달게)') optionTextArray.push(item.sweetness);
      if(item.milk && item.milk !== '일반 우유') optionTextArray.push(item.milk);
      
      let optionString = optionTextArray.length > 0 ? optionTextArray.join(' / ') : '';

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <strong class="scalable-text" style="--base-size: 14px;">${item.name}</strong>
          ${optionString ? `<span class="cart-item-options scalable-text">${optionString}</span>` : ''}
        </div>
        <span class="scalable-text" style="--base-size: 13px; font-weight: bold; color: #4a2c11;">₩ ${item.price.toLocaleString()}</span>
      `;
      cartList.appendChild(div);
    });
  }

  document.getElementById('total-count').innerText = cart.length + '개';
  document.getElementById('total-price').innerText = '₩ ' + totalPrice.toLocaleString();
  document.getElementById('final-price').innerText = '₩ ' + totalPrice.toLocaleString();
}

// --- 결제 프로세스 ---
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
  
  // 결제 수단에 따라 문구와 아이콘 변경
  if(method === 'card') {
    document.getElementById('process-icon').innerText = '💳';
    document.getElementById('process-text').innerText = 'IC카드를 삽입해주세요';
  } else if(method === 'kakao') {
    document.getElementById('process-icon').innerText = '📱';
    document.getElementById('process-text').innerText = '바코드 인식중...';
  }

  // 2.5초 뒤에 결제 성공 화면으로 자동 이동
  setTimeout(() => {
    showSuccessScreen();
  }, 2500);
}

function showSuccessScreen() {
  hideAllScreens();
  document.getElementById('success-screen').classList.remove('hidden');
  
  // 랜덤 대기번호 생성 (100 ~ 999)
  const randomNum = Math.floor(Math.random() * 900) + 100;
  document.getElementById('order-number').innerText = randomNum;

  // 4초 뒤에 처음 화면으로 초기화
  setTimeout(() => {
    goToHome();
  }, 4000);
}

// --- 음성 모드 ---
function openVoiceMode() {
  hideAllScreens();
  document.getElementById('voice-screen').classList.remove('hidden');
}

function closeVoiceMode() {
  hideAllScreens();
  document.getElementById('home-screen').classList.remove('hidden');
}