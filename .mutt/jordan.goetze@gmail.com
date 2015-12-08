## Receive options.
set imap_user=jordan.goetze@gmail.com
set imap_pass=''
set spoolfile = imaps://jordan.goetze@imap.gmail.com/
set postponed = +Drafts
set record = +Sent

## Send options.
set smtp_url=smtps://user:jordan.goetze@smtp.gmail.com
set realname='Jordan Goetze'
set from=jordan.goetze@gmail.com
set hostname="gmail.com"
set signature=""
# Connection options
set ssl_force_tls = yes
unset ssl_starttls

## Hook -- IMPORTANT!
account-hook $folder "set imap_user=jordan.goetze@gmail.com imap_pass='' "
