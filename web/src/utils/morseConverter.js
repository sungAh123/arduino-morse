// 타이밍(단위: ms)
const DOT_DURATION = 150;    // 점의 길이
const DASH_DURATION = 450;   // 선(-)의 길이
const GAP_DURATION = 150;    // 점과 선 사이의 무음 간격
const LETTER_GAP_DURATION = 450; // 글자 사이의 무음 간격
const WORD_GAP_DURATION = 1050;  // 단어 사이의 무음 간격 

const morseCodeLetters = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".",
  "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---",
  "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---",
  "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-",
  "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--",
  "Z": "--.."
};

const morseCodeDigits = {
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----."
};

// 텍스트를 모스 부호로 변환하는 함수
export function toMorse(text) {
    return text.toUpperCase().split("").map(c => {
        if (c === " ")  return " / "; 
        return morseCodeLetters[c] || morseCodeDigits[c] || "?";
    }).join(" ");
}

// 모스 부호의 총 지속 시간을 계산하는 함수
export function calcMorseDuration(text) {
  let duration = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();

    // 공백 문자면 단어 간격 추가 후 다음 문자로
    if (char === " ") {
      duration += WORD_GAP_DURATION;
      continue;   
    } 

    // 해당 문자의 모스 부호 가져오기
    const code = morseCodeLetters[char] || morseCodeDigits[char];
    if (!code) continue;

    // 각 기호(점/선)의 재생 시간 + 기호 간격 누적
    for (const symbol of code) {
      if (symbol === ".") {
        duration += DOT_DURATION + GAP_DURATION;  // 점 + 무음
      } else if (symbol === "-") {
        duration += DASH_DURATION + GAP_DURATION; // 선 + 무음
      }
    }
      duration += LETTER_GAP_DURATION;
  }

    return duration;  
}