import { useState, useEffect } from "react";
import { Book } from "../models/Book";
import Button from "./Button";
import { validateForm, Errors } from "../utils/validation";

interface EditBookModalProps {
    book: Book;
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: { title: string; authorFirstName: string; authorLastName: string; description: string; language: string; publicationDate: string; genres: string; }) => Promise<void>;
}

function EditBookModal({ book, isOpen, onClose, onSave }: EditBookModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        authorFirstName: "",
        authorLastName: "",
        description: "",
        language: "",
        publicationDate: "",
        genres: "",
        coverImg: "",
    });

    const [errors, setErrors] = useState<Errors>({
        title: "",
        authorFirstName: "",
        authorLastName: "",
        description: "",
        language: "",
        publicationDate: "",
        genres: "",
    });

    const languages = ["English", "Norwegian", "Danish", "Swedish", "Spanish", "French", "German"];

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                authorFirstName: book.authorFirstName,
                authorLastName: book.authorLastName,
                description: book.description,
                language: book.language,
                publicationDate: book.publicationDate,
                genres: book.genres.join(", "),
                coverImg: book.coverImg || "",
            });
        }
    }, [book]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({ ...prev, coverImg: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, coverImg: "" }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { isValid, errors } = validateForm(formData);
        if (isValid) {
            await onSave(formData);
            onClose();
        }
        setErrors(errors);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-xs z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                <h2 className="text-2xl mb-4">Edit Book</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center">
                        {formData.coverImg ? (
                            <div className="relative">
                                <img src={formData.coverImg} alt="Book Cover" className="w-40 h-60 object-cover rounded-lg" />
                                <button type="button" className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded" onClick={handleRemoveImage}>
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <label className="w-40 h-60 flex items-center justify-center bg-gray-200 text-gray-600 border border-gray-400 rounded-lg cursor-pointer">
                                <span>Upload Cover</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>

                    <input className="w-full p-2 border rounded" name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

                    <input className="w-full p-2 border rounded" name="authorFirstName" value={formData.authorFirstName} onChange={handleChange} placeholder="Author First Name" />
                    {errors.authorFirstName && <p className="text-red-500 text-sm">{errors.authorFirstName}</p>}

                    <input className="w-full p-2 border rounded" name="authorLastName" value={formData.authorLastName} onChange={handleChange} placeholder="Author Last Name" />
                    {errors.authorLastName && <p className="text-red-500 text-sm">{errors.authorLastName}</p>}

                    <textarea className="w-full p-2 border rounded" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    
                    <select
                        className="w-full p-2 border rounded"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select Language</option>
                        {languages.map((language) => (
                            <option key={language} value={language}>
                                {language}
                            </option>
                        ))}
                    </select>
                    {errors.language && <p className="text-red-500 text-sm">{errors.language}</p>}

                    <input className="w-full p-2 border rounded" type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} />
                    {errors.publicationDate && <p className="text-red-500 text-sm">{errors.publicationDate}</p>}

                    <input className="w-full p-2 border rounded" name="genres" value={formData.genres} onChange={handleChange} placeholder="Genres" />
                    {errors.genres && <p className="text-red-500 text-sm">{errors.genres}</p>}
                    
                    <div className="flex justify-end gap-2">
                        <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded-lg" onClick={onClose}>Cancel</button>
                        <Button text="Save" />
                    </div>
                </form>
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-lg">✖</button>
            </div>
        </div>
    );
}

export default EditBookModal;
