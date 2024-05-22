import { useCallback, useEffect, useState } from 'react';

export function useAsync<T>(
    func: (...args: any[]) => Promise<T>,
    dependencies: any[] = []
) {
    const { execute, ...state } = useAsyncInternal(func, dependencies, true);

    useEffect(() => {
        execute();
    }, [execute]);

    return state;
}

export function useAsyncFn<T>(
    func: (...args: any[]) => Promise<T>,
    dependencies: any[] = []
) {
    return useAsyncInternal(func, dependencies, false);
}

function useAsyncInternal<T>(
    func: (...args: any[]) => Promise<T>,
    dependencies: any[],
    initialLoading = false
) {
    const [loading, setLoading] = useState<boolean>(initialLoading);
    const [error, setError] = useState<any>();
    const [data, setData] = useState<T | undefined>();

    const execute = useCallback((...params: any[]) => {
        setLoading(true);
        return func(...params)
            .then((res) => {
                setData(res as any);
                setError(undefined);
                return res;
            })
            .catch((error) => {
                setError(error);
                setData(undefined);
                return Promise.reject(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, dependencies);

    return { loading, error, data, execute };
}
