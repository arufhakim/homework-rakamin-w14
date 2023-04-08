import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PrismaClient } from '@prisma/client';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
const prisma = new PrismaClient();

const BookEdit = ({ book }) => {
  const [input, setInput] = useState(book);

  const router = useRouter();
  const { bookId } = router.query;

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { title, author, publisher, year, pages } = input;

    const intYear = parseInt(year);
    const intPages = parseInt(pages);

    axios
      .put(
        `/api/book/${bookId}`,
        {
          title,
          author,
          publisher,
          year: intYear,
          pages: intPages,
        },
        {
          headers: { authorization: 'Bearer ' + Cookies.get('token') },
        }
      )
      .then(() => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Succesfully update book!',
          showConfirmButton: false,
          timer: 1500,
        });
        router.push('/');
      })
      .catch((error) => {
        console.log(error.message);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error.message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    setInput({
      title: '',
      author: '',
      publisher: '',
      year: 0,
      pages: 0,
    });
  };

  return (
    <>
      <Navbar />
      <div className="mx-10 mt-10 mb-12 basis-4/5">
        <p className="text-3xl text-center font-bold text-black mb-6 pb-6 border-b-4 border-[#FF4C29] w-48 mx-auto">
          Edit Book
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={input.title}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="author"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={input.author}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="publisher"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Publisher
            </label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={input.publisher}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="year"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={input.year}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="pages"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Pages
            </label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={input.pages}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="image"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled
            />
            <span className="text-xs text-red-700">
              Image column disabled on update
            </span>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BookEdit;

export const getServerSideProps = async (context) => {
  const { params } = context;
  const data = await prisma.book.findUnique({
    where: {
      id: parseInt(params.bookId),
    },
  });

  return {
    props: {
      book: data,
    },
  };
};
