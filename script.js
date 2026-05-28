// 시작 화면에서 터치하면 메뉴 화면으로 이동
function goToMenu() {
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('menu-screen').classList.remove('hidden');
}

// 처음으로 버튼 누르면 시작 화면으로 복귀
function goToHome() {
  document.getElementById('menu-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
}

// 모달창 열기 (클릭한 메뉴 이름과 가격 전달)
function openModal(name, price) {
  document.getElementById('modal-name').innerText = name;
  document.getElementById('modal-price').innerText = '₩ ' + price;
  document.getElementById('option-modal').classList.remove('hidden');
}

// 모달창 닫기
function closeModal() {
  document.getElementById('option-modal').classList.add('hidden');
}