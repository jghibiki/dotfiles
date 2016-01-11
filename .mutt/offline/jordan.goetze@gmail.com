## Recieve Options
folder-hook jordan.goetze@gmail.com set from="jordan.goetze@gmail.com"
folder-hook jordan.goetze@gmail.com source "~/.mutt/offline/jordan.goetze@gmail.com"

set spoolfile="+jghibiki.games@gmail.com/INBOX"
set postponed = "+jghibiki.games@gmail.com/\[Gmail\].Drafts"
set record = "+jghibiki.games@gmail.com/\[Gmail\].Sent Mail"


## Send options.
set smtp_url=smtps://jordan.goetze@smtp.gmail.com
set realname='Jordan Goetze'
set from=jordan.goetze@gmail.com
set hostname="gmail.com"
set signature=""
# Connection options
set ssl_force_tls = yes
unset ssl_starttls


# override update keybind
macro index \cr '<shell-escape>/usr/bin/offlineimap -a jordan_goetze<enter><sync-mailbox>'
