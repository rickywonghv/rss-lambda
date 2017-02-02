Lambda + API Gateway for RSS/Podcast Feed

add a Method Response header named Content-Type, then set Integration Response to set this to 'text/xml', then un-tick "Output passthrough" and supply an Output mapping of:

#set($inputRoot = $input.path('$'))
$inputRoot
