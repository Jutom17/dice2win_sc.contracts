#!/bin/bash

cd /Users/vincent/Develop/dice2win_blockchain_sc/web3

for index in {1..500}
do
    wc "/Users/vincent/Downloads/test/$index.log" 
done

echo "all done"