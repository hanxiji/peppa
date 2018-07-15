from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import loader
from .models import *
from django.db.models import F,Q
#导入Paginator,EmptyPage和PageNotAnInteger模块
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.views.generic.base import View
from .forms import *
from django.core.mail import send_mail
import random
from peppa.settings import EMAIL_FROM
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings
import os

from django.shortcuts import Http404, HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.template import RequestContext, Template

from django.contrib import messages
from django.template import loader
import tkinter
import os
import tkinter.messagebox
import json


# 张宸豪
# bookviewer
def book_views(request,id):
    # BID=request.POST.get('bookID')
    BID=id
    booke=Book.objects.filter(id=BID)
    book=booke[0]
    booktype=book.bookType.all()

    uid = request.session.get('uid')
    user1 = {}
    if uid == None:
        user1['login'] = False
    else:
        user1['login'] = True
        user1['uname'] = User.objects.get(id=uid).userName

    user1 = json.dumps(user1)

    for bt in booktype:
        bookcommende=bt.book_set.all()
    relatelist=[]
    counter=0
    for bc in bookcommende:
        if counter == 6:
            break
        relatelist.append(Book.objects.get(id=bc.id))
        counter+=1
    oplist=Opinion.objects.filter(book_id=book.id)
    orderlist=[]
    if oplist.exists():
        for op in oplist:
            orderlist.append(Purchase.objects.get(id=op.purchase_id))
        user=[]
        for od in orderlist:
            user.append(User.objects.get(id=od.user_id))
    else:
        oplist=[]
        orderlist=[]
        user=[]
    if booke.exists():
        bookcommend=bookcommende[0]
        bookTy=booktype[0]
        price=round(float(book.bookPrice)*0.1*float(book.discount),2)
        return render(request,'web.html',locals())
    else:
        return HttpResponse("error")

def get_pages(totalpage=1,current_page=1):
    """
    example: get_pages(10,1) result=[1,2,3,4,5]
    example: get_pages(10,9) result=[6,7,8,9,10]
    页码个数由WEB_DISPLAY_PAGE设定
    """
    WEB_DISPLAY_PAGE = 5
    front_offset = int(WEB_DISPLAY_PAGE / 2)
    if WEB_DISPLAY_PAGE % 2 == 1:
        behind_offset=front_offset
    else:
        behind_offset=front_offset -1

    if totalpage < WEB_DISPLAY_PAGE:
        return list(range(1,totalpage+1))
    elif current_page<=front_offset:
        return list(range(1,WEB_DISPLAY_PAGE+1))
    elif current_page>=totalpage-behind_offset:
        start_page=totalpage-WEB_DISPLAY_PAGE+1
        return list(range(start_page,totalpage+1))
    else:
        start_page=current_page-front_offset
        end_page=current_page+behind_offset
        return list(range(start_page,end_page+1))

def findpage_views(request):
    old = []
    new = []
    key=""

    uid = request.session.get('uid')
    user = {}
    if uid == None:
        user['login'] = False
    else:
        user['login'] = True
        user['uname'] = User.objects.get(id=uid).userName

    user = json.dumps(user)

    if request.method == "GET":
        key = request.GET.get("key")
        if key == "":
            return render(request,'error.html',locals())
        else:
            old += Book.objects.filter(bookName__contains=key)
            old += Book.objects.filter(author__contains=key)
            old += Book.objects.filter(publisher__contains=key)
            for i in old:
                if i not in new:
                    new.append(i)
    booklist=[]
    if len(new):
        for name in new:
            booke = Book.objects.filter(bookName=name)
            pricee = float(booke[0].bookPrice)*0.1*float(booke[0].discount)
            price = round(pricee, 2)
            booklist.append({'PRICE': price, 'BOOK': booke[0]})
        paginator = Paginator(booklist,10) # Show 10 book per page
        page = request.GET.get('page',1)
        try:
            books = paginator.page(page)
            total_page_number=paginator.num_pages
            page_list=get_pages(int(total_page_number),int(page))
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            books = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            books = paginator.page(paginator.num_pages)
        return render(request,'findPage.html',locals())
    else:
        return render(request,'error.html',locals())


