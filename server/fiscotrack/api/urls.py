from django.urls import path
from .views import (
    InvoiceListCreate, InvoiceDelete, InvoiceDetail,
    ExpenseListCreate, ExpenseDelete, ExpenseDetail,
    CategoryListCreate, CategoryDetail,
    ReceiptListCreate, ReceiptDetail
)

urlpatterns = [
    path('invoices/', InvoiceListCreate.as_view(), name='invoice-list-create'),
    path('invoices/delete/<int:pk>', InvoiceDelete.as_view(), name='delete-invoice'),
    path('invoices/<int:pk>/', InvoiceDetail.as_view(), name='invoice-detail'),

    path('expenses/', ExpenseListCreate.as_view(), name='expense-list-create'),
    path('expenses/delete/<int:pk>', ExpenseDelete.as_view(), name='delete-expense'),
    path('expenses/<int:pk>/', ExpenseDetail.as_view(), name='expense-detail'),

    path('categories/', CategoryListCreate.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetail.as_view(), name='category-detail'),

    path('receipts/', ReceiptListCreate.as_view(), name='receipt-list-create'),
    path('receipts/<int:pk>/', ReceiptDetail.as_view(), name='receipt-detail'),
]
