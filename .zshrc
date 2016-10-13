# Path to your oh-my-zsh installation.
export ZSH=/home/jghibiki/.oh-my-zsh

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
if [[ "$TERM" = "xterm" ]]; then
    ZSH_THEME="agnoster"
else
    ZSH_THEME="gentoo"
fi

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git cp debian docker httpie npm node pip python screen sudo taskwarrior virtualenv autojump sublime extract django emoji archlinux fabric git-flow ssh-agent)

# User configuration

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/home/jghibiki/.rvm/bin:/home/jghibiki/.rvm/bin::/home/jghibiki/.rvm/bin:/home/jghibiki/bin"
# export MANPATH="/usr/local/man:$MANPATH"

source $ZSH/oh-my-zsh.sh

# You may need to manually set your language environment
export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting

export EDITOR=vim
export BROWSER='chromium'
export TERM=xterm-256color
export PYTHONPATH=/usr/lib/python2.7/site-packages:$PYTHONPATH
export GOPATH=$HOME/go
export PATH=$GOPATH:$GOPATH/bin:$PATH

# ssh
# export SSH_KEY_PATH="~/.ssh/dsa_id"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
alias irc="screen irssi"
alias ag="/usr/bin/ag"
alias m="mutt"
export WORKON_HOME=~/.venv
alias venv="source /usr/bin/virtualenvwrapper.sh"
alias lock="xscreensaver-command -lock"
alias fuck='eval $(thefuck $(fc -ln -1))'
# You can use whatever you want as an alias, like for Mondays:
alias FUCK='fuck'
alias lmutt='mutt -F .mutt/muttrc.live'
alias lm="lmutt"
#alias vim="nvim"
alias dc='docker-compose'
alias dm='docker-machine'
alias d='docker'
alias umaru='eval "$(dm env umaru-chan)"'
alias eclim='/home/jghibiki/.eclipse/org.eclipse.platform_4.5.2_155965261_linux_gtk_x86_64/eclimd'
alias tw='timew'
# added by travis gem
[ -f /home/jghibiki/.travis/travis.sh ] && source /home/jghibiki/.travis/travis.sh

# virtual env wrapper config
#export WORKON_HOME=$HOME/.virtualenvs
#export PROJECT_HOME=$HOME/Git/
#export VIRTUALENVWRAPPER_SCRIPT=/usr/local/bin/virtualenvwrapper.sh
#source /usr/local/bin/virtualenvwrapper_lazy.sh
if [[ -r ~/.local/lib/python2.7/site-packages/powerline/bindings/zsh/powerline.zsh ]]; then
    source ~/.local/lib/python2.7/site-packages/powerline/bindings/zsh/powerline.zsh
fi

# source z for dir jumping 
_Z_CMD='j'
source ~/Git/z/z.sh


. $HOME/.shellrc.load


[ -n "$XTERM_VERSION" ] && transset-df -a >/dev/null
PATH="/usr/local/heroku/bin:$PATH"

source /home/jghibiki/.dvm/dvm.sh

export PATH="$HOME/.yarn/bin:$PATH"
