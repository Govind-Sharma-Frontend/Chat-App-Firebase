import { Box, TextField, Typography } from "@mui/material";
import { useField } from "formik";

const CustomTextField = ({label,...props}) => {
  const [field, meta] = useField(props);

  return (
    <>
      <TextField
        sx={{ width: "100%" }}
        variant="standard"
        placeholder="Enter here"
        label={label}
        {...field}
        {...props}
      />
      {meta?.error && (
        <Box>
          <Typography>{meta.error}</Typography>
        </Box>
      )}
    </>
  );
};

export default CustomTextField;
