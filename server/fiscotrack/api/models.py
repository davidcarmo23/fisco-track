from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
import os

class Category(models.Model):
    title = models.CharField(max_length=50)
    color = models.CharField(max_length=15)
    priority = models.IntegerField()
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['priority', 'title']
        indexes = [
            models.Index(fields=['priority']),
            models.Index(fields=['title']),
        ]

class Expense(models.Model):
    title = models.CharField(max_length=50)
    date = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="expenses")
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
   
    @property
    def total_received(self):
        return sum(i.total_received for i in self.invoices.all())
    
    @property
    def is_paid(self):
        return all(i.is_paid for i in self.invoices.all()) and self.total_received >= self.value
    
    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user', '-date']),  # Most common query: user's expenses by date
            models.Index(fields=['user', 'category']),  # Filter by user and category
            models.Index(fields=['date']),  # Date range queries
            models.Index(fields=['category', '-date']),  # Category filtering with date sort
            models.Index(fields=['user', '-created_at']),  # Recently created expenses
            models.Index(fields=['value']),  # Value-based filtering/sorting
        ]

class Invoice(models.Model):
    date = models.DateField()
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0) 
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name="invoices")
    invoice_number = models.CharField(max_length=50, blank=True, null=True)  # Added for better identification
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Invoice #{self.invoice_number or self.id}"
   
    @property
    def total_received(self):
        return sum(r.value for r in self.receipts.all())
    
    @property
    def is_paid(self):
        return self.total_received >= self.value
    
    @property
    def category_details(self):
        """Access category through expense for serializers"""
        return self.expense.category if self.expense else None
    
    @property
    def expense_details(self):
        """Expense details for serializers"""
        return self.expense if self.expense else None
    
    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['expense', '-date']),  # Invoices for specific expense
            # models.Index(fields=['expense__user', '-date']),  # User's invoices by date
            models.Index(fields=['date']),  # Date filtering
            # models.Index(fields=['expense__user', 'expense']),  # User + expense filtering
            models.Index(fields=['invoice_number']),  # Invoice number lookup
            models.Index(fields=['value']),  # Value-based queries
        ]

class Receipt(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="receipts")
    date = models.DateField()
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    receipt_number = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Receipt #{self.receipt_number or self.id}"
   
    def clean(self):
        if not self.invoice:
            return
            
        # Calculate current total received excluding this receipt if updating
        current_received = sum(
            r.value for r in self.invoice.receipts.exclude(pk=self.pk) if r.pk != self.pk
        )
        
        if current_received + self.value > self.invoice.value:
            raise ValidationError(
                f"Overpayment detected: Invoice {self.invoice.id} value is {self.invoice.value}, "
                f"already received {current_received}, but you're trying to add {self.value}. "
                f"Maximum allowed: {self.invoice.value - current_received}"
            )
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def category_details(self):
        """Access category through invoice->expense for serializers"""
        return self.invoice.expense.category if self.invoice and self.invoice.expense else None
    
    @property
    def invoice_details(self):
        """Invoice details for serializers"""
        return self.invoice if self.invoice else None
    
    @property
    def expense_details(self):
        """Expense details for serializers"""
        return self.invoice.expense if self.invoice and self.invoice.expense else None
    
    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['invoice', '-date']),  # Receipts for specific invoice
            # models.Index(fields=['invoice__expense', '-date']),  # Receipts for expense
            # models.Index(fields=['invoice__expense__user', '-date']),  # User's receipts
            models.Index(fields=['date']),  # Date filtering
            models.Index(fields=['receipt_number']),  # Receipt number lookup
            models.Index(fields=['value']),  # Value-based queries
        ]

class Document(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('expense', 'Expense'),
        ('invoice', 'Invoice'),
        ('receipt', 'Receipt'),
    ]
    
    file_name = models.CharField(max_length=150)
    file_path = models.FileField(upload_to='documents/%Y/%m/')  # Organized by date
    file_size = models.DecimalField(max_digits=10, decimal_places=2)
    mime_type = models.CharField(max_length=150)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPE_CHOICES)
    content_id = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="documents")
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.file_name
    
    def clean(self):
        # Validate that content_id exists for the given content_type
        if self.content_type == 'expense':
            if not Expense.objects.filter(id=self.content_id, user=self.user).exists():
                raise ValidationError("Invalid expense ID or not owned by user")
        elif self.content_type == 'invoice':
            if not Invoice.objects.filter(id=self.content_id, expense__user=self.user).exists():
                raise ValidationError("Invalid invoice ID or not owned by user")
        elif self.content_type == 'receipt':
            if not Receipt.objects.filter(id=self.content_id, invoice__expense__user=self.user).exists():
                raise ValidationError("Invalid receipt ID or not owned by user")
    
    class Meta:
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['content_type', 'content_id']),  # Primary lookup pattern
            models.Index(fields=['user', '-uploaded_at']),  # User's documents by date
            models.Index(fields=['user', 'content_type']),  # User's documents by type
            models.Index(fields=['content_type', 'content_id', 'user']),  # Compound lookup
            models.Index(fields=['mime_type']),  # File type filtering
        ]