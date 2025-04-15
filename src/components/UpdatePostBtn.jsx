import { Pencil } from "lucide-react";
export default function UpdatePostBtn({ handelUpdatePost, setShowActions }) {
    return (
        <button
            onClick={() => {
                setShowActions(false);
                handelUpdatePost();
            }}
            className="w-full flex items-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
        >
            <Pencil className="w-4 h-4 mr-2" /> Edit
        </button>
    )
}  