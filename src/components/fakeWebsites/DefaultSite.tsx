import BrowserNavBar from "@/components/fakeWebsites/BrowserNavBar";
import { FakeWebsiteComponentProps } from "@/types";

export default function DefaultSite() {
    return (
        <div className="max-w-6xl mx-auto border rounded-lg shadow-md overflow-hidden">
            <BrowserNavBar url="https://example.com" />

            <div className="bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Welcome to Example.com</h2>

                <p className="mb-6 text-gray-700">
                    This is a simulated website for demonstration purposes.
                </p>
            </div>
        </div>
    );
};