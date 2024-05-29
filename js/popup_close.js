var close_time; 
var close_time2 = 50; //10초 설정

clearTimeout(close_time);
close_time= setTimeout("close_window()", 50000); // 1/1000 초 지정 ,바로 시작
show_time();

function show_time(){
    let divClock = document.getElementById('Time')
    divClock.innerText = close_time2;
    close_time2--;
    setTimeout(show_time, 1000);
}

function close_window() {
    window.close();
}