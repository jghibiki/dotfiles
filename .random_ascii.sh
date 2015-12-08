


if  [ $((RANDOM % 2)) -eq 0 ]; then
    cowfortune;
else
    img=`ls .ascii_imgs | sort -R | head -n 1`;
    cat ".ascii_imgs/$img";
fi
