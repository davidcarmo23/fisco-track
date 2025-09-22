import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { normalizeFile } from "./Hooks/FilePathNormalizer";

const FileViewer = ({ document }) => {
    
    let pathFile = normalizeFile({file_path: document.file_path_local});

    const docs = [
        {
            uri: pathFile,
            fileType: pathFile.split(".").pop()
        }
    ];

    return (
        <DocViewer
            documents={docs}
            pluginRenderers={DocViewerRenderers}
            style={{ height: "80vh", width: "100%" }}
        />
    );
};


export default FileViewer;
