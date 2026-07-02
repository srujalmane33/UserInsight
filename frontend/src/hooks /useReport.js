import { useState } from "react";
import { generateReport } from "../services/api";

const useReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async (jsonData) => {
    try {
      setLoading(true);
      setError("");

      const data = await generateReport(jsonData);

      setReport(data);
    } catch (err) {
      const serverError = err.response?.data?.error || err.message || "Unknown error";
      setError(`Failed to generate report: ${serverError}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    report,
    loading,
    error,
    fetchReport,
  };
};

export default useReport;