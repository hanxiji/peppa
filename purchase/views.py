from __future__ import unicode_literals
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from index.models import *

import types

#whether the user has login.
def if_login(func) :
    def inner(request, *args, **kwargs) :
        userId = request.session.get('uid')
        if not userId :
            return HttpResponseRedirect('/login')
        return func(request, *args, **kwargs)
    return inner

@if_login
def all_purchase(request) :
    uName = User.objects.get(id=request.session.get('uid'))
    prch = Purchase.objects.filter(user=request.session.get('uid')).order_by('-id')
    if request.method == 'GET' :
        if prch.count() == 0 :
            return render(request, 'order.html', {'userName': uName, 'target': 'all'})
        info = []
        for prchitr in prch :
            bklst = BookList.objects.filter(purchase=prchitr)
            books = []
            n = 0
            for bklstitr in bklst :
                if n < 5 :
                    n += 1
                else :
                    break
                bk = Book.objects.get(id=bklstitr.book.id)
                books.append({'bookID': bk.id, 'bookPhoto': bk.bookPhoto})
            info.append({'books': books, 'amount': prchitr.orderAmount,
                        'prchID': prchitr.id, 'prchTime': prchitr.orderTime,
                        'prchState': prchitr.orderState})
        return render(request, 'order.html', {'userName': uName, 'target': 'all', 'button': '查看', 'infomation': info})
    else :
        prchID = request.POST.get('purchaseID')
        targetPrch = Purchase.objects.get(id=prchID)
        bookList = BookList.objects.filter(purchase=targetPrch)
        info = []
        for bk in bookList :
            info.append({'bookID': bk.book.id, 'bookPhoto': bk.book.bookPhoto, 'bookName': bk.book.bookName,
                         'bookPrice': bk.bookPrice, 'bookAmount': bk.bookAmount})
        print(prchID)
        return render(request, 'orderDetail.html', {'userName': uName, 'infomation': info})

@if_login
def unpaid_purchase(request) :
    uName = User.objects.get(id=request.session.get('uid'))
    prch = Purchase.objects.filter(user=request.session.get('uid'), orderState='待付款')
    if request.method == 'GET' :
        if prch.count() == 0 :
            return render(request, 'order.html', {'userName': uName, 'target': 'unpaid', 'button': '付款'})
        info = []
        for prchitr in prch :
            bklst = BookList.objects.filter(purchase=prchitr)
            books = []
            n = 0
            for bklstitr in bklst:
                if n < 5:
                    n += 1
                else:
                    break
                bk = Book.objects.get(id=bklstitr.book.id)
                books.append({'bookID': bk.id, 'bookPhoto': bk.bookPhoto})
            info.append({'books': books, 'amount': prchitr.orderAmount,
                             'prchID': prchitr.id, 'prchTime': prchitr.orderTime,
                             'prchState': prchitr.orderState})
        return render(request, 'order.html', {'userName': uName, 'target': 'unpaid', 'button': '付款', 'infomation': info})
    else :
        prchID = int(request.POST.get('purchaseID'))
        return HttpResponseRedirect('/pay/'+str(prchID))

@if_login
def unsent_purchase(request) :
    uName = User.objects.get(id=request.session.get('uid'))
    prch = Purchase.objects.filter(user=request.session.get('uid'), orderState='待发货')
    if request.method == 'GET' :
        if prch.count() == 0 :
            return render(request, 'order.html', {'userName': uName, 'target': 'unsent', 'button': '取消订单'})
        info = []
        for prchitr in prch :
            bklst = BookList.objects.filter(purchase=prchitr)
            books = []
            n = 0
            for bklstitr in bklst:
                if n < 5:
                    n += 1
                else:
                    break
                bk = Book.objects.get(id=bklstitr.book.id)
                books.append({'bookID': bk.id, 'bookPhoto': bk.bookPhoto})
            info.append({'books': books, 'amount': prchitr.orderAmount,
                            'prchID': prchitr.id, 'prchTime': prchitr.orderTime,
                            'prchState': prchitr.orderState})
        return render(request, 'order.html', {'userName': uName, 'target': 'unsent', 'button': '取消订单', 'infomation': info})
    else :
        prchID = request.POST.get('purchaseID')
        targetPrch = Purchase.objects.get(id=prchID)
        targetPrch.orderState = '已取消'
        targetPrch.save()
        return HttpResponseRedirect('/order/canceled')

@if_login
def unrecieved_purchase(request) :
    uName = User.objects.get(id=request.session.get('uid'))
    prch = Purchase.objects.filter(user=request.session.get('uid'), orderState='待收货')
    if request.method == 'GET' :
        if prch.count() == 0 :
            return render(request, 'order.html', {'userName': uName, 'target': 'unrecieved', 'button': '确认收货'})
        info = []
        for prchitr in prch :
            bklst = BookList.objects.filter(purchase=prchitr)
            books = []
            n = 0
            for bklstitr in bklst:
                if n < 5:
                    n += 1
                else:
                    break
                bk = Book.objects.get(id=bklstitr.book.id)
                books.append({'bookID': bk.id, 'bookPhoto': bk.bookPhoto})
            info.append({'books': books, 'amount': prchitr.orderAmount,
                        'prchID': prchitr.id, 'prchTime': prchitr.orderTime,
                        'prchState': prchitr.orderState})
        return render(request, 'order.html', {'userName': uName, 'target': 'unrecieved', 'button': '确认收货', 'infomation': info})
    else :
        prchID = request.POST.get('purchaseID')
        targetPrch = Purchase.objects.get(id=prchID)
        targetPrch.orderState = '待评价'
        targetPrch.save()
        return HttpResponseRedirect('/order/unjudged')

@if_login
def unjudged_purchase(request) :
    uName = User.objects.get(id=request.session.get('uid')).userName
    prch = Purchase.objects.filter(user=request.session.get('uid'), orderState='待评价')
    if request.method == 'GET' :
        if prch.count() == 0 :
            return render(request, 'order.html', {'userName': uName, 'target': 'unjudged', 'button': '评价'})
        info = []
        for prchitr in prch :
            bklst = BookList.objects.filter(purchase=prchitr)
            books = []
            n = 0
            for bklstitr in bklst:
                if n < 5:
                    n += 1
                else:
                    break
                bk = Book.objects.get(id=bklstitr.book.id)
                books.append({'bookID': bk.id, 'bookPhoto': bk.bookPhoto})
            info.append({'books': books, 'amount': prchitr.orderAmount,
                             'prchID': prchitr.id, 'prchTime': prchitr.orderTime,
                             'prchState': prchitr.orderState})
        return render(request, 'order.html', {'userName': uName, 'target': 'unjudged', 'button': '评价', 'infomation': info})
    else :
        prchID = int(request.POST.get('purchaseID'))
        return HttpResponseRedirect('/add_opinion/'+str(prchID))

@if_login
def done_purchase(request) :
    uName = User.objects.get(id=request.session.get('uid'))
    prch = Purchase.objects.filter(user=request.session.get('uid'), orderState='已完成')
    if request.method == 'GET' :
        if prch.count() == 0 :
            return render(request, 'order.html', {'userName': uName, 'target': 'done', 'button': '退货'})
        info = []
        for prchitr in prch :
            bklst = BookList.objects.filter(purchase=prchitr)
            books = []
            n = 0
            for bklstitr in bklst:
                if n < 5:
                    n += 1
                else:
                    break
                bk = Book.objects.get(id=bklstitr.book.id)
                books.append({'bookID': bk.id, 'bookPhoto': bk.bookPhoto})
            info.append({'books': books, 'amount': prchitr.orderAmount,
                        'prchID': prchitr.id, 'prchTime': prchitr.orderTime,
                        'prchState': prchitr.orderState})
        return render(request, 'order.html', {'userName': uName, 'target': 'done', 'button': '退货', 'infomation': info})
    else :
        prchID = int(request.POST.get('purchaseID'))
        return HttpResponseRedirect('/refund/'+str(prchID))

