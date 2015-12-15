## Recieve Options
folder-hook jordan.goetze@gmail.com set from="jordan.goetze@gmail.com"
set spoolfile="+jordan.goetze@gmail.com/INBOX"
set postponed = "+jordan.goetze@gmail.com/\[Gmail\].Drafts"
set record = "+jordan.goetze@gmail.com/\[Gmail\].Sent Mail"


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
