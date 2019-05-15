#!/bin/bash

if [ -z "$CONFIG" ]; then
	echo "Config is not provided, will use default settings"
else
	echo "Working with following config file"
	echo $CONFIG
	cp $CONFIG/* .
fi

dotnet SoloLearn.dll >> /logs/web.log 2>&1 
