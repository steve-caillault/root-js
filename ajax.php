<?php

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$params = ${ '_' . $method};

$type = ($params['type'] ?? 'text');
$withError = (bool) ($params['with-error'] ?? FALSE);

if($withError)
{
	http_response_code(400);
}

if($type == 'text') 
{
	exit('Test Ajax ' . date('Y-m-d H:i:s'));
}
elseif($type == 'json')
{
	$data = [
		'name' => 'Test Ajax JSON',
		'date' => date('Y-m-d H:i:s'),
	];
	
	if($withError)
	{
		$data['error'] = TRUE;
	}
	
	exit(json_encode($data));
}
elseif($type == 'upload-file')
{
	$data = $_FILES;
	exit(json_encode($data));
}