import React, { Component } from 'react';
import { Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Input,InputGroupAddon,InputGroup} from 'reactstrap';
import  FunctionablePaginator  from '../../mine/FunctionablePaginator';
import { toast } from 'react-toastify';

function SlateRow(props) {
  const slate = props.slate
  const sequence = props.sequence
  const openStatus = props.openStatus
  
   
  const getBadge = (status) => {
    return status ? 'success' : 'danger'
  }
   
  const getStatusTitle = (status) => {
    return status ? 'Deactive' : 'Active'
  }
   
  const getButtonColor = (status) => {
    return status ? 'danger' : 'success'
  }
   
  function changeStatus(e){
   
    props.onSlateStatusChange(slate.id, slate.active, sequence);
  }

  function toggleCollapse(e){
    props.onCollapseChange(sequence);
  }

  return (

    <React.Fragment>
      <tr key={slate.id.toString()} onClick={toggleCollapse}>
          
          <td><a href="#">{slate.name}</a></td>
          <td>{slate.firstGame}</td>
          <td>{slate.games_count}</td>
          <td><Badge href="#" color={getBadge(slate.active)}>{slate.active ? 'activated' : 'deactivated'}</Badge></td>
          <td><Button block color={getButtonColor(slate.active)} onClick={changeStatus}>{getStatusTitle(slate.active)}</Button></td>
          
      </tr>
      
      <tr className={openStatus ? 'collapse show' : 'collapse'} key={slate.id.toString() + '1'}>
          
          <td colSpan="5">
            <Row >
            {slate.games.map((game, index) =>
              
                <Col key={game.id} lg="2" md="2" sm="4" xs="4">
                  <span>{game.awayTeam + '@' + game.homeTeam}</span><br/>
                  <span style={{fontSize: 0.75+'em'}}>{game.time}</span>
                </Col>
              
            )}
              
          </Row>
        </td>
      </tr>
      
    </React.Fragment>
    
  )
}


class Slates extends Component {

  constructor(props){
    
    super(props);

    this.state = {
      slatename: '',
      slateList: [],
      collapseStatus:[]
    }

    this.currentPage = 1
    this.defaultCountPerPage = 10;
    this.totalDisplayed = 5;

    this.handleSlatename = this.handleSlatename.bind(this);


  }
  
  componentDidMount() {
  
    this.loadSlatesData();
    
  }
  
  
  loadSlatesData()
  {
    let authToken = localStorage.getItem('token');
  
    fetch("http://localhost:8000/api/v1/admin/slates", {
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
      this.slatesData = data['response'];
      this.slatesRecoveryData = data['response'];
      this.totalPages  = Math.ceil(this.slatesData.length / this.defaultCountPerPage);
      this.setState({slateList : this.countSlatesList()})
      this.countCollapseList()
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
    this.setState({slateList : this.countSlatesList()})
    this.countCollapseList()
  }
  
  countSlatesList()
  {
  
    if (this.currentPage * this.defaultCountPerPage > this.slatesData.length) {
      return this.slatesData.slice((this.currentPage - 1)*this.defaultCountPerPage,  this.slatesData.length)
    } else {
      return this.slatesData.slice((this.currentPage - 1)*this.defaultCountPerPage,  this.currentPage * this.defaultCountPerPage)
    }
  }

  countCollapseList()
  {
    var tempCollapseStatus = [];
    this.state.slateList.forEach((slate) => {
      tempCollapseStatus.push(false);
    })

    this.setState({collapseStatus: tempCollapseStatus})
  }

  handleSlatename(e) {
    
    
    this.currentPage = 1

    if (e.target.value.trim() == "") {
      this.slatesData = this.slatesRecoveryData.slice(0, this.slatesRecoveryData.length + 1);
      
    } else {
      
      var filteredArray = [];
      this.slatesRecoveryData.forEach((slate) => {
        if (slate.name.toUpperCase().search(e.target.value.toUpperCase()) !== -1) {
          filteredArray.push(slate);
        } 
      });
      
      this.totalPages  = Math.ceil(this.slatesData.length / this.defaultCountPerPage);
      this.slatesData = filteredArray.slice(0, filteredArray.length + 1)
      
    }
    
    this.setState({slateList : this.countSlatesList()})
    this.countCollapseList()
    this.setState({slatename: e.target.value});
    
  }

  handleCollapseChange(tab){
    const prevState = this.state.collapseStatus;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    console.log(state);
    this.setState({
      collapseStatus: state,
    });
  }
      
  handleSlateStatusChange(slateId, slateStatus, index){
    
    const reqURL = slateStatus ? "http://localhost:8000/api/v1/admin/slates/deactivate?slate_id=" + slateId : "http://localhost:8000/api/v1/admin/slates/activate?slate_id=" + slateId;

    let authToken = localStorage.getItem('token');

    fetch(reqURL, {
      method: 'post',
      headers: {
          'Authorization' : 'Baerer ' + authToken,
          'Content-Type': 'application/json',
      }, 
     
    }).then(function(response){
     
        return response.json();
  
    }).then((data) => { 
      
      if (data['status'] == 0) {
        
        let tempList = this.state.slateList;
        let selectedItem = tempList[index];

        tempList[index]['active'] = slateStatus ? false : true;
        let c_index = this.slatesData.indexOf(selectedItem);
        
        if (c_index) {
          this.slatesData[c_index]['active'] = slateStatus ? false : true;
        }


        this.setState({slateList: tempList});
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
          <div className="animated fadeIn">
            
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i> Slates List
                    <Col md="5" className="card-header-actions">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <Button type="button" color="primary"><i className="fa fa-search"></i> Search</Button>
                        </InputGroupAddon>
                        <Input type="text" id="input1-group2" name="input1-group2" placeholder="Search for slates.." onChange={this.handleSlatename} value={this.state.slatename}/>
                      </InputGroup>
                    </Col>
                  </CardHeader>
                  <CardBody>
                    <Table hover responsive>
                      <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">First Game</th>
                        <th scope="col">Game count</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                      </thead>
                      <tbody id="accordion" data-children=".item">
                        {this.state.slateList.map((slate, index) =>
                          <SlateRow key={index} sequence={index} slate={slate} openStatus={this.state.collapseStatus[index]} onSlateStatusChange={this.handleSlateStatusChange.bind(this)} onCollapseChange={this.handleCollapseChange.bind(this)}/>
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

export default Slates;