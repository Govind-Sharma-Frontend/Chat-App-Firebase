import { Box, TextField, Typography } from "@mui/material";
import { useField } from "formik";

const CustomTextField = ({required ,label,...props}) => {
  const [field, meta] = useField(props);

  return (
    <>
      <TextField
        sx={{ width: "100%" }}
        variant="standard"
        placeholder="Enter here"
        required={required}
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
