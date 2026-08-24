"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Paperclip } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../config";

interface SecondOpinionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  // When set (e.g. opened from a specific topic's detail page), the "Second
  // Opinion For" field is locked to this value instead of left for the user to fill in.
  topicTitle?: string;
}

export default function SecondOpinionRequestModal({ isOpen, onClose, topicTitle = "" }: SecondOpinionRequestModalProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [topicField, setTopicField] = useState(topicTitle);
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = name.trim() !== "" && mobile.trim() !== "";

  useEffect(() => {
    setTopicField(topicTitle);
  }, [topicTitle]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setMobile("");
    setEmail("");
    setMessage("");
    setFileUrl("");
    setFileName("");
    setTopicField(topicTitle);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API_URL}/api/second-opinions/uploadReport`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFileUrl(res.data.fileUrl);
      setFileName(file.name);
    } catch (error) {
      console.error("Report upload failed:", error);
      alert("Failed to upload the file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      const combinedMessage = [
        topicField.trim() ? `Second Opinion For: ${topicField.trim()}` : "",
        message.trim(),
        fileUrl ? `Uploaded Medical Report: ${fileUrl}` : ""
      ].filter(Boolean).join("\n\n");

      await axios.post(`${API_URL}/api/forms/submit`, {
        name,
        mobile,
        email,
        message: combinedMessage || "No additional details provided",
        page: topicTitle ? `Second Opinion - ${topicTitle}` : "Second Opinion Hub"
      });

      const query = new URLSearchParams({ name, mobile, department: topicField || "Second Opinion" }).toString();
      resetForm();
      onClose();
      router.push(`/thank-you?${query}`);
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-[824px] bg-white rounded-[23px] p-6 lg:p-8 shadow-2xl h-[80vh] flex flex-col font-['Poppins'] overflow-hidden"
          >
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors z-10 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center shrink-0 mb-4 flex flex-col items-center">
              <h2 className="font-semibold text-[21px] leading-[156%] text-[#663399] mb-2">
                Request a Second Opinion
              </h2>
              <p className="font-normal text-[16px] leading-[24px] text-black max-w-[702px] w-full">
                Share your details and, if you have them, your medical reports. Our specialists will review your case and get back to you.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-w-[712px] w-full mx-auto flex flex-col flex-1 justify-between min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-2"
            >
              <div>
                <label className="block font-medium text-[16px] leading-[24px] text-black mb-1">Your Name*:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Your Full Name"
                  required
                  className="w-full h-[52px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black placeholder:text-[#807090]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-medium text-[16px] leading-[24px] text-black mb-1">Mobile Number*:</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your contact number"
                    required
                    className="w-full h-[52px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black placeholder:text-[#807090]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[16px] leading-[24px] text-black mb-1">Email Address:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address (optional)"
                    className="w-full h-[52px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black placeholder:text-[#807090]"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block font-medium text-[16px] leading-[24px] text-black mb-1">Second Opinion For:</label>
                <input
                  type="text"
                  value={topicField}
                  onChange={(e) => setTopicField(e.target.value)}
                  readOnly={!!topicTitle}
                  placeholder="e.g. Hernia, Cardiac Surgery (optional)"
                  className={`w-full h-[52px] rounded-[14px] px-5 outline-none transition-all text-black placeholder:text-[#807090] ${
                    topicTitle ? "bg-[#E7DEF0] cursor-not-allowed" : "bg-[rgba(217,217,217,0.33)] focus:ring-2 focus:ring-[#663399]/50"
                  }`}
                />
              </div>

              <div className="mt-4">
                <label className="block font-medium text-[16px] leading-[24px] text-black mb-1">Upload Medical Reports:</label>
                <label className="flex items-center gap-3 h-[52px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 cursor-pointer">
                  <Paperclip className="w-4 h-4 shrink-0 text-[#663399]" />
                  <span className="truncate flex-1 text-black">
                    {isUploading ? "Uploading..." : fileName || "Choose File (optional)"}
                  </span>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div className="mt-4">
                <label className="block font-medium text-[16px] leading-[24px] text-black mb-1">Message:</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Briefly describe your health concern (optional)"
                  rows={3}
                  className="w-full bg-[rgba(217,217,217,0.33)] rounded-[14px] p-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black placeholder:text-[#807090] resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full h-[64px] bg-[linear-gradient(90deg,#0066A9_0%,#663399_100%)] rounded-[14px] text-white font-semibold text-[21px] flex items-center justify-center transition-all shadow-md mt-6 shrink-0 ${
                  isFormValid && !isSubmitting ? "hover:opacity-90" : "opacity-50 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Request a Second Opinion"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
