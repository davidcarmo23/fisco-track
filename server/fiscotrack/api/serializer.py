from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Invoice, Receipt, Category, Expense, Priority,Document

class ReceiptSerializer(serializers.ModelSerializer):
    invoice_details = serializers.ReadOnlyField()
    category_details = serializers.ReadOnlyField()
    expense_details = serializers.ReadOnlyField()
    
    class Meta:
        model = Receipt
        fields = '__all__'
        extra_kwargs = {
            "user": {"read_only": True},
            'expense': {'required': False, 'allow_null': True},
            'invoice': {'required': False, 'allow_null': True},
        }
    
class PrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Priority
        fields = '__all__'
        
class DocumentSerializer(serializers.ModelSerializer):
    file_path_local = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id', 'file_name', 'file_path', 'description', 'content_type', 'content_id','file_path_local']
        extra_kwargs = {
            'file_size': {'read_only': True},
            'mime_type': {'read_only': True},
            'user': {'read_only': True}
        }
        
    def get_file_path_local(self, obj):
        if obj.file_path:
            return obj.file_path.name  # Returns just 'documents/2025/09/filename.pdf'
        return None
    
    def create(self, validated_data):
        file_obj = validated_data.get('file_path')
        if file_obj:
            validated_data['file_size'] = file_obj.size
            validated_data['mime_type'] = file_obj.content_type
        return super().create(validated_data)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    category_details = serializers.ReadOnlyField()
    total_received = serializers.ReadOnlyField()
    is_paid = serializers.ReadOnlyField()
    
    class Meta:
        model = Invoice
        fields = ['id', 'date', 'amount', 'invoice_number', 
                  'category_details', 'total_received', 'is_paid']

class ExpenseSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)
    invoice_details = InvoiceSerializer(source='invoice', read_only=True)
    total_paid = serializers.ReadOnlyField()
    is_paid = serializers.ReadOnlyField()
    
    class Meta:
        model = Expense
        fields = ['id', 'title', 'date', 'amount', 'category', 'category_details', 'invoice_details',
                 'total_paid', 'is_paid']
        extra_kwargs = {"user": {"read_only": True}}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', "username", 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user