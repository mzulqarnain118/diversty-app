"use client";
import PropTypes from "prop-types";
import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { useAsyncFn } from "@/hooks/useAsync";
import { deleteSurvey, duplicateSurvey } from "@/services/survey.service";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const textStyles = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  textAlign: "center",
  margin: "0 auto",
  px: 2,
};

export type CardViewType = "CARD" | "TILE";

interface ISurveyCardProps {
  survey: any;
  varient: CardViewType;
  onDelete: (id: string) => void;
  onDuplicate: (survey: any) => void;
}

function SurveyCard({
  survey,
  varient,
  onDelete,
  onDuplicate,
}: ISurveyCardProps) {
  const { data } = useSession();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const confirm = useConfirm();
  const delSurveyFn = useAsyncFn(deleteSurvey);
  const duplicateSurveyFn = useAsyncFn(duplicateSurvey);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  function handleClick() {
    router.push(`survey/edit/${survey.id}`);
    setOpen(false);
  }

  function handleEdit() {
    router.push(`survey/edit/${survey.id}`);
    setOpen(false);
  }

  function handleResponce() {
    router.push(`survey/response/${survey.id}`);
    setOpen(false);
  }

  function handleRespondents() {
    router.push(`survey/respondents/${survey.id}`);
    setOpen(false);
  }

  async function handleDelte() {
    await confirm({
      description:
        "It Will delete Survey and its related All information. Do you really want to delete it?",
      confirmationButtonProps: { color: "error", variant: "contained" },
      confirmationText: "Delete",
      cancellationButtonProps: { variant: "contained" },
      dialogProps: { sx: { p: 4 } },
    });

    delSurveyFn
      .execute(survey.id)
      .then((res) => {
        onDelete && onDelete(survey.id);
      })
      .catch((err) => {
        toast.warning(err?.msg || err.message || "Something went wrong");
      })
      .finally(() => setOpen(false));
  }

  async function handleDuplicate() {
    duplicateSurveyFn
      .execute(survey.id)
      .then((res: any) => {
        onDuplicate && onDuplicate(res.survey);
      })
      .catch((err) => {
        toast.warning(err?.msg || err.message || "Something went wrong");
      })
      .finally(() => setOpen(false));
  }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: varient === "CARD" ? "column" : "row",
        height: "100%",
      }}
    >
      <Box component={"div"} onClick={handleClick} sx={{ cursor: "pointer" }}>
        <CardContent
          {...(varient === "TILE" && {
            sx: {
              display: "flex",
              alignItems: "center",
              gap: 2,
              py: 2,
              "&:last-child": { pb: 2 },
            },
          })}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              ...(varient === "CARD" && { pb: 3 }),
            }}
          >
            <Avatar variant='circular'>{survey.title.charAt(0).toUpperCase()}</Avatar>
          </Box>
          <Stack sx={{ width: "100%" }}>
            <Typography
              align="center"
              gutterBottom
              variant="h5"
              sx={{
                ...textStyles,
                ...(varient === "CARD"
                  ? { WebkitLineClamp: 2 }
                  : { fontSize: 20, m: 0, textAlign: "start" }),
              }}
            >
              {survey.title}
            </Typography>
            <Box sx={{ position: "relative" }}>
              <Typography
                sx={{
                  ...textStyles,
                  ...(varient === "CARD"
                    ? {
                        height: 125,
                        WebkitLineClamp: 3,
                      }
                    : {
                        fontSize: 12,
                        WebkitLineClamp: 2,
                        maxHeight: 40,
                        m: 0,
                        textAlign: "start",
                      }),
                  display: "flex",
                  flexWrap: "wrap",
                  "& p": { whiteSpace: "nowrap", m: 0 },
                  gap: 1,
                }}
                align="center"
                variant="body1"
              >
                {survey?.description?.replace(/<[^>]*>/g, "")}
              </Typography>
              {varient === "CARD" && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: "50px",
                    zIndex: 1,
                    background:
                      "linear-gradient(180deg,hsla(0,0%,100%,0),#fff)",
                  }}
                />
              )}
            </Box>
          </Stack>
        </CardContent>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        {varient === "CARD" && (
          <Button onClick={handleResponce} disabled={data?.user.role === "ADMIN"}>
            <Stack alignItems="center" direction="row" spacing={1}>
              <SvgIcon color="action" fontSize="small">
                <ChartBarIcon />
              </SvgIcon>
              <Typography
                color="text.secondary"
                display="inline"
                variant="body2"
              >
                Responses
              </Typography>
            </Stack>
          </Button>
        )}
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          ref={anchorRef}
        >
          <MoreVertIcon />
        </IconButton>
        <Popper
          sx={{ zIndex: 2 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper elevation={3}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={handleEdit} disableRipple>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <SvgIcon color="action" fontSize="small">
                          <PencilSquareIcon />
                        </SvgIcon>
                        <Typography
                          color="text.secondary"
                          display="inline"
                          variant="body2"
                        >
                          Edit
                        </Typography>
                      </Stack>
                    </MenuItem>
                    <MenuItem onClick={handleDelte} disableRipple>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <SvgIcon color="action" fontSize="small">
                          <DeleteIcon />
                        </SvgIcon>
                        <Typography
                          color="text.secondary"
                          display="inline"
                          variant="body2"
                        >
                          Delete
                        </Typography>
                      </Stack>
                    </MenuItem>
                    <MenuItem onClick={handleClose} disableRipple>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <SvgIcon color="action" fontSize="small">
                          <ArchiveIcon />
                        </SvgIcon>
                        <Typography
                          color="text.secondary"
                          display="inline"
                          variant="body2"
                        >
                          Archive
                        </Typography>
                      </Stack>
                    </MenuItem>
                    <MenuItem onClick={handleDuplicate} disableRipple>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <SvgIcon color="action" fontSize="small">
                          <FileCopyIcon />
                        </SvgIcon>
                        <Typography
                          color="text.secondary"
                          display="inline"
                          variant="body2"
                        >
                          Duplicate
                        </Typography>
                      </Stack>
                    </MenuItem>
                    {varient === "TILE" && data?.user.role !== "ADMIN" && (
                      <MenuItem onClick={handleResponce} disableRipple>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <SvgIcon color="action" fontSize="small">
                            <ChartBarIcon />
                          </SvgIcon>
                          <Typography
                            color="text.secondary"
                            display="inline"
                            variant="body2"
                          >
                            Responses
                          </Typography>
                        </Stack>
                      </MenuItem>
                    )}
                    {data?.user.role !== "ADMIN" && (
                      <>
                        <MenuItem onClick={handleRespondents} disableRipple>
                          <Stack
                            alignItems="center"
                            direction="row"
                            spacing={1}
                          >
                            <SvgIcon color="action" fontSize="small">
                              <FileCopyIcon />
                            </SvgIcon>
                            <Typography
                              color="text.secondary"
                              display="inline"
                              variant="body2"
                            >
                              Respondents
                            </Typography>
                          </Stack>
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Stack>
    </Card>
  );
}

SurveyCard.propTypes = {
  survey: PropTypes.object.isRequired,
};

export default SurveyCard;
