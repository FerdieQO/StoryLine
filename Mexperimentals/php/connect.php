<?php
$host = "localhost";
$username = "root";
$dbname = "storyline";
$error = "couldn't connect with database";

$db = mysql_connect($host, $username) or die($error); // password?
mysql_select_db($dbname, $db) or die($error);
?>