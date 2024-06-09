// 전역 변수 추가, 맨 위 위치
const idSaveCheck = document.getElementById('idSaveCheck'); // 오타 수정(' 대신 ` 사용)

function addJavascript(jsname) { // 자바스크립트 외부 연동
    var th = document.getElementsByTagName('head')[0];
    var s = document.createElement('script');
    s.setAttribute('type','text/javascript');
    s.setAttribute('src',jsname);
    th.appendChild(s);
}
addJavascript('/js/security.js'); // 암복호화 함수
addJavascript('/js/session.js'); // 세션 함수
addJavascript('/js/cookie.js'); // 쿠키 함수

const check_xss = (input) => {
    // DOMPurify 라이브러리 로드 (CDN 사용)
    const DOMPurify = window.DOMPurify;
    // 입력 값을 DOMPurify로 sanitize
    const sanitizedInput = DOMPurify.sanitize(input);
    // Sanitized된 값과 원본 입력 값 비교
    if (sanitizedInput !== input) {
        // XSS 공격 가능성 발견 시 에러 처리
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    // Sanitized된 값 반환
    return sanitizedInput;
};

const check_input = () => {
    const loginForm = document.getElementById('login_form');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const c = '아이디, 패스워드를 체크합니다';

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // XSS 공격 가능성 검사
    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);
    
    if (!sanitizedEmail || !sanitizedPassword) {
        // XSS 공격 가능성이 있는 경우 함수 종료
        return false;
    }

    if (sanitizedEmail === '') {
        alert('이메일을 입력하세요.');
        return false;
    }
    if (sanitizedEmail.length < 5) {
        alert('아이디는 최소 5글자 이상 입력해야 합니다.');
        return false;
    }
    if (sanitizedPassword === '') {
        alert('비밀번호를 입력하세요.');
        return false;
    }
    if (sanitizedPassword.length < 12) {
        alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
        return false;
    }
    
    const hasSpecialChar = sanitizedPassword.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        return false;
    }
    
    const hasUpperCase = sanitizedPassword.match(/[A-Z]+/) !== null;
    const hasLowerCase = sanitizedPassword.match(/[a-z]+/) !== null;
    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        return false;
    }
    if (sanitizedEmail.length > 15) {
        alert('이메일은 15글자 이하로 입력해야 합니다.');
        return false;
    }
    if (sanitizedEmail.length < 5) {
        alert('아이디는 5글자 이상 입력해야 합니다.');
        return false;
    }
    // 3글자 이상 반복 입력 제한
    const emailRegex = /(.)\1{2,}/;
    if (emailRegex.test(sanitizedEmail)) {
        alert('아이디에 3글자 이상 반복되는 문자가 있습니다.');
        return false;
    }
    
    // 연속되는 숫자 2개 이상 반복 입력 제한
    const passwordRegex = /\d{2,}/;
    if (passwordRegex.test(sanitizedPassword)) {
        alert('비밀번호에 연속되는 숫자가 2개 이상 있습니다.');
        return false;
    }
    
    session_set(sanitizedEmail); // 세션 생성
    console.log('이메일:', sanitizedEmail);
    console.log('비밀번호:', sanitizedPassword);

    // 검사 마무리 단계 쿠키 저장, 최하단 submit 이전
    if(idSaveCheck.checked == true) { // 아이디 체크 o
        setCookie("id", emailValue, 1); // 1일 저장
    } else { // 아이디 체크 x
        setCookie("id", "", -1); // 쿠키 삭제
    }

    loginForm.submit(); // 들여쓰기 수정
} 
function login_failed() {
    let login_fail_cnt = getCookie("login_fail_cnt");
    let login_block_until = getCookie("login_block_until");
    let currentTime = new Date().getTime();

    // 로그인 제한 시간이 지나지 않은 경우
    if (login_block_until && currentTime < parseInt(login_block_until)) {
        const remainingTime = parseInt(login_block_until) - currentTime;
        const remainingMinutes = Math.floor(remainingTime / (1000 * 60));
        const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        const loginStatusElement = document.getElementById("login_status");
        if (loginStatusElement) {
            loginStatusElement.textContent = `로그인이 제한됩니다. (${remainingMinutes}분 ${remainingSeconds}초 후 가능)`;
        }
        return;
    }

    if (login_fail_cnt) {
        login_fail_cnt = parseInt(login_fail_cnt) + 1;
    } else {
        login_fail_cnt = 1;
    }
    setCookie("login_fail_cnt", login_fail_cnt, 1); // 1일 동안 유효한 쿠키

    // 로그인 실패 횟수가 3회 이상인 경우
    if (login_fail_cnt >= 3) {
        alert("로그인 시도 횟수를 초과하였습니다. 1분간 로그인 할 수 없습니다.");
        const loginButton = document.getElementById("login_btn");
        loginButton.disabled = true; // 로그인 버튼 비활성화

        // 1분 동안 로그인 제한
        const blockUntil = new Date().getTime() + (1000 * 60);
        setCookie("login_block_until", blockUntil, 0.0167); // 1분 동안 유효한 쿠키
        const loginStatusElement = document.getElementById("login_status");
        if (loginStatusElement) {
            loginStatusElement.textContent = `로그인 제한 상태 (실패 횟수: ${login_fail_cnt})`;
        }
    } else {
        const loginStatusElement = document.getElementById("login_status");
        if (loginStatusElement) {
            loginStatusElement.textContent = `로그인 실패 (실패 횟수: ${login_fail_cnt})`;
        }
    }
}

function login_count() {
    let login_cnt = getCookie("login_cnt");
    if (login_cnt) {
      login_cnt = parseInt(login_cnt) + 1;
    } else {
      login_cnt = 1;
    }
    setCookie("login_cnt", login_cnt, 1); // 1일 동안 유효한 쿠키
  }
  
  function logout_count() {
    let logout_cnt = getCookie("logout_cnt");
    if (logout_cnt) {
      logout_cnt = parseInt(logout_cnt) + 1;
    } else {
      logout_cnt = 1;
    }
    setCookie("logout_cnt", logout_cnt, 1); // 1일 동안 유효한 쿠키
  }
  
  document.getElementById("login_btn").addEventListener('click', function() {
    // 로그인 처리 로직
    login_count(); // 로그인 횟수 증가
    check_input(); // 기존 로그인 처리 함수 호출
    login_failed(); // 로그인 실패 처리 함수 호출
    session_set('user@example.com'); // 세션 생성 (이메일은 예시)
  });

  function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
  
    if (emailInput && idsave_check) {
      let get_id = getCookie("id");
      if (get_id) {
        emailInput.value = get_id;
        idsave_check.checked = true;
      }
      // session_check(); // session_check 함수가 정의되어 있지 않아 주석 처리
    }
  }
  // 로그인 성공 시
function login_success(email) {
  session_set('user@example.com', new Date().getTime()); // 로그인 시간 저장
}

// 페이지 접속 시
function check_login_time() {
  const loginTime = session_get('login_time');
  if (loginTime) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - loginTime;
    const maxLoginTime = 5 * 60 * 1000; // 5분

    if (elapsedTime > maxLoginTime) {
      alert('자동 로그아웃 되었습니다.');
      logout();
    }
  }
}

// 로그아웃 버튼 클릭 시
function logout() {
  session_clear(); // 세션 삭제
  setCookie('id', '', -1); // 쿠키 삭제
  window.location.href = '/'; // 로그아웃 페이지로 이동
}

// 페이지 로드 시 로그인 시간 확인
window.onload = function() {
  check_login_time();
};

  window.onload = init;
  
