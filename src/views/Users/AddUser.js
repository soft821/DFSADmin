import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, FormGroup, Label, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import { API_ROOT } from '../../api-config';


class AddUser extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            email: '',
            invitedLevel: "Credit-10"
          };
        
        this.handleEmail = this.handleEmail.bind(this);
        this.handleInvitedLevel = this.handleInvitedLevel.bind(this);
   
    }

    handleEmail(e){
        this.setState({email : e.target.value});
    }

    handleInvitedLevel(e){
        this.setState({invitedLevel : e.target.value});
    }

    handlePromoCode(e){

        if (!this.state.email || this.state.email == '')
            return;

        let authToken = localStorage.getItem('token');
        fetch(API_ROOT + "/api/v1/admin/sendpromo?email=" + this.state.email + "&invitedLevel=" + this.state.invitedLevel , {
          method: 'post',
          headers: {
            'Authorization' : 'Baerer ' + authToken,
            'Content-Type': 'application/json',
          }, 
          
        }).then(function(response){
        
            return response.json();
        
          // throw new Error('Network response was not ok.');
        }).then((data) => { 
          console.log(data);

          if (data['status'] == 0) {
            
            toast.success(data['message'], {
              position: toast.POSITION.TOP_RIGHT
            });

          } else {
            toast.warn(data['message'], {
              position: toast.POSITION.TOP_RIGHT
            });
          }


        }).catch(function(error) {
          toast.error(error, {
            position: toast.POSITION.TOP_RIGHT
          });
        
        });

        e.preventDefault();
    }

    render() {

        return (
            <div className="app flex-row align-items-top">
            <Container>
              <Row className="justify-content-center">
                <Col md="8">
                  <CardGroup>
                    <Card className="p-4">
                      <CardBody>
                        <h2>Send Promo Code to :</h2>
                        <FormGroup row>
                          <Col md="3">
                            <Label>Invited User level</Label>
                          </Col>
                          <Col md="9">
                            <FormGroup check inline>
                              <Input className="form-check-input" onChange={this.handleInvitedLevel} checked={this.state.invitedLevel==="Credit-10"} type="radio" id="inline-radio1" name="inline-radios" value="Credit-10" />
                              <Label className="form-check-label" check htmlFor="inline-radio1">Credit-10</Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Input className="form-check-input" onChange={this.handleInvitedLevel} checked={this.state.invitedLevel==="Credit-20"} type="radio" id="inline-radio2" name="inline-radios" value="Credit-20" />
                              <Label className="form-check-label" check htmlFor="inline-radio2">Credit-20</Label>
                            </FormGroup>
                          </Col>
                        </FormGroup>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" placeholder="Email" onChange={this.handleEmail} value={this.state.email}/>
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button color="primary" className="px-4" onClick={this.handlePromoCode.bind(this)}>Send</Button>
                          </Col>
                          
                        </Row>
                      </CardBody>
                    </Card>
                    
                  </CardGroup>
                </Col>
              </Row>
            </Container>
          </div>
        )
      }


}

export default AddUser;