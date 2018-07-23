import React, { Component } from 'react';
// import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import { API_ROOT } from '../../../api-config';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';

class FooterUpdate extends Component {
    
	constructor(props) {
  	super(props);

  	this.toggle = this.toggle.bind(this);
  	this.toggleFade = this.toggleFade.bind(this);
    this.handleContent = this.handleContent.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  	this.state = {
      id: 1,
      title: "Terms of Use",
      content: "",
  	  collapse: true,
  	  fadeIn: true,
  	  timeout: 300
  	};
	}

  componentDidMount(){
    let url = "https://json-server1.herokuapp.com/posts/" + this.state.id;
    let content
    fetch(url)
      .then(resp =>resp.json())
      .then(data => {
          content = data.content
        this.setState({content: content});
      })
  }

	toggle() {
	this.setState({ collapse: !this.state.collapse });
	}

	toggleFade() {
	this.setState((prevState) => { return { fadeIn: !prevState }});
	}

  handleContent(event){
    this.setState({content : event.target.value});
  }

  getId(event){
    switch(event.target.value){
        case "Terms of Use": return 1; 
                break;
        case "Privacy Policy": return 2; 
                break;
        case "Responsible Play": return 3; 
                break;
        case "Trust and Safety": return 4; 
                break;
         
    }
  }

  handleTitle(event){
    this.setState({title : event.target.value});
    let id = this.getId(event);
    this.setState({id : id});
    let url = "https://json-server1.herokuapp.com/posts/" + id;
    let content
    fetch(url, {
      "headers":{
          "Accept": "application/json",
          "content-type": "application/json"
      },
      "method": "GET"
    })
      .then(resp =>resp.json())
      .then(data => {
          content = data.content
          // alert("id:"+this.state.id+"==="+"title:"+this.state.title+"content:"+content)
        this.setState({content: content});
      })
  }

  handleSubmit(event){
    let url = "https://json-server1.herokuapp.com/posts/" + this.state.id;
    let content
    var obj = {title:this.state.title, content:this.state.content};
    var myJSON = JSON.stringify(obj);
    fetch(url, {
      "body": myJSON,
      "headers":{
          "Accept": "application/json",
          "content-type": "application/json"
      },
      "method": "PUT"
    })
      .then((resp) =>resp.json())
      .then(data => {
        toast.success(this.state.title+' is succesfully updated!', {
          position: toast.POSITION.TOP_RIGHT
        });
        content = data.content;
        this.setState({content: data.content});
      })
    event.preventDefault();
  }

    render() {

        return (
            <div className="app align-items-top">
               <Row>
                  <Col xs="12" md="12">
                    <Card>
                      <CardHeader>
                        <strong>Footer</strong> Update
                      </CardHeader>
                      <CardBody>
                        <Form className="form-horizontal">
                          <FormGroup row>
                            <Col md="3">
                              <Label htmlFor="selectLg">Footer Subject</Label>
                            </Col>
                            <Col xs="12" md="9" size="lg">
                              <Input type="select" onChange={this.handleTitle} value={this.state.title} name="selectLg" id="selectLg" bsSize="lg">
                                <option selected value="Terms of Use">Terms of Use</option>
                                <option value="Privacy Policy">Privacy Policy</option>
                                <option value="Responsible Play">Responsible Play</option>
                                <option value="Trust and Safety">Trust and Safety</option>
                              </Input>
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col md="3">
                              <Label htmlFor="textarea-input">Content</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <Input type="textarea" name="textarea-input" id="textarea-input" rows="25"
                                placeholder="Content..." onChange={this.handleContent} value={this.state.content}/>
                            </Col>
                          </FormGroup>
                        </Form>
                      </CardBody>
                      <CardFooter>
                        <Button onClick={this.handleSubmit.bind(this)} size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                        <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
                      </CardFooter>
                    </Card>
                  </Col>
               </Row>
            </div>
        )
      }


}

export default FooterUpdate;