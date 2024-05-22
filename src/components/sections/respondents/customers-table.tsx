import PropTypes from "prop-types";
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "@/components/scrollbar";
import SeverityPill from "@/components/SeverityPill";
import { formatDistanceToNow } from "date-fns";

export const getStatus = (respondent: any) => {
  const { isInvitationSent, isViewed, isSubmitted } = respondent;

  if (isSubmitted) {
    return { color: "success", status: "Submitted" };
  } else if (isViewed) {
    return { color: "primary", status: "Viewed" };
  } else if (isInvitationSent) {
    return { color: "info", status: "Invitation Sent" };
  } else {
    return { color: "warning", status: "Just Added" };
  }
};

export const getTime = (respondent: any) => {
  const { invitationSendDate, viewedDate, submittedDate } = respondent;

  let date,
    time = "";

  if (submittedDate) {
    date = submittedDate;
  } else if (viewedDate) {
    date = viewedDate;
  } else if (invitationSendDate) {
    date = invitationSendDate;
  }

  if (date) {
    time = formatDistanceToNow(date) + " Ago";
  }

  return time;
};

const RespondentsTable = ({
  count = 0,
  items = [],
  onDeselectAll,
  onDeselectOne,
  onPageChange = () => {},
  onRowsPerPageChange,
  onSelectAll,
  onSelectOne,
  page = 0,
  rowsPerPage = 0,
  selected = [],
}: any) => {
  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Action Time</TableCell>
                {/* <TableCell>Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((respondent: any) => {
                const isSelected = selected.includes(respondent.id);
                const time = getTime(respondent);
                const status = getStatus(respondent);

                return (
                  <TableRow hover key={respondent.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(respondent.id);
                          } else {
                            onDeselectOne?.(respondent.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {respondent.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={status.color}>
                        {status.status}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{time}</TableCell>
                    {/* <TableCell></TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

RespondentsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};

export default RespondentsTable;
