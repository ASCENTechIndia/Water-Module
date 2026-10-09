import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import ConfigTable from "../../../Components/ConfigTable.jsx";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService.js";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";

const FrmMenuMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const menuId = state?.menuId;
  const isEdit = state?.isEdit || !!menuId;

  // ---------- Dropdown state ----------
  const [parentMenuOptions, setParentMenuOptions] = useState([]);

  // ---------- Checkbox table state ----------
  const [tableRows, setTableRows] = useState([]);
  const [checkedMap, setCheckedMap] = useState({});
  const [prevStatusMap, setPrevStatusMap] = useState({});

  const TABLE_KEY_MAPPING = {
    id: "ULBID",
    columns: {
      ULBNAME: "नगरपालिकेचे नाव",
    },
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      pageTitle: "",
      parentMenuId: "",
      pagePath: "",
      pageType: "",
    },
  });

  // ---------- Load Parent Menu dropdown (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService.get("getParentMenuDropdown") later
    const dummyParentMenus = [
      { value: "1", label: "Master" },
      { value: "2", label: "Configuration" },
      { value: "3", label: "Inward" },
      { value: "4", label: "Outward" },
      { value: "5", label: "Reports" },
    ];
    setParentMenuOptions(dummyParentMenus);

    // 🔸 REAL API — uncomment when ready
    // const fetchParentMenus = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getParentMenuDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setParentMenuOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.MENUID),
    //           label: item.MENUTITLE,
    //         })),
    //       );
    //     } else {
    //       setParentMenuOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("Parent menu dropdown error:", err);
    //     setParentMenuOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchParentMenus();
  }, []);

  // ---------- Load ULB checkbox table (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService call later
    const dummyUlbs = [
      { ULBID: 1, ULBNAME: "Pune Municipal Corporation" },
      { ULBID: 2, ULBNAME: "Mumbai Municipal Corporation" },
      { ULBID: 3, ULBNAME: "Nashik Municipal Corporation" },
      { ULBID: 4, ULBNAME: "Nagpur Municipal Corporation" },
    ];

    const rows = dummyUlbs;
    setTableRows(rows);

    // For a fresh Add page: all unchecked
    const checked = {};
    const prev = {};
    rows.forEach((row) => {
      const id = row[TABLE_KEY_MAPPING.id];
      checked[id] = false;
      prev[id] = "N";
    });
    setCheckedMap(checked);
    setPrevStatusMap(prev);

    // 🔸 REAL API — uncomment when ready
    // const fetchConfigData = async () => {
    //   try {
    //     setLoading(true);
    //     const [tableRes, selectedRes] = await Promise.all([
    //       apiService.get("getUlbList"),
    //       menuId
    //         ? apiService.post("getMenuSelectedUlbs", { menuId: Number(menuId) })
    //         : Promise.resolve({ data: { success: true, data: [] } }),
    //     ]);
    //     ...
    //   } catch (err) { ... }
    // };
    // fetchConfigData();
  }, [menuId]);

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!menuId) return;

    // 🔸 DUMMY — replace with apiService.post("getMenuDetail", { menuId: Number(menuId) })
    const dummyDetail = {
      NUM_MENU_ID: menuId,
      VAR_MENU_TITLE: "Sender",
      NUM_MENU_PARENTID: "1",
      VAR_MENU_PAGEPATH: "/Masters/FrmSenderList",
      VAR_MENU_PAGETYPE: "Master",
    };

    reset({
      pageTitle: dummyDetail.VAR_MENU_TITLE || "",
      parentMenuId: String(dummyDetail.NUM_MENU_PARENTID || ""),
      pagePath: dummyDetail.VAR_MENU_PAGEPATH || "",
      pageType: dummyDetail.VAR_MENU_PAGETYPE || "",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getMenuDetail", {
    //       menuId: Number(menuId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         pageTitle: d.VAR_MENU_TITLE || "",
    //         parentMenuId: String(d.NUM_MENU_PARENTID || ""),
    //         pagePath: d.VAR_MENU_PAGEPATH || "",
    //         pageType: d.VAR_MENU_PAGETYPE || "",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Menu detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Menu detail error:", err);
    //     alert("Failed to fetch menu detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [menuId, reset]);

  // ---------- Checkbox handlers ----------
  const handleToggle = (id, checked) => {
    setCheckedMap((prev) => ({ ...prev, [id]: checked }));
  };

  const handleToggleAll = (checked) => {
    const newMap = {};
    const idKey = TABLE_KEY_MAPPING.id;
    tableRows.forEach((row) => {
      newMap[row[idKey]] = checked;
    });
    setCheckedMap(newMap);
  };

  // ---------- Submit ----------
  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    try {
      setLoading(true);

      // Build ULB string: ULBID#prevStatus#currentStatus$
      const in_ulbstr = tableRows
        .map((row) => {
          const id = row[TABLE_KEY_MAPPING.id];
          const prevStatus = prevStatusMap[id] || "N";
          const currentStatus = checkedMap[id] ? "Y" : "N";
          return `${id}#${prevStatus}#${currentStatus}`;
        })
        .join("$");

      const ip = await GetIPAddress();

      const payload = {
        in_UserId: userId,
        in_Mode: isEdit ? 2 : 1,
        in_MenuId: isEdit ? Number(menuId) : null,
        in_MenuTitle: data.pageTitle.trim(),
        in_ParentId: data.parentMenuId ? Number(data.parentMenuId) : null,
        in_PagePath: data.pagePath.trim(),
        in_PageType: data.pageType,
        in_ulbstr: in_ulbstr,
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Menu payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmMenuList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_menu_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmMenuList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save menu",
      //   );
      // }
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Menu Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Menu Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Page Title */}
          <div>
            <Label text="Page Title : " required />
            <input
              type="text"
              placeholder="Enter page title"
              className={`form-input-box ${
                errors.pageTitle ? "border-red-500" : ""
              }`}
              {...register("pageTitle", {
                required: "Page title is required",
                validate: (v) =>
                  v.trim().length > 0 || "Page title cannot be empty",
              })}
            />
            {errors.pageTitle && (
              <p className="text-sm text-red-500 mt-1">
                {errors.pageTitle.message}
              </p>
            )}
          </div>

          {/* Parent Menu */}
          <div>
            <Label text="Parent Menu : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.parentMenuId ? "border-red-500" : ""}`}
              {...register("parentMenuId", {
                required: "Parent menu is required",
              })}
            >
              <option value="">-- Select Parent Menu --</option>
              {parentMenuOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.parentMenuId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.parentMenuId.message}
              </p>
            )}
          </div>

          {/* Page Path */}
          <div>
            <Label text="Page Path : " required />
            <input
              type="text"
              placeholder="Enter page path"
              className={`form-input-box ${
                errors.pagePath ? "border-red-500" : ""
              }`}
              {...register("pagePath", {
                required: "Page path is required",
                validate: (v) =>
                  v.trim().length > 0 || "Page path cannot be empty",
              })}
            />
            {errors.pagePath && (
              <p className="text-sm text-red-500 mt-1">
                {errors.pagePath.message}
              </p>
            )}
          </div>

          {/* Page Type - Radio */}
          <div>
            <Label text="Page Type : " required />
            <div className="flex flex-wrap items-center gap-6 mt-2">
              {["Master", "व्यवहार", "अहवाल"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer text-sm text-slate-700"
                >
                  <input
                    type="radio"
                    value={type}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                    {...register("pageType", {
                      required: "Page type is required",
                    })}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
            {errors.pageType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.pageType.message}
              </p>
            )}
          </div>
        </div>

        {tableRows?.length > 0 && (
          <ConfigTable
            rows={tableRows}
            checkedMap={checkedMap}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            tableKeyMapping={TABLE_KEY_MAPPING}
          />
        )}

        <div className="flex justify-center gap-3">
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmMenuList")}
          >
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmMenuMst;