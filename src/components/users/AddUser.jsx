/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState, memo } from "react";
import Form from "../../examples/form/Form";
import { FiPlus } from "react-icons/fi";
import { PatternFormat } from "react-number-format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUser, getAllUsers } from "../../functions/UserMethodes";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { getCountData } from "../../functions/ProjectMethods";

function AddUser() {
  const [open, setOpen] = useState(false);
  const [valid, setValid] = useState(true);
  const { data } = useQuery(["getCountData"], () => getCountData());
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState({
    first_name: "",
    last_name: "",
    username: "",
    phone_number: "",
    password: "",
    is_active: "",
    role_id: 0,
    town_access: null,
  });
  const id = 0;
  const { data: users } = useQuery(["Users", id], () => getAllUsers(id));
  const queryClient = useQueryClient();
  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
  });

  useEffect(() => {
    const validateForm = () => {
      const isFormValid = Object.values(inputValue).every((value) => {
        if (typeof value === "string") {
          return value.trim() !== "";
        } else {
          return value !== 0;
        }
      });
      setValid(!isFormValid);
    };
    validateForm();
  }, [inputValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "role_id") {
      newValue = Number(value);
    }
    if (name === "is_active") {
      newValue = value === "true";
    }

    setInputValue({
      ...inputValue,
      [name]: newValue,
    });
    const isUsernameExists = users.some((user) => user.username === value);
    if (isUsernameExists) {
      setError("Ushbu foydalanuvchi nomi mavjud");
    } else {
      setError("");
    }
  };

  const closeForm = () => {
    setOpen(false);
    setInputValue({
      first_name: "",
      last_name: "",
      username: "",
      phone_number: "",
      password: "",
      is_active: "",
      role_id: 0,
      town_access: null,
    });
  };

  const filteredTowns = data?.filter((item) =>
    inputValue.town_access?.includes(item.id)
  );
  const result = filteredTowns?.map((town) => ({
    value: town.id,
    label: town.name,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addUserMutation.mutate(inputValue);
    closeForm();
  };
  return (
    <div>
      <div className="flex justify-end">
        <div>
          <button
            onClick={() => setOpen(true)}
            className={`bg-green px-2 py-1.5 text-white rounded text-sm flex items-center gap-1`}
          >
            <FiPlus className="text-lg" />
            <p className="text-md">Qo'shish</p>
          </button>
        </div>
      </div>
      <Form
        isValid={valid}
        isOpen={open}
        onClose={closeForm}
        title={"Foydalanuvchi qo'shish"}
        save={handleSubmit}
      >
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-6 m-4">
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="first_name">
              <span className="mr-1 text-red-600">*</span>Ism
            </label>
            <input
              value={inputValue.first_name}
              id="first_names"
              name="first_name"
              type="text"
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              required
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="last_name">
              <span className="mr-1 text-red-600">*</span>Familya
            </label>
            <input
              value={inputValue.last_name}
              id="last_names"
              name="last_name"
              type="text"
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              required
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-2 mb-2 relative">
            <label className="font-bold text-[13px]" htmlFor="username">
              <span className="mr-1 text-red-600">*</span>
              Foydalanuvchi nomi
            </label>
            <input
              value={inputValue.username.trim()}
              id="usernames"
              name="username"
              type="text"
              required
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
            {error.length > 0 ? (
              <p className="absolute -bottom-5 text-xs text-red-500">{error}</p>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="password">
              <span className="mr-1 text-red-600">*</span>
              Foydalanuvchi Paroli
            </label>
            <input
              value={inputValue.password.trim()}
              id="passwords"
              name="password"
              type="text"
              required
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="role_id">
              Role
            </label>
            <select
              value={inputValue.role_id}
              id="role_ids"
              onChange={(e) => handleChange(e)}
              name="role_id"
              type="text"
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
            >
              <option value="0">Hech qanday</option>
              <option value="1">Administrator</option>
              <option value="2">Menejer</option>
              <option value="3">Sotuvchi</option>
              {/* <option value="5">Kassir</option>
              <option value="6">Buxgalter</option> */}
            </select>
          </div>
          <div className="flex flex-col gap-2 mb-2 col-span-1">
            <label className="font-bold text-[13px]" htmlFor="objects">
              Maskanlar
            </label>
            <Select
              isDisabled={inputValue.role_id === 1 ? true : false}
              closeMenuOnSelect={false}
              components={makeAnimated}
              isMulti
              value={inputValue.town_access ? result : null}
              placeholder="Maskani tanlang"
              options={data?.map((town) => ({
                value: town.id,
                label: town.name,
              }))}
              maxMenuHeight={130}
              onChange={(e) =>
                setInputValue({
                  ...inputValue,
                  town_access: e.map((value) => value.value),
                })
              }
              noOptionsMessage={() => <div>"Ma'lumotlar yo'q"</div>}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="phone_number">
              <span className="mr-1 text-red-600">*</span>Telefon raqami
            </label>
            <PatternFormat
              id="phone_numbers"
              name="phone_number"
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              format="+998 ## ### ## ##"
              placeholder="+998"
              required
              value={inputValue.phone_number}
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-2 mb-2 col-span-1">
            <label className="font-bold text-[13px]" htmlFor="is_active">
              Holati
            </label>
            <select
              id="is_actives"
              name="is_active"
              value={inputValue.is_active}
              type="text"
              onChange={(e) => handleChange(e)}
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
            >
              <option value="null">Hech Qanday</option>
              <option value="true">Faol</option>
              <option value="false">Faol Emas</option>
            </select>
          </div>
        </div>
      </Form>
    </div>
  );
}

const MemoizeAddUser = memo(AddUser);

export default MemoizeAddUser;
