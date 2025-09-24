import { useState, useEffect, useCallback } from 'react';
import api from '../../api';

export const useFilteredList = (endpoint, parentId = null, parentField = null) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const getItems = useCallback(() => {
        setLoading(true);
        let url = `/api/${endpoint}/`;

        if (parentId && parentField) {
            url += `?${parentField}=${parentId}`;
        }

        api.get(url)
            .then(res => {
                console.log(res.data)
                setItems(res.data)})
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [endpoint, parentId, parentField]);

    useEffect(() => {
        getItems();
    }, [getItems]);

    return { items, loading, refetch: getItems };
};