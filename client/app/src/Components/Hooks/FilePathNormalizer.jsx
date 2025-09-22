export const normalizeFile = ({ file_path }) => {

    let filePath = file_path;

    if (filePath.startsWith("/expenses/view/")) {
        filePath = filePath.replace("/expenses/view", "");
    }

    return `${window.location.origin}/${filePath}`;
}