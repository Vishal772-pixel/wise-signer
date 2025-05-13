import { FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="w-full border-t border-gray-200 py-6 px-4 md:px-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                    <h2 className="text-lg font-medium">
                        Wise Signer
                    </h2>
                    <p className="ml-2 text-sm">by Cyfrin </p>
                </div>

                <div className="flex items-center space-x-6">
                    <a href="https://twitter.com/cyfrinaudits" className="hover:text-gray-600 transition">
                        X / Twitter
                    </a>
                    <a
                        href="https://github.com/cyfrin/wise-signer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors border-2 border-zinc-600 hover:border-zinc-500"
                    >
                        <FaGithub className="h-6 w-6 text-white" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;