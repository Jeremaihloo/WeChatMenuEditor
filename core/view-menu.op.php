<?php 
	include('config.inc.php');
	include('WeiXin.class.php');

	$wx = WeiXin::getInstance();
	$menu = $wx->viewMenu();
	
	header('Content-type: application/json');
	
	echo json_encode($menu);
?>