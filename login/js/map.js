var markers = [];
document.addEventListener('DOMContentLoaded', function() {
    kakao.maps.load(function() {
        var mapContainer = document.getElementById('map'),
            mapOption = {
                center: new kakao.maps.LatLng(37.38029941039906, 126.92766162755456),
                level: 3
            };

        var map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성 및 객체 리턴

        // 장소 검색 객체를 생성합니다
        var ps = new kakao.maps.services.Places();

        // 키워드 검색을 처리하는 함수
        window.searchPlaces = function() {
            var keyword = document.getElementById('keyword').value;
            if (!keyword.replace(/^\s+|\s+$/g, '')) {
                alert('키워드를 입력해주세요!');
                return false;
            }
            ps.keywordSearch(keyword, placesSearchCB); 
        }

        // 키워드 검색 완료 시 호출되는 콜백 함수
        function placesSearchCB(data, status) {
            if (status === kakao.maps.services.Status.OK) {
                var bounds = new kakao.maps.LatLngBounds();

                var listEl = document.getElementById('placesList');
                listEl.innerHTML = '';

                for (var i = 0; i < data.length; i++) {
                    displayMarker(data[i]);
                    var itemEl = getListItem(i, data[i]);
                    listEl.appendChild(itemEl);
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }

                map.setBounds(bounds);
            }
        }

        // 검색 결과 목록 아이템 생성
        function getListItem(index, places) {
            var el = document.createElement('li');
            el.innerHTML = '<span>' + places.place_name + '</span>';
            return el;
        }

        // 지도에 마커를 표시하는 함수
        function displayMarker(place) {
            var marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x)
            });
            markers.push(marker);
        }
    });
});


