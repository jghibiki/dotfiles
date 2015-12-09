## Receive options.
set imap_user=jordan.goetze@gmail.com
<<<<<<< HEAD
set imap_pass = `pass mutt/jordan.goetze@gmail.com`
=======
set imap_pass = '' 
>>>>>>> 7fe9a49... update mutt config to allow exchage mailing
set folder = imaps://jordan.goetze@imap.gmail.com/
set spoolfile = "+INBOX"
set postponed = "+Drafts"
set record = "+Sent Mail"

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