@if_login
def canceled_purchase(request) :
    uName = User.objects.get(id=request.session.get('uid'))
    prch = Purchase.objects.filter(user=request.session.get('uid'), orderState='已取消')
    if request.method == 'GET' :
        if prch.count() == 0 :
            return render(request, 'order.html', {'userName': uName, 'target': 'canceled', 'button': '查看'})
        info = []
        for prchitr in prch :
            bklst = BookList.objects.filter(purchase=prchitr)
            books = []
            n = 0
            for bklstitr in bklst:
                if n < 5:
                    n += 1
                else:
                    break
                bk = Book.objects.get(id=bklstitr.book.id)
                books.append({'bookID': bk.id, 'bookPhoto': bk.bookPhoto})
            info.append({'books': books, 'amount': prchitr.orderAmount,
                             'prchID': prchitr.id, 'prchTime': prchitr.orderTime,
                             'prchState': prchitr.orderState})
        return render(request, 'order.html', {'userName': uName, 'target': 'canceled', 'button': '查看', 'infomation': info})
    else :
        prchID = request.POST.get('purchaseID')
        targetPrch = Purchase.objects.get(id=prchID)
        bookList = BookList.objects.filter(purchase=targetPrch)
        info = []
        for bk in bookList:
            info.append({'bookID': bk.book.id, 'bookPhoto': bk.book.bookPhoto, 'bookName': bk.book.bookName,
                         'bookPrice': bk.book.bookPrice, 'bookAmount': bk.bookAmount})
        return render(request, 'orderDetail.html', {'userName': uName, 'infomation': info})

@if_login
def show_opinions(request) :
    uName = User.objects.get(id=request.session.get('uid'))
    prch = Purchase.objects.filter(user=request.session.get('uid'), orderState='已完成')
    if prch.count() == 0 :
        return render(request, 'opinion.html', {'userName': uName})
    info = []
    for prchitr in prch :
        opn = Opinion.objects.filter(purchase=prchitr)
        bklst = BookList.objects.filter(purchase=prchitr)
        for bklstitr in bklst :
            book = bklstitr.book
            for opnitr in opn :
                prch = opnitr.purchase
                info.append({'opnDetail': opnitr.detail, 'opnLevel': opnitr.level, 'bookID': book.id, 'bookPhoto': book.bookPhoto})
    return render(request, 'opinion.html', {'userName': uName, 'infomation': info})

@if_login
def add_opinion(request, prchID) :
    if request.method == 'GET' :
        uName = User.objects.get(id=request.session.get('uid'))
        prch = Purchase.objects.get(id=prchID)
        info = []
        bklst = BookList.objects.filter(purchase=prch)
        books = []
        n = 0
        for bklstitr in bklst:
            if n < 5:
                n += 1
            else:
                break
            bk = Book.objects.get(id=bklstitr.book.id)
            books.append({'bookID': bk.id, 'bookPhoto': bk.bookPhoto})
        info.append({'books': books, 'prchID': prchID})
        return render(request, 'opinionDetail.html', {'userName': uName, 'target': 'add_opinion/'+str(prchID), 'button': '提交评价', 'infomation': info})
    else:
        purchase = Purchase.objects.get(id = prchID)
        purchase.orderState = '已完成'
        purchase.save()
        return HttpResponseRedirect('/order/done/')

@csrf_exempt
def post(request):
    new_opinion = Opinion.objects.create(            
        purchase = Purchase.objects.get(id = request.POST.get('purchaseID')),
        book = Book.objects.get(id = request.POST.get('bookId')),
        level = request.POST.get('level'),
        detail = request.POST.get('content'),
    )
    new_opinion.save()
    return HttpResponse()
