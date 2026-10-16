import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService.js";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";

const FrmBankMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const bankId = state?.bankId;
  const isEdit = !!bankId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      bankName: "",
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!bankId) return;

    // 🔸 DUMMY — replace with apiService.post("getBankDetail", { bankId: Number(bankId) })
    const dummyDetail = {
      NUM_BANK_ID: bankId,
      VAR_BANK_NAME: "State Bank of India",
    };

    reset({
      bankName: dummyDetail.VAR_BANK_NAME || "",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getBankDetail", {
    //       bankId: Number(bankId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         bankName: d.VAR_BANK_NAME || "",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Bank detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Bank detail error:", err);
    //     alert("Failed to fetch bank detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [bankId, reset]);

  // ---------- Submit ----------
  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_UserId: userId,
        in_Mode: isEdit ? 2 : 1,
        in_BankId: isEdit ? Number(bankId) : null,
        in_BankName: data.bankName.trim(),
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Bank payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmBankList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_bank_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmBankList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save bank",
      //   );
      // }
    } catch (error) {
      console.error("Error saving bank:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Bank Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bank Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* Single field */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="Bank Name : " required />
            <input
              type="text"
              placeholder="Enter bank name"
              className={`form-input-box ${
                errors.bankName ? "border-red-500" : ""
              }`}
              {...register("bankName", {
                required: "Bank name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Bank name cannot be empty",
              })}
            />
            {errors.bankName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.bankName.message}
              </p>
            )}
          </div>
        </div>

        {/* Buttons — centered */}
        <div className="flex justify-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? "Update" : "Submit"}
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmBankList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmBankMst;
