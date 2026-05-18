"use client";
export const dynamic = "force-dynamic";

import { useState, ChangeEvent, FormEvent, ReactElement } from "react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function Footer(): ReactElement {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<string>("");

  // 🚀 Replace with your FastAPI deployment URL
  const BACKEND_URL = "http://localhost:8000/api/contact";

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: { message?: string; detail?: string } = await res.json();

      if (res.ok) {
        setStatus(data.message || "Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(data.detail || "Failed to send message.");
      }
    } catch {
      setStatus("Error sending message. Please try again.");
    }
  };

  return (
    <footer id="footer" className="w-full text-black py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: About Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">About Us</h2>
          <p className="text-gray-400 mb-4">
            © {new Date().getFullYear()} Team Metro_Minds. Want to hire us or
            contact us for anything? Please leave a message! Thank you for
            visiting our page!
          </p>
        </div>

        {/* Right: Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Send Me a Message</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none 
              transition-all duration-300 ease-in-out
              focus:border-blue-500 focus:ring-2 focus:ring-blue-300
              hover:border-blue-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none 
              transition-all duration-300 ease-in-out
              focus:border-blue-500 focus:ring-2 focus:ring-blue-300
              hover:border-blue-400"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none 
              transition-all duration-300 ease-in-out
              focus:border-blue-500 focus:ring-2 focus:ring-blue-300
              hover:border-blue-400"
              required
            ></textarea>

            <button
              type="submit"
              className="px-4 py-2 bg-white text-black rounded font-medium hover:bg-gray-200 transition"
            >
              Send
            </button>

            {status && <p className="text-sm text-gray-400">{status}</p>}
          </form>
        </div>
      </div>
    </footer>
  );
}
