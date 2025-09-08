from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Category(models.Model):
    title = models.CharField(max_length=50)
    color = models.CharField(max_length=15)
    priority = models.IntegerField()

    def __str__(self):
        return self.title   
    
class Expense(models.Model):
    title = models.CharField(max_length=50)
    date = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    value = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")

    def __str__(self):
        return self.title

class Invoice(models.Model):
    date = models.DateField()
    value = models.FloatField()
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name="invoices")

    def __str__(self):
        return self.title
    
class Receipt(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="receipts")
    date = models.DateField()

    def __str__(self):
        return self.title