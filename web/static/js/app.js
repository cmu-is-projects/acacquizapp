// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"
import React from "react"
import ReactDOM from "react-dom"
import { Modal } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { Popover } from 'react-bootstrap'
import { Tooltip } from 'react-bootstrap'
import { OverlayTrigger } from 'react-bootstrap'
import { DropdownButton  } from 'react-bootstrap'
import { FormControl } from 'react-bootstrap'
import { FieldGroup } from 'react-bootstrap'

  
// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chapters: []};
  }  

  get1Chapters(){
    $.ajax({
      dataType: "json",
      url: "section?_format=json",
      async: false
    }).then(function(data) {
      this.setState({ chapters: data.response });
    }.bind(this));	
  }  

  getChapters(){
    fetch('section?_format=json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ chapters: responseJson.response });
      })
      .catch((error) => {
        console.error(error);
      });
    
  }      

  componentWillMount(){
    this.getChapters()

  }     
  
  renderItem(){
    let items = [];
    this.state.chapters.map(function(chapter) {
      items.push(<option key={chapter.id} value={chapter.id}>{chapter.book} ({chapter.start_verse}:{chapter.end_verse})</option>)
    })
    return items;
  }
  
  renderDropdownButton() {
    return (
      <FormControl componentClass="select" placeholder="Chapter" id="chapter">
        {this.renderItem()}
      </FormControl>
    );
  }

  render() {
    return (
      <div>
        <Modal show={this.props.showModal}>
          <Modal.Header closeButton>
            <Modal.Title>Select Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Please select the chapter and section</h4>
            <hr />
            {this.renderDropdownButton()}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.start}>Start</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


export default class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: [], 
                  count: 0, 
                  answer: "", 
                  showModal: false, 
                  limit: 10, 
                  value: "", 
                  current: {}, 
                  questionTimer: 30,
                  answerTimer: 10,
                  secondsRemaining: 0,
                  points: 0,
                  notice: "",
                  nextbutton: false,
                  answerbutton: false
                  };
    this.viewModal = this.viewModal.bind(this);
    this.resetBank = this.resetBank.bind(this);
    this.tick = this.tick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }
  

  submitAnswer(){
    console.log(this.state.current.answer.replace(/\W/g, '').toLowerCase());
    if(this.state.value.replace(/\W/g, '').toLowerCase() == this.state.current.answer.replace(/\W/g, '').toLowerCase()){
      this.setState({
        points: this.state.points + 1,
        notice: "Correct"
      })
    }else{
      this.setState({
        notice: "Incorrect"
      })         
    }
    fetch('/answer', { 
      method: 'POST',
      data: {
        answer: this.state.value
      }
    })
    .then(function(response) {
      return response.json()
    }).then(function(body) {
      console.log(body);
    });    
  }      
  
  showAnswer(){
		clearInterval(this.interval);
    this.submitAnswer()  
	  this.setState({
		  answer: this.state.current.answer,
      answerbutton: false,
      nextbutton: true,
      secondsRemaining: this.state.answerTimer
	  });
    this.interval = setInterval(this.tick, 1000, "answer")         
  }
 
  
  resetBank(){
    var id = $("#chapter :selected").val()
    if(id == null){
      id = "33"
    }else{
      this.setState({ points: 0,
                      secondsRemaining: this.state.questionTimer,
                      count: 0,
                      showModal: false,
                      answerbutton: true
      })
      this.interval = setInterval(this.tick, 1000, "question")      
      
      fetch("random?_format=json&id="+id+"&limit="+this.state.limit.toString())
        .then((response) => response.json())
        .then(function(responseJson){     
          this.setState({
            results: responseJson.response,
            current: responseJson.response[this.state.count][0]
          });	    
        }.bind(this));    
    }  
  }
  
  
  nextQuestion(){
		clearInterval(this.interval);    
	  this.setState({
      answerbutton: true,
      nextbutton: false,
      value: "", 
      notice: ""
	  });  
    if(this.state.count == this.state.limit - 1){
      this.viewModal()      
    }else{
      this.setState({
        secondsRemaining: this.state.questionTimer,
        count: this.state.count + 1,
        answer: "",
        current: this.state.results[this.state.count + 1][0]
      }); 
      this.interval = setInterval(this.tick, 1000, "question")       
    }
  }  
  
  tick(type) {
    this.setState({secondsRemaining: this.state.secondsRemaining - 1})
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval);
      if(type == "question"){
        this.showAnswer()
      }
      if(type == "answer"){
        this.nextQuestion()
      }
    }
  }  
  
  componentDidMount(){  
    this.viewModal()
  }   
  

  viewModal(){
		clearInterval(this.interval);    
    this.setState({ 
      showModal: true 
    });
  }

  
  handleKeyPress(e) {
    if(e.key === 'Enter') {
      if(this.state.nextbutton){
        this.nextQuestion()
      }
      if(this.state.answerbutton){
        this.showAnswer()
      }      
    }
  }  

  render() {
    return( <div>
      <h4>Notice: {this.state.notice}</h4>
      <h4>Timer: {this.state.secondsRemaining} </h4>
      <h4>Points: {this.state.points} </h4>
      <h3 className='question'>Question: {this.state.current.text } </h3>
      <p> 
          <FormControl
            id="value"
            type="text"
            onChange={(e) => this.setState({ value: e.target.value})}
            placeholder="Enter text"
            value={this.state.value}
            onKeyPress={this.handleKeyPress}
          />
      </p>
      <p>Answer: {this.state.answer}</p>
      <i>{this.state.current.book} {this.state.current.chapter}-{this.state.current.verse} ({this.state.count})</i>
      <div>
        <button id="next" className= 'next' onClick= {this.nextQuestion.bind(this)} disabled={!this.state.nextbutton} >Next Question</button>
        <button id="submit" className= 'answer' onClick= {this.showAnswer.bind(this)} disabled={!this.state.answerbutton} >Submit Answer</button>
        <button className='reset' onClick= {this.viewModal} >Reset</button> 
        <Dropdown showModal= {this.state.showModal} start={this.resetBank} /> 
      </div>
      {this.state.current.answer}
	 </div>)
	
  };

}


ReactDOM.render(<Questions />, document.getElementById("dashboard"))


