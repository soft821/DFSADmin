import React, { Component } from 'react';
import { Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Input,InputGroupAddon,InputGroup} from 'reactstrap';
import  FunctionablePaginator  from '../../mine/FunctionablePaginator';
import { toast } from 'react-toastify';
import { API_ROOT } from '../../../api-config';

function ContestRow(props) {
  const contest = props.contest
  const sequence = props.sequence  
   
  const getBadge = (status) => {
    return status === 'LIVE' ? 'success' : 'info'
  }
   
 
  return (

    <React.Fragment>
      <tr key={contest.id.toString()}>
          
          <td><a href="#">{contest.entries[0].fantasy_player.name + ' (' +
              contest.entries[0].fantasy_player.team + ') @ ' + 
              contest.entries[1].fantasy_player.name + ' (' +
              contest.entries[1].fantasy_player.team + ')'
              }
              </a></td>
          <td>{contest.entryFee}</td>
          <td>{contest.matchupType}</td>
          <td><Badge href="#" color={getBadge(contest.active)}>{contest.status}</Badge></td>
          <td>{contest.slate.name}</td>
          <td>{contest.slate.firstGame}</td>
          
      </tr>
      
    </React.Fragment>
    
  )
}


class Contests extends Component {

  constructor(props){
    
    super(props);

    this.state = {
      contestname: '',
      contestList: [],
    }

    this.currentPage = 1
    this.defaultCountPerPage = 10;
    this.totalDisplayed = 5;

    this.handleContestname = this.handleContestname.bind(this);


  }
  
  componentDidMount() {
  
    this.loadSlatesData();
    
  }
  
  
  loadSlatesData()
  {
    let authToken = localStorage.getItem('token');
  
    fetch(API_ROOT + "/api/v1/contests?status=LOBBY", {
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
      this.contestsData = data['response'];
      this.contestsRecoveryData = data['response'];
      this.totalPages  = Math.ceil(this.contestsData.length / this.defaultCountPerPage);
      this.setState({contestList : this.countContestsList()})
      
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
    this.setState({contestList : this.countContestsList()})
 
  }
  
  countContestsList()
  {
  
    if (this.currentPage * this.defaultCountPerPage > this.contestsData.length) {
      return this.contestsData.slice((this.currentPage - 1)*this.defaultCountPerPage,  this.contestsData.length)
    } else {
      return this.contestsData.slice((this.currentPage - 1)*this.defaultCountPerPage,  this.currentPage * this.defaultCountPerPage)
    }
  }

 

  handleContestname(e) {
    
    
    this.currentPage = 1

    if (e.target.value.trim() == "") {
      this.contestsData = this.contestsRecoveryData.slice(0, this.contestsRecoveryData.length + 1);
      
    } else {
      
      var filteredArray = [];
      this.contestsRecoveryData.forEach((contest) => {

        let title = contest.entries[0].fantasy_player.name + ' (' +
              contest.entries[0].fantasy_player.team + ') @ ' + 
              contest.entries[1].fantasy_player.name + ' (' +
              contest.entries[1].fantasy_player.team + ')'

        if (title.toUpperCase().search(e.target.value.toUpperCase()) !== -1) {
          filteredArray.push(contest);
        } 
      });
      
      this.totalPages  = Math.ceil(this.contestsData.length / this.defaultCountPerPage);
      this.contestsData = filteredArray.slice(0, filteredArray.length + 1)
      
    }
    
    this.setState({contestList : this.countContestsList()})
    this.setState({contestname: e.target.value});
    
  }
      
  handleContestStatusChange(contestId, contestStatus, index){
    
    
  }
  
     
  render() {
  
    return (
          <div className="animated fadeIn">
            
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i> Contests List
                    <Col md="5" className="card-header-actions">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <Button type="button" color="primary"><i className="fa fa-search"></i> Search</Button>
                        </InputGroupAddon>
                        <Input type="text" id="input1-group2" name="input1-group2" placeholder="Search for contests.." onChange={this.handleContestname} value={this.state.contestname}/>
                      </InputGroup>
                    </Col>
                  </CardHeader>
                  <CardBody>
                    <Table hover responsive>
                      <thead>
                      <tr>
                        <th scope="col">Players</th>
                        <th scope="col">Entry Fee</th>
                        <th scope="col">Matchup Type</th>
                        <th scope="col">Status</th>
                        <th scope="col">Slate Name</th>
                        <th scope="col">First Game</th>
                      </tr>
                      </thead>
                      <tbody id="accordion" data-children=".item">
                        {this.state.contestList.map((contest, index) =>
                          <ContestRow key={index} sequence={index} contest={contest} onContestStatusChange={this.handleContestStatusChange.bind(this)}/>
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
          </div>
    )
  } 
}

export default Contests;