import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";

const FrmViewDocument = () => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const [searchParams] = useSearchParams();

  const [blobUrl, setBlobUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const ulbId = user?.ulbId;
  const applicationId = searchParams.get("appId");
  const applicationNo = searchParams.get("appNo");

  useEffect(() => {
    if (!ulbId || !applicationId || !applicationNo) return;

    const fetchDocument = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await apiService.get(
          `/transaction/getOwnershipDoc?ulbId=${ulbId}` +
            `&applicationId=${applicationId}` +
            `&applicationNo=${encodeURIComponent(applicationNo)}`,
        );

        if (!res?.success || !res?.data?.length) {
          setErrorMsg("No document found for this application");
          return;
        }

        const doc = res.data[0];
        const fileBase64 = doc.fileBase64;
        const mimeType = doc.mimeType || "application/pdf";

        if (!fileBase64) {
          setErrorMsg("Document content is empty");
          return;
        }

        // base64 → bytes → Blob → blob: URL
        const byteChars = atob(fileBase64);
        const bytes = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          bytes[i] = byteChars.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        setBlobUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Fetch document error:", err);
        setErrorMsg(err.message || "Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [ulbId, applicationId, applicationNo, setLoading]);

  // Cleanup blob URL when component unmounts / URL changes
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  if (errorMsg) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#b91c1c" }}>
        {errorMsg}
      </div>
    );
  }

  if (!blobUrl) {
    return <div style={{ padding: 20, textAlign: "center" }}>Loading...</div>;
  }

  return (
    <iframe
      src={blobUrl}
      title="Document"
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
};

export default FrmViewDocument;
