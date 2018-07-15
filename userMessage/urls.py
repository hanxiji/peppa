from django.conf.urls import url
from .views import *

urlpatterns = [
    #添加session
    url(r'^userMessage/$', userMessage_views),
    url(r'^userPassword/$', userPassword_views),
    url(r'^userAddress/$', userAddress_views),

    url(r'^userAddressDelete/(\d+)/$', userAddressDelete_views),
    url(r'^userAddressUpdate/(\d+)/$', userAddressUpdate_views),
    url(r'^userAddressAdd/$', userAddressAdd_views),

#提示信息
    url(r'^aboutUs/$', aboutUs_views),
    url(r'^packageSuggest/$', packageSuggest_views),
    url(r'^img/$', img_views),
    url(r'^balance/$', balance_views),
    url(r'^suggest/$', suggest_views),
]