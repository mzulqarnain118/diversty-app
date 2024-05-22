import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SvgIcon,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

function AddTag({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (data: { title: string; description: string }) => void;
}) {
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      submit: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Title is required"),
    }),
    onSubmit: async (values, helpers) => {
      const { title, description } = values;
      onSubmit && onSubmit({ title, description });
    },
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        disabled={loading}
        onClick={handleClickOpen}
        startIcon={
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        }
        variant="contained"
      >
        Add
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            formik.handleSubmit(event);
            handleClose();
          },
        }}
      >
        <DialogTitle>Add Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add new Tag, please enter Tag title and description
          </DialogContentText>
          <TextField
            error={!!(formik.touched.title && formik.errors.title)}
            fullWidth
            autoFocus
            margin="dense"
            variant="standard"
            label="Tag Title"
            name="title"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            value={formik.values.title}
          />
          <TextField
            error={!!(formik.touched.description && formik.errors.description)}
            fullWidth
            autoFocus
            margin="dense"
            variant="standard"
            label="Tag Description"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            value={formik.values.description}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>Cancel</Button>
          <Button disabled={loading} type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddTag;
