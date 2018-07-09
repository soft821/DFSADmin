import React, { Component } from 'react';
import { FormGroup, Label, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { toast } from 'react-toastify';


class AddSlates extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            slateName: '',
            gamesData: [],
          };
        
        this.handleSlateName = this.handleSlateName.bind(this);
   
    }

    componentDidMount() {
      
      this.loadGamesData();
      
    }

    handleSlateName(e){
        this.setState({slateName : e.target.value});
    }

    handleCreate(e){
      if (this.selectStatus.length == 0) {
        toast.error("There are no selected games!", {
          position: toast.POSITION.TOP_RIGHT
        });
        return
      } else if (this.state.slateName === '') {
        toast.error("Input slate name!", {
          position: toast.POSITION.TOP_RIGHT
        });
        
        return
      } 

      let authToken = localStorage.getItem('token');
      
      fetch("http://localhost:8000/api/v1/admin/slates", {
        method: 'post',
        headers: {
          'Authorization' : 'Baerer ' + authToken,
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
          'slate_name' : this.state.slateName,
          'games' : this.selectStatus
        })
     
      }).then(function(response){
        
        return response.json();
    
      }).then((data) => { 
      

        if (data['status'] == 0) {
          toast.success(data['message'], {
            position: toast.POSITION.TOP_RIGHT
          });
          
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

    }

    handleSort(index){
      
      if (this.selectStatus.includes(this.state.gamesData[index].id)) {
        let position = this.selectStatus.indexOf(this.state.gamesData[index].id)
        this.selectStatus.splice(position, 1)
      } else {
        this.selectStatus.push(this.state.gamesData[index].id)
      }

    }

    loadGamesData()
    {
      let authToken = localStorage.getItem('token');
  
      fetch("http://localhost:8000/api/v1/admin/pendingGames", {
        method: 'get',
        headers: {
          'Authorization' : 'Baerer ' + authToken,
          'Content-Type': 'application/json',
        }, 
     
      }).then(function(response){
     
        return response.json();
    
      }).then((data) => { 
      
      if (data['status'] == 0) {
        this.setState({gamesData: data['response']});
        this.selectStatus = []
        
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
                        <h3>Add Custom Slate</h3>

                        <FormGroup row>
                          <Col md="9">
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="icon-trophy"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" placeholder="Slate Name" onChange={this.handleSlateName} value={this.state.slateName}/>
                            </InputGroup>
                          </Col>

                          <Col md="3">
                            <Button color="primary" className="px-4" onClick={this.handleCreate.bind(this)}>Create</Button>
                          </Col>

                        </FormGroup>

                        
                        
                        <FormGroup row>
                          <Col md="3"><Label>Select Games</Label></Col>
                          <Col md="9">
                            {this.state.gamesData.map((game, index) =>
                              
                              <FormGroup key={index} check className="checkbox">
                                <Input className="form-check-input" type="checkbox" id={game.id} name={game.id} onChange={() => this.handleSort(index)}/>
                                <Label check className="form-check-label" htmlFor={game.id}>
                                  {game.awayTeam + '@' + game.homeTeam} 
                                </Label>
                                <p>{game.date}</p>
                              </FormGroup>
                            )}
                            
                          </Col>
                        </FormGroup>

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

export default AddSlates;