import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Shapes,
  BaggageClaim,
  Boxes,
  HandCoinsIcon,
  ClipboardList,
  ChevronDown,
  Warehouse,
} from "lucide-react";
import SidebarItem from "../../Components/SidebarItem";

const iconMap = {
  Default: Shapes,
};

const STATIC_MENU = [
  {
    MENUID: 1,
    MENUTITLE: "Master",
    children: [
      {
        MENUID: 101,
        MENUTITLE: "Menu Master",
        PAGEPATH: "/Masters/FrmMenuList",
      },
      {
        MENUID: 102,
        MENUTITLE: "User Access",
        PAGEPATH: "/Masters/FrmUserAccessNewList",
      },
      {
        MENUID: 103,
        MENUTITLE: "User Creation",
        PAGEPATH: "/Masters/FrmUserList",
      },
      {
        MENUID: 104,
        MENUTITLE: "Ward Master",
        PAGEPATH: "/Masters/FrmWardList",
      },
      {
        MENUID: 105,
        MENUTITLE: "Zone Master",
        PAGEPATH: "/Masters/FrmZoneList",
      },
      {
        MENUID: 106,
        MENUTITLE: "Block Master",
        PAGEPATH: "/Masters/FrmBlockList",
      },
      {
        MENUID: 107,
        MENUTITLE: "Bank List",
        PAGEPATH: "/Masters/FrmBankList",
      },
      {
        MENUID: 108,
        MENUTITLE: "Rate Master",
        PAGEPATH: "/Masters/FrmRateList",
      },
      {
        MENUID: 109,
        MENUTITLE: "ULB Tip Master",
        PAGEPATH: "/Masters/FrmUlbTipList",
      },
      {
        MENUID: 110,
        MENUTITLE: "Usage Type Master",
        PAGEPATH: "/Masters/FrmUsageTypeList",
      },
    ],
  },
  {
    MENUID: 2,
    MENUTITLE: "Configuration",
    children: [
      {
        MENUID: 201,
        MENUTITLE: "Premise Type Configuration",
        PAGEPATH: "/Masters/FrmPremiseTypeConfig",
      },
      {
        MENUID: 202,
        MENUTITLE: "Usage Type Configuration",
        PAGEPATH: "/Masters/FrmUsageTypeConfig",
      },
      {
        MENUID: 203,
        MENUTITLE: "Usage Subtype Configuration",
        PAGEPATH: "/Masters/FrmUsageSubTypeConfig",
      },
      {
        MENUID: 204,
        MENUTITLE: "Billing Method Configuration",
        PAGEPATH: "/Masters/FrmBillingMethodConfig",
      },
      {
        MENUID: 205,
        MENUTITLE: "Consumer Type Configuration",
        PAGEPATH: "/Masters/FrmConsumerTypeConfig",
      },
      {
        MENUID: 206,
        MENUTITLE: "Conn Code Configuration",
        PAGEPATH: "/Masters/FrmConnCodeConfig",
      },
      {
        MENUID: 207,
        MENUTITLE: "Meter Owner Configuration",
        PAGEPATH: "/Masters/FrmMeterOwnerConfig",
      },
      {
        MENUID: 208,
        MENUTITLE: "Bank Configuration",
        PAGEPATH: "/Masters/FrmBankConfig",
      },
      {
        MENUID: 209,
        MENUTITLE: "Billing Frequency Configuration",
        PAGEPATH: "/Masters/FrmBillingFrequencyConfig",
      },
      {
        MENUID: 210,
        MENUTITLE: "Connection Size Configuration",
        PAGEPATH: "/Masters/FrmConnSizeConfig",
      },
      {
        MENUID: 211,
        MENUTITLE: "Connection Status Configuration",
        PAGEPATH: "/Masters/FrmConnStatusConfig",
      },
      {
        MENUID: 212,
        MENUTITLE: "Meter Gap Code Configuration",
        PAGEPATH: "/Masters/FrmConnStatusConfig",
      },
      {
        MENUID: 213,
        MENUTITLE: "Tax Configuration",
        PAGEPATH: "/Masters/FrmTaxMasterConfig",
      },
      {
        MENUID: 214,
        MENUTITLE: "Connection Type Configuration",
        PAGEPATH: "/Masters/FrmConnTypeConfig",
      },
      {
        MENUID: 215,
        MENUTITLE: "Collection Center Configuration",
        PAGEPATH: "/Masters/FrmCollcenterConfig",
      },
      {
        MENUID: 216,
        MENUTITLE: "Service Configuration",
        PAGEPATH: "/Masters/FrmServiceConfig",
      },
      {
        MENUID: 217,
        MENUTITLE: "Charges Type Configuration",
        PAGEPATH: "/Masters/FrmChargesTypeConfig",
      },
      {
        MENUID: 218,
        MENUTITLE: "Service Rate Configuration List",
        PAGEPATH: "/Masters/FrmServiceRateConfigList"
      }
    ],
  },
  {
    MENUID: 3,
    MENUTITLE: "Water",
    children: [
      {
        MENUID: 301,
        MENUTITLE: "Connection Master",
        PAGEPATH: "/Transaction/FrmConnSearch"
      },
    ] 
  },
  {
    MENUID: 4,
    MENUTITLE: "Search",
    children: [
      {
        MENUID: 401,
        MENUTITLE: "Search Receipt",
        PAGEPATH: "/Transaction/FrmSearchReciptList"
      },
      {
        MENUID: 402,
        MENUTITLE: "Connection Search",
        PAGEPATH: "/ReportsForm/FrmConnectionSearch"
      }
    ]
  },
  {
    MENUID: 5,
    MENUTITLE: "Transaction",
    children: [
      {
        MENUID: 501,
        MENUTITLE: "Bill Generation",
        PAGEPATH: "/Transaction/FrmBillGeneration"
      },
      {
        MENUID: 502,
        MENUTITLE: "Receipt Delete Auth List",
        PAGEPATH: "/Transaction/FrmReceiptDeleteAuthList"
      }
    ]
  }
];

