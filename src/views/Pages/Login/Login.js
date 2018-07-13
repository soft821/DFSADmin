import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Route, Redirect } from 'react-router-dom';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { API_ROOT } from '../../../api-config';

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      redirectToReferrer: false

    };

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  handleUsername(event){
    this.setState({username : event.target.value});
  }

  handlePassword(event){
   this.setState({password : event.target.value}); 
  }

  handleLogin(event){

    fetch(API_ROOT + "/api/v1/auth/admin-login?email=" + this.state.username + "&password=" + this.state.password , {
      method: 'post',
      headers: {
     
          'Content-Type': 'application/json',
      }, 
      // body: JSON.stringify({
      //   '_token': this.props.csrf_token
      // })
    }).then(function(response){
     
        return response.json();
      
      // throw new Error('Network response was not ok.');
    }).then((data) => { 
      console.log(data);

      if (data['status'] == 0) {
        localStorage.setItem('token', data['response']['token']);
        this.setState({redirectToReferrer : true});
        
        return;
      } else {
        toast.error(data['message'], {
            position: toast.POSITION.TOP_RIGHT
          });
        
      }


    }).catch(function(error) {
      toast.error(error, {
          position: toast.POSITION.TOP_RIGHT
        });
    });
    
    event.preventDefault();
    // this.context.router.push('/dashboard');
  }

  render() {

    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      
      return <Redirect to={from} />;
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your Admin account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Email" onChange={this.handleUsername} value={this.state.username}/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password"  onChange={this.handlePassword} value={this.state.password}/>
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button color="primary" className="px-4" onClick={this.handleLogin.bind(this)}>Login</Button>
                      </Col>
                      
                    </Row>
                  </CardBody>
                </Card>
                
              </CardGroup>
            </Col>
          </Row>
        </Container>
        <ToastContainer autoClose={3000} />
      </div>
    );
  }
}

export default Login;
