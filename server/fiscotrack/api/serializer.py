from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Invoice, Receipt, Category, Expense

class ReceiptSerializer(serializers.ModelSerializer):
    invoice_details = serializers.ReadOnlyField()
    category_details = serializers.ReadOnlyField()
    expense_details = serializers.ReadOnlyField()
    
    class Meta:
        model = Receipt
        fields = '__all__'
    
    def validate(self, data):
        invoice = data["invoice"]
        value = data["value"]
        already_received = invoice.total_received
        
        if self.instance:
            already_received -= self.instance.value
            
        if already_received + value > invoice.value:
            raise serializers.ValidationError(
                f"Invoice total exceeded: max {invoice.value}, attempted {already_received + value}"
            )
        return data

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    category_details = serializers.ReadOnlyField()
    expense_details = serializers.ReadOnlyField()
    total_received = serializers.ReadOnlyField()
    is_paid = serializers.ReadOnlyField()
    
    class Meta:
        model = Invoice
        fields = ['id', 'date', 'value', 'expense', 'invoice_number', 
                 'category_details', 'expense_details', 'total_received', 'is_paid']
    
    def validate(self, data):
        expense = data['expense']
        value = data['value']
        already_received = expense.total_received
        
        if self.instance:
            already_received -= self.instance.value
            
        if already_received + value > expense.value:
            raise serializers.ValidationError(
                f"Invoice total exceeded: max {expense.value}, attempted {already_received + value}"
            )
        return data

class ExpenseSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)
    total_received = serializers.ReadOnlyField()
    is_paid = serializers.ReadOnlyField()
    
    class Meta:
        model = Expense
        fields = ['id', 'title', 'date', 'value', 'category', 'category_details', 
                 'total_received', 'is_paid']
        extra_kwargs = {"user": {"read_only": True}}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', "username", 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user