#孙昊
#indexviewer
def top(num):
    top = []
    for i in range(num+1, num+11):
        booke = Book.objects.filter(id = i)

        if booke.exists():
            book = booke[0]
            top.append({'NO': i-num, 'BOOK': book})
            if book.discount != None:
                book.discount = round(float(book.bookPrice) *0.1 * float(book.discount), 2)
            else:
                book.discount = round(float(book.bookPrice), 2)
    return top

def bottom(num1, num2):
    bottom = []
    for i in range(1, 5):
        booke = Book.objects.filter(id = random.randint(num1, num2))

        if booke.exists():
            book = booke[0]
            bottom.append(book)
            if book.discount != None:
                book.discount = round(float(book.bookPrice) *0.1 * float(book.discount), 2)
            else:
                book.discount = round(float(book.bookPrice), 2)
    return bottom

def index_views(request):
    booktype1 = ["青春文学", "小说", "休闲_爱好", "文学", "孕产_胎教"]
    booktype2 = ["艺术", "动漫_幽默", "烹饪_美食", "时尚_美妆"]
    num1 =[]
    num2 =[]
    t1 = 0
    t2 = 0

    uid = request.session.get('uid')
    user = {}
    if uid == None:
        user['login'] = False
    else:
        user['login'] = True
        user['uname'] = User.objects.get(id=uid).userName

    user = json.dumps(user)

    for i in range(5):
        t1 += BookType.objects.get(typeName = booktype1[i]).book_set.count()
        num1.append(t1)

    for i in range(4):
        t2 += BookType.objects.get(typeName = booktype2[i]).book_set.count()
        num2.append(t2)

    top1 = top(0)
    top2 = top(num1[0])
    top3 = top(num1[1])
    top4 = top(num1[2])
    top5 = top(num1[3])

    bottom1 = bottom(1, num2[0])
    bottom2 = bottom(num2[0], num2[1])
    bottom3 = bottom(num2[1], num2[2])
    bottom4 = bottom(num2[2], num2[3])


    return render(request, 'peppa.html', locals())

def find_views(request, title):
    uid = request.session.get('uid')
    user = {}
    if uid == None:
        user['login'] = False
    else:
        user['login'] = True
        user['uname'] = User.objects.get(id=uid).userName

    user = json.dumps(user)
    booklist = []
    bookl = BookType.objects.get(typeName = title).book_set.all()
    for i in bookl:
        pricee = float(i.bookPrice)*0.1*float(i.discount)
        price = round(pricee, 2)
        booklist.append({'PRICE': price, 'BOOK': i})
    paginator = Paginator(booklist,10) # Show 10 book per page
    page = request.GET.get('page',1)
    try:
        books = paginator.page(page)
        total_page_number=paginator.num_pages
        page_list=get_pages(int(total_page_number),int(page))
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        books = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        books = paginator.page(paginator.num_pages)
    return render(request ,'findPage.html', locals())
    
# 廖万林
# Create your views here.
#首页显示
def peppa_views(request):
    return render(request,'peppa.html')
# 登录函数
def login_views(request):
    if request.method=='GET':
        # if request.session.get('userPassword'):           
        #     form = LoginForm()
        #     form.userPassword=request.session.get('userPassword')
        #     # print(request.session.get('userPassword'))
        #     return render(request,'login2.html',locals())
        # else:
        form = LoginForm()
        return render(request,'login.html',locals())
    else:
        form = LoginForm(request.POST)
        if form.is_valid():
            uphone = request.POST.get('userMobile')
            upwd = request.POST.get('userPassword')
            user = User.objects.filter(userMobile=uphone)
            if uphone=='' or upwd=='':
                error_msg = '手机号或者密码不能为空'
                return render(request,'login.html',locals())
            if user:
                if check_password(upwd,user[0].userPassword):
                # if upwd==user[0].userPassword:
                    request.session['userMobile']=user[0].userMobile
                    request.session.set_expiry(60*60*24*7)
                    request.session['uid']=user[0].id
                    request.session.set_expiry(60*60*24*7)
                    # if request.POST.getlist('isSaved'):
                    #     request.session['userPassword']=user[0].userPassword
                    #     request.session.set_expiry(60*60*24*30)
                    return HttpResponseRedirect('/index/')
                else:
                    error_msg = '密码和手机号不匹配'
                    form = LoginForm()
                    return render(request,'login.html',{'error_msg':error_msg,'form':form})
            else:
                error_msg = '用户不存在'
                form = LoginForm()
                return render(request,'login.html',{'error_msg':error_msg,'form':form})
        else:
            error_msg = '验证码错误'
            form = LoginForm()
            return render(request,'login.html',{'error_msg':error_msg,'form':form})

