#!/bin/sh
xrandr --setprovideroutputsource 1 0
xrandr --output VIRTUAL1 --off --output DP1 --off --output HDMI1 --off --output LVDS1 --mode 1600x900 --pos 1920x0 --rotate normal --output DVI-I-1 --primary --mode 1920x1080 --pos 0x0 --rotate normal --output VGA1 --off
