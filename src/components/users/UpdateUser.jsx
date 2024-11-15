import React, { useEffect, useState } from "react";
import Form from "../../examples/form/Form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import makeAnimated from "react-select/animated";
import { BiEditAlt } from "react-icons/bi";
import Select from "react-select";
import { getAllUsers, updateUser } from "../../functions/UserMethodes";
import { getCountData } from "../../functions/ProjectMethods";
import { PatternFormat } from "react-number-format";

export default function UpdateUser({ object }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    id: object.id,
    first_name: object.first_name,
    last_name: object.last_name,
    username: object.username,
    phone_number: object.phone_number,
    password: null,
    is_active: object.is_active,
    role_id: object.roles.id,
    town_access: object.town_access?.split(",").map(Number),
  });
  const id = 0;
  const { data: users } = useQuery(["Users", id], () => getAllUsers(id));
  const { data } = useQuery(["getCountData"], () => getCountData());
  const queryClient = useQueryClient();
  const UpdateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["Users"]);
    },
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (inputValue.role_id === 1) {
      setInputValue((prevState) => ({
        ...prevState,
        town_access: null,
      }));
    }
  }, [inputValue.role_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: name === "is_active" ? value === "true" : value,
    }));
    const isUsernameExists = users.some((user) => user.username === value);
    if (isUsernameExists) {
      setError("Ushbu foydalanuvchi nomi mavjud");
    } else {
      setError("");
    }
  };

  const townOptions = data?.map((town) => ({
    value: town.id,
    label: town.name,
  }));

  const filteredOptions = townOptions?.filter((option) =>
    inputValue.town_access?.includes(option.value)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    UpdateUserMutation.mutate(inputValue);
    setOpen(false);
  };

  return (
    <div>
      <div className="flex">
        <div>
          <button
            onClick={() => setOpen(!open)}
            className={`w-[30px] h-[30px] bg-yellow-500 rounded-full inline-flex items-center justify-center cursor-pointer`}
          >
            <BiEditAlt className="text-sm text-white" />
          </button>
        </div>
      </div>
      <Form
        isOpen={open}
        onClose={() => setOpen(false)}
        title={"Foydalanuvchi o'zgartirish"}
        save={handleSubmit}
      >
        <div className="grid grid-cols-2 sx:grid-cols-1 gap-6 text-left m-4">
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="first_name">
              <span className="mr-1 text-red-600">*</span>Ism
            </label>
            <input
              value={inputValue.first_name}
              id="first_name"
              name="first_name"
              type="text"
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              required
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="last_name">
              <span className="mr-1 text-red-600">*</span>Familya
            </label>
            <input
              value={inputValue.last_name}
              id="last_name"
              name="last_name"
              type="text"
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              required
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2 relative">
            <label className="font-bold text-[13px]" htmlFor="username">
              <span className="mr-1 text-red-600">*</span>
              Foydalanuvchi nomi
            </label>
            <input
              value={inputValue.username}
              id="username"
              name="username"
              type="text"
              required
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              onChange={(e) => handleChange(e)}
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
              Parolni o'zgartirish
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="phone_number">
              <span className="mr-1 text-red-600">*</span>Telefon raqami
            </label>
            <PatternFormat
              id="phone_number"
              name="phone_number"
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              format="+998 ## ### ## ##"
              placeholder="+998"
              required
              value={inputValue.phone_number}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2 col-span-1">
            <label className="font-bold text-[13px]" htmlFor="town_access">
              Maskanlar
            </label>
            <Select
              isDisabled={inputValue.role_id === 1}
              closeMenuOnSelect={false}
              components={makeAnimated()}
              isMulti
              value={filteredOptions}
              placeholder="Maskanni tanlang"
              options={townOptions}
              maxMenuHeight={130}
              onChange={(selectedOptions) =>
                handleChange(
                  "town_access",
                  selectedOptions.map((option) => option.value)
                )
              }
              noOptionsMessage={() => <div>"Ma'lumotlar yo'q"</div>}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="role_id">
              Role
            </label>
            <select
              value={inputValue.role_id}
              id="role_id"
              onChange={(e) => handleChange(e)}
              name="role_id"
              type="text"
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
            >
              <option value="0">Hech qanday</option>
              <option value="1">Administrator</option>
              <option value="2">Menejer</option>
              <option value="3">Sotuvchi</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 mb-2 col-span-1">
            <label className="font-bold text-[13px]" htmlFor="is_active">
              Holati
            </label>
            <select
              id="is_active"
              name="is_active"
              value={inputValue.is_active}
              type="text"
              className="w-full h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              onChange={(e) => handleChange(e)}
            >
              <option value="">Hech qanday</option>
              <option value="true">Faol</option>
              <option value="false">Faol Emas</option>
            </select>
          </div>
        </div>
      </Form>
    </div>
  );
}
