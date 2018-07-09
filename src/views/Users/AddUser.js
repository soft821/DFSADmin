import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { toast } from 'react-toastify';

class AddUser extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            email: ''
          };
        
        this.handleEmail = this.handleEmail.bind(this);
   
    }

    handleEmail(e){
        this.setState({email : e.target.value});
    }

    handlePromoCode(e){

        if (!this.state.email || this.state.email == '')
            return;

        let authToken = localStorage.getItem('token');
        fetch("http://localhost:8000/api/v1/admin/sendpromo?email=" + this.state.email , {
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