// 변수 선언
let attempts = 0;
let index = 0;
let timer;

function appStart() {
  // 게임오버 시 displayGameOver함수로 메시지 출력
  const displayGameOver = () => {
    const div = document.createElement("div");
    div.innerText = "정답입니다!!!";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:35vh; left:43.3vw; width:200px; height:150px; background-color:white; border:3px solid black; border-radius:20px";
    document.body.appendChild(div);
  };

  // 게임이 끝났을때 gameOver함수
  const gameOver = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameOver();
    clearInterval(timer);
  };

  // 알파벳 5개 입력 후 엔터키 누르면 다음 줄로 이동하는 nextLine함수
  // attempts가 6이면 gameOver함수호출하고 아니면 attempts에 1을 올려준 후 index에 0을 넣는다.
  const nextLine = () => {
    if (attempts === 6) {
      return gameOver();
    }
    attempts += 1;
    index = 0;
  };

  // 엔터키 누를 때 함수
  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;

    // 서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer");
    const 정답_객체 = await 응답.json();
    const 정답 = 정답_객체.answer;
    const animation_duration = 500;

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-columm[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];

      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#C9B458";
      } else block.style.background = "#787C7E";

      block.classList.add("animated");
      block.style.animationDelay = `${(i * animation_duration) / 2}ms`;
      block.style.color = "white";
    }

    if (맞은_갯수 === 5) {
      gameOver();
    } else {
      nextLine();
    }
  };

  // 백스페이스 함수
  const handleBackspace = () => {
    // index가 0보다 클때만 board-columm의 index-1의 텍스트를 공백으로 바꾼다.
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-columm[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }

    if (index !== 0) {
      index -= 1;
    }
  };

  // 키 입력 시 함수
  const handleKeydown = (event) => {
    //event변수의 key를 대문자로 호출
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;

    // board-columm의 data-index요소를 attempts, index순으로 맞는 것을 호출
    const thisBlock = document.querySelector(
      `.board-columm[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") {
      handleBackspace();
    } else if (index === 5) {
      // 인덱스가 5일 때 엔더키가 눌리면 handleEnterKey함수를 호출하고 아니면 리턴
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (keyCode >= 65 && keyCode <= 90) {
      // 키보드를 눌렸을 때 키코드가 영문자라면 board-columm의 data-index의 index값을 1 늘린다.
      thisBlock.innerText = key;
      index = index + 1;
    }
  };

  // 타이머 작성
  const StartTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString();
      const 초 = 흐른_시간.getSeconds().toString();
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${분.padStart(2, "0")}:${초.padStart(2, "0")}`;
    }

    timer = setInterval(setTime, 1000);
  };

  // 타이머 실행
  StartTimer();

  // 키다운했을때 handleKeydown함수 실행
  window.addEventListener("keydown", handleKeydown);
}

appStart();
