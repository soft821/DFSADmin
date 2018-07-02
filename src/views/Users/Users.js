import React, { Component } from 'react';
import { Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader,Input,InputGroupAddon,InputGroup} from 'reactstrap';
import  FunctionablePaginator  from '../mine/FunctionablePaginator';
import { AppSwitch } from '@coreui/react';

function UserRow(props) {
  const user = props.user
  const userLink = `/users/${user.id}`
  const sequence = props.sequence
  const rate = props.rate

  const getBadge = (status) => {
    return status === 'active' ? 'success' : 'danger'
  }

  const getStatusTitle = (status) => {
    return status === 'active' ? 'Block' : 'Active'
  }

  const getButtonColor = (status) => {
    return status === 'active' ? 'danger' : 'success'
  }

  function changeStatus(e){

    props.onUserStatusChange(user.id, user.status, sequence);
  }

  function removeUser(e){
    props.onUserDelete(user.id, sequence);
  }

  function changeAccessPermission(e){

    props.onUserAccessPermission(user.id, e.target.checked, sequence);
  }


  return (
    <tr key={user.id.toString()}>
        <th scope="row"><a href={userLink}>{user.id}</a></th>
        <td><a href="#">{user.name}</a></td>
        <td>{user.email}</td>
        <td>{user.deposit / rate}</td>
        <td>{user.balance / rate}</td>
        <td>{(user.balance - user.deposit) / rate}</td>
        <td className='text-center'><AppSwitch className={'mx-1'} variant={'3d'} color={'success'} checked={user.blog_access} onChange={changeAccessPermission}/></td>
        <td><Badge href={userLink} color={getBadge(user.status)}>{user.status}</Badge></td>
        <td><Button block color={getButtonColor(user.status)} onClick={changeStatus}>{getStatusTitle(user.status)}</Button></td>
        <td>
          <Button block color="warning" onClick={removeUser}>Remove</Button>
        </td>
    </tr>
  )
}

