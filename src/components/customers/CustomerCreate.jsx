/* eslint-disable react/prop-types */
import React, { useState, useEffect, memo, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Form from "../../examples/form/Form";
import { format } from "date-fns";
import { PatternFormat } from "react-number-format";
import { instance } from "../../api/Api";
import { toast } from "react-toastify";

const formatDate = (value) => {
  return value ? format(new Date(value), "yyyy-MM-dd") : "";
};

const InputField = ({
  label,
  type,
  value,
  onChange,
  className,
  required,
  maxLength,
  options,
  isValidPass,
}) => (
  <div
    className={`flex flex-col ${
      label === "Amal qilish muddati" ? "col-span-1" : ""
    } gap-2 mb-2`}
  >
    {label && (
      <label className="font-bold text-[13px]">
        {required && <span className="mr-1 text-red-600">*</span>}
        {label}
      </label>
    )}
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        className={`w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100 ${className}`}
      ></textarea>
    ) : type === "select" ? (
      <select
        value={value}
        onChange={onChange}
        className={`w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100 ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : label === "Telefon raqam" ? (
      <PatternFormat
        className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
        format="+998 ## ### ## ##"
        placeholder="+998"
        required
        value={value}
        onChange={onChange}
      />
    ) : (
      <>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100 ${className}`}
          required={required}
          maxLength={maxLength}
        />
        {isValidPass === false && (
          <p className="text-red-500 text-sm">Passport seriya xato kiritildi</p>
        )}
      </>
    )}
  </div>
);

