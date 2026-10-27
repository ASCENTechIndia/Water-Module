import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import Table from "../../../Components/Table";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import Button from "../../../Components/Button";

const FrmChangeOwnership = () => {
    const { user } = useAuth();
    const ulbId = user?.ulbId;
    const userId = user?.userId;
    const prabhagId = user?.prabhagID;
    const deptId = user?.deptId;
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        watch,
        handleSubmit,
        setValue,
        reset,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            wardName: "",
            zoneName: "",
            blockName: "",
            applicationNumber: "",
            consumerNumber: "",
            applicantName: "",
            oldOwnerName: "",
            newOwnerName: "",
            oldAddress: "",
            newAddress: "",
            service: "",
            applicableAmt: "",
            attachedDoc: "",
            fees: ""
        }
    });


    const [wardOptions, setWardOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [blockOptions, setBlockOptions] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([]);

    const [searchedData, setSearchedData] = useState([]);

    return (
        <Layout
            title="Change Ownership"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Change Ownership"
            }}
        >
            <form
                className="w-full space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label
                            text={"Ward"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("wardName")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {wardOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.wardName &&
                            <div className="mt-3 text-red-500">
                                {errors.wardName.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Zone"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("zoneName")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {zoneOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.zoneName &&
                            <div className="mt-3 text-red-500">
                                {errors.zoneName.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Block"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("blockName")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {blockOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.blockName &&
                            <div className="mt-3 text-red-500">
                                {errors.blockName.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Application Number"}
                            required
                        />
                        <input
                            type="text"
                            {...register("applicationNumber")}
                            className="form-input-box"
                        />
                        {/* {errors.applicationNumber &&
                            <div className="mt-3 text-red-500">
                                {errors.applicationNumber.message}
                            </div>
                        } */}
                    </div>
                    <div>
                        <Label
                            text={"Consumer Number"}
                            required
                        />
                        <input
                            type="text"
                            {...register("consumerNumber")}
                            className="form-input-box"
                        />
                        {errors.consumerNumber &&
                            <div className="mt-3 text-red-500">
                                {errors.consumerNumber.message}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button type="button">
                        Search
                    </Button>
                </div>

                {true && (
                    <>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <Label
                                    text="Applicant Name"
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("applicantName", {
                                        required: "Applicant Name is required"
                                    })}
                                    className="form-input-box"
                                />
                                {errors.applicantName &&
                                    <div className="mt-3 text-red-400">
                                        {errors.applicantName.message}
                                    </div>
                                }
                            </div>

                            <div>
                                <Label
                                    text={"Old Owner Name"}
                                />
                                <input
                                    type="text"
                                    {...register("oldOwnerName")}
                                    className="form-input-box"
                                />
                            </div>
                            <div>
                                <Label
                                    text={"New Owner Name"}
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("newOwnerName", {
                                        required: "New Owner Name is required"
                                    })}
                                    className="form-input-box"
                                />
                                {errors.newOwnerName &&
                                    <div className="mt-3 text-red-400">
                                        {errors.newOwnerName.message}
                                    </div>
                                }
                            </div>
                            <div>
                                <Label
                                    text={"Old Address"}
                                />
                                <input
                                    type="text"
                                    {...register("oldAddress")}
                                    className="form-input-box"
                                />
                            </div>
                            <div>
                                <Label
                                    text={"New Address"}
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("newAddress", {
                                        required: "New Address is required"
                                    })}
                                    className="form-input-box"
                                />
                                {errors.newAddress &&
                                    <div className="mt-3 text-red-400">
                                        {errors.newAddress.message}
                                    </div>
                                }
                            </div>
                            <div>
                                <Label
                                    text={"Service"}
                                    required
                                />
                                <select
                                    className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                    {...register("service")}
                                >
                                    <option value="">
                                        -- Select --
                                    </option>

                                    {serviceOptions.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.service &&
                                    <div className="mt-3 text-red-500">
                                        {errors.service.message}
                                    </div>
                                }
                            </div>
                            <div>
                                <Label
                                    text={"Amount Applicable"}
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("applicableAmt")}
                                    className="form-input-box"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                    }}
                                />
                            </div>
                            <div>
                                <Label text="Attached Document" required />

                                <div className="mt-1 flex items-center gap-3">
                                    <label
                                        htmlFor="attachedDoc"
                                        className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                                    >
                                        Choose File
                                    </label>

                                    <span className="text-sm text-gray-500">
                                        {watch("attachedDoc")?.[0]?.name || "No file chosen"}
                                    </span>

                                    <input
                                        id="attachedDoc"
                                        type="file"
                                        accept="*"
                                        className="hidden"
                                        {...register("attachedDoc", {
                                            required: "Document is required",
                                        })}
                                    />
                                </div>

                                {errors.attachedDoc && (
                                    <div className="mt-2 text-sm text-red-500">
                                        {errors.attachedDoc.message}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-3">
                            <Table
                                headers={[]}
                                data={[]}
                            />
                        </div>
                        <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                            <Button type="submit">
                                Submit
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    reset();
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </Layout>
    )
}

export default FrmChangeOwnership;