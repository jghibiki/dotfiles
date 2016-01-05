#!/bin/bash
#
#~/.xinitrc
#
# Executed by startx (run your own window manager from here)

# set synaptic touchpad -
#synclient VertEdgeScroll=1
#synclient VertTwoFingerScroll=1
#synclient HorizEdgeScroll=1
#synclient HorizTwoFingerScroll=1


#auto configure monitor
multi=0
if [ `xrandr --listproviders | grep -c 'name:modesetting'` -eq 1 ]; then
    xrandr --setprovideroutputsource 1 0
    if [ `xrandr | grep -c 'DVI-I-1 connected '` -eq 1 ]; then
        source .screenlayout/swapped.sh;

        head -n -6 .i3/config;

        echo 'workspace "1:" output DVI-I-1 
        workspace "2:" output DVI-I-1
        workspace 3 output DVI-I-1
        workspace 4 output DVI-I-1
        workspace 5 output DVI-I-1
        workspace 6 output DVI-I-1' >> .i3/config;
    else
        multi=1
    fi
else
    multi=1
fi

if [ "$multi" -eq 1 ]; then
    head -n -6 .i3/config;

    echo 'workspace "1:" output LVDS1
    workspace "2:" output LVDS1
    workspace 3 output LVDS1
    workspace 4 output LVDS1
    workspace 5 output LVDS1
    workspace 6 output LVDS1' >> .i3/config;
fi

# sets mouse pointer -
xsetroot -cursor_name left_ptr

# reads x configuration -
xrdb -merge ~/.Xresources
# sets custom key bindings -
# xbindkeys

xset -dpms

# sets brightness to half -
xbacklight -set 50

# turn numlock on automatically
xdotool key num_lock

# sets backgrouds
# if [ -f ~/.fehbg ]; then
#     eval $(cat ~/.fehbg)

# fi
if [ -f ~/.wallpaper.sh ]; then
    sh ~/.wallpaper.sh &
fi

# set up xmobar
#trayer --edge top --align right --SetDockType true --SetPartialStrut true --expand true --width 12 --transparent true --alpha 0 --tint 0x000000 --height 16 &

# mute system beep
xset -b

#start screensaver/lockscreen daemon
xscreensaver -nosplash&


#export DE='thunar'

#reset screen layout
sh .screenlayout/default.sh &

export LANG="en_US.UTF-8"


#start composite manager
compton -b -f --backend glx --vsync opengl-swc --glx-no-stencil --paint-on-overlay --config ~/.config/compton/config
sleep 1

gpg-agent --daemon --enable-ssh-support --options ~/.gpg-agent-info

setkeycodes 114 122
setkeycodes 115 123


# set up window manager
#exec startxfce4
#exec xmonad
exec i3

