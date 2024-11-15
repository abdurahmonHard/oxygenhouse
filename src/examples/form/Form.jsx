/* eslint-disable react/prop-types */
import React, { memo } from "react";
import "./Form.css";
import { FiX, FiSave } from "react-icons/fi";

// eslint-disable-next-line react/prop-types
const Form = ({
  title,
  save,
  isOpen,
  onClose,
  children,
  width,
  isValid,
  isContract,
}) => {
  return (
    <>
      <form
        onSubmit={save}
        className={`form-container ${isOpen ? "open" : ""
          } rounded-md ${width ? `w-[${width}] sm:w-[${width}]` : `xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[85%] sx:w-[90%] w-[55%]`}`}
      // style={width ? { width: width } : { width: "50%" }}
      >
        <div className="w-full bg-primary flex justify-between p-5 items-center">
          <h1 className="text-white text-xl font-semibold whitespace-nowrap sx:text-[16px]">
            {title}
          </h1>
        </div>
        <div className="whitespace-nowrap">{children}</div>
        <div className="flex items-center px-8 gap-4">
          {isContract && (
            <a
              href={isContract}
              className="disabled:bg-gray-400 flex items-center border border-slate-300 gap-2 bg-green text-white text-sm p-[6px] rounded whitespace-nowrap px-5 hover:bg-green duration-200"
            >
              <FiSave className="text-md" />
              <p>Yuklab olish</p>
            </a>
          )}
          <button
            disabled={isValid || isContract}
            type="submit"
            className="disabled:bg-gray-400 flex items-center border border-slate-300 gap-2 bg-primary text-white text-sm p-[6px] rounded whitespace-nowrap px-5 hover:opacity-90 duration-200"
          >
            <FiSave className="text-md" />
            <p>Saqlash</p>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center border border-slate-300 gap-2 bg-red-600 text-white text-sm p-[6px] rounded whitespace-nowrap hover:bg-red-500 duration-200"
          >
            <FiX className="text-lg" />
            <p>Bekor qilish</p>
          </button>
        </div>
      </form>
      <div
        onClick={onClose}
        className={`form-backdrop ${isOpen ? "open" : ""}`}
      ></div>
    </>
  );
};

const MemoizeForm = memo(Form);
export default MemoizeForm;
