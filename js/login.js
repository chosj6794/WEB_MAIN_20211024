document.addEventListener('DOMContentLoaded', function() {
    var element = document.getElementById('elementId');
    if (element) {
      console.log(element.value);
    } else {
      console.log('요소를 찾을 수 없습니다.');
    }
  });
  
const check_input = () => {
    const idsave_check = document.getElementById('idSaveCheck');
    const loginForm = document.getElementById('login_form');
    const loginBtn = document.getElementById('login_btn');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const c = '아이디, 패스워드를 체크합니다';
    alert(c);
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        return false;
    }
    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        return false;
    }
    if (emailValue.length < 5) {
        alert('아이디는 최소 5글자 이상 입력해야 합니다.');
        return false;
    }
    if (passwordValue.length < 12) {
        alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
        return false;
    }
    const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        return false;
    }
    const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
    const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        return false;
    }

    // XSS 방지
    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);
    if (!sanitizedEmail || !sanitizedPassword) {
        return false;
    }

    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);

    if (idsave_check.checked) { // 아이디 체크 o
        alert("쿠키를 저장합니다.", emailValue);
        setCookie("id", emailValue, 1); // 1일 저장
        alert("쿠키 값 :" + emailValue);
    } else { // 아이디 체크 x
        setCookie("id", "", 0); // 날짜를 0으로 설정하여 쿠키 삭제
    }
    loginForm.submit();
};

document.getElementById("login_btn").addEventListener('click', check_input);


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

function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + 
    "; expires=" + date.toUTCString() + "; path=/; SameSite=None; Secure";
}

function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie != "") {
        var cookie_array = cookie.split("; ");
        for (var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] == "id") {
                return cookie_name[1];
            }
        }
    }
    return;
}

function init() { // 로그인 폼에 쿠키에서 가져온 아이디 입력
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");
    if (get_id) {
        emailInput.value = get_id;
        idsave_check.checked = true;
    }
    session_check(); // 세션 유무 검사
}

// 아래 코드가 문제가 되므로 수정합니다.
const emailInput = document.getElementById('typeEmailX');
const passwordInput = document.getElementById('typePasswordX');

if (emailInput.value.length === 0 || passwordInput.value.length === 0) {
    alert("아이디와 비밀번호를 모두 입력해주세요.");
} else {
    session_set(); // 세션 생성
    const form = document.getElementById('login_form');
    form.submit();
}

function session_set() { // 세션 저장
    let session_id = document.querySelector("#typeEmailX"); // DOM 트리에서 ID 검색
    let session_pass = document.querySelector("#typePasswordX"); // DOM 트리에서 pass 검색
    if (sessionStorage) {
        let en_text = encrypt_text(session_pass.value);
        sessionStorage.setItem("Session_Storage_id", session_id.value);
        sessionStorage.setItem("Session_Storage_pass", en_text);
    } else {
        alert("로컬 스토리지 지원 x");
    }
}

function session_get(key) { // 세션 읽기
    if (sessionStorage) {
        return sessionStorage.getItem(key);
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function session_check() { // 세션 검사
    if (sessionStorage.getItem("Session_Storage_id") && sessionStorage.getItem("Session_Storage_pass")) {
        alert("이미 로그인 되었습니다.");
        location.href = '../login/index_login.html'; // 로그인된 페이지로 이동
    }
}

function session_del() { // 세션 삭제
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_id");
        sessionStorage.removeItem("Session_Storage_pass");
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function logout() {
    session_del(); // 세션 삭제
    location.href = '../index.html';
}

document.getElementById("login_btn").addEventListener('click', check_input);

function init_logined() {
    if (sessionStorage) {
        let decryptedText = decrypt_text();
        console.log(decryptedText); // 복호화된 텍스트를 콘솔에 출력
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function encodeByAES256(key, data) {
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(""),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return cipher.toString();
}

function decodeByAES256(key, data) {
    const cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(""),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return cipher.toString(CryptoJS.enc.Utf8);
}

function encrypt_text(password) {
    const k = "key"; // 클라이언트 키
    const rk = k.padEnd(32, " "); // AES256은 key 길이가 32
    const b = password;
    const eb = encodeByAES256(rk, b);
    console.log(eb);
    return eb;
}

function decrypt_text() {
    const k = "key"; // 서버의 키
    const rk = k.padEnd(32, " "); // AES256은 key 길이가 32
    const eb = session_get("Session_Storage_pass");
    if (eb) {
        const b = decodeByAES256(rk, eb);
        return b;
    } else {
        alert("복호화할 데이터가 없습니다.");
        return null;
    }
}
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