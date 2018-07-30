import React, { Component } from 'react';
import { Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader,Input,InputGroupAddon,InputGroup} from 'reactstrap';
import  FunctionablePaginator  from '../../mine/FunctionablePaginator';
import { AppSwitch } from '@coreui/react';
import { toast } from 'react-toastify';
import { API_ROOT } from '../../../api-config';

function BlogRow(props) {
  const user = props.user
  // const userLink = `/users/${user.id}`
  const sequence = props.sequence
  const rate = props.rate
  const blog = props.blog

  const getBadge = (status) => {
    return status === 'true' ? 'success' : 'danger'
  }

  const getStatusTitle = (status) => {
    return status === 'active' ? 'Block' : 'Active'
  }

  // const getButtonColor = (status) => {
  //   return status === 'active' ? 'danger' : 'success'
  // }

  // function changeStatus(e){

  //   props.onUserStatusChange(user.id, user.status, sequence);
  // }

  function removeBlog(e){
    props.onBlogDelete(blog.id, sequence);
  }

  function ChangeBlogStatus(e){

    props.onBlogStatusChange(blog.id, e.target.checked, sequence);
  }

  return (
    <tr key={blog.id.toString()}>
        <th scope="row"><a href="#">{blog.id}</a></th>
        <td><a href="#">{blog.title}</a></td>
        <td>{blog.categoryName}</td>
        <td>{blog.blogerName}</td>
        <td>{blog.updated_at.toString()}</td>
        <td><Badge href="#" color={getBadge(blog.publishStatus.toString())}>{blog.publishStatus ===true? 'Published': 'Not published'}</Badge></td>
        <td className='text-center'><AppSwitch className={'mx-1'} variant={'3d'} color={'success'} checked={blog.publishStatus} onChange={ChangeBlogStatus}/></td>

        <td>
          <Button block color="warning" onClick={removeBlog}>Remove</Button>
        </td>
    </tr>
  )
}

class Blogs extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      userList: [],
      primary: false,
      rate: 0,
      username: '',
      blogList: [],
      blogTitle: '',
    }
    
    this.currentPage = 1
    this.defaultCountPerPage = 10;
    this.totalDisplayed = 5;


    this.togglePrimary = this.togglePrimary.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleBlogTitle = this.handleBlogTitle.bind(this);
  }

  componentDidMount() {
    
    this.loadBlogsData()
    
  }

  loadBlogsData()
  {
    let authToken = localStorage.getItem('token');

    fetch(API_ROOT + "/api/v1/posts/list", {
      method: 'get',
      headers: {
          'Authorization' : 'Baerer ' + authToken,
          'Content-Type': 'application/json',
      }, 
     
    }).then(function(response){
     
        return response.json();
  
    }).then((data) => { 
      if (data['status'] == 0) {
        this.blogsData = data['response'];
        this.blogsRecoveryData = data['response'];
        this.totalPages  = Math.ceil(this.blogsData.length / this.defaultCountPerPage);
        this.setState({blogList : this.countBlogList()})
        
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

  handleBlogTitle(e){
    
    this.currentPage = 1
    if (e.target.value.trim() == "") {
      this.blogsData = this.blogsRecoveryData.slice(0, this.blogsRecoveryData.length + 1);
      
    } else {
      
      var filteredArray = [];
      this.blogsRecoveryData.forEach((blog) => {
        if (blog.title.toUpperCase().search(e.target.value.toUpperCase()) !== -1) {
          filteredArray.push(blog);
        } 
      });
      
      this.totalPages  = Math.ceil(this.blogsData.length / this.defaultCountPerPage);
      this.blogsData = filteredArray.slice(0, filteredArray.length + 1)
      
    }

    this.setState({blogList : this.countBlogList()})
    this.setState({blogTitle: e.target.value});

  }

  handlePagerClick(e){
    this.currentPage = e;
    this.setState({blogList : this.countBlogList()})
  }

  countBlogList()
  {

    if (this.currentPage * this.defaultCountPerPage > this.blogsData.length) {
      return this.blogsData.slice((this.currentPage - 1)*this.defaultCountPerPage,  this.blogsData.length)
    } else {
      return this.blogsData.slice((this.currentPage - 1)*this.defaultCountPerPage,  this.currentPage * this.defaultCountPerPage)
    }
  }

  handleUserStatusChange(userId, userStatus, index){
    
    const willBlock = userStatus === 'active' ? true : false;
    const reqURL = willBlock ? API_ROOT + "/api/v1/admin/users/block?user_id=" + userId : API_ROOT + "/api/v1/admin/users/activate?user_id=" + userId;

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

  handleBlogStatusChange(blogId, publishStatus, index){
    const reqURL = API_ROOT + "/api/v1/admin/post/publish-blog?blog_id=" + blogId + '&blog_publish=' + publishStatus;

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
        
        let tempList = this.state.blogList;
        let selectedItem = tempList[index];

        tempList[index]['publishStatus'] = publishStatus;
        let c_index = this.blogsData.indexOf(selectedItem);
        
        if (c_index) {
          this.blogsData[c_index]['publishStatus'] = publishStatus;
        }


        this.setState({blogList: tempList});
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

  handleBlogDelete(blogId, index){

    this.removedBlogId = blogId;
    this.removedIndex= index;
    this.togglePrimary();
  }

  confirmDelete()
  {
    this.togglePrimary();

    let reqURL = API_ROOT + "/api/v1/admin/posts/delete/" + this.removedBlogId;

    let authToken = localStorage.getItem('token');
    fetch(reqURL, {
      method: 'delete',
      headers: {
          'Authorization' : 'Baerer ' + authToken,
          'Content-Type': 'application/json',
      }, 
     
    }).then(function(response){
     
        return response.json();
  
    }).then((data) => { 
      
      if (data['status'] == 0) {
        
        let tempList = this.state.blogList;
        let removedItem = tempList[this.removedIndex];

        tempList.splice(this.removedIndex, 1);
        let index = this.blogsData.indexOf(removedItem);
        if ( index ) {
          this.blogsData.splice(index, 1);
        }

        this.setState({blogList: tempList});
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
                <i className="fa fa-align-justify"></i> Posted Blogs
                <Col md="5" className="card-header-actions">
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <Button type="button" color="primary"><i className="fa fa-search"></i> Search</Button>
                    </InputGroupAddon>
                    <Input type="text" id="input1-group2" name="input1-group2" placeholder="BlogTitle" onChange={this.handleBlogTitle} value={this.state.blogTitle}/>
                  </InputGroup>
                </Col>
              </CardHeader>
              <CardBody>
                <Table hover bordered responsive>
                  <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Title</th>
                    <th scope="col">Category</th>
                    <th scope="col">Author</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">PublishAction</th>
                    <th scope="col">Remove</th>
                  </tr>
                  </thead>
                  <tbody>
                    {this.state.blogList.map((blog, index) =>
                      <BlogRow key={index} sequence={index} blog={blog} onBlogStatusChange={this.handleBlogStatusChange.bind(this)} onBlogDelete={this.handleBlogDelete.bind(this)}/>
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

export default Blogs;
