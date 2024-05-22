"use client";
import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import ArrowDownTrayIcon from "@heroicons/react/24/solid/ArrowDownTrayIcon";
import ArchiveIcon from "@mui/icons-material/Archive";
import { Avatar, Box, Button, Card, CardContent, ClickAwayListener, Divider, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Stack, SvgIcon, Typography, } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAsyncFn } from "@/hooks/useAsync";
import { duplicateSurvey } from "@/services/survey.service";
import { toast } from "react-toastify";
import LibraryQuestionModal from "./library-question-modal";

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
}

function LibrarySurveyCard({
    survey,
    varient,
}: ISurveyCardProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const duplicateSurveyFn = useAsyncFn(duplicateSurvey);

    const [viewInfo, setViewInfo] = useState(false)
    const handleOpenModal = () => setViewInfo(true);
    const handleCloseModal = () => setViewInfo(false);

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

    async function handleDuplicate() {
        setOpen(false)
        duplicateSurveyFn
            .execute(survey.id)
            .then((res: any) => {
                router.push(`survey/edit/${res?.survey.id}`);
            })
            .catch((err) => {
                toast.warning(err?.msg || err.message || "Something went wrong");
            })
    }

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: varient === "CARD" ? "column" : "row",
                height: "100%",
            }}
        >
            <LibraryQuestionModal open={viewInfo} handleClose={handleCloseModal} survey={survey} />
            <Box component={"div"} sx={{ cursor: "pointer" }} onClick={handleOpenModal}>
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
                        <Avatar variant='circular' >{survey.title.charAt(0)}</Avatar>
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
                    <>
                        <Button onClick={handleOpenModal}>
                            <Stack alignItems="center" direction="row" spacing={1}>
                                <SvgIcon color="action" fontSize="small">
                                    <InformationCircleIcon />
                                </SvgIcon>
                                <Typography
                                    color="text.secondary"
                                    display="inline"
                                    variant="body2"
                                >
                                    View
                                </Typography>
                            </Stack>
                        </Button>
                        <Button onClick={handleDuplicate}>
                            <Stack alignItems="center" direction="row" spacing={1}>
                                <SvgIcon color="action" fontSize="small">
                                    <ArrowDownTrayIcon />
                                </SvgIcon>
                                <Typography
                                    color="text.secondary"
                                    display="inline"
                                    variant="body2"
                                >
                                    Import
                                </Typography>
                            </Stack>
                        </Button>
                    </>
                )}
                {varient === "TILE" && (
                    <>
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
                                                <MenuItem onClick={handleOpenModal} disableRipple>
                                                    <Stack
                                                        alignItems="center"
                                                        direction="row"
                                                        spacing={1}
                                                    >
                                                        <SvgIcon color="action" fontSize="small">
                                                            <InformationCircleIcon />
                                                        </SvgIcon>
                                                        <Typography
                                                            color="text.secondary"
                                                            display="inline"
                                                            variant="body2"
                                                        >
                                                            View
                                                        </Typography>
                                                    </Stack>
                                                </MenuItem>
                                                <MenuItem onClick={handleDuplicate} disableRipple>
                                                    <Stack
                                                        alignItems="center"
                                                        direction="row"
                                                        spacing={1}
                                                    >
                                                        <SvgIcon color="action" fontSize="small">
                                                            <ArrowDownTrayIcon />
                                                        </SvgIcon>
                                                        <Typography
                                                            color="text.secondary"
                                                            display="inline"
                                                            variant="body2"
                                                        >
                                                            Import
                                                        </Typography>
                                                    </Stack>
                                                </MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </>
                )}
            </Stack>
        </Card>
    );
}

export default LibrarySurveyCard;
