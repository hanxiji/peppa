from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from django.template import loader
from index.models import *
from django.contrib.auth.hashers import make_password, check_password

# Create your views here.

# #添加 session 用于测试
# def session_views(request):
#     # del request.session['uid']
#     # return HttpResponse('sdf')

#     request.session['uid'] = '1'
#     request.session.set_expiry(60*30*60)
#     return HttpResponse('保存session OK')


def auth(func):
    #判断用户是否登录
    def inner(request, *args, **kwargs):
        userId = request.session.get('uid')
        if not userId:
            return HttpResponseRedirect('/login/')
        return func(request, *args, **kwargs)
    return inner

# @auth
# #用户中心页面
# def userMessage_views(request):
#     userId = request.session.get('uid')
#     user = User.objects.get(id = userId)

#     bookList = Book.objects.filter(author = '东野圭吾')

#     if request.method == 'GET':
#         return render(request, 'userMessage.html', locals())
#     else:
#         if request.FILES.get('inputImg'): 
#             user.userImage = request.FILES.get('inputImg')   
#         user.userMobile = request.POST.get('userMobile')
#         user.balance = request.POST.get('balance')
#         user.save()
#         return HttpResponseRedirect('/userMessage/')

@auth
#用户密码问题
def userPassword_views(request):
    userId = request.session.get('uid')
    user = User.objects.get(id = userId)

    bookList1 = Book.objects.filter(author = '东野圭吾')
    bookList = []
    for i in range(0, 2):
        bookList.append(bookList1[i])

    if request.method == 'GET':
        return render(request, 'userPassword.html', locals())
    else:
        if check_password(request.POST.get('oldPassword'), user.userPassword):
            user.userPassword = make_password(request.POST.get('newPassword'))
            user.save() 
            return HttpResponseRedirect('/userMessage/')
        else:
            errorMessage = '旧密码输入错误'
            return render(request, 'userPassword.html', locals())
@auth
#用户中心页面
def userMessage_views(request):
    userId = request.session.get('uid')
    user = User.objects.get(id = userId)

    bookList1 = Book.objects.filter(author = '东野圭吾')
    bookList = []
    for i in range(0, 2):
        bookList.append(bookList1[i])

    if request.method == 'GET':
        return render(request, 'userMessage.html', locals())
    else:
        if request.FILES.get('inputImg'): 
            user.userImage = request.FILES.get('inputImg')   
        user.userMobile = request.POST.get('userMobile')
        user.balance = request.POST.get('balance')
        user.save()
        return HttpResponseRedirect('/userMessage/')        

@auth
#用户地址问题
def userAddress_views(request):
    userId = request.session.get('uid')
    user = User.objects.get(id = userId)
    addressList = Address.objects.filter(user = user)

    bookList1 = Book.objects.filter(author = '东野圭吾')
    bookList = []
    for i in range(0, 2):
        bookList.append(bookList1[i])

    if request.method == 'GET':
        return render(request, 'userAddress.html', locals())

@auth
def userAddressDelete_views(request, delete_id):

    address = Address.objects.get(id = delete_id)
    address.delete()
   
    bookList1 = Book.objects.filter(author = '东野圭吾')
    bookList = []
    for i in range(0, 2):
        bookList.append(bookList1[i])

    return HttpResponseRedirect('/userAddress/')  

#修改地址
@auth
def userAddressUpdate_views(request, update_id):  
    updateAddress = Address.objects.get(id = update_id)

    bookList1 = Book.objects.filter(author = '东野圭吾')
    bookList = []
    for i in range(0, 2):
        bookList.append(bookList1[i])

    if request.method == 'GET':
        return render(request, 'userAddressUpdate.html', locals())

    else:
        address = request.POST.get('address').split('-')
        updateAddress.province = address[0]
        updateAddress.city = address[1]
        updateAddress.region = address[2]

        updateAddress.detail = request.POST.get('addressDetail')

        updateAddress.recieverName = request.POST.get('recieverName')
        updateAddress.recieverMobile = request.POST.get('recieverMobile')
        updateAddress.save()
        return HttpResponseRedirect('/userAddress/')        

#添加地址
@auth
def userAddressAdd_views(request):

    user = User.objects.get(id = request.session.get('uid'))

    bookList1 = Book.objects.filter(author = '郭敬明')
    bookList = []
    for i in range(0, 2):
        bookList.append(bookList1[i])

    addressList = Address.objects.filter(user = user)

    if request.method == 'GET':
        return render(request, 'userAddressAdd.html')
    else:
        for address in addressList:
            address.isDefault = False
            address.save()

        recieverMobile = request.POST.get('recieverMobile')
        address = request.POST.get('address').split('-')
        detail = request.POST.get('addressDetail')
        recieverName = request.POST.get('recieverName')
        address = {
            'user':user,
            'recieverMobile':recieverMobile,
            'province':address[0],
            'city':address[1],
            'region':address[2],
            'detail':detail,
            'recieverName':recieverName,
            'isDefault':True,
        }
        addressAdd = Address(**address)
        # print("abc")
        addressAdd.save()
        return HttpResponseRedirect('/userAddress/')

#脱发工作室简介
def aboutUs_views(request):
    return render(request, 'aboutUs.html')

#快递推荐
def packageSuggest_views(request):
    return render(request, 'packageSuggest.html')

def img_views(request):
    return render(request, 'imgChange.html')

def balance_views(request):
    user = User.objects.get(id = request.session.get('uid'))
    bookList1 = Book.objects.filter(author = '东野圭吾')
    bookList = []
    for i in range(0, 2):
        bookList.append(bookList1[i])
    balance = user.balance

    return render(request, 'balance.html', locals())
 
def suggest_views(request):
    return render(request, 'suggest.html')

