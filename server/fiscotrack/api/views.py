from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.shortcuts import render
from .models import Invoice,Receipt,Category,Expense,Document
from .serializer import InvoiceSerializer,ReceiptSerializer,CategorySerializer,ExpenseSerializer, UserSerializer
import os
import tempfile
import pandas as pd
import json
from django.db import transaction

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
        queryset = Invoice.objects.filter(expense__user=user)\
                                 .select_related('expense__category')
        
        expense_id = self.request.query_params.get('expense_id', None)
        if expense_id:
            queryset = queryset.filter(expense_id=expense_id)
           
        return queryset
   
    def perform_create(self, serializer):
        serializer.save()

class InvoiceDelete(generics.DestroyAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Invoice.objects.filter(expense__user= user)


class ExpenseListCreate(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Expense.objects.filter(user=user)
    
    def perform_create(self, serializer):
        print("Request data:", self.request.data)
        print("Serializer validated data:", serializer.validated_data)
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print("Error type:", type(e))
            print("Error message:", str(e))
            raise

class ReceiptListCreate(generics.ListCreateAPIView):
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Join: Receipt -> Invoice -> Expense -> User
        queryset = Receipt.objects.filter(invoice__expense__user=user)
        
        # Filtros opcionais
        invoice_id = self.request.query_params.get('invoice_id', None)
        if invoice_id:
            queryset = queryset.filter(invoice_id=invoice_id)
            
        expense_id = self.request.query_params.get('expense_id', None)
        if expense_id:
            queryset = queryset.filter(invoice__expense_id=expense_id)
            
        return queryset
   
    def perform_create(self, serializer):
        print("Request data:", self.request.data)
        print("Serializer validated data:", serializer.validated_data)
        try:
            serializer.save()
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



class InvoiceDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Invoice.objects.filter(expense__user=self.request.user)


class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class ReceiptDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Receipt.objects.filter(expense__invoice__user=self.request.user)


IMPORT_CONFIGS = {
    'expense': {
        'model': Expense,
        'serializer': ExpenseSerializer,
        'required_fields': ['title', 'date', 'value', 'category'],
        'optional_fields': [],
        'related_data': {
            'category': {'model': Category, 'lookup_field': 'title'}
        }
    },
    'invoice': {
        'model': Invoice,
        'serializer': InvoiceSerializer,
        'required_fields': ['date', 'value', 'expense'],
        'optional_fields': ['invoice_number'],
        'related_data': {
            'expense': {'model': Expense, 'lookup_field': 'title', 'user_filter': True}
        }
    },
    'receipt': {
        'model': Receipt,
        'serializer': ReceiptSerializer,
        'required_fields': ['date', 'value', 'invoice'],
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
                    related_data[field] = list(model.objects.filter(user=request.user).values('id', 'title'))
                elif entity_type == 'receipt':
                    related_data[field] = list(model.objects.filter(expense__user=request.user).values('id', 'invoice_number'))
            else:
                related_data[field] = list(model.objects.values('id', field_config['lookup_field']))
        
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
                            value = row[excel_column]
                            
                            # Handle different field types
                            if field in ['date']:
                                if pd.isna(value):
                                    item_data[field] = None
                                else:
                                    item_data[field] = pd.to_datetime(value).date()
                            elif field in ['value']:
                                item_data[field] = float(value) if not pd.isna(value) else 0
                            elif field in config.get('related_data', {}):
                                # Handle foreign key relationships
                                field_config = config['related_data'][field]
                                if isinstance(value, (int, float)) and not pd.isna(value):
                                    item_data[field] = int(value)
                                else:
                                    # Try to find by lookup field
                                    lookup_value = str(value).strip()
                                    model = field_config['model']
                                    lookup_field = field_config['lookup_field']
                                    
                                    if field_config.get('user_filter'):
                                        if entity_type == 'invoice':
                                            related_obj = model.objects.filter(
                                                user=request.user, 
                                                **{f'{lookup_field}__iexact': lookup_value}
                                            ).first()
                                        elif entity_type == 'receipt':
                                            related_obj = model.objects.filter(
                                                expense__user=request.user,
                                                **{f'{lookup_field}__iexact': lookup_value}
                                            ).first()
                                    else:
                                        related_obj = model.objects.filter(
                                            **{f'{lookup_field}__iexact': lookup_value}
                                        ).first()
                                    
                                    if related_obj:
                                        item_data[field] = related_obj.id
                                    else:
                                        raise ValueError(f'{field.title()} not found: {value}')
                            else:
                                item_data[field] = str(value) if not pd.isna(value) else ''
                    
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
            'errors': errors,
            'document_id': document.id
        })
        
    except Exception as e:
        return Response({'error': f'Import failed: {str(e)}'}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_import_template(request):
    import io
    from django.http import HttpResponse
    
    entity_type = request.GET.get('entity_type', 'expense')
    if entity_type not in IMPORT_CONFIGS:
        return Response({'error': 'Invalid entity type'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create template data based on entity type
    template_data = {}
    
    if entity_type == 'expense':
        template_data = {
            'Title': ['Office Supplies', 'Business Lunch', 'Software License'],
            'Date': ['2025-01-15', '2025-01-16', '2025-01-17'],
            'Value': [25.50, 45.00, 199.99],
            'Category_ID': [1, 2, 3],
            'Category_Name': ['Office', 'Meals', 'Software']
        }
    elif entity_type == 'invoice':
        template_data = {
            'Date': ['2025-01-15', '2025-01-16', '2025-01-17'],
            'Value': [1000.00, 500.00, 750.00],
            'Expense_ID': [1, 2, 3],
            'Expense_Title': ['Office Supplies', 'Business Lunch', 'Software License'],
            'Invoice_Number': ['INV-001', 'INV-002', 'INV-003']
        }
    elif entity_type == 'receipt':
        template_data = {
            'Date': ['2025-01-20', '2025-01-21', '2025-01-22'],
            'Value': [1000.00, 500.00, 750.00],
            'Invoice_ID': [1, 2, 3],
            'Invoice_Number': ['INV-001', 'INV-002', 'INV-003'],
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
        output.getvalue(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{entity_type}_import_template.xlsx"'
    
    return response