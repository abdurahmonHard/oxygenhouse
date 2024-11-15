import { DatePicker } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getReports } from "../../functions/ReportMethod";

const { RangePicker } = DatePicker;

export default function DatePickers({ refetch, set }) {
  const rangePresets = [
    {
      label: "Haftalik",
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: "Oylik",
      value: [dayjs().add(-30, "d"), dayjs()],
    },
    {
      label: "Yillik",
      value: [dayjs().add(-365, "d"), dayjs()],
    },
  ];

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      set(`${dateStrings[0]}/${dateStrings[1]}`);
      refetch();
    } else {
      console.log("Clear");
    }
  };
  return (
    <RangePicker
      presets={rangePresets}
      onChange={onRangeChange}
      placeholder={["Boshlang‘ich sana", "Yakunlanadigan sana"]}
      className="w-auto p-2"
    />
  );
}
