from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^customercareuser/$', customercareuser_views),
    url(r'^user_post/$', user_post),
    url(r'^customercareusermessage/$', customercareusermessage_views),
    url(r'^customercareuserindex/$', customercareuserindex_views),
    url(r'^customercareuserexit/$', customercareuserexit_views),
    url(r'^customercarelogin/$', customercarelogin_views),
    url(r'^customercare/$', customercare_views),
    url(r'^customercareexit/$', customercareexit_views),
    url(r'^customercare_post/$', customercare_post),
]