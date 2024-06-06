// 전역 변수 추가, 맨 위 위치
const idSaveCheck = document.getElementById('idSaveCheck'); // 오타 수정(' 대신 ` 사용)

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
    alert(c);

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

    console.log('이메일:', sanitizedEmail);
    console.log('비밀번호:', sanitizedPassword);

    // 검사 마무리 단계 쿠키 저장, 최하단 submit 이전
    if(idSaveCheck.checked == true) { // 아이디 체크 o
        alert("쿠키를 저장합니다: " + emailValue);
        setCookie("id", emailValue, 1); // 1일 저장
    } else { // 아이디 체크 x
        setCookie("id", "", -1); // 쿠키 삭제
    }

    session_set(sanitizedEmail); // 세션 생성
    loginForm.submit();
};

document.getElementById("login_btn").addEventListener('click', check_input);

function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/";
}

function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie != "") {
        var cookie_array = cookie.split("; ");
        for (var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] == name) {
                return cookie_name[1];
            }
        }
    }
    return;
}

function init() { 
    // 로그인 폼에 쿠키에서 가져온 아이디 입력
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");
    if(get_id) {
        emailInput.value = get_id;
        idsave_check.checked = true;
    }
    session_check(); // 세션 유무 검사
}

// 페이지 로드 시 init 함수 호출
window.onload = init;

function session_set() { //세션 저장
    let session_id = document.getElementById("typeEmailX"); // DOM 트리에서 ID 검색
    let session_pass = document.getElementById("typePasswordX"); // DOM 트리에서 pass 검색
    if (sessionStorage) {
        let en_text = encrypt_text(session_pass.value); // 패스워드 암호화
        sessionStorage.setItem("Session_Storage_id", session_id.value); // 이메일(ID) 세션에 저장
        sessionStorage.setItem("Session_Storage_pass", en_text); // 암호화된 패스워드 세션에 저장
    } else {
        alert("세션 스토리지가 지원되지 않습니다.");
    }
}


function session_get() { // 세션 읽기
    if (sessionStorage) {
        return sessionStorage.getItem("Session_Storage_pass");
    } else {
        alert("세션 스토리지가 지원되지 않습니다.");
        return null;
    }
}

function session_check() { // 세션 검사
    if (sessionStorage.getItem("Session_Storage_id")) { // "Session_Storage_Email" 키로 저장된 세션 값이 있는지 검사
        alert("이미 로그인 되었습니다.");
        location.href='../login/index_login.html'; // 로그인된 페이지로 이동
    }
}

function logout(){
    session_del(); // 세션 삭제
    location.href='../index.html';
}

function session_del() { // 세션 삭제
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_Email");
    } else {
        alert("세션 스토리지가 지원되지 않습니다.");
    }
}
function encodeByAES256(key, data){
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(""),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
    });
    return cipher.toString();
    }
    function decodeByAES256(key, data){
    const cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(""),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
    });
    return cipher.toString(CryptoJS.enc.Utf8);
    }
function encrypt_text(password){
const k = "key"; // 클라이언트 키
const rk = k.padEnd(32, " "); // AES256은 key 길이가 32
const b = password;
const eb = this.encodeByAES256(rk, b);
return eb;
console.log(eb);
}
function decrypt_text(){
const k = "key"; // 서버의 키
const rk = k.padEnd(32, " "); // AES256은 key 길이가 32
const eb = session_get();
const b = this.decodeByAES256(rk, eb);
console.log(b);
}
function init_logined(){
    if(sessionStorage){
    decrypt_text(); // 복호화 함수
    }
    else{
    alert("세션 스토리지 지원 x");
    }
    }