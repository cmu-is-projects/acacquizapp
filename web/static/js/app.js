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

  getChapters(){
    $.ajax({
      dataType: "json",
      url: "http://pabible.tk:4000/section?_format=json",
      async: false
    }).then(function(data) {
      this.setState({ chapters: data.response });
    }.bind(this));	
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


export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: [], count: 0, answer: "", showModal: false, limit: 10};
    this.viewModal = this.viewModal.bind(this);
    this.resetBank = this.resetBank.bind(this);
  }
  
  showAnswer(){
	  this.setState({
		  answer: this.state.results[this.state.count][0].answer
	  });
  }
  
  resetBank(){
    var id = $("#chapter :selected").val()
    if(id == null){
      id = "33"
    }
    this.setState({
      count: 0
    })
    this.setState({
      showModal: false
    })    
    $.ajax({
      dataType: "json",
      url: "http://pabible.tk:4000/random?_format=json&id="+id+"&limit="+this.state.limit.toString(),
      async: false
    }).then(function(data) {
      this.setState({ results: data.response });
    }.bind(this));		    
  }  
  
  nextQuestion(){	 
    if(this.state.count == this.state.limit - 1){
      this.resetBank()
      this.viewModal()      
    }else{
      this.setState({
        count: this.state.count + 1
      });
      this.setState({
        answer: ""
      });		
    }
  }    
  
  componentWillMount(){
    this.resetBank()    
    this.viewModal()
  }   
  

  viewModal(){
    this.setState({ 
      showModal: true 
    });
  }
    

  render() {
    var inst = this.state.results[this.state.count][0]
    return( <div>
      <h3 className='question'>Question: {this.state.results[this.state.count][0].text } </h3>
      <p>Answer: {this.state.answer}</p>
      <i>{inst.book} {inst.chapter}-{inst.verse} ({this.state.count})</i>
      <div>
        <button className= 'next'
          onClick= {this.nextQuestion.bind(this)}
        >Next</button>
        <button className= 'answer'
          onClick= {this.showAnswer.bind(this)}
        >Show Answer</button>
        <button className='reset'
          onClick= {this.viewModal}
        >Reset</button>
        <Dropdown showModal= {this.state.showModal} start={this.resetBank} /> 
      </div>

	 </div>)
	
  };

}


ReactDOM.render(<UserList />, document.getElementById("dashboard"))

