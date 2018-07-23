import React, { Component } from 'react';
import { FormGroup, Label, Button, Card, CardHeader,CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import { API_ROOT } from '../../../api-config';

class AddContest extends Component {
    
    constructor(props){
        super(props);

        this.state = {
          slates: [],
          fPlayers: []
        }
        this.entryCount = 2;
    }

    componentDidMount() {
      this.loadSlates()
    }

    loadSlates()
    {
      let authToken = localStorage.getItem('token');
  
      fetch(API_ROOT + "/api/v1/slates", {
        method: 'get',
        headers: {
          'Authorization' : 'Baerer ' + authToken,
          'Content-Type': 'application/json',
        }, 
     
      }).then(function(response){
     
        return response.json();
    
      }).then((data) => { 
      
      if (data['status'] == 0) {
        this.setState({slates: data['response']});
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

    handleCreate(e){
      if (this.state.slates.length == 0) {

        toast.error('There are no slates.', {
          position: toast.POSITION.TOP_RIGHT
        });
        return
      }

      if (!this.selectStatus || this.selectStatus.length != 2) {

        console.log('*************' + this.selectStatus);

        toast.error('Please choose 2 fantasy players.', {
          position: toast.POSITION.TOP_RIGHT
        });
        return
      } 

      if (!this.entryCount) {
        toast.error('Please set entry count.', {
          position: toast.POSITION.TOP_RIGHT
        });
        return
      }

      let strSlateId = this.slateId ? this.state.slates[this.slateId].id : this.state.slates[0].id
      let strPosition = this.position ? this.position : 'QB'
      let strEntryFee = this.fee ? this.fee : '0'

      let authToken = localStorage.getItem('token');
      
      fetch(API_ROOT + "/api/v1/contests", {
        method: 'post',
        headers: {
          'Authorization' : 'Baerer ' + authToken,
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
          'slate_id' : strSlateId,
          'match_type' : 'set_opponent',
          'entry_fee' : strEntryFee,
          'user_player_id' : this.selectStatus[0],
          'opp_player_id' : this.selectStatus[1],
          'num_of_entries' : this.entryCount
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

    handleGetPlayers(){

      let strSlateId = this.slateId ? this.state.slates[this.slateId].id : this.state.slates[0].id
      let strPosition = this.position ? this.position : 'QB'

      this.setState({fPlayers: []})

      let authToken = localStorage.getItem('token');
  
      fetch(API_ROOT + "/api/v1/fantasyPlayers?slate_id=" + strSlateId + '&position=' + strPosition, {
        method: 'get',
        headers: {
          'Authorization' : 'Baerer ' + authToken,
          'Content-Type': 'application/json',
        }, 
     
      }).then(function(response){
     
        return response.json();
    
      }).then((data) => { 
      
      if (data['status'] == 0) {
        this.setState({fPlayers: data['response']});
        
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
      if (this.selectStatus.includes(this.state.fPlayers[index].id)) {
        let position = this.selectStatus.indexOf(this.state.fPlayers[index].id)
        this.selectStatus.splice(position, 1)
      } else {
        this.selectStatus.push(this.state.fPlayers[index].id)
        console.log("sort:"+ this.selectStatus);
      }

    }

    handleChooseSlate(e){
      this.slateId = e.target.selectedIndex
      this.handleGetPlayers()
    }

    handleChoosePosition(e){
      this.position = e.target.value
      this.handleGetPlayers()
      this.selectStatus = [];
    }

    handleChooseFee(e){
      this.fee = e.target.value
    }

    handleEntryCount(e){
      this.entryCount = e.target.value
    }
    
    render() {

        return (
          <div className="animated fadeIn">
            <Row>
              <Col xs="12" sm="12">
                <Card>
                  <CardHeader>
                    <Row>
                      <Col xs="11" className="text-center">
                        <h3>Create Headline Matchup</h3>
                      </Col>
                      <Col xs="1">
                        <Button color="primary" className="px-3" onClick={this.handleCreate.bind(this)}>Create</Button>
                      </Col>
                    </Row>  
                    
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col xs="4">
                        <FormGroup>
                          <Label htmlFor="slate">Slate</Label>
                          <Input type="select" name="slate" id="slate" onChange={this.handleChooseSlate.bind(this)}>
                            {this.state.slates.map((slate, index) => 
                              <option key={slate.id} value={slate.id}>{slate.name}</option>
                            )}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col xs="2">
                        <FormGroup>
                          <Label htmlFor="position">Position</Label>
                          <Input type="select" name="position" id="position" onChange={this.handleChoosePosition.bind(this)}>
                            <option>QB</option>
                            <option>RB</option>
                            <option>WR</option>
                            <option>TE</option>
                            <option>HC</option>
                            <option>K</option>
                            <option>DST</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col xs="2">
                        <FormGroup>
                          <Label htmlFor="fee">Entry Fee</Label>
                          <Input type="select" name="fee" id="fee" onChange={this.handleChooseFee.bind(this)}>
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>5</option>
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                            <option>100</option>
                            <option>250</option>
                            <option>500</option>
                            <option>1000</option>
                            <option>10000</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col xs="4">
                        <FormGroup>
                          <Label htmlFor="entrycount">Number of Entries</Label>
                          <Input type="number" id="entrycount" placeholder="2" required onChange={this.handleEntryCount.bind(this)}/>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button color="info" className="px-4" onClick={this.handleGetPlayers.bind(this)}>Get Players</Button>
                    <Row>
                      <br/>
                       {this.state.fPlayers.map((player, index) => 

                          <Col key={index} sm="4" xs="4">
                            <FormGroup  check className="checkbox">
                              <Input className="form-check-input" type="checkbox" id={player.id} name={player.id} onChange={() => this.handleSort(index)}/>
                              <Label check className="form-check-label" htmlFor={player.id} style={{fontSize: 1.5+'em'}}>
                                {player.name} 
                              </Label>
                            </FormGroup>
                          </Col>
                        )} 
                    </Row>
                  </CardBody>
                </Card>
              </Col>              
            </Row>
          </div>
        )
      }


}

export default AddContest;