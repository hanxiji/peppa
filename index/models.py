# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

OrderState = [
    ('待付款', '待付款'),
    ('待发货', '待发货'),
    ('待收货', '待收货'),
    ('待评价', '待评价'),
    ('已取消', '已取消'),
    ('已完成', '已完成')
]
RejectState = [
    ('退货中', '退货中'),
    ('已退货', '已退货')
]
OpinionLevel = [
    ('好评', '好评'),
    ('中评', '中评'),
    ('差评', '差评')
]


Identity = [
    ('user','用户'),
    ('cc','客服')
]
# Create your models here.
class User(models.Model):
    userName = models.CharField('用户名', max_length=20)
    userPassword = models.CharField('用户密码', max_length=200)
    userMobile = models.CharField('用户手机', max_length=11, null=True, blank=True)
    userEmail = models.EmailField('用户邮箱', null=True, blank=True)
    userImage = models.ImageField('用户头像', null=True, blank=True, upload_to='static/img/upload/user')
    balance = models.DecimalField('余额', max_digits=7, decimal_places=2,default=0)
    def __str__(self):
        return self.userName
    class Meta:
        db_table = 'user'
        verbose_name = '用户'
        verbose_name_plural = verbose_name


class CustomerCare(models.Model):
    ccName = models.CharField('客服名称', max_length=20)
    password = models.CharField('密码', max_length=20)
    ccImage = models.ImageField('客服头像', null=True, blank=True, upload_to='static/img/upload/customercare')
    isLogin = models.BooleanField('是否登录', default=False)
    isChat = models.BooleanField('是否在聊天', default=False)
    chatUser = models.OneToOneField(User, verbose_name='聊天用户', null=True, blank=True)
    def __str__(self):
        return self.ccName
    class Meta:
        db_table = 'customercare'
        verbose_name = '客服'
        verbose_name_plural = verbose_name


class BookType(models.Model):
    typeName = models.CharField('类型名称', max_length=20)
    typePhoto = models.ImageField('类型图片', null=True, blank=True, upload_to='static/img/upload/booktype')
    typeIntr = models.TextField('类型描述', null=True, blank=True)
    def __str__(self):
        return self.typeName
    class Meta:
        db_table = 'booktype'
        verbose_name = '图书类型'
        verbose_name_plural = verbose_name

class Book(models.Model):
    bookName = models.CharField('图书名称', max_length=200)
    bookPrice = models.DecimalField('图书价格', max_digits=7, decimal_places=2)
    bookPhoto = models.ImageField('图书封面', null=True, blank=True, upload_to='static/img/upload/book')
    bookIntr = models.TextField('图书描述', null=True, blank=True)
    bookStock = models.IntegerField('图书库存')
    discount = models.FloatField('折扣', null=True, blank=True)
    bookType = models.ManyToManyField(BookType, verbose_name = '图书类型')
    author = models.CharField('作者', max_length = 100)
    publisher = models.CharField('出版社', max_length = 40)
    publishTime = models.DateField('出版日期')
    isOnsale = models.BooleanField('是否在售')
    def __str__(self):
        return self.bookName
    class Meta:
        db_table = 'book'
        verbose_name = '图书'
        verbose_name_plural = verbose_name

class Cart(models.Model):
    user = models.ForeignKey(User, verbose_name = '用户')
    book = models.ForeignKey(Book,verbose_name = '书籍')
    amount = models.IntegerField('购买数量',null=True)

    # def __str__(self):
    #     return self.user

    class Meta:
        db_table = 'cart'
        verbose_name = '购物车'
        verbose_name_plural = verbose_name

class Address(models.Model):
    user = models.ForeignKey(User, verbose_name = '用户')
    recieverMobile = models.CharField('收货人手机', max_length=11)
    province = models.CharField('地址（省）', max_length=20)
    city = models.CharField('地址（市）', max_length=20)
    region = models.CharField('地址（区）', max_length=20)
    detail = models.TextField('详细地址')
    #addressDetail = models.TextField('详细地址')
    recieverName = models.CharField('收货人姓名', max_length=30)
    isDefault = models.BooleanField('默认地址',default=False)
    class Meta:
        db_table = 'Address'
        verbose_name = '地址'
        verbose_name_plural = verbose_name

class Purchase(models.Model):
    user = models.ForeignKey(User, verbose_name = '用户')
    orderTime = models.DateField('下单时间')
    orderState = models.CharField('订单状态', max_length=20, choices=OrderState)
    orderAmount = models.DecimalField('订单金额', max_digits=7, decimal_places=2)
    address = models.ForeignKey(Address, verbose_name = '配送地址', null=True)
    # def __str__(self):
    #     return self.user

    class Meta:
        db_table = 'purchase'
        verbose_name = '订单'
        verbose_name_plural = verbose_name

# class BookList(models.Model):
#     purchase = models.ForeignKey(Purchase, verbose_name = '订单', null=True, blank=True)
#     book = models.ForeignKey(Book, verbose_name = '图书')
#     bookAmount = models.IntegerField('购买图书数量')
#     bookPrice = models.FloatField('图书单价', null=True)
#     class Meta:
#         db_table = 'booklist'
#         verbose_name = '订单图书'
#         verbose_name_plural = verbose_name

class Img(models.Model):
    img_url = models.ImageField('图片凭证', null=True, blank=True, upload_to='static/img/upload/refund')# upload_to指定图片上传的途径，如果不存在则自动创建

class Reject(models.Model):
    purchase = models.OneToOneField(Purchase, verbose_name = '订单')
    rejectTime = models.DateField('申请时间',auto_now_add = True)
    rejectAmount = models.DecimalField('退款金额', max_digits=7, decimal_places=2)
    rejectReason = models.TextField('退款原因')
    rejectState = models.CharField('退款状态', max_length=20, choices = RejectState)
    img = models.OneToOneField(Img,verbose_name='图片凭证',null=True)
    class Meta:
        db_table = 'reject'
        verbose_name = '退货单'
        verbose_name_plural = verbose_name

class BookList(models.Model):
    purchase = models.ForeignKey(Purchase, verbose_name = '订单', null=True, blank=True)
    reject = models.ForeignKey(Reject,verbose_name='退货单',null=True,blank=True)
    book = models.ForeignKey(Book, verbose_name = '图书')
    bookAmount = models.IntegerField('购买图书数量',null=True,blank=True)
    bookRefund = models.IntegerField('退货图书数量',null=True,blank=True)
    bookPrice = models.FloatField('图书单价', null=True)
    class Meta:
        db_table = 'booklist'
        verbose_name = '订单图书'
        verbose_name_plural = verbose_name

class Opinion(models.Model):
    purchase = models.ForeignKey(Purchase, verbose_name = '订单')
    book = models.ForeignKey(Book, verbose_name = '图书')
    opinionTime = models.DateTimeField('评论时间', auto_now=True, null=True)
    level = models.CharField('评价等级', max_length=20, choices=OpinionLevel)
    detail = models.TextField('评价详情')
    class Meta:
        db_table = 'opinion'
        verbose_name = '评价'
        verbose_name_plural = verbose_name

class Chat(models.Model):
    userSender = models.ForeignKey(User, verbose_name='用户')
    ccSender = models.ForeignKey(CustomerCare, verbose_name='客服')
    content = models.TextField('内容', null=True, blank=True)
    emoji = models.ImageField('表情', null=True, blank=True)
    time = models.DateTimeField('时间', auto_now=True, null=True)
    identity = models.CharField('发送消息人的身份', max_length=10, choices=Identity)

    def __unicode__(self):
        return u'%s' % self.content
    class Meta:
        db_table = 'chat'
        verbose_name = '聊天记录'
        verbose_name_plural = verbose_name