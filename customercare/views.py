from django.shortcuts import render, Http404, HttpResponseRedirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from datetime import datetime
from index.models import *


# Create your views here.

# 判断用户是否登录
def user_auth(func):   
    def inner(request, *args, **kwargs):
        userId = request.session.get('uid')
        if not userId:
            return HttpResponseRedirect('/login/')
        return func(request, *args, **kwargs)
    return inner

# 判断客服是否登录
def cc_auth(func):    
    def inner(request, *args, **kwargs):
        if 'cid' not in request.COOKIES:
            return HttpResponseRedirect('/customercarelogin/')
        return func(request, *args, **kwargs)
    return inner

@user_auth
# 用户进入的客服界面
def customercareuser_views(request):
    userId = request.session.get('uid')
    user = User.objects.get(id = userId)
    customercares = CustomerCare.objects.all()
    for customercare in customercares: 
        if customercare.chatUser == user:
            chats = list(Chat.objects.filter(Q(userSender = user),Q(ccSender = customercare)))[-50:]
            return render(request, 'CustomerCare_User.html', locals())
        if customercare.isLogin == True and customercare.isChat == False: 
            customercare.isChat = True
            customercare.chatUser = user
            customercare.save()                    
            chats = list(Chat.objects.filter(Q(userSender = user),Q(ccSender = customercare)))[-50:]
            return render(request, 'CustomerCare_User.html', locals())
    return render(request, 'NoChat.html')

# 同步用户聊天消息到数据库
@csrf_exempt
def user_post(request):    
    if request.method == 'POST':
        post_type = request.POST.get('post_type')
        if post_type == 'send_chat':
            new_chat = Chat.objects.create(           
                userSender = User.objects.get(id = request.POST.get('userId')),
                ccSender = CustomerCare.objects.get(id = request.POST.get('customercareId')),
                content = request.POST.get('content'),
                emoji = request.POST.get('emoji'),
                identity = "user"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            )
            new_chat.save()
            return HttpResponse()
        elif post_type == 'get_chat':
            last_chat_id = int(request.POST.get('last_chat_id'))
            chats = Chat.objects.filter(id__gt = last_chat_id)
            user = User.objects.get(id = request.POST.get('userId'))
            customercare = user.customercare
            return render(request, 'chat_list_user.html', locals())
    else:
        raise Http404

# 用户回个人中心
def customercareusermessage_views(request):
    userId = request.session.get('uid')
    user = User.objects.get(id = userId)
    customercare = user.customercare
    customercare.isChat = False
    customercare.chatUser = None
    customercare.save()
    return HttpResponseRedirect('/userMessage/')

# 用户回首页
def customercareuserindex_views(request):
    userId = request.session.get('uid')
    user = User.objects.get(id = userId)
    customercare = user.customercare
    customercare.isChat = False
    customercare.chatUser = None
    customercare.save()
    return HttpResponseRedirect('/index/')

# 用户退出
def customercareuserexit_views(request):
    userId = request.session.get('uid')
    user = User.objects.get(id = userId)
    customercare = user.customercare
    customercare.isChat = False
    customercare.chatUser = None
    customercare.save()
    return HttpResponseRedirect('/loginout/')

# 客服登录
def customercarelogin_views(request):
    if request.method == 'GET':
        return render(request, 'CustomerCareLogin.html')
    else:
        ccname = request.POST.get('ccname')
        ccpwd = request.POST.get('ccpwd')
        if CustomerCare.objects.filter(ccName = ccname).count() == 0:
            message = '客服不存在'
        elif ccpwd != CustomerCare.objects.get(ccName = ccname).password:
            message = '密码错误'
        else:
            customercare = CustomerCare.objects.get(ccName = ccname)
            customercare.isLogin = True
            customercare.save()
            response = HttpResponseRedirect('/customercare/')
            response.set_cookie('cid', customercare.id, 60*60*24)
            return response
        return render(request, 'CustomerCareLogin.html', locals())

# 客服回复界面
@cc_auth
def customercare_views(request):
    ccId = request.COOKIES['cid']    
    customercare = CustomerCare.objects.get(id = ccId)
    if customercare.chatUser != None:
        user = customercare.chatUser
        chats = list(Chat.objects.filter(Q(userSender = user),Q(ccSender = customercare)))[-50:]
        return render(request, 'CustomerCare_cc.html', locals())
    else:
        return render(request, 'CustomerCare_cc.html',locals())

# 同步客服聊天消息到数据库
@csrf_exempt
def customercare_post(request):
    if request.method == 'POST':
        post_type = request.POST.get('post_type')
        if post_type == 'send_chat':
            new_chat = Chat.objects.create(            
                userSender = User.objects.get(id = request.POST.get('userId')),
                ccSender = CustomerCare.objects.get(id = request.POST.get('customercareId')),
                content = request.POST.get('content'),
                emoji = request.POST.get('emoji'),
                identity = "cc"
            )
            new_chat.save()
            return HttpResponse()
        elif post_type == 'get_chat':
            customercare = CustomerCare.objects.get(id = request.POST.get('customercareId'))
            if customercare.chatUser != None:
                last_chat_id = int(request.POST.get('last_chat_id'))
                chats = Chat.objects.filter(id__gt = last_chat_id)
                user = customercare.chatUser
                return render(request, 'chat_list_cc.html', locals())
    else:
        raise Http404

# 退出客服帐号
@csrf_exempt
def customercareexit_views(request):
    ccId = request.COOKIES['cid']
    customercare = CustomerCare.objects.get(id = ccId)
    customercare.isLogin = False
    customercare.save()
    response = HttpResponseRedirect('/customercarelogin/')
    response.delete_cookie('cid')
    return response

