const search_message = () => {
    let message = '검색을 수행합니다';
    alert(message);
};

document.addEventListener('click', search_message);

const searchButton = document.getElementById("search_button_msg")
if (searchButton) {
    searchButton.addEventListener('click', () => {

    });
}
function googleSearch() {
    const searchTerm = document.getElementById("search_input").value; // 검색어로 설정
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    // 새 창에서 구글 검색을 수행
    window.open(googleSearchUrl, "_blank"); // 새로운 창에서 열기.
    return false;
    }
const search_message2 = () => {
    const c = '검색을 수행합니까?';
    alert(c);
};    

document.addEventListener('click', search_message);
const search_message3 = () => {
    const c = '검색을 수행함';
    alert(c);
};    

document.addEventListener('click', search_message);

