from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Invoice,Receipt,Category,Expense
from .serializer import InvoiceSerializer,ReceiptSerializer,CategorySerializer,ExpenseSerializer

@api_view(['GET'])
def get_invoices(request):
    invoices = Invoice.objects.all()
    serializedData = InvoiceSerializer(invoices, many=True).data
    return Response(serializedData)

def get_receipts(request):
    receipts = Receipt.objects.all()
    serializedData = ReceiptSerializer(receipts, many=True).data
    return Response(serializedData)

def get_categories(request):
    categories = Category.objects.all()
    serializedData = CategorySerializer(categories, many=True).data
    return Response(serializedData)

def get_expenses(request):
    expenses = Expense.objects.all()
    serializedData = ExpenseSerializer(expenses, many=True).data
    return Response(serializedData)

def download_file(request):
    requested_file = request.data

def preview_file(request):
    requested_file = request.data

@api_view(['POST'])
def create_invoice(request):
    data = request.data
    serializer = InvoiceSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def create_category(request):
    data = request.data
    serializer = CategorySerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def create_expense(request):
    data = request.data
    serializer = ExpenseSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def create_receipt(request):
    data = request.data
    serializer = ReceiptSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def upload_file(request):
    data = request.data

@api_view(['PUT', 'DELETE'])
def invoice_detail(request, pk):
    try :
        invoice = Invoice.objects.get(pk=pk)
    except Invoice.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        invoice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        data = request.data
        serializer = InvoiceSerializer(invoice, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def expense_detail(request, pk):
    try :
        expense = Expense.objects.get(pk=pk)
    except Expense.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        expense.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        data = request.data
        serializer = ExpenseSerializer(expense, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def category_detail(request, pk):
    try :
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        data = request.data
        serializer = CategorySerializer(category, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def receipt_detail(request, pk):
    try :
        receipt = Receipt.objects.get(pk=pk)
    except Receipt.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        receipt.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        data = request.data
        serializer = ReceiptSerializer(receipt, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
