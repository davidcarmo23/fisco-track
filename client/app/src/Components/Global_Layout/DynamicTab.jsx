import ReceiptIcon from "@mui/icons-material/Receipt";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from '@mui/icons-material/Folder';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";


function DynamicTab({ currEl }) {

    const TabMapping = {
        "Expenses": [
            { to: "/invoices", label: "Invoices", icon: <InsertDriveFileIcon /> },
            { to: "/receipts", label: "Receipts", icon: <ReceiptIcon /> },
            { to: "/documents", label: "Documents", icon: <FolderIcon /> },
        ],
        "Invoices": [
            { to: "/receipts", label: "Receipts", icon: <ReceiptIcon /> },
            { to: "/documents", label: "Documents", icon: <FolderIcon /> },
        ],
        "Receipts": [
            { to: "/documents", label: "Documents", icon: <FolderIcon /> },
        ],
    };

    return (
        <Box>
            <List>
                {TabMapping[currEl].map((link) => (
                    <ListItemButton
                        key={link.to}
                        component={NavLink}
                        to={link.to}
                        sx={{
                            color: "common.white",
                            "& .MuiListItemIcon-root": { color: "common.white" },
                            "&:hover": {
                                bgcolor: "secondary.main",
                                color: "common.white",
                                "& .MuiListItemIcon-root": { color: "common.white" },
                            },
                            "&.active": {
                                bgcolor: "secondary.main",
                                color: "common.white",
                                "& .MuiListItemIcon-root": { color: "common.white" },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>{link.icon}</ListItemIcon>
                        <ListItemText primary={link.label} />
                    </ListItemButton>

                ))}
            </List>
        </Box>
    );
}

export default DynamicTab;