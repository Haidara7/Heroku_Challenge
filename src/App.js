import React, { Component } from 'react';
import io from 'socket.io-client';

class App extends Component {
  

  state = {
    isConnected:false,
    peeps : [],
    message:'',
    id:''
  }
  socket = null

  componentWillMount(){

    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on('connect', () => {
      this.setState({isConnected:true})
    })

    this.socket.on('pong!',(additionalStuff)=>{
      console.log('server answered!', additionalStuff)
    })

    this.socket.on('peeps',(socket)=>{
      this.setState({peeps:socket})
    console.log("peeps",this.state.peeps);
      
      
    })

    this.socket.on('youare',(answer)=>{
    this.setState({id:answer.id})
  })

    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
    })
    

    /** this will be useful way, way later **/
    this.socket.on('room', old_messages => console.log(old_messages))
    this.socket.on('next',(message_from_server)=>console.log(message_from_server))


  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }
onClick =(e)=>{
  e.preventDefault()
  const message ={
    id:this.state.id,
    name:'Haidara',
    text:this.state.message
  }
  this.socket.emit('message',message)
}
  render() {
    return (
      <div className="App">
        <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
        <div>id: {this.state.id}</div>
        <button onClick={()=>this.socket.emit('ping!')}>ping</button>
        <button onClick={()=>this.socket.emit('whoami')}>Who am I?</button>
        <button onClick={()=>this.socket.emit('give me next')}>next</button>
        <button onClick={()=>this.socket.emit('addition')}>addition</button>
        <button onClick={(e)=>this.onClick(e)}>answer</button>
        <input type = "text" value={this.state.message} onChange={(e)=>this.setState({message:e.target.value})} ></input>


      </div>
    );
  }
}

export default App;
