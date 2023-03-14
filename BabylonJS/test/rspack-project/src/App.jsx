import './App.css'
import React from 'react'
import BasicScene from './BasicScene'

class App extends React.Component {
  componentDidMount() {
    const renderCanvas = document.getElementById('renderCanvas')

		new BasicScene(renderCanvas)
  }

  render() {
    return (
      <div className="App">
        <canvas id="renderCanvas"></canvas>
      </div>
    )
  }
}

export default App
