"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function FloatingInput({
  id,
  name,
  type = "text",
  label,
  required = false,
  value: controlledValue,
  onChange: controlledOnChange,
  ...props
}) {
  const [internalValue, setInternalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const onChange =
    controlledOnChange || ((e) => setInternalValue(e.target.value));

  const hasValue = value && value.length > 0;
  const isFloating = isFocused || hasValue;
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className={`peer w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-sm focus:outline-none focus:border-[#FF8D28] transition-all ${
          isPassword ? "pr-12" : ""
        }`}
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 px-1 bg-white transition-all pointer-events-none ${
          isFloating
            ? "-top-2.25 text-xs text-black"
            : "top-2 text-sm text-gray-500"
        }`}
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
    </div>
  );
}
