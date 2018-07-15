from django import forms
from .models import *
from captcha.fields import CaptchaField

# 登录
class LoginForm(forms.Form):
    userMobile = forms.CharField(label='用户手机',max_length=11,widget=forms.TextInput(
            attrs={
                'placeholder':'请输入用户手机号',
                'class':'form-control',}))
    userPassword = forms.CharField(required=True,max_length=20,min_length=6,label='用户密码',widget=forms.PasswordInput(
            attrs={
                'placeholder':'请输入6-20位号码字符',
                'class':'form-control',
            }))
    captcha = CaptchaField(label='验证码')

# 注册
class RegisterForm(forms.Form):
    userName = forms.CharField(label='用户昵称',widget=forms.TextInput(
            attrs={
                'placeholder':'请输入用户名',
                'class':'form-control',}))
    userPassword = forms.CharField(required=True,max_length=20,min_length=6,label='用户密码',widget=forms.PasswordInput(
            attrs={
                'placeholder':'请输入6-20位号码字符',
                'class':'form-control',
            }))
    checkpwd = forms.CharField(required=True,max_length=20,min_length=6,label='确认密码',widget=forms.PasswordInput(
            attrs={
                'placeholder':'请输入6-20位号码字符',
                'class':'form-control',}))
    userMobile = forms.CharField(label='用户手机',max_length=11,widget=forms.TextInput(
            attrs={
                'placeholder':'请输入用户手机号',
                'class':'form-control',}))
    userEmail = forms.EmailField(label='用户邮箱',widget=forms.EmailInput(
            attrs={
                'placeholder':'请输入邮箱地址',
                'class':'form-control',}))
    # captcha = CaptchaField(label='验证码',error_messages={"invalid":"验证码错误"})

# 发送随机验证码
class ForgetPwdForm(forms.Form):
    userMobile = forms.CharField(label='用户手机',widget=forms.TextInput(
            attrs={
                'placeholder':'请输入用户手机号',
                'class':'form-control',}))
    userEmail = forms.EmailField(label='用户邮箱',widget=forms.EmailInput(
            attrs={
                'placeholder':'请输入邮箱地址',
                'class':'form-control',}))
    # captcha = CaptchaField(label='验证码',error_messages={"invalid": "验证码错误"})

#确认邮箱验证码
class CheckForm(forms.Form):
    # userEmail = forms.EmailField(label='用户的邮箱',widget=forms.EmailInput(
    #         attrs={
    #             'placeholder':'请输入邮箱地址',
    #             'class':'form-control',}))
    code = forms.CharField(label='邮箱验证码',widget=forms.TextInput(
            attrs={
                'placeholder':'请输入邮箱验证码',
                'class':'form-control',}))
    # captcha = CaptchaField(label='验证码',error_messages={"invalid": u"验证码错误"})

class ResetPwdForm(forms.Form):
    newPassword = forms.CharField(required=True,max_length=20, min_length=6,label='新密码',widget=forms.PasswordInput(
            attrs={
                'placeholder':'请输入6-20位号码字符',
                'class':'form-control',
            }))
    checkPassword = forms.CharField(required=True,max_length=20, min_length=6,label='确认密码',widget=forms.PasswordInput(
            attrs={
                'placeholder':'请输入6-20位号码字符',
                'class':'form-control',}))
    # captcha = CaptchaField(label='验证码',error_messages={"invalid": u"验证码错误"})

# 退货申请表单
# class RefundForm(forms.ModelsForm):
#     class Meta:
#         model = Reject
#         fields = ['rejectReason']