import Button from "../components/Button";
import Pending from "../components/Pending";

function BookDetails() {
    return (
        <div className="flex gap-20 m-10">
            <div>
                <img className="rounded-lg" src='default_book.webp'></img>
            </div>
            <div className="flex flex-col gap-5">
                <h1 className="text-5xl text-black">Book Title</h1>
                <p>Author Name</p>
                <p>978-3-16-148410-0</p>
                <p>A Story of Yesterday is a concise and straight punch to the jaw of life. Under a sky of different colors germinates a magical story of survival, where the result of each choice, enclosed in this particular tale, will snatch the whereabouts of each story forever.</p>
                <hr></hr>
                <div className='flex flex-row gap-2'>
                    <p>Language:</p>
                    <p>English</p>
                </div>
                <div className='flex flex-row gap-2'>
                    <p>Publication date:</p>
                    <p>06.02.2014</p>
                </div>
                <div className='flex flex-row gap-2'>
                    <p>Genres:</p>
                    <p>Thriller</p>
                    <p>Mystery</p>
                    <p>Fiction</p>
                    <p>Crime</p>
                </div>
                <hr></hr>
                <div className='flex flex-row gap-2'>
                    <p>Validation status:</p>
                    <Pending></Pending>
                    <p>Pending...</p>
                </div>
                <Button text="Edit"></Button>
            </div>
        </div>
    )
}

export default BookDetails;