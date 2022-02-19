// TODO:
// The solution must be close to real life applications
//
// 1) loading users + state management (use Redux-way by creating reducer and actions)
//    - load users
//    - implement pagination (populate existing user list with a list of the next page)
//    - control "loading" status
//    - handle failed request, save error (if any error occured during loading process)
//    - handle successful response

// 2) Load users on init

// 3) Show error message if request failed

// 4) "Next page" button
//    - disable button (use "disabled" class) during users loading and show "Loading..." text
//    - on click, load next part of users

// 5) Implement reusable "Table" and table "Column" components
//    - check the expected result in the App component
//    - the "title" prop of "Column" represents the title of Table column
//    - if no data and loading is in progress - show "Loading..." text
//    - if loading is completed but there is no data - show "No Data." message

// 6) Create a simple Modal box with user photo overview
//    - open modal on image click in "Photo" column
//    - add "close" button that closes the modal on click

import React, { useEffect, useState } from "react";
import './App.css';
const API_URL = "https://randomuser.me/api/?results=5";

const Modal = props => {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <h3>{props.currentUserName} {props.currentUserSurname}</h3>
        <img src={props.currentPhoto} alt=""/>
        <button onClick={props.onClose}>Close</button>
      </div>
    </div>
  )
};

function Table(users) {
  let [currentPhoto, setCurrentPhoto] = useState('');
  let [currentUserName, setCurrentUserName] = useState('');
  let [currentUserSurname, setCurrentUserSurname] = useState('');
  let [isVisible, setIsVisible] = useState(false);

  const handlePhotoClick = event => {
    setIsVisible(event.target.className === "image-button");
    setCurrentPhoto(users.users[event.target.getAttribute('id')].picture.large);
    setCurrentUserName(users.users[event.target.getAttribute('id')].name.first);
    setCurrentUserSurname(users.users[event.target.getAttribute('id')].name.last);
  };

  return (
    <>
      <table className="table table-bordered table-striped"
             onClick={handlePhotoClick}>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
              {users.users.map((user, index) =>
              <tr key={index}>
                <td>
                  <img className="image-button"
                       key={index}
                       id={index}
                       src={users.users[index].picture.thumbnail}
                       alt="photo" />
                </td>
                <td>
                  {users.users[index].name.title} {users.users[index].name.first} {users.users[index].name.last}
                </td>
                <td>
                  {users.users[index].gender}
                </td>
                <td>
                  {users.users[index].email}
                </td>
              </tr>
              )}
        </tbody>
      </table>
      {isVisible &&
      <Modal onClose={() => setIsVisible(false)}
                           isVisible={isVisible}
                           currentPhoto={currentPhoto}
                           currentUserName={currentUserName}
                           currentUserSurname={currentUserSurname}
      />}
    </>
  );
}

function App() {
  let [users, setUsers] = useState([]);
  let [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => setUsers(data.results))
    .catch((error) => console.log("error", error))
  }, []);

 function handleClick() {
   setIsLoading(true);

   fetch(API_URL)
     .then(response => response.json())
     .then(data => setUsers([...users, ...data.results]))
     .catch((error) => console.log("error", error))
     .finally(() => setIsLoading(false));
 }

  return (
    <div className="App">
      <div className="container">
        <h1>Table of Users</h1>

        {users.length ?
          <Table users={users}/>
          : <p>Loading...</p>
        }

        <button className="btn btn-dark"
                disabled={isLoading}
                type="button"
                onClick={() => {handleClick()}}
        >
          {isLoading ? 'Loading...' : 'Next page'}
        </button>
      </div>
    </div>
  );
}

export default App;