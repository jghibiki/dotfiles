## Recieve Options
folder-hook jordan.goetze@gmail.com set from="jordan.goetze@gmail.com"
set spoolfile="+jordan.goetze@gmail.com/INBOX"
set postponed = "+Drafts"
set record = "+Sent Mail"


## Send options.
set smtp_url=smtps://jordan.goetze@smtp.gmail.com
set realname='Jordan Goetze'
set from=jordan.goetze@gmail.com
set hostname="gmail.com"
set signature=""
# Connection options
set ssl_force_tls = yes
unset ssl_starttls
