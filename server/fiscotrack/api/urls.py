from django.urls import path
from .views import (
    InvoiceListCreate, InvoiceDelete, InvoiceDetail,
    ExpenseListCreate, ExpenseDelete, ExpenseDetail,
    CategoryListCreate, CategoryDetail,
    PriorityListCreate, PriorityDetail,
    ReceiptListCreate, ReceiptDetail,
    DocumentListCreate,DocumentDetail,
    GetUserView,
    recent_activities,
    preview_excel_import, import_excel_data, get_import_template,
    expenses_by_category,expenses_over_time,income_vs_expenses
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
    
    path('priorities/', PriorityListCreate.as_view(), name='priority-list-create'),
    path('priorities/<int:pk>/', PriorityDetail.as_view(), name='priority-detail'),

    path('receipts/', ReceiptListCreate.as_view(), name='receipt-list-create'),
    path('receipts/<int:pk>/', ReceiptDetail.as_view(), name='receipt-detail'),

    path('import/preview/', preview_excel_import, name='import-preview'),
    path('import/execute/', import_excel_data, name='import-execute'),
    path('import/template/', get_import_template, name='import-template'),
    
    path('documents/', DocumentListCreate.as_view(), name='document-list-create'),
    path('documents/<int:pk>/', DocumentDetail.as_view(), name='document-detail'),
    
    path('recent_activity/', recent_activities, name='recent-activity'),
    
    path('analytics/expenses-over-time/', expenses_over_time, name='expenses-over-time'),
    path('analytics/expenses-by-category/', expenses_by_category, name='expenses-by-category'),
    path('analytics/income-vs-expenses/', income_vs_expenses, name='income-vs-expenses'),
]
