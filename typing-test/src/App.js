import {useState, useEffect, useRef} from "react";
import {generate}  from 'random-words'
import './app.css'

const NUMB_OF_WORDS = 200
const SECONDS = 20000
function App() {
    // Это для генерации рандомного текста на английском
    const [words, setWords] = useState([])
    // Это для изменения цвета для счетчика таймера
    const [color, setColor] = useState(false)
    // Здесь хранится введенные данных с Input
    const [currInput, setCurrInput] = useState('')
    // Это таймер
    const [countDown, setCountDown] = useState(SECONDS)
    // отслеживания текущего индекса символа
    const [currCharIndex, setCurrCharIndex] = useState(-1)
    const [currWordIndex, setCurrWordIndex] = useState(0)
    const [correct, setCorrect] = useState(0)
    const [incorrect, setIncorrect] = useState(0)
    const [currChar, setCurrChar] = useState('')
    const [status, setStatus] = useState('waiting')
    const textInput = useRef(null)
    const [colorSymbol, setColorSymbol] = useState('')

    useEffect(() => {
        setWords(generateWords())
    }, [])

    useEffect(() => {
        if(status === 'started'){
            textInput.current.focus()
        }
    })

    function generateWords(){
        return new Array(NUMB_OF_WORDS).fill(null).map(() => generate())
    }

    function start() {
        setColor(true)
        if(status === 'finished'){
            setWords(generateWords())
            setCurrWordIndex(0)
            setCorrect(0)
            setIncorrect(0)
            setCurrCharIndex(-1)
            setCurrChar('')
        }
        if(status !== 'started'){
            setStatus('started')
            let interval = setInterval(() => {
                setCountDown((prevCountDown) => {
                    if (prevCountDown === 0)
                    {
                        clearInterval(interval)
                        setStatus('finished')
                        setCurrInput('')
                        return SECONDS
                    } else {
                        return prevCountDown - 1
                    }

                })
            }, 1000)
        }

    }

    function handleKeyDown({keyCode, key}) {
        // ключ пробела
        if(keyCode===32){
            checkMatch()
            setCurrInput('')
            setCurrWordIndex(currWordIndex + 1)
            setCurrCharIndex(-1)
            console.log(`currWordIndex - ${currWordIndex}`)
            console.log(`currCharIndex - ${currCharIndex}`)
        //     backspace
        } else if(keyCode === 8){
            setCurrCharIndex(currCharIndex - 1)
            console.log(`currCharIndex - ${currCharIndex}`)

            setCurrChar('')
        } else {
            setCurrCharIndex(currCharIndex + 1)
            setCurrChar(key)
        }
    }

    function checkMatch(){
        const wordToCompare = words[currWordIndex]
        const doesItMatch = wordToCompare === currInput.trim()
        console.log(`currWordIndex - ${currWordIndex}`)
        console.log(`wordToCompare - ${wordToCompare}`)
        if(doesItMatch){
            setCorrect(correct + 1)
            console.log(`setCorrect - ${setCorrect}`)
        } else {
            console.log(`setIncorrect - ${setIncorrect}`)

            setIncorrect(incorrect + 1)
        }
    }

    function getCharClass(wordIdx, charIdx, char){
        // Этот блок проверят находится ли текущий символ в процессе ввода пользователя(не завершен ли ввод) и сравнивает текущий символ
        if(wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== 'finished') {
            console.log(currChar)
            if (char === currChar) {
                return 'has-text-success'
            } else if (char !== currChar){
                return 'has-text-danger'
            }
        }



            else if(wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
                return 'has-text-danger';

            }
    }


  return (
    <div className="App">
        <div className="section">
            <div className={`is-size-1 has-text-centered  ${color === true? 'has-text-danger': 'has-text-primary'}`}>
                <h2>{countDown}</h2>
            </div>
        </div>
        <div className="control is-expanded section">

            {status === 'started' && (
                <div className='section'>
                    <div className="card">
                        <div className="card-content">
                            <div className="content">
                                <input ref={textInput} disabled={status !== 'started'} type="text" className={'typing__input'} onKeyDown={handleKeyDown} value={currInput} onChange={
                                    (e) => setCurrInput(e.target.value)}
                                       placeholder={''}
                                />
                                <div className={'break-word'}>
                                    {words.map((word, i) => (

                                        <span key={i}>
                                <span className={``}>
                                    {word.split('').map((char, idx) => (
                                        <>
                                            <span className={`${colorSymbol}  is-size-3` } key={idx}>{char}</span>
                                        </>

                                    )) }
                                    <span> </span>
                                </span>
                            </span>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div className="section">
            <button className={'button is-info is-fullwidth'} onClick={start}>
                Start
            </button>
        </div>

        {status=== 'finished' && (
            <div className="section">
                <div className="columns">
                    <div className="column has-text-centered">
                        <p className="is-size-5">Words per minute:</p>
                        <p className="has-text-primary is-size-1">
                            {correct / 5}
                        </p>
                    </div>
                    <div className="column has-text-centered">
                        <div className="is-size-5">Accuracy:</div>
                        <p className="has-text-info is-size-1">
                            {Math.round((correct / (correct + incorrect)) * 100)} %
                        </p>
                    </div>
                </div>
            </div>

        )}
    </div>

  );
}

export default App;
