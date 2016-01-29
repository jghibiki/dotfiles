
#!/bin/sh

while true; do
    if [[ ` echo $[ RANDOM % 2]` -eq 1  ]]; then
        find -L ~/.wallpapers -type f \( -name '*.jpg' -o -name '*.png' \) -print0 |
            shuf -n1 -z | xargs -0 feh --bg-max
    else
        ~/Git/BackgroundQuotes/BgQuotes.py -f ~/Git/BackgroundQuotes/fonts.json -q ~/Git/BackgroundQuotes/quotes.json -h 900 -w 1600 -o /tmp/my_bg.png -s 20;
        feh --bg-max /tmp/my_bg.png

    fi
	sleep 15s 
done
