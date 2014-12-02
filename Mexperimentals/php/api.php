<?php
include 'php/db.php';
$error = "couldn't connect with database";
echo $error;

$con = mysqli_connect($host, $user) or die($error);
$dbs = mysqli_select_db($databaseName, $con) or die($error);

$result = mysqli_query("SELECT * FROM 'word'") or die($error);

$data = array();
$count = 0;
while ($row = mysqli_fetch_row($result) or die($error))
{
    $data[$count] = $row;
    $count++;
}
echo '<p>Henk</p>';
//echo json_encode($data);
?>