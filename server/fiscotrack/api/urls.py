from django.urls import path
from .views import get_invoices,get_receipts,get_categories,get_expenses
from .views import create_invoice,create_category,create_expense,create_receipt
from .views import invoice_detail,receipt_detail,category_detail,expense_detail

urlpatterns = [
    path('invoices/', get_invoices, name='get_invoices'),
    path('invoices/create/', create_invoice, name='create_invoice'),
    path('invoices/<int:pk>', invoice_detail, name='invoice_detail'),

    path('receipts/', get_receipts, name='get_receipts'),
    path('receipts/create/', create_receipt, name='create_receipt'),
    path('receipts/<int:pk>', receipt_detail, name='receipt_detail'),

    path('categories/', get_categories, name='get_categories'),
    path('categories/create/', create_category, name='create_category'),
    path('categories/<int:pk>', category_detail, name='category_detail'),

    path('expenses/', get_expenses, name='get_expenses'),
    path('expenses/create/', create_expense, name='create_expense'),
    path('expenses/<int:pk>', expense_detail, name='expense_detail'),

    # path('users/', get_expenses, name='get_users'),
    # path('users/register/', register_user, name='register_user'),
    # path('users/login', login_user, name='login_user'),
    # path('users/profile/<int:pk>', view_user, name='view_user'),
    # path('users/update/<int:pk>', update_user, name='update_user'),
    # path('users/delete/<int:pk>', delete_user, name='delete_user'),
]