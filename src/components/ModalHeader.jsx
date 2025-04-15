import { X } from 'lucide-react';

export default function ModalHeader({ data, onClose, isLoading }) {
    return (
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            {isLoading ? (
                <div className="w-full flex justify-between items-center animate-pulse">
                    <div className="h-5 w-1/2 bg-gray-200 rounded" />
                    <div className="h-5 w-5 bg-gray-200 rounded-full" />
                </div>
            ) : (
                <>
                    <h3 id="friends-modal-title" className="text-lg font-semibold text-gray-900">
                        {data.title} {data.length && (`(${data.length})`)}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close friends modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </>
            )}
        </div>
    );
}
