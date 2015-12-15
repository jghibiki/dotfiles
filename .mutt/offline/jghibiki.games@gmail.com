## Recieve Options
folder-hook jghibiki.games@gmail.com set from="jghibiki.games@gmail.com"
set spoolfile="+jghibiki.games@gmail.com/INBOX"
set postponed = "+jghibiki.games@gmail.com/\[Gmail\].Drafts"
set record = "+jghibiki.games@gmail.com/\[Gmail\].Sent Mail"

## Send options.
set smtp_url=smtps://jghibiki.games@smtp.gmail.com
set realname='jghibiki'
set from=jghibiki.games@gmail.com
set hostname="gmail.com"
set signature=""
# Connection options
set ssl_force_tls = yes
unset ssl_starttls



# override update keybind
macro index \cr '<shell-escape>/usr/bin/offlineimap -a jghibiki_games<enter><sync-mailbox>'
