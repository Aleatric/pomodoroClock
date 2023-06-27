import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import beepSound from './sounds/blue-lobster.wav';
import lobsterImage from "./images/blue-lobster.jpg";

class PomodoroClock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionLength: 25,
            breakLength: 5,
            timeLeft: 25 * 60,
            timerType: 'Session',
            timerRunning: false,
            intervalID: null,
            timerFinished: false,
            isAudioPlaying: false,
        }
    }

    incrementLength = (type) => {
        if (this.state.timerRunning) return;
        this.setState(prevState => {
            let value = prevState[type];
            if (value < 60) {
                let newState = { [type]: value + 1 };
                if (prevState.timerType.toLowerCase() === type) {
                    newState.timeLeft = (value + 1) * 60;
                }
                return newState;
            }
        })
    }

    decrementLength = (type) => {
        if (this.state.timerRunning) return;
        this.setState(prevState => {
            let value = prevState[type];
            if (value > 1) {
                let newState = { [type]: value - 1 };
                if (prevState.timerType.toLowerCase() === type) {
                    newState.timeLeft = (value - 1) * 60;
                }
                return newState;
            }
        })
    }

    toggleTimer = () => {
        if (this.state.timerRunning) {
            clearInterval(this.state.intervalID);
        } else {
            this.setState({
                intervalID: setInterval(this.decrementTimer, 1000),
                timerFinished: false
            });
        }
        this.setState(prevState => ({ timerRunning: !prevState.timerRunning }));
    }

    decrementTimer = () => {
        if (this.state.timeLeft > 0) {
            this.setState(prevState => ({ timeLeft: prevState.timeLeft - 1 }));
        } else {
            this.audioBeep.play();
            this.setState({ isAudioPlaying: true });
            clearInterval(this.state.intervalID);
            const nextType = this.state.timerType === 'Session' ? 'Break' : 'Session';
            const nextLength = this.state[nextType.toLowerCase() + 'Length'];
            this.setState({
                timerType: nextType,
                timeLeft: nextLength * 60,
                intervalID: setInterval(this.decrementTimer, 1000),
                timerFinished: true
            });
        }
    }

    reset = () => {
        clearInterval(this.state.intervalID);
        this.audioBeep.pause();
        this.audioBeep.currentTime = 0;
        this.setState({
            sessionLength: 25,
            breakLength: 5,
            timeLeft: 25 * 60,
            timerType: 'Session',
            timerRunning: false,
            intervalID: null,
            timerFinished: false
        });
    }

    formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.timerRunning) {
            if (prevState.sessionLength !== this.state.sessionLength && this.state.timerType === 'Session') {
                this.setState({ timeLeft: this.state.sessionLength * 60 });
            }
            if (prevState.breakLength !== this.state.breakLength && this.state.timerType === 'Break') {
                this.setState({ timeLeft: this.state.breakLength * 60 });
            }
        }
    }

    render() {
        return (
            <div className="bg-warning d-flex align-items-center justify-content-center vh-100">
                <div className="text-center">
                    <h1 className="text-white">Pomodoro Clock</h1>
                    <div className="d-flex justify-content-center align-items-center">
                        <div>
                            <h2 className="text-white">Session Length</h2>
                            <h2 className="text-white">{this.state.sessionLength}</h2>
                            <div>
                                <button className="btn btn-outline-danger" onClick={() => this.decrementLength('sessionLength')}>-</button>
                                <button className="btn btn-outline-danger" onClick={() => this.incrementLength('sessionLength')}>+</button>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center position-relative"
                            style={{ border: '0.06em solid red', borderRadius: '50%', width: '200px', height: '200px', padding: '1em', margin: '0 2em' }}>
                            <div>
                                <h2 className="text-white">{this.state.timerType}</h2>
                                <h1 className="text-white">{this.formatTime(this.state.timeLeft)}</h1>
                            </div>
                            <div style={{ position: 'absolute', bottom: '-50px', width: '100%', textAlign: 'center' }}>
                                <button class="btn btn-outline-danger" onClick={this.toggleTimer} style={{ marginRight: '10px' }}>
                                    {this.state.timerRunning ? 'Pause' : 'Start'}
                                </button>
                                <button class="btn btn-outline-danger" onClick={this.reset}>Reset</button>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-white">Break Length</h2>
                            <h2 className="text-white">{this.state.breakLength}</h2>
                            <div>
                                <button className="btn btn-outline-danger" onClick={() => this.decrementLength('breakLength')}>-</button>
                                <button className="btn btn-outline-danger" onClick={() => this.incrementLength('breakLength')}>+</button>
                            </div>
                        </div>
                    </div>
                    <audio id="beep"
                        preload="auto"
                        ref={(audio) => { this.audioBeep = audio; }}
                        src={beepSound}
                        onEnded={() => this.setState({ isAudioPlaying: false })} />
                    <div className="lobster-container">
                        {this.state.isAudioPlaying &&
                            <img src={lobsterImage} className={this.state.timerFinished ? "spin-and-zoom" : ""} alt="Blue Lobster" />
                        }
                    </div>
                </div>
            </div>



        )
    }
}

export default PomodoroClock;