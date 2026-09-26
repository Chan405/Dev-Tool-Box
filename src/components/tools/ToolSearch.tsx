"use client";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

type ToolSearchProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
};

export function ToolSearch({ id = "tool-search", value, onChange }: ToolSearchProps) {
  return (
    <Box component="search" sx={{ width: "100%", maxWidth: 640 }}>
      <TextField
        id={id}
        label="Search tools"
        placeholder="Name, keyword, or category"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        fullWidth
        sx={{
          "& input::-webkit-search-decoration, & input::-webkit-search-cancel-button, & input::-webkit-search-results-button, & input::-webkit-search-results-decoration":
            {
              display: "none",
            },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton aria-label="Clear search" edge="end" size="small" onClick={() => onChange("")}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
          htmlInput: {
            autoComplete: "off",
            enterKeyHint: "search",
          },
        }}
      />
    </Box>
  );
}
