## Receive optionse
set imap_user=jghibiki.games@gmail.com
set imap_pass= ''
set spoolfile = imaps://jghibiki.games@imap.gmail.com/
set postponed = +Drafts
set record = +Sent

## Send options.
set smtp_url=smtps://jghibiki.games@smtp.gmail.com
set realname='jghibiki'
set from=jghibiki.games@gmail.com
set hostname="gmail.com"
set signature=""
# Connection options
set ssl_force_tls = yes
unset ssl_starttls

## Hook -- IMPORTANT!
account-hook $folder "set imap_user=jghibiki.games@gmail.com imap_pass='' "
