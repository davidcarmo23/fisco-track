from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.shortcuts import render
from .models import Invoice,Receipt,Category,Expense
from .serializer import InvoiceSerializer,ReceiptSerializer,CategorySerializer,ExpenseSerializer, UserSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class GetUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class InvoiceListCreate(generics.ListCreateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Invoice.objects.filter(expense__user=user)\
                                 .select_related('expense__category')
        
        expense_id = self.request.query_params.get('expense_id', None)
        if expense_id:
            queryset = queryset.filter(expense_id=expense_id)
           
        return queryset
   
    def perform_create(self, serializer):
        serializer.save()

class InvoiceDelete(generics.DestroyAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Invoice.objects.filter(user= user)


class ExpenseListCreate(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Expense.objects.filter(user=user)
    
    def perform_create(self, serializer):
        print("Request data:", self.request.data)
        print("Serializer validated data:", serializer.validated_data)
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print("Error type:", type(e))
            print("Error message:", str(e))
            raise

class ReceiptListCreate(generics.ListCreateAPIView):
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Join: Receipt -> Invoice -> Expense -> User
        queryset = Receipt.objects.filter(invoice__expense__user=user)
        
        # Filtros opcionais
        invoice_id = self.request.query_params.get('invoice_id', None)
        if invoice_id:
            queryset = queryset.filter(invoice_id=invoice_id)
            
        expense_id = self.request.query_params.get('expense_id', None)
        if expense_id:
            queryset = queryset.filter(invoice__expense_id=expense_id)
            
        return queryset
   
    def perform_create(self, serializer):
        print("Request data:", self.request.data)
        print("Serializer validated data:", serializer.validated_data)
        try:
            serializer.save()
        except Exception as e:
            print("Error type:", type(e))
            print("Error message:", str(e))
            raise

class ExpenseDelete(generics.DestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Expense.objects.filter(user= user)
    
class ExpenseDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
         # only allow user to interact with their own expenses
        return Expense.objects.filter(user=self.request.user)


class CategoryListCreate(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]



class InvoiceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]


class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class ReceiptDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated]