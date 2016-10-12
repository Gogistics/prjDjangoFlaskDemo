# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
from base64 import b64encode
import os

def index(request):
  # if 'auth_base' not in request.session:
  #   request.session['auth_base'] = {'permission': 1, 'tkn': b64encode(os.urandom(12)).decode('utf-8')}
  #   request.session.set_expiry(3600)
  return render(request, 'index.html')