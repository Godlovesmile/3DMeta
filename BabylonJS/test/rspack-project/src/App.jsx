import './App.css'
import React from 'react'
import Village from './Village'
// import BasicScene from './BasicScene'

class App extends React.Component {
  componentDidMount() {
    const renderCanvas = document.getElementById('renderCanvas')

		// new BasicScene(renderCanvas)
    new Village(renderCanvas)
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
