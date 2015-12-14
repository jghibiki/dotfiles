#! /usr/bin/env python2
from subprocess import check_output

def jghibiki_games_pass():
        return check_output("pass mutt/jghibiki.games@gmail.com", shell=True).strip("\n'")


def jordan_goetze_pass():
        return check_output("pass mutt/jordan.goetze@gmail.com", shell=True).strip("\n'")


def ndsu_pass():
        return check_output("pass mutt/ndsu", shell=True).strip("\n'")

def evo1_pass():
        return check_output("pass mutt/evo1", shell=True).strip("\n'")
