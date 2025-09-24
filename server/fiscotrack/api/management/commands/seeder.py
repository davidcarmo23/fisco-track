import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Invoice, Receipt, Category, Expense, Document, Priority

class Command(BaseCommand):
    help = "Seed the database with test data for invoices, expenses, receipts, categories, priorities, and documents"

    def handle(self, *args, **kwargs):
        users = list(User.objects.all())
        if not users:
            self.stdout.write(self.style.ERROR("Please create at least one user first."))
            return

        # === Create Priorities ===
        priorities = []
        for idx, title in enumerate(["High", "Medium", "Low"], start=1):
            p, _ = Priority.objects.get_or_create(title=title, priority_value=idx)
            priorities.append(p)

        # === Create Categories ===
        categories = []
        cat_names = ["Food", "Transport", "Entertainment", "Health", "Utilities", "Education", "Shopping", "Travel", "Bills", "Leisure"]
        for name in cat_names:
            c, _ = Category.objects.get_or_create(
                title=name,
                color=f"#{random.randint(0, 0xFFFFFF):06x}",
                priority=random.choice(priorities),
            )
            categories.append(c)

        # === Generate Invoices, Expenses, Receipts ===
        start_date = datetime(2019, 1, 1)
        for i in range(120):  # ~120 records spanning multiple years/months
            date = start_date + timedelta(days=i * 25)
            user = random.choice(users)
            category = random.choice(categories)

            invoice = Invoice.objects.create(
                title=f"{category.title} Invoice {i}",
                date=date.date(),
                amount=random.randint(20, 500),
                invoice_number=f"INV-{1000+i}",
                category=category,
                user=user,
            )

            expense = Expense.objects.create(
                title=f"{category.title} Expense {i}",
                date=date.date(),
                amount=invoice.amount if random.random() > 0.3 else random.randint(10, 300),
                category=category,
                user=user,
                invoice=invoice if random.random() > 0.5 else None,
            )

            # Add receipts (full, partial, or missing)
        if random.random() > 0.2:  # 80% chance invoice/expense has receipts
            paid = 0
            while paid < invoice.amount and random.random() > 0.3:
                remaining = invoice.amount - paid
                if remaining <= 0:
                    break

                # Ensure we never exceed the remaining amount
                r_amount = min(remaining, random.randint(10, 200))
                
                invoice_flag = None
                expense_flag = expense if random.random() > 0.5 else None
                if expense_flag == None:
                    invoice_flag = invoice

                Receipt.objects.create(
                    date=date.date(),
                    amount=r_amount,
                    receipt_number=f"RCPT-{2000+i}-{paid}",
                    expense=expense_flag,
                    invoice=invoice_flag,
                    user=user,
                )

                paid += r_amount


        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
