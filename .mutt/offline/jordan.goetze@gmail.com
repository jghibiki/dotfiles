## Recieve Options
folder-hook jordan.goetze@gmail.com set from="jordan.goetze@gmail.com"
folder-hook jordan.goetze@gmail.com source "~/.mutt/offline/jordan.goetze@gmail.com"

set folder="~/Mail/jordan.goetze@gmail.com/"
set spoolfile="+INBOX"
set postponed = "+\[Gmail\].Drafts"
set record = "+\[Gmail\].Sent Mail"


## Send options.
set imap_user=jordan.goetze@gmail.com
set imap_pass = `pass mutt/jordan.goetze@gmail.com`
set smtp_url=smtps://$imap_user:$imap_pass@smtp.gmail.com
set realname='Jordan Goetze'
set from=jordan.goetze@gmail.com
set hostname="gmail.com"
set signature=""
# Connection options
set ssl_force_tls = yes
unset ssl_starttls


# override update keybind
macro index \cr '<shell-escape>/usr/bin/offlineimap -a jordan_goetze<enter><sync-mailbox>'
