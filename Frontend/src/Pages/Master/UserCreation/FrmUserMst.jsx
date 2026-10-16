import React, { useEffect, useState } from "react";
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

const FrmUserMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const editUserId = state?.userId;
  const isEdit = !!editUserId;

  // ---------- Dropdown state ----------
  const [ulbOptions, setUlbOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [collectionCentreOptions, setCollectionCentreOptions] = useState([]);
  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      userId: "",
      firstName: "",
      lastName: "",
      mobileNo: "",
      designationId: "",
      departmentId: "",
      collectionCentreId: "",
      validFrom: new Date().toISOString().split("T")[0],
      validUpto: new Date().toISOString().split("T")[0],
      otpBasedLogin: false,
      userTypeId: "",
      roleId: "",
    },
  });

  const watchValidFrom = watch("validFrom");

  // ---------- Load all dropdowns (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY DATA — replace with real API calls later
    setUlbOptions([
      { value: "1", label: "Pune Municipal Corporation" },
      { value: "2", label: "Mumbai Municipal Corporation" },
      { value: "3", label: "Nashik Municipal Corporation" },
      { value: "4", label: "Nagpur Municipal Corporation" },
    ]);

    setDesignationOptions([
      { value: "1", label: "Clerk" },
      { value: "2", label: "Officer" },
      { value: "3", label: "Supervisor" },
      { value: "4", label: "Manager" },
      { value: "5", label: "Commissioner" },
    ]);

    setDepartmentOptions([
      { value: "1", label: "Accounts" },
      { value: "2", label: "Health" },
      { value: "3", label: "Water Supply" },
      { value: "4", label: "Engineering" },
      { value: "5", label: "Administration" },
    ]);

    setCollectionCentreOptions([
      { value: "1", label: "Head Office" },
      { value: "2", label: "Zone 1" },
      { value: "3", label: "Zone 2" },
      { value: "4", label: "Zone 3" },
    ]);

    setUserTypeOptions([
      { value: "1", label: "Permanent" },
      { value: "2", label: "Contractual" },
      { value: "3", label: "Guest" },
    ]);

    setRoleOptions([
      { value: "1", label: "Admin" },
      { value: "2", label: "Approver" },
      { value: "3", label: "Operator" },
      { value: "4", label: "Viewer" },
    ]);

    // 🔸 REAL API block (all dropdowns in parallel) — uncomment when ready
    // const loadAll = async () => {
    //   try {
    //     setLoading(true);
    //     const [ulbRes, desigRes, deptRes, ccRes, utRes, roleRes] =
    //       await Promise.all([
    //         apiService.get("getUlbDropdown"),
    //         apiService.get("getDesignationDropdown"),
    //         apiService.get("getDepartmentDropdown"),
    //         apiService.get("getCollectionCentreDropdown"),
    //         apiService.get("getUserTypeDropdown"),
    //         apiService.get("getRoleDropdown"),
    //       ]);
    //     const map = (res, k, l) =>
    //       res?.data?.success
    //         ? res.data.data.map((i) => ({
    //             value: String(i[k]),
    //             label: i[l],
    //           }))
    //         : [];
    //     setUlbOptions(map(ulbRes, "CORPORATIONID", "CORPORATIONNAME"));
    //     setDesignationOptions(map(desigRes, "ID", "NAME"));
    //     setDepartmentOptions(map(deptRes, "ID", "NAME"));
    //     setCollectionCentreOptions(map(ccRes, "ID", "NAME"));
    //     setUserTypeOptions(map(utRes, "ID", "NAME"));
    //     setRoleOptions(map(roleRes, "ID", "NAME"));
    //   } catch (err) {
    //     console.error("Dropdown load error:", err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // loadAll();
  }, []);

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!editUserId) return;

    // 🔸 DUMMY — replace with apiService.post("getUserDetail", { userId: Number(editUserId) })
    const dummyDetail = {
      NUM_USER_ID: editUserId,
      NUM_ULB_ID: "1",
      VAR_USER_CODE: "USR1001",
      VAR_FIRST_NAME: "Rahul",
      VAR_LAST_NAME: "Sharma",
      NUM_MOBILE: "9876543210",
      NUM_DESIGNATION_ID: "1",
      NUM_DEPARTMENT_ID: "1",
      NUM_COLLECTION_CENTRE_ID: "1",
      DATE_VALID_FROM: "2024-01-01",
      DATE_VALID_UPTO: "2025-12-31",
      FLG_OTP_LOGIN: "Y",
      NUM_USER_TYPE_ID: "1",
      NUM_ROLE_ID: "1",
    };

    reset({
      ulbId: String(dummyDetail.NUM_ULB_ID || ""),
      userId: dummyDetail.VAR_USER_CODE || "",
      firstName: dummyDetail.VAR_FIRST_NAME || "",
      lastName: dummyDetail.VAR_LAST_NAME || "",
      mobileNo: String(dummyDetail.NUM_MOBILE || ""),
      designationId: String(dummyDetail.NUM_DESIGNATION_ID || ""),
      departmentId: String(dummyDetail.NUM_DEPARTMENT_ID || ""),
      collectionCentreId: String(dummyDetail.NUM_COLLECTION_CENTRE_ID || ""),
      validFrom: dummyDetail.DATE_VALID_FROM || "",
      validUpto: dummyDetail.DATE_VALID_UPTO || "",
      otpBasedLogin: dummyDetail.FLG_OTP_LOGIN === "Y",
      userTypeId: String(dummyDetail.NUM_USER_TYPE_ID || ""),
      roleId: String(dummyDetail.NUM_ROLE_ID || ""),
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getUserDetail", {
    //       userId: Number(editUserId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         ulbId: String(d.NUM_ULB_ID || ""),
    //         userId: d.VAR_USER_CODE || "",
    //         firstName: d.VAR_FIRST_NAME || "",
    //         lastName: d.VAR_LAST_NAME || "",
    //         mobileNo: String(d.NUM_MOBILE || ""),
    //         designationId: String(d.NUM_DESIGNATION_ID || ""),
    //         departmentId: String(d.NUM_DEPARTMENT_ID || ""),
    //         collectionCentreId: String(d.NUM_COLLECTION_CENTRE_ID || ""),
    //         validFrom: d.DATE_VALID_FROM || "",
    //         validUpto: d.DATE_VALID_UPTO || "",
    //         otpBasedLogin: d.FLG_OTP_LOGIN === "Y",
    //         userTypeId: String(d.NUM_USER_TYPE_ID || ""),
    //         roleId: String(d.NUM_ROLE_ID || ""),
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "User detail not found");
    //     }
    //   } catch (err) {
    //     console.error("User detail error:", err);
    //     alert("Failed to fetch user detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [editUserId, reset]);

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
        in_EditUserId: isEdit ? Number(editUserId) : null,
        in_UlbId: Number(data.ulbId),
        in_UserCode: data.userId.trim(),
        in_FirstName: data.firstName.trim(),
        in_LastName: data.lastName.trim(),
        in_Mobile: data.mobileNo.trim(),
        in_DesignationId: Number(data.designationId),
        in_DepartmentId: Number(data.departmentId),
        in_CollectionCentreId: Number(data.collectionCentreId),
        in_ValidFrom: data.validFrom,
        in_ValidUpto: data.validUpto,
        in_OtpBasedLogin: data.otpBasedLogin ? "Y" : "N",
        in_UserTypeId: Number(data.userTypeId),
        in_RoleId: Number(data.roleId),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("User payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmUserList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_user_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmUserList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save user",
      //   );
      // }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Input sanitizers ----------
  const allowOnlyAlphabets = (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
  };
  const allowOnlyDigits = (e, max = 10) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, max);
  };

  return (
    <Layout
      title="User Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "User Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 3 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. ULB Name */}
          <div>
            <Label text="ULB Name : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.ulbId ? "border-red-500" : ""}`}
              {...register("ulbId", { required: "ULB is required" })}
            >
              <option value="">-- Select ULB --</option>
              {ulbOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.ulbId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ulbId.message}
              </p>
            )}
          </div>

          {/* 2. User Id */}
          <div>
            <Label text="User Id : " required />
            <input
              type="text"
              placeholder="Enter user id"
              className={`form-input-box ${errors.userId ? "border-red-500" : ""}`}
              {...register("userId", {
                required: "User Id is required",
                validate: (v) =>
                  v.trim().length > 0 || "User Id cannot be empty",
              })}
            />
            {errors.userId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userId.message}
              </p>
            )}
          </div>

          {/* 3. First Name */}
          <div>
            <Label text="First Name : " required />
            <input
              type="text"
              placeholder="Enter first name"
              className={`form-input-box ${errors.firstName ? "border-red-500" : ""}`}
              onInput={allowOnlyAlphabets}
              {...register("firstName", {
                required: "First name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Only alphabets allowed",
                },
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* 4. Last Name */}
          <div>
            <Label text="Last Name : " required />
            <input
              type="text"
              placeholder="Enter last name"
              className={`form-input-box ${errors.lastName ? "border-red-500" : ""}`}
              onInput={allowOnlyAlphabets}
              {...register("lastName", {
                required: "Last name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Only alphabets allowed",
                },
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* 5. Mobile No */}
          <div>
            <Label text="Mobile No : " required />
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit mobile"
              className={`form-input-box ${errors.mobileNo ? "border-red-500" : ""}`}
              onInput={(e) => allowOnlyDigits(e, 10)}
              {...register("mobileNo", {
                required: "Mobile No is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter valid 10-digit mobile number",
                },
              })}
            />
            {errors.mobileNo && (
              <p className="text-sm text-red-500 mt-1">
                {errors.mobileNo.message}
              </p>
            )}
          </div>

          {/* 6. Designation */}
          <div>
            <Label text="Designation : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.designationId ? "border-red-500" : ""}`}
              {...register("designationId", {
                required: "Designation is required",
              })}
            >
              <option value="">-- Select Designation --</option>
              {designationOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.designationId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.designationId.message}
              </p>
            )}
          </div>

          {/* 7. Department */}
          <div>
            <Label text="Department : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.departmentId ? "border-red-500" : ""}`}
              {...register("departmentId", {
                required: "Department is required",
              })}
            >
              <option value="">-- Select Department --</option>
              {departmentOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.departmentId.message}
              </p>
            )}
          </div>

          {/* 8. Collection Centre */}
          <div>
            <Label text="Collection Centre : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.collectionCentreId ? "border-red-500" : ""}`}
              {...register("collectionCentreId", {
                required: "Collection Centre is required",
              })}
            >
              <option value="">-- Select Collection Centre --</option>
              {collectionCentreOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.collectionCentreId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.collectionCentreId.message}
              </p>
            )}
          </div>

          {/* 9. Valid From */}
          <div>
            <Label text="Valid From : " required />
            <input
              type="date"
              className={`form-input-box ${errors.validFrom ? "border-red-500" : ""}`}
              {...register("validFrom", {
                required: "Valid From is required",
              })}
            />
            {errors.validFrom && (
              <p className="text-sm text-red-500 mt-1">
                {errors.validFrom.message}
              </p>
            )}
          </div>

          {/* 10. Valid Upto */}
          <div>
            <Label text="Valid Upto : " required />
            <input
              type="date"
              className={`form-input-box ${errors.validUpto ? "border-red-500" : ""}`}
              {...register("validUpto", {
                required: "Valid Upto is required",
                validate: (v) => {
                  if (!v) return "Valid Upto is required";
                  if (watchValidFrom && v < watchValidFrom) {
                    return "Valid Upto must be on or after Valid From";
                  }
                  return true;
                },
              })}
            />
            {errors.validUpto && (
              <p className="text-sm text-red-500 mt-1">
                {errors.validUpto.message}
              </p>
            )}
          </div>

          {/* 11. OTP Based Login (checkbox) */}
          <div>
            <Label text="OTP Based Login : " />
            <div className="flex items-center gap-2 mt-3">
              <input
                id="otpBasedLogin"
                type="checkbox"
                className="w-4 h-4 accent-blue-600 cursor-pointer"
                {...register("otpBasedLogin")}
              />
              <label
                htmlFor="otpBasedLogin"
                className="text-sm text-slate-700 cursor-pointer select-none"
              >
                Enable OTP based login
              </label>
            </div>
          </div>

          {/* 12. User Type */}
          <div>
            <Label text="User Type : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.userTypeId ? "border-red-500" : ""}`}
              {...register("userTypeId", {
                required: "User Type is required",
              })}
            >
              <option value="">-- Select User Type --</option>
              {userTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.userTypeId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userTypeId.message}
              </p>
            )}
          </div>

          {/* 13. Role */}
          <div>
            <Label text="Role : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.roleId ? "border-red-500" : ""}`}
              {...register("roleId", { required: "Role is required" })}
            >
              <option value="">-- Select Role --</option>
              {roleOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.roleId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmUserList")}
          >
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmUserMst;
