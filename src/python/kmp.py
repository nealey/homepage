#! /usr/bin/env python

# Description: Knuth-Morris-Pratt algorithm

"""Knuth-Morris-Pratt algorithm

This is a direct transaltion of the KMP algorithm in the book
"Introduction to Algorithms" by Cormen, Lieserson, and Rivest.  See that
book for an explanation of why this algorithm works.  It's pretty cool.

The only things I changed were some offsets, to cope with the fact that
Python arrays are 0-offset.

"""

__author__ = 'Neale Pickett <neale@woozle.org>'

def compute_prefix_function(p):
    m = len(p)
    pi = [0] * m
    k = 0
    for q in range(1, m):
        while k > 0 and p[k] != p[q]:
            k = pi[k - 1]
        if p[k] == p[q]:
            k = k + 1
        pi[q] = k
    return pi

def kmp_matcher(t, p):
    n = len(t)
    m = len(p)
    pi = compute_prefix_function(p)
    q = 0
    for i in range(n):
        while q > 0 and p[q] != t[i]:
            q = pi[q - 1]
        if p[q] == t[i]:
            q = q + 1
        if q == m:
            return i - m + 1
    return -1
