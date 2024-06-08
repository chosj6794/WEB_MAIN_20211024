function session_set() {
    let id = document.querySelector("#floatingInput");
    let password = document.querySelector("#floatingPassword");
  
    if (!id || !password) {
      console.error("요소를 찾을 수 없습니다.");
      return;
    }
  
    let random = new Date().getTime(); // 랜덤 타임스탬프
  
    const obj = {
      id: id.value,
      otp: random
    };
  
    if (sessionStorage) {
      const objString = JSON.stringify(obj); // 객체 -> JSON 문자열 변환
      let en_text = encrypt_text(objString); // 암호화
      sessionStorage.setItem("Session_Storage_object", en_text);
    } else {
      alert("세션 스토리지가 지원되지 않습니다.");
    }
  }
  
function session_get() { //세션 읽기
    if (sessionStorage) {
       return sessionStorage.getItem("Session_Storage_encrypted");
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function session_check() { // 세션 검사
    let session = session_get();
    if (session && session.id) { // 세션 값이 있는지 검사
        alert("이미 로그인 되었습니다.");
        location.href = '../login/index_login.html'; // 로그인된 페이지로 이동
    }
}

function logout() {
    session_del(); // 세션 삭제
    location.href = '../index.html';
}

function session_del() { // 세션 삭제
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_object");
    } else {
        alert("세션 스토리지가 지원되지 않습니다.");
    }
}

function session_join_set(){ //세션 저장(객체)    
    let f_name = document.querySelector("#firstName").value;
    let l_name = document.querySelector("#lastName").value;
    let b_day = document.querySelector("#birthdayDate").value;
    let gender = document.querySelector("#inlineRadioOptions");
    let email = document.querySelector("#emailAddress").value;
    let p_number = document.querySelector("#phoneNumber").value;
    let class_check = document.querySelector(".select form-control-lg");
    let random = new Date(); // 랜덤 타임스탬프
     
     const newSignUp = new SignUp(f_name, l_name, b_day, gender, email, p_number, class_check, random);
     console.log(newSignUp.fullName); // John Doe
     console.log(newSignUp.contactInfo); // johndoe@email.com 123-456-7890
     
     if (sessionStorage) {
     const objString = JSON.stringify(newSignUp); // 객체 -> JSON 문자열 변환
     let en_text = encrypt_text(objString); // 암호화
     sessionStorage.setItem("Session_Storage_new_user", objString);
     sessionStorage.setItem("Session_Storage_new_user_encryted", en_text);
     } else {
    alert("세션 스토리지 지원 x");
     }  
    }