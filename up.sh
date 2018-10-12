#!/bin/sh
forever stop server.js
forever start -o server.log -e err_server.log server.js
