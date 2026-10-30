import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button.jsx";
import apiService from "../../../../apiService";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

// Gap codes that allow manual estimate reading
const SPECIAL_GAP_CODES = ["Faulty", "AVG"];

const FrmMtrReadingUpdate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [gapCodeOptions, setGapCodeOptions] = useState([]);
  const [searched, setSearched] = useState(false);
  const [newEstimateEditable, setNewEstimateEditable] = useState(false);
  const [originalDetail, setOriginalDetail] = useState(null);

  const { register, setValue, getValues, watch, reset } = useForm({
    defaultValues: {
      oldPrevReading: "",
      oldCurrReading: "",
      oldEstimate: "",
      oldGapCode: "",
      newPrevReading: "",
      newCurrReading: "",
      newEstimate: "",
      newGapCode: "",
      remark: "",
    },
  });

  const watchNewGapCode = watch("newGapCode");

  // Fetch gap code dropdown
  useEffect(() => {
    const fetchGapCodes = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(`/transaction/getMeterReadingGapCode`);
        if (res?.success && Array.isArray(res.data)) {
          setGapCodeOptions(
            res.data.map((item) => ({
              value: String(item.NUM_GAPCODE_ID),
              label: item.VAR_GAPCODE_NAME,
            })),
          );
        } else {
          setGapCodeOptions([]);
        }
      } catch (err) {
        console.error("Gap code dropdown error:", err);
        setGapCodeOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGapCodes();
  }, [ulbid]);

  const getGapCodeLabel = (id) => {
    const match = gapCodeOptions.find((o) => o.value === String(id));
    return match?.label || "";
  };

  const isSpecialGapCode = (id) => {
    const label = getGapCodeLabel(id);
    return SPECIAL_GAP_CODES.includes(label);
  };

  const computeEstimate = (prevReading, currReading, totalQty, gapCodeId) => {
    if (isSpecialGapCode(gapCodeId)) {
      return String(totalQty ?? 0);
    }
    return String((Number(currReading) || 0) - (Number(prevReading) || 0));
  };

  // Actual search function
  const performSearch = async (connNo) => {
    try {
      setLoading(true);
      const res = await apiService.get(
        `/transaction/getMeterReadingUpdateList?connectionNo=${connNo.trim()}&ulbId=${ulbid}`,
      );

      if (res?.success && res?.data?.length > 0) {
        const row = res.data[0];
        setOriginalDetail(row);

        const special = isSpecialGapCode(row.GAPCODEID);

        // Old section
        setValue("oldPrevReading", String(row.PREVREADING ?? 0));
        setValue("oldCurrReading", String(row.CURRREADING ?? 0));
        setValue(
          "oldEstimate",
          computeEstimate(
            row.PREVREADING,
            row.CURRREADING,
            row.TOTALQUTY,
            row.GAPCODEID,
          ),
        );
        setValue("oldGapCode", String(row.GAPCODEID || ""));

        // New section (prefilled with same values)
        setValue("newPrevReading", String(row.PREVREADING ?? 0));
        setValue("newCurrReading", String(row.CURRREADING ?? 0));
        setValue(
          "newEstimate",
          computeEstimate(
            row.PREVREADING,
            row.CURRREADING,
            row.TOTALQUTY,
            row.GAPCODEID,
          ),
        );
        setValue("newGapCode", String(row.GAPCODEID || ""));
        setValue("remark", "");

        setNewEstimateEditable(special);
        setSearched(true);
      } else {
        setSearched(false);
        setOriginalDetail(null);
        alert(res?.message || "No Data Found");
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearched(false);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search from button
  const onSearchClick = () => {
    const connNo = document.getElementById("txtConnNo")?.value?.trim();
    if (!connNo) {
      alert("Please Enter Connection Number");
      return;
    }
    performSearch(connNo);
  };

  // New Prev/Curr change → recalculate estimate (only if not special)
  const handleNewReadingChange = () => {
    if (newEstimateEditable) return; // don't recalc when manual mode

    const prev = getValues("newPrevReading");
    const curr = getValues("newCurrReading");
    setValue("newEstimate", String((Number(curr) || 0) - (Number(prev) || 0)));
  };

  // Gap code change handler
  useEffect(() => {
    if (!searched || !originalDetail) return;

    const currentGapCode = getValues("newGapCode");
    if (!currentGapCode) return;

    const special = isSpecialGapCode(currentGapCode);

    if (special) {
      // Switch TO Faulty/AVG → restore original readings, use stored totalquty
      setValue("newPrevReading", String(originalDetail.PREVREADING ?? 0));
      setValue("newCurrReading", String(originalDetail.CURRREADING ?? 0));
      setValue("newEstimate", String(originalDetail.TOTALQUTY ?? 0));
      setNewEstimateEditable(true);
    } else {
      // Switch AWAY from Faulty/AVG → recalculate
      const prev = getValues("newPrevReading");
      const curr = getValues("newCurrReading");
      setValue(
        "newEstimate",
        String((Number(curr) || 0) - (Number(prev) || 0)),
      );
      setNewEstimateEditable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchNewGapCode]);

  // Reset handler
  const handleReset = () => {
    setSearched(false);
    setOriginalDetail(null);
    setNewEstimateEditable(false);
    reset({
      oldPrevReading: "",
      oldCurrReading: "",
      oldEstimate: "",
      oldGapCode: "",
      newPrevReading: "",
      newCurrReading: "",
      newEstimate: "",
      newGapCode: "",
      remark: "",
    });
    const el = document.getElementById("txtConnNo");
    if (el) el.value = "";
  };

  // Submit handler
  const onSubmit = async () => {
    const connNo = document.getElementById("txtConnNo")?.value?.trim();

    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }
    if (!connNo) {
      alert("Please Enter Connection Number");
      return;
    }

    const values = getValues();

    // Validations matching .NET btnSubmit_Click
    if (!values.newPrevReading?.trim()) {
      alert("Please Enter New Previous Reading");
      return;
    }
    if (!values.newCurrReading?.trim()) {
      alert("Please Enter New Current Reading");
      return;
    }
    if (!values.newGapCode) {
      alert("Please Select New Gap Code");
      return;
    }
    if (!values.remark?.trim()) {
      alert("Please Enter Remark");
      return;
    }
    if (!values.newEstimate?.trim()) {
      alert("Please Enter Estimate Reading");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_userid: userId,
        in_ulbid: Number(ulbid),
        in_connno: connNo,
        in_newpr: values.newPrevReading.trim(),
        in_newcr: values.newCurrReading.trim(),
        in_newgapcode: values.newGapCode,
        in_remark: values.remark.trim(),
        in_Qntity: values.newEstimate.trim(),
      };

      const res = await apiService.post(
        "/transaction/aowt_mtrreadingupd_ins_new",
        payload,
      );

      if (res?.success && res?.data?.out_errcode === 9999) {
        alert(res.data.out_errmsg || "Meter reading updated successfully");
        handleReset();
      } else {
        alert(
          res?.data?.out_errmsg ||
            res?.message ||
            "Failed to update meter reading",
        );
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const disabledInput = "form-input-box w-full bg-slate-100 cursor-not-allowed";
  const enabledInput = "form-input-box w-full";
  const disabledSelect =
    "form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-100 cursor-not-allowed";
  const enabledSelect =
    "form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm";

  return (
    <Layout
      title="Meter Reading Update"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Meter Reading Update",
      }}
    >
      <div className="w-full space-y-6">
        {/* Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <Label text="Connection No: " required />
            <input
              id="txtConnNo"
              type="text"
              placeholder="Enter connection no"
              className={enabledInput}
              disabled={searched}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={onSearchClick} disabled={searched}>
              Search
            </Button>
            <Button type="button" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {/* Old Details + New Details — only after successful search */}
        {searched && originalDetail && (
          <>
            <hr className="border-slate-200" />

            {/* Old Details */}
            <fieldset className="border border-slate-300 rounded-md p-4 space-y-4">
              <legend className="px-2 text-sm font-semibold text-slate-700">
                Old Details
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <Label text="Old Previous Reading: " required />
                  <input
                    type="text"
                    className={disabledInput}
                    disabled
                    {...register("oldPrevReading")}
                  />
                </div>
                <div>
                  <Label text="Old Current Reading: " required />
                  <input
                    type="text"
                    className={disabledInput}
                    disabled
                    {...register("oldCurrReading")}
                  />
                </div>
                <div>
                  <Label text="Old Estimate Reading: " required />
                  <input
                    type="text"
                    className={disabledInput}
                    disabled
                    {...register("oldEstimate")}
                  />
                </div>
                <div>
                  <Label text="Old Gap Code: " required />
                  <select
                    className={disabledSelect}
                    disabled
                    {...register("oldGapCode")}
                  >
                    <option value="">-- Select --</option>
                    {gapCodeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            {/* New Details */}
            <fieldset className="border border-slate-300 rounded-md p-4 space-y-4">
              <legend className="px-2 text-sm font-semibold text-slate-700">
                New Details
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <Label text="New Previous Reading: " required />
                  <input
                    type="text"
                    className={enabledInput}
                    {...register("newPrevReading", {
                      onChange: handleNewReadingChange,
                    })}
                  />
                </div>
                <div>
                  <Label text="New Current Reading: " required />
                  <input
                    type="text"
                    className={enabledInput}
                    {...register("newCurrReading", {
                      onChange: handleNewReadingChange,
                    })}
                  />
                </div>
                <div>
                  <Label text="New Estimate Reading: " required />
                  <input
                    type="text"
                    className={
                      newEstimateEditable ? enabledInput : disabledInput
                    }
                    disabled={!newEstimateEditable}
                    {...register("newEstimate")}
                  />
                </div>
                <div>
                  <Label text="New Gap Code: " required />
                  <select className={enabledSelect} {...register("newGapCode")}>
                    <option value="">-- Select --</option>
                    {gapCodeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label text="Remark: " required />
                  <input
                    type="text"
                    placeholder="Enter remark"
                    className={enabledInput}
                    {...register("remark")}
                  />
                </div>
              </div>
            </fieldset>

            {/* Buttons */}
            <div className="flex justify-center gap-2">
              <Button type="button" onClick={onSubmit}>
                Submit
              </Button>
              <Button type="button" onClick={handleReset}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FrmMtrReadingUpdate;