class Users extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      userList: [],
      primary: false,
      rate: 0,
      username: '',
    }
    
    this.currentPage = 1
    this.defaultCountPerPage = 10;
    this.totalDisplayed = 5;


    this.togglePrimary = this.togglePrimary.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
  }

  componentDidMount() {
    
    this.loadUsersData()
  }

  loadUsersData()
  {
    let authToken = localStorage.getItem('token');

    fetch("http://localhost:8000/api/v1/admin/users", {
      method: 'get',
      headers: {
          'Authorization' : 'Baerer ' + authToken,
          'Content-Type': 'application/json',
      }, 
     
    }).then(function(response){
     
        return response.json();
  
    }).then((data) => { 
      
      if (data['status'] == 0) {
        this.usersData = data['response'];
        this.usersRecoveryData = data['response'];
        this.totalPages  = Math.ceil(this.usersData.length / this.defaultCountPerPage);
        this.setState({userList : this.countUserList()})
        this.setState({rate : data['userInfo']['rate']})
        return;
      } else {
        alert(data['message']);
      }


    }).catch(function(error) {
      alert(error);
    });
    
    
  }

  handleUsername(e){
    
    this.currentPage = 1
    if (e.target.value.trim() == "") {
      this.usersData = this.usersRecoveryData.slice(0, this.usersRecoveryData.length + 1);
      
    } else {
      
      var filteredArray = [];
      this.usersRecoveryData.forEach((user) => {
        if (user.name.search(e.target.value) !== -1) {
          filteredArray.push(user);
        } 
      });
      
      this.totalPages  = Math.ceil(this.usersData.length / this.defaultCountPerPage);
      this.usersData = filteredArray.slice(0, filteredArray.length + 1)
      
    }

    this.setState({userList : this.countUserList()})
    this.setState({username: e.target.value});

  }

  handlePagerClick(e){
    this.currentPage = e;
    this.setState({userList : this.countUserList()})
  }

  countUserList()
  {

    if (this.currentPage * this.defaultCountPerPage > this.usersData.length) {
      return this.usersData.slice((this.currentPage - 1)*this.defaultCountPerPage,  this.usersData.length)
    } else {
      return this.usersData.slice((this.currentPage - 1)*this.defaultCountPerPage,  this.currentPage * this.defaultCountPerPage)
    }
  }

  handleUserStatusChange(userId, userStatus, index){
    
    const willBlock = userStatus === 'active' ? true : false;
    const reqURL = willBlock ? "http://localhost:8000/api/v1/admin/users/block?user_id=" + userId : "http://localhost:8000/api/v1/admin/users/activate?user_id=" + userId;

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
        
        let tempList = this.state.userList;
        let selectedItem = tempList[index];

        tempList[index]['status'] = userStatus === 'active' ? 'blocked' : 'active';
        let c_index = this.usersData.indexOf(selectedItem);
        
        if (c_index) {
          this.usersData[c_index]['status'] = userStatus === 'active' ? 'blocked' : 'active';
        }


        this.setState({userList: tempList});
        return;
      } else {
        alert(data['message']);
      }


    }).catch(function(error) {
      alert(error);
    });
  }

  handleUserAccessPermission(userId, accessStatus, index){
    const reqURL = "http://localhost:8000/api/v1/admin/user/access-blog?user_id=" + userId + '&blog_access=' + accessStatus;

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
        
        let tempList = this.state.userList;
        let selectedItem = tempList[index];

        tempList[index]['blog_access'] = accessStatus;
        let c_index = this.usersData.indexOf(selectedItem);
        
        if (c_index) {
          this.usersData[c_index]['blog_access'] = accessStatus;
        }


        this.setState({userList: tempList});
        return;
      } else {
        alert(data['message']);
      }


    }).catch(function(error) {
      alert(error);
    });
  }

  handleUserDelete(userId, index){

    this.removedUserId = userId;
    this.removedIndex= index;
    this.togglePrimary();
  }

  confirmDelete()
  {
    this.togglePrimary();

    let reqURL = "http://localhost:8000/api/v1/admin/user/delete?user_id=" + this.removedUserId;

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
        
        let tempList = this.state.userList;
        let removedItem = tempList[this.removedIndex];

        tempList.splice(this.removedIndex, 1);
        let index = this.usersData.indexOf(removedItem);
        if ( index ) {
          this.usersData.splice(index, 1);
        }

        this.setState({userList: tempList});
        return;
      } else {
        alert(data['message']);
      }


    }).catch(function(error) {
      alert(error);
    });


  }

  togglePrimary(){
    this.setState({
      primary: !this.state.primary,
    });
  }

  render() {

    return (
      <div className="animated fadeIn">
        
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Registered Users
                <Col md="5" className="card-header-actions">
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <Button type="button" color="primary"><i className="fa fa-search"></i> Search</Button>
                    </InputGroupAddon>
                    <Input type="text" id="input1-group2" name="input1-group2" placeholder="Username" onChange={this.handleUsername} value={this.state.username}/>
                  </InputGroup>
                </Col>
              </CardHeader>
              <CardBody>
                <Table hover bordered responsive>
                  <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Deposited amount</th>
                    <th scope="col">Current amount</th>
                    <th scope="col">DM profit</th>
                    <th scope="col">Blog Access</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                    <th scope="col">Remove</th>
                  </tr>
                  </thead>
                  <tbody>
                    {this.state.userList.map((user, index) =>
                      <UserRow key={index} sequence={index} user={user} rate={this.state.rate} onUserStatusChange={this.handleUserStatusChange.bind(this)} onUserDelete={this.handleUserDelete.bind(this)} onUserAccessPermission={this.handleUserAccessPermission.bind(this)}/>
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
          <ModalHeader toggle={this.togglePrimary}>Confirm</ModalHeader>
            <ModalBody>
              Are you sure to remove user?      
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.confirmDelete}>Yes</Button>{' '}
              <Button color="secondary" onClick={this.togglePrimary}>Discard</Button>
            </ModalFooter>
          </Modal>

      </div>
    )
  }
}

export default Users;
