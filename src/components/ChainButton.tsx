// components/ChainButton.tsx
import React from "react";

interface ChainButtonProps {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const ChainButton: React.FC<ChainButtonProps> = ({
    onClick,
    disabled = false,
    className = "",
    children,
    icon,
}) => {
    // Base styles that will always be applied
    const baseStyles = "flex-1 py-2 px-4 rounded-md font-medium cursor-pointer";

    let disabledStyles = "bg-gray-300 text-gray-500";


    // Combine all styles - putting className last to ensure it takes precedence
    const buttonStyles = disabled ? `${disabledStyles} ${className} ` : `${baseStyles} ${className}`

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={buttonStyles}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};

export default ChainButton;