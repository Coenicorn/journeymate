<?php
$servername = "localhost";
$username = "mysql";
$password = "";
$dbname = "test";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$name =  $_GET['name'];
$email =  $_GET['email'];
$password =  $_GET['psw'];
$location =  $_GET['location'];

$sql = "INSERT INTO journeymate (id, email, password, name, location)
VALUES ('2', '$email', '$password', '$name', '$location')";

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>