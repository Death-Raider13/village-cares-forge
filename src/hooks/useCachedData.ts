export const useCachedData = (key: string, fetchFn: () => Promise<any>) => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const cached = localStorage.getItem(key);
        if (cached) {
            setData(JSON.parse(cached));
        }

        fetchFn().then(newData => {
            localStorage.setItem(key, JSON.stringify(newData));
            setData(newData);
        });
    }, [key]);

    return data;
};