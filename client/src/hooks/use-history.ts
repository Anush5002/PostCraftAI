import { useQuery } from "@tanstack/react-query";

export function useHistory() {
    return useQuery({
        queryKey: ['history'],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/history", {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });
            if (!res.ok) throw new Error("Failed to fetch history");
            return res.json();
        }
    });
}
