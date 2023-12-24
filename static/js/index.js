let attempts = 0;
let index = 0;
let timer;

function appStart() {
  // 게임오버 시 메시지 출력
  const displayGameOver = () => {
    const div = document.createElement("div");
    div.innerText = "정답입니다!!!";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:35vh; left:43.3vw; width:200px; height:150px; background-color:white; border:3px solid black; border-radius:20px";
    document.body.appendChild(div);
  };

  // 게임오버 함수
  const gameOver = () => {
    window.removeEventListener("keydown", handleKeydown); //게임 오버하면 이벤트 리스너를 지움
    displayGameOver();
    clearInterval(timer);
  };

  // 알파벳 5개 입력 후 엔터키 누르면 다음 줄로 이동하는 함수
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
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;

    const thisBlock = document.querySelector(
      `.board-columm[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") {
      handleBackspace();
    } else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (keyCode >= 65 && keyCode <= 90) {
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
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${분}:${초}`;
    }

    timer = setInterval(setTime, 1000);
  };

  StartTimer();
  window.addEventListener("keydown", handleKeydown);
}

appStart();
