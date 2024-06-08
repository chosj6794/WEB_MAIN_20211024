
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
function decrypt_text() {
    const k = "key"; // 서버의 키
    const rk = k.padEnd(32, " "); // AES256은 key 길이가 32
    const eb = session_get();
    if (eb !== null) {
      const b = this.decodeByAES256(rk, eb);
      console.log(b);
    } else {
      console.error("세션 스토리지에 저장된 값이 없습니다.");
    }
  }
  
  function init_logined() {
    if (sessionStorage) {
      decrypt_text(); // 복호화 함수
    } else {
      alert("세션 스토리지가 지원되지 않습니다.");
    }
  }
  function join() {
    let form = document.querySelector("#form_main");
    let f_name = document.querySelector("#firstName");
    let l_name = document.querySelector("#lastName");
    let b_day = document.querySelector("#birthdayDate");
    let gender = document.querySelector("#inlineRadioOptions");
    let email = document.querySelector("#emailAddress");
    let p_number = document.querySelector("#phoneNumber");
    let class_check = document.querySelector(".select form-control-lg");
  
    form.action = "../login/index_join.html";
    form.method = "get";
  
    if (f_name.value.length === 0 || l_name.value.length === 0 || b_day.value.length === 0 || email.value.length === 0 || p_number.value.length === 0) {
      alert("회원가입 폼에 필수 정보를 입력해주세요.(성별, 분반 제외)");
    } else {
      session_join_set(); // 회원가입용 세션 생성
      form.submit();
    }
  }
  