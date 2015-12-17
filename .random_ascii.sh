

at_home=`netctl status TryMeWireless | grep dead`

if [ -n at_home ]; then
    img=`ls .sexy_ascii_imgs | sort -R | head -n 1`;
    cat ".sexy_ascii_imgs/$img";
else
    if  [ $((RANDOM % 2)) -eq 0 ]; then
        cowfortune;
    else
        img=`ls .ascii_imgs | sort -R | head -n 1`;
        cat ".ascii_imgs/$img";
    fi
fi
