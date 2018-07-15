from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F,Q
from django.core.exceptions import ObjectDoesNotExist
from datetime import date
import json
from index.models import *
from django.contrib.auth.hashers import make_password, check_password
# Create your views here.

# 登陆验证
def auth(func):
    '''判断是否登录装饰器'''
    def inner(request,*args,**kwargs):
        uid = request.session.get("uid")
        '''如果没有登陆返回到login.html'''
        if not uid:
            return HttpResponseRedirect("/login/")
        return func(request,*args,**kwargs)
    return inner

# def index_views(request):
#     request.session['uid'] = 1
#     request.session.set_expiry(60*30)
#     return HttpResponse("首页")

#name:添加购物车
#describe:用户点击添加购物车后跳转到购物车页面。
#
@auth
def add_cart_views(request,bookid,bookcount):
    UID = request.session.get('uid')
    bookID = bookid
    bookCount = bookcount
    dict = {
        'book_id':bookID,
        'user_id':UID,
    }
    cartAdd = Cart.objects.filter(**dict)
    if cartAdd:
        cartAdd.update(amount = F('amount')+bookCount)
    else:
        dic = {
        'user_id':UID,
        'book_id':bookID,
        'amount':bookCount,
        }
        obj = Cart(**dic)
        obj.save()
    return HttpResponseRedirect("/cart/")

@auth
def show_cart_views(request):
    UID = request.session.get('uid')
    userName = User.objects.get(id=UID).userName
    cartList = Cart.objects.filter(user=UID)
    bookList = []
    n = int(1)
    for i in cartList:
        dict = {}
        dict['dID'] = n
        dict['cartID'] = i.id
        dict['userID'] = i.user_id
        dict['bookID'] = i.book_id
        dict['amount'] = int(i.amount)
        book = Book.objects.get(id=i.book_id)
        dict['bookName'] = book.bookName
        dict['bookImg'] = str(book.bookPhoto)
        dict['bookPrice'] = round(float(book.bookPrice)*float(book.discount)/10,2)
        dict['price'] = round(float(book.bookPrice*i.amount)*float(book.discount)/10,2)
        bookList.append(dict)
        n += 1
    send = {
        'request':request,
        'userName':userName,
        'bookList':bookList,
        'bookJson':json.dumps(bookList),
        'cartAmount':cartList.count(),
    }
    return render(request,'cart.html',send)

#@csrf_exempt
@auth
def update_cart_book(request):
    UID = request.session.get('uid')
    if request.method == 'POST':
        bookID = request.POST.get('bookid')
        bookCount = request.POST.get('bookcount')
        try:
            cartUpdate = Cart.objects.get(book_id=bookID,user_id=UID)
            book = Book.objects.get(id=bookID)
            cartUpdate.amount = bookCount
            cartUpdate.save()
            book = Book.objects.get(id=bookID)
            amountUpdate = {
                'bookid':bookID,
                'bookcount':int(cartUpdate.amount),
                'price':round(float(book.bookPrice)*float(cartUpdate.amount)*float(book.discount)/10,2),
            }
            return HttpResponse(json.dumps(amountUpdate), content_type="application/json")
        except ObjectDoesNotExist as e:
            amountUpdate = {'notexist':True}
            return HttpResponse(json.dumps(amountUpdate), content_type="application/json")
    else:
        return HttpResponse("None")

@auth
def delete_cart_book(request):
    UID = request.session.get('uid')
    if request.method == 'POST':
        bookID = request.POST.get('bookid')
        print('bookid',bookID)
        dict = {
            'book_id':bookID,
            'user_id':UID,
        }
        try:
            cartDelete = Cart.objects.get(**dict)
        except Exception as e:
            remove = {
                'remove':False,
            }
            return HttpResponse(json.dumps(remove), content_type="application/json")
        else:
            cartDelete.delete()
            remove = {
                'bookid':cartDelete.book_id,
                'remove':True,
            }
            return HttpResponse(json.dumps(remove), content_type="application/json")
    else:
        return HttpResponse("None")

@auth
def totalmoney_views(request):
    UID = request.session.get('uid')
    if request.method == 'POST':
        bookidList = request.POST.getlist('bookid[]')
        total = []
        totalMoney = 0
        totalAmount = 0
        try:
            for bookid in bookidList:
                dic = {}
                cart = Cart.objects.get(book_id = bookid,user_id = UID)
                book = Book.objects.get(id=bookid)
                dic['bookid'] = bookid
                dic['bookamount'] = int(cart.amount)
                dic['bookPrice'] = float(book.bookPrice)
                dic['total'] = round(float(book.bookPrice)*float(cart.amount)*float(book.discount)/10,2)
                #print(dic)
                totalMoney += dic['total']
                totalAmount += dic['bookamount']
                total.append(dic)
            totalMoney = round(totalMoney,2)
        except ObjectDoesNotExist as e:
            total = {'notexist':True}
        return HttpResponse(json.dumps({'total':total,'totalmoney':totalMoney,'totalamount':totalAmount}), content_type="application/json")
    else:
        return HttpResponse("None")

