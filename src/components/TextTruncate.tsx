import { useState } from "react";

interface TextTruncateProps {
    text: string;
    maxLength: number;
}

const TextTruncate: React.FC<TextTruncateProps> = ({ text, maxLength }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const truncatedText = text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    return (
        <div>
            <p className="text-lg">
                {isExpanded ? text : truncatedText}
            </p>
            {text.length > maxLength && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-500 hover:text-blue-700 text-sm mt-2 underline"
                >
                    {isExpanded ? "See Less" : "Read More"}
                </button>
            )}
        </div>
    );
}

export default TextTruncate;