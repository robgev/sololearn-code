#!/bin/bash

if [ -z "$CONFIG" ]; then
	echo "Config is not provided, will use default settings"
else
	echo "Working with following config file"
	echo $CONFIG
	cp $CONFIG/* .
fi

service ssh start
echo "SSH Service started"
dotnet SoloLearn.dll 
