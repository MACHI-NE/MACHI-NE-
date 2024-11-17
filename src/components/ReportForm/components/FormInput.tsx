import React from 'react';

interface FormInputProps {
    id: string;
    name: string;
    label: string;
    type?: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    options?: { value: string; label: string; }[];
    className?: string;
    isTextArea?: boolean;
    containerClassName?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    id,
    name,
    label,
    type = 'text',
    value,
    placeholder,
    required = false,
    onChange,
    options,
    className = '',
    isTextArea = false,
    containerClassName = ''
}) => {
    const inputClasses = `form-input ${className}`;

    return (
        <div className={`form-field ${containerClassName || ''}`}>
            <label htmlFor={id} className="form-label">{label}</label>
            {isTextArea ? (
                <textarea
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    className={`${inputClasses} resize-none h-full`}
                    onChange={onChange}
                    value={value}
                    required={required}
                />
            ) : options ? (
                <select
                    id={id}
                    name={name}
                    className={inputClasses}
                    onChange={onChange}
                    value={value}
                    required={required}
                >
                    {options.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            ) : (
                <input
                    id={id}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    className={inputClasses}
                    onChange={onChange}
                    value={value}
                    required={required}
                />
            )}
        </div>
    );
};