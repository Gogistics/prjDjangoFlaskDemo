# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
import os

def index(request):
  request.session['auth_base'] = {'permission': 1, 'tkn': os.urandom(12)}
  request.session.set_expiry(3600)
  return render(request, 'index.html')