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
}

// 페이지 로드 시 init 함수 호출
window.onload = init;