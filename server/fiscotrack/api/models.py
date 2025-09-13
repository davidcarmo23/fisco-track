from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

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
    value = models.FloatField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")

    def __str__(self):
        return self.title
    
    @property
    def total_received(self):
        return sum(i.total_received for i in self.invoices.all())

    @property
    def is_paid(self):
        return all(i.is_paid for i in self.invoices.all()) and self.total_received >= self.value

class Invoice(models.Model):
    date = models.DateField()
    value = models.FloatField(default=0)
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name="invoices")

    def __str__(self):
        return self.title
    
    @property
    def total_received(self):
        return sum(r.value for r in self.receipts.all())

    @property
    def is_paid(self):
        return self.total_received >= self.value
    
class Receipt(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="receipts")
    date = models.DateField()
    value = models.FloatField(default=0)

    def __str__(self):
        return self.title
    
    def clean(self):
        already_received = self.invoice.total_received

        if self.pk:
            already_received = Receipt.objects.get(pk = self.pk).value
        
        if already_received + self.value > self.invoice.value:
            raise ValidationError(
                f"Overpayment detected: Invoice {self.invoice.id} value is {self.invoice.value}, "
                f"but you’re trying to record {already_received + self.value}"
            )

    def save(self, *args, **kwargs):
        self.full_clean()  # triggers clean() before save
        super().save(*args, **kwargs)