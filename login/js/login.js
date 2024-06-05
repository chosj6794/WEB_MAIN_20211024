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
    const loginBtn = document.getElementById('login_btn');
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
    loginForm.submit();
};

document.getElementById("login_btn").addEventListener('click', check_input);
