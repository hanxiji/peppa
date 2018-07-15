from django.conf.urls import url, include
from .views import *

urlpatterns = [
    url(r'^order/all', all_purchase),
    url(r'^order/unpaid', unpaid_purchase),
    url(r'^order/unsent', unsent_purchase),
    url(r'^order/unrecieved', unrecieved_purchase),
    url(r'^order/unjudged', unjudged_purchase),
    url(r'^order/done', done_purchase),
    url(r'^order/canceled', canceled_purchase),
    url(r'^opinion/', show_opinions),
    url(r'^add_opinion/(.+)/$', add_opinion),
    url(r'^post/', post),
]