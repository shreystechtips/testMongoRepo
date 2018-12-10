var userListData = [];

$(document).ready(function(){
    populateTable();
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    $('#btnAddUser').on('click', addUser);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    $('#deleteAllData').on('click', deleteAllUsers);
});

function populateTable() {

    // Empty content string
    var tableContent = '';
  
    // jQuery AJAX call for JSON
    $.getJSON( '/users', function( data ) {
        userListData = data;
      // For each item in our JSON, add a table row and cells to the content string
      $.each(data, function(){
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
        tableContent += '<td>' + this.email + '</td>';
        tableContent += '<td>' + this._id + '</td>';
        tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
        tableContent += '</tr>';
      });
  
      // Inject the whole content string into our existing HTML table
      $('#userList table tbody').html(tableContent);

    });
  };

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    if(!thisUserObject.hasOwnProperty('fullname')){
        $('#userInfoName').text('Error Parsing Data');
    }
    else{
        $('#userInfoName').text(thisUserObject.fullname);
    }
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
};

function addUser(event){
    event.preventDefault();

    var errorCount = 0;
    $('#addUser input').each(function(index,val){
        if($(this).val() === ''){ errorCount++; }
    });

    if(errorCount === 0){
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullName').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
            }

        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response){
            if(response.msg === ''){
                $('#addUser fieldset input').val('');
    
                populateTable();
            }
            else{
                alert('Error: ' + response.msg);
            }
        });
    }
    else{
        alert('Please Fill out all fields');
        return false;
    }
};

function deleteUser(event){
    event.preventDefault();

    var confirmation = confirm('Are you sure you want to delete this user?');

    if (confirmation === true){
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function(response){
            if(!response.msg === ''){
                alert('Error: ' + response.msg);
            }

            populateTable();
        });
    }
    else{
        return false;
    }
};

function deleteAllUsers(event){
    var confirmation = confirm('Are you sure you want to delete ALL users?');
    if (confirmation){
        setTimeout(alert('abt to delete server data'), 5000);
        confirmation=confirm('Are you really sure you want to wipe the server???')
        if(confirmation){
            $.getJSON( '/users', function( data ) {
                userListData = data;
              // For each item in our JSON, add a table row and cells to the content string
              $.each(data, function(){
                $.ajax({
                    type: 'DELETE',
                    url: '/users/deleteuser/' + this._id,
                }).done(function(response){
                    if(response.msg !== ''){
                        confirmation('Error: ' + response.msg);
                    }
        
                    populateTable();
                });
              });
            });
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
};
