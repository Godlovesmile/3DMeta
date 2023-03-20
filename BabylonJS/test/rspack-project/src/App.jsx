import './App.css'
import React from 'react'
import Parent from './Parent'
// import Village from './Village'
// import BasicScene from './BasicScene'


class App extends React.Component {
  componentDidMount() {
    const renderCanvas = document.getElementById('renderCanvas')

    // new BasicScene(renderCanvas)
    // new Village(renderCanvas)
    new Parent(renderCanvas)
  }

  render() {
    return <canvas id="renderCanvas"></canvas>
  }
}

export default App