def settlement_views(request):
    UID = request.session.get('uid')
    if request.method == 'POST':
        bookidList = request.POST.getlist('bookid[]')
        buyList = Cart.objects.filter(user_id=UID,book_id__in=bookidList)
        bookList = Book.objects.filter(id__in=bookidList)
        orderAmount = 0
        purBookList = []
        settlement = {
            'status':True,
            'stock':True,
        }
        for buy in buyList:
            for book in bookList:
                if book.id==buy.book_id:
                    if book.bookStock<buy.amount:
                        settlement['stock'] = False
                        return HttpResponse(json.dumps(settlement))
                    dic = {
                        'book_id':buy.book_id,
                        'bookPrice':round(float(book.bookPrice)*float(book.discount)/10,2),
                        'bookAmount':buy.amount,
                    }
                    purBookList.append(dic)
                    orderAmount += round(float(book.bookPrice)*float(buy.amount)*float(book.discount)/10,2)

        purchase = Purchase(user_id=UID,orderTime=date.today(),orderState='待付款',orderAmount=orderAmount)
        purchase.save()
        for book in purBookList:
            book['purchase_id'] = purchase.id
            bl = BookList(**book)
            bl.save()
        buyList.delete()
        settlement['purchase_id'] = purchase.id
        return HttpResponse(json.dumps(settlement))
    else:
        return HttpResponse("None")

@auth
def pay_views(request,purchaseid):
    UID = request.session.get('uid')
    address = Address.objects.filter(user_id=UID,isDefault=False)
    defaultAddress = Address.objects.filter(user_id=UID,isDefault=True)
    purchaseID = purchaseid
    if defaultAddress:
        defaultAddress = defaultAddress[0]
    cartAmount = Cart.objects.filter(user_id=UID).count()
    purchase = Purchase.objects.filter(id=purchaseid)[0]
    if purchase.orderState != '待付款':
        return HttpResponseRedirect('/cart/')
    purBookList = BookList.objects.filter(purchase_id=purchase)
    bookList = pay_get_bookList(purchaseid,UID)
    total = 0
    for b in bookList:
        total += b['totalMoney']
    total = round(total,2)
    return render(request,'pay.html',locals())

def pay_get_bookList(purchaseid,UID):
    purchase = Purchase.objects.filter(id=purchaseid,user_id=UID)[0]
    purBookList = BookList.objects.filter(purchase_id=purchase)
    bookList = []
    for b in purBookList:
        dic = {}
        book = Book.objects.get(id=b.book_id)
        dic['bookName'] = book.bookName
        dic['bookPhoto'] = book.bookPhoto
        dic['bookPrice'] = b.bookPrice
        dic['bookAmount'] = b.bookAmount
        dic['totalMoney'] = round(float(b.bookPrice*b.bookAmount),2)
        bookList.append(dic)
    return bookList

@auth
def add_address_views(request,purchaseID):
    UID = request.session.get('uid')
    if request.method == 'POST':
        msg = {
            'status':True,
            'purchaseid':purchaseID,
        }
        addressForm = request.POST.dict()
        if addressForm['userPhone']=='' or addressForm['userName']=='':
            msg['status'] = False
            return HttpResponseRedirect("/pay/"+str(purchaseID))
        address = {
            'user_id':UID,
            'recieverMobile':addressForm['userPhone'],
            'province':addressForm['provinceSelect'],
            'city':addressForm['citysSelect'],
            'region':addressForm['countrySelect'],
            'detail':addressForm['userIntro'],
            'recieverName':addressForm['userName'],
            'isDefault':True,
        }
        Address.objects.filter(user_id=UID).update(isDefault=False)
        obj = Address(**address)
        obj.save()
        return HttpResponseRedirect("/pay/"+str(purchaseID))
    else:
        return HttpResponse("None")

@auth
def update_address_views(request,purchaseID,addressID,flag):
    if flag=='0':
        Address.objects.filter(isDefault=True).update(isDefault=False)
        Address.objects.filter(id=addressID).update(isDefault=True)
        return HttpResponseRedirect("/pay/"+str(purchaseID))
    elif flag=='1':
        Address.objects.filter(id=addressID).delete()
        return HttpResponseRedirect("/pay/"+str(purchaseID))
    else:
       return HttpResponseRedirect("/pay/"+str(purchaseID)) 

@auth
def pay_result_views(request):
    UID = request.session.get('uid')
    if request.method == 'GET':
        payInfo = request.GET
        purchaseID = payInfo.get('purchaseID')
        purBookList = BookList.objects.filter(purchase_id=purchaseID)
        user = User.objects.filter(id=UID)
        purchase = Purchase.objects.filter(id=purchaseID,user_id=UID)
        try:
            address = Address.objects.get(isDefault=True,user_id=UID).id
        except:
            return HttpResponse(json.dumps({'status':'noaddress','purchaseid':payInfo.get('purchaseID')}))
        total = float(purchase[0].orderAmount)
        if payInfo.get('payWay')=='1':
            if total>user[0].balance:
                return HttpResponse(json.dumps({'status':'nomoney','purchaseid':payInfo.get('purchaseID')}))
                #return HttpResponseRedirect("/pay/"+payInfo.get('purchaseID'))
            else:
                bookList = []
                for bl in purBookList:
                    book = Book.objects.get(id=bl.book_id)
                    if book.bookStock<bl.bookAmount:
                        return HttpResponse(json.dumps({'status':'nostock','purchaseid':payInfo.get('purchaseID')})) 
                    book.bookStock -= bl.bookAmount
                    bookList.append(book)
                for book in bookList:
                    book.save()
                purchase.update(orderState='待发货',address_id=address)
                user.update(balance=F('balance')-total)
                return HttpResponse(json.dumps({'status':True,'purchaseid':payInfo.get('purchaseID')}))
    else:
        return HttpResponseRedirect("/index/")

@auth
def pay_success_views(request,purchaseID):
    UID = request.session.get('uid')
    purchase = Purchase.objects.get(id=purchaseID)
    address = Address.objects.get(id=purchase.address_id)
    cart = Cart.objects.filter(user_id=UID).count()
    return render(request,'success.html',locals())