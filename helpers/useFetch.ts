import { useCallback, useEffect, useState } from "react";

const useFetch = <T>(
  fetchFunction: () => Promise<T>,
  deps: React.DependencyList = [],
  authFetch = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!fetchFunction) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      setData(result);
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error("An unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function executeRequest() {
      if (!authFetch || ignore) return;

      try {
        await fetchData();
      } catch (err) {
        if (!ignore) {
          console.error("Fetch error:", err);
        }
      }
    }

    executeRequest();

    return () => {
      ignore = true;
    };
  }, [authFetch, fetchData, ...deps]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset,
  };
};

export default useFetch;
