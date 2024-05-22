"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  styled,
} from "@mui/material";
import Search from "@/components/search";
import RespondentsTable, {
  getStatus,
  getTime,
} from "@/components/sections/respondents/customers-table";
import { useSelection } from "@/hooks/use-selection";
import { useAsync, useAsyncFn } from "@/hooks/useAsync";
import { addRespondents, getRespondents } from "@/services/respondents.service";
import AddRespondent from "@/components/respondents/add-respondent-popup";
import { CSVLink } from "react-csv";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const useRespondents = (
  respondents: any[],
  page: number,
  rowsPerPage: number
) => {
  return useMemo(() => {
    return respondents.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [respondents, page, rowsPerPage]);
};

const useRespondentIds = (respondents: any[]) => {
  return useMemo(() => {
    return respondents.map((respondent) => respondent.id);
  }, [respondents]);
};

const useCsvData = (respondents: any[]) => {
  return useMemo(() => {
    const headers = ["Email", "Status", "Last Action Date"];
    const data = respondents.map((res) => {
      const status = getStatus(res);
      const time = getTime(res);
      return [res.email, status.status, time];
    });

    return [headers, ...data];
  }, [respondents]);
};

const Page = ({ params }: { params: { surveyId: string } }) => {
  const {data}= useSession();
  const { data: response } = useAsync(() => getRespondents(params.surveyId));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allRespondents, setAllRespondents] = useState<any[]>([]);
  const respondents = useRespondents(allRespondents, page, rowsPerPage);
  const respondentsIds = useRespondentIds(respondents);

  const addRespondentFn = useAsyncFn(addRespondents);

  const csvData = useCsvData(allRespondents);

  useEffect(() => {
    if (response) {
      setAllRespondents((response as any).respondents);
    }
  }, [response]);

  const respondentsSelection = useSelection(respondentsIds);

  const handlePageChange = useCallback((event: any, value: number) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event: any) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleAddRespondents = async (data: any) => {
    try {
      const {respondents: newRes} = await addRespondentFn.execute(data) as any;
      const combinedArray = Array.from(new Set([...newRes, ...allRespondents].map(obj => obj.id))).map(id => {
        return [...newRes, ...allRespondents].find(obj => obj.id === id);
      });
      setAllRespondents(combinedArray)
      toast.success("Respondent/s Added Successfully")
    } catch (err:any) {
      toast.warning(err?.msg || err.message || "Something went wrong")
    }
  };

  const handleAddNew = async (email: string) => {
    const formData = new FormData();
    formData.append("surveyId", params.surveyId);
    formData.append("email", email);
    await handleAddRespondents(formData);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const formData = new FormData();
      formData.append("surveyId", params.surveyId);
      formData.append("emails", event.target.files[0]);
      await handleAddRespondents(formData);
    }
  };

  if(!data?.user.emailVerified){
    return (
      <Box height={'auto'} width={'auto'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Typography variant='subtitle1'>Ooops, Your Email is not verified!!!</Typography>
      </Box>
    )
  }

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
                <Typography variant="h4">Respondents</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    component="label"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                    <VisuallyHiddenInput
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <CSVLink style={{all: 'unset'}} filename='RespondentList' data={csvData}>
                    <Button
                      color="inherit"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <ArrowDownOnSquareIcon />
                        </SvgIcon>
                      }
                    >
                      Export
                    </Button>
                  </CSVLink>
                </Stack>
              </Stack>
              <div>
                <AddRespondent onSubmit={handleAddNew} />
              </div>
            </Stack>
            <Search placeholder="Search Respondent" />
            <RespondentsTable
              count={allRespondents.length}
              items={respondents}
              onDeselectAll={respondentsSelection.handleDeselectAll}
              onDeselectOne={respondentsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={respondentsSelection.handleSelectAll}
              onSelectOne={respondentsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={respondentsSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
