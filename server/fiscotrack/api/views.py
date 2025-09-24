import os
import io
import random
import tempfile
import pandas as pd
from datetime import date,datetime, timedelta
from dateutil.relativedelta import relativedelta 

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Sum, Count
from django.db.models.functions import TruncYear,TruncMonth,TruncWeek,TruncDay
from django.http import HttpResponse
from django.utils import timezone

from .models import Invoice,Receipt,Category,Expense,Document,Priority
from .serializer import InvoiceSerializer,ReceiptSerializer,CategorySerializer,ExpenseSerializer, UserSerializer,PrioritySerializer, DocumentSerializer



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
        queryset = Invoice.objects.filter(user=user)\
                                 .select_related('category')
           
        return queryset
   
    def perform_create(self, serializer):
        serializer.save()

class InvoiceDelete(generics.DestroyAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Invoice.objects.filter(expense__user= user)

class InvoiceDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)
    
    
class ExpenseListCreate(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
    
        queryset = Expense.objects.filter(user=user)\
                                 .select_related('category')
        
        invoice_id = self.request.query_params.get('invoice_id', None)
        if invoice_id:
            queryset = queryset.filter(invoice_id=invoice_id)
            
        return queryset
    
    def perform_create(self, serializer):
        print("Request data:", self.request.data)
        print("Serializer validated data:", serializer.validated_data)
        try:
            serializer.save(user=self.request.user)
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
        return Expense.objects.filter(user=self.request.user)


class CategoryListCreate(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class ReceiptListCreate(generics.ListCreateAPIView):
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Join: Receipt -> Invoice -> Expense -> User
        queryset = Receipt.objects.filter(user=user)
        
        # Filtros opcionais
        invoice_id = self.request.query_params.get('invoice_id', None)
        if invoice_id:
            queryset = queryset.filter(invoice_id=invoice_id)
            
        expense_id = self.request.query_params.get('expense_id', None)
        if expense_id:
            queryset = queryset.filter(expense_id=expense_id)
            
        return queryset
   
    def perform_create(self, serializer):
        print("Request data:", self.request.data)
        print("Serializer validated data:", serializer.validated_data)
        try:
            serializer.save(user= self.request.user)
        except Exception as e:
            print("Error type:", type(e))
            print("Error message:", str(e))
            raise

class ReceiptDelete(generics.DestroyAPIView):
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Receipt.objects.filter(expense__invoice__user= user)

class ReceiptDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Receipt.objects.filter(user=self.request.user)
    

class PriorityListCreate(generics.ListCreateAPIView):
    queryset = Priority.objects.all()
    serializer_class = PrioritySerializer
    permission_classes = [IsAuthenticated]

class PriorityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Priority.objects.all()
    serializer_class = PrioritySerializer
    permission_classes = [IsAuthenticated]
 
 
class DocumentListCreate(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Document.objects.filter(user=user)
        
        # Extract first value from QueryDict lists
        content_type = self.request.query_params.get('content_type')
        content_id = self.request.query_params.get('content_id')
        
        print(f"Extracted: content_type={content_type}, content_id={content_id}")
        
        if content_type and content_id:
            # Apply your serializer normalization here too
            normalized_type = {
                'expenses': 'expense',
                'invoices': 'invoice', 
                'receipts': 'receipt'
            }.get(content_type, content_type)
            
            queryset = queryset.filter(content_type=normalized_type, content_id=content_id)
            print(f"Filtered queryset count: {queryset.count()}")
        
        return queryset
    
    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print("Error type:", type(e))
            print("Error message:", str(e))
            raise

class DocumentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

IMPORT_CONFIGS = {
    'expense': {
        'model': Expense,
        'serializer': ExpenseSerializer,
        'required_fields': ['title', 'date', 'amount', 'category'],
        'optional_fields': [],
        'related_data': {
            'category': {'model': Category, 'lookup_field': 'title'}
        }
    },
    'invoice': {
        'model': Invoice,
        'serializer': InvoiceSerializer,
        'required_fields': ['date', 'amount', 'expense'],
        'optional_fields': ['invoice_number'],
        'related_data': {
            'expense': {'model': Expense, 'lookup_field': 'title', 'user_filter': True}
        }
    },
    'receipt': {
        'model': Receipt,
        'serializer': ReceiptSerializer,
        'required_fields': ['date', 'amount', 'invoice'],
        'optional_fields': ['receipt_number'],
        'related_data': {
            'invoice': {'model': Invoice, 'lookup_field': 'invoice_number', 'user_filter': True}
        }
    }
}

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def preview_excel_import(request):

    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    entity_type = request.data.get('entity_type', 'expense')
    if entity_type not in IMPORT_CONFIGS:
        return Response({'error': 'Invalid entity type'}, status=status.HTTP_400_BAD_REQUEST)
    
    excel_file = request.FILES['file']
    config = IMPORT_CONFIGS[entity_type]
    
    # Validate file type
    if not excel_file.name.endswith(('.xlsx', '.xls')):
        return Response({'error': 'File must be Excel format (.xlsx or .xls)'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Save temporarily to read with pandas
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp_file:
            for chunk in excel_file.chunks():
                tmp_file.write(chunk)
            tmp_file_path = tmp_file.name
        
        # Read Excel file
        df = pd.read_excel(tmp_file_path)
        
        # Clean up temp file
        os.unlink(tmp_file_path)
        
        # Get column names for mapping
        columns = df.columns.tolist()
        
        # Convert first 10 rows to preview data
        preview_data = df.head(10).fillna('').to_dict('records')
        
        # Get related data for dropdowns based on entity type
        related_data = {}
        for field, field_config in config.get('related_data', {}).items():
            model = field_config['model']
            if field_config.get('user_filter') and hasattr(model, 'objects'):
                if entity_type == 'invoice':
                    related_data[field] = list(model.objects.filter(user=request.user).amounts('id', 'title'))
                elif entity_type == 'receipt':
                    related_data[field] = list(model.objects.filter(invoice__expense__user=request.user).amounts('id', 'invoice_number'))
            else:
                related_data[field] = list(model.objects.amounts('id', field_config['lookup_field']))
        
        return Response({
            'entity_type': entity_type,
            'columns': columns,
            'preview_data': preview_data,
            'total_rows': len(df),
            'required_fields': config['required_fields'],
            'optional_fields': config['optional_fields'],
            'related_data': related_data,
            'file_name': excel_file.name
        })
        
    except Exception as e:
        return Response({'error': f'Error reading Excel file: {str(e)}'}, 
                       status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def import_excel_data(request):

    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    excel_file = request.FILES['file']
    
    column_mapping_str = request.data.get('column_mapping', '{}')
    try:
        if isinstance(column_mapping_str, str):
            import json
            column_mapping = json.loads(column_mapping_str)
        else:
            column_mapping = column_mapping_str
    except json.JSONDecodeError:
        return Response({'error': 'Invalid column mapping format'}, status=status.HTTP_400_BAD_REQUEST)


    entity_type = request.data.get('entity_type', 'expense')
    
    if entity_type not in IMPORT_CONFIGS:
        return Response({'error': 'Invalid entity type'}, status=status.HTTP_400_BAD_REQUEST)
    
    config = IMPORT_CONFIGS[entity_type]
    
    # Validate required field mappings
    for field in config['required_fields']:
        if field not in column_mapping or not column_mapping[field]:
            return Response({'error': f'Column mapping required for field: {field}'}, 
                           status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp_file:
            for chunk in excel_file.chunks():
                tmp_file.write(chunk)
            tmp_file_path = tmp_file.name
        
        # Read Excel file
        df = pd.read_excel(tmp_file_path)
        
        # Store original file as Document
        document = Document.objects.create(
            file_name=excel_file.name,
            file_path=excel_file,
            file_size=excel_file.size,
            mime_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            content_type='import',
            content_id=0,
            user=request.user,
            description=f'{entity_type.title()} import: {excel_file.name}'
        )
        
        created_items = []
        errors = []
        
        created_categories = []
        created_categories_in_session = {}
        category_last_id = 0
        rand_color = lambda: random.randint(0,255)
        
        with transaction.atomic():
            for index, row in df.iterrows():
                try:
                    # Extract data using column mapping
                    item_data = {}
                    
                    # Process all mapped columns
                    all_fields = config['required_fields'] + config['optional_fields']
                    for field in all_fields:
                        excel_column = column_mapping.get(field)
                        if excel_column and excel_column in row:
                            amount = row[excel_column]
                            
                            # Handle different field types
                            if field in ['date']:
                                if pd.isna(amount):
                                    item_data[field] = None
                                else:
                                    item_data[field] = pd.to_datetime(amount).date()
                            elif field in ['amount']:
                                item_data[field] = float(amount) if not pd.isna(amount) else 0
                            elif field in config.get('related_data', {}):
                                # Handle foreign key relationships
                                field_config = config['related_data'][field]
                                if isinstance(amount, (int, float)) and not pd.isna(amount):
                                    item_data[field] = int(amount)
                                else:
                                    # Try to find by lookup field
                                    lookup_amount = str(amount).strip()
                                    model = field_config['model']
                                    lookup_field = field_config['lookup_field']

                                    if field == 'category' and model == Category:
                                        related_obj = model.objects.filter(
                                            **{f'{lookup_field}__iexact': lookup_amount}
                                        ).first()
                                        
                                        if not related_obj:
                                            # Check if we already created this category in this import session
                                            if lookup_amount.lower() in created_categories_in_session:
                                                related_obj = created_categories_in_session[lookup_amount.lower()]
                                                print(f"Using category created earlier in this session: {lookup_amount}")
                                            else:
                                                # Create new category
                                                try:
                                                    if category_last_id == 0:
                                                        category_last_id = Category.objects.last().id
                                                    
                                                    related_obj = Category.objects.create(
                                                        id= (category_last_id + 1),
                                                        title=lookup_amount,
                                                        color='#%02X%02X%02X' % (rand_color(),rand_color(),rand_color()),
                                                        priority=999
                                                    )
                                                    
                                                    category_last_id += 1
                                                    created_categories_in_session[lookup_amount.lower()] = related_obj
                                                    created_categories.append(lookup_amount)
                                                    print(f"Created new category: {lookup_amount} with ID: {related_obj.id}")
                                                except Exception as e:
                                                    print(f"Error creating category '{lookup_amount}': {e}")
                                                    raise
                                    else:
                                        if field_config.get('user_filter'):
                                            if entity_type == 'invoice':
                                                related_obj = model.objects.filter(
                                                    user=request.user, 
                                                    **{f'{lookup_field}__iexact': lookup_amount}
                                                ).first()
                                            elif entity_type == 'receipt':
                                                related_obj = model.objects.filter(
                                                    expense__user=request.user,
                                                    **{f'{lookup_field}__iexact': lookup_amount}
                                                ).first()
                                        else:
                                            related_obj = model.objects.filter(
                                                **{f'{lookup_field}__iexact': lookup_amount}
                                            ).first()
                                    
                                    if related_obj:
                                        item_data[field] = related_obj.id
                                    else:
                                        raise ValueError(f'{field.title()} not found: {amount}')
                            else:
                                item_data[field] = str(amount) if not pd.isna(amount) else ''
                    
                    serializer = config['serializer'](data=item_data)
                    if serializer.is_valid():
                        if entity_type == 'expense':
                            item = serializer.save(user=request.user)  # Only set user here
                        else:
                            item = serializer.save()
                        
                        created_items.append({
                            'id': item.id,
                            'data': serializer.data
                        })
                    else:
                        errors.append({
                            'row': index + 2,
                            'errors': serializer.errors
                        })
                        
                except Exception as e:
                    errors.append({
                        'row': index + 2,
                        'errors': {'general': [str(e)]}
                    })
        
        # Clean up temp file
        os.unlink(tmp_file_path)
        
        return Response({
            'success': True,
            'entity_type': entity_type,
            'created_count': len(created_items),
            'error_count': len(errors),
            'created_items': created_items,
            'created_categories': created_categories,
            'errors': errors,
            'document_id': document.id
        })
        
    except Exception as e:
        return Response({'error': f'Import failed: {str(e)}'}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_import_template(request):

    entity_type = request.GET.get('entity_type', 'expense')
    if entity_type not in IMPORT_CONFIGS:
        return Response({'error': 'Invalid entity type'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create template data based on entity type
    template_data = {}
    
    if entity_type == 'expense':
        template_data = {
            'Title': ['Office Supplies', 'Business Lunch', 'Software License'],
            'Date': ['2025-01-15', '2025-01-16', '2025-01-17'],
            'Invoice_ID': [1, 2, 3],
            'Amount': [25.50, 45.00, 199.99],
            'Category_Name': ['Office', 'Meals', 'Software']
        }
    elif entity_type == 'invoice':
        template_data = {
            'Date': ['2025-01-15', '2025-01-16', '2025-01-17'],
            'Amount': [1000.00, 500.00, 750.00],
            'Expense_Title': ['Office Supplies', 'Business Lunch', 'Software License'],
            'Invoice_Number': ['INV-001', 'INV-002', 'INV-003']
        }
    elif entity_type == 'receipt':
        template_data = {
            'Date': ['2025-01-20', '2025-01-21', '2025-01-22'],
            'Amount': [1000.00, 500.00, 750.00],
            'Parent_Id': [1, 2, 3],
            'Parent_Type': ['expense','expense','invoice'],
            'Receipt_Number': ['REC-001', 'REC-002', 'REC-003']
        }
    
    df = pd.DataFrame(template_data)
    
    # Create Excel file in memory
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=entity_type.title() + 's', index=False)
        
        # Add instructions sheet
        config = IMPORT_CONFIGS[entity_type]
        instructions_data = {
            'Field': config['required_fields'] + config['optional_fields'],
            'Required': ['Yes'] * len(config['required_fields']) + ['No'] * len(config['optional_fields']),
            'Description': [f'{field.replace("_", " ").title()} field' for field in config['required_fields'] + config['optional_fields']]
        }
        
        instructions = pd.DataFrame(instructions_data)
        instructions.to_excel(writer, sheet_name='Instructions', index=False)
    
    output.seek(0)
    
    response = HttpResponse(
        output.getamount(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{entity_type}_import_template.xlsx"'
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activities(request):
    user = request.user
    limit = int(request.GET.get('limit', 20))
    
    recent_invoices = Invoice.objects.filter(user=user).select_related('category').order_by('-created_at')[:limit//3]
    recent_expenses = Expense.objects.filter(user=user).select_related('category').order_by('-created_at')[:limit//3]
    recent_receipts = Receipt.objects.filter(expense__user=user).select_related('expense__category', 'invoice__category').order_by('-created_at')[:limit//3]
    
    activities = []
    
    for invoice in recent_invoices:
        activities.append({
            'id': invoice.id,
            'type': 'invoice',
            'title': invoice.title,
            'date': invoice.date,
            'amount': invoice.amount,
            'category': invoice.category.title if invoice.category else None,
            'category_color': invoice.category.color if invoice.category else None
        })
    
    for expense in recent_expenses:
        activities.append({
            'id': expense.id,
            'type': 'expense', 
            'title': expense.title,
            'date': expense.date,
            'amount': expense.amount,
            'category': expense.category.title if expense.category else None,
            'category_color': expense.category.color if expense.category else None
        })
    
    for receipt in recent_receipts:
        # Get category from expense or invoice
        category = None
        if receipt.expense and receipt.expense.invoice:
            category = receipt.expense.invoice.category.title
        elif receipt.invoice:
            category = receipt.invoice.category.title
            
        activities.append({
            'id': receipt.id,
            'type': 'receipt',
            'title': f"Receipt #{receipt.receipt_number or receipt.id}",
            'date': receipt.date,
            'amount': receipt.amount,
            'category': category,
        })
    
    # Sort by date (most recent first) and limit results
    activities.sort(key=lambda x: x['date'], reverse=True)
    return Response(activities[:limit])

def month_range(start_date: date, end_date: date):
    """Return list of date objects at first day of each month from start_date to end_date (inclusive)."""
    months = []
    cur = date(start_date.year, start_date.month, 1)
    last = date(end_date.year, end_date.month, 1)
    while cur <= last:
        months.append(cur)
        if cur.month == 12:
            cur = date(cur.year + 1, 1, 1)
        else:
            cur = date(cur.year, cur.month + 1, 1)
    return months

def _to_date(d):
    """Safe conversion: if d is datetime -> return date(); if already date -> return unchanged."""
    return d.date() if hasattr(d, "date") else d

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def expenses_over_time(request):
    user = request.user
    granularity = request.GET.get('granularity', 'year')
    period = request.GET.get('period')  # e.g. "2025", "2025-09", "2025-W38"

    queryset = Expense.objects.filter(user=user)

    if granularity == "year":
        # Expect period like "2025"
        year = int(period) if period else timezone.now().year
        start = date(year, 1, 1)
        end = date(year, 12, 31)
        queryset = queryset.filter(date__range=[start, end])
        queryset = queryset.annotate(period=TruncMonth("date"))

    elif granularity == "month":
        # Expect period like "2025-09"
        if period:
            try:
                year, month = map(int, period.split("-"))
            except ValueError:
                year, month = timezone.now().year, timezone.now().month
        else:
            year, month = timezone.now().year, timezone.now().month

        start = date(year, month, 1)
        end = (start + relativedelta(months=1)) - timedelta(days=1)
        queryset = queryset.filter(date__range=[start, end])
        queryset = queryset.annotate(period=TruncWeek("date"))

    elif granularity == "week":
        # Expect period like "2025-W38"
        if period:
            try:
                year, week = period.replace("W", "").split("-")
                year, week = int(year), int(week)
            except ValueError:
                today = timezone.now().date()
                year, week = today.isocalendar()[0], today.isocalendar()[1]
        else:
            today = timezone.now().date()
            year, week = today.isocalendar()[0], today.isocalendar()[1]

        # First day of week (Monday)
        week_start = datetime.strptime(f"{year}-W{week}-1", "%G-W%V-%u").date()
        week_end = week_start + timedelta(days=6)
        queryset = queryset.filter(date__range=[week_start, week_end])
        queryset = queryset.annotate(period=TruncDay("date"))

    # Aggregate
    expenses_by_period = (
        queryset.values("period")
        .annotate(total=Sum("amount"))
        .order_by("period")
    )

    formatted_data = [
        {
            "period": item["period"].isoformat() if item["period"] else None,
            "total": float(item["total"]) if item["total"] else 0,
        }
        for item in expenses_by_period
    ]

    return Response(formatted_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def expenses_by_category(request):
    user = request.user
    date_range = request.GET.get('date_range', 'all')
    
    queryset = Expense.objects.filter(user=user)
    today = timezone.now().date()
    
    # Apply date range filtering
    if date_range == 'last-month':
        first_of_this_month = today.replace(day=1)
        last_month_end = first_of_this_month - timedelta(days=1)
        last_month_start = last_month_end.replace(day=1)
        queryset = queryset.filter(date__range=[last_month_start, last_month_end])

    elif date_range == 'last-3-months':
        first_of_this_month = today.replace(day=1)
        three_months_ago = first_of_this_month - relativedelta(months=3)
        queryset = queryset.filter(date__gte=three_months_ago, date__lt=first_of_this_month)

    elif date_range == 'last-year':
        start_last_year = date(today.year - 1, 1, 1)
        end_last_year = date(today.year - 1, 12, 31)
        queryset = queryset.filter(date__range=[start_last_year, end_last_year])
    
    # Aggregate totals
    category_totals = queryset.values('category__title', 'category__color') \
        .annotate(total=Sum('amount')) \
        .order_by('-total')
    
    grand_total = sum(float(record['total']) for record in category_totals if record['total']) or 1
    
    treated_data = []
    for record in category_totals:
        total_amount = float(record['total']) if record['total'] else 0
        treated_data.append({
            "value": round((total_amount / grand_total) * 100, 2),
            "amount": total_amount,
            "label": record["category__title"],
            "color": record["category__color"],
        })
    
    return Response(treated_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def income_vs_expenses(request):
    user = request.user
    comparison_period = request.GET.get('comparison_period', 'last-12-months')

    today = timezone.now().date()
    start_date = None
    end_date = None

    if comparison_period == 'last-6-months':
        # start at the first day of the month 6 months ago (approx)
        approx_start = today - timedelta(days=180)
        start_date = date(approx_start.year, approx_start.month, 1)
        end_date = today
    elif comparison_period == 'last-12-months':
        approx_start = today - timedelta(days=365)
        start_date = date(approx_start.year, approx_start.month, 1)
        end_date = today
    elif comparison_period == 'current-year':
        start_date = date(today.year, 1, 1)
        end_date = date(today.year, 12, 31)
    else:
        # no filtering (all time)
        start_date = None
        end_date = None

    expenses_q = Expense.objects.filter(user=user)
    invoices_q = Invoice.objects.filter(user=user)

    if start_date and end_date:
        expenses_q = expenses_q.filter(date__gte=start_date, date__lte=end_date)
        invoices_q = invoices_q.filter(date__gte=start_date, date__lte=end_date)
    elif start_date:
        expenses_q = expenses_q.filter(date__gte=start_date)
        invoices_q = invoices_q.filter(date__gte=start_date)

    # Aggregate by month
    expenses_by_month = (
        expenses_q.annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(expense_total=Sum('amount'))
        .order_by('month')
    )

    invoices_by_month = (
        invoices_q.annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(income_total=Sum('amount'))
        .order_by('month')
    )

    exp_map = {
        _to_date(item['month']): float(item['expense_total'] or 0) for item in expenses_by_month
    }
    inc_map = {
        _to_date(item['month']): float(item['income_total'] or 0) for item in invoices_by_month
    }

    if start_date and end_date:
        months = month_range(start_date, end_date)
    elif start_date:
        months = month_range(start_date, today)
    else:
        # fallback: use union of months present in data
        keys = set(list(exp_map.keys()) + list(inc_map.keys()))
        months = sorted(keys)

    merged = []
    for m in months:
        merged.append({
            'month': m.isoformat(),
            'expenses': exp_map.get(m, 0.0),
            'income': inc_map.get(m, 0.0),
        })

    return Response({
        'data': merged,
        'period': comparison_period
    })
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_overview(request):
    user = request.user
    today = timezone.now().date()

    # --- Period boundaries ---
    current_month_start = today.replace(day=1)
    last_month_end = current_month_start - timedelta(days=1)
    last_month_start = last_month_end.replace(day=1)

    # --- Queries ---
    expenses_qs = Expense.objects.filter(user=user)
    invoices_qs = Invoice.objects.filter(user=user)

    # Current month aggregates
    expenses_current = (
        expenses_qs.filter(date__gte=current_month_start, date__lte=today)
        .aggregate(expense_total=Sum('amount'))
    )['expense_total'] or 0

    invoices_current = (
        invoices_qs.filter(date__gte=current_month_start, date__lte=today)
        .aggregate(
            income_total=Sum('amount'),
            total_invoices=Count('id')
        )
    )
    income_current = invoices_current['income_total'] or 0
    total_invoices_current = invoices_current['total_invoices'] or 0

    # Last month aggregates
    expenses_last = (
        expenses_qs.filter(date__gte=last_month_start, date__lte=last_month_end)
        .aggregate(expense_total=Sum('amount'))
    )['expense_total'] or 0

    income_last = (
        invoices_qs.filter(date__gte=last_month_start, date__lte=last_month_end)
        .aggregate(income_total=Sum('amount'))
    )['income_total'] or 0

    # --- Calculate trends ---
    def calc_trend(current, last):
        if last == 0:
            return 100 if current > 0 else 0
        return round(((current - last) / last) * 100, 2)

    monthly_expenses_trend = calc_trend(expenses_current, expenses_last)
    monthly_earnings_trend = calc_trend(income_current, income_last)

    # --- Pending payments ---
    pending_invoices = [inv for inv in invoices_qs if not inv.is_paid]
    pending_expenses = [
        exp for exp in expenses_qs if exp.invoice and not exp.invoice.is_paid
    ]

    pending_payments = {
        "count": len(pending_invoices) + len(pending_expenses),
        "expenses": sum(exp.amount for exp in pending_expenses),
        "invoices": sum(inv.amount - inv.total_received for inv in pending_invoices),
    }

    # --- Final formatted data ---
    formatted_data = {
        "monthlyExpenses": float(expenses_current),
        "monthlyExpensesTrend": monthly_expenses_trend,
        "totalInvoices": total_invoices_current,
        "monthlyEarnings": float(income_current),
        "monthlyEarningsTrend": monthly_earnings_trend,
        "pendingPayments": pending_payments,
    }

    return Response(formatted_data)