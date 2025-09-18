import ReceiptIcon from "@mui/icons-material/Receipt";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from '@mui/icons-material/Folder';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from 'react';
import InvoicesDatatable from '../Datatables/InvoicesDatatable';
import ReceiptsDatatable from '../Datatables/ReceiptsDatatable';

function DynamicTab({ currEl, parentId = null }) {
    // State para controlar qual tab está ativa
    const [activeTab, setActiveTab] = useState('invoices'); // Default para primeira tab

    const TabMapping = {
        "Expenses": [
            { key: "invoices", label: "Invoices", icon: <InsertDriveFileIcon /> },
            { key: "receipts", label: "Receipts", icon: <ReceiptIcon /> },
            { key: "documents", label: "Documents", icon: <FolderIcon /> },
        ],
        "Invoices": [
            { key: "receipts", label: "Receipts", icon: <ReceiptIcon /> },
            { key: "documents", label: "Documents", icon: <FolderIcon /> },
        ],
        "Receipts": [
            { key: "documents", label: "Documents", icon: <FolderIcon /> },
        ],
    };

    // Função para renderizar o conteúdo baseado na tab ativa
    const renderTabContent = () => {
        switch (activeTab) {
            case 'invoices':
                return <InvoicesDatatable expenseId={parentId} showAddButton={true} />;
            case 'receipts':
                return <ReceiptsDatatable invoiceId={parentId} showAddButton={true} />;
            case 'documents':
                return <div>Documents component - Coming soon!</div>;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <Box>
            {/* Tabs Navigation */}
            <List sx={{ display: 'flex', flexDirection: 'row', py: 0 }}>
                {TabMapping[currEl].map((tab) => (
                    <ListItemButton
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        sx={{
                            color: activeTab === tab.key ? "secondary.main" : "text.primary",
                            "& .MuiListItemIcon-root": {
                                color: activeTab === tab.key ? "secondary.main" : "text.secondary"
                            },
                            "&:hover": {
                                bgcolor: "secondary.light",
                                color: "secondary.main",
                                "& .MuiListItemIcon-root": { color: "secondary.main" },
                            },
                            borderBottom: activeTab === tab.key ? 2 : 0,
                            borderColor: "secondary.main",
                            borderRadius: 0,
                            px: 3,
                            py: 1.5,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>{tab.icon}</ListItemIcon>
                        <ListItemText primary={tab.label} />
                    </ListItemButton>
                ))}
            </List>

            {/* Tab Content */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                {renderTabContent()}
            </Box>
        </Box>
    );
}

export default DynamicTab;