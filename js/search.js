const search_message = () => {
    let message = '검색을 수행합니다';
    alert(message);
};

document.addEventListener('click', search_message);

const searchButton = document.getElementById("search_button_msg")
if (searchButton) {
    searchButton.addEventListener('click', () => {
        googleSearch();
    });
}

function googleSearch() {
    const searchTerm = document.getElementById("search_input").value; // 검색어로 설정

    // 공백 검사
    if (searchTerm.length === 0) {
        alert("검색어를 입력해주세요.");
        return;
    }

    // 비속어 검사
    const badWords = ['욕설1', '욕설2', '욕설3', '욕설4', '욕설5'];
    for (let i = 0; i < badWords.length; i++) {
        if (searchTerm.includes(badWords[i])) {
            alert("부적절한 검색어입니다.");
            return;
        }
    }

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    // 새 창에서 구글 검색을 수행
    window.open(googleSearchUrl, "_blank"); // 새로운 창에서 열기.
    return false;
}

const search_message2 = () => {
    const c = '검색을 수행합니까?';
    alert(c);
};    

document.addEventListener('click', search_message2);

const search_message3 = () => {
    const c = '검색을 수행함';
    alert(c);
};    

document.addEventListener('click', search_message3);


