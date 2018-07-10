import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader,FormGroup, Label, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Input,InputGroupAddon,InputGroup} from 'reactstrap';
import  FunctionablePaginator  from '../../mine/FunctionablePaginator';
import { toast } from 'react-toastify';

function RankingRow(props) {
  const fPlayer = props.fPlayer
  const sequence = props.sequence  
   
  function updateTier(e){
    props.onTierStatusChange(sequence)
  }
 
  return (

    <React.Fragment>
      <tr key={fPlayer.id.toString()}>
          
          <td>{fPlayer.name}</td>
          <td>{fPlayer.team}</td>
          <td>{fPlayer.position}</td>
          <td>{fPlayer.salary}</td>
          <td>{fPlayer.fps}</td>
          <td>{fPlayer.tier}</td>
          <td>
            <Button color="ghost-primary" onClick={updateTier}>
              <i className="icon-note"></i>
            </Button>
          </td>
          
      </tr>
      
    </React.Fragment>
    
  )
}


class FpRanking extends Component {

  constructor(props){
    
    super(props);

    this.state = {
      fPlayerIndex: -1,
      fPlayerList: [],
      primary: false,
    }

    this.currentPage = 1
    this.defaultCountPerPage = 15;
    this.totalDisplayed = 5;

    this.handleContestname = this.handleContestname.bind(this);
    this.togglePrimary = this.togglePrimary.bind(this);
    this.confirmUpdate = this.confirmUpdate.bind(this)

  }
  