#登录装饰器
def my_login_required(func):
    '''自定义 登录验证 装饰器'''
    def check_login_status(request):
        '''检查登录状态'''
        if request.session.get('uid'):
            # 当前有用户登录，正常跳转
            return func(request)
        else:
            # 当前没有用户登录，跳转到登录页面
            return HttpResponseRedirect('/login/')
    return check_login_status

#登录装饰器带参数
def my_login_required2(func):
    '''自定义 登录验证 装饰器'''
    def check_login_status(request,x):
        '''检查登录状态'''
        if request.session.get('userMobile'):
            # 当前有用户登录，正常跳转
            return func(request,x)
        else:
            # 当前没有用户登录，跳转到登录页面
            return HttpResponseRedirect('/login/')
    return check_login_status


#测试装饰器
@my_login_required
def testDecorator(request):
    return HttpResponse('ok')

# 注册函数
def register_views(request):
    if request.method=='GET':
        form = RegisterForm()
        return render(request,'register.html',locals())
    else:
        form = RegisterForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            userList = User.objects.all()
            nouser = True
            for u in userList:
                if u.userMobile==cd['userMobile'] or u.userEmail==cd['userEmail']:
                    nouser = False
            if nouser:
                if cd['userPassword']==cd['checkpwd']:
                    user = User(userName=cd['userName'],
                    userPassword=make_password(cd['userPassword']),
                    # userPassword=cd['userPassword'],
                    userMobile=cd['userMobile'],
                    userEmail=cd['userEmail'],)
                    user.save()
                    return HttpResponseRedirect('/login/')
                else:
                    error_msg = '两次密码输出不一致'
                    return render(request,'register.html',locals())
            else:
                error_msg = '该手机号或邮箱已注册过，请重新注册'
                return render(request,'register.html',locals())
        else:
            return render(request,'register.html',locals())

# 注销用户
@my_login_required
def loginout_views(request):
    try:
        del request.session['userMobile']
        del request.session['uid']
    except KeyError:
        pass
    return HttpResponseRedirect('/index/')

#发送邮件
def sendEmail(request):
    if request.method=='GET':
        form = ForgetPwdForm()
        return render(request, "sendemail.html", locals())
    else:
        form = ForgetPwdForm(request.POST)
        if form.is_valid():
            email = request.POST.get('userEmail')
            if User.objects.filter(userEmail=email):
                for i in User.objects.filter(userEmail=email):
                    email = i.userEmail
                    if i.userMobile==request.POST.get('userMobile'):
                        nametemp = i.userName
                        request.session['userphone']=i.userMobile
                        request.session.set_expiry(60*3)
                        num = str(random.randint(1000,9999))
                        request.session['num']=num
                        request.session.set_expiry(60*10)
                        email_title = 'peppa书屋修改密码'
                        email_body = nametemp+','+'您的验证码是'+num
                        send_status = send_mail(email_title,email_body,EMAIL_FROM,[email],fail_silently=False)
                        if send_status:
                            return HttpResponseRedirect('/checkcode/')
                        else:
                            error_msg='发送失败，请重新发送'
                            return render(request,'sendemail.html',locals())
                    else:
                        error_msg='手机号和邮箱不匹配，请重新填写'
                        return render(request,'sendemail.html',locals())
            else:
                error_msg='邮箱不存在，请重新填写'
                return render(request,'sendemail.html',locals())
        else:
            return render(request,'sendemail.html',locals())

