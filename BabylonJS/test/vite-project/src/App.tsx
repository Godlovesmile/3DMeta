import './App.css'
import React from 'react'
import BetterEnv from './BetterEnv'


class App extends React.Component {
  componentDidMount() {
    const renderCanvas = document.getElementById('renderCanvas')

    new BetterEnv(renderCanvas)
  }

  render() {
    return <canvas id="renderCanvas"></canvas>
  }
}

export default App