const CustomerCreate = ({
  initialState,
  setShow,
  show,
  isPost,
  customerData,
  setCustomerData,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [isValidPass, setIsValidPass] = useState(true);
  useEffect(() => {
    setIsValid(
      !(
        customerData.first_name &&
        customerData.last_name &&
        customerData.contact_number &&
        customerData.passport_seria &&
        customerData.gender &&
        customerData.given_from &&
        customerData.tin &&
        customerData.address &&
        customerData.untill_date &&
        customerData.date_of_birth &&
        isValidPass
      )
    );
  }, [customerData]);

  const formFields = [
    {
      label: "Ism",
      type: "text",
      value: customerData.first_name,
      onChange: (e) => handleInputChange("first_name", e.target.value),
      required: true,
    },
    {
      label: "Familya",
      type: "text",
      value: customerData.last_name,
      onChange: (e) => handleInputChange("last_name", e.target.value),
      required: true,
    },
    {
      label: "Otasining ismi",
      type: "text",
      value: customerData.middle_name,
      onChange: (e) => handleInputChange("middle_name", e.target.value),
      required: true,
    },
    {
      label: "Jins",
      type: "select",
      value: customerData.gender,
      onChange: (e) => handleInputChange("gender", e.target.value),
      options: [
        { label: "Tanlanmagan", value: "null" },
        { label: "Erkak", value: "male" },
        { label: "Ayol", value: "female" },
      ],
      required: true,
    },
    {
      label: "Telefon raqam",
      type: "text",
      value: customerData.contact_number,
      onChange: (e) => handleInputChange("contact_number", e.target.value),
      maxLength: 15,
      required: true,
    },
    // {
    //   label: "Izoh",
    //   type: "textarea",
    //   value: customerData.description,
    //   onChange: (e) => handleInputChange("description", e.target.value),
    // },
    {
      label: "Manzil",
      type: "text",
      value: customerData.address,
      onChange: (e) => handleInputChange("address", e.target.value),
      required: true,
    },
    // {
    //   label: "Ro'yxatga olingan manzil",
    //   type: "text",
    //   value: customerData.registered_address,
    //   onChange: (e) => handleInputChange("registered_address", e.target.value),
    // },
    // {
    //   label: "Yuridik manzil",
    //   type: "text",
    //   value: customerData.legal_address,
    //   onChange: (e) => handleInputChange("legal_address", e.target.value),
    // },
    // {
    //   label: "Mijoz Turi",
    //   type: "select",
    //   value: customerData.type,
    //   options: [
    //     { label: "Tanlanmagan", value: "null" },
    //     { label: "Jismoniy shaxs", value: "jismoniy" },
    //     // { label: "Yuridik shaxs", value: "yuridik" },
    //   ],
    //   onChange: (e) => handleInputChange("type", e.target.value),
    //   required: true,
    // },
    {
      label: "STIR",
      type: "text",
      value: customerData.tin.replace(/[^0-9]/g, ""),
      onChange: (e) => handleInputChange("tin", e.target.value),
      required: true,
      maxLength: 9,
    },
    {
      label: "Pasport seriyasi/raqami",
      type: "text",
      value: customerData.passport_seria,
      onChange: (e) => handleChange("passport_seria", e.target.value),
      required: true,
      className: `uppercase ${
        isValidPass ? "focus:border-green" : "focus:border-red-500"
      }`,
      maxLength: 9,
      isValidPass: isValidPass,
    },
    {
      label: "Pasport Kim tomonidan berilgan",
      type: "text",
      value: customerData.given_from,
      onChange: (e) => handleInputChange("given_from", e.target.value),
      required: true,
    },
    {
      label: "Pasport berilgan sana",
      type: "date",
      value:
        formatDate(customerData.given_date) !== "0001-01-01"
          ? formatDate(customerData.given_date)
          : "",
      onChange: (e) => handleInputChange("given_date", e.target.value),
      required: true,
    },
    {
      label: "Amal qilish muddati",
      type: "date",
      value:
        formatDate(customerData.untill_date) !== "0001-01-01"
          ? formatDate(customerData.untill_date)
          : "",
      onChange: (e) => handleInputChange("untill_date", e.target.value),
      required: true,
    },
    {
      label: "Tug'ilgan sana",
      type: "date",
      value:
        formatDate(customerData.date_of_birth) !== "0001-01-01"
          ? formatDate(customerData.date_of_birth)
          : "",
      onChange: (e) => handleInputChange("date_of_birth", e.target.value),
      required: true,
    },
  ];

  const handleInputChange = (fieldName, value) => {
    setCustomerData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleChange = (fieldName, value) => {
    setCustomerData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    const regex = /^[A-Z]{2}\d*$/;
    setIsValidPass(regex.test(value.toUpperCase()));
  };
  // console.log(isValidPass);

  const resetForm = () => {
    setShow(false);
    setCustomerData(initialState);
  };

  // add new customers
  const postCustomer = async (value) => {
    await instance
      .post("/clients/create", value)
      .then(({ data }) => {
        data.status === 409
          ? toast.error("Mijoz allaqachon mavjud")
          : (toast.success("Yangi mijoz qo'shildi"), resetForm());
      })
      .catch(() => {
        toast.error("Mijoz qo'shishda xatolik yuz berdi");
      });
  };

  // edit  customers
  const patchCustomer = async (value) => {
    console.log(value);
    await instance
      .patch(`/clients/edit/${value.id}`, value)
      .then(({ data }) => {
        console.log(data);
        data.status === 409
          ? toast.error("Mijoz allaqachon mavjud")
          : (toast.success("Mijoz ma'lumotlari o'zgartirildi"), resetForm());
      })
      .catch(() => {
        toast.error("Mijoz qo'shishda xatolik yuz berdi");
      });
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    const data = {
      ...customerData,
      passport_seria: customerData.passport_seria.toUpperCase(),
      date_of_birth: customerData.date_of_birth || "0001-01-01",
      given_date: customerData.given_date || "0001-01-01",
      untill_date: customerData.untill_date || "0001-01-01",
    };
    // console.log(data);
    isPost ? await addCustomer.mutate(data) : await editCustomer.mutate(data);
  };

  const queryClient = useQueryClient();
  const addCustomer = useMutation({
    mutationFn: postCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllCustomers"] });
    },
  });

  const editCustomer = useMutation({
    mutationFn: patchCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllCustomers"] });
    },
  });

  return (
    <div>
      <Form
        isOpen={show}
        onClose={resetForm}
        title={"Mijoz qo'shish"}
        save={handleSubmission}
        isValid={isValid}
      >
        {/* Use the new `InputField` component here, for example: */}
        <div className="max-h-[500px] overflow-y-auto">
          <div className="grid xl:grid-cols-2 grid-cols-1 gap-6 m-4">
            {formFields.map((field, index) => (
              <InputField key={index} {...field} />
            ))}
          </div>
        </div>
      </Form>
    </div>
  );
};

const MemoizeCustomerCreate = memo(CustomerCreate);

export default MemoizeCustomerCreate;
