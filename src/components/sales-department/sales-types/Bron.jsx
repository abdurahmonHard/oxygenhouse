/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { memo, useContext } from 'react'
import { useState } from 'react'
import Form from '../../../examples/form/Form'
import { styles } from '../../../assets/styles/styles'
import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllCustomers, postBooking } from '../../../functions/ProjectMethods'
import { format } from 'date-fns'
import { getAllUsers } from '../../../functions/UserMethodes'
import { AuthContext } from "../../../context/AuthContext"
import { NumericFormat } from 'react-number-format'
import { useNavigate } from 'react-router'
import Loading from '../../../examples/loading/Loading'
import { DatePicker, Select } from 'antd'


const initialState = {
  client_id: "",
  user_id: "",
  apartment_id: "",
  bron_date: "",
  bron_amount: "",
  bron_expires: ""
}
const formatDate = (value) => {
  return value ? format(new Date(value), "yyyy-MM-dd") : "";
};


const Bron = ({ modal, data, setModal }) => {
  const [isValid, setIsValid] = useState(true)
  const [clientsData, setClientsData] = useState(initialState)

  const { data: allcustomer } = useQuery(["getAllCustomers"], () => getAllCustomers(1), { refetchOnWindowFocus: false });
  const { data: allUsers, isLoading } = useQuery(["getAllUsers"], () => getAllUsers(0), { refetchOnWindowFocus: false });
  const { profile } = useContext(AuthContext)
  const navigate = useNavigate()


  useEffect(() => {
    setClientsData((prevData) => ({
      ...prevData,
      apartment_id: Number(data?.id)
    }));
  }, [modal, data])

  const closeHandle = () => {
    setModal(false)
    setClientsData(initialState)
  }

  // const changeBronDate = (dates, dateStrings) => {
  //    if (dates) {
  //       setClientsData({ ...clientsData, bron_date: dateStrings })
  //    } else {
  //       console.log("Clear");
  //    }
  // };

  const queryClient = useQueryClient();
  const addCustomer = useMutation({
    mutationFn: postBooking,
    onSuccess: () => {
      ['getBuildingById', 'getApartmentsInfo'].forEach(cache => {
        queryClient.invalidateQueries(cache);
      });
    },
  });
  const saveContaract = async (e) => {
    e.preventDefault()
    await addCustomer.mutate(clientsData)
    setIsValid(false)
    setModal(false)
  }
  useEffect(() => {
    if (
      clientsData.client_id !== "" &&
      clientsData.user_id !== "" &&
      clientsData.apartment_id !== "" &&
      clientsData.bron_amount !== "" &&
      clientsData.bron_date !== "" &&
      clientsData.bron_expires !== ""
    ) {
      setIsValid(false);
    }
    else {
      setIsValid(true);
    }
  }, [clientsData]);
  const handleInputChange = (fieldName, value) => {
    if (value === -1) {
      navigate('/customers')
    }
    else {
      setClientsData((prevData) => ({
        ...prevData,
        [fieldName]: value,
      }));
    }
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleSelectChange = (selectedOption) => {
    setClientsData({
      ...clientsData,
      client_id: selectedOption ? selectedOption : null,
    });
  };

  const handleNewCustomerClick = () => {
    navigate("/customers")
  }
  return (
    <div>
      <Form width="80%" isOpen={modal} onClose={closeHandle} save={saveContaract} title={"Bron bo'limi"} isValid={isValid}>
        <div className='grid p-4 items-start overflow-x-hidden overflow-y-scroll h-[70vh] grid-cols-1 xl:grid-cols-5'>
          <div className='grid xl:col-span-3 sm:grid-cols-2 gap-3 mt-5'>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Mijoz
              </label>
              <Select
                showSearch
                placeholder="Tanlang"
                optionFilterProp="children"
                allowClear
                value={clientsData.client_id === "" ? null : clientsData.client_id}
                virtual={false}
                onChange={(selectedOption) => {
                  if (selectedOption && selectedOption === -1) {
                    // Yangi mijoz qo'shish tanlovi bosganda ishlaydi
                    handleNewCustomerClick();
                  } else {
                    // Boshqa tanlovlar uchun onChange hodisasi ishlaydi
                    handleSelectChange(selectedOption);
                  }
                }}
                filterOption={filterOption}
                options={[
                  {
                    value: -1,
                    label: "+ Yangi mijoz qo'shish",
                    style: { color: "white", background: "#6bc144" },
                  },
                  ...(allcustomer
                    ? allcustomer.map((item) => ({
                      value: item?.id,
                      label: `${item.first_name} ${item.last_name} ${item.middle_name}`,
                    }))
                    : []),
                ]}
                className={`${styles.inputUchun}`}
              />
              {/* <select
                type="text" className="w-full capitalize h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
                value={clientsData.client_id}
                onChange={(e) =>
                  handleInputChange("client_id", +e.target.value)
                }
              >
                <option value="">Hech qanday</option>
                {allcustomer?.map((item, i) => (
                  <option value={item.id} key={i}>
                    {item.first_name}  {item.last_name}  {item.middle_name}
                  </option>
                ))}
                <option className='text-white bg-green' value="-1">Yangi mijoz qo'shish</option>
              </select> */}
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Foydalanuvchi
              </label>
              <select type="text" className="w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
                value={clientsData.user_id}
                onChange={(e) =>
                  handleInputChange("user_id", +e.target.value)
                }
              >
                <option value="">Hech qanday</option>
                {profile?.roles?.role_name === "SuperAdmin" ? !isLoading && allUsers?.map((item, i) => (
                  <option key={i} value={item.id}>{item.last_name} {item.first_name}</option>
                )) :
                  <option value={profile.id}>{profile.last_name} {profile.first_name}</option>
                }
              </select>
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Zakolat
              </label>

              <NumericFormat
                allowLeadingZeros
                thousandSeparator=" "
                className={`w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100`}
                value={clientsData?.bron_amount === 0 ? "" : clientsData?.bron_amount}
                onValueChange={({ value }) =>
                  setClientsData({
                    ...clientsData,
                    bron_amount: value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Buyurtma sanasi
              </label>
              <input value={formatDate(clientsData.bron_date)} onChange={(e) => handleInputChange("bron_date", e.target.value)} type="date" className='w-full  first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100' />
              {/* <DatePicker onChange={changeBronDate} className='w-full  first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100' /> */}
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Buyurtma muddati
              </label>
              <input min={format(new Date(), "yyyy-MM-dd")} value={formatDate(clientsData.bron_expires)} onChange={(e) => handleInputChange("bron_expires", e.target.value)} type="date" className='w-full  first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100' />
            </div>
          </div>
          <div className='grid xl:col-span-2  gap-5'>
            <div className='aspect-[5/3] w-full'>
              {/* <img className='object-cover object-center h-full w-full' src="https://wpmedia.roomsketcher.com/content/uploads/2022/01/06124754/Best-laid-floor-plans-3D-Floor-Plan-2.jpg" alt="" /> */}
            </div>
            <div className='flex flex-col text-sm'>
              <div className={` p-3 border-b`}>
                <p className='text-xl sm:text-2xl font-bold'>{data?.floor.entrance.buildings.towns.name}</p>
              </div>
              {/* <div className={`${styles.flexBetween} p-3 border-b`}>
                <p className="font-semibold">Umumiy narx:</p>
                <p>{((data?.room_space) * (data?.floor.entrance.buildings.mk_price))?.brm()} so'm</p>
              </div> */}
              {/* <div className={`${styles.flexBetween} p-3 border-b`}>
                <p className="font-semibold">Narx (1m<sup>2</sup>):</p>
                <p>{(data?.floor.entrance.buildings.mk_price)?.brm()} so'm</p>
              </div> */}
              <div className={`${styles.flexBetween} p-3 border-b`}>
                <p className="font-semibold">Kvartira xonalari:</p>
                <p>{data?.cells}</p>
              </div>
              <div className={`${styles.flexBetween} p-3 border-b`}>
                <p className="font-semibold">Kvartira hajmi (1m<sup>2</sup> ) :</p>
                <p>{data?.room_space} m<sup>2</sup></p>
              </div>
            </div>
          </div>

        </div>
      </Form>
    </div>
  )
}
const MemoizeBron = memo(Bron);
export default MemoizeBron;