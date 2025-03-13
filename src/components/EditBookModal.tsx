import { useState, useEffect } from "react";
import { Book } from "../models/Book";
import Button from "./Button";
import { validateForm, Errors } from "../utils/validation";
import { fetchLanguages, fetchGenres } from "../api/BookService";
import { Author } from "../models/Author";

interface EditBookModalProps {
    book: Book;
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: { id: number, title: string; authors: Author[]; description: string; language: string; publicationDate: string; genres: string[]; }) => Promise<void>;
}

function EditBookModal({ book, isOpen, onClose, onSave }: EditBookModalProps) {
    const [formData, setFormData] = useState<{
        id: number,
        title: string;
        authors: Author[];
        description: string;
        language: string;
        publicationDate: string;
        genres: string[];
        coverImg: string;
    }>({
        id: book.id,
        title: "",
        authors: [],
        description: "",
        language: "",
        publicationDate: "",
        genres: [],
        coverImg: "",
    });

    const [errors, setErrors] = useState<Errors>({
        title: "",
        authors: "",
        description: "",
        language: "",
        publicationDate: "",
        genres: "",
    });

    const [languages, setLanguages] = useState<string[]>([]);
    const [availableGenres, setAvailableGenres] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedLanguages = await fetchLanguages();
                const fetchedGenres = await fetchGenres();
                setLanguages(fetchedLanguages);
                setAvailableGenres(fetchedGenres);
            } catch (error) {
                console.error("Error fetching languages and genres:", error);
            }
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        if (book) {
            setFormData({
                id: book.id,
                title: book.title,
                authors: book.authors || [],
                description: book.description,
                language: book.language,
                publicationDate: book.publicationDate,
                genres: book.genres,
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

    const handleGenreSelect = (genre: string) => {
        if (!formData.genres.includes(genre)) {
            setFormData((prev) => ({
                ...prev,
                genres: [...prev.genres, genre],
            }));
        }
    };

    const handleGenreRemove = (genre: string) => {
        setFormData((prev) => ({
            ...prev,
            genres: prev.genres.filter((selectedGenre) => selectedGenre !== genre),
        }));
    };

    const handleAuthorChange = (index: number, field: keyof Author, value: string) => {
        const updatedAuthors = [...formData.authors];
        updatedAuthors[index] = { ...updatedAuthors[index], [field]: value };
        setFormData({ ...formData, authors: updatedAuthors });
    };

    const addAuthor = () => {
        setFormData({
            ...formData,
            authors: [...formData.authors, { firstName: "", lastName: "" }],
        });
    };

    const removeAuthor = (index: number) => {
        setFormData({
            ...formData,
            authors: formData.authors.filter((_, i) => i !== index),
        });
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
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative max-h-[80vh] overflow-y-auto">
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

                    <label className="text-lg">Title</label>
                    <input className="w-full p-2 border rounded" name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    
                    <div>
                        <label className="text-lg">Authors</label>
                        {formData.authors.map((author, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={author.firstName}
                                    onChange={(e) => handleAuthorChange(index, "firstName", e.target.value)}
                                    className="w-1/2 p-2 border rounded">
                                </input>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={author.lastName}
                                    onChange={(e) => handleAuthorChange(index, "lastName", e.target.value)}
                                    className="w-1/2 p-2 border rounded">
                                </input>
                                <button
                                type="button"
                                onClick={() => removeAuthor(index)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >✖
                                </button>
                            </div>
                        ))}
                        <button
                        type="button"
                        onClick={addAuthor}
                        className="bg-[#8075FF] text-white px-2 py-1 rounded hover:bg-[#7971d0]"
                        >+ Add Author
                        </button>
                    </div>
                    {errors.authors && <p className="text-red-500 text-sm">{errors.authors}</p>}

                    <label className="text-lg">Description</label>
                    <textarea className="w-full p-2 border rounded" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

                    <label className="text-lg">Language</label>
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

                    <label className="text-lg">Publication Date</label>
                    <input className="w-full p-2 border rounded" type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} />
                    {errors.publicationDate && <p className="text-red-500 text-sm">{errors.publicationDate}</p>}

                    <div className="flex flex-col space-y-2">
                        <label className="text-lg">Genres</label>
                        <select
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleGenreSelect(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>Select Genre</option>
                            {availableGenres.map((genre, index) => (
                                <option key={index} value={genre}>
                                    {genre}
                                </option>
                            ))}
                        </select>
                        {errors.genres && <p className="text-red-500 text-sm">{errors.genres}</p>}

                        <div className="flex gap-2 flex-wrap">
                            {formData.genres.map((genre, index) => (
                                <span
                                    key={index}
                                    className="bg-[#ebe9ff] text-[#8075FF] px-2 py-1 rounded-full flex items-center gap-1"
                                >
                                    {genre}
                                    <button
                                        type="button"
                                        className="text-[#8075FF] hover:text-[#3c3776]"
                                        onClick={() => handleGenreRemove(genre)}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

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
