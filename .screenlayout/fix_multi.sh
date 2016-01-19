#!/bin/bash
if [ `xrandr --listproviders | grep -c 'name:modesetting'` -eq 1 ]; then
    xrandr --setprovideroutputsource 1 0
    if [ `xrandr | grep -c 'DVI-I-1 connected '` -eq 1 ]; then
        source .screenlayout/single.sh;
        source .screenlayout/swapped.sh;
    fi
fi
