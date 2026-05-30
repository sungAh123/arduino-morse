#define BUZZER_PIN 8

// 타이밍(단위: ms)
#define DOT_DURATION 150    // 점의 길이
#define DASH_DURATION 450   // 선(-)의 길이
#define GAP_DURATION 150    // 점과 선 사이의 무음 간격
#define LETTER_GAP_DURATION 450 // 글자 사이의 무음 간격
#define WORD_GAP_DURATION 1050  // 단어 사이의 무음 간격 

// 모스 부호 정의 (A-Z)
const char* morseCodeLetters[] = {
  ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", // A-I
  ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", // J-R
  ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.." // S-Z
};

// 모스 부호 정의 (0-9)
const char* morseCodeDigits[] = {
  "-----", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----." // 0-9
};

void dot() {
    tone(BUZZER_PIN, 800); // 800 Hz
    delay(DOT_DURATION);
    noTone(BUZZER_PIN);
    delay(GAP_DURATION);
}

void dash() {
    tone(BUZZER_PIN, 800); // 800 Hz
    delay(DASH_DURATION);
    noTone(BUZZER_PIN);
    delay(GAP_DURATION);
}

void playMorseCode(const char* code) {
    for (int i = 0; code[i] != '\0'; i++) {
        if (code[i] == '.') {
            dot();
        } else if (code[i] == '-') {
            dash();
        }
    }
}

// 단일 문자를 모스 부호로 재생하는 함수
void playChar(char c) {
    // 공백인 경우 단어 사이의 간격을 적용
   if (c==' ') {
        delay(WORD_GAP_DURATION);
        return;
    }

    // 모스 부호 문자열을 저장할 포인터
    const char* code = nullptr;
    
    if (c >= 'A' && c <= 'Z') {
        code = morseCodeLetters[c - 'A'];
    } else if (c >= 'a' && c <= 'z') {
        code = morseCodeLetters[c - 'a'];
    } else if (c >= '0' && c <= '9') {
        code = morseCodeDigits[c - '0'];
    }
    
    // 모스 부호가 존재하는 경우에만 재생
    if (code != nullptr) {
        playMorseCode(code);
        delay(LETTER_GAP_DURATION);
    }
}

// 입력된 문자열을 모스 부호로 재생하는 함수
void playText(String text) {
    for (int i = 0; text[i] != '\0'; i++) {
        playChar(text[i]);
    }
}

void setup() {
    pinMode(BUZZER_PIN, OUTPUT);
    Serial.begin(9600);
    Serial.println("Reday");
}

void loop() {
    if (Serial.available()) {
        String input = Serial.readStringUntil('\n');
        inpupt.trim(); // 입력 문자열의 앞뒤 공백 제거

        if (input.length() > 0) {
            Serial.print("Playing Morse Code for: ");
            Serial.println(input);
            playText(input);
            Serial.println("Done");
        }
    }
}