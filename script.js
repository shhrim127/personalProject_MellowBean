// 상태 변수
let orderType = ''; // 매장 or 포장
let currentItem = { name: '', price: 0 }; // 선택 중인 메뉴
let cart = []; // 장바구니 배열
let fontStep = 0; // 글씨 크기 단계 (0, 1, 2, 3)

// --- 화면 전환 로직 ---
function goToMenu(type) {
  orderType = type;
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('menu-screen').classList.remove('hidden');
}

function goToHome() {
  document.getElementById('menu-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
  cart = []; // 홈으로 가면 장바구니 초기화
  updateCartUI();
}

// 탭(카테고리) 전환
function changeCategory(category, element) {
  // 탭 버튼 색상 변경
  const btns = document.querySelectorAll('.category-btn');
  btns.forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  // 메뉴 리스트 변경
  const grids = document.querySelectorAll('.menu-grid');
  grids.forEach(grid => grid.classList.add('hidden'));
  document.getElementById('list-' + category).classList.remove('hidden');
}

// --- 글씨 크기 조절 (3단계) ---
function toggleFontSize() {
  fontStep = (fontStep + 1) % 4; // 0, 1, 2, 3 반복
  const scaleValues = [1, 1.1, 1.2, 1.3]; // 0%, 10%, 20%, 30% 커짐
  document.documentElement.style.setProperty('--font-scale', scaleValues[fontStep]);
}

// --- 장바구니 로직 ---
function openModal(name, price) {
  currentItem = { name: name, price: price };
  document.getElementById('modal-name').innerText = name;
  document.getElementById('modal-price').innerText = '₩ ' + price.toLocaleString();
  document.getElementById('option-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('option-modal').classList.add('hidden');
}

// 장바구니 담기 (선택 완료 버튼)
function addToCart() {
  cart.push({ ...currentItem }); // 배열에 추가
  closeModal();
  updateCartUI();
}

// 장바구니 전체 삭제
function clearCart() {
  cart = [];
  updateCartUI();
}

// 장바구니 화면 업데이트
function updateCartUI() {
  const cartList = document.getElementById('cart-list');
  const emptyText = document.getElementById('cart-empty');
  
  // 리스트 초기화
  cartList.innerHTML = '';
  let totalPrice = 0;

  if (cart.length === 0) {
    emptyText.style.display = 'block';
    cartList.style.display = 'none';
  } else {
    emptyText.style.display = 'none';
    cartList.style.display = 'flex';
    
    // 장바구니 아이템들 그려주기
    cart.forEach(item => {
      totalPrice += item.price;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <strong class="scalable-text" style="--base-size: 14px;">${item.name}</strong>
          <span class="scalable-text" style="--base-size: 12px;">₩ ${item.price.toLocaleString()}</span>
        </div>
      `;
      cartList.appendChild(div);
    });
  }

  // 총 갯수 및 금액 업데이트
  document.getElementById('total-count').innerText = cart.length + '개';
  document.getElementById('total-price').innerText = '₩ ' + totalPrice.toLocaleString();
  document.getElementById('final-price').innerText = '₩ ' + totalPrice.toLocaleString();
}

// --- 음성 모드 화면 전환 ---
function openVoiceMode() {
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('menu-screen').classList.add('hidden');
  document.getElementById('voice-screen').classList.remove('hidden');
}

function closeVoiceMode() {
  // 5. 종료 누르면 시작 화면으로 복귀
  document.getElementById('voice-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
}