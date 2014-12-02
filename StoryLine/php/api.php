<?php
include 'db.php';

$con = mysqli_connect($host, $user);
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}
$dbs = mysqli_select_db($con, $databaseName);

$result = mysqli_query($con, "SELECT * FROM word");

$data = array();
$count = 0;
while ($row = mysqli_fetch_array($result))
{
    $data[$count] = $row;
    $count++;
}
echo json_encode($data);
?>