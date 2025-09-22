from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
import os

class Priority(models.Model):
    title = models.CharField(max_length=50)
    priority_value = models.IntegerField()
   
    def __str__(self):
        return self.title
   
    class Meta:
        verbose_name_plural = "Priorities"
        ordering = ['priority_value', 'title']
        indexes = [
            models.Index(fields=['priority_value']),
            models.Index(fields=['title']),
        ]
        
class Category(models.Model):
    title = models.CharField(max_length=50)
    color = models.CharField(max_length=15)
    priority = models.ForeignKey(Priority, on_delete=models.CASCADE, related_name="categories")
   
    def __str__(self):
        return self.title
   
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['priority', 'title']
        indexes = [
            models.Index(fields=['priority']),
            models.Index(fields=['title']),
        ]

class Invoice(models.Model):
    title = models.CharField(max_length=50)
    date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0) 
    invoice_number = models.CharField(max_length=50, blank=True, null=True)  # Added for better identification
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="invoices")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="invoices")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Invoice #{self.invoice_number or self.id}"
    
    @property
    def category_details(self):
        if self.category:
            return {'id': self.category.id,
                    'title': self.category.title,
                    'color': self.category.color}
        else:
            return None
            
    @property
    def total_received(self):
        return sum(r.amount for r in self.receipts.all())
    
    @property
    def is_paid(self):
        return self.total_received >= self.amount

    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['date']),  # Date filtering
            models.Index(fields=['invoice_number']),  # Invoice number lookup
            models.Index(fields=['amount']),  # Value-based queries
        ]

class Expense(models.Model):
    title = models.CharField(max_length=50)
    date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="expenses")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="expenses", null=True)
    expense_number = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return self.title
    
    @property
    def category_details(self):
        if self.category:
            return {'id': self.category.id,
                    'title': self.category.title,
                    'color': self.category.color}
        else:
            return None
            
    @property
    def invoice_details(self):
        if self.invoice:
            return {
                'id': self.invoice.id,
                'invoice_number': self.invoice.invoice_number,
                'title': self.invoice.title,
            }
        else:
            return None
    
   
    @property
    def total_paid(self):
        return sum(i.total_received for i in self.receipts.all())
    
    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user', '-date']),  # Most common query: user's expenses by date
            models.Index(fields=['user', 'category']),  # Filter by user and category
            models.Index(fields=['date']),  # Date range queries
            models.Index(fields=['category', '-date']),  # Category filtering with date sort
            models.Index(fields=['user', '-created_at']),  # Recently created expenses
            models.Index(fields=['amount']),  # Value-based filtering/sorting
        ]

class Receipt(models.Model):
    date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    receipt_number = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name="receipts", null=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="receipts", null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receipts")
    
    def __str__(self):
        return f"Receipt #{self.receipt_number or self.id}"
   
    def clean(self):
        current_received = 0
        threshold_amount = 0
        validation_string = ""
        if not self.invoice and not self.expense:
            return
        if self.invoice:    
            threshold_amount = self.invoice.amount
            # Calculate current total received excluding this receipt if updating
            current_received = sum(
                r.amount for r in self.invoice.receipts.exclude(pk=self.pk) if r.pk != self.pk
            )
            validation_string = f"Overpayment detected: Invoice {self.invoice.id} amount is {self.invoice.amount}, " "\n"   f"already received {current_received}, but you're trying to add {self.amount}. " "\n"  f"Maximum allowed: {self.invoice.amount - current_received}"
        else:
            threshold_amount = self.expense.amount
            current_received = sum(
                r.amount for r in self.expense.receipts.exclude(pk=self.pk) if r.pk != self.pk
            )
            
            validation_string = f"Overpayment detected: Expense {self.expense.id} amount is {self.expense.amount}, " "\n"   f"already received {current_received}, but you're trying to add {self.amount}. " "\n"  f"Maximum allowed: {self.expense.amount - current_received}"
            
        
        if current_received + self.amount > threshold_amount:
            raise ValidationError( validation_string )
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def category_details(self):
        if self.invoice:
            return {'id': self.invoice.category.id,
                    'title': self.invoice.category.title,
                    'color': self.invoice.category.color}
        elif self.expense:
            return {'id': self.expense.category.id,
                    'title': self.expense.category.title,
                    'color': self.expense.category.color}
        else:
            return None
            
    @property
    def invoice_details(self):
        if self.invoice:
            return {
                'id': self.invoice.id,
                'invoice_number': self.invoice.invoice_number,
                'title': self.invoice.title,
            }
        else:
            return None
    
    @property
    def expense_details(self):
        if self.expense:
            return {
                'id': self.expense.id,
                'title': self.expense.title,
            }
        else:
            return None
    
    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['invoice', '-date']),  # Receipts for specific invoice
            # models.Index(fields=['invoice__expense', '-date']),  # Receipts for expense
            # models.Index(fields=['invoice__expense__user', '-date']),  # User's receipts
            models.Index(fields=['date']),  # Date filtering
            models.Index(fields=['receipt_number']),  # Receipt number lookup
            models.Index(fields=['amount']),  # Value-based queries
        ]

class Document(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('expense', 'Expense'),
        ('invoice', 'Invoice'),
        ('receipt', 'Receipt'),
    ]
    
    file_name = models.CharField(max_length=150)
    file_path = models.FileField(upload_to='documents/%Y/%m/')
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