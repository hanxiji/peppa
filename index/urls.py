from django.conf.urls import url,include
from .views import *

from django.views.static import serve
from django.conf import settings
from django.conf.urls.static import static


# 张宸豪
urlpatterns = [
    # url(r'^book/$', book_views),
    url(r'^book/(\d+)$', book_views),
    url(r'findpage/$',findpage_views),
]

#廖万林
urlpatterns += [
    url(r'^login/$',login_views),
    url(r'^register/$',register_views),
    # url(r'^peppa/$',peppa_views),
    url(r'^captcha/',include('captcha.urls')),
    url(r'^testDecorator/$',testDecorator),
    url(r'^loginout/$',loginout_views),
]

urlpatterns +=[
    url(r'^refund/(\d+)$',refund_views,name='refund'),
    url(r'^listrefund/$',listrefund_views),
    url(r'showrefund/(\d+)$',showrefund_views,name='showrefund'),
    # url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
] 
# + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns +=[
     url(r'^sendemail/$',sendEmail,name='sendemail'),
     url(r'^checkcode/$',checkcode_views),
     url(r'^resetpwd/$',resetpwd_views),
]
# 孙昊
urlpatterns += [
    url(r'^index/$', index_views),
    url(r'^find/(?P<title>.+)/$', find_views),
]
