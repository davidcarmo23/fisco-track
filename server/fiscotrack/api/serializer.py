from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Invoice,Receipt,Category,Expense


class ReceiptSerializer(serializers.ModelSerializer):
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
    total_received = serializers.FloatField(read_only=True)
    is_paid = serializers.BooleanField(read_only=True)
    receipts = ReceiptSerializer(many=True, read_only=True)
    
    class Meta:
        model = Invoice
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    total_received = serializers.FloatField(read_only=True)
    is_paid = serializers.BooleanField(read_only=True)
    # invoices = InvoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Expense
        fields = '__all__'
        extra_kwargs = {"user": {"read_only": True}}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', "username",'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user