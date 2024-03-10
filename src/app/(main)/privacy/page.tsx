import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const page = () => {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="mb-6 text-3xl font-semibold">Privacy Policy</h1>
      <p className="mb-4">
        This Privacy Policy describes how StorySpire collects, uses, and
        discloses your personal information when you use our blogging platform
        located at{" "}
        <a href={BASE_URL} className="font-medium underline">
          {BASE_URL}
        </a>{" "}
      </p>

      <Separator className="my-6" />
      <h2 className="mb-2 text-xl font-semibold">1. Information We Collect</h2>
      <Separator className="my-2" />

      <p className="mb-4">
        We may collect personal information that you provide to us when you
        register an account, comment on blog posts, or interact with the
        Service. This may include:
      </p>
      <ul className="mb-4 list-disc pl-6">
        <li>Name</li>
        <li>Email address</li>
        <li>IP address</li>
        <li>User-generated content (e.g., comments, posts)</li>
      </ul>

      <p className="mb-4">
        We may automatically collect certain information about your device and
        your <span className="font-medium">public IP address</span>.
      </p>

      <h2 className="mb-2 text-xl font-semibold">2. Use of Information</h2>
      <Separator className="my-2" />

      <p className="mb-4">
        We may use the information we collect for various purposes, including:
      </p>
      <ul className="mb-4 list-disc pl-6">
        <li>Providing and maintaining the Service</li>
        <li>Personalizing your experience on the Service</li>
        <li>Analyzing and improving the Service</li>
      </ul>

      <h2 className="mb-2 text-xl font-semibold">3. Data Security</h2>
      <Separator className="my-2" />
      <p className="mb-4">
        We take reasonable measures to protect the security of your personal
        information. However, please be aware that no method of transmission
        over the Internet or method of electronic storage is 100% secure.
      </p>
    </div>
  );
};

export default page;
