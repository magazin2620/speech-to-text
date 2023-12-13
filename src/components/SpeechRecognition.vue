<script setup>
import { dictionary } from '../data/dictionary';
import { addWordFromDictionary } from '../utils/addWordFromDictionary'
import { removeWhitespace } from '../utils/removeWhitespace'
import { ref } from "vue"

let recognizing = ref(false)
let finalTranscript = ref('')
const finalText = ref('')
const interimText = ref('')
const copyButtonText = ref('Копировать')


const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new speechRecognition()
recognition.continuous = true
recognition.interimResults = true
recognition.maxAlternatives = 3
recognition.lang = 'ru-RU'


recognition.onstart = () => {
  console.log('Recognition started')
}
recognition.onerror = ({ error }) => {
  console.error(error)
}
recognition.onend = () => {
  console.log('Recognition stopped')
  if (!recognizing) return
  recognition.start()
}

recognition.onresult = (e) => {
  let interimTranscript = ''
  for (let i = e.resultIndex; i < e.results.length; i++) {
    if (e.results[i].isFinal) {
      const transcript = addWordFromDictionary(e.results[i][0].transcript)
      finalTranscript += transcript
    } else {
      interimTranscript += e.results[i][0].transcript
    }
  }
  interimText.value = interimTranscript
  finalText.value = removeWhitespace(finalTranscript)
}


function startRecognition() {
  finalTranscript = ''
  recognizing = true
  recognition.start()
  finalText.value = ''
  interimText.value = ''
}

function stopRecognition() {
  recognizing = false
  recognition.stop()
}

function copyText() {
  navigator.clipboard.writeText(finalText.value)
  copyButtonText.value = 'Скопировано'
  const timerId = setTimeout(() => {
    copyButtonText.value = 'Копировать'
    clearTimeout(timerId)
  }, 3000)
}

function clearText() {
  finalTranscript = ''
  finalText.value = ''
}

</script>

<template>
  <div class="wrapper">
    <h1>Преобразование речи в текст</h1>

    <textarea class="final-text" v-model="finalText" cols="30" rows="10"></textarea>
    <input class="interim-text" type="text" v-model="interimText" />

    <div class="buttons">
      <button @click="startRecognition">Старт</button>
      <button @click="stopRecognition">Стоп</button>
      <button @click="copyText">{{ copyButtonText }}</button>
      <button @click="clearText">Очистить</button>
    </div>

    <p class="info">
      Для добавления знаков пунктуации, скажи: <br>
      "точка", "запятая", "вопрос", "восклицание", "двоеточие", "тире", "абзац", "пробел".
    </p>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira sans', sans-serif;
}

h1 {
  margin-bottom: 20px;
  font-size: 42px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 700px;
}

.final-text {
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;

}

.interim-text {
  width: 100%;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 40px;
}

button {
  padding: 10px 20px;
}
</style>

