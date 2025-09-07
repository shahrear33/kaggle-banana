"use client"
import React from 'react';
import Select from 'react-select';

const customStyles = {
  control: (styles) => ({ 
    ...styles, 
    backgroundColor: 'white',
    borderColor: '#e2e8f0',
    '&:hover': {
      borderColor: '#cbd5e1'
    }
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isDisabled
      ? undefined
      : isSelected
      ? '#4f46e5'
      : isFocused
      ? '#f3f4f6'
      : undefined,
    color: isDisabled
      ? '#9ca3af'
      : isSelected
      ? 'white'
      : 'black',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    ':active': {
      ...styles[':active'],
      backgroundColor: !isDisabled && (isSelected ? '#4f46e5' : '#e5e7eb'),
    },
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: '#f3f4f6',
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: '#4f46e5',
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: '#4f46e5',
    ':hover': {
      backgroundColor: '#4f46e5',
      color: 'white',
    },
  }),
};

export default function MultiSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select options...",
  isDisabled = false,
  isLoading = false,
  className = ""
}) {
  return (
    <Select
      isMulti
      options={options}
      styles={customStyles}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isLoading={isLoading}
      className={className}
      closeMenuOnSelect={false}
      classNamePrefix="select"
    />
  );
}
