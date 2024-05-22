"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import Search from "@/components/search";
import { useAsync, useAsyncFn } from "@/hooks/useAsync";
import { toast } from "react-toastify";
import TagsTable from "@/components/sections/tags/tags-table";
import { addTags, getTags } from "@/services/tag.service";
import AddTag from "@/components/tags/add-tag-popup";

const useTagIds = (tags: any[]) => {
  return useMemo(() => {
    return tags.map((tag) => tag.id);
  }, [tags]);
};

const Page = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);

  const { data: response, loading } = useAsync(
    () => getTags({ page, limit: rowsPerPage }),
    [page, rowsPerPage]
  );

  const [allTags, setAllTags] = useState<any[]>([]);
  const tagIds = useTagIds((response as any)?.tags || []);

  const addTagsFn = useAsyncFn(addTags);

  useEffect(() => {
    if (response) {
      const { tags, count } = response as any;
      setAllTags(tags);
      setTotal(count);
    }
  }, [response]);

  // const tagsSelection = useSelection(tagIds);

  const handlePageChange = useCallback((event: any, value: number) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event: any) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleAddNew = (data: any) => {
    addTagsFn
      .execute(data)
      .then((res) => {
        const { tag } = res as any;
        setAllTags((pre) => [tag, ...pre]);
        toast.success("Tag Added Successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Tags</Typography>
              </Stack>
              <div>
                <AddTag loading={loading || addTagsFn.loading} onSubmit={handleAddNew} />
              </div>
            </Stack>
            <Search placeholder="Search Tags" />

            {loading && (
              <Box width={"100%"} display={"flex"} py={4} justifyContent={"center"}>
                <CircularProgress />;
              </Box>
            )}
            {!loading && (
              <TagsTable
                count={total}
                items={allTags}
                // onDeselectAll={tagsSelection.handleDeselectAll}
                // onDeselectOne={tagsSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                // onSelectAll={tagsSelection.handleSelectAll}
                // onSelectOne={tagsSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                // selected={tagsSelection.selected}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