  componentDidMount() {
  
    this.loadPlayerData();
    
  }
  
  
  loadPlayerData()
  {
    let authToken = localStorage.getItem('token');
  
    fetch("http://localhost:8000/api/v1/admin/fantasyPlayers", {
      method: 'get',
      headers: {
        'Authorization' : 'Baerer ' + authToken,
        'Content-Type': 'application/json',
      }, 
   
    }).then(function(response){
      return response.json();
    
    }).then((data) => { 
    console.log(data)
    if (data['status'] == 0) {
      this.fPlayersData = data['response'];
      this.fPlayersRecoveryData = data['response'];
      this.totalPages  = Math.ceil(this.fPlayersData.length / this.defaultCountPerPage);
      this.setState({fPlayerList : this.countFPlayersList()})
      this.chosenTier = ''
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
      
  handlePagerClick(e){
    this.currentPage = e;
    this.setState({fPlayerList : this.countFPlayersList()})
 
  }
  
  countFPlayersList()
  {
  
    if (this.currentPage * this.defaultCountPerPage > this.fPlayersData.length) {
      return this.fPlayersData.slice((this.currentPage - 1)*this.defaultCountPerPage,  this.fPlayersData.length)
    } else {
      return this.fPlayersData.slice((this.currentPage - 1)*this.defaultCountPerPage,  this.currentPage * this.defaultCountPerPage)
    }
  }

 

  handleContestname(e) {
    
    
    this.currentPage = 1

    if (e.target.value.trim() == "") {
      this.fPlayersData = this.fPlayersRecoveryData.slice(0, this.fPlayersRecoveryData.length + 1);
      
    } else {
      
      var filteredArray = [];
      this.fPlayersRecoveryData.forEach((fPlayer) => {

        if (fPlayer.name.toUpperCase().search(e.target.value.toUpperCase()) !== -1) {
          filteredArray.push(fPlayer);
        } 
      });
      
      this.fPlayersData = filteredArray.slice(0, filteredArray.length + 1)
      this.totalPages  = Math.ceil(this.fPlayersData.length / this.defaultCountPerPage);
      
    }
    
    this.setState({fPlayerList : this.countFPlayersList()})
    
    
  }
      
  handleTierStatusChange(index){
    
    this.setState({fPlayerIndex: index});
    this.togglePrimary();
  }

  togglePrimary(){
    this.setState({
      primary: !this.state.primary,
    });
  }

  confirmUpdate()
  {
    this.togglePrimary();
    if (this.chosenTier === '') {
      toast.error('Choose Tier rank value!', {
        position: toast.POSITION.TOP_RIGHT
      });
      return
    }

    let authToken = localStorage.getItem('token');
      
      fetch("http://localhost:8000/api/v1/admin/update/fp_tier", {
        method: 'post',
        headers: {
          'Authorization' : 'Baerer ' + authToken,
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
          'id' : this.state.fPlayerList[this.state.fPlayerIndex].id,
          'tier' : this.chosenTier
        })
     
      }).then(function(response){
        
        return response.json();
    
      }).then((data) => { 
      

        if (data['status'] == 0) {
          toast.success(data['message'], {
            position: toast.POSITION.TOP_RIGHT
          });
          
          let tempList = this.state.fPlayerList;
          let selectedItem = tempList[this.state.fPlayerIndex];

          tempList[this.state.fPlayerIndex]['tier'] = this.chosenTier
          let c_index = this.fPlayersData.indexOf(selectedItem);
          
          if (c_index) {
            this.fPlayersData[c_index]['tier'] = this.chosenTier
          }


          this.setState({fPlayerList: tempList});

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
  
  handleTier(e){
    this.chosenTier = e.target.value
  }
     
  render() {
  
    return (
          <div className="animated fadeIn">
            
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i> Fantasy Players List
                    <Col md="5" className="card-header-actions">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <Button type="button" color="primary"><i className="fa fa-search"></i> Search</Button>
                        </InputGroupAddon>
                        <Input type="text" id="input1-group2" name="input1-group2" placeholder="Search for player.." onChange={this.handleContestname}/>
                      </InputGroup>
                    </Col>
                  </CardHeader>
                  <CardBody>
                    <Table hover responsive>
                      <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Team</th>
                        <th scope="col">Position</th>
                        <th scope="col">Salary</th>
                        <th scope="col">FPS</th>
                        <th scope="col">Tier</th>
                        <th scope="col">Edit</th>
                      </tr>
                      </thead>
                      <tbody id="accordion" data-children=".item">
                        {this.state.fPlayerList.map((fPlayer, index) =>
                          <RankingRow key={index} sequence={index} fPlayer={fPlayer} onTierStatusChange={this.handleTierStatusChange.bind(this)}/>
                        )}
                      </tbody>
                    </Table>
                    <nav>
                      <FunctionablePaginator pageChanged={this.handlePagerClick.bind(this)} totalPages={this.totalPages} totalDisplayed={this.totalDisplayed}>                 
                      </FunctionablePaginator>
                    </nav>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Modal isOpen={this.state.primary} toggle={this.togglePrimary} className={'modal-primary ' + this.props.className}>
              <ModalHeader toggle={this.togglePrimary}>Update Tier Ranking</ModalHeader>
              <ModalBody>
                <p>
                  { this.state.fPlayerIndex != -1 && this.state.fPlayerList.length > 0 ? this.state.fPlayerList[this.state.fPlayerIndex].name + ' : Tier rank ' + this.state.fPlayerList[this.state.fPlayerIndex].tier : ''}     
                </p> 
                <FormGroup row>
                    <Col md="4">
                      <Label>Choose One</Label>
                    </Col>
                    <Col md="8">

                      {['A', 'B', 'C', 'D', 'E'].map((tier, index) => 
                        <FormGroup check inline key={index}>
                           <Input className="form-check-input" type="radio" id={'inline-radio' + index} name="inline-radios" value={tier} onChange={this.handleTier.bind(this)}/>
                           <Label className="form-check-label" check htmlFor={'inline-radio' + index}>{tier}</Label>
                         </FormGroup>
                      )}
                      
                    </Col>
                  </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.confirmUpdate}>Update</Button>{' '}
                <Button color="secondary" onClick={this.togglePrimary}>Discard</Button>
              </ModalFooter>
            </Modal>
          </div>
    )
  } 
}

export default FpRanking;