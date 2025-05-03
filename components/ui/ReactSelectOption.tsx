"use client";

import React from "react";
import Select, { GroupBase, OptionProps, SingleValue, components } from "react-select";
import makeAnimated from "react-select/animated";
import { Icon } from "@iconify/react";
import { MultiValue, ActionMeta } from "react-select";


// Tipo de cada opção
interface OptionType {
  icon?: string; // ✅ agora é string
  value: string;
  label: string;
}

interface Props {
  value: OptionType[];
  onChange: (selectedIds: string[]) => void;
  options: OptionType[];
}


// Estilo customizado
const styles = {
  multiValue: (base: any, state: any) =>
    state.data.isFixed ? { ...base, opacity: "0.5" } : base,
  multiValueLabel: (base: any, state: any) =>
    state.data.isFixed ? { ...base, color: "#626262", paddingRight: 6 } : base,
  multiValueRemove: (base: any, state: any) =>
    state.data.isFixed ? { ...base, display: "none" } : base,
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "14px",
  }),
};

// Componente com ícone (se houver)
const OptionComponent: React.FC<
  OptionProps<OptionType, boolean, GroupBase<OptionType>>
> = (props) => {
  const { data } = props;

  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {data.icon && <Icon icon={data.icon} />}
        {data.label}
      </div>
    </components.Option>
  );
};

// Componente principal reutilizável
const ReactSelectOption: React.FC<Props> = ({ options, value, onChange }) => {

  const handleChange = (
    newValue: MultiValue<OptionType> | SingleValue<OptionType>,
    _actionMeta: ActionMeta<OptionType>
  ) => {
    if (Array.isArray(newValue)) {
      const selectedIds = newValue.map((opt) => opt.value);
      onChange(selectedIds);
    }
  };
  
  return (
    <Select
  isMulti
  isClearable={false}
  options={options}
  value={value}
  onChange={handleChange}
  placeholder="Selecione..."
  noOptionsMessage={() => "Sem opções"}
  styles={styles}
  className="react-select"
  classNamePrefix="select"
  components={{ Option: OptionComponent, ...makeAnimated() }}
/>
  );
};

export default ReactSelectOption;
