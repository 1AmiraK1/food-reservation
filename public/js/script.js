//password eye
document.querySelectorAll('.toggle-password').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const inputGroup = toggle.closest('.input-group');
    const input = inputGroup.querySelector('input');

    if (!input) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    toggle.innerHTML = isPassword
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
</svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
</svg>`;
  });
});


//remove query
if (
  window.location.search.includes('success=true') ||
  window.location.search.includes('amount=true')
) {
  const url = new URL(window.location);
  url.searchParams.delete('success');
  url.searchParams.delete('amount');
  window.history.replaceState({}, document.title, url.pathname + url.search);
}


//Avatar Preview
const avatarInput = document.getElementById('avatarInput');
const avatarImage = document.getElementById('avatarImage');

if (avatarInput) {
  avatarInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (avatarImage) {
          avatarImage.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  });
}


//add money
document.addEventListener("DOMContentLoaded", function () {
  const hiddenInput = document.getElementById('amount');
  const displayInput = document.getElementById('amountDisplay');
  const MAX_AMOUNT = 1000000;

  // فقط اگر inputها وجود داشتن، کد اجرا بشه
  if (hiddenInput && displayInput) {
    // مقدار اولیه
    hiddenInput.value = 0;
    displayInput.value = toPersianNumber(0);

    // موقع تایپ دستی
    displayInput.addEventListener('input', () => {
      const raw = toEnglishDigits(displayInput.value);
      let num = parseInt(raw) || 0;
      if (num > MAX_AMOUNT) num = MAX_AMOUNT;
      hiddenInput.value = num;
      displayInput.value = toPersianNumber(num);
    });

    // دکمه‌های افزایش سریع
    document.querySelectorAll('.quick-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const addAmount = parseInt(btn.getAttribute('data-amount'));
        let currentVal = parseInt(hiddenInput.value) || 0;
        let newVal = currentVal + addAmount;
        if (newVal > MAX_AMOUNT) newVal = MAX_AMOUNT;
        hiddenInput.value = newVal;
        displayInput.value = toPersianNumber(newVal);
      });
    });
  }
});

// تبدیل عدد به فارسی با جداکننده
function toPersianNumber(num) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return num.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            .replace(/\d/g, d => persianDigits[d]);
}

// تبدیل اعداد فارسی/عربی به انگلیسی
function toEnglishDigits(str) {
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  const arabic = '٠١٢٣٤٥٦٧٨٩';
  return str.replace(/[٬,]/g, '')
            .replace(/[\u06F0-\u06F9]/g, d => persian.indexOf(d))
            .replace(/[\u0660-\u0669]/g, d => arabic.indexOf(d));
}

//Showing Balance Correctly
const currentBalanceElements = document.getElementsByClassName('current-balance');
if (currentBalanceElements.length > 0) {
  Array.from(currentBalanceElements).forEach(item => {
    const rawValue = item.textContent.replace(/[,٬]/g, '');
    const numericValue = parseInt(rawValue) || 0;
    item.textContent = toPersianNumber(numericValue);
  });
}

// Get foods by restaurant id
const restaurantDropdown = document.getElementById('restaurantDropdown');

if (restaurantDropdown) {
  restaurantDropdown.addEventListener('change', async function () {
    const restaurantId = this.value;
    const foodSection = document.getElementById('foodSection');
    const foodList = document.getElementById('foodList');
    foodList.innerHTML = '';
    foodSection.style.display = 'none';

    if (!restaurantId) return;

    try {
      const res = await axios.get(`/food/restaurant/${restaurantId}`);
      const foods = res.data;

      if (!foods.length) {
        foodList.innerHTML = '<div class="text-danger">غذایی پیدا نشد.</div>';
        foodSection.style.display = 'block';
        return;
      }

      foods.forEach(food => {
        const col = document.createElement('div');
        col.className = 'col-md-4';

        col.innerHTML = `
          <div class="d-flex">
            <label class="form-check food-box border rounded p-3 w-100 h-100 d-block position-relative">
              <input class="form-check-input position-absolute top-0 end-0 m-2" type="radio" name="selectedFood" value="${food._id}" style="z-index:2;">
              <strong>${food.name}</strong><br>
              <span class="text-muted">${food.price.toLocaleString()} تومان</span>
            </label>
          </div>
        `;

        foodList.appendChild(col);
      });

      foodSection.style.display = 'block';

      document.querySelectorAll('input[name="selectedFood"]').forEach(radio => {
        radio.addEventListener('change', function () {
          document.querySelectorAll('.food-box').forEach(box => {
            box.classList.remove('border-primary', 'bg-light');
          });
          this.closest('.food-box').classList.add('border-primary', 'bg-light');
        });
      });

    } catch (err) {
      console.error('خطا:', err);
      foodList.innerHTML = '<div class="text-danger">خطا در دریافت غذاها</div>';
      foodSection.style.display = 'block';
    }
  });
}
