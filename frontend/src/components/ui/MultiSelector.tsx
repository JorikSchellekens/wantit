import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { Box, Chip } from '@mui/joy';

export const MultiSelector = ({options, selectedOptions, onChange}: {options: string[], selectedOptions: string[], onChange: (value: string[]) => void}) => {

  // Create options from the available categories
  const optionsTSX = options.map((option) => (
    <Option key={option} value={option}>{option}</Option>
  ));

  return (
    <Select
      multiple
      defaultValue={selectedOptions}
      value={selectedOptions}
      onChange={(event, values) => {
        onChange(values);
      }}
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', gap: '0.25rem' }}>
          {selected.map((selectedOption) => (
            <Chip key={selectedOption.value} variant="soft" color="primary">
              {selectedOption.label}
            </Chip>
          ))}
        </Box>
      )}
      sx={{
        minWidth: '15rem',
      }}
      slotProps={{
        listbox: {
          sx: {
            width: '100%',
          },
        },
      }}
    >
        {optionsTSX}
    </Select>
  );
}