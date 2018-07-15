from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from .views import *

urlpatterns = [
    # url(r'^index/$',index_views,name='index'),
    url(r'^cart/$',show_cart_views),
    url(r'^cart/add/(\d+)/(\d+)$',add_cart_views),
    url(r'^cart/update/$',update_cart_book),
    url(r'^cart/delete/$',delete_cart_book),
    url(r'^cart/settlement/$',settlement_views),
    url(r'^cart/totalmoney/$',totalmoney_views),
]

urlpatterns += [
    url(r'^pay/(\d+)$',pay_views),
    url(r'^pay/result/$',pay_result_views),
    url(r'^pay/success/(\d+)$',pay_success_views),
    url(r'^add/address/(\d+)$',add_address_views),
    url(r'^update/address/(\d+)/(\d+)/(\d+)$',update_address_views),
]