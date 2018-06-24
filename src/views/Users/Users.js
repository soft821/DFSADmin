import React, { Component } from 'react';
import { Button, Badge, Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import  FunctionablePaginator  from '../mine/FunctionablePaginator';


function UserRow(props) {
  const user = props.user
  const userLink = `/users/${user.id}`
  const sequence = props.sequence

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


  return (
    <tr key={user.id.toString()}>
        <th scope="row"><a href={userLink}>{user.id}</a></th>
        <td><a href={userLink}>{user.name}</a></td>
        <td>{user.email}</td>
        <td>{user.username}</td>
        <td>{user.created_at}</td>
        <td><Badge href={userLink} color={getBadge(user.status)}>{user.status}</Badge></td>
        <td><Button block color={getButtonColor(user.status)} onClick={changeStatus}>{getStatusTitle(user.status)}</Button></td>
    </tr>
  )
}

class Users extends Component {
  
 
  constructor(props){
    super(props);
    this.state = {
      userList: []
    }
    
    this.currentPage = 1
    this.defaultCountPerPage = 10;
    this.totalDisplayed = 5;
   
  }

  componentDidMount() {
    
    this.loadUsersData()
  }

  loadUsersData()
  {
    let authToken = localStorage.getItem('token');

    fetch("http://192.168.0.147:8000/api/v1/admin/users", {
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
        this.totalPages  = Math.ceil(this.usersData.length / this.defaultCountPerPage);
        this.setState({userList : this.countUserList()})
        
        return;
      } else {
        alert(data['message']);
      }


    }).catch(function(error) {
      alert(error);
    });
    
    
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
    const reqURL = willBlock ? "http://192.168.0.147:8000/api/v1/admin/users/block?user_id=" + userId : "http://192.168.0.147:8000/api/v1/admin/users/activate?user_id=" + userId;

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
        tempList[index]['status'] = userStatus === 'active' ? 'blocked' : 'active';
        this.setState({userList: tempList});
        return;
      } else {
        alert(data['message']);
      }


    }).catch(function(error) {
      alert(error);
    });

    console.log(index);
  }

  render() {

    return (
      <div className="animated fadeIn">
        
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Registered Users
              </CardHeader>
              <CardBody>
                <Table hover bordered responsive>
                  <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Username</th>
                    <th scope="col">Registration date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                  </thead>
                  <tbody>
                    {this.state.userList.map((user, index) =>
                      <UserRow key={index} sequence={index} user={user} onUserStatusChange={this.handleUserStatusChange.bind(this)}/>
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

export default Users;
