import React, { useState, useEffect, useContext} from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from 'react-router-dom';
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios';
import { List } from 'lucide-react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { CartContext } from "@/components/shared/CartContext"
import { useNavigate } from 'react-router-dom';

const ProductDetails = () => {

const [description, setDescription] = useState('');
const [reviews, setReviews] = useState([]);
    

const handleChange = (event) => {
    setDescription(event.target.value);
};

useEffect(() => {
// ⬇ This calls my get request from the server
    getReview();
}, []);

const createReview = () => {
    let payload = {
        description: description,
        rating: 5,
        user: {
            userId: 1,
        },
        product: {
            productId: 2,
        },
    };
    axios.post('http://localhost:8080/api/review/create', payload).then((response) => {
        console.log(response.data);
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error creating review:', error);
    });
};
 
const deleteReview = (reviewId) => {
    axios.delete(`http://localhost:8080/api/review/delete?reviewID=${reviewId}`).then((response) => {
            console.log(response.message);
            window.location.reload();
            // Update the state to remove the deleted review
            //setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
        })
        .catch((error) => {
            console.error(`Error deleting review with ID ${reviewId}:`, error);
        });
};

function getReview() {
    axios.get('http://localhost:8080/api/review/get?productID=2').then((response) => {
        console.log(response.data)

        setReviews(response.data);
    })
    .catch((error) => {
        console.error(`Error getting reviews:`, error);
    })
}

const { productId } = useParams()

const [product, setProduct] = useState({})

useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/product/${productId}`);
        setProduct(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching the products:', error);
      }
    };

    fetchProduct();
  }, []);

  
let { user } = useContext(AuthContext)

const { addToCart } = useContext(CartContext);

const navigate = useNavigate();

function handleAddToCart(product) {
    if(user) {
      addToCart(product, 1)
      navigate('/cart')
    } else {
      let quantity = 1
      localStorage.setItem('pendingCartItem', JSON.stringify({ product, quantity }));
      navigate('/user_auth')
    }
  }

const products = [
    {
        id: 1,
        name: 'Mac Book',
        imageUrl: 'https://i5.walmartimages.com/asr/7fc4c11c-6d65-4240-b390-ab776fb82171.15567f6644e83dc7597c024523be4264.jpeg',
        price: '$999.99',
    },
    {
        id: 2,
        name: 'iPhone',
        imageUrl: 'https://th.bing.com/th/id/OIP.VVI4zwfN-uw7qvq8o_DY3wAAAA?rs=1&pid=ImgDetMain',
        price: '$499.99',
    },
    {
        id: 3,
        name: 'AirPods',
        imageUrl: 'https://cdn.macrumors.com/article-new/2019/10/airpodsprodesigncase.jpg?retina',
        price: '$199.99',
    },
    {
        id: 4,
        name: 'AirPods Max',
        imageUrl: 'https://th.bing.com/th/id/OIP.SOKCpzEwAjedh7QdXcvQ6AAAAA?rs=1&pid=ImgDetMain',
        price: '$999.99',
    },
    {
        id: 5,
        name: 'Desktop',
        imageUrl: 'https://i5.walmartimages.com/asr/e5577ed9-bbb3-405b-8ae2-7adab5ecd608_1.8554861ff8b294cc2b1038b59c950879.jpeg',
        price: '$499.99',
    },
    {
        id: 6,
        name: 'Headphones',
        imageUrl: 'https://via.placeholder.com/250',
        price: '$199.99',
    },
    {
        id: 7,
        name: 'Phone',
        imageUrl: 'https://via.placeholder.com/250',
        price: '$499.99',
    },
];

  return (
    <div className='w-full grid grid-cols-3 px-20'>
        <div className='col-span-2 flex flex-col items-center justify-center relative'>
            <Breadcrumb className="absolute top-3 left-0"> 
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink className='text-primary' href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbLink className='text-primary' href="/results">Results</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>{product?.productName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {product.imageUrl ?
            <img 
                src={product.imageUrl} 
                alt={'No picture'} 
                className="w-full h-96 object-contain my-4"
            /> :
            <div className="w-full h-96 object-contain my-4"></div>
            }
        </div>
        
        <div className='col-span-1 h-full flex flex-col pt-32'>
            <p className='text-primary'></p>
            <h1 className='text-2xl font-bold pb-2'>{product?.productName}</h1>
            <p className='pb-2 text-base font-semibold'>{product?.description}</p>
            <Button className='w-2/3 mt-12 flex items-center justify-center p-8 rounded-full text-lg' onClick = {() => handleAddToCart(product)} ><FontAwesomeIcon className='mr-2' icon={faCartShopping} />Add to Cart</Button>
        </div>
        <div className='col-span-3 w-full'>
            <h1 className='text-2xl font-semibold'>Recommended</h1>
            <div className='flex gap-2 p-4'>
            {products.map(product => (
                <Card key={product.id} className="w-[250px] h-60">
                <CardContent>
                    <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-24 object-contain my-4"
                    />
                    <p className='text-md font-medium'>{product.name}</p>
                    <p className='text-xl font-bold'>{product.price}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <NavLink  to="/product">
                    <Button className='w-full h-6'>Add to cart</Button>
                    </NavLink>
                </CardFooter>
                </Card>
            ))}
            </div>
        </div>
        <div className='col-span-3 w-full h-96'>
                <h1 className='text-2xl font-semibold'>Reviews</h1>
                <Textarea
                    placeholder="Type your message here."
                    value={description}
                    onChange={handleChange}
                />
                <Button onClick={createReview}>Submit Review</Button>
                {reviews.map((review) => (
                    <Card>
                        <CardHeader>
                            <CardTitle>{review.user?.userName}</CardTitle>
                            <CardDescription>Rating {review.rating}/5</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>{review.description}</p>
                        </CardContent>
                        <Button type="button" variant="destructive" onClick={() => deleteReview(review.id)}>Delete Review</Button>
                    </Card>
                ))}
        </div>
    </div>
    
    );
};

export default ProductDetails;



