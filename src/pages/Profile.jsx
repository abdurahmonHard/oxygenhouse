/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateUser } from "../functions/UserMethodes";
import { toast } from "react-toastify";

const ProfileField = ({
  label,
  dataKey,
  htmlFor,
  isEditing,
  handleChange,
  value,
  error,
}) => (
  <div className="sm:col-span-2">
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      {label}
    </label>
    <div className="mt-2 relative">
      {isEditing ? (
        <input
          type="text"
          name={dataKey}
          value={value}
          onChange={handleChange}
          className="bg-white p-3"
        />
      ) : (
        <p className="bg-white p-3">
          {dataKey === "password" ? "********" : value}
        </p>
      )}
    </div>
  </div>
);

export default function Profile() {
  const { profile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: profile.id,
    first_name: profile.first_name,
    is_active: profile.is_active,
    last_name: profile.last_name,
    phone_number: profile.phone_number,
    role_id: profile.roles.id,
    town_access: profile.town_access?.split(",").map(Number),
    username: profile.username,
    password: null,
  });
  const id = 0;
  const { data: users } = useQuery(["Users", id], () => getAllUsers(id));
  const queryClient = useQueryClient();
  const UpdateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["Users"]);
    },
  });

  const fields = [
    { label: "Ism", dataKey: "first_name", htmlFor: "first-name" },
    { label: "Familiya", dataKey: "last_name", htmlFor: "last-name" },
    {
      label: "Telefon raqam",
      dataKey: "phone_number",
      htmlFor: "phone-number",
    },
    {
      label: "Foydalanuvchi Nomi",
      dataKey: "username",
      htmlFor: "username",
    },
    { label: "Parol", dataKey: "password", htmlFor: "password" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    UpdateUserMutation.mutate(formData);
    setIsEditing(false);
  };

  if (!profile) {
    return <div>Yuklanmoqda...</div>; // yoki boshqa placeholder
  }

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const isUsernameExists = users.some((user) => user.username === value);
    if (isUsernameExists) {
      toast.error("Ushbu foydalanuvchi nomi allaqachon mavjud");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Shaxsiy Ma'lumotlar
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Doim foydalanadigan nomerizi yozing.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 sm:grid-rows-3">
            <div className="sm:row-span-3 sm:col-span-1">
              <div className="border rounded-md h-full sx:h-[200px] flex items-center justify-center bg-white shadow-sm">
                <FaRegUser className="text-7xl sx:text-6xl" />
              </div>
            </div>
            {fields.map((field, index) => (
              <ProfileField
                key={index}
                label={field.label}
                dataKey={field.dataKey}
                htmlFor={field.htmlFor}
                isEditing={isEditing}
                handleChange={handleChange}
                value={formData[field.dataKey]}
                error={field.error}
              />
            ))}

            <div className="sm:col-span-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Holat
              </label>
              <div className="mt-2">
                {profile.is_active === true ? (
                  <span className="text-green">Faol</span>
                ) : (
                  <span className="text-red-500">Faol emas</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-4">
            {isEditing && (
              <div className="flex gap-4 items-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Saqlash
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Bekor qilish
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={handleEditToggle}
              className="bg-green text-white px-4 py-2 mr-2 rounded-lg"
            >
              Tahrirlash
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
