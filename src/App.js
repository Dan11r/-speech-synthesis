import logo from './logo.svg'
import './App.css'
import React, { useState } from 'react'
import axios from 'axios'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

function App() {
  const [text, setText] = React.useState('Введите текст')
  const [rate, setRate] = React.useState(1)
  const [pitch, setPitch] = React.useState(1)

  let playBtn = React.useRef(null)
  let article = React.useRef(null)

  React.useEffect(() => {
    getMovies()
  }, [])

  async function getMovies() {
    const mer = await axios.get('https://yts.mx/api/v2/list_movies.json')
    console.log(mer)
  }

  function stopSpeak() {
    window.speechSynthesis.cancel()
  }

  function speak(text) {
    const message = new SpeechSynthesisUtterance()
    message.lang = 'ru-RU'
    // голос женский
    message.voice = getVoice('Yuri')
    // или мужской
    // message.voice = getVoice("Yuri");
    message.text = text
    // тембр и скорость по вкусу
    message.pitch = pitch
    message.rate = rate
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

  function btnPlay(e) {
    console.log(playBtn)
    if (playBtn.current.dataset.playing != undefined) {
      window.speechSynthesis.pause()
      delete playBtn.current.dataset.playing
      playBtn.current.innerHTML = '▶️'
    } else {
      window.speechSynthesis.resume()
      playBtn.current.dataset.playing = ''
      playBtn.current.innerHTML = '⏸️'
    }
  }

  function btnSpeak() {
    const sentences = splitArticle(article.current.children)
    playBtn.current.style.display = null
    for (const sentence of sentences) {
      speak(sentence)
    }
  }

  return (
    <div className="App">
      <div className="controlers">
        <Button variant="contained" onClick={() => btnSpeak()} id="speak">
          🎧 Слушать
        </Button>
        <Button ref={playBtn} onClick={btnPlay} id="playpause" data-playing>
          ⏸️
        </Button>
        <Button onClick={stopSpeak} id="stop">
          X
        </Button>
      </div>
      <div className="settings">
        <Typography id="input-slider" gutterBottom>
          Скорость
        </Typography>
        <Slider
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          aria-label="rate"
          valueLabelDisplay="auto"
          step={0.1}
          min={0.1}
          max={10}
        />
        <Typography id="input-slider" gutterBottom>
          Тон
        </Typography>
        <Slider
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          aria-label="pitch"
          valueLabelDisplay="auto"
          step={0.1}
          min={0.1}
          max={2}
        />
      </div>
      <div>
        <TextField
          id="outlined-multiline-flexible"
          label="Текст для чтения"
          multiline
          maxRows={10}
          value={text}
          sx={{ width: '95vw' }}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <article ref={article}>
        <Typography mt={5} variant="h6" gutterBottom>
          {text}
        </Typography>
      </article>
    </div>
  )
}

export default App
