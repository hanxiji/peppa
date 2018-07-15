# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import *

# Register your models here.
class CustomerCareAdmin(admin.ModelAdmin) :
    list_display = ['ccName', 'password']
    list_editable = ['password']

class UserAdmin(admin.ModelAdmin) :
    list_display = ['userName', 'userPassword',
                    'userMobile', 'userEmail','balance']
    list_editable = ['balance']

class BookTypeAdmin(admin.ModelAdmin) :
    list_display = ['typeName', 'typePhoto', 'typeIntr']
    list_editable = ['typePhoto', 'typeIntr']

class BookAdmin(admin.ModelAdmin) :
    list_display = ['bookName', 'bookPrice',
                    'bookPhoto', 'bookIntr',
                    'bookStock', 'discount',
                     'author', 'publisher',
                    'publishTime', 'isOnsale']
    list_editable = ['bookPrice',
                    'bookPhoto', 'bookIntr',
                    'bookStock', 'discount',
                     'author', 'publisher',
                    'publishTime', 'isOnsale']

class PurchaseAdmin(admin.ModelAdmin) :
    list_display = ['user', 'orderTime',
                    'orderState', 'orderAmount']
    list_editable = ['orderState', 'orderAmount']

class AddressAdmin(admin.ModelAdmin) :
    list_display = ['user', 'recieverMobile', 'province',
                    'city', 'region', 'detail', 'recieverName']
    list_editable = ['recieverMobile', 'province', 'city',
                     'region', 'detail', 'recieverName']

class CartAdmin(admin.ModelAdmin) :
    list_display = ['user', 'book', 'amount']
    list_editable = ['book', 'amount']

class BookListAdmin(admin.ModelAdmin) :
    list_display = ['purchase', 'book',
                    'bookAmount', 'bookPrice']
    list_editable = ['book', 'bookAmount', 'bookPrice']

class RejectAdmin(admin.ModelAdmin) :
    list_display = ['purchase', 'rejectTime', 'rejectAmount',
                    'rejectReason', 'rejectState']
    list_editable = ['rejectAmount', 'rejectState']
class OpinionAdmin(admin.ModelAdmin) :
    list_display = ['purchase', 'book', 'opinionTime',
                    'level', 'detail']

admin.site.register(CustomerCare, CustomerCareAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(BookType, BookTypeAdmin)
admin.site.register(Book, BookAdmin)
admin.site.register(Purchase, PurchaseAdmin)
admin.site.register(Address, AddressAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(BookList, BookListAdmin)
admin.site.register(Reject, RejectAdmin)
admin.site.register(Opinion, OpinionAdmin)