import React, { useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { getTags } from "@/services/tag.service";

const TagContext = React.createContext({});

function TagListProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const { data: tags, loading } = useAsync(
    () => getTags({ search, limit, page }),
    [search, limit, page]
  );

  return (
    <TagContext.Provider
      value={{
        tags: (tags as any)?.tags || [],
        loading,
        search,
        setSearch,
        page,
        setPage,
        limit,
        setLimit,
      }}
    >
      {children}
    </TagContext.Provider>
  );
}

export default TagListProvider;

export function useTagList() {
  const data = React.useContext(TagContext);

  if (!data) {
    throw new Error("useTagList must be wrapped inside provider");
  }

  return data;
}
