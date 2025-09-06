from django.db import models

# Create your models here.
class Category(models.Model):
    title = models.CharField(max_length=50)
    color = models.CharField(max_length=15)
    priority = models.IntegerField()

    def __str__(self):
        return self.title   
    
class User(models.Model):
    email = models.EmailField(max_length=50)
    password = models.CharField(max_length=30)
    admin = models.BooleanField(default=False)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    def __str__(self):
        return self.title    
    
class Expense(models.Model):
    title = models.CharField(max_length=50)
    date = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    value = models.FloatField()
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Invoice(models.Model):
    date = models.DateField()
    value = models.FloatField()
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    
class Receipt(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    date = models.DateField()

    def __str__(self):
        return self.title