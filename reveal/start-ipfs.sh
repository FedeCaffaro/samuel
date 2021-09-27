#!/bin/bash

ipfs daemon --writable &
/usr/src/app/reveal-ipfs.sh
tail -f /dev/null
