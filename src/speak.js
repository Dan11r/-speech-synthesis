function speak(text) {
  const message = new SpeechSynthesisUtterance()
  message.lang = 'ru-RU'
  // голос женский
  message.voice = getVoice('Milena')
  // или мужской
  // message.voice = getVoice("Yuri");
  message.text = text
  // тембр и скорость по вкусу
  message.pitch = 0.8
  message.rate = 0.9
  window.speechSynthesis.speak(message)
}

function getVoice(name) {
  const voices = window.speechSynthesis.getVoices()
  for (const voice of voices) {
    if (voice.name == name) {
      return voice
    }
  }
  return null
}

function printVoices() {
  const voices = window.speechSynthesis.getVoices()
  for (const voice of voices) {
    if (voice.lang == 'ru-RU') {
      console.log(voice)
    }
  }
}

function splitArticle(elems) {
  const sentences = []
  for (const el of elems) {
    const par = splitParagraph(el)
      .map((s) => s.trim())
      .filter((s) => s.trim().length > 0)
    sentences.push(...par)
  }
  return sentences
}

function splitParagraph(el) {
  return el.innerText.split(/[.?!;:]/)
}

const btnSpeak = document.querySelector('#speak')
const btnPlay = document.querySelector('#playpause')
const article = document.querySelector('#article')

btnPlay.addEventListener('click', () => {
  if (btnPlay.dataset.playing != undefined) {
    window.speechSynthesis.pause()
    delete btnPlay.dataset.playing
    btnPlay.innerHTML = '▶️'
  } else {
    window.speechSynthesis.resume()
    btnPlay.dataset.playing = ''
    btnPlay.innerHTML = '⏸️'
  }
})

btnSpeak.addEventListener('click', () => {
  const sentences = splitArticle(article.children)
  btnPlay.style.display = null
  for (const sentence of sentences) {
    speak(sentence)
  }
})

window.speechSynthesis.getVoices()