# 确认验证码
def checkcode_views(request):
    if request.session.get('num'):
        if request.method=='GET':
            form = CheckForm()
            user=User.objects.get(userMobile=request.session['userphone'])
            return render(request,'checkcode.html',locals())
        else:
            form = CheckForm(request.POST)
            if form.is_valid():
                code = request.POST.get('code')
                request.session['code']=code
                request.session.set_expiry(60)
                print(request.session.get('num'))
                if request.session.get('num')==code:
                    print('**********************************')
                    return HttpResponseRedirect('/resetpwd/')
                else:
                    error_msg='邮箱随机验证码不正确，请重新输入'
                    user=User.objects.get(userMobile=request.session['userphone'])
                    return render(request,'checkcode.html',locals())
            else:
                error_msg='验证不正确，请重新输入'
                user=User.objects.get(userMobile=request.session['userphone'])
                return render(request,'checkcode.html',locals())
    else:
        return HttpResponseRedirect('/sendemail/')

# 重置密码
def resetpwd_views(request):
    if request.session.get('code') and request.session.get('code')==request.session.get('num'):
        if request.method=='GET':
            form = ResetPwdForm()
            return render(request,'resetpwd.html',locals())
        else:
            form = ResetPwdForm(request.POST)
            if form.is_valid():
                newpwd = form.cleaned_data
                if newpwd['newPassword']==newpwd['checkPassword']:
                    # print(newpwd['newPassword'])
                    # print(request.session.get('userphone'))
                    User.objects.filter(userMobile=request.session.get('userphone')).update(userPassword=make_password(newpwd['newPassword']))
                    return HttpResponseRedirect('/login/')
                else:
                    error_msg='密码不一致，请重新输入'
                    return render(request,'resetpwd.html',locals())
    else:
        return HttpResponseRedirect('/sendemail/')

#退款申请
@my_login_required2
def refund_views(request,id):
    order = Purchase.objects.get(id=id)
    if request.method=='GET':
        if Reject.objects.filter(purchase=order):
            return HttpResponseRedirect('/order/all')
        else:
            if order.orderState=='已完成':
                request.session['purchase_id']=order.id
                request.session.set_expiry(60*60*24*365)
                bookList = order.booklist_set.all()
                # print(bookList[1].bookAmount)
                # print('*****************************')
                return render(request,'refund.html',locals())
            else:
                return HttpResponseRedirect('/order/all')
    else:
        if Reject.objects.filter(purchase=order):
            return HttpResponseRedirect('/order/all')
        else:
            reason = request.POST.get('reason')
            check_box_list = request.POST.getlist('book')
            # print(request.FILES)
            img = Img(img_url=request.FILES.get('picture'))
            img.save()
            # print(img.name)
            # 下载图片到项目的static文件夹里
            # path = os.path.join('refund',img.name)
            # path = '%s\\refund\\%s'%(settings.MEDIA_ROOT,img.name)
            # with open(path,'wb') as pic:
            #     for p in img.chunks():
            #         pic.write(p)
            # print(path) 
            #保存数据记录到数据库里
            reject = Reject(purchase=order,
            rejectAmount=0,
            rejectReason = request.POST.get('reason'),
            rejectState = '退货中',
            img=img)
            reject.save()
            count = 0;
            for check in check_box_list:
                recode = BookList.objects.get(id=check)
                # print('=========',recode)
                recode.bookRefund=request.POST.get(check)
                # print('=========',recode.bookRefund)
                recode.reject=reject
                count += int(recode.bookRefund)*float(recode.bookPrice)
                recode.save()
            reject.rejectAmount=count
            reject.save()
            # order.orderState='已取消'
            # order.save()
            return HttpResponseRedirect('/showrefund/%d'%reject.id)

#罗列退货单
@my_login_required
def listrefund_views(request):
    user = User.objects.get(userMobile=request.session.get('userMobile'))
    rejectAllList = Reject.objects.all()
    rejectList=[]
    print(rejectAllList)
    for reject in rejectAllList:
        if reject.purchase.user==user:
            rejectList.append(reject)
    return render(request,'change.html',locals())

#显示退货单详情
@my_login_required2
def showrefund_views(request,id):
    if request.method=='GET':
        reject = Reject.objects.get(id=id)
        bookList = reject.booklist_set.all()
        img = reject.img
        return render(request,'showrefund.html',locals())
    else:
        pass

