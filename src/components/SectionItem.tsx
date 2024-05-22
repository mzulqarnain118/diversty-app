import React, { useState } from "react";
import _ from "lodash";

import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { deleteSection, updateSection } from "@/services/section.services";
import { useAsyncFn } from "@/hooks/useAsync";
import Tiptap from "./tiptap/Tiptap";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicator from "@mui/icons-material/DragIndicator";
import ImportQuestionDial from "./import-question-dial";
import AddSurveyItemDial from "./add-survey-item-dial";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { IQuestion, ISection } from "@/types";

interface SectionItemProps {
  section: ISection;
  idx: number;
  onDelete: (id: number) => void;
  addItem: (
    type: "QUESTION" | "SECTION",
    order: number,
    position: "ABOVE" | "BELOW"
  ) => void;
  handleMove: (direction: "UP" | "DOWN", orderNumber: number) => void;
  loading: boolean;
  handleImport: (position: "ABOVE" | "BELOW", orderNumber: number) => void;
  setList: React.Dispatch<React.SetStateAction<(IQuestion | ISection)[]>>;
}

export default function SectionItem({
  section,
  onDelete,
  addItem,
  idx,
  handleMove,
  loading,
  handleImport,
  setList,
}: SectionItemProps) {
  const { attributes, listeners, transform, setNodeRef, transition } =
    useSortable({ id: section.id });

  const updateSectionFn = useAsyncFn(updateSection);
  const deleteQuestionFn = useAsyncFn(deleteSection);
  const handleTitleTextChange = _.debounce(
    (name: string, value: string) => handleUpdateSection(name, value),
    500
  );
  function onDescriptionChange(value: string) {
    handleChange("description", value);
  }

  function updateList(s: any) {
    setList((pre) => {
      const old = pre;
      old[idx] = { ...old[idx], ...s };
      return old;
    });
  }

  const handleChange = _.debounce(
    (name: string, value: string) => handleUpdateSection(name, value),
    500
  );

  async function handleUpdateSection(name: string, value: string) {
    let data = { [name]: value };

    try {
      await updateSectionFn.execute(section.id, data);
      updateList(data);
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  function handleDelete() {
    deleteQuestionFn
      .execute(section.id)
      .then((res) => {
        onDelete(section.id);
      })
      .catch((err) => {
        toast.error(err?.msg || "Something went wrong!");
      });
  }

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <Box
        ref={setNodeRef}
        style={style}
        maxWidth={"lg"}
        width={"100%"}
        sx={{
          "& .MuiInput-root:before": {
            borderBottom: "1px solid rgba(0,0,0,0.1)",
          },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 2,
          }}
        >
          <TextField
            id="name"
            defaultValue={section.title}
            onChange={(e) => handleTitleTextChange("title", e.target.value)}
            fullWidth
            label={
              <>
                Section{" "}
                <strong>
                  {section.position} / {section.total}
                </strong>.{" "} Title
              </>
            }
          />
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, lg: 4 },
              mt: 2,
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Tiptap
              content={section.description}
              onChange={onDescriptionChange}
            />
          </Paper>
          <Stack
            spacing={2}
            direction={"row"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
            mt={2}
          >
            <Box />
            <Box display={"flex"} justifyContent="center" mt={2} gap={1}>
              {updateSectionFn.loading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    color: "rgba(0,0,0,0.5)",
                  }}
                >
                  Saving...
                </Box>
              )}
              <IconButton
                aria-label="delete"
                size="small"
                onClick={handleDelete}
                disabled={loading}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="move up"
                size="small"
                onClick={() => handleMove("UP", idx)}
                disabled={loading}
              >
                <KeyboardDoubleArrowUpIcon fontSize="small" />
              </IconButton>
              <IconButton
                disabled={loading}
                aria-label="move down"
                size="small"
                onClick={() => handleMove("DOWN", idx)}
              >
                <KeyboardDoubleArrowDownIcon fontSize="small" />
              </IconButton>
              <IconButton
                disabled={loading}
                aria-label="drag"
                size="small"
                {...attributes}
                {...listeners}
              >
                <DragIndicator fontSize="small" />
              </IconButton>
            </Box>
            <Stack direction={"row"} gap={1} flexWrap={"wrap"}>
              <ImportQuestionDial
                currentPosition={idx}
                handleImport={handleImport}
              />
              <AddSurveyItemDial currentPosition={idx} addItem={addItem} />
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
