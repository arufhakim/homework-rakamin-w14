import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { PrismaClient } from '@prisma/client';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
const prisma = new PrismaClient();

const Book = ({ book }) => {
  const router = useRouter();

  const handleDelete = async (event) => {
    const bookId = parseInt(event.target.value);

    axios
      .delete(`/api/book/${bookId}`, {
        headers: { authorization: 'Bearer ' + Cookies.get('token') },
      })
      .then(() => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Succesfully delete book!',
          showConfirmButton: false,
          timer: 1500,
        });
        router.push('/');
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error.message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <p className="text-3xl text-center font-bold text-black mt-10 mb-10 pb-6 border-b-4 border-[#FF4C29] w-56 mx-auto">
        Book Detail
      </p>
      <div
        id="card-detail"
        className="flex flex-col items-center p-5 mb-12 min-w-fit mx-auto bg-white rounded border shadow-md md:flex-row md:max-w-md hover:bg-gray-10"
      >
        <Image
          src={`/uploads/${book.image}`}
          alt="Book Image"
          className="object-cover w-100 h-96 max-w-md mr-4"
          width={240}
          height={100}
        />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="text-2xl font-bold tracking-tight text-indigo-900">
            {book.title}
          </h5>
          <p className="mb-4 text-sm text-[#FF4C29]">{book.author}</p>
          {/* <p className="mb-5 text-normal font-semibold text-gray-700">{book.pages}</p> */}
          <p className="text-sm text-gray-700">Publisher:</p>
          <p className="mb-3 text-sm text-gray-400 text-justify">
            {book.publisher}
          </p>
          <p className="text-sm text-gray-700">Year:</p>
          <p className="mb-3 text-sm text-gray-400 text-justify">{book.year}</p>
          <p className="text-sm text-gray-700">Pages:</p>
          <p className="mb-10 text-sm text-gray-400 text-justify">
            {book.pages}
          </p>
          {Cookies.get('token') && (
            <div>
              <Link href={`/books/${book.id}/edit`}>
                <button className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-yellow-400 rounded-md hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-400 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 mr-1">
                  Edit
                </button>
              </Link>
              <button
                value={book.id}
                onClick={handleDelete}
                className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-red-700 rounded-md hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Book;

export const getStaticPaths = async () => {
  return {
    paths: [
      {
        params: { bookId: '1' },
      },
    ],
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
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
    revalidate: 10,
  };
};