const Navbar = ({ title = "Water", isOpen, onClose }) => {
  const [openSectionId, setOpenSectionId] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const activeSection = STATIC_MENU.find((section) =>
      section.children?.some((item) => item.PAGEPATH === pathname),
    );
    if (activeSection) {
      setOpenSectionId(activeSection.MENUID);
    }
  }, [pathname]);

  const toggleSection = (menuId) => {
    setOpenSectionId((prev) => (prev === menuId ? null : menuId));
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={() => onClose && onClose()}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      <aside
        className={`fixed md:relative top-0 left-0 z-50 h-screen w-64 flex flex-col
          bg-white border-r border-slate-200
          shadow-[2px_0_12px_-4px_rgba(15,23,42,0.06)]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:-ml-64 md:translate-x-0"}`}
      >
        {/* ---------- Brand Header ---------- */}
        <div className="flex-shrink-0 h-16 flex items-center gap-2.5 px-5 border-b border-slate-200 bg-white">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
            <Warehouse className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold text-slate-800 tracking-tight">
              {title}
            </span>
          </div>
        </div>

        {/* ---------- Navigation ---------- */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Home */}
          <div className="mb-4">
            <SidebarItem
              icon={LayoutDashboard}
              label="Home"
              path="/dashboard"
              isOpen={true}
              onClick={() => onClose && onClose()}
            />
          </div>

          {/* Section label */}
          {STATIC_MENU.length > 0 && (
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Modules
            </p>
          )}

          {/* Accordion Menu */}
          <div className="space-y-1">
            {STATIC_MENU.map((section) => {
              const isOpenSection = openSectionId === section.MENUID;

              return (
                <div key={section.MENUID}>
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.MENUID)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                      text-[13px] font-semibold text-slate-600
                      hover:bg-slate-50 hover:text-slate-800
                      transition-colors duration-150 group"
                  >
                    <span className="tracking-tight text-[14px]">
                      {section.MENUTITLE}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 group-hover:text-slate-600
                        transition-transform duration-300
                        ${isOpenSection ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Children */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                      ${isOpenSection ? "opacity-100 mt-1" : "max-h-0 opacity-0"}`}
                  >
                    <div className="ml-3 pl-3 border-l border-slate-200 space-y-1">
                      {(section.children || []).map((item) => {
                        const Icon = iconMap[item.MENUTITLE] || iconMap.Default;
                        return (
                          <SidebarItem
                            key={item.MENUID}
                            icon={Icon}
                            label={item.MENUTITLE}
                            path={item.PAGEPATH}
                            isOpen={true}
                            onClick={() => onClose && onClose()}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* ---------- Footer ---------- */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-slate-200 bg-slate-50/60">
          <p className="text-[10px] text-slate-400 font-medium text-center">
            © {new Date().getFullYear()} · v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
