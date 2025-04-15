import { useEffect, useRef } from 'react';

export default function Modal({ isModalOpen, toggleModal, children, width = "max-w-2xl" }) {
    const modalRef = useRef();

    // ESC key to close modal
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") toggleModal();
        };
        if (isModalOpen) {
            window.addEventListener("keydown", handleEsc);
        }
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isModalOpen, toggleModal]);

    // Lock scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
            console.log("Modal is open, scroll locked.");
            
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isModalOpen]);
    
    // Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                toggleModal();
            }
        };
        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen, toggleModal]);

    // if (!isModalOpen) return null;
// 
    return (
        <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4 z-50"
        role="dialog"
            aria-modal="true"
        >
            <div
                ref={modalRef}
                className={`bg-white rounded-xl shadow-2xl w-full max-h-[90vh] relative animate-fade-scale ${width} `}
            >
                {children}
            </div>
        </div>
    );
}
