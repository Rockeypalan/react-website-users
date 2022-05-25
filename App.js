import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {Table} from 'react-bootstrap';
import { Form, Button, Navbar, NavbarBrand } from 'react-bootstrap';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {

   const [users, setUsers] = useState([]);

   const loadUser = async () => {
      const response = await axios.get('http://localhost:3333/posts');
      setUsers(response.data.reverse());
   };

   useEffect(() =>{
      loadUser();
   },[]);

   const [userInput, setUserInput] = useState({
      name: '',
      email: '',
      password: '',
      address: '',
      phone: '',
      role: ''
   });

   const [userId, setUserId] = useState(null);
   const [editMode, setEditMode] = useState(false);

   const handleSubmit = async e => {
      e.preventDefault();
      if(!userInput.name || !userInput.email || !userInput.password || !userInput.address || !userInput.phone || !userInput.role){
         toast.error('Please enter all the fields..')
      } else{
         if(!editMode){
            axios.post("http://localhost:3333/posts", userInput);
            toast.success('Added Successfully');
            setUserInput({ name: '', email: '', password: '', address: '', phone: '', role: ''});
            setTimeout(() => loadUser(), 500);
         }else{
            axios.put(`http://localhost:3333/posts/${userId}`, userInput);
            toast.success('Updated Successfully..');
            setUserInput({ name: '', email: '', password: '', address: '', phone: '', role: ''});
            setTimeout(() => loadUser(), 500);
            setUserId(null);
            setEditMode(false); 
         }
      }
   };

   const handleChange = (e) =>{
      const { name, value } = e.target;
      setUserInput({...userInput, [name] : value});
   };

   const updateUser = (id) => {
      const singleUser = users.find(user => user.id === id);
      setUserInput({...singleUser});
      setUserId(id);
      setEditMode(true);
   };

   const deleteUser = (id) => {
      if(window.confirm("Are u sure to delete?")){
         axios.delete(`http://localhost:3333/posts/${id}`)
         toast.error('User will be deleted');
         setTimeout(() => loadUser(), 500);
      }
   };

   return(
      <div>
         <ToastContainer/>
         <Navbar bg='info' variant='dark' className='justify-content-center'>
            <NavbarBrand>
               Registration App
            </NavbarBrand>
         </Navbar>
         <div className="container mb-5">
               <div className="w-75 mx-auto shadow p-4 ">
                  <h2 className='text-center mb-4'>Register</h2>
                  <Form onSubmit={handleSubmit}>
                     <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="text" name="name" value={userInput.name} onChange={handleChange} placeholder="Enter your Full Name" />
                     </Form.Group>

                     <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="email" name="email" value={userInput.email} onChange={handleChange} placeholder="Enter your email" />
                     </Form.Group>

                     <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="password" name="password" value={userInput.password} onChange={handleChange} placeholder="Enter Password" />
                     </Form.Group>

                     <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="text" name="address" value={userInput.address} onChange={handleChange} placeholder="Enter your Address" />
                     </Form.Group>

                     <Form.Group className="mb-3" controlId="formBasicNumber">
                        <Form.Control type="number" name="phone" value={userInput.phone} onChange={handleChange} placeholder="Enter Phone Number" />
                     </Form.Group>

                     <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Check type="radio" name="role" label='ADMIN' value= "ADMIN" onChange={handleChange}  />
                        <Form.Check type="radio" name="role" label='GUEST' value="GUEST" onChange={handleChange} />
                     </Form.Group>

                     <div className='d-grid'>
                        {(!editMode) ?
                           <Button size='lg' class="btn btn-outline-primary" variant="primary" type="submit">Submit</Button>
                           :
                           <Button size='lg' class="btn btn-outline-success" variant="success" type="submit">Update </Button>
                           
                        }
                     </div>
                  </Form>
               </div>
         </div>
         <div className='d-grid' >
            <h2  className='text-center mb-4'>User Information</h2>
               <Table className=" shadow " striped bordered hover >
                  <thead >
                     <tr className ="text-center">
                        <th>Sl.No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone No</th>
                        <th>Role </th>
                        <th>Action </th>
                     </tr>
                  </thead>
                  {users.map((user, index) => ( 
                     <tbody> 
                        <tr key={index} className ="text-center">
                           <td>{index + 1}</td>
                           <td>{user.name}</td>    
                           <td>{user.email}</td>
                           <td>{user.address}</td>
                           <td>{user.phone}</td>
                           <td>{user.role}</td>
                           <td>
                              <div
                                 class="btn btn-outline-warning mx-1"
                                 onClick={() => updateUser(user.id)}
                                 >
                                 Edit 
                              </div>
                              <div
                                 class="btn btn-outline-danger mx-1"
                                 onClick={() => deleteUser(user.id)}
                                 >
                                 Delete
                              </div>
                           </td>
                        </tr>
                     </tbody>
                  ))}
               </Table>
            </div>
      </div>
   ); 
}