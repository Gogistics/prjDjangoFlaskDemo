# -*- coding: utf-8 -*-
from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin, BroadcastMixin
from socketio.sdjango import namespace

@namespace('/echo')
class EchoNamespace(BaseNamespace, RoomsMixin, BroadcastMixin):
  def __init__(self):
    self.broadcast_event('announcement', 'hello django + socketio')

  def initialize(self):
    self.logger = logging.getLogger("socketio.chat")
    self.log("Socketio session started")
        
  def log(self, message):
    self.logger.info("[{0}] {1}".format(self.socket.sessid, message))

  def on_msg(self, msg):
    pkt = dict(type='event',
               name='msg',
               args='Someone said: {0}'.format(msg),
               endpoint=self.ns_name)

    for sessid, socket in self.socket.server.sockets.iteritems():
      socket.send_packet(pkt